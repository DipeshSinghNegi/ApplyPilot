const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    phone: String,
    github: String,
    linkedin: String,
    resume: String,
    company: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
