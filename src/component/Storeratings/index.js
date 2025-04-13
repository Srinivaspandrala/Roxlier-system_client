import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowLeft, faBuilding, faStar, faStore } from "@fortawesome/free-solid-svg-icons";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./index.css";

const StoreRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookie.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch("https://roxiler-system-server-am3t.onrender.com/storeownerating", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch store ratings");
        }
        const data = await response.json();
        setRatings(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRatings();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="store-ratings-page">
              <div className='button-group'>

        <button className="back-btn" onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft}/>Back</button>
        <button className="mystore-btn" onClick={() => navigate('/mystores')}><FontAwesomeIcon icon={faStore}/>My store</button>
        </div>
      <h2>Store Ratings</h2>
      <table className="ratings-table">
        <thead>
          <tr>
            <th><FontAwesomeIcon icon={faStore}/> Store Name</th>
            <th><FontAwesomeIcon icon={faBuilding}/> Address</th>
            <th><FontAwesomeIcon icon={faStar}/> Rating</th>
          </tr>
        </thead>
        <tbody>
          {ratings.length > 0 ? (
            ratings.map((store, index) => (
              <tr key={index}>
                <td>{store.storename}</td>
                <td>{store.address}</td>
                <td>
                  {store.average_rating ? store.average_rating.toFixed(1) : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No ratings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StoreRatings;
