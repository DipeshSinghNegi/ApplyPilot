document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["userData"], (result) => {
    if (result.userData) {
      const { fullName, email, phone, github, linkedin, company } = result.userData;
      document.getElementById("fullName").value = fullName || "";
      document.getElementById("email").value = email || "";
      document.getElementById("phone").value = phone || "";
      document.getElementById("github").value = github || "";
      document.getElementById("linkedin").value = linkedin || "";
      document.getElementById("company").value = company || "";
      document.getElementById("resume").value = resume || "";
    }
  });
});

// Prevent popup from closing when file input loses focus
document.getElementById("resumeFile").addEventListener("mousedown", (e) => {
  e.stopPropagation();
});




// === Save data (and send to backend) ===
document.getElementById("saveBtn").addEventListener("click", async () => {
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const github = document.getElementById("github").value;
  const linkedin = document.getElementById("linkedin").value;
  const fileInput = document.getElementById("resumeFile");
  const company = document.getElementById("company").value;

  const userData = { fullName, email, phone, github, linkedin ,company};

  chrome.storage.local.set({ userData }, async () => {
    console.log("Data saved to local storage");

    // Upload resume to backend (optional)
    if (fileInput.files.length > 0) {
      const formData = new FormData();
      formData.append("resume", fileInput.files[0]);
      formData.append("email", email); 

      try {
        await fetch("http://localhost:5001/api/profile/save", {
          method: "POST",
          body: formData,
        });
        console.log("Resume uploaded");
      } catch (err) {
        console.error("Resume upload failed", err);
      }
    }

    // Save profile to backend
   // Save profile + resume to backend
try {
  const formData = new FormData();
  formData.append("fullName", fullName);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("github", github);
  formData.append("linkedin", linkedin);
  formData.append("company", company);

  if (fileInput.files.length > 0) {
    formData.append("resume", fileInput.files[0]);
  }

  // Optional: log what's being sent
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  await fetch("http://localhost:5001/api/profile/save", {
    method: "POST",
    body: formData, 
  });

  alert("Data + resume saved to backend!");
} catch (err) {
  console.error("Backend save failed", err);
}

  });
});




// === Fill job form on active tab ===
document.getElementById("fillFormBtn").addEventListener("click", () => {
  chrome.storage.local.get("userData", (data) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: fillJobForm,
        args: [data.userData],
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("resume");

  fileInput.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent popup closure
  });

  fileInput.addEventListener("change", async () => {
    const selectedFile = fileInput.files[0];
    if (!selectedFile) return;

    console.log("File selected:", selectedFile.name);
  
  });
});

  document.addEventListener("DOMContentLoaded", () => {
  const dashboardBtn = document.getElementById("viewDashboardBtn");

  dashboardBtn?.addEventListener("click", () => {
    chrome.tabs.create({ url: "http://localhost:3000/" });
  });
});
// === Main Autofill Logic (runs in tab) ===
function fillJobForm(user) {
  const fieldMap = {
    "name": user.fullName,
    "first name": user.fullName?.split(" ")[0],
    "last name": user.fullName?.split(" ")[1],
    "email": user.email,
    "phone": user.phone,
    "github": user.github,
    "linkedin": user.linkedin,
    "company": user.company || "Unknown Company"
  };





  // Fill input fields
  document.querySelectorAll("input, textarea").forEach(input => {
    const label = (
      input.labels?.[0]?.innerText ||
      input.getAttribute("aria-label") ||
      input.placeholder ||
      input.name ||
      ""
    ).toLowerCase();

    for (const key in fieldMap) {
      if (label.includes(key) && fieldMap[key]) {
        input.value = fieldMap[key];
        input.dispatchEvent(new Event("input", { bubbles: true }));
        break;
      }
    }

    // Handle textareas (Windfall-specific)
    if (input.tagName === "TEXTAREA") {
      const question = input.closest("label")?.innerText?.toLowerCase() || label;
      if (question.includes("why are you interested")) {
        input.value = "I’m passionate about using data to drive impact. Windfall’s mission aligns perfectly with my interests.";
      } else if (question.includes("unexpected insight")) {
        input.value = "During a retention analysis, I discovered a surprising correlation between onboarding length and long-term engagement.";
      } else if (question.includes("tools") && question.includes("visualize")) {
        input.value = "I commonly use Python, SQL, and Tableau to analyze and present data.";
      } else if (question.includes("additional information")) {
        input.value = "Thank you for reviewing my application. I’m excited to bring my data skills to your team.";
      }
    }
  });

  // Fill textarea (Windfall custom questions and additional info)
  document.querySelectorAll("textarea").forEach(textarea => {
    let question = "";

    // Look up to 3 previous siblings for question text
    let prev = textarea.previousElementSibling;
    let tries = 0;
    while (prev && tries < 3 && !question) {
      if (prev.innerText && prev.innerText.trim().length > 0) {
        question = prev.innerText.trim().toLowerCase();
      }
      prev = prev.previousElementSibling;
      tries++;
    }

    // Also check parent node's previous sibling (for some Lever layouts)
    if (!question && textarea.parentElement && textarea.parentElement.previousElementSibling) {
      let parentPrev = textarea.parentElement.previousElementSibling;
      if (parentPrev.innerText && parentPrev.innerText.trim().length > 0) {
        question = parentPrev.innerText.trim().toLowerCase();
      }
    }

    // Now match and fill
    if (question.includes("why are you interested in joining windfall")) {
      textarea.value = "I'm excited about Windfall's mission to harness the power of accurate, high-quality data to drive better decision-making in the nonprofit and commercial sectors. I admire how Windfall helps organizations identify, understand, and engage high-value individuals using ethically sourced, real-time data. This alignment between data integrity and actionable insights reflects my own passion for using analytics to make a tangible impact. Joining Windfall would be an opportunity to work alongside a forward-thinking team that values innovation, precision, and meaningful outcomes.";
    } else if (question.includes("uncovered an unexpected insight")) {
      textarea.value = "While analyzing churn patterns at my previous company, I was tasked with finding behavioral trends among users who stopped using the platform after a free trial. Using SQL for initial cohort extraction and Python (Pandas and Seaborn) for analysis, I noticed that users who skipped onboarding emails had a significantly higher drop-off rate. This insight was unexpected because prior assumptions blamed pricing. After running a logistic regression, I found that onboarding email interaction was a stronger churn predictor than pricing tiers. Based on this, the product team revamped the onboarding flow and engagement increased by 23% in the next quarter.";
    } else if (question.includes("tools or techniques") && question.includes("analyze and visualize data")) {
      textarea.value = "My go-to tools include SQL for querying structured data, Python (especially Pandas, NumPy, Matplotlib, Seaborn) for advanced analysis, and Tableau or Power BI for interactive dashboards. In one project, I used SQL to extract customer purchase data over 12 months, then applied clustering techniques in Python to identify high-LTV customer segments. Using Tableau, I built a dashboard that highlighted regional behavior trends and helped marketing teams tailor campaigns by geography, boosting response rates by 30%.";
    } else if (question.includes("additional information")) {
      textarea.value = "Thank you for considering my application. I bring a mix of technical rigor, analytical thinking, and a deep interest in using data ethically to solve real-world problems. I’m particularly excited about Windfall’s commitment to precision and transparency in data science. I would love the opportunity to contribute to your team’s impact and growth.";
    }
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  });

  // Auto-click radio options (e.g., "4+ years")
  document.querySelectorAll("label").forEach(label => {
    if (label.innerText.toLowerCase().includes("4+ years")) {
      const input = label.querySelector("input[type='radio']");
      if (input) input.click();
    }
  });
}
