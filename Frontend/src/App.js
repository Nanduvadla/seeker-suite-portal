import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:5000/api";

function App() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [newUser, setNewUser] = useState({ username: "", email: "", password: "" });
  const [newJob, setNewJob] = useState({ title: "", company: "", location: "", description: "" });
  const [newApp, setNewApp] = useState({ userId: "", jobId: "", status: "submitted" });

  // Fetch Users
  const fetchUsers = async () => {
    const res = await axios.get(`${API}/users/`);
    setUsers(res.data);
  };

  // Fetch Jobs
  const fetchJobs = async () => {
    const res = await axios.get(`${API}/jobs/`);
    setJobs(res.data);
  };

  // Fetch Applications
  const fetchApplications = async () => {
    const res = await axios.get(`${API}/applications/`);
    setApplications(res.data);
  };

  // On mount
  useEffect(() => {
    fetchUsers();
    fetchJobs();
    fetchApplications();
  }, []);

  // Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/users/`, newUser);
    setNewUser({ username: "", email: "", password: "" });
    fetchUsers();
  };

  // Create Job
  const handleCreateJob = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/jobs/`, newJob);
    setNewJob({ title: "", company: "", location: "", description: "" });
    fetchJobs();
  };

  // Create Application
  const handleCreateApp = async (e) => {
    e.preventDefault();
    await axios.post(`${API}/applications/`, newApp);
    setNewApp({ userId: "", jobId: "", status: "submitted" });
    fetchApplications();
  };

  // Helper: Get user + job names
  const getUserName = (userId) => {
    const u = users.find((usr) => usr.id === userId);
    return u ? u.username : userId; // fallback to ID
  };

  const getJobTitle = (jobId) => {
    const j = jobs.find((job) => job.id === jobId);
    return j ? j.title : jobId; // fallback to ID
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Job Portal</h1>

      {/* --- USERS --- */}
      <h2>Users</h2>
      <form onSubmit={handleCreateUser}>
        <input placeholder="username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
        <input placeholder="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
        <input placeholder="password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
        <button type="submit">Add User</button>
      </form>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.username} ({u.email})</li>
        ))}
      </ul>

      {/* --- JOBS --- */}
      <h2>Jobs</h2>
      <form onSubmit={handleCreateJob}>
        <input placeholder="title" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} />
        <input placeholder="company" value={newJob.company} onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} />
        <input placeholder="location" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} />
        <input placeholder="description" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} />
        <button type="submit">Add Job</button>
      </form>
      <ul>
        {jobs.map((j) => (
          <li key={j.id}>{j.title} – {j.company}</li>
        ))}
      </ul>

      {/* --- APPLICATIONS --- */}
      <h2>Applications</h2>
      <form onSubmit={handleCreateApp}>
        {/* Dropdown for Users */}
        <select value={newApp.userId} onChange={(e) => setNewApp({ ...newApp, userId: e.target.value })} required>
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.username} ({u.email})
            </option>
          ))}
        </select>

        {/* Dropdown for Jobs */}
        <select value={newApp.jobId} onChange={(e) => setNewApp({ ...newApp, jobId: e.target.value })} required>
          <option value="">Select Job</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title} – {j.company}
            </option>
          ))}
        </select>

        {/* Status */}
        <select value={newApp.status} onChange={(e) => setNewApp({ ...newApp, status: e.target.value })}>
          <option value="submitted">submitted</option>
          <option value="in_review">in_review</option>
          <option value="accepted">accepted</option>
          <option value="rejected">rejected</option>
        </select>

        <button type="submit">Add Application</button>
      </form>

      <ul>
        {applications.map((a) => (
          <li key={a.id}>
            User: <strong>{getUserName(a.userId)}</strong> → Job: <strong>{getJobTitle(a.jobId)}</strong> ({a.status})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
