import React, { useState } from "react";

import api from "../../services/api";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus({ type: "idle", message: "" });
      await api.post("/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      setStatus({ type: "success", message: "Signup successful!" });
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Signup failed. Please try again later.";
      setStatus({ type: "error", message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "420px", margin: "0 auto", padding: "24px" }}>
      <h2>Create your account</h2>
      <p>Sign up to get started with the Stock Trading Platform.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Full name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          required
          style={{ width: "100%", marginBottom: "12px" }}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
          style={{ width: "100%", marginBottom: "12px" }}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          required
          style={{ width: "100%", marginBottom: "12px" }}
        />

        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
          style={{ width: "100%", marginBottom: "16px" }}
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Sign up"}
        </button>
      </form>

      {status.message && (
        <p
          style={{
            marginTop: "16px",
            color: status.type === "error" ? "#d32f2f" : "#2e7d32",
          }}
        >
          {status.message}
        </p>
      )}
    </div>
  );
}

export default Signup;
