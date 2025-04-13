import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBuilding, faCog, faEnvelope, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import Cookie from "js-cookie";
import "./index.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "all",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = Cookie.get("token");
        const response = await fetch("https://roxiler-system-server-am3t.onrender.com/userlist", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      user.address.toLowerCase().includes(filters.address.toLowerCase()) &&
      (filters.role === "all" || user.role === filters.role)
    );
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="user-list-container">
      <h2>User List</h2>

      {/* Buttons */}
      <div className="button-group">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        <button className="add-store-button" onClick={() => navigate("/newuser")}>
          <FontAwesomeIcon icon={faPlus} /> Add User
        </button>
      </div>

      {/* Filters */}
      <div className="filters-grid">
        <input
          type="text"
          name="name"
          placeholder="Filter by name"
          value={filters.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="email"
          placeholder="Filter by email"
          value={filters.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Filter by address"
          value={filters.address}
          onChange={handleChange}
        />
        <select name="role" value={filters.role} onChange={handleChange}>
          <option value="all">All Roles</option>
          <option value="storeowner">Store Owner</option>
          <option value="normaluser">Normal User</option>
        </select>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th><FontAwesomeIcon icon={faUser}/> Name</th>
            <th><FontAwesomeIcon icon={faEnvelope}/> Email</th>
            <th><FontAwesomeIcon icon={faBuilding}/> Address</th>
            <th><FontAwesomeIcon icon={faCog}/> Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>{user.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>No users found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
