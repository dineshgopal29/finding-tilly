import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGameContext } from '../contexts/GameContext';
import '../styles/WelcomeScreen.css';

const WelcomeScreen = () => {
  const [playerName, setPlayerName] = useState('');
  const [skillLevel, setSkillLevel] = useState('novice');
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { currentUser, signIn, signUp } = useAuth();
  const { startGame } = useGameContext();
  const navigate = useNavigate();
  
  // Set player name from current user if logged in
  useEffect(() => {
    if (currentUser) {
      setPlayerName(currentUser.displayName || '');
    }
  }, [currentUser]);
  
  const handleStartGame = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name to start the adventure!');
      return;
    }
    
    setError('');
    
    try {
      // Start a new game
      await startGame(playerName, skillLevel);
      
      // Navigate to game screen
      navigate('/game');
    } catch (error) {
      console.error('Error starting game:', error);
      setError('Something went wrong. Please try again.');
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await signIn(email, password);
      setShowLogin(false);
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !playerName) {
      setError('Please fill in all fields');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await signUp(email, password, playerName);
      setShowLogin(false);
    } catch (error) {
      console.error('Error signing up:', error);
      setError('Failed to create an account. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSkillLevelChange = (level) => {
    setSkillLevel(level);
  };
  
  return (
    <div className="welcome-screen">
      <div className="welcome-container">
        <h1 className="welcome-title">Finding Tilly</h1>
        <div className="welcome-image">🐱</div>
        <p className="welcome-description">
          Oh no! Tilly is hiding somewhere! Solve puzzles to find her!
        </p>
        
        {showLogin ? (
          <div className="login-container">
            <h2>{currentUser ? 'You are logged in!' : 'Login or Sign Up'}</h2>
            
            {currentUser ? (
              <div className="logged-in-info">
                <p>Welcome back, {currentUser.displayName || 'Explorer'}!</p>
                <button 
                  className="secondary-button"
                  onClick={() => setShowLogin(false)}
                >
                  Continue to Game
                </button>
              </div>
            ) : (
              <form className="login-form">
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {!currentUser && (
                  <div className="form-group">
                    <label htmlFor="display-name">Display Name:</label>
                    <input
                      type="text"
                      id="display-name"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      required
                    />
                  </div>
                )}
                
                {error && <p className="error-message">{error}</p>}
                
                <div className="login-buttons">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    Login
                  </button>
                  
                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleSignUp}
                    disabled={loading}
                  >
                    Sign Up
                  </button>
                </div>
                
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setShowLogin(false)}
                >
                  Back to Game
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="game-setup">
            <div className="input-container">
              <label htmlFor="player-name">What's your name, brave explorer?</label>
              <input
                type="text"
                id="player-name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            
            <div className="difficulty-selector">
              <h3>Choose your skill level:</h3>
              <div className="difficulty-buttons">
                <button
                  className={`difficulty-button ${skillLevel === 'novice' ? 'selected' : ''}`}
                  onClick={() => handleSkillLevelChange('novice')}
                >
                  🌱 Novice Explorer<br />
                  <span className="age-range">(Ages 3-6)</span>
                </button>
                
                <button
                  className={`difficulty-button ${skillLevel === 'adventurer' ? 'selected' : ''}`}
                  onClick={() => handleSkillLevelChange('adventurer')}
                >
                  🌟 Curious Scholar<br />
                  <span className="age-range">(Ages 7-12)</span>
                </button>
                
                <button
                  className={`difficulty-button ${skillLevel === 'champion' ? 'selected' : ''}`}
                  onClick={() => handleSkillLevelChange('champion')}
                >
                  🏆 Puzzle Master<br />
                  <span className="age-range">(Ages 13+)</span>
                </button>
              </div>
            </div>
            
            {error && <p className="error-message">{error}</p>}
            
            <div className="welcome-buttons">
              <button className="primary-button" onClick={handleStartGame}>
                Start Adventure!
              </button>
              
              <button className="secondary-button" onClick={() => setShowLogin(true)}>
                {currentUser ? 'Account' : 'Login / Sign Up'}
              </button>
              
              <button
                className="secondary-button"
                onClick={() => navigate('/leaderboard')}
              >
                Leaderboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
