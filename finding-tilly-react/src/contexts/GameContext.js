import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getRandomPuzzle, resetSessionPuzzles } from '../services/gameService';
import { 
  updateUserProgress, 
  saveGameSession, 
  savePuzzleResult, 
  awardBadge 
} from '../services/firebaseService';

// Create context
const GameContext = createContext();

// Custom hook to use the game context
export const useGameContext = () => useContext(GameContext);

// Provider component
export const GameProvider = ({ children }) => {
  const { currentUser, updateUserData } = useAuth();
  
  // Initial game state
  const initialState = {
    playerName: currentUser?.displayName || '',
    userId: currentUser?.uid || null,
    gameStarted: false,
    gameWon: false,
    skillLevel: 'novice', // Default skill level
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
        emoji: '🏠',
        exits: ['garden', 'kitchen']
      },
      garden: {
        name: 'Garden',
        description: 'A beautiful garden with flowers and butterflies.',
        puzzleType: 'numbers',
        emoji: '🌺',
        exits: ['home', 'treehouse']
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
        exits: ['kitchen', 'bedroom']
      },
      bedroom: {
        name: 'Bedroom',
        description: 'A cozy bedroom with a soft bed.',
        puzzleType: 'numbers',
        emoji: '🛏️',
        exits: ['dining_room', 'closet']
      },
      closet: {
        name: 'Closet',
        description: 'A dark closet full of clothes and toys.',
        puzzleType: 'addition',
        emoji: '👕',
        exits: ['bedroom', 'playground']
      },
      playground: {
        name: 'Playground',
        description: 'A fun playground with swings and slides.',
        puzzleType: 'alphabet',
        emoji: '🛝',
        exits: ['closet', 'treehouse']
      },
      treehouse: {
        name: 'Treehouse',
        description: 'A cool treehouse high up in a tree.',
        puzzleType: 'numbers',
        emoji: '🌳',
        exits: ['garden', 'playground']
      }
    },
    tillyLocation: '',
    showingBonus: false,
    bonusPuzzle: null,
    bonusSolved: false
  };

  // State
  const [gameState, setGameState] = useState(initialState);
  const [audioElements, setAudioElements] = useState({});

  // Initialize audio elements
  useEffect(() => {
    try {
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
    } catch (error) {
      console.log('Error initializing audio:', error);
    }
  }, []);

  // Update player info when user changes
  useEffect(() => {
    if (currentUser) {
      setGameState(prev => ({
        ...prev,
        playerName: currentUser.displayName || '',
        userId: currentUser.uid,
        progress: currentUser.userData?.progress || prev.progress
      }));
    }
  }, [currentUser]);

  // Play sound effect
  const playSound = (soundName) => {
    try {
      const sound = audioElements[soundName];
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(error => console.log('Error playing sound:', error));
      }
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  // Update game state
  const updateGameState = (newState) => {
    setGameState(prevState => ({
      ...prevState,
      ...newState
    }));
  };

  // Start a new game
  const startGame = async (playerName, skillLevel) => {
    // Reset the puzzle tracking in gameService
    resetSessionPuzzles();
    
    // Randomly select Tilly's location
    const locations = Object.keys(initialState.locations);
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    
    // Set up new game state
    const newGameState = {
      ...initialState,
      playerName: playerName || currentUser?.displayName || '',
      userId: currentUser?.uid || null,
      gameStarted: true,
      skillLevel: skillLevel || 'novice',
      gameStartTime: Date.now(),
      tillyLocation: randomLocation
    };
    
    setGameState(newGameState);
    
    // Load first puzzle
    await loadPuzzle('home');
    
    // Save game session to Firebase if logged in
    if (currentUser) {
      try {
        await saveGameSession(currentUser.uid, {
          skillLevel: skillLevel || 'novice',
          startTime: new Date(),
          tillyLocation: randomLocation
        });
      } catch (error) {
        console.error("Error saving game session:", error);
      }
    }
    
    return newGameState;
  };

  // Load a puzzle for the current location
  const loadPuzzle = async (location = null) => {
    try {
      const currentLocation = location || gameState.currentLocation;
      const puzzleType = gameState.locations[currentLocation].puzzleType;
      
      // Get a random puzzle of the appropriate type and difficulty
      const puzzle = await getRandomPuzzle(puzzleType, null, gameState.skillLevel);
      
      updateGameState({
        currentPuzzle: puzzle
      });
      
      return puzzle;
    } catch (error) {
      console.error("Error loading puzzle:", error);
      return null;
    }
  };

  // Check puzzle answer
  const checkAnswer = async (selectedAnswer) => {
    if (!gameState.currentPuzzle) return false;
    
    const isCorrect = selectedAnswer === gameState.currentPuzzle.answer;
    const puzzleType = gameState.currentPuzzle.type;
    
    // Update moves count
    const newMoves = gameState.moves + 1;
    
    if (isCorrect) {
      // Play correct sound
      playSound('correct');
      
      // Update puzzles solved count
      const newPuzzlesSolved = gameState.puzzlesSolved + 1;
      
      // Update progress tracking
      const newProgress = {
        ...gameState.progress,
        totalPuzzlesSolved: gameState.progress.totalPuzzlesSolved + 1
      };
      
      // Update specific puzzle type count
      if (puzzleType === 'alphabet') {
        newProgress.alphabetPuzzlesSolved = gameState.progress.alphabetPuzzlesSolved + 1;
      } else if (puzzleType === 'numbers') {
        newProgress.numberPuzzlesSolved = gameState.progress.numberPuzzlesSolved + 1;
      } else if (puzzleType === 'addition') {
        newProgress.additionPuzzlesSolved = gameState.progress.additionPuzzlesSolved + 1;
      }
      
      // Update game state
      updateGameState({
        puzzlesSolved: newPuzzlesSolved,
        moves: newMoves,
        progress: newProgress
      });
      
      // Save puzzle result to Firebase if logged in
      if (currentUser) {
        try {
          await savePuzzleResult(currentUser.uid, {
            type: puzzleType,
            difficulty: gameState.skillLevel,
            question: gameState.currentPuzzle.question,
            answer: gameState.currentPuzzle.answer,
            selectedAnswer,
            correct: true,
            timeSpent: Date.now() - gameState.gameStartTime
          });
          
          // Update user progress in Firebase
          await updateUserProgress(currentUser.uid, newProgress);
          
          // Check for badges
          checkForBadges(newProgress);
        } catch (error) {
          console.error("Error saving puzzle result:", error);
        }
      }
      
      // Check if player has solved enough puzzles to win
      if (newPuzzlesSolved >= 5) {
        // Show bonus puzzle
        await loadBonusPuzzle();
        return { isCorrect, showBonus: true };
      } else {
        // Load a new puzzle
        await loadPuzzle();
      }
      
      return { isCorrect, showBonus: false };
    } else {
      // Play wrong sound
      playSound('wrong');
      
      // Update game state
      updateGameState({
        moves: newMoves
      });
      
      // Save puzzle result to Firebase if logged in
      if (currentUser) {
        try {
          await savePuzzleResult(currentUser.uid, {
            type: puzzleType,
            difficulty: gameState.skillLevel,
            question: gameState.currentPuzzle.question,
            answer: gameState.currentPuzzle.answer,
            selectedAnswer,
            correct: false,
            timeSpent: Date.now() - gameState.gameStartTime
          });
        } catch (error) {
          console.error("Error saving puzzle result:", error);
        }
      }
      
      return { isCorrect, showBonus: false };
    }
  };

  // Load a bonus puzzle
  const loadBonusPuzzle = async () => {
    try {
      // Get a random bonus puzzle of any type
      const puzzleTypes = ['alphabet', 'numbers', 'addition'];
      const randomType = puzzleTypes[Math.floor(Math.random() * puzzleTypes.length)];
      
      // Get a bonus puzzle (one level higher than current skill)
      let bonusDifficulty;
      if (gameState.skillLevel === 'novice') bonusDifficulty = 'adventurer';
      else if (gameState.skillLevel === 'adventurer') bonusDifficulty = 'champion';
      else bonusDifficulty = 'bonus';
      
      const puzzle = await getRandomPuzzle(randomType, bonusDifficulty);
      
      updateGameState({
        bonusPuzzle: puzzle,
        showingBonus: true
      });
      
      return puzzle;
    } catch (error) {
      console.error("Error loading bonus puzzle:", error);
      return null;
    }
  };

  // Check bonus puzzle answer
  const checkBonusAnswer = async (selectedAnswer) => {
    if (!gameState.bonusPuzzle) return false;
    
    const isCorrect = selectedAnswer === gameState.bonusPuzzle.answer;
    
    // Update game state
    updateGameState({
      bonusSolved: true,
      moves: gameState.moves + 1
    });
    
    // Save bonus puzzle result to Firebase if logged in
    if (currentUser) {
      try {
        await savePuzzleResult(currentUser.uid, {
          type: gameState.bonusPuzzle.type,
          difficulty: 'bonus',
          question: gameState.bonusPuzzle.question,
          answer: gameState.bonusPuzzle.answer,
          selectedAnswer,
          correct: isCorrect,
          isBonus: true,
          timeSpent: Date.now() - gameState.gameStartTime
        });
        
        // Award bonus badge if correct
        if (isCorrect) {
          await awardBadge(currentUser.uid, {
            type: 'bonus',
            name: 'Bonus Solver',
            description: 'Solved a bonus puzzle!',
            icon: '🌟'
          });
        }
      } catch (error) {
        console.error("Error saving bonus puzzle result:", error);
      }
    }
    
    return isCorrect;
  };

  // Move to a new location
  const moveToLocation = async (location) => {
    // Play move sound
    playSound('move');
    
    // Update game state
    updateGameState({
      currentLocation: location,
      moves: gameState.moves + 1
    });
    
    // Check if player found Tilly
    if (location === gameState.tillyLocation && gameState.puzzlesSolved >= 5) {
      return finishGame();
    }
    
    // Load a new puzzle for this location
    await loadPuzzle(location);
    
    return { foundTilly: false };
  };

  // Get a hint
  const getHint = () => {
    const newHintsUsed = gameState.hintsUsed + 1;
    
    updateGameState({
      hintsUsed: newHintsUsed,
      moves: gameState.moves + 1
    });
    
    // Update hints used in Firebase if logged in
    if (currentUser) {
      try {
        const newProgress = {
          ...gameState.progress,
          hintsUsed: (gameState.progress.hintsUsed || 0) + 1
        };
        
        updateUserProgress(currentUser.uid, newProgress);
      } catch (error) {
        console.error("Error updating hints used:", error);
      }
    }
    
    // Generate hint based on puzzle type
    const puzzle = gameState.currentPuzzle;
    if (!puzzle) return "Try solving the puzzle!";
    
    let hintText = "";
    
    if (puzzle.type === 'alphabet') {
      hintText = "Think about the alphabet: A, B, C, D, E...";
    } else if (puzzle.type === 'numbers') {
      hintText = "Count carefully and look for patterns!";
    } else if (puzzle.type === 'addition') {
      hintText = "Try counting on your fingers or using objects to help!";
    }
    
    return hintText;
  };

  // Finish the game
  const finishGame = async () => {
    // Play win sound
    playSound('win');
    
    // Calculate game stats
    const gameEndTime = Date.now();
    const gameTime = Math.floor((gameEndTime - gameState.gameStartTime) / 1000); // in seconds
    
    // Update game state
    updateGameState({
      gameWon: true,
      gameEndTime
    });
    
    // Save game completion to Firebase if logged in
    if (currentUser) {
      try {
        await saveGameSession(currentUser.uid, {
          skillLevel: gameState.skillLevel,
          startTime: new Date(gameState.gameStartTime),
          endTime: new Date(gameEndTime),
          duration: gameTime,
          puzzlesSolved: gameState.puzzlesSolved,
          moves: gameState.moves,
          hintsUsed: gameState.hintsUsed,
          completed: true,
          bonusSolved: gameState.bonusSolved
        });
        
        // Award completion badge
        await awardBadge(currentUser.uid, {
          type: 'completion',
          name: `${formatSkillLevel(gameState.skillLevel)} Finder`,
          description: `Found Tilly at ${formatSkillLevel(gameState.skillLevel)} level!`,
          icon: '🏆'
        });
      } catch (error) {
        console.error("Error saving game completion:", error);
      }
    }
    
    return {
      puzzlesSolved: gameState.puzzlesSolved,
      moves: gameState.moves,
      hintsUsed: gameState.hintsUsed,
      gameTime,
      bonusSolved: gameState.bonusSolved
    };
  };

  // Reset game
  const resetGame = () => {
    // Reset the puzzle tracking in gameService
    resetSessionPuzzles();
    
    setGameState({
      ...initialState,
      playerName: gameState.playerName,
      userId: gameState.userId,
      skillLevel: gameState.skillLevel,
      progress: gameState.progress
    });
  };

  // Check for badges based on progress
  const checkForBadges = async (progress) => {
    if (!currentUser) return;
    
    try {
      // Alphabet badges
      if (progress.alphabetPuzzlesSolved >= 10) {
        await awardBadge(currentUser.uid, {
          type: 'alphabet',
          name: 'Alphabet Master',
          description: 'Solved 10 alphabet puzzles!',
          icon: '📚'
        });
      } else if (progress.alphabetPuzzlesSolved >= 5) {
        await awardBadge(currentUser.uid, {
          type: 'alphabet',
          name: 'Alphabet Explorer',
          description: 'Solved 5 alphabet puzzles!',
          icon: '🔤'
        });
      }
      
      // Number badges
      if (progress.numberPuzzlesSolved >= 10) {
        await awardBadge(currentUser.uid, {
          type: 'numbers',
          name: 'Number Wizard',
          description: 'Solved 10 number puzzles!',
          icon: '🔢'
        });
      } else if (progress.numberPuzzlesSolved >= 5) {
        await awardBadge(currentUser.uid, {
          type: 'numbers',
          name: 'Number Friend',
          description: 'Solved 5 number puzzles!',
          icon: '🔢'
        });
      }
      
      // Addition badges
      if (progress.additionPuzzlesSolved >= 10) {
        await awardBadge(currentUser.uid, {
          type: 'addition',
          name: 'Math Genius',
          description: 'Solved 10 addition puzzles!',
          icon: '➕'
        });
      } else if (progress.additionPuzzlesSolved >= 5) {
        await awardBadge(currentUser.uid, {
          type: 'addition',
          name: 'Math Buddy',
          description: 'Solved 5 addition puzzles!',
          icon: '➕'
        });
      }
      
      // Total puzzles badges
      if (progress.totalPuzzlesSolved >= 50) {
        await awardBadge(currentUser.uid, {
          type: 'achievement',
          name: 'Puzzle Champion',
          description: 'Solved 50 puzzles!',
          icon: '🏆'
        });
      } else if (progress.totalPuzzlesSolved >= 25) {
        await awardBadge(currentUser.uid, {
          type: 'achievement',
          name: 'Puzzle Expert',
          description: 'Solved 25 puzzles!',
          icon: '🥇'
        });
      } else if (progress.totalPuzzlesSolved >= 10) {
        await awardBadge(currentUser.uid, {
          type: 'achievement',
          name: 'Puzzle Solver',
          description: 'Solved 10 puzzles!',
          icon: '🥈'
        });
      }
    } catch (error) {
      console.error("Error checking for badges:", error);
    }
  };

  // Format location name (replace underscores with spaces and capitalize)
  const formatLocationName = (location) => {
    if (!location) return '';
    return location
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format skill level name
  const formatSkillLevel = (level) => {
    switch (level) {
      case 'novice':
        return 'Novice Explorer';
      case 'adventurer':
        return 'Curious Scholar';
      case 'champion':
        return 'Puzzle Master';
      default:
        return level.charAt(0).toUpperCase() + level.slice(1);
    }
  };

  // Context value
  const value = {
    gameState,
    updateGameState,
    startGame,
    resetGame,
    loadPuzzle,
    checkAnswer,
    moveToLocation,
    getHint,
    finishGame,
    playSound,
    formatLocationName,
    formatSkillLevel,
    loadBonusPuzzle,
    checkBonusAnswer
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
