import React, { useState } from "react";
import { uploadResume } from "../api";

export default function ResumeUpload({ token }) {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const handleUpload = async e => {
    e.preventDefault();
    if (!file) return;
    const res = await uploadResume(file, token);
    setMsg(res.message || "Uploaded!");
  };

  return (
    <form onSubmit={handleUpload}>
  
      <input type="file" accept=".pdf" onChange={e=>setFile(e.target.files[0])} />
      <button type="submit">Upload</button>
      {msg && <div>{msg}</div>}
    </form>
  );
}