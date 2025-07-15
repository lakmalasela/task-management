# 📝 Task Tracker App

A full-stack task management system built using **NestJS (Express)** for the backend and **Angular** for the frontend, with **PostgreSQL** as the database. Users can create, edit, delete, search tasks, and receive due date reminders. A calendar view displays upcoming and completed tasks.

---

## 🔧 Technologies Used

### 🚀 Backend
- [NestJS](https://nestjs.com/) with [Express](https://expressjs.com/)
- PostgreSQL
- TypeORM
- JWT Authentication
- RESTful API
- Class Validator (Input Validation)

### 🎨 Frontend
- Angular 19
- Bootstrap 5
- CSS
- Calendar integration (for task due & completed view)

---

## ✨ Features

- ✅ User registration & JWT-based login
- ✅ Create, edit, delete, and search tasks
- ✅ View tasks in a calendar (due & completed tasks)
- ✅ Input validation on forms
- ✅ Reminder notification: auto-triggered 1 day before due date
- ✅ Modular code architecture (NestJS Modules, Angular Components)
- ✅ PostgreSQL integration with visual DB tool support (e.g., DBeaver)

---

## 🗂 Project Structure

(Add your project structure details here)

---

## ⚙️ Prerequisites

- **Node.js v22.x**
- **PostgreSQL** installed and running
- **DBeaver** or another DBMS client (optional)
- **Angular CLI v19+**
- Git

---

## 🚀 Setup Instructions

### Backend Setup (NestJS + PostgreSQL)

1. Navigate to backend folder and install dependencies:
```bash
cd nest-backend
npm install
npm run start
```

### Frontend Setup (NestJS + PostgreSQL)

2. Navigate to frontend folder and install dependencies:
```bash
cd task-client
npm install
ng serve
```
- App will run at: http://localhost:4200

🗃 PostgreSQL Setup
1. Install PostgreSQL and create a database (e.g., task_db)
2. Configure your backend .env with the correct DB credentials
3. Use a DB tool like DBeaver to explore tables if needed

