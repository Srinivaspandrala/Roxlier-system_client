import React, { useEffect, useState } from "react";
import "./index.css";
import { Link } from "react-router-dom";
import Cookie from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faStore, faStar } from "@fortawesome/free-solid-svg-icons";
import {jwtDecode} from "jwt-decode"; 

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = Cookie.get("token");

  useEffect(() => {
    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token); 
      setRole(decoded.role);
    } catch (err) {
      setError("Invalid token");
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch("https://roxiler-system-server-am3t.onrender.com/countuserandstore", {
          method: "GET",
          headers: {
            content: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }

        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  let statCards = [];

  if (role === "systemadmin") {
    statCards = [
      { title: "Users", value: stats.users, color: "#4CAF50", icon: faUsers },
      { title: "Stores", value: stats.stores, color: "#2196F3", icon: faStore },
      { title: "Ratings", value: stats.ratings, color: "#FF9800", icon: faStar },
    ];
  } else if (role === "storeowner") {
    statCards = [
      { title: "My Stores", value: stats.stores, color: "#2196F3", icon: faStore },
    ];
  }

  const quickLinks =
    role === "systemadmin"
      ? [
          { label: "View Users", path: "/userlist", color: "#4CAF50", icon: faUsers },
          { label: "View Stores", path: "/storelist", color: "#2196F3", icon: faStore },
          { label: "View Ratings", path: "/ratinglist", color: "#FF9800", icon: faStar },
        ]
      : [
          { label: "My Stores", path: "/mystores", color: "#2196F3", icon: faStore },
          { label: "View Ratings", path: "/mystorerating", color: "#FF9800", icon: faStar },
        ];

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard-container">
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div className="stat-card" key={index} style={{ borderColor: stat.color }}>
            <FontAwesomeIcon icon={stat.icon} style={{ color: stat.color, fontSize: "24px" }} />
            <h3>{stat.title}</h3>
            <p>{stat.value}</p>
          </div>
        ))}
      </div>

      <h2 className="quick-link-title">Quick Links</h2>
      <div className="quick-links">
        {quickLinks.map((link, index) => (
          <Link to={link.path} key={index} className="quick-link-card" style={{ borderLeftColor: link.color }}>
            <FontAwesomeIcon icon={link.icon} style={{ color: link.color, marginRight: "10px" }} />
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
