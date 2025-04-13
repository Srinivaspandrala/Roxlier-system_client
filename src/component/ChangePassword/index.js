import React, { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookie from "js-cookie";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const Navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return setError("Please fill in all fields.");
    }

    if (newPassword !== confirmPassword) {
      return setError("New passwords do not match.");
    }

    if (newPassword.length < 6) {
      return setError("New password must be at least 6 characters.");
    }

    try {
      const token = Cookie.get("token");

      const response = await fetch("https://roxiler-system-server-am3t.onrender.com/changepassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
        setMessage("");
      } else {
        setMessage(data.message);
        setError("");
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setMessage("");
    }
  };

  return (
    <div>
      <div className="change-password-container">
      <button className="back-btn" onClick={() => Navigate(-1)}><FontAwesomeIcon icon={faArrowLeft}/>Back</button>
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit} className="change-password-form">
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={formData.currentPassword}
            onChange={handleChange}
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button type="submit">Update Password</button>
          {message && <p className="message success">{message}</p>}
          {error && <p className="message error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
