# Finding Tilly - Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Project Evolution](#project-evolution)
3. [Technical Architecture](#technical-architecture)
4. [Implementation Details](#implementation-details)
5. [Educational Content](#educational-content)
6. [User Experience](#user-experience)
7. [Backend Integration](#backend-integration)
8. [Deployment Guide](#deployment-guide)
9. [Future Enhancements](#future-enhancements)
10. [Resources and References](#resources-and-references)

## Project Overview

### Description

Finding Tilly is an educational web game designed for young children that combines exploration with learning. Players navigate through different locations to solve educational puzzles related to alphabet recognition, number sequences, and basic addition. After solving a certain number of puzzles, they find Tilly, the character who is hiding.

### Target Audience

- Primary: Children ages 3-7 years
- Secondary: Parents and educators looking for educational games

### Educational Objectives

- Improve letter recognition and alphabet sequence understanding
- Develop number recognition and counting skills
- Introduce basic addition concepts (sums up to 20)
- Enhance pattern recognition through finding missing elements in sequences
- Build problem-solving skills through exploration and puzzles

### Key Features

- Kid-friendly interface with large buttons and simple navigation
- Educational puzzles tailored to young learners
- Progress tracking and achievements
- Hint system to guide younger players
- Sound effects for engagement and feedback
- Leaderboard to motivate continued learning

## Project Evolution

### Phase 1: Text-Based Prototype

The project began as a simple text-based adventure game written in Python:

```python
#!/usr/bin/env python3
"""
Finding Tilly - A simple adventure game for kids
"""
import random
import time
import os

class Game:
    def __init__(self):
        self.player_name = ""
        self.tilly_location = ""
        self.current_location = "home"
        # More initialization code...
```

This version featured:
- Location-based navigation
- Item collection
- A hint system
- Random placement of Tilly

### Phase 2: Web-Based Implementation

The game was converted to a web application using HTML, CSS, and JavaScript:

```html
<div id="game-container">
    <div id="welcome-screen" class="screen">
        <h1>Finding Tilly</h1>
        <p>Oh no! Tilly is hiding somewhere!</p>
        <!-- More welcome screen content -->
    </div>
    
    <div id="game-screen" class="screen hidden">
        <!-- Game content -->
    </div>
</div>
```

Key improvements included:
- Visual interface with location images
- Kid-friendly design with bright colors and large buttons
- Simple click-based navigation

### Phase 3: Educational Enhancement

The game was transformed to focus on educational content:

```javascript
// Educational puzzles by category
puzzles: {
    alphabet: [
        { question: "What letter comes after A?", answer: "B", options: ["B", "C", "D"] },
        // More alphabet puzzles
    ],
    numbers: [
        { question: "What number comes after 5?", answer: "6", options: ["6", "7", "8"] },
        // More number puzzles
    ],
    addition: [
        { question: "What is 2 + 3?", answer: "5", options: ["4", "5", "6"] },
        // More addition puzzles
    ]
}
```

This phase introduced:
- Educational puzzles by location type
- Multiple-choice answers
- Progress-based win condition (solve 5 puzzles to find Tilly)

### Phase 4: React SPA with Firebase Backend

The latest version is a React single-page application with Firebase backend:

```jsx
// React component structure
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
```

This version features:
- Component-based architecture
- Context-based state management
- User authentication and progress tracking
- Database storage for puzzles and user data
- Leaderboard functionality

## Technical Architecture

### Web Version (HTML/CSS/JavaScript)

```
/finding_tilly/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling
├── game.js             # Game logic
├── README.md           # Project documentation
├── finding_tilly_game.md  # Development blog
├── /images/            # Location and UI images
└── /sounds/            # Game sound effects
```

### React SPA Version

```
/finding-tilly-react/
├── public/
│   ├── index.html      # HTML entry point
│   ├── /images/        # Game images
│   └── /sounds/        # Game sounds
├── src/
│   ├── components/     # React components
│   │   ├── WelcomeScreen.js
│   │   ├── GameScreen.js
│   │   ├── LocationDisplay.js
│   │   ├── PuzzleDisplay.js
│   │   ├── Navigation.js
│   │   ├── WinScreen.js
│   │   └── LeaderboardScreen.js
│   ├── contexts/       # React contexts
│   │   ├── GameContext.js
│   │   └── AuthContext.js
│   ├── services/       # Firebase services
│   │   ├── firebase.js
│   │   └── gameService.js
│   ├── styles/         # Component styles
│   │   ├── WelcomeScreen.css
│   │   ├── GameScreen.css
│   │   └── ...
│   ├── App.js          # Main application component
│   ├── App.css         # Global styles
│   └── index.js        # React entry point
└── package.json        # Dependencies and scripts
```

### Firebase Backend Structure

```
Firebase Project
├── Authentication
│   └── Users
├── Firestore Database
│   ├── users/
│   │   └── [userId]/
│   │       ├── name
│   │       ├── email
│   │       ├── createdAt
│   │       ├── progress/
│   │       │   ├── totalPuzzlesSolved
│   │       │   ├── alphabetPuzzlesSolved
│   │       │   ├── numberPuzzlesSolved
│   │       │   ├── additionPuzzlesSolved
│   │       │   ├── hintsUsed
│   │       │   └── lastPlayed
│   │       └── badges/
│   │           └── [badge objects]
│   └── puzzles/
│       └── [puzzleId]/
│           ├── type (alphabet, numbers, addition)
│           ├── difficulty (easy, medium, hard)
│           ├── question
│           ├── answer
│           └── options
└── Hosting
    └── [deployed files]
```

## Implementation Details

### Game State Management

#### Web Version

```javascript
// Game state in vanilla JavaScript
const gameState = {
    playerName: "",
    currentLocation: "home",
    tillyLocation: "",
    inventory: [],
    hintsUsed: 0,
    moves: 0,
    gameStarted: false,
    gameWon: false,
    currentPuzzle: null,
    puzzlesSolved: 0,
    
    // Educational puzzles by category
    puzzles: {
        // Puzzle definitions
    },
    
    // Game locations and their properties
    locations: {
        // Location definitions
    }
};
```

#### React Version

```jsx
// Game state using React Context
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

  // State update methods
  const updateGameState = (newState) => {
    setGameState(prevState => ({
      ...prevState,
      ...newState
    }));
  };

  // More methods...

  return (
    <GameContext.Provider value={{ gameState, updateGameState, resetGame, formatLocationName, playSound }}>
      {children}
    </GameContext.Provider>
  );
};
```

### Puzzle System

Puzzles are categorized by type:

1. **Alphabet Puzzles**
   - Letter sequencing (what comes before/after)
   - Finding missing letters in sequences

2. **Number Puzzles**
   - Number sequencing (what comes before/after)
   - Finding missing numbers in sequences

3. **Addition Puzzles**
   - Simple addition problems (sums up to 20)

Each puzzle includes:
- A question
- The correct answer
- Multiple-choice options

```javascript
{
  question: "What letter comes after A?", 
  answer: "B", 
  options: ["B", "C", "D"]
}
```

### Location System

Each location in the game has:
- A description
- Connections to other locations
- An associated puzzle type
- An image

```javascript
"home": {
  description: "You are at home. Tilly left a puzzle for you to solve!",
  connections: ["garden", "kitchen", "bedroom"],
  puzzleType: "alphabet",
  image: "/images/home.png"
}
```

### User Authentication

The React version supports both registered users and guest mode:

```jsx
// Create guest user
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
    
    // Return guest user object
    return {
      uid: guestId,
      displayName: name,
      isGuest: true
    };
  } catch (error) {
    throw error;
  }
};
```

### Progress Tracking

User progress is tracked in Firebase:

```jsx
// Update user progress
export const updateUserProgress = async (userId, progressData) => {
  try {
    // Get current user data
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      
      // Update progress
      const updatedProgress = {
        ...userData.progress,
        ...progressData,
        lastUpdated: new Date()
      };
      
      // Calculate new badges if applicable
      const badges = calculateBadges(updatedProgress);
      
      // Update user document
      await updateDoc(userRef, {
        progress: updatedProgress,
        badges: badges
      });
      
      return true;
    } else {
      console.error("User document not found");
      return false;
    }
  } catch (error) {
    console.error("Error updating user progress:", error);
    return false;
  }
};
```

### Badge System

Badges are awarded based on progress milestones:

```jsx
// Calculate badges based on progress
const calculateBadges = (progress) => {
  const badges = [];
  
  // Alphabet badges
  if (progress.alphabetPuzzlesSolved >= 5) {
    badges.push({
      type: 'alphabet',
      level: 'bronze',
      name: 'Alphabet Explorer',
      icon: '🔤'
    });
  }
  if (progress.alphabetPuzzlesSolved >= 15) {
    badges.push({
      type: 'alphabet',
      level: 'silver',
      name: 'Alphabet Master',
      icon: '📝'
    });
  }
  // More badge definitions...
  
  return badges;
};
```

## Educational Content

### Alphabet Learning

Puzzles focus on:
- Letter recognition
- Alphabet sequence (before/after relationships)
- Missing letter identification

Example puzzles:
- "What letter comes after A?"
- "What letter comes before D?"
- "What letter is missing? A, B, _, D"

### Number Skills

Puzzles focus on:
- Number recognition
- Counting sequence (before/after relationships)
- Missing number identification

Example puzzles:
- "What number comes after 5?"
- "What number comes before 10?"
- "What number is missing? 2, 4, 6, _, 10"

### Addition Skills

Puzzles focus on:
- Basic addition with sums up to 20
- Visual counting and combining

Example puzzles:
- "What is 2 + 3?"
- "What is 4 + 4?"
- "What is 5 + 3?"

## User Experience

### Visual Design

The game features a kid-friendly design with:
- Bright, cheerful colors
- Large, easy-to-click buttons
- Comic Sans font for readability
- Visual feedback for actions

CSS variables define the color scheme:

```css
:root {
  --primary-color: #FF9E44;
  --secondary-color: #4DCCBD;
  --accent-color: #FF5A5F;
  --background-color: #F9F7F3;
  --text-color: #3D405B;
  --button-hover: #FFB347;
}
```

### Navigation

Players navigate between locations using direction buttons:

```jsx
// Navigation component
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
```

### Feedback System

The game provides immediate feedback for puzzle answers:

```jsx
// Check answer
const checkAnswer = async (answer) => {
  setSelectedAnswer(answer);
  
  if (answer === gameState.currentPuzzle.answer) {
    // Play correct sound
    playSound('correct');
    
    setFeedback({ correct: true, message: "That's correct! Great job!" });
    
    // Update progress...
    
  } else {
    // Play wrong sound
    playSound('wrong');
    
    setFeedback({ correct: false, message: "That's not quite right. Try again!" });
    
    // Update moves...
  }
};
```

Visual feedback is enhanced with CSS animations:

```css
.puzzle-option.correct {
  background-color: #4CAF50;
  animation: pulse 0.5s;
}

.puzzle-option.incorrect {
  background-color: #F44336;
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}
```

### Hint System

Players can get hints for puzzles:

```jsx
// Get hint
const handleGetHint = () => {
  playSound('hint');
  
  updateGameState({
    hintsUsed: gameState.hintsUsed + 1,
    moves: gameState.moves + 1
  });
  
  // Generate hint based on current puzzle type
  const puzzle = gameState.currentPuzzle;
  let hintMessage = "";
  
  if (puzzle.question.includes("letter")) {
    hintMessage = `Think about the alphabet: A, B, C, D, E, F...`;
  } else if (puzzle.question.includes("number")) {
    hintMessage = `Count carefully: 1, 2, 3, 4, 5...`;
  } else if (puzzle.question.includes("+")) {
    hintMessage = `Try counting on your fingers!`;
  }
  
  // Show hint message
  setMessage(`Hint: ${hintMessage}`);
};
```

## Backend Integration

### Firebase Setup

To use Firebase with the project:

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication and Firestore Database
3. Update the Firebase configuration in `src/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Database Schema

#### Users Collection

```
users/
  [userId]/
    name: string
    email: string (optional)
    isGuest: boolean
    createdAt: timestamp
    progress/
      totalPuzzlesSolved: number
      alphabetPuzzlesSolved: number
      numberPuzzlesSolved: number
      additionPuzzlesSolved: number
      hintsUsed: number
      lastPlayed: timestamp
    badges/
      []/
        type: string (alphabet, number, addition, total)
        level: string (bronze, silver, gold)
        name: string
        icon: string
```

#### Puzzles Collection

```
puzzles/
  [puzzleId]/
    type: string (alphabet, numbers, addition)
    difficulty: string (easy, medium, hard)
    question: string
    answer: string
    options: array of strings
```

### Data Access

Firebase services are abstracted through service functions:

```jsx
// Fetch puzzles by type and difficulty
export const fetchPuzzles = async (type, difficulty = 'easy', count = 5) => {
  try {
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
    
    return puzzles;
  } catch (error) {
    console.error("Error fetching puzzles:", error);
    return [];
  }
};
```

## Deployment Guide

### Prerequisites

- Node.js and npm installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created

### Deploying the React SPA

1. Build the React application:

```bash
cd finding-tilly-react
npm run build
```

2. Login to Firebase:

```bash
firebase login
```

3. Initialize Firebase in the project:

```bash
firebase init
```

4. Select Hosting and configure:
   - Select your Firebase project
   - Specify `build` as the public directory
   - Configure as a single-page app
   - Don't overwrite `index.html`

5. Deploy to Firebase:

```bash
firebase deploy
```

### Adding Media Files

Before deploying, add the required media files:

1. **Images** in `public/images/`:
   - `home.png`
   - `garden.png`
   - `kitchen.png`
   - `bedroom.png`
   - `playground.png`
   - `dining_room.png`
   - `closet.png`
   - `treehouse.png`
   - `tilly_found.png`
   - `background.png`

2. **Sounds** in `public/sounds/`:
   - `move.mp3`
   - `pickup.mp3` (used for correct answers)
   - `hint.mp3`
   - `win.mp3`
   - `wrong.mp3` (for incorrect answers)

## Future Enhancements

### Short-term Improvements

1. **Expanded Puzzle Library**
   - Add more varied questions at different difficulty levels
   - Create puzzles for specific age groups

2. **Adaptive Difficulty**
   - Adjust puzzle difficulty based on player performance
   - Gradually introduce more challenging concepts

3. **Parent Dashboard**
   - Create an interface for parents to monitor progress
   - Provide insights into strengths and areas for improvement

### Long-term Vision

1. **Additional Learning Areas**
   - Expand to include shape recognition
   - Add simple word reading puzzles
   - Include basic subtraction

2. **Multiplayer Features**
   - Allow children to play together
   - Create classroom mode for educational settings

3. **Customization Options**
   - Allow parents/teachers to create custom puzzles
   - Enable theme customization

4. **Mobile App Version**
   - Convert to React Native for native mobile experience
   - Add offline mode with sync capabilities

## Resources and References

### Development Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Router Documentation](https://reactrouter.com/docs/en/v6)

### Educational Resources

- [Early Childhood Education Guidelines](https://www.naeyc.org/resources/topics/dap/position-statement)
- [Kindergarten Learning Standards](https://www.ed.gov/early-learning/resources)

### Media Resources

- Free images: [Freepik](https://www.freepik.com), [Pixabay](https://pixabay.com)
- Free sounds: [FreeSound](https://freesound.org)

### Project Files

- [GitHub Repository](#) (To be created)
- [Live Demo](#) (To be deployed)
