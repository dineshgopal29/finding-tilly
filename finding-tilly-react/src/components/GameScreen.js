import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';
import LocationDisplay from './LocationDisplay';
import PuzzleDisplay from './PuzzleDisplay';
import '../styles/GameScreen.css';

const GameScreen = () => {
  const { gameState, updateGameState, playSound } = useGameContext();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  // State for popups
  const [showHintPopup, setShowHintPopup] = useState(false);
  const [showLookAroundPopup, setShowLookAroundPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [popupTitle, setPopupTitle] = useState('');
  
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
    
    // Set popup content based on current puzzle type
    const puzzleType = gameState.locations[gameState.currentLocation].puzzleType;
    let hintText = "Look carefully at the puzzle. What comes next in the sequence?";
    
    if (puzzleType === 'alphabet') {
      hintText = "Think about the alphabet order. Which letter comes next in the sequence?";
    } else if (puzzleType === 'numbers') {
      hintText = "Look at the pattern of numbers. What number would continue the pattern?";
    } else if (puzzleType === 'addition') {
      hintText = "Try counting the total objects or using your fingers to add the numbers together.";
    }
    
    setPopupTitle('Hint');
    setPopupContent(hintText);
    setShowHintPopup(true);
  };
  
  // Handle looking around the current location
  const handleLookAround = () => {
    const location = gameState.locations[gameState.currentLocation];
    setPopupTitle(`${location.name}`);
    setPopupContent(location.description);
    setShowLookAroundPopup(true);
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      updateGameState({
        gameStarted: false,
        playerName: '',
        puzzlesSolved: 0,
        moves: 0,
        hintsUsed: 0
      });
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  // Format location name (replace underscores with spaces and capitalize)
  const formatLocationName = (location) => {
    return location
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Close popup
  const closePopup = () => {
    setShowHintPopup(false);
    setShowLookAroundPopup(false);
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
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
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
      
      {/* Hint Popup */}
      {showHintPopup && (
        <div className="popup-overlay">
          <div className="popup-container hint-popup">
            <div className="popup-header">
              <h3>{popupTitle}</h3>
              <button className="close-button" onClick={closePopup}>×</button>
            </div>
            <div className="popup-content">
              <p>{popupContent}</p>
              <div className="hint-icon">💡</div>
            </div>
            <button className="popup-button" onClick={closePopup}>Got it!</button>
          </div>
        </div>
      )}
      
      {/* Look Around Popup */}
      {showLookAroundPopup && (
        <div className="popup-overlay">
          <div className="popup-container look-around-popup">
            <div className="popup-header">
              <h3>{popupTitle}</h3>
              <button className="close-button" onClick={closePopup}>×</button>
            </div>
            <div className="popup-content">
              <p>{popupContent}</p>
              <div className="location-emoji">
                {gameState.currentLocation === 'home' && '🏠'}
                {gameState.currentLocation === 'garden' && '🌷'}
                {gameState.currentLocation === 'kitchen' && '🍳'}
                {gameState.currentLocation === 'bedroom' && '🛏️'}
                {gameState.currentLocation === 'playground' && '🎢'}
                {gameState.currentLocation === 'dining_room' && '🍽️'}
                {gameState.currentLocation === 'closet' && '👚'}
                {gameState.currentLocation === 'treehouse' && '🌳'}
              </div>
            </div>
            <button className="popup-button" onClick={closePopup}>Continue</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
