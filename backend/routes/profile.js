const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Profile = require("../models/Profile");
const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");
const upload = require("../middleware/multerUpload"); 
const Application = require("../models/Application");


// Route to export applications as CSV
router.get("/export", async (req, res) => {
  try {
    const applications = await Application.find();

    if (!applications.length) {
      return res.status(404).send("No applications found to export.");
    }

    const fields = [
      "first_name",
      "last_name",
      "email",
      "phone",
      "company",
      "appliedAt",
      "resume",
      "urls.0.url", // github
      "urls.1.url", // linkedin
    ];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(applications);

    // Send as downloadable file
    res.setHeader("Content-Disposition", "attachment; filename=applications.csv");
    res.set("Content-Type", "text/csv");
    res.status(200).send(csv);
  } catch (err) {
    console.error("❌ Export error:", err);
    res.status(500).send("Failed to export data.");
  }
});

router.post("/save", upload.single("resume"), async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("File:", req.file);

    const { fullName, email, phone, github, linkedin, company } = req.body;

    if (!email || !fullName) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const nameParts = fullName.trim().split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "N/A";

    const applicationData = {
      first_name,
      last_name,
      email,
      phone,
      company: company || "Unknown",
      appliedAt: new Date(),
      urls: [
        { type: "github", url: github },
        { type: "linkedin", url: linkedin }
      ],
    };

    if (req.file) {
      applicationData.resume = req.file.path;
    }

    // Create new application (DO NOT update existing ones)
    const newApplication = new Application(applicationData);
    await newApplication.save();

    return res.status(200).json({ success: true, message: "Application saved", data: newApplication });
  } catch (err) {
    console.error("❌ Save error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


// Get all applied jobs (from Application model)
router.get("/applied-jobs", async (req, res) => {
  try {
    const applications = await Application.find().sort({ appliedAt: -1 });

    res.status(200).json({ success: true, jobs: applications });
  } catch (err) {
    console.error("❌ Fetch applied jobs error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// GET user profile
router.get("/last", async (req, res) => {
  try {
    const profile = await Profile.findOne().sort({ createdAt: -1 }); // latest
    if (!profile) return res.json({ success: true, profile: null });
    res.json({ success: true, profile });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
 

router.get("/analytics", async (req, res) => {
  try {
    const applications = await Application.find();

    const totalJobs = applications.length;
    const uniqueCompanies = new Set(applications.map(app => app.company)).size;
    const lastApplied = applications.reduce((latest, app) => {
      return !latest || new Date(app.appliedAt) > new Date(latest)
        ? app.appliedAt
        : latest;
    }, null);

    

    res.json({
      success: true,
      data: {
        totalJobs,
        uniqueCompanies,
        lastApplied: lastApplied ? new Date(lastApplied).toLocaleDateString() : "N/A",
        
      },
    });
  } catch (err) {
    console.error("❌ Analytics fetch error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



module.exports = router;
