import React, { useEffect, useState } from 'react';
import { formatDifficultyName } from '../services/gameService';
import '../styles/WinScreen.css';

// Simple confetti component
const Confetti = () => {
  const [confetti, setConfetti] = useState([]);
  
  useEffect(() => {
    // Create 50 confetti pieces
    const pieces = [];
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100,
        y: -20 - Math.random() * 80,
        size: Math.random() * 8 + 5,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        rotation: Math.random() * 360,
        speed: Math.random() * 3 + 2
      });
    }
    setConfetti(pieces);
    
    // Animate confetti
    const interval = setInterval(() => {
      setConfetti(prev => prev.map(piece => ({
        ...piece,
        y: piece.y + piece.speed,
        rotation: piece.rotation + 2,
        // Reset pieces that go off screen
        ...(piece.y > 100 ? { y: -20 - Math.random() * 30 } : {})
      })));
    }, 50);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="confetti-container">
      {confetti.map(piece => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`
          }}
        />
      ))}
    </div>
  );
};

const WinScreen = ({ gameData, onPlayAgain, onReturnHome }) => {
  // Get game stats from props
  const { 
    playerName = 'Explorer', 
    skillLevel = 'novice', 
    puzzlesSolved = 5, 
    moves = 0, 
    hintsUsed = 0, 
    bonusSolved = null 
  } = gameData || {};
  
  // Handle print certificate
  const handlePrintCertificate = () => {
    window.print();
  };
  
  // Get current date for certificate
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString();
  };
  
  return (
    <div className="win-screen">
      <Confetti />
      <div className="win-container">
        <h1 className="win-title">Hooray! You Found Tilly!</h1>
        
        <div className="win-image-container">
          <div className="tilly-found-emoji bounce-animation">🎉🧸🎉</div>
        </div>
        
        <div className="win-stats">
          <p>
            You found Tilly after solving {puzzlesSolved} puzzles in{' '}
            {moves} moves and used {hintsUsed} hints!
          </p>
          {bonusSolved !== null && (
            <p>
              {bonusSolved
                ? 'You also solved the bonus challenge! Amazing job!'
                : 'You attempted the bonus challenge. Keep practicing!'}
            </p>
          )}
        </div>
        
        <div className="certificate" id="certificate">
          <h2>Certificate of Achievement</h2>
          <p>
            This certifies that{' '}
            <span className="certificate-name">{playerName}</span> has
            successfully found Tilly by solving puzzles!
          </p>
          <div className="certificate-stats">
            <p>
              Level: {formatDifficultyName(skillLevel)} | Puzzles: {puzzlesSolved} | Moves: {moves}
            </p>
          </div>
          <div className="certificate-footer">
            <div className="certificate-date">Date: {getCurrentDate()}</div>
            <div className="certificate-signature">Tilly the Teddy Bear</div>
          </div>
        </div>
        
        <div className="win-buttons">
          <button className="primary-button" onClick={onPlayAgain}>
            Play Again
          </button>
          <button className="secondary-button" onClick={handlePrintCertificate}>
            Print Certificate
          </button>
          <button className="secondary-button" onClick={onReturnHome}>
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinScreen;
