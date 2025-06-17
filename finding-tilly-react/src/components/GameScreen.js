import React, { useState, useEffect } from 'react';
import { 
  generateGamePuzzles, 
  getRandomPuzzle, 
  getLocationEmoji, 
  formatLocationName,
  formatDifficultyName
} from '../services/gameService';
import { mockDb } from '../services/mockFirebaseService';
import '../styles/GameScreen.css';

// Footprints component to show Tilly's trail
const TillyFootprints = ({ tillyLocation, currentLocation }) => {
  // Calculate "warmth" of trail based on distance to Tilly
  const getTrailHeat = () => {
    const locationMap = {
      'home': 0,
      'garden': 1,
      'kitchen': 2,
      'dining_room': 3,
      'bedroom': 4,
      'closet': 5,
      'playground': 6,
      'treehouse': 7
    };
    
    // If locations aren't in the map, return "cold"
    if (!locationMap.hasOwnProperty(tillyLocation) || 
        !locationMap.hasOwnProperty(currentLocation)) {
      return 'cold';
    }
    
    const distance = Math.abs(locationMap[tillyLocation] - locationMap[currentLocation]);
    
    if (distance === 0) return 'very-hot';
    if (distance === 1) return 'hot';
    if (distance === 2) return 'warm';
    return 'cold';
  };
  
  const heat = getTrailHeat();
  
  return (
    <div className="tilly-trail">
      <div className={`footprints ${heat}`}>
        <span className="footprint">🐾</span>
        <span className="footprint">🐾</span>
        <span className="footprint">🐾</span>
      </div>
      <div className="trail-hint">
        {heat === 'very-hot' && "Tilly must be very close!"}
        {heat === 'hot' && "You can sense Tilly nearby!"}
        {heat === 'warm' && "You're getting warmer..."}
        {heat === 'cold' && "No sign of Tilly here yet."}
      </div>
    </div>
  );
};

