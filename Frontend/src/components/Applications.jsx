import React, { useState, useEffect } from "react";
import { getApplications, createApplication } from "../services/api";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState({ userId: "", jobId: "", resume: "" });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = () => {
    getApplications().then(res => setApplications(res.data)).catch(err => console.error(err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createApplication(form).then(res => { fetchApplications(); setForm({ userId: "", jobId: "", resume: "" }); })
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Applications</h2>
      <form onSubmit={handleSubmit}>
        <input name="userId" placeholder="User ID" value={form.userId} onChange={handleChange} required />
        <input name="jobId" placeholder="Job ID" value={form.jobId} onChange={handleChange} required />
        <input name="resume" placeholder="Resume URL or text" value={form.resume} onChange={handleChange} required />
        <button type="submit">Apply</button>
      </form>

      <ul>
        {applications.map(app => (
          <li key={app.id}>User {app.userId} applied to Job {app.jobId} (Status: {app.status})</li>
        ))}
      </ul>
    </div>
  );
};

export default Applications;
