import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Cookie from "js-cookie";
import "./index.css";

const Newuser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: ""
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const token = Cookie.get("token");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("https://roxiler-system-server-am3t.onrender.com/newuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add user");
      }

      const data = await response.json();
      setSuccess("User added successfully!");
      console.log("User added:", data.user);

      // Optionally reset the form
      setFormData({
        name: "",
        email: "",
        password: "",
        address: ""
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="user-form-container">
      <h2>New User Register</h2>

      <button className="back-btn" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Name</label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter address"
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="default">Select User Type</option>
              <option value="storeowner">Store Owner</option>
              <option value="normaluser">Normal User</option>
            </select>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Add User
        </button>
      </form>
    </div>
  );
};

export default Newuser;
