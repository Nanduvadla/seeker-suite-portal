import React, { useState, useEffect } from "react";
import { getUsers, createUser } from "../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    getUsers()
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createUser(form)
      .then((res) => {
        fetchUsers();
        setForm({ username: "", email: "", password: "" });
        setMessage(`✅ User ${res.data.username} registered successfully!`);
      })
      .catch((err) => {
        console.error(err);
        setMessage("❌ Failed to register user");
      });
  };

  return (
    <div>
      <h2>Register New User</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>

      {message && <p>{message}</p>}

      <h3>Registered Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
