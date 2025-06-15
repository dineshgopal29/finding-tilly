import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../contexts/GameContext';
import '../styles/WinScreen.css';

const WinScreen = () => {
  const { gameState, resetGame, playSound } = useGameContext();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);
  
  // Redirect to welcome screen if game not won
  useEffect(() => {
    if (!gameState.gameWon) {
      navigate('/game');
    } else {
      // Play win sound when component mounts
      playSound('win');
    }
  }, [gameState.gameWon, navigate, playSound]);
  
  const handlePlayAgain = () => {
    resetGame();
    navigate('/game');
  };
  
  const toggleCertificate = () => {
    setShowCertificate(!showCertificate);
  };
  
  // Generate confetti elements
  const renderConfetti = () => {
    const confettiPieces = [];
    const colors = ['#FF9E44', '#4DCCBD', '#FF5A5F', '#3D405B', '#81B29A'];
    
    for (let i = 0; i < 50; i++) {
      const left = `${Math.random() * 100}%`;
      const top = `${Math.random() * 100}%`;
      const size = `${Math.random() * 10 + 5}px`;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const animationDuration = `${Math.random() * 3 + 2}s`;
      const animationDelay = `${Math.random() * 5}s`;
      
      confettiPieces.push(
        <div 
          key={i}
          className="confetti"
          style={{
            left,
            top,
            width: size,
            height: size,
            backgroundColor: color,
            animationDuration,
            animationDelay
          }}
        ></div>
      );
    }
    
    return confettiPieces;
  };
  
  // Generate certificate
  const renderCertificate = () => {
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return (
      <div className="certificate">
        <div className="certificate-content">
          <h2>Certificate of Achievement</h2>
          <p className="certificate-text">This certifies that</p>
          <p className="certificate-name">{gameState.playerName}</p>
          <p className="certificate-text">has successfully found Tilly by solving</p>
          <p className="certificate-stats">{gameState.puzzlesSolved} educational puzzles</p>
          <p className="certificate-date">Date: {dateString}</p>
          <div className="certificate-seal">🏆</div>
        </div>
        <button className="print-button" onClick={() => window.print()}>
          Print Certificate
        </button>
      </div>
    );
  };
  
  if (!gameState.gameWon) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <div className="win-screen">
      {showConfetti && renderConfetti()}
      
      <h1>Hooray! You Found Tilly!</h1>
      
      <div className="win-image-container">
        <div className="tilly-found">
          <div className="tilly-emoji">🐱</div>
          <div className="tilly-text">Tilly Found!</div>
        </div>
      </div>
      
      <div className="win-stats">
        <p>Amazing job, {gameState.playerName}!</p>
        <p>You found Tilly after solving {gameState.puzzlesSolved} puzzles in {gameState.moves} moves and used {gameState.hintsUsed || 0} hints!</p>
      </div>
      
      <div className="win-buttons">
        <button 
          className="big-button"
          onClick={handlePlayAgain}
        >
          Play Again!
        </button>
        
        <button 
          className="secondary-button"
          onClick={() => navigate('/leaderboard')}
        >
          View Leaderboard
        </button>
        
        <button 
          className="certificate-button"
          onClick={toggleCertificate}
        >
          {showCertificate ? "Hide Certificate" : "Show Certificate"}
        </button>
      </div>
      
      {showCertificate && renderCertificate()}
    </div>
  );
};

export default WinScreen;
