import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../contexts/GameContext';
import '../styles/LeaderboardScreen.css';

const LeaderboardScreen = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { gameState } = useGameContext();
  
  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        // Sample leaderboard data
        const sampleData = [
          {
            id: 'user1',
            name: 'Alex',
            puzzlesSolved: 15,
            badges: [{type: 'alphabet', level: 'gold', name: 'Alphabet Champion', icon: '🏆'}]
          },
          {
            id: 'user2',
            name: 'Sam',
            puzzlesSolved: 12,
            badges: [{type: 'number', level: 'silver', name: 'Number Master', icon: '📊'}]
          },
          {
            id: 'user3',
            name: 'Jordan',
            puzzlesSolved: 8,
            badges: [{type: 'addition', level: 'bronze', name: 'Addition Explorer', icon: '➕'}]
          }
        ];
        
        // Add current player to leaderboard
        const currentPlayer = {
          id: 'current-player',
          name: gameState.playerName || 'You',
          puzzlesSolved: gameState.puzzlesSolved || 0,
          badges: []
        };
        
        // Add badges based on puzzles solved
        if (gameState.puzzlesSolved >= 5) {
          currentPlayer.badges.push({
            type: 'total', 
            level: 'gold', 
            name: 'Found Tilly!', 
            icon: '🐱'
          });
        }
        
        // Add current player to data
        sampleData.push(currentPlayer);
        
        // Sort by puzzles solved
        const sortedData = sampleData.sort((a, b) => b.puzzlesSolved - a.puzzlesSolved);
        
        setLeaderboardData(sortedData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    
    getLeaderboard();
  }, [gameState.playerName, gameState.puzzlesSolved]);
  
  const handleBackToGame = () => {
    navigate('/game');
  };
  
  if (loading) {
    return (
      <div className="leaderboard-screen">
        <h2>Top Explorers</h2>
        <div className="loading">Loading leaderboard...</div>
      </div>
    );
  }
  
  return (
    <div className="leaderboard-screen">
      <h2>Top Explorers</h2>
      
      {leaderboardData.length === 0 ? (
        <div className="no-data">No leaderboard data available yet. Be the first!</div>
      ) : (
        <div className="leaderboard-list">
          {leaderboardData.map((entry, index) => {
            const isCurrentPlayer = entry.name === (gameState.playerName || 'You') || entry.id === 'current-player';
            
            return (
              <div 
                key={index} 
                className={`leaderboard-entry ${isCurrentPlayer ? 'current-player' : ''}`}
              >
                <div className="rank">{index + 1}</div>
                <div className="player-name">
                  {entry.name} {isCurrentPlayer && <span className="you-indicator">(You)</span>}
                </div>
                <div className="puzzles-solved">{entry.puzzlesSolved} puzzles</div>
                <div className="badges">
                  {entry.badges && entry.badges.map((badge, i) => (
                    <div key={i} className={`badge ${badge.type}`} title={badge.name}>
                      {badge.icon}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <button 
        className="big-button"
        onClick={handleBackToGame}
      >
        Back to Game
      </button>
    </div>
  );
};

export default LeaderboardScreen;
