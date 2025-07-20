const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const connectDB = require("./db/connectDB");
const authMiddleware = require("./middleware/auth");
const session = require("express-session");
const profileRoutes = require("./routes/profile");
const app = express();
app.use("/api", require("./routes/profile"));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
// Serve uploads folder as static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    secret: 'my_super_secret_dev_key_123456789',
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/api/profile", profileRoutes);
const { API_KEY, PORT } = process.env;
const port = PORT || 5001;

app.use("/", require("./router/User"));
const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
};

startServer();
