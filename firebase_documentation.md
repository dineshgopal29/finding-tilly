# Firebase Integration Guide for Finding Tilly

This document provides a detailed explanation of how Firebase is integrated into the Finding Tilly project, designed for developers new to Firebase.

## Table of Contents

1. [Firebase Overview](#firebase-overview)
2. [Project Setup](#project-setup)
3. [Authentication](#authentication)
4. [Firestore Database](#firestore-database)
5. [Deployment](#deployment)
6. [Common Firebase Operations](#common-firebase-operations)
7. [Troubleshooting](#troubleshooting)

## Firebase Overview

Firebase is a platform developed by Google that provides various services for building web and mobile applications. In the Finding Tilly project, we use the following Firebase services:

- **Authentication**: Manages user accounts and authentication
- **Firestore Database**: Stores game data like puzzles, user progress, and leaderboards
- **Hosting**: Deploys and hosts the web application (optional)

Firebase offers a serverless architecture, which means you don't need to manage your own server. Instead, Firebase handles the backend infrastructure, allowing you to focus on building your application.

## Project Setup

### Creating a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "finding-tilly")
4. Follow the setup wizard (you can disable Google Analytics if not needed)
5. Click "Create project"

### Adding Firebase to Your React App

1. In the Firebase Console, click on your project
2. Click the web icon (</>) to add a web app
3. Register your app with a nickname (e.g., "finding-tilly-web")
4. Copy the Firebase configuration object

### Installing Firebase SDK

In your React project:

```bash
npm install firebase
```

### Configuring Firebase in Your App

Create a file `src/firebase.js`:

```javascript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
export default app;
```

Replace the `firebaseConfig` object with the configuration you copied from the Firebase Console.

## Authentication

Firebase Authentication provides backend services and ready-made UI libraries to authenticate users in your app. In Finding Tilly, we use both email/password authentication and a custom guest mode.

### Setting Up Authentication

1. In the Firebase Console, go to "Authentication" > "Sign-in method"
2. Enable the "Email/Password" provider
3. Save your changes

### Authentication in Code

#### User Creation

```javascript
// Create a user with email and password
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

#### Guest User Creation

```javascript
// Create a guest user
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

#### Authentication State Listener

```javascript
// Listen for auth state changes
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setCurrentUser(user);
    setLoading(false);
  });

  return () => unsubscribe();
}, []);
```

### Authentication Context

The `AuthContext` provides authentication functionality throughout the application:

```javascript
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
```

## Firestore Database

Firestore is a NoSQL document database that stores data in collections of documents. In Finding Tilly, we use Firestore to store puzzles, user profiles, and progress data.

### Database Structure

```
Firebase Project
├── users/
│   └── [userId]/
│       ├── name: string
│       ├── email: string (optional)
│       ├── isGuest: boolean
│       ├── createdAt: timestamp
│       ├── progress/
│       │   ├── totalPuzzlesSolved: number
│       │   ├── alphabetPuzzlesSolved: number
│       │   ├── numberPuzzlesSolved: number
│       │   ├── additionPuzzlesSolved: number
│       │   ├── hintsUsed: number
│       │   └── lastPlayed: timestamp
│       └── badges/
│           └── [badge objects]
└── puzzles/
    └── [puzzleId]/
        ├── type: string (alphabet, numbers, addition)
        ├── difficulty: string (easy, medium, hard)
        ├── question: string
        ├── answer: string
        └── options: array of strings
```

### Setting Up Firestore

1. In the Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" or "Start in test mode" (for development)
4. Select a location for your database
5. Click "Enable"

### Security Rules

Firestore uses security rules to control access to your data. Here's a basic set of rules for Finding Tilly:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read puzzles
    match /puzzles/{puzzleId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins can write puzzles (via Firebase Console)
    }
    
    // Allow authenticated users to read the leaderboard
    match /users/{userId} {
      allow read: if request.auth != null;
    }
  }
}
```

To set these rules:
1. In the Firebase Console, go to "Firestore Database" > "Rules"
2. Replace the default rules with the rules above
3. Click "Publish"

### Common Firestore Operations

#### Reading Data

```javascript
// Get a single document
const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

// Query multiple documents
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

#### Writing Data

```javascript
// Create or update a document
export const saveUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, userData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving user profile:", error);
    return false;
  }
};

// Update specific fields
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

## Deployment

Firebase Hosting provides fast and secure hosting for your web app.

### Setting Up Firebase Hosting

1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select "Hosting"
   - Select your Firebase project
   - Specify `build` as the public directory
   - Configure as a single-page app
   - Don't overwrite `index.html`

4. Build your React app:
   ```bash
   npm run build
   ```

5. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## Common Firebase Operations

### Adding Puzzles to Firestore

You can add puzzles to Firestore in several ways:

1. **Firebase Console**: Manually add documents in the Firebase Console
2. **Batch Import**: Use a script to import puzzles from a JSON file
3. **Admin SDK**: Use the Firebase Admin SDK in a Node.js script

Here's an example of a script to import puzzles:

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const puzzles = [
  {
    type: 'alphabet',
    difficulty: 'easy',
    question: 'What letter comes after A?',
    answer: 'B',
    options: ['B', 'C', 'D']
  },
  // More puzzles...
];

async function importPuzzles() {
  const batch = db.batch();
  
  puzzles.forEach((puzzle) => {
    const puzzleRef = db.collection('puzzles').doc();
    batch.set(puzzleRef, puzzle);
  });
  
  await batch.commit();
  console.log('Puzzles imported successfully!');
}

importPuzzles().catch(console.error);
```

### Querying the Leaderboard

```javascript
export const fetchLeaderboard = async (limit = 10) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      orderBy('progress.totalPuzzlesSolved', 'desc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    const leaderboard = [];
    
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      leaderboard.push({
        id: doc.id,
        name: userData.name,
        puzzlesSolved: userData.progress.totalPuzzlesSolved || 0,
        badges: userData.badges || []
      });
    });
    
    return leaderboard;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};
```

### Handling Offline Support

Firebase provides offline support out of the box. When a user goes offline, Firebase caches data and queues write operations. When the user comes back online, Firebase automatically syncs the data.

To enhance offline support in Finding Tilly, we've implemented local fallback puzzles:

```javascript
// Fallback to local puzzles if Firebase fetch fails
const localPuzzles = {
  alphabet: [
    { question: "What letter comes after A?", answer: "B", options: ["B", "C", "D"] },
    // More puzzles...
  ],
  // Other puzzle types...
};

// In the fetchPuzzle function
try {
  // Get puzzle from Firebase
  const puzzle = await getRandomPuzzle(puzzleType);
  
  if (puzzle) {
    updateGameState({
      currentPuzzle: puzzle
    });
  } else {
    // Fallback to local puzzles if Firebase fetch fails
    const randomIndex = Math.floor(Math.random() * localPuzzles[puzzleType].length);
    updateGameState({
      currentPuzzle: localPuzzles[puzzleType][randomIndex]
    });
  }
} catch (error) {
  console.error("Error fetching puzzle:", error);
  // Use local fallback
}
```

## Troubleshooting

### Common Firebase Errors

1. **Permission Denied**: Check your Firestore security rules
   ```
   FirebaseError: Missing or insufficient permissions.
   ```
   Solution: Update your security rules to allow the operation.

2. **Invalid API Key**: Check your Firebase configuration
   ```
   FirebaseError: Invalid API key provided.
   ```
   Solution: Ensure you've copied the correct API key from the Firebase Console.

3. **Document Not Found**: Trying to access a non-existent document
   ```
   FirebaseError: No document to update.
   ```
   Solution: Check if the document exists before updating it.

4. **Quota Exceeded**: You've exceeded your Firebase quota
   ```
   FirebaseError: Quota exceeded.
   ```
   Solution: Check your Firebase usage and consider upgrading your plan.

### Debugging Firebase

1. **Enable Firebase Debug Mode**:
   ```javascript
   import { enableLogging } from "firebase/firestore";
   enableLogging(true);
   ```

2. **Check Firebase Console Logs**:
   - Go to the Firebase Console
   - Navigate to "Functions" > "Logs"

3. **Monitor Network Requests**:
   - Open browser DevTools
   - Go to the Network tab
   - Filter for requests to `firestore.googleapis.com`

### Firebase Emulator Suite

For local development, you can use the Firebase Emulator Suite:

1. Install the Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize the emulator:
   ```bash
   firebase init emulators
   ```

3. Start the emulator:
   ```bash
   firebase emulators:start
   ```

4. Connect your app to the emulator:
   ```javascript
   import { connectFirestoreEmulator } from "firebase/firestore";
   
   // In your firebase.js file
   if (process.env.NODE_ENV === 'development') {
     connectFirestoreEmulator(db, 'localhost', 8080);
   }
   ```

This allows you to develop and test your app without affecting your production Firebase project.
