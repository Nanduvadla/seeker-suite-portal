import React, { useState, useEffect } from "react";
import { getJobs, createJob, toggleBookmark } from "../services/api";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title: "", company: "", location: "", description: "", skills: [] });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    getJobs().then(res => setJobs(res.data)).catch(err => console.error(err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const skillsArray = form.skills.split(",").map(s => s.trim());
    createJob({ ...form, skills: skillsArray })
      .then(res => { fetchJobs(); setForm({ title: "", company: "", location: "", description: "", skills: [] }); })
      .catch(err => console.error(err));
  };

  const handleBookmark = (id) => {
    toggleBookmark(id).then(() => fetchJobs()).catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Jobs</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="company" placeholder="Company" value={form.company} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} />
        <button type="submit">Add Job</button>
      </form>

      <ul>
        {jobs.map(job => (
          <li key={job.id}>
            {job.title} - {job.company} ({job.location})
            <button onClick={() => handleBookmark(job.id)}>
              {job.isBookmarked ? "Unbookmark" : "Bookmark"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Jobs;
