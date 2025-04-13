import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBuilding, faEnvelope, faPlus, faStar, faStore, faUser } from "@fortawesome/free-solid-svg-icons";
import Cookie from "js-cookie";
import "./index.css";

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    rating: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = Cookie.get("token");

  useEffect(() => {
    const fetchStoresWithRatings = async () => {
      try {
        const response = await fetch("https://roxiler-system-server-am3t.onrender.com/storeaveragerating", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch stores with ratings");
        }
        const data = await response.json();
        setStores(data); 
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStoresWithRatings();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredStores = stores.filter((store) => {
    const storename = store.storename ? store.storename.toLowerCase() : "";
    const email = store.email ? store.email.toLowerCase() : "";
    const address = store.address ? store.address.toLowerCase() : "";

    return (
      storename.includes(filters.name.toLowerCase()) &&
      email.includes(filters.email.toLowerCase()) &&
      address.includes(filters.address.toLowerCase()) &&
      (filters.rating === "" || store.average_rating >= parseFloat(filters.rating))
    );
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="store-list-page">
      <div className="store-list-container">
        <h2>Store List</h2>

        <div className="filters-grid">
          <input
            type="text"
            name="name"
            placeholder="Filter by Store Name"
            value={filters.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="email"
            placeholder="Filter by Owner Email"
            value={filters.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Filter by Address"
            value={filters.address}
            onChange={handleChange}
          />
          <input
            type="number"
            name="rating"
            placeholder="Filter by Minimum Rating"
            value={filters.rating}
            onChange={handleChange}
            min="0"
            max="5"
            step="0.1"
          />
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} /> Back
          </button>
          <button
            className="add-store-button"
            onClick={() => navigate("/newstore")}
          >
            <FontAwesomeIcon icon={faPlus} /> Add Store
          </button>
        </div>

        <table className="store-table">
          <thead>
            <tr>
              <th><FontAwesomeIcon icon={faStore}/> Store Owner</th>
              <th><FontAwesomeIcon icon={faUser}/> Store Name</th>
              <th><FontAwesomeIcon icon={faEnvelope}/> Owner Email</th>
              <th><FontAwesomeIcon icon={faBuilding}/> Address</th>
              <th><FontAwesomeIcon icon={faStar}/> Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.length > 0 ? (
              filteredStores.map((store, index) => (
                <tr key={index}>
                  <td>{store.storeowner}</td>
                  <td>{store.storename}</td>
                  <td>{store.email || "N/A"}</td>
                  <td>{store.address}</td>
                  <td>
                    {store.average_rating ? store.average_rating.toFixed(1) : "N/A"}{" "}
                    {store.average_rating && (
                      <FontAwesomeIcon icon={faStar} style={{ color: "#FFD700" }} />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No stores found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreList;
