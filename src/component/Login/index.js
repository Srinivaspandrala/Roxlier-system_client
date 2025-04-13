import React, { useState } from "react";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./index.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      const response = await fetch("https://roxiler-system-server-am3t.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        Cookie.set("token", data.token);
        Cookie.set("username", data.user.name);

        if (data.user.role === "normaluser") {
          navigate("/storecards");
        } else if (data.user.role === "storeowner") {
          navigate("/dashboard");
        } else if (data.user.role === "systemadmin") {
          navigate("/dashboard");
        }
      } else {
        const errorData = await response.json();
        console.error("Login failed:", errorData);
        alert(errorData.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🏪 <span>Store<span className="highlight">Dash</span></span></h2>
        <form onSubmit={handleLogin}>
          <div className="input-group email-input-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="email-input"
            />
          </div>

          <div className="input-group password-input-group">
            <label>Password</label>
            <div className="password-input">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="password-input-field"
              />
              <span onClick={togglePasswordVisibility} className="password-toggle">
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>
          <div>
            <p
              className="create-account"
              onClick={() => navigate("/register")}
            >
              Create Account
            </p>
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
      <div className="code">
<p><strong>Admin Credentials:</strong></p>
      <p>Email: <code>admin@gmail.com</code></p>
      <p>Password: <code>admin123</code></p>

</div>

    </div>
  );
};

export default Login;
