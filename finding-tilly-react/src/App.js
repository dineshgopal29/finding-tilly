import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import WinScreen from './components/WinScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import './App.css';

function App() {
  // Get the base URL for GitHub Pages deployment
  const basename = process.env.PUBLIC_URL || '';

  return (
    <Router basename={basename}>
      <AuthProvider>
        <GameProvider>
          <div className="app">
            <Routes>
              <Route path="/" element={<WelcomeScreen />} />
              <Route path="/game" element={<GameScreen />} />
              <Route path="/win" element={<WinScreen />} />
              <Route path="/leaderboard" element={<LeaderboardScreen />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </GameProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
