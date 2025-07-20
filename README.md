# 🚀 ApplyPilot — Job Application Autofill Chrome Extension

**ApplyPilot** is a Chrome extension + dashboard tool that helps job seekers auto-fill job applications with personal details, GitHub/LinkedIn links, resumes, and more — all stored securely and reusable across forms.

---

## 🧠 Features

- 🔒 Store personal info locally (name, email, phone, GitHub, LinkedIn)
- 📄 Upload resume once, reuse everywhere
- ⚡ Autofills job forms ( Lever, Greenhouse, etc.)
- 📊 Dashboard with application history and analytics
- 📥 Download application data (PDF/CSV)
- 🧩 Built with Manifest v3 Chrome Extension + Vanilla JavaScript (little React) + Node.js + MongoDB

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

