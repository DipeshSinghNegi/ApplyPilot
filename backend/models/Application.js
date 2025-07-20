const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  phone: String,
  company: String,
  resume: String,
  appliedAt: { type: Date, default: Date.now },
  urls: [
    {
      type: { type: String },
      url: String,
    }
  ],
});

module.exports = mongoose.model("Application", ApplicationSchema);
