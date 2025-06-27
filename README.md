# Feedback System

A lightweight full-stack Feedback System built with **React.js** for the frontend and **FastAPI** for the backend. It supports authentication, role-based dashboards (manager and employee), feedback exchange, feedback history, anonymous feedback, and more.

---

## 🌐 Live Demo

🚀 [Deployed Link](#) (Replace with your Render deployment link once available)

---

## 📁 Project Structure


---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** FastAPI, SQLAlchemy, SQLite, JWT Auth
- **Auth:** Signup/Login with role-based redirect (Manager or Employee)
- **Deployment:** Docker + Render
- **Misc:** Axios, Heroicons, UUID, Enum for roles/sentiment

---

## 🔑 Features

### 👨‍💼 Managers
- View team feedbacks
- Edit/update past feedback
- Track sentiment trends

### 👩‍💻 Employees
- View personal feedback timeline
- Request feedback from managers
- Leave anonymous peer feedback

### 🌟 Shared
- Secure login (email or username)
- Role-based dashboards
- Tag-based feedback
- Commenting with markdown
- PDF export (planned)

---

## 🚀 Getting Started Locally

### 🐳 Backend (Dockerized)

cd backend
docker build -t feedback-backend .
docker run -p 8000:8000 feedback-backend

Runs at: http://localhost:8000 (Swagger UI available)

---

### 🖥️ Frontend

cd frontend
npm install
npm start

Runs at: http://localhost:3000

## 🔒 Authentication Notes
Signup requires username, email, password, and role (manager/employee)

Login accepts either username or email + password

## ✍️ Author
Developed as part of an internship application.

Solo project with both backend and frontend fully written from scratch.