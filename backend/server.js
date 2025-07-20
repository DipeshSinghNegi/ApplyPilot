const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");
const mainUserRoutes = require('./router/User');     // from router/user.js
const profileRoutes = require('./routes/profile');   // from routes/profile.js
const tokenUserRoutes = require('./routes/user');    // from routes/user.js
const downloadRoutes = require("./routes/download");
app.use("/api", downloadRoutes);

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/applyease", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ✅ Mount all routes
app.use("/api", mainUserRoutes);           // POST /api/signup, /api/login, etc.
app.use("/api/profile", profileRoutes);    // POST /api/profile/save
app.use("/api/user", tokenUserRoutes); 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));    // GET /api/user

app.listen(5001, () => console.log("✅ Server running on http://localhost:5001"));
