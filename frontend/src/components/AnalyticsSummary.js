import React, { useEffect, useState } from "react";
import "./AnalyticsSummary.css";

const AnalyticsSummary = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch("http://localhost:5001/api/profile/analytics");
        const data = await res.json();
        if (data.success) setSummary(data.data);
      } catch (err) {
        console.error("❌ Analytics fetch failed:", err);
      }
    }
    fetchAnalytics();
  }, []);

  if (!summary) return <p>Loading summary...</p>;

  return (
    <div className="dashboard-card wide">
      <h3>📊 Your Application Summary</h3>
      <ul className="analytics-list">
        <li><strong>Total Applied:</strong> {summary.totalJobs}</li>
        <li><strong>Unique Companies:</strong> {summary.uniqueCompanies}</li>
        <li><strong>Last Applied:</strong> {summary.lastApplied}</li>
      </ul>
    </div>
  );
};

export default AnalyticsSummary;
