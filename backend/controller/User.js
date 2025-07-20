const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PDFParser = require("pdf2json");
const OpenAI = require("openai");
const User = require("../models/User");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ⬅️ Make sure this is in your .env file
});

// Handle signup
const AddUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
};

// Handle login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await user.checkPassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: "1d" });
    res.status(200).json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};


const addExtensionUserData = async (req, res) => {
  try {
    const { fullName, email, phone, github, linkedin } = req.body;
    const resume = req.file;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Update existing user
      existingUser.first_name = fullName?.split(" ")[0] || "";
      existingUser.last_name = fullName?.split(" ")[1] || "";
      existingUser.phone = phone || "";
      existingUser.urls = [
        { type: "github", url: github },
        { type: "linkedin", url: linkedin },
      ];
      if (resume) existingUser.resume = resume.path;

      await existingUser.save();
      return res.status(200).json({ message: "User updated" });
    }

    // New user creation
    const newUser = new User({
      first_name: fullName?.split(" ")[0] || "",
      last_name: fullName?.split(" ")[1] || "",
      email,
      phone,
      urls: [
        { type: "github", url: github },
        { type: "linkedin", url: linkedin },
      ],
      resume: resume ? resume.path : null,
      password: "default@123", 
    });

    await newUser.save();
    return res.status(201).json({ message: "New user saved" });
  } catch (err) {
    console.error("Extension data sync error:", err);
    return res.status(500).json({ error: "Failed to sync extension data" });
  }
};


// Get user details (for dashboard)
const getUserDetails = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.status(200).json({ user });
};

// Update user details
const updateUserDetails = async (req, res) => {
  try {
    // This assumes the user is already authenticated via middleware
    const updateData = {
      ...req.body,
      ...(req.file?.path && { resume: req.file.path }),
    };

    
    if (req.body.urls) {
      updateData.urls = req.body.urls.map((url) => JSON.parse(url));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,       
      updateData,
      { new: true }        
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Download resume
const getResume = async (req, res) => {
  const user = await User.findById(req.user._id);
  const resumePath = path.resolve(user.resume);

  if (!fs.existsSync(resumePath)) {
    return res.status(404).json({ error: "Resume not found" });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
  res.sendFile(resumePath);
};

// Generate OpenAI-based answer
const generateCustomAnswer = async (req, res) => {
  const { jobDescription, applicationQuestion } = req.body;

  if (!jobDescription || !applicationQuestion) {
    return res.status(400).json({ error: "Job description and question required" });
  }

  try {
    const user = await User.findById(req.user._id);
    const resumePath = path.resolve(user.resume);

    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", (errData) => {
      console.error("PDF parse error:", errData.parserError);
      return res.status(500).json({ error: "Failed to parse resume" });
    });

    pdfParser.on("pdfParser_dataReady", async (pdfData) => {
      const parsedResume = pdfParser.getRawTextContent();

      try {
        const messages = [
          {
            role: "user",
            content: `Use this resume: \n${parsedResume}\n\nJob Description:\n${jobDescription}\n\nQuestion:\n${applicationQuestion}\n\nGive a professional answer.`,
          },
        ];

        const aiResponse = await client.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages,
          temperature: 0.7,
        });

        const answer = aiResponse.choices[0].message.content.trim();
        return res.status(200).json({ answer });
      } catch (err) {
        console.error("OpenAI error:", err);
        return res.status(500).json({ error: "OpenAI response failed" });
      }
    });

    pdfParser.loadPDF(resumePath);
  } catch (error) {
    console.error("generateCustomAnswer error:", error);
    return res.status(500).json({ error: "Failed to generate answer" });
  }
};

module.exports = {
  AddUser,
  loginUser,
  getUserDetails,
  updateUserDetails,
  getResume,
  generateCustomAnswer,
};
