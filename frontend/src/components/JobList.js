import React, { useEffect, useState } from "react";
import "./JobList.css"; 

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("http://localhost:5001/api/profile/applied-jobs");
        const data = await res.json();
        if (data.success) setJobs(data.jobs);
      } catch (err) {
        console.error("❌ Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

 
  return (
    <div className="job-list-container">
      {loading ? (
        <p>Loading...</p>
      ) : jobs.length === 0 ? (
        <p>No applied jobs yet.</p>
      ) : (
        jobs.map((job, idx) => (
          <div className="job-card" key={idx}>
            <h2 className="company-name">{job.company || "Unknown Company"}</h2>
            <div className="job-info">
              <div><strong>Name:</strong> {job.first_name} {job.last_name}</div>
              <div><strong>Email:</strong> {job.email}</div>
         
              <div><strong>Resume:</strong> {job.resume ? <a href={`http://localhost:5001/${job.resume}`} target="_blank" rel="noreferrer">View</a> : "No resume"}</div>
              <div><strong>Applied:</strong> {new Date(job.appliedAt).toLocaleDateString()}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default JobList;
