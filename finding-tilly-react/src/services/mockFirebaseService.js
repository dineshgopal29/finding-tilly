// Mock Firebase service for testing

// Mock user database
const users = [
  {
    uid: 'user1',
    email: 'test@example.com',
    password: 'password123',
    displayName: 'Test User',
    progress: {
      totalPuzzlesSolved: 15,
      alphabetPuzzlesSolved: 5,
      numberPuzzlesSolved: 5,
      additionPuzzlesSolved: 5,
      hintsUsed: 3
    }
  }
];

// Mock leaderboard data
const leaderboard = [
  {
    id: 'user1',
    displayName: 'Alex',
    puzzlesSolved: 15,
    skillLevel: 'novice',
    lastPlayed: new Date('2023-06-10')
  },
  {
    id: 'user2',
    displayName: 'Sam',
    puzzlesSolved: 12,
    skillLevel: 'scholar',
    lastPlayed: new Date('2023-06-12')
  },
  {
    id: 'user3',
    displayName: 'Jordan',
    puzzlesSolved: 20,
    skillLevel: 'master',
    lastPlayed: new Date('2023-06-15')
  }
];

// Mock authentication functions
export const mockAuth = {
  // Sign in with email and password
  signIn: (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          resolve({ ...user, password: undefined });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  },
  
  // Sign up with email and password
  signUp: (email, password, displayName) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (users.some(u => u.email === email)) {
          reject(new Error('Email already in use'));
          return;
        }
        
        const newUser = {
          uid: `user${users.length + 1}`,
          email,
          password,
          displayName,
          progress: {
            totalPuzzlesSolved: 0,
            alphabetPuzzlesSolved: 0,
            numberPuzzlesSolved: 0,
            additionPuzzlesSolved: 0,
            hintsUsed: 0
          }
        };
        
        users.push(newUser);
        resolve({ ...newUser, password: undefined });
      }, 500);
    });
  },
  
  // Sign out
  signOut: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
  }
};

// Mock database functions
export const mockDb = {
  // Get user data
  getUserData: (userId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(u => u.uid === userId);
        if (user) {
          resolve({ ...user, password: undefined });
        } else {
          reject(new Error('User not found'));
        }
      }, 300);
    });
  },
  
  // Update user progress
  updateUserProgress: (userId, progressData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userIndex = users.findIndex(u => u.uid === userId);
        if (userIndex !== -1) {
          users[userIndex].progress = {
            ...users[userIndex].progress,
            ...progressData
          };
          resolve(true);
        } else {
          reject(new Error('User not found'));
        }
      }, 300);
    });
  },
  
  // Get leaderboard
  getLeaderboard: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...leaderboard]);
      }, 300);
    });
  },
  
  // Save game session
  saveGameSession: (userId, gameData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Game session saved:', userId, gameData);
        resolve(true);
      }, 300);
    });
  }
};

export default { mockAuth, mockDb };
