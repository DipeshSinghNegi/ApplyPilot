# 🚀 ApplyPilot — Job Application Autofill Chrome Extension

**ApplyPilot** is a Chrome extension + dashboard tool that helps job seekers auto-fill job applications with personal details, GitHub/LinkedIn links, resumes, and more — all stored securely and reusable across forms.

---

## 🧠 Features

Auto-Fill on Job Portals
Chrome Extension injects custom JavaScript into job forms (e.g., Lever, Greenhouse) and fills them with stored user data using DOM parsing and contextual matching.

📎 Resume Upload & Secure Storage
Upload resumes via the extension popup. Files are sent to a Node.js + Express backend and stored securely in the server (or optionally, in cloud storage like AWS/GCS).

🧠 Context-Aware AI Form Logic
Auto-detects form fields (e.g., "Why do you want this job?") and inserts smart, customizable text using labeled input and textarea detection — a foundation for GPT-powered enhancements.

🛠️ Full Backend API with MongoDB
Stores user profile, resume links, and application data in a MongoDB database using RESTful API endpoints:

POST /api/profile/save

GET /api/export
Backend is built with Express and uses Multer for file handling.

🧠 Persistent Local Storage
Uses Chrome’s storage.local to persist form data inside the browser, minimizing repeat input. This also syncs with backend on save.

📊  Dashboard for Tracking
A clean  frontend allows users to:

View submitted applications
See resume status
Export their data to CSV/PDF

🔄 Export All Data with One Click
On the dashboard, users can export all job application data to a downloadable file (CSV/PDF) via a backend endpoint.

🧩 Modular Architecture
Built in three decoupled parts:
extension/: Chrome autofill assistant
backend/: Express + MongoDB API
frontend/: React dashboard

🔒 Secure & Local-first
Minimal third-party tracking. Resume data and profile details are only stored locally or on your private server, not shared externally.

---






## 📸 Demo

### 🎥 Watch a quick walkthrough:
📽️ [Click to View](demo/ApplyPilot.mp4)






## 📦 Folder Structure
/applyPilot
  ├── backend/        → Express API for storing user data & resumes
  ├── frontend/       → React dashboard
  ├── extension/      → Chrome Extension files
  ├── demo/           → Video/screenshots (optional)



---

## 🛠 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/DipeshSinghNegi/ApplyPilot.git
cd ApplyPilot



#### 2. Setup Backend
cd backend
npm install
node index.js

##The backend will run on http://localhost:5001


##### 3. Setup Frontend
cd ../frontend
npm install
npm start

##The dashboard will run on http://localhost:3000


###4. Load Chrome Extension
Go to chrome://extensions

Enable Developer Mode (top right)

Click "Load Unpacked"

Select the extension/ folder

✅ Your extension should now appear in Chrome!

