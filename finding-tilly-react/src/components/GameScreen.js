import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../contexts/GameContext';
import LocationDisplay from './LocationDisplay';
import PuzzleDisplay from './PuzzleDisplay';
import '../styles/GameScreen.css';

const GameScreen = () => {
  const { gameState, updateGameState, playSound } = useGameContext();
  const navigate = useNavigate();
  
  // Redirect to welcome screen if game not started
  useEffect(() => {
    if (!gameState.gameStarted) {
      navigate('/');
    }
  }, [gameState.gameStarted, navigate]);
  
  // Redirect to win screen if game won
  useEffect(() => {
    if (gameState.gameWon) {
      navigate('/win');
    }
  }, [gameState.gameWon, navigate]);
  
  // Handle navigation to a new location
  const handleNavigate = (location) => {
    // Play move sound
    playSound('move');
    
    // Update game state with new location
    updateGameState({
      currentLocation: location,
      moves: gameState.moves + 1
    });
  };
  
  // Handle using a hint
  const handleHint = () => {
    updateGameState({
      hintsUsed: (gameState.hintsUsed || 0) + 1
    });
    
    // Show hint logic would go here
    alert("Look carefully at the puzzle. What comes next in the sequence?");
  };
  
  // Handle looking around the current location
  const handleLookAround = () => {
    const location = gameState.locations[gameState.currentLocation];
    alert(`${location.name}: ${location.description}`);
  };
  
  // Format location name (replace underscores with spaces and capitalize)
  const formatLocationName = (location) => {
    return location
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  if (!gameState.gameStarted) {
    return null; // Will redirect via useEffect
  }
  
  const currentLocation = gameState.locations[gameState.currentLocation];
  
  return (
    <div className="game-screen">
      <header className="game-header">
        <h1>Finding Tilly</h1>
        <div className="player-info">
          <span className="player-name">{gameState.playerName}</span>
          <span className="skill-level">
            {gameState.skillLevel === 'explorer' && <span>🌱 Explorer</span>}
            {gameState.skillLevel === 'adventurer' && <span>🌟 Adventurer</span>}
            {gameState.skillLevel === 'champion' && <span>🏆 Champion</span>}
          </span>
        </div>
      </header>
      
      <div className="game-content">
        <div className="location-section">
          <h2>{formatLocationName(gameState.currentLocation)}</h2>
          <LocationDisplay />
          
          <div className="location-actions">
            <button 
              className="look-button"
              onClick={handleLookAround}
            >
              Look Around
            </button>
          </div>
          
          <div className="navigation">
            <h3>Where to go?</h3>
            <div className="navigation-buttons">
              {currentLocation.exits.map((exit) => (
                <button
                  key={exit}
                  className="nav-button"
                  onClick={() => handleNavigate(exit)}
                >
                  {formatLocationName(exit)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="puzzle-section">
          <PuzzleDisplay />
          
          <div className="puzzle-actions">
            <button 
              className="hint-button"
              onClick={handleHint}
            >
              Get a Hint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