const GameScreen = ({ playerName, skillLevel, currentUser, onLogout, onShowLeaderboard, onWin }) => {
  // Game state
  const [gameState, setGameState] = useState({
    currentLocation: 'home',
    tillyLocation: '',
    puzzlesSolved: 0,
    moves: 0,
    hintsUsed: 0,
    gameStarted: true,
    gameWon: false,
    showingBonus: false,
    bonusSolved: null,
    streak: 0,
    maxStreak: 0
  });
  
  // Puzzle state
  const [puzzles, setPuzzles] = useState(null);
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [bonusPuzzle, setBonusPuzzle] = useState(null);
  const [message, setMessage] = useState('');
  const [showingMessage, setShowingMessage] = useState(false);
  
  // Locations data
  const locations = {
    home: {
      name: 'Home',
      description: 'This is where Tilly lives. Where could she be hiding?',
      puzzleType: 'alphabet',
      emoji: '🏠',
      exits: ['garden', 'kitchen', 'bedroom']
    },
    garden: {
      name: 'Garden',
      description: 'A beautiful garden with flowers and butterflies.',
      puzzleType: 'numbers',
      emoji: '🌺',
      exits: ['home', 'playground']
    },
    kitchen: {
      name: 'Kitchen',
      description: 'The kitchen smells like cookies! Maybe Tilly is looking for a snack.',
      puzzleType: 'addition',
      emoji: '🍽️',
      exits: ['home', 'dining_room']
    },
    dining_room: {
      name: 'Dining Room',
      description: 'A fancy dining room with a big table.',
      puzzleType: 'alphabet',
      emoji: '🍴',
      exits: ['kitchen']
    },
    bedroom: {
      name: 'Bedroom',
      description: 'A cozy bedroom with a soft bed.',
      puzzleType: 'numbers',
      emoji: '🛏️',
      exits: ['home', 'closet']
    },
    closet: {
      name: 'Closet',
      description: 'A dark closet full of clothes and toys.',
      puzzleType: 'addition',
      emoji: '👕',
      exits: ['bedroom']
    },
    playground: {
      name: 'Playground',
      description: 'A fun playground with swings and slides.',
      puzzleType: 'alphabet',
      emoji: '🛝',
      exits: ['garden', 'treehouse']
    },
    treehouse: {
      name: 'Treehouse',
      description: 'A cool treehouse high up in a tree.',
      puzzleType: 'numbers',
      emoji: '🌳',
      exits: ['playground']
    }
  };
  
  // Initialize game
  useEffect(() => {
    // Generate puzzles
    const gamePuzzles = generateGamePuzzles(skillLevel);
    setPuzzles(gamePuzzles);
    
    // Randomly place Tilly
    const possibleLocations = Object.keys(locations);
    const randomLocation = possibleLocations[Math.floor(Math.random() * possibleLocations.length)];
    
    setGameState(prev => ({
      ...prev,
      tillyLocation: randomLocation
    }));
    
    // Load first puzzle
    const location = locations['home'];
    const puzzle = getRandomPuzzle(gamePuzzles, location.puzzleType);
    setCurrentPuzzle(puzzle);
    
    // Show welcome message
    showMessage(`Welcome, ${playerName}! Let's find Tilly by solving puzzles! Where should we look first?`);
  }, [playerName, skillLevel]);
  
  // Handle location change
  const handleLocationChange = (location) => {
    // Update moves count
    setGameState(prev => ({
      ...prev,
      currentLocation: location,
      moves: prev.moves + 1
    }));
    
    // Check if player found Tilly
    if (location === gameState.tillyLocation && gameState.puzzlesSolved >= 5) {
      handleFindTilly();
      return;
    }
    
    // Load new puzzle for this location
    const locationData = locations[location];
    const puzzle = getRandomPuzzle(puzzles, locationData.puzzleType);
    setCurrentPuzzle(puzzle);
    
    // Show message
    showMessage(`You moved to the ${formatLocationName(location)}. Can you solve the puzzle here?`);
  };
  
  // Handle puzzle answer
  const handleAnswerSelected = (answer) => {
    if (!currentPuzzle) return;
    
    // Update moves count
    setGameState(prev => ({
      ...prev,
      moves: prev.moves + 1
    }));
    
    const isCorrect = answer === currentPuzzle.answer;
    
    if (isCorrect) {
      // Update streak
      const newStreak = gameState.streak + 1;
      const newMaxStreak = Math.max(newStreak, gameState.maxStreak);
      
      // Update puzzles solved count
      setGameState(prev => ({
        ...prev,
        puzzlesSolved: prev.puzzlesSolved + 1,
        streak: newStreak,
        maxStreak: newMaxStreak
      }));
      
      // Show success message with streak
      if (newStreak > 1) {
        showMessage(`That's correct! Great job! 🔥 Streak: ${newStreak}`);
      } else {
        showMessage("That's correct! Great job!");
      }
      
      // Check if we've solved enough puzzles to find Tilly
      if (gameState.puzzlesSolved + 1 >= 5) {
        // Show bonus puzzle
        handleShowBonus();
      } else {
        // Load a new puzzle for the current location
        const locationData = locations[gameState.currentLocation];
        const newPuzzle = getRandomPuzzle(puzzles, locationData.puzzleType);
        setCurrentPuzzle(newPuzzle);
      }
    } else {
      // Reset streak
      setGameState(prev => ({
        ...prev,
        streak: 0
      }));
      
      // Show try again message
      showMessage("That's not quite right. Try again!");
    }
    
    // Save puzzle result if logged in
    if (currentUser) {
      const locationData = locations[gameState.currentLocation];
      mockDb.savePuzzleResult(currentUser.uid, {
        type: locationData.puzzleType,
        difficulty: skillLevel,
        question: currentPuzzle.question,
        answer: currentPuzzle.answer,
        selectedAnswer: answer,
        correct: isCorrect,
        location: gameState.currentLocation
      });
    }
  };
  
  // Handle bonus puzzle
  const handleShowBonus = () => {
    const bonus = getRandomPuzzle(puzzles, 'bonus');
    setBonusPuzzle(bonus);
    
    setGameState(prev => ({
      ...prev,
      showingBonus: true
    }));
  };
  
  // Handle bonus puzzle answer
  const handleBonusAnswerSelected = (answer) => {
    if (!bonusPuzzle) return;
    
    const isCorrect = answer === bonusPuzzle.answer;
    
    setGameState(prev => ({
      ...prev,
      bonusSolved: isCorrect,
      moves: prev.moves + 1
    }));
    
    // Save bonus puzzle result if logged in
    if (currentUser) {
      mockDb.savePuzzleResult(currentUser.uid, {
        type: 'bonus',
        difficulty: skillLevel,
        question: bonusPuzzle.question,
        answer: bonusPuzzle.answer,
        selectedAnswer: answer,
        correct: isCorrect,
        isBonus: true
      });
    }
  };
  
  // Handle continue after bonus
  const handleContinueAfterBonus = () => {
    handleFindTilly();
  };
  
  // Handle finding Tilly
  const handleFindTilly = () => {
    setGameState(prev => ({
      ...prev,
      gameWon: true
    }));
    
    // Save game completion if logged in
    if (currentUser) {
      mockDb.saveGameSession(currentUser.uid, {
        skillLevel,
        puzzlesSolved: gameState.puzzlesSolved,
        moves: gameState.moves,
        hintsUsed: gameState.hintsUsed,
        bonusSolved: gameState.bonusSolved,
        completed: true,
        endTime: new Date()
      });
    }
    
    // Navigate to win screen
    if (onWin) {
      onWin({ 
        playerName, 
        skillLevel, 
        puzzlesSolved: gameState.puzzlesSolved,
        moves: gameState.moves,
        hintsUsed: gameState.hintsUsed,
        bonusSolved: gameState.bonusSolved
      });
    }
  };
  
  // Handle hint request
  const handleHint = () => {
    // Update hints used count
    setGameState(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      moves: prev.moves + 1
    }));
    
    // Generate hint based on puzzle type
    let hintMessage = "";
    const locationData = locations[gameState.currentLocation];
    
    if (locationData.puzzleType === 'alphabet') {
      hintMessage = `Think about the alphabet: A, B, C, D, E...`;
    } else if (locationData.puzzleType === 'numbers') {
      hintMessage = `Count carefully and look for patterns!`;
    } else if (locationData.puzzleType === 'addition') {
      hintMessage = `Try counting on your fingers or using objects to help!`;
    }
    
    // Show hint message
    showMessage(`Hint: ${hintMessage}`);
    
    // Update hints used in database if logged in
    if (currentUser) {
      mockDb.updateUserProgress(currentUser.uid, {
        hintsUsed: gameState.hintsUsed + 1
      });
    }
  };
  
  // Handle look around
  const handleLookAround = () => {
    // Update moves count
    setGameState(prev => ({
      ...prev,
      moves: prev.moves + 1
    }));
    
    // Generate location-specific details
    const locationDetails = {
      "home": ["You notice some alphabet blocks on the floor.", "There's a counting chart on the wall.", "You see some math flashcards on the table."],
      "garden": ["The flowers are arranged in numbered rows.", "There are alphabet stones in the garden path.", "You see numbers painted on the garden gnomes."],
      "kitchen": ["There's a recipe with numbers on the counter.", "Alphabet magnets are on the fridge.", "You see measuring cups with numbers."],
      "bedroom": ["There's an alphabet poster on the wall.", "You see numbered building blocks on the shelf.", "There's a counting book on the bed."],
      "playground": ["The hopscotch has numbers painted on it.", "There are alphabet tiles on the play wall.", "You see numbered steps on the slide."],
      "dining_room": ["The placemats have numbers on them.", "There are alphabet soup cans on the shelf.", "You see numbered plates in the cabinet."],
      "closet": ["The hangers are numbered in order.", "There are alphabet labels on the storage boxes.", "You see numbered shoe cubbies."],
      "treehouse": ["There's a number puzzle on the floor.", "You see alphabet flags hanging from the ceiling.", "There's a math game on the small table."]
    };
    
    // Get random detail for current location
    const details = locationDetails[gameState.currentLocation];
    let message = `You look carefully around the ${formatLocationName(gameState.currentLocation)}. `;
    
    if (details && details.length > 0) {
      const randomDetail = details[Math.floor(Math.random() * details.length)];
      message += randomDetail;
    }
    
    // Add hint about puzzles
    message += " Solving puzzles will help you find Tilly!";
    
    // Show message
    showMessage(message);
  };
  
  // Show message with animation
  const showMessage = (text) => {
    setMessage(text);
    setShowingMessage(true);
    
    // Add animation class
    setTimeout(() => {
      setShowingMessage(false);
    }, 300);
  };
  
  // Render bonus puzzle if showing
  if (gameState.showingBonus) {
    return (
      <div className="game-screen">
        <div className="game-header">
          <h1>Finding Tilly</h1>
          <div className="player-info">
            <span className="player-name">Explorer: {playerName}</span>
            <span className={`level-display ${skillLevel}`}>
              Level: {formatDifficultyName(skillLevel)}
            </span>
            <span className="moves-counter">Moves: {gameState.moves}</span>
            <span className="puzzles-counter">Puzzles: {gameState.puzzlesSolved}/5</span>
          </div>
          <div className="top-buttons">
            <button className="top-button" onClick={onShowLeaderboard}>Leaderboard</button>
            <button className="top-button" onClick={onLogout}>Logout</button>
          </div>
        </div>
        
        <div className="game-content">
          <div className="bonus-screen">
            <h2>Bonus Challenge!</h2>
            <p>Wow! You're doing great! Here's a special bonus puzzle:</p>
            
            {bonusPuzzle && (
              <div className="bonus-puzzle-container">
                <div className="bonus-puzzle-question">{bonusPuzzle.question}</div>
                <div className="bonus-puzzle-options">
                  {bonusPuzzle.options.map((option, index) => (
                    <button
                      key={index}
                      className={`bonus-option ${
                        gameState.bonusSolved !== null && option === bonusPuzzle.answer
                          ? 'correct'
                          : gameState.bonusSolved === false && option === bonusPuzzle.answer
                          ? 'highlight'
                          : ''
                      }`}
                      onClick={() => handleBonusAnswerSelected(option)}
                      disabled={gameState.bonusSolved !== null}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                {gameState.bonusSolved !== null && (
                  <div className="bonus-result">
                    <p className={gameState.bonusSolved ? 'correct-message' : 'incorrect-message'}>
                      {gameState.bonusSolved
                        ? 'Amazing! You solved the bonus puzzle!'
                        : "That's not quite right, but that's okay! It was a bonus challenge."}
                    </p>
                    <button className="continue-button" onClick={handleContinueAfterBonus}>
                      Continue Adventure
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Render main game screen
  return (
    <div className="game-screen">
      <div className="game-header">
        <h1>Finding Tilly</h1>
        <div className="player-info">
          <span className="player-name">Explorer: {playerName}</span>
          <span className={`level-display ${skillLevel}`}>
            Level: {formatDifficultyName(skillLevel)}
          </span>
          <span className="moves-counter">Moves: {gameState.moves}</span>
          <span className="puzzles-counter">Puzzles: {gameState.puzzlesSolved}/5</span>
        </div>
        <div className="top-buttons">
          <button className="top-button" onClick={onShowLeaderboard}>Leaderboard</button>
          <button className="top-button" onClick={onLogout}>Logout</button>
        </div>
      </div>
      
      <div className="game-content">
        <div className="game-area">
          <div className="location-display">
            <div className="location-image-container">
              <div className="location-emoji">
                {getLocationEmoji(gameState.currentLocation)}
              </div>
              <h3 className="location-name">{formatLocationName(gameState.currentLocation)}</h3>
            </div>
            
            <div className="progress-bar-container">
              <div className="progress-bar-label">Puzzle Progress:</div>
              <div className="progress-bar-outer">
                <div 
                  className="progress-bar-inner"
                  style={{ width: `${(gameState.puzzlesSolved / 5) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Add Tilly's footprints */}
            <TillyFootprints 
              tillyLocation={gameState.tillyLocation} 
              currentLocation={gameState.currentLocation} 
            />
            
            {/* Add streak counter */}
            {gameState.streak > 0 && (
              <div className="streak-counter">
                <span className="streak-flame">🔥</span>
                <span className="streak-count">{gameState.streak}</span>
              </div>
            )}
          </div>
          
          <div className="game-info">
            <div className="location-description">
              {locations[gameState.currentLocation].description}
            </div>
            
            <div className="navigation">
              <h3>Where to go?</h3>
              <div className="direction-buttons">
                {locations[gameState.currentLocation].exits.map(exit => (
                  <button 
                    key={exit} 
                    className="direction-button"
                    onClick={() => handleLocationChange(exit)}
                  >
                    {formatLocationName(exit)}
                  </button>
                ))}
              </div>
            </div>
            
            {currentPuzzle && (
              <div className="puzzle-container">
                <h3>Puzzle</h3>
                <div className="puzzle-question">{currentPuzzle.question}</div>
                <div className="puzzle-options">
                  {currentPuzzle.options.map((option, index) => (
                    <button
                      key={index}
                      className="puzzle-option"
                      onClick={() => handleAnswerSelected(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="controls">
          <button className="control-button" onClick={handleHint}>Get a Hint</button>
          <button className="control-button" onClick={handleLookAround}>Look Around</button>
        </div>
        
        <div className={`message-box ${showingMessage ? 'active' : ''}`}>
          {message}
        </div>
      </div>
    </div>
  );
};

export default GameScreen;
