import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../contexts/GameContext';
import '../styles/WelcomeScreen.css';

const WelcomeScreen = () => {
  const [playerName, setPlayerName] = useState('');
  const [skillLevel, setSkillLevel] = useState('adventurer');
  const [error, setError] = useState('');
  const { updateGameState } = useGameContext();
  const navigate = useNavigate();
  
  const handleStartGame = (e) => {
    e.preventDefault();
    
    if (!playerName.trim()) {
      setError('Please enter your name to start the game');
      return;
    }
    
    // Update game state with player info
    updateGameState({
      playerName: playerName.trim(),
      skillLevel,
      gameStarted: true,
      gameStartTime: Date.now()
    });
    
    // Navigate to game screen
    navigate('/game');
  };
  
  return (
    <div className="welcome-screen">
      <h1 className="game-title">Finding Tilly</h1>
      <div className="welcome-content">
        <div className="welcome-message">
          <p>Oh no! Tilly the cat is hiding somewhere in the house.</p>
          <p>Can you help find her by solving fun puzzles?</p>
        </div>
        
        <form className="start-form" onSubmit={handleStartGame}>
          <div className="form-group">
            <label htmlFor="playerName">What's your name?</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="name-input"
            />
            {error && <div className="error-message">{error}</div>}
          </div>
          
          <div className="form-group">
            <label>Choose your skill level:</label>
            <div className="skill-options">
              <button
                type="button"
                className={`skill-button ${skillLevel === 'explorer' ? 'selected' : ''}`}
                onClick={() => setSkillLevel('explorer')}
              >
                <span className="skill-icon">🌱</span>
                <span className="skill-name">Explorer</span>
                <span className="skill-age">Ages 3-4</span>
              </button>
              
              <button
                type="button"
                className={`skill-button ${skillLevel === 'adventurer' ? 'selected' : ''}`}
                onClick={() => setSkillLevel('adventurer')}
              >
                <span className="skill-icon">🌟</span>
                <span className="skill-name">Adventurer</span>
                <span className="skill-age">Ages 5-6</span>
              </button>
              
              <button
                type="button"
                className={`skill-button ${skillLevel === 'champion' ? 'selected' : ''}`}
                onClick={() => setSkillLevel('champion')}
              >
                <span className="skill-icon">🏆</span>
                <span className="skill-name">Champion</span>
                <span className="skill-age">Ages 7-10</span>
              </button>
            </div>
          </div>
          
          <button type="submit" className="start-button">
            Start Looking for Tilly!
          </button>
        </form>
      </div>
    </div>
  );
};

export default WelcomeScreen;
