import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { faArrowLeft, faBuilding, faEnvelope, faStar, faStore } from '@fortawesome/free-solid-svg-icons';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = Cookies.get('token');
        const response = await fetch('https://roxiler-system-server-am3t.onrender.com/storeowner/stores', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stores');
        }

        const data = await response.json();
        setStores(data);
      } catch (err) {
        setError('Failed to fetch stores. Please try again later.');
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="store-list-container">
      <div className='button-group'>
      <button className="back-btn" onClick={() => navigate(-1)}><FontAwesomeIcon icon={faArrowLeft}/>Back</button>
      <button className="ratings-button" onClick={() => navigate('/mystorerating')}><FontAwesomeIcon icon={faStar}/>Ratings</button>
      </div>
      <h2>My Stores</h2>
      {error && <p className="error-message">{error}</p>}
      {!error && stores.length === 0 && <p>No stores found.</p>}
      {stores.length > 0 && (
        <table className="store-table">
          <thead>
            <tr>
              <th># ID</th>
              <th><FontAwesomeIcon icon={faStore}/> Store Name</th>
              <th><FontAwesomeIcon icon={faEnvelope}/> Email</th>
              <th><FontAwesomeIcon icon={faBuilding}/> Address</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id}>
                <td>{store.id}</td>
                <td>{store.storename}</td>
                <td>{store.email}</td>
                <td>{store.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Stores;