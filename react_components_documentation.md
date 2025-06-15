# Finding Tilly - React Components Documentation

This document provides detailed information about each React component in the Finding Tilly educational game, explaining their purpose, functionality, and relationships.

## Table of Contents

1. [App Component](#app-component)
2. [WelcomeScreen Component](#welcomescreen-component)
3. [GameScreen Component](#gamescreen-component)
4. [LocationDisplay Component](#locationdisplay-component)
5. [PuzzleDisplay Component](#puzzledisplay-component)
6. [WinScreen Component](#winscreen-component)
7. [LeaderboardScreen Component](#leaderboardscreen-component)
8. [GameContext](#gamecontext)
9. [AuthContext](#authcontext)
10. [gameService](#gameservice)

## App Component

**File**: `src/App.js`

### Purpose
The App component serves as the root component of the application, setting up routing and context providers.

### Key Features
- Configures React Router for navigation between screens
- Wraps the application in AuthProvider and GameProvider contexts
- Handles base URL configuration for deployment

### Code Structure
```jsx
function App() {
  // Get the base URL for deployment
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
```

### Dependencies
- React Router for navigation
- AuthContext for user authentication
- GameContext for game state management

## WelcomeScreen Component

**File**: `src/components/WelcomeScreen.js`

### Purpose
The WelcomeScreen is the entry point of the game where players enter their name and select a skill level.

### Key Features
- Player name input with validation
- Skill level selection (Explorer, Adventurer, Champion)
- Game initialization

### Code Highlights
```jsx
const handleStartGame = (e) => {
  e.preventDefault();
  
  if (!playerName.trim()) {
    setError('Please enter your name to start the game');
    return;
  }
  
  // Update game state with player info
  updateGameState({
    playerName: playerName.trim(),
    skillLevel,
    gameStarted: true,
    gameStartTime: Date.now()
  });
  
  // Navigate to game screen
  navigate('/game');
};
```

### UI Elements
- Game title and welcome message
- Name input field with validation
- Skill level selection buttons with age recommendations
- Start game button

### Design Considerations
- Child-friendly interface with large buttons
- Clear visual distinction between skill levels
- Minimal text for younger players
- Engaging animations to create excitement

## GameScreen Component

**File**: `src/components/GameScreen.js`

### Purpose
The GameScreen is the main interface where gameplay occurs, including location display, navigation, and puzzle solving.

### Key Features
- Location display and information
- Navigation between connected locations
- Puzzle presentation and interaction
- Hint system

### Code Highlights
```jsx
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
```

### UI Elements
- Header with player information
- Location display with visual representation
- Navigation buttons for available exits
- Puzzle display with question and answer options
- Hint and "Look Around" buttons

### Design Considerations
- Two-panel layout for location and puzzle information
- Clear visual hierarchy for important elements
- Responsive design for different screen sizes
- Consistent color coding for different action types

## LocationDisplay Component

**File**: `src/components/LocationDisplay.js`

### Purpose
The LocationDisplay component provides a visual representation of the current location in the game.

### Key Features
- Emoji-based location visualization
- Color-coded backgrounds for different locations
- Location name display

### Code Highlights
```jsx
// Get emoji for location
const getEmojiForLocation = (location) => {
  const emojis = {
    home: '🏠',
    garden: '🌷',
    kitchen: '🍳',
    bedroom: '🛏️',
    playground: '🎢',
    dining_room: '🍽️',
    closet: '👚',
    treehouse: '🌳'
  };
  
  return emojis[location] || '📍';
};
```

### UI Elements
- Location container with background color
- Large emoji representing the location
- Location name display

### Design Considerations
- Visually distinctive representation for each location
- Emoji-based design for universal recognition
- Hover effects for interactivity
- Consistent size and styling across locations

## PuzzleDisplay Component

**File**: `src/components/PuzzleDisplay.js`

### Purpose
The PuzzleDisplay component presents educational puzzles for the player to solve, with difficulty based on skill level.

### Key Features
- Dynamic puzzle generation based on location and skill level
- Multiple choice answer selection
- Visual learning aids
- Progress tracking
- Streak counter
- Bonus questions for quick learners

### Code Highlights
```jsx
// Check answer
const checkAnswer = async (answer) => {
  if (selectedAnswer !== null || !gameState.currentPuzzle) return;
  
  setSelectedAnswer(answer);
  
  if (answer === gameState.currentPuzzle.answer) {
    // Play correct sound
    playSound('correct');
    
    // Increment streak
    const newStreak = streak + 1;
    setStreak(newStreak);
    
    // Special celebration for streaks
    let message = "That's correct! Great job!";
    if (newStreak === 3) {
      message = "That's correct! You're on a roll! 🔥";
    } else if (newStreak === 5) {
      message = "That's correct! Amazing streak! 🌟";
    } else if (newStreak > 5) {
      message = "That's correct! Incredible! 🏆";
    }
    
    setFeedback({ 
      correct: true, 
      message: message,
      showNextButton: true
    });
    
    // Update progress
    const newPuzzlesSolved = gameState.puzzlesSolved + 1;
    updateGameState({
      puzzlesSolved: newPuzzlesSolved,
      moves: gameState.moves + 1
    });
    
    // Check if game is won
    if (newPuzzlesSolved >= 5) {
      setTimeout(() => {
        playSound('win');
        updateGameState({ gameWon: true });
      }, 1000);
    }
  } else {
    // Handle incorrect answer
    // ...
  }
};
```

### UI Elements
- Puzzle question display
- Multiple choice answer buttons
- Visual aid toggle button
- Feedback messages for correct/incorrect answers
- Progress bar showing puzzles solved
- Streak counter for consecutive correct answers

### Design Considerations
- Clear, readable question presentation
- Large, easy-to-click answer buttons
- Visual feedback for correct/incorrect answers
- Optional visual aids for different learning styles
- Progress visualization to motivate completion

## WinScreen Component

**File**: `src/components/WinScreen.js`

### Purpose
The WinScreen celebrates the player's success in finding Tilly and provides options to play again or view achievements.

### Key Features
- Celebration animations and effects
- Game statistics display
- Printable certificate
- Options to play again or view leaderboard

### Code Highlights
```jsx
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
```

### UI Elements
- Celebration heading and message
- Tilly found image/animation
- Game statistics (puzzles solved, moves, hints used)
- Play again button
- View leaderboard button
- Certificate display and print option

### Design Considerations
- Festive, celebratory visual design
- Animated elements for excitement
- Clear presentation of achievements
- Easy navigation to next actions
- Printable certificate for tangible reward

## LeaderboardScreen Component

**File**: `src/components/LeaderboardScreen.js`

### Purpose
The LeaderboardScreen displays top players and their achievements, including the current player's ranking.

### Key Features
- Ranking of players by puzzles solved
- Current player highlighting
- Achievement badges display
- Navigation back to game

### Code Highlights
```jsx
useEffect(() => {
  const getLeaderboard = async () => {
    try {
      // Sample leaderboard data
      const sampleData = [
        {
          id: 'user1',
          name: 'Alex',
          puzzlesSolved: 15,
          badges: [{type: 'alphabet', level: 'gold', name: 'Alphabet Champion', icon: '🏆'}]
        },
        // More entries...
      ];
      
      // Add current player to leaderboard
      const currentPlayer = {
        id: 'current-player',
        name: gameState.playerName || 'You',
        puzzlesSolved: gameState.puzzlesSolved || 0,
        badges: []
      };
      
      // Add badges based on puzzles solved
      if (gameState.puzzlesSolved >= 5) {
        currentPlayer.badges.push({
          type: 'total', 
          level: 'gold', 
          name: 'Found Tilly!', 
          icon: '🐱'
        });
      }
      
      // Add current player to data and sort
      sampleData.push(currentPlayer);
      const sortedData = sampleData.sort((a, b) => b.puzzlesSolved - a.puzzlesSolved);
      
      setLeaderboardData(sortedData);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };
  
  getLeaderboard();
}, [gameState.playerName, gameState.puzzlesSolved]);
```

### UI Elements
- Leaderboard title
- Ranked list of players
- Player name, rank, and puzzles solved
- Achievement badges with icons
- Current player highlighting
- Back to game button

### Design Considerations
- Clear ranking visualization
- Special highlighting for current player
- Visual representation of achievements
- Responsive layout for different screen sizes
- Engaging design to motivate improvement

## GameContext

**File**: `src/contexts/GameContext.js`

### Purpose
The GameContext provides global state management for the game, making game data accessible to all components.

### Key Features
- Centralized game state management
- Player information storage
- Location and puzzle tracking
- Game progress monitoring
- Audio effects management

### Code Highlights
```jsx
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
    // More locations...
  }
};
```

### Methods
- `updateGameState`: Updates specific parts of the game state
- `resetGame`: Resets the game to initial state while preserving player info
- `playSound`: Plays sound effects for game events
- `formatLocationName`: Formats location IDs into readable names

### Design Considerations
- Efficient state sharing across components
- Minimized re-renders through careful state updates
- Clear separation of concerns
- Comprehensive game data structure

## AuthContext

**File**: `src/contexts/AuthContext.js`

### Purpose
The AuthContext handles user authentication and profile management, with optional Firebase integration.

### Key Features
- User authentication state management
- Sign in, sign out, and sign up functionality
- Loading state handling

### Code Highlights
```jsx
// Mock sign in function
const signIn = async (email, password) => {
  try {
    // In a real app, this would use Firebase Auth
    console.log("Signing in with:", email, password);
    
    // Mock successful sign in
    const user = {
      uid: "user123",
      email: email,
      displayName: "Test User"
    };
    
    setCurrentUser(user);
    return user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};
```

### Methods
- `signIn`: Authenticates a user
- `signOut`: Logs out the current user
- `signUp`: Creates a new user account

### Design Considerations
- Separation of authentication logic from game logic
- Flexible implementation for optional Firebase integration
- Clear loading state management
- Secure user data handling

## gameService

**File**: `src/services/gameService.js`

### Purpose
The gameService provides game logic functions, particularly for puzzle generation and progress tracking.

### Key Features
- Puzzle libraries for different types and difficulty levels
- Dynamic puzzle selection based on skill level
- Prevention of puzzle repetition
- Progress tracking functions

### Code Highlights
```jsx
// Get a random puzzle of specified type and difficulty
export const getRandomPuzzle = async (type, difficulty = null, skillLevel = 'adventurer') => {
  try {
    console.log("Getting random puzzle of type:", type, "difficulty:", difficulty || skillLevel);
    
    // If specific difficulty is requested (like for bonus questions), use that
    const actualDifficulty = difficulty || skillLevel;
    
    // Get all puzzles of this type and difficulty
    const puzzles = puzzleLibrary[actualDifficulty]?.[type] || [];
    
    if (puzzles.length === 0) {
      console.error("No puzzles available for type:", type, "and difficulty:", actualDifficulty);
      // Fall back to adventurer level if no puzzles found
      return getRandomPuzzle(type, null, 'adventurer');
    }
    
    // Filter out recently used puzzles
    let availablePuzzles = puzzles.filter(puzzle => 
      !usedPuzzles[actualDifficulty][type].includes(puzzle.question)
    );
    
    // If we've used all puzzles, reset the used puzzles
    if (availablePuzzles.length === 0) {
      console.log("All puzzles used, resetting used puzzles for type:", type, "and difficulty:", actualDifficulty);
      usedPuzzles[actualDifficulty][type] = [];
      availablePuzzles = puzzles;
    }
    
    // Get a random puzzle
    const randomIndex = Math.floor(Math.random() * availablePuzzles.length);
    const selectedPuzzle = availablePuzzles[randomIndex];
    
    // Add to used puzzles
    usedPuzzles[actualDifficulty][type].push(selectedPuzzle.question);
    
    // Keep used puzzles list from growing too large
    if (usedPuzzles[actualDifficulty][type].length > puzzles.length / 2) {
      usedPuzzles[actualDifficulty][type].shift();
    }
    
    console.log("Selected puzzle:", selectedPuzzle);
    return selectedPuzzle;
  } catch (error) {
    console.error("Error getting random puzzle:", error);
    // Return a default puzzle as fallback
    return {
      type: type,
      difficulty: difficulty || skillLevel,
      question: type === 'alphabet' ? "What letter comes after A?" :
               type === 'numbers' ? "What number comes after 5?" :
               "What is 2 + 3?",
      answer: type === 'alphabet' ? "B" :
              type === 'numbers' ? "6" : "5",
      options: type === 'alphabet' ? ["B", "C", "D"] :
               type === 'numbers' ? ["6", "7", "8"] :
               ["4", "5", "6"]
    };
  }
};
```

### Methods
- `getRandomPuzzle`: Selects a random puzzle based on type and difficulty
- `fetchPuzzles`: Gets all puzzles of a specific type
- `updateUserProgress`: Updates player progress data
- `getUserProgress`: Retrieves player progress data
- `fetchLeaderboard`: Gets leaderboard data with current player included

### Design Considerations
- Comprehensive puzzle library for different skill levels
- Prevention of puzzle repetition for better gameplay
- Fallback mechanisms for error handling
- Separation of game logic from UI components

## Conclusion

The Finding Tilly application is built with a modular component architecture that separates concerns while maintaining efficient data flow. Each component has a specific purpose and interacts with others through the GameContext, creating a cohesive and maintainable codebase.

The educational design principles are embedded throughout the components, with special attention to age-appropriate content, visual learning aids, and positive reinforcement. The game mechanics are carefully implemented to create an engaging and educational experience for young children.

This documentation provides a comprehensive overview of each component's purpose, functionality, and design considerations, serving as a reference for future development and enhancement of the Finding Tilly educational game.
