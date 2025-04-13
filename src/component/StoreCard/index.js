import React, { useState, useEffect } from "react";
import Cookie from "js-cookie";
import "./index.css";

const StoreCards = () => {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [activeRatingStore, setActiveRatingStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");
  const [minRating, setMinRating] = useState(0);

  const token = Cookie.get("token"); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeRes = await fetch("https://roxiler-system-server-am3t.onrender.com/storeaveragerating", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!storeRes.ok) throw new Error("Failed to fetch store data");
        const storesData = await storeRes.json();
        setStores(storesData);

        const ratingRes = await fetch("https://roxiler-system-server-am3t.onrender.com/user/ratings", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!ratingRes.ok) throw new Error("Failed to fetch user ratings");
        const ratingsData = await ratingRes.json();

        const ratingsMap = {};
        ratingsData.forEach((entry) => {
          ratingsMap[entry.store_id] = entry.rating;
        });
        setUserRatings(ratingsMap);

        setLoading(false); 
      } catch (err) {
        setError(err.message); 
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleStarClick = (storeId, value) => {
    setUserRatings((prev) => ({
      ...prev,
      [storeId]: value,
    }));
  };

  const handleSubmitRating = async (storeId) => {
    const rating = userRatings[storeId];
    const storename = stores.find((store) => store.store_id === storeId)?.storename; 
    if (!rating) return alert("Please select a rating.");
    if (!storename) return alert("Store name not found.");

    try {
      const response = await fetch("https://roxiler-system-server-am3t.onrender.com/rate-store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ storeId, storename, rating }), 
      });

      const data = await response.json();
      alert(data.message);
      setActiveRatingStore(null); 

      const updatedRes = await fetch("https://roxiler-system-server-am3t.onrender.com/storeaveragerating", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedData = await updatedRes.json();
      setStores(updatedData);
    } catch (err) {
      alert("Failed to submit rating");
    }
  };

  const filteredStores = stores.filter((store) => {
    const name = store?.storename?.toLowerCase() || "";
    const address = store?.address?.toLowerCase() || "";
    const avg = Math.floor(store.average_rating || 0);

    return (
      name.includes(searchName.toLowerCase()) &&
      address.includes(searchAddress.toLowerCase()) &&
      avg >= minRating
    );
  });

  if (loading) return <p>Loading stores...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="store-cards-wrapper">
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by store name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by address"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
        />
        <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
          {[0, 1, 2, 3, 4, 5].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </div>

      <div className="store-cards">
        {filteredStores.map((store) => {
          const userRating = userRatings[store.store_id];

          return (
            <div className="store-card" key={store.store_id}>
              <img
                src={store.logo }
                alt={store.storename}
                className="store-image"
              />
              <div className="store-content">
                <h3>{store.storename}</h3>
                <p className="address">{store.address}</p>
                <p className="overall-rating">
                  {store.average_rating === null? " | No ratings yet" : `Avg ${store.average_rating.toFixed(1)}⭐ ` }
                  {userRating && (
                    <span className="user-rating"> | You: {userRating}⭐</span>
                  )}
                </p>
                <button className="rate-button" onClick={() => setActiveRatingStore(store.store_id)}>
                  Rate this Store
                </button>
              </div>

              {activeRatingStore === store.store_id && (
                <div className="rating-overlay">
                  <div className="rating-box">
                    <h4>Rate {store.storename}</h4>
                    <div className="star-input">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <span
                          key={val}
                          className={`star ${val <= (userRatings[store.store_id] || 0) ? "filled" : ""}`}
                          onClick={() => handleStarClick(store.store_id, val)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="rating-buttons">
                      <button onClick={() => handleSubmitRating(store.store_id)}>Submit</button>
                      <button onClick={() => setActiveRatingStore(null)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StoreCards;
