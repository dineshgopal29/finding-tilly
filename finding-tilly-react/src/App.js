import React, { useState, useEffect } from 'react';
import { mockAuth, mockDb } from './services/mockFirebaseService';
import GameScreen from './components/GameScreen';
import WinScreen from './components/WinScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import './App.css';

function App() {
  // User state
  const [playerName, setPlayerName] = useState('');
  const [skillLevel, setSkillLevel] = useState('novice');
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [winData, setWinData] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  
  // Load leaderboard data
  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await mockDb.getLeaderboard();
        setLeaderboard(data);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
      }
    };
    
    loadLeaderboard();
  }, []);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const user = await mockAuth.signIn(email, password);
      setIsLoggedIn(true);
      setCurrentUser(user);
      setPlayerName(user.displayName);
      setShowLogin(false);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle sign up
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !playerName) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const user = await mockAuth.signUp(email, password, playerName);
      setIsLoggedIn(true);
      setCurrentUser(user);
      setShowLogin(false);
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    setLoading(true);
    
    try {
      await mockAuth.signOut();
      setIsLoggedIn(false);
      setCurrentUser(null);
      setGameStarted(false);
      setGameWon(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle skill level selection
  const handleSkillLevelChange = (level) => {
    setSkillLevel(level);
  };
  
  // Handle start game
  const handleStartGame = () => {
    if (!playerName.trim()) {
      setError('Please enter your name to start the adventure!');
      return;
    }
    
    setGameStarted(true);
    setGameWon(false);
    setError('');
    
    // Save game session if logged in
    if (isLoggedIn && currentUser) {
      mockDb.saveGameSession(currentUser.uid, {
        skillLevel,
        startTime: new Date(),
      });
    }
  };
  
  // Handle win game
  const handleWinGame = (gameData) => {
    setWinData(gameData);
    setGameWon(true);
    setGameStarted(false);
  };
  
  // Handle play again
  const handlePlayAgain = () => {
    setGameStarted(true);
    setGameWon(false);
  };
  
  // Handle return home
  const handleReturnHome = () => {
    setGameStarted(false);
    setGameWon(false);
  };
  
  // Render win screen
  if (gameWon) {
    return (
      <WinScreen 
        gameData={winData}
        onPlayAgain={handlePlayAgain}
        onReturnHome={handleReturnHome}
      />
    );
  }
  
  // Render leaderboard
  if (showLeaderboard) {
    return (
      <LeaderboardScreen 
        currentUser={currentUser}
        onReturn={() => setShowLeaderboard(false)}
      />
    );
  }
  
  // Render game screen if game has started
  if (gameStarted) {
    return (
      <GameScreen 
        playerName={playerName}
        skillLevel={skillLevel}
        currentUser={currentUser}
        onLogout={handleReturnHome}
        onShowLeaderboard={() => setShowLeaderboard(true)}
        onWin={handleWinGame}
      />
    );
  }

  // Render welcome screen
  return (
    <div className="app-container">
      <div className="welcome-screen">
        <div className="welcome-container">
          <h1 className="welcome-title">Finding Tilly</h1>
          <div className="welcome-image">🐱</div>
          <p className="welcome-description">
            Oh no! Tilly is hiding somewhere! Solve puzzles to find her!
          </p>
          
          {showLogin ? (
            <div className="login-container">
              <h2>{isLoggedIn ? 'You are logged in!' : 'Login or Sign Up'}</h2>
              
              {isLoggedIn ? (
                <div className="logged-in-info">
                  <p>Welcome back, {currentUser?.displayName || 'Explorer'}!</p>
                  <button 
                    className="secondary-button"
                    onClick={() => setShowLogin(false)}
                  >
                    Continue to Game
                  </button>
                  <button 
                    className="text-button"
                    onClick={handleLogout}
                    disabled={loading}
                  >
                    Logout
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
                  
                  {error && <p className="error-message">{error}</p>}
                  
                  <div className="login-buttons">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={handleLogin}
                      disabled={loading}
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </button>
                    
                    <button
                      type="button"
                      className="primary-button"
                      onClick={handleSignUp}
                      disabled={loading}
                    >
                      {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                  </div>
                  
                  <p className="login-hint">
                    <small>Try email: test@example.com, password: password123</small>
                  </p>
                  
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
                    className={`difficulty-button ${skillLevel === 'scholar' ? 'selected' : ''}`}
                    onClick={() => handleSkillLevelChange('scholar')}
                  >
                    🌟 Curious Scholar<br />
                    <span className="age-range">(Ages 7-12)</span>
                  </button>
                  
                  <button
                    className={`difficulty-button ${skillLevel === 'master' ? 'selected' : ''}`}
                    onClick={() => handleSkillLevelChange('master')}
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
                  {isLoggedIn ? 'Account' : 'Login / Sign Up'}
                </button>
                
                <button className="secondary-button" onClick={() => setShowLeaderboard(true)}>
                  Leaderboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
