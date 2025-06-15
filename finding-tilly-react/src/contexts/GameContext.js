import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const GameContext = createContext();

// Custom hook to use the game context
export const useGameContext = () => useContext(GameContext);

// Provider component
export const GameProvider = ({ children }) => {
  // Initial game state
  const initialState = {
    playerName: '',
    userId: null,
    gameStarted: false,
    gameWon: false,
    skillLevel: 'adventurer', // Default skill level
    currentLocation: 'home',
    currentPuzzle: null,
    puzzlesSolved: 0,
    moves: 0,
    hintsUsed: 0,
    gameStartTime: null,
    progress: {
      totalPuzzlesSolved: 0,
      alphabetPuzzlesSolved: 0,
      numberPuzzlesSolved: 0,
      additionPuzzlesSolved: 0
    },
    locations: {
      home: {
        name: 'Home',
        description: 'This is where Tilly lives. Where could she be hiding?',
        puzzleType: 'alphabet',
        exits: ['garden', 'kitchen']
      },
      garden: {
        name: 'Garden',
        description: 'A beautiful garden with flowers and butterflies.',
        puzzleType: 'numbers',
        exits: ['home', 'treehouse']
      },
      kitchen: {
        name: 'Kitchen',
        description: 'The kitchen smells like cookies! Maybe Tilly is looking for a snack.',
        puzzleType: 'addition',
        exits: ['home', 'dining_room']
      },
      dining_room: {
        name: 'Dining Room',
        description: 'A fancy dining room with a big table.',
        puzzleType: 'alphabet',
        exits: ['kitchen', 'bedroom']
      },
      bedroom: {
        name: 'Bedroom',
        description: 'A cozy bedroom with a soft bed.',
        puzzleType: 'numbers',
        exits: ['dining_room', 'closet']
      },
      closet: {
        name: 'Closet',
        description: 'A dark closet full of clothes and toys.',
        puzzleType: 'addition',
        exits: ['bedroom', 'playground']
      },
      playground: {
        name: 'Playground',
        description: 'A fun playground with swings and slides.',
        puzzleType: 'alphabet',
        exits: ['closet', 'treehouse']
      },
      treehouse: {
        name: 'Treehouse',
        description: 'A cool treehouse high up in a tree.',
        puzzleType: 'numbers',
        exits: ['garden', 'playground']
      }
    }
  };

  // State
  const [gameState, setGameState] = useState(initialState);
  const [audioElements, setAudioElements] = useState({});

  // Initialize audio elements
  useEffect(() => {
    const audio = {
      correct: new Audio('/sounds/correct.mp3'),
      wrong: new Audio('/sounds/wrong.mp3'),
      win: new Audio('/sounds/win.mp3'),
      move: new Audio('/sounds/move.mp3')
    };
    
    // Set volume
    Object.values(audio).forEach(sound => {
      sound.volume = 0.5;
    });
    
    setAudioElements(audio);
    
    // Cleanup
    return () => {
      Object.values(audio).forEach(sound => {
        sound.pause();
        sound.currentTime = 0;
      });
    };
  }, []);

  // Play sound effect
  const playSound = (soundName) => {
    const sound = audioElements[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(error => console.log('Error playing sound:', error));
    }
  };

  // Update game state
  const updateGameState = (newState) => {
    setGameState(prevState => ({
      ...prevState,
      ...newState
    }));
  };

  // Reset game
  const resetGame = () => {
    setGameState({
      ...initialState,
      playerName: gameState.playerName,
      userId: gameState.userId,
      gameStarted: true,
      skillLevel: gameState.skillLevel,
      gameStartTime: Date.now()
    });
  };

  // Format location name (replace underscores with spaces and capitalize)
  const formatLocationName = (location) => {
    if (!location) return '';
    return location
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Context value
  const value = {
    gameState,
    updateGameState,
    resetGame,
    playSound,
    formatLocationName
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
