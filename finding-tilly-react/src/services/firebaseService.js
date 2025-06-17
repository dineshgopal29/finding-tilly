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
  limit, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

// User-related functions
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    throw error;
  }
};

export const updateUserProgress = async (userId, progressData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'progress': progressData,
      'lastUpdated': serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating user progress:", error);
    throw error;
  }
};

// Game-related functions
export const saveGameSession = async (userId, gameData) => {
  try {
    const gameSessionRef = collection(db, 'gameSessions');
    await addDoc(gameSessionRef, {
      userId,
      ...gameData,
      timestamp: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error saving game session:", error);
    throw error;
  }
};

export const getUserGameHistory = async (userId, limitCount = 10) => {
  try {
    const gameSessionsQuery = query(
      collection(db, 'gameSessions'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(gameSessionsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting user game history:", error);
    throw error;
  }
};

// Leaderboard functions
export const getLeaderboard = async (limitCount = 10) => {
  try {
    const usersQuery = query(
      collection(db, 'users'),
      orderBy('progress.totalPuzzlesSolved', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(usersQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      displayName: doc.data().displayName,
      puzzlesSolved: doc.data().progress?.totalPuzzlesSolved || 0,
      skillLevel: doc.data().skillLevel || 'adventurer',
      lastPlayed: doc.data().lastUpdated
    }));
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    throw error;
  }
};

// Badge functions
export const getUserBadges = async (userId) => {
  try {
    const badgesQuery = query(
      collection(db, 'badges'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(badgesQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting user badges:", error);
    throw error;
  }
};

export const awardBadge = async (userId, badgeData) => {
  try {
    const badgesRef = collection(db, 'badges');
    await addDoc(badgesRef, {
      userId,
      ...badgeData,
      awardedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error awarding badge:", error);
    throw error;
  }
};

// Puzzle functions
export const savePuzzleResult = async (userId, puzzleData) => {
  try {
    const puzzleResultsRef = collection(db, 'puzzleResults');
    await addDoc(puzzleResultsRef, {
      userId,
      ...puzzleData,
      timestamp: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error saving puzzle result:", error);
    throw error;
  }
};

export const getPuzzleStats = async (userId) => {
  try {
    const puzzleStatsQuery = query(
      collection(db, 'puzzleResults'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(puzzleStatsQuery);
    const results = querySnapshot.docs.map(doc => doc.data());
    
    // Calculate stats
    const stats = {
      total: results.length,
      correct: results.filter(r => r.correct).length,
      byType: {
        alphabet: results.filter(r => r.type === 'alphabet').length,
        numbers: results.filter(r => r.type === 'numbers').length,
        addition: results.filter(r => r.type === 'addition').length
      },
      byDifficulty: {
        explorer: results.filter(r => r.difficulty === 'explorer').length,
        adventurer: results.filter(r => r.difficulty === 'adventurer').length,
        champion: results.filter(r => r.difficulty === 'champion').length
      }
    };
    
    return stats;
  } catch (error) {
    console.error("Error getting puzzle stats:", error);
    throw error;
  }
};
