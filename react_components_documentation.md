# Finding Tilly React Components Documentation

This document provides detailed explanations of each React component and file in the Finding Tilly project, designed for developers new to React and Firebase.

## Table of Contents

1. [Project Structure Overview](#project-structure-overview)
2. [Core Files](#core-files)
3. [Context Providers](#context-providers)
4. [Components](#components)
5. [Services](#services)
6. [Styles](#styles)
7. [React and Firebase Concepts](#react-and-firebase-concepts)

## Project Structure Overview

The Finding Tilly React application follows a standard React project structure with additional organization for components, contexts, services, and styles:

```
/finding-tilly-react/
├── public/                 # Static assets
├── src/                    # Source code
│   ├── components/         # React UI components
│   ├── contexts/           # React context providers
│   ├── services/           # Firebase and other services
│   ├── styles/             # CSS files
│   ├── App.js              # Main application component
│   ├── App.css             # Global styles
│   ├── firebase.js         # Firebase configuration
│   └── index.js            # React entry point
└── package.json            # Dependencies and scripts
```

## Core Files

### `src/index.js`

This is the entry point of the React application. It renders the main `App` component into the DOM.

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Key Concepts:**
- `ReactDOM.createRoot`: Creates a root for the React component tree
- `root.render`: Renders the React component into the DOM
- `React.StrictMode`: A development mode that performs additional checks

### `src/App.js`

The main application component that sets up routing and wraps the application with context providers.

```jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import WinScreen from './components/WinScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <GameProvider>
          <div className="app">
            <Routes>
              <Route path="/" element={<WelcomeScreen />} />
              <Route path="/game" element={<GameScreen />} />
              <Route path="/win" element={<WinScreen />} />
              <Route path="/leaderboard" element={<LeaderboardScreen />} />
            </Routes>
          </div>
        </GameProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
```

**Key Concepts:**
- `Router`: Provides navigation capabilities
- `Routes` and `Route`: Define the application's routing structure
- `AuthProvider` and `GameProvider`: Context providers that make authentication and game state available throughout the application
- `element={<Component />}`: Specifies which component to render for each route

### `src/firebase.js`

Sets up the Firebase configuration and exports Firebase services.

```jsx
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "finding-tilly.firebaseapp.com",
  projectId: "finding-tilly",
  storageBucket: "finding-tilly.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export default app;
```

**Key Concepts:**
- `initializeApp`: Initializes Firebase with your configuration
- `getFirestore`: Creates a Firestore database instance
- `getAuth`: Creates an authentication instance
- `export { db, auth }`: Makes these services available to other files

## Context Providers

### `src/contexts/AuthContext.js`

Manages authentication state and provides authentication-related functions to the application.

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db 
} from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Create the context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Authentication functions...

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Context value
  const value = {
    currentUser,
    signup,
    login,
    logout,
    createGuestUser,
    getUserData,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

**Key Concepts:**
- `createContext`: Creates a React context object
- `useState`: React hook for managing component state
- `useEffect`: React hook for performing side effects (like subscribing to Firebase auth changes)
- `onAuthStateChanged`: Firebase function that listens for authentication state changes
- `AuthContext.Provider`: Makes the context value available to child components
- `useAuth`: Custom hook that simplifies accessing the auth context

**Authentication Functions:**

1. **signup**: Creates a new user account with email and password
   ```jsx
   const signup = async (email, password, name) => {
     try {
       // Create user with email and password
       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
       const user = userCredential.user;
       
       // Update profile with name
       await updateProfile(user, { displayName: name });
       
       // Create user document in Firestore
       await setDoc(doc(db, 'users', user.uid), {
         name: name,
         email: email,
         createdAt: new Date(),
         progress: {
           totalPuzzlesSolved: 0,
           alphabetPuzzlesSolved: 0,
           numberPuzzlesSolved: 0,
           additionPuzzlesSolved: 0,
           hintsUsed: 0,
           lastPlayed: new Date()
         },
         badges: []
       });
       
       return user;
     } catch (error) {
       throw error;
     }
   };
   ```

2. **createGuestUser**: Creates a guest user without requiring email/password
   ```jsx
   const createGuestUser = async (name) => {
     try {
       // Generate a unique ID for the guest user
       const guestId = `guest_${Date.now()}`;
       
       // Create user document in Firestore
       await setDoc(doc(db, 'users', guestId), {
         name: name,
         isGuest: true,
         createdAt: new Date(),
         progress: {
           totalPuzzlesSolved: 0,
           alphabetPuzzlesSolved: 0,
           numberPuzzlesSolved: 0,
           additionPuzzlesSolved: 0,
           hintsUsed: 0,
           lastPlayed: new Date()
         },
         badges: []
       });
       
       // Set the guest user in state
       const guestUser = {
         uid: guestId,
         displayName: name,
         isGuest: true
       };
       
       setCurrentUser(guestUser);
       return guestUser;
     } catch (error) {
       throw error;
     }
   };
   ```

### `src/contexts/GameContext.js`

Manages the game state and provides game-related functions to the application.

```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserProgress } from '../services/gameService';

// Create the context
const GameContext = createContext();

// Locations data
const locations = {
  // Location definitions...
};

// Sound effects
const loadSounds = () => {
  return {
    move: new Audio('/sounds/move.mp3'),
    correct: new Audio('/sounds/pickup.mp3'),
    hint: new Audio('/sounds/hint.mp3'),
    win: new Audio('/sounds/win.mp3'),
    wrong: new Audio('/sounds/wrong.mp3')
  };
};

// Provider component
export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    playerName: "",
    userId: null,
    currentLocation: "home",
    currentPuzzle: null,
    puzzlesSolved: 0,
    hintsUsed: 0,
    moves: 0,
    gameStarted: false,
    gameWon: false,
    locations: locations,
    sounds: null,
    progress: {},
    badges: [],
    isLoading: true
  });

  // Initialize sounds
  useEffect(() => {
    setGameState(prevState => ({
      ...prevState,
      sounds: loadSounds()
    }));
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        const progress = await getUserProgress(user.uid);
        
        setGameState(prevState => ({
          ...prevState,
          userId: user.uid,
          playerName: user.displayName || prevState.playerName,
          progress: progress,
          badges: progress.badges || [],
          isLoading: false
        }));
      } else {
        // User is signed out
        setGameState(prevState => ({
          ...prevState,
          userId: null,
          isLoading: false
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  // Game functions...

  // Context value
  const value = {
    gameState,
    updateGameState,
    resetGame,
    formatLocationName,
    playSound
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
```

**Key Concepts:**
- Game state management with `useState`
- Side effects with `useEffect` for loading sounds and listening to auth changes
- Custom hook `useGameContext` for accessing game state and functions

**Game Functions:**

1. **updateGameState**: Updates the game state
   ```jsx
   const updateGameState = (newState) => {
     setGameState(prevState => ({
       ...prevState,
       ...newState
     }));
   };
   ```

2. **resetGame**: Resets the game to its initial state
   ```jsx
   const resetGame = () => {
     setGameState(prevState => ({
       ...prevState,
       currentLocation: "home",
       puzzlesSolved: 0,
       hintsUsed: 0,
       moves: 0,
       gameWon: false,
       currentPuzzle: null
     }));
   };
   ```

3. **playSound**: Plays a sound effect with error handling
   ```jsx
   const playSound = (soundName) => {
     try {
       if (gameState.sounds && gameState.sounds[soundName]) {
         gameState.sounds[soundName].play();
       }
     } catch (e) {
       console.log('Sound could not be played:', e);
     }
   };
   ```

## Components

### `src/components/WelcomeScreen.js`

The initial screen where users enter their name to start the game.

```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGameContext } from '../contexts/GameContext';
import '../styles/WelcomeScreen.css';

const WelcomeScreen = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { createGuestUser } = useAuth();
  const { updateGameState } = useGameContext();
  const navigate = useNavigate();
  
  const handleStartGame = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name to start the adventure!');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Create a guest user
      const guestUser = await createGuestUser(name);
      
      // Update game state
      updateGameState({
        playerName: name,
        userId: guestUser.uid,
        gameStarted: true
      });
      
      // Navigate to game screen
      navigate('/game');
    } catch (error) {
      console.error("Error starting game:", error);
      setError('Failed to start game. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="welcome-screen">
      {/* Component JSX */}
    </div>
  );
};

export default WelcomeScreen;
```

**Key Concepts:**
- Form handling with React state
- Navigation with `useNavigate` hook from React Router
- Accessing context with custom hooks (`useAuth`, `useGameContext`)
- Async/await for handling asynchronous operations
- Error handling with try/catch

### `src/components/GameScreen.js`

The main game screen that displays the current location, navigation options, and puzzles.

```jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../contexts/GameContext';
import { useAuth } from '../contexts/AuthContext';
import LocationDisplay from './LocationDisplay';
import PuzzleDisplay from './PuzzleDisplay';
import Navigation from './Navigation';
import '../styles/GameScreen.css';

const GameScreen = () => {
  const { gameState, updateGameState, formatLocationName, playSound } = useGameContext();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  
  // Redirect to welcome screen if game not started
  useEffect(() => {
    if (!gameState.gameStarted || !currentUser) {
      navigate('/');
    }
  }, [gameState.gameStarted, currentUser, navigate]);
  
  // Redirect to win screen if game won
  useEffect(() => {
    if (gameState.gameWon) {
      navigate('/win');
    }
  }, [gameState.gameWon, navigate]);
  
  // Get hint
  const handleGetHint = () => {
    // Hint logic...
  };
  
  // Look around
  const handleLookAround = () => {
    // Look around logic...
  };
  
  // Clear message after delay
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  if (!gameState.gameStarted || !currentUser) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <div className="game-screen">
      {/* Component JSX */}
    </div>
  );
};

export default GameScreen;
```

**Key Concepts:**
- Multiple `useEffect` hooks for different side effects
- Conditional rendering based on game state
- Component composition with child components
- Cleanup function in `useEffect` to prevent memory leaks

### `src/components/LocationDisplay.js`

Displays the image for the current location.

```jsx
import React from 'react';
import { useGameContext } from '../contexts/GameContext';
import '../styles/LocationDisplay.css';

const LocationDisplay = () => {
  const { gameState } = useGameContext();
  const currentLocation = gameState.locations[gameState.currentLocation];
  
  return (
    <div className="location-image-container">
      <img 
        src={process.env.PUBLIC_URL + currentLocation.image} 
        alt={`Image of ${gameState.currentLocation}`}
        className="location-image"
      />
    </div>
  );
};

export default LocationDisplay;
```

**Key Concepts:**
- Simple presentational component
- Using `process.env.PUBLIC_URL` to reference assets in the public folder

### `src/components/Navigation.js`

Provides buttons for navigating between locations.

```jsx
import React from 'react';
import { useGameContext } from '../contexts/GameContext';
import '../styles/Navigation.css';

const Navigation = () => {
  const { gameState, updateGameState, formatLocationName, playSound } = useGameContext();
  const currentLocation = gameState.currentLocation;
  const connections = gameState.locations[currentLocation].connections;
  
  const handleMove = (location) => {
    // Play move sound
    playSound('move');
    
    // Update game state
    updateGameState({
      currentLocation: location,
      moves: gameState.moves + 1
    });
  };
  
  return (
    <div className="navigation">
      <h3>Where to go?</h3>
      <div className="direction-buttons">
        {connections.map((connection, index) => (
          <button
            key={index}
            className="direction-button"
            onClick={() => handleMove(connection)}
          >
            {formatLocationName(connection)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
```

**Key Concepts:**
- Event handling with `onClick`
- Mapping over an array to create multiple elements
- Using the `key` prop for list rendering

### `src/components/PuzzleDisplay.js`

Displays and handles educational puzzles.

```jsx
import React, { useState, useEffect } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { getRandomPuzzle, updateUserProgress } from '../services/gameService';
import '../styles/PuzzleDisplay.css';

const PuzzleDisplay = () => {
  const { gameState, updateGameState, playSound } = useGameContext();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch a new puzzle when location changes
  useEffect(() => {
    const fetchPuzzle = async () => {
      // Puzzle fetching logic...
    };
    
    fetchPuzzle();
  }, [gameState.currentLocation, updateGameState]);
  
  // Check answer
  const checkAnswer = async (answer) => {
    // Answer checking logic...
  };
  
  // Fetch new puzzle
  const fetchNewPuzzle = async () => {
    // New puzzle fetching logic...
  };
  
  if (loading) {
    return (
      <div className="puzzle-container">
        <h3>Puzzle</h3>
        <div className="loading">Loading puzzle...</div>
      </div>
    );
  }
  
  if (!gameState.currentPuzzle) {
    return (
      <div className="puzzle-container">
        <h3>Puzzle</h3>
        <div className="error">No puzzle available</div>
      </div>
    );
  }
  
  // Shuffle options for display
  const shuffledOptions = [...gameState.currentPuzzle.options].sort(() => Math.random() - 0.5);
  
  return (
    <div className="puzzle-container">
      {/* Component JSX */}
    </div>
  );
};

export default PuzzleDisplay;
```

**Key Concepts:**
- Asynchronous data fetching in `useEffect`
- Loading and error states
- Conditional rendering based on component state
- Array shuffling for randomized options

### `src/components/WinScreen.js`

Displayed when the player finds Tilly after solving enough puzzles.

```jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../contexts/GameContext';
import '../styles/WinScreen.css';

const WinScreen = () => {
  const { gameState, resetGame } = useGameContext();
  const navigate = useNavigate();
  
  // Redirect to welcome screen if game not won
  useEffect(() => {
    if (!gameState.gameWon) {
      navigate('/game');
    }
  }, [gameState.gameWon, navigate]);
  
  const handlePlayAgain = () => {
    resetGame();
    navigate('/game');
  };
  
  if (!gameState.gameWon) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <div className="win-screen">
      {/* Component JSX */}
    </div>
  );
};

export default WinScreen;
```

**Key Concepts:**
- Navigation control with `useNavigate`
- Conditional rendering based on game state
- Game reset functionality

### `src/components/LeaderboardScreen.js`

Displays the top players based on puzzles solved.

```jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLeaderboard } from '../services/gameService';
import '../styles/LeaderboardScreen.css';

const LeaderboardScreen = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        const data = await fetchLeaderboard();
        setLeaderboardData(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };
    
    getLeaderboard();
  }, []);
  
  const handleBackToGame = () => {
    navigate('/game');
  };
  
  if (loading) {
    return (
      <div className="leaderboard-screen">
        <h2>Top Explorers</h2>
        <div className="loading">Loading leaderboard...</div>
      </div>
    );
  }
  
  return (
    <div className="leaderboard-screen">
      {/* Component JSX */}
    </div>
  );
};

export default LeaderboardScreen;
```

**Key Concepts:**
- Data fetching with `useEffect`
- Loading state management
- Error handling in async functions
- Navigation with `useNavigate`

## Services

### `src/services/gameService.js`

Contains functions for interacting with the Firebase database.

```jsx
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';

// Fetch puzzles by type and difficulty
export const fetchPuzzles = async (type, difficulty = 'easy', count = 5) => {
  // Implementation...
};

// Get a random puzzle of specified type
export const getRandomPuzzle = async (type, difficulty = 'easy') => {
  // Implementation...
};

// Create or update user profile
export const saveUserProfile = async (userId, userData) => {
  // Implementation...
};

// Update user progress
export const updateUserProgress = async (userId, progressData) => {
  // Implementation...
};

// Calculate badges based on progress
const calculateBadges = (progress) => {
  // Implementation...
};

// Fetch leaderboard data
export const fetchLeaderboard = async (limit = 10) => {
  // Implementation...
};

// Get user progress
export const getUserProgress = async (userId) => {
  // Implementation...
};
```

**Key Concepts:**
- Firebase Firestore operations (CRUD)
- Async/await for handling asynchronous operations
- Query building with Firestore
- Error handling with try/catch

**Firestore Operations:**

1. **Reading Data**:
   ```jsx
   // Get a single document
   const userRef = doc(db, 'users', userId);
   const userSnap = await getDoc(userRef);
   if (userSnap.exists()) {
     return userSnap.data();
   }
   
   // Query multiple documents
   const puzzlesRef = collection(db, 'puzzles');
   const q = query(
     puzzlesRef,
     where('type', '==', type),
     where('difficulty', '==', difficulty),
     limit(count)
   );
   const querySnapshot = await getDocs(q);
   const puzzles = [];
   querySnapshot.forEach((doc) => {
     puzzles.push({ id: doc.id, ...doc.data() });
   });
   ```

2. **Writing Data**:
   ```jsx
   // Create or update a document
   await setDoc(doc(db, 'users', userId), userData, { merge: true });
   
   // Update specific fields
   await updateDoc(userRef, {
     progress: updatedProgress,
     badges: badges
   });
   ```

## Styles

### `src/App.css`

Global styles for the application.

```css
/* Kid-friendly color scheme */
:root {
  --primary-color: #FF9E44;
  --secondary-color: #4DCCBD;
  --accent-color: #FF5A5F;
  --background-color: #F9F7F3;
  --text-color: #3D405B;
  --button-hover: #FFB347;
}

* {
  box-sizing: border-box;
  font-family: 'Comic Sans MS', 'Chalkboard SE', cursive;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--background-color);
  color: var(--text-color);
  min-height: 100vh;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
```

**Key Concepts:**
- CSS variables for consistent theming
- Global reset and base styles
- Kid-friendly font selection

### Component-Specific CSS Files

Each component has its own CSS file in the `src/styles/` directory:

- `WelcomeScreen.css`
- `GameScreen.css`
- `LocationDisplay.css`
- `Navigation.css`
- `PuzzleDisplay.css`
- `WinScreen.css`
- `LeaderboardScreen.css`

This approach helps with:
- Modularity and maintainability
- Scoping styles to specific components
- Easier debugging of style issues

## React and Firebase Concepts

### React Concepts

1. **Components**: Building blocks of React applications
   - Functional components (used throughout this project)
   - Props for passing data between components
   - Children for component composition

2. **Hooks**: Functions that let you use React features in functional components
   - `useState`: Manages component state
   - `useEffect`: Handles side effects (data fetching, subscriptions)
   - `useContext`: Accesses context values
   - Custom hooks (`useAuth`, `useGameContext`): Encapsulate reusable logic

3. **Context API**: Provides a way to share values between components without prop drilling
   - `createContext`: Creates a context object
   - `Context.Provider`: Provides the context value to child components
   - `useContext`: Consumes the context value

4. **React Router**: Handles navigation in single-page applications
   - `BrowserRouter`: Provides routing functionality
   - `Routes` and `Route`: Define application routes
   - `useNavigate`: Programmatically navigate between routes

### Firebase Concepts

1. **Firebase Authentication**:
   - User creation and management
   - Authentication state observation
   - Guest user implementation

2. **Firestore Database**:
   - Document-based NoSQL database
   - Collections and documents structure
   - CRUD operations (Create, Read, Update, Delete)
   - Queries with filters and sorting

3. **Firebase SDK**:
   - Modular SDK with specific imports
   - Promise-based API
   - Real-time updates

### Best Practices Demonstrated

1. **Component Organization**:
   - Single responsibility principle
   - Separation of concerns
   - Reusable components

2. **State Management**:
   - Centralized state with Context API
   - Local component state for UI concerns
   - Derived state for computed values

3. **Error Handling**:
   - Try/catch blocks for async operations
   - User-friendly error messages
   - Fallback UI for error states

4. **Performance Optimization**:
   - Conditional rendering
   - Loading states
   - Cleanup functions in `useEffect`

5. **Code Structure**:
   - Modular file organization
   - Separation of UI and business logic
   - Service abstraction for external APIs
