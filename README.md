# 🎓 Student-Teacher Booking Appointment System

A web-based appointment booking system designed for students and teachers to schedule, manage, and track appointments easily using Firebase backend services.

---

## 🚀 Project Overview

This system simplifies the appointment scheduling process between students and teachers by providing a secure and efficient platform accessible via web or mobile devices. Students can book appointments, send messages about their purpose, and teachers can manage these appointments and communicate accordingly.

---

## 🧩 System Modules

### 1. Admin
- Add, update, and delete teacher profiles (Name, Department, Subject, etc.)
- Approve student registrations

### 2. Teacher
- Login securely via Firebase Authentication
- Schedule available appointment slots
- Approve or cancel student appointments
- View messages from students
- View all appointments booked
- Logout

### 3. Student
- Register and login
- Search for teachers by department or subject
- Book appointments with teachers
- Send messages with appointment requests

---

## 🛠️ Technologies Used

| Layer       | Technology           |
|-------------|---------------------|
| Frontend    | HTML, CSS, JavaScript |
| Backend     | Firebase Firestore    |
| Authentication | Firebase Authentication |
| Hosting     | Firebase Hosting      |

---

## 📁 Firestore Database Structure (Example)

### Collections and Key Fields:

- `teachers`:  
  - `name`, `department`, `subject`, `email`, etc.

- `students`:  
  - `name`, `email`, `approved` (boolean)

- `appointments`:  
  - `studentId`, `teacherId`, `appointmentTime`, `status` (pending/approved/canceled), `message`

---

## 🔒 Authentication & Security

- Separate login for Admin, Teachers, and Students using Firebase Authentication.
- Firestore security rules ensure data access is role-based and secure.

---

## 🔍 Features Overview

- Admin dashboard to manage teachers and student approvals.
- Teachers manage appointment slots and approve/cancel appointments.
- Students can search teachers, book appointments, and send messages.
- Real-time updates on appointment status.
- Logging of key actions for traceability.

---

## 🧪 Testing

| Feature                   | Tested On | Status |
|---------------------------|-----------|--------|
| User Authentication       | Chrome    | ✅ Pass |
| Admin Teacher Management  | Chrome    | ✅ Pass |
| Student Registration      | Chrome    | ✅ Pass |
| Appointment Booking       | Chrome    | ✅ Pass |
| Notifications and Messaging | Chrome  | ✅ Pass |

---

## 🚀 Deployment Instructions

1. Install Firebase CLI  
   ```bash
   npm install -g firebase-tools

