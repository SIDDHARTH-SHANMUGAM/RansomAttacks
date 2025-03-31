import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [attacks, setAttacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    const fetchAttacks = async () => {
      try {
        const response = await axios.get('/server/Attacks/attacks');

        const attackData = Array.isArray(response.data?.data?.attacks)
          ? response.data.data.attacks
          : [];

        setAttacks(attackData);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        console.error('Error fetching attacks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttacks();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading ransomware attacks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Data</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Ransomware Attack Dashboard</h1>
      </header>

      <main className="attack-table-container">
        <table className="attack-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Attacker</th>
              <th>Victim</th>
              <th>Posted</th>
              <th>Deadline</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attacks.length > 0 ? (
              attacks.map((attack) => (
                <tr key={attack.attackId}>
                  <td>{attack.attackId}</td>
                  <td>{attack.attackerName}</td>
                  <td>{attack.victimName}</td>
                  <td>{formatDate(attack.postedDate)}</td>
                  <td className={
                    new Date(attack.deadLine) < new Date() ? 'expired' : ''
                  }>
                    {formatDate(attack.deadLine)}
                  </td>
                  <td className={
                    attack.status ? 'status-published' : 'status-pending'
                  }>
                    {attack.status ? 'Published' : 'Not Published'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  No ransomware attacks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </main>

      <footer className="app-footer">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </footer>
    </div>
  );
}

export default App;