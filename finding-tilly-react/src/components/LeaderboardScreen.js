import React, { useState, useEffect } from 'react';
import { mockDb } from '../services/mockFirebaseService';
import { formatDifficultyName } from '../services/gameService';
import '../styles/LeaderboardScreen.css';

const LeaderboardScreen = ({ currentUser, onReturn }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch leaderboard data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await mockDb.getLeaderboard();
        setLeaderboardData(data);
        setError('');
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    try {
      const date = timestamp instanceof Date 
        ? timestamp 
        : timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      
      return date.toLocaleDateString();
    } catch (err) {
      return 'N/A';
    }
  };

  return (
    <div className="leaderboard-screen">
      <div className="leaderboard-container">
        <h1>Finding Tilly Leaderboard</h1>
        
        {loading ? (
          <div className="loading">Loading leaderboard data...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="leaderboard-table-container">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Level</th>
                  <th>Puzzles</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.length > 0 ? (
                  leaderboardData.map((entry, index) => (
                    <tr 
                      key={entry.id} 
                      className={currentUser && entry.id === currentUser.uid ? 'current-user' : ''}
                    >
                      <td>{index + 1}</td>
                      <td>{entry.displayName}</td>
                      <td>{formatDifficultyName(entry.skillLevel)}</td>
                      <td>{entry.puzzlesSolved}</td>
                      <td>{formatDate(entry.lastPlayed)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">
                      No leaderboard data available yet. Be the first to play!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="leaderboard-buttons">
          <button className="primary-button" onClick={onReturn}>
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardScreen;
