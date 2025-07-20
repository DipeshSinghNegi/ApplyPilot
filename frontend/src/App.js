import "./App.css";
import JobList from "./components/JobList";

import { useEffect, useState } from "react";
import AnalyticsSummary from "./components/AnalyticsSummary";


function App() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/profile/last");
        const data = await res.json();
        if (data.success) {
          setUserName(data.profile.fullName || "User");
        }
      } catch (err) {
        console.error("❌ Error loading profile:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="hello">
      <div className="dashboard-template-root">

        
        
       <main className="dashboard-main-content">
        <aside className="dashboard-sidebar" />
  <div className="dashboard-main-box">
    <div className="dashboard-header-row">
      <div>
        <h1>
          Hello, {userName ? userName : "User"} 👋
        </h1>
        <p className="pp">Welcome to your ApplyPilot Dashboard!</p>
      </div>
    </div>

    <div className="dashboard-two-col">
      {/* LEFT COLUMN: Applied Jobs */}
      <div className="dashboard-left-col">
        <div className="dashboard-card applied-jobs-card">
          <h3>Applied Jobs</h3>
          <JobList token={null} />
        </div>
      </div>

      {/* RIGHT COLUMN: Analytics + Upload */}
      <div className="dashboard-right-col">
        <div className="dashboard-card">
          <AnalyticsSummary />
        </div>

        <div className="dashboard-card small-upload-card">
          <h3>Download  Data</h3>
         
           <button
    onClick={() => window.open("http://localhost:5001/api/export", "_blank")}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    📥 Download
  </button>
        </div>
          {/* Apply Now Button */}
  <button
    onClick={() => window.open("https://careers.google.com/jobs/results/", "_blank")}  
    className="bg-green-600 text-white px-4 py-2 ml-20 rounded hover:bg-green-700"
  >
    🚀 Similar Jobs
  </button>
      </div>
    </div>
  </div>
</main>

      </div>
    </div>
  );
}

export default App;
