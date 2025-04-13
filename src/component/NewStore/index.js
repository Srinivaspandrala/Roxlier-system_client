import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import "./index.css";

const Newstore = () => {
  const [formData, setFormData] = useState({
    storeowner: "",
    storename: "",
    address: "",
    email: "",
    logo: "",
  });

  console.log(formData);

  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwners = async () => {
      const token = Cookie.get("token");
      try {
        const response = await fetch("https://roxiler-system-server-am3t.onrender.com/owners", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch owners");
        const data = await response.json();
        setOwners(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOwners();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "storeowner") {
      const selected = owners.find((o) => o.name === value);
      if (selected) {
        setFormData({
          ...formData,
          storeowner: selected.name, 
          email: selected.email,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookie.get("token");

    if (!token) return alert("Please log in.");

    if (!isValidUrl(formData.logo)) {
      return alert("Invalid logo URL.");
    }

    try {
      const response = await fetch("https://roxiler-system-server-am3t.onrender.com/newstore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      alert("Store created successfully!");
      navigate("/storelist");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="store-form-container">
      <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
      <h2>Create Store</h2>
      <form onSubmit={handleSubmit} className="store-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Store Owner</label>
            <select
              name="storeowner"
              value={formData.storeowner}
              onChange={handleChange}
              required
            >
              <option value="">Select Store Owner</option>
              {owners.map((owner) => (
                <option key={owner.name} value={owner.name}>
                  {owner.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              readOnly
              required
            />
          </div>

          <div className="form-group">
            <label>Store Name</label>
            <input
              name="storename"
              value={formData.storename}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Logo URL</label>
            <input
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">Add Store</button>
      </form>
    </div>
  );
};

export default Newstore;
