const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");

const urlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

const eeoSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "Please enter your first name"],
  },
  last_name: {
    type: String,
    required: [true, "Please enter your last name"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
  },
  password: String,
  phone: {
    type: String,
  },
  location: {
    type: String,
  },
  resume: {
    type: String,
  },
  company: { type: String },
appliedAt: { type: Date },

  urls: [urlSchema],
  eeo: [eeoSchema],
  token: {
    type: String, 
  },
});


// Hash password before saving the user
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare raw password with hashed one
UserSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate auth token
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: "user",
      name: this.first_name, 
    },
    process.env.JWT_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

module.exports = mongoose.model("user", UserSchema);
