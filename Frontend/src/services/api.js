import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

export const getJobs = () => axios.get(`${API_URL}/api/jobs/`);
export const createJob = (jobData) => axios.post(`${API_URL}/api/jobs/`, jobData);
export const toggleBookmark = (jobId) => axios.put(`${API_URL}/api/jobs/${jobId}/bookmark`);

export const getUsers = () => axios.get(`${API_URL}/api/users/`);
export const createUser = (userData) => axios.post(`${API_URL}/api/users/`, userData);

export const getApplications = () => axios.get(`${API_URL}/api/applications/`);
export const createApplication = (appData) => axios.post(`${API_URL}/api/applications/`, appData);
