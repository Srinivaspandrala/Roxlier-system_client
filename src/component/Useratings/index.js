import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import "./index.css";

const UserRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = Cookie.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRatings = async () => {
      try {
        const response = await fetch("https://roxiler-system-server-am3t.onrender.com/storeratings", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            content:"application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user ratings");
        }
        const data = await response.json();
        setRatings(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserRatings();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="user-ratings-page">
        <button className="back-btn" onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft} />Back</button>
      <h2>Users Ratings</h2>
      <table className="ratings-table">
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Name</th>
            <th>Your Rating</th>
          </tr>
        </thead>
        <tbody>
          {ratings.length > 0 ? (
            ratings.map((rating, index) => (
              <tr key={index}>
                <td>{rating.storename}</td>
                <td>{rating.username}</td>
                <td>
                  {rating.rating}{" "}
                  <FontAwesomeIcon icon={faStar} style={{ color: "#FFD700" }} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                No ratings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserRatings;