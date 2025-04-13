import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./index.css";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const userData = {
      name: fullname,
      email,
      password,
      address, 
    };

    try {
      const response = await fetch("https://roxiler-system-server-am3t.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful:", data);
        alert("Registration successful!");
        navigate("/"); 
      } else {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);
        alert(errorData.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
      <h2>🏪 <span>Store<span className="highlight">Dash</span></span></h2>
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Name</label>
            <input
              type="text"
              required
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <span onClick={togglePasswordVisibility}>
                {showPassword ? <FontAwesomeIcon icon="eye" />: <FontAwesomeIcon icon="eye-slash" />}
              </span>
            </div>
          </div>

          <div className="input-group">
            <label>Address</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
            />
          </div>

          <button type="submit" className="register-btn">Register</button>
        </form>
        <p
          className="already-account"
          onClick={() => navigate("/")} // Navigate to login page
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
};

export default Register;
