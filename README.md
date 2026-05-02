# 🚀 Project Camp Backend

A scalable and secure REST API for managing projects, teams, and tasks with role-based access control and real-world backend architecture.

---

## ✨ Key Features

* 🔐 JWT Authentication (Access + Refresh Tokens)
* 👥 Role-Based Access Control (Admin, Project Admin, Member)
* 📁 Project Management (CRUD operations)
* ✅ Task & Subtask Management
* 📝 Notes System for collaboration
* 📂 File Uploads with validation (Multer)
* 🔒 Secure Password Reset & Email Verification

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT
* **File Handling:** Multer
* **Other:** CORS, Middleware, REST API Architecture

---

## 📡 API Documentation

👉 Detailed API routes and usage: **[View API Docs](./docs/API.md)**

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Project-Management-Platform.git
cd project-management-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

Create a `.env` file and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
```

### 4. Run the server

```bash
npm run dev
```

---

## 🔒 Security Highlights

* JWT-based authentication
* Role-based authorization
* Email verification system
* Secure password reset flow
* Input validation & file protection

---

## 📈 Future Improvements

* 🔔 Real-time notifications (WebSockets)
* 📊 Project analytics dashboard
* 🧾 Activity logs
* 🔗 Third-party integrations

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

---

## 📬 Contact

GitHub: https://github.com/nanduholkar

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!
