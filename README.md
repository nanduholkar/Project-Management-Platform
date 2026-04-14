# My Project

# 🚀 Project Camp Backend

A powerful and scalable **RESTful API** for managing projects, teams, tasks, and collaboration efficiently.

---

## 📌 Overview

**Project Camp Backend** is designed to support collaborative project management with secure authentication, role-based access, and structured task handling.

It enables teams to:

- Organize projects
- Assign tasks & subtasks
- Manage team members
- Maintain project notes
- Attach files to tasks

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (Access + Refresh Tokens)
- **File Uploads:** Multer
- **Other:** CORS, Middleware, REST API Architecture

---

## 🔐 Key Features

### 👤 Authentication & Authorization

- User Registration & Login
- Email Verification
- JWT-based Authentication
- Password Reset / Change
- Role-Based Access Control

---

### 📁 Project Management

- Create, update, delete projects
- View project details
- Manage project lifecycle

---

### 👥 Team Management

- Add/remove members
- Assign roles (Admin, Project Admin, Member)
- Role-based permissions

---

### ✅ Task Management

- Create & assign tasks
- Update task status (Todo → In Progress → Done)
- Attach files to tasks
- Track progress

---

### 🔹 Subtasks

- Create subtasks under tasks
- Mark completion
- Manage subtask lifecycle

---

### 📝 Notes

- Add and manage project notes
- Admin-controlled access

---

### ❤️ Health Check

- API status endpoint for monitoring

---

## 📡 API Structure

### Auth Routes

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/current-user
POST   /api/v1/auth/change-password
POST   /api/v1/auth/refresh-token
GET    /api/v1/auth/verify-email/:token
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password/:token
```

---

### Project Routes

```
GET    /api/v1/projects/
POST   /api/v1/projects/
GET    /api/v1/projects/:projectId
PUT    /api/v1/projects/:projectId
DELETE /api/v1/projects/:projectId
```

---

### Task Routes

```
GET    /api/v1/tasks/:projectId
POST   /api/v1/tasks/:projectId
GET    /api/v1/tasks/:projectId/t/:taskId
PUT    /api/v1/tasks/:projectId/t/:taskId
DELETE /api/v1/tasks/:projectId/t/:taskId
```

---

### Notes Routes

```
GET    /api/v1/notes/:projectId
POST   /api/v1/notes/:projectId
GET    /api/v1/notes/:projectId/n/:noteId
PUT    /api/v1/notes/:projectId/n/:noteId
DELETE /api/v1/notes/:projectId/n/:noteId
```

---

## 🔑 Roles & Permissions

| Role          | Access Level  |
| ------------- | ------------- |
| Admin         | Full control  |
| Project Admin | Manage tasks  |
| Member        | View & update |

---

## 🔒 Security Features

- JWT Authentication
- Role-based Authorization
- Email Verification
- Secure Password Reset
- Input Validation
- File Upload Protection

---

## 📂 File Handling

- Multiple file uploads per task
- Stored securely with metadata
- MIME type & size validation

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Project-Management-Platform.git
cd project-management-platform
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Setup environment variables

Create a `.env` file and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
```

---

### 4. Run the server

```bash
npm run dev
```

---

## 📊 Future Enhancements

- Real-time notifications (WebSockets)
- Activity logs
- Project analytics dashboard
- Integration with third-party tools

---

## 🤝 Contribution

Contributions are welcome! Feel free to fork and submit pull requests.

---

## 📧 Contact

For any queries or collaboration:

- GitHub: https://github.com/nanduholkar

---

## ⭐ Show your support

If you like this project, give it a ⭐ on GitHub!
