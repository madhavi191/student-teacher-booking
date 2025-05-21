import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  push,
  get,
  query,
  orderByChild,
  equalTo,
  onValue,
  update
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// ——————————————————————————
// INIT FIREBASE
// ——————————————————————————
const firebaseConfig = {
  apiKey: "AIzaSyD2FzA8EyDfkG1qeJLr-VJhRflI4hg3q_g",
  authDomain: "student-teacher-booking-b03ba.firebaseapp.com",
  projectId: "student-teacher-booking-b03ba",
  storageBucket: "student-teacher-booking-b03ba.firebasestorage.app",
  messagingSenderId: "385537922916",
  appId: "1:385537922916:web:f510881dc76d97f08f4c71",
  measurementId: "G-8T9B4KPBZ9"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// ——————————————————————————
// CACHE DOM NODES
// ——————————————————————————
const addTeacherForm     = document.getElementById('addTeacherForm');
const studentApprovalList= document.getElementById('studentApprovalList');
const teacherAppointments= document.getElementById('teacherAppointments');
const teacherMessages    = document.getElementById('teacherMessages');
const searchResults      = document.getElementById('searchResults');
const bookAppointmentForm= document.getElementById('bookAppointmentForm');
const studentAppointments= document.getElementById('studentAppointments');

// ——————————————————————————
// ADMIN: Add Teacher
// ——————————————————————————
addTeacherForm.addEventListener('submit', async e => {
  e.preventDefault();
  const name    = teacherName.value.trim();
  const dept    = teacherDept.value.trim();
  const subject = teacherSubject.value.trim();
  const email   = teacherEmail.value.trim();

  try {
    // push generates a new key
    const newRef = push(ref(db, 'teachers'));
    await set(newRef, { id: newRef.key, name, department: dept, subject, email });
    alert('Teacher added!');
    addTeacherForm.reset();
  } catch(err) {
    alert('Error adding teacher: ' + err.message);
  }
});

// ——————————————————————————
// STUDENT: Search Teachers
// ——————————————————————————
export async function searchTeacher() {
  const term = searchBox.value.trim().toLowerCase();
  searchResults.innerHTML = 'Searching…';


  const snap = await get(ref(db, 'teachers'));
  searchResults.innerHTML = '';
  if (!snap.exists()) return searchResults.textContent = 'No teachers found';

  Object.values(snap.val())
    .filter(t =>
      t.name.toLowerCase().includes(term) ||
      t.subject.toLowerCase().includes(term)
    )
    .forEach(t => {
      const div = document.createElement('div');
      div.className = 'list-item';
      div.innerHTML = `
        <div>
          <strong>${t.name}</strong> (${t.subject})<br>
          Dept: ${t.department}<br>
          ID: ${t.id}
        </div>
        <button class="btn" onclick="document.getElementById('appointmentTeacherId').value='${t.id}'">
          Select
        </button>`;
      searchResults.appendChild(div);
    });

  if (searchResults.innerHTML === '') {
    searchResults.textContent = 'No matches.';
  }
}
window.searchTeacher = searchTeacher;  // expose to HTML

// ——————————————————————————
// STUDENT: Book Appointment
// ——————————————————————————
bookAppointmentForm.addEventListener('submit', async e => {
  e.preventDefault();
  const teacherId = appointmentTeacherId.value.trim();
  const date      = appointmentDate.value;
  const time      = appointmentTime.value;
  const message   = appointmentMessage.value.trim();
  const studentId = auth.currentUser.uid;

  try {
    const newRef = push(ref(db, 'appointments'));
    await set(newRef, {
      id: newRef.key,
      teacherId,
      studentId,
      date,
      time,
      message,
      status: 'pending'
    });
    alert('Appointment requested!');
    bookAppointmentForm.reset();
    loadStudentAppointments(studentId);
  } catch(err) {
    alert('Error booking: ' + err.message);
  }
});

// ——————————————————————————
// STUDENT: View Own Appointments
// ——————————————————————————
async function loadStudentAppointments(uid) {
  studentAppointments.innerHTML = 'Loading…';
  const q = query(ref(db, 'appointments'), orderByChild('studentId'), equalTo(uid));
  const snap = await get(q);
  studentAppointments.innerHTML = '';
  if (!snap.exists()) return studentAppointments.textContent = 'No appointments';

  Object.values(snap.val()).forEach(app => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `
      <div>
        With Teacher ID: <strong>${app.teacherId}</strong><br>
        On ${app.date} at ${app.time}<br>
        Status: <em>${app.status}</em><br>
        "${app.message}"
      </div>`;
    studentAppointments.appendChild(div);
  });
}

// ——————————————————————————
// TEACHER: View & Manage Appointments
// ——————————————————————————
async function loadTeacherAppointments(uid) {
  teacherAppointments.innerHTML = 'Loading…';
  const q = query(ref(db, 'appointments'), orderByChild('teacherId'), equalTo(uid));
  const snap = await get(q);
  teacherAppointments.innerHTML = '';
  if (!snap.exists()) return teacherAppointments.textContent = 'No appointments';

  Object.values(snap.val()).forEach(app => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.innerHTML = `
      <div>
        Student ID: <strong>${app.studentId}</strong><br>
        ${app.date} @ ${app.time}<br>
        "${app.message}"
      </div>
      <div>
        <button onclick="updateAppointmentStatus('${app.id}','approved')" class="approve-btn">Approve</button>
        <button onclick="updateAppointmentStatus('${app.id}','cancelled')" class="reject-btn">Cancel</button>
      </div>`;
    teacherAppointments.appendChild(div);
  });
}

// ——————————————————————————
// TEACHER: View Messages
// (Optional: if you store messages separately)
// ——————————————————————————
async function loadTeacherMessages(uid) {
  teacherMessages.innerHTML = 'Loading…';
  const snap = await get(ref(db, `messages/${uid}`));
  teacherMessages.innerHTML = '';
  if (!snap.exists()) return teacherMessages.textContent = 'No messages';

  Object.values(snap.val()).forEach(msg => {
    const div = document.createElement('div');
    div.className = 'list-item';
    div.textContent = `[${new Date(msg.timestamp).toLocaleString()}] ${msg.from}: ${msg.content}`;
    teacherMessages.appendChild(div);
  });
}

// ——————————————————————————
// UPDATE APPOINTMENT STATUS
// ——————————————————————————
window.updateAppointmentStatus = async function(id, status) {
  try {
    await update(ref(db, `appointments/${id}`), { status });
    loadTeacherAppointments(auth.currentUser.uid);
  } catch(err) {
    alert('Error updating: ' + err.message);
  }
};

// ——————————————————————————
// HOOK INTO DASHBOARD VISIBILITY
// ——————————————————————————

// Called after successful login for student:
window.showStudentDashboard = function(uid) {
  showSection('studentDashboard');
  loadStudentAppointments(uid);
};

// Called after successful login for teacher:
window.showTeacherDashboard = function(uid) {
  showSection('teacherDashboard');
  loadTeacherAppointments(uid);
  loadTeacherMessages(uid);
};

// Show admin dashboard (already existing):
window.showAdminDashboard = function() {
  showSection('adminDashboard');
  loadStudentsForApproval(); // from your existing code
};
