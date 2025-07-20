const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const Application = require("../models/Application");

router.get("/download/pdf", async (req, res) => {
  try {
    const applications = await Application.find().sort({ appliedAt: -1 });

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, "../exports/job_report.pdf");

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(18).text("Job Applications Report", { align: "center" });
    doc.moveDown();

    applications.forEach(app => {
      doc.fontSize(12).text(`Name: ${app.first_name} ${app.last_name}`);
      doc.text(`Email: ${app.email}`);
      doc.text(`Company: ${app.company}`);
      doc.text(`Applied: ${new Date(app.appliedAt).toLocaleDateString()}`);
      doc.text(`GitHub: ${app.urls.find(u => u.type === "github")?.url || "N/A"}`);
      doc.text(`LinkedIn: ${app.urls.find(u => u.type === "linkedin")?.url || "N/A"}`);
      doc.moveDown();
    });

    doc.end();

    doc.on("finish", () => {
      res.download(filePath, "job_applications_report.pdf", () => {
        fs.unlinkSync(filePath); 
      });
    });

  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ success: false, message: "Could not generate PDF" });
  }
});

router.get("/", async (req, res) => {
  try {
    const applications = await Application.find().sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// Download all application data + analytics as a JSON file
router.get("/export", async (req, res) => {
  try {
    const applications = await Application.find();
    
    const totalJobs = applications.length;
    const uniqueCompanies = new Set(applications.map(app => app.company)).size;
    const lastApplied = applications.reduce((latest, app) => {
      return !latest || new Date(app.appliedAt) > new Date(latest)
        ? app.appliedAt
        : latest;
    }, null);

    const analytics = {
      totalJobs,
      uniqueCompanies,
      lastApplied: lastApplied ? new Date(lastApplied).toISOString() : "N/A",
    };

    const data = {
      analytics,
      applications,
    };

    // Set headers to trigger file download
    res.setHeader("Content-Disposition", "attachment; filename=job_data.json");
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("❌ Export error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
