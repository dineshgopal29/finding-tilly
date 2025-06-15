// Enhanced gameService.js with difficulty levels and bonus questions

// Puzzle libraries by difficulty level
const puzzleLibrary = {
  // Explorer level (Ages 3-4) - Easiest puzzles
  explorer: {
    alphabet: [
      { type: 'alphabet', difficulty: 'explorer', question: "What letter comes after A?", answer: "B", options: ["B", "C", "D"] },
      { type: 'alphabet', difficulty: 'explorer', question: "What letter comes before C?", answer: "B", options: ["A", "B", "D"] },
      { type: 'alphabet', difficulty: 'explorer', question: "What letter is missing? A, _, C", answer: "B", options: ["B", "D", "E"] },
      { type: 'alphabet', difficulty: 'explorer', question: "What letter comes after D?", answer: "E", options: ["C", "E", "F"] },
      { type: 'alphabet', difficulty: 'explorer', question: "What letter comes before F?", answer: "E", options: ["D", "E", "G"] }
    ],
    numbers: [
      { type: 'numbers', difficulty: 'explorer', question: "What number comes after 1?", answer: "2", options: ["2", "3", "4"] },
      { type: 'numbers', difficulty: 'explorer', question: "What number comes before 3?", answer: "2", options: ["1", "2", "4"] },
      { type: 'numbers', difficulty: 'explorer', question: "What number is missing? 1, _, 3", answer: "2", options: ["2", "4", "5"] },
      { type: 'numbers', difficulty: 'explorer', question: "What number comes after 4?", answer: "5", options: ["3", "5", "6"] },
      { type: 'numbers', difficulty: 'explorer', question: "What number comes before 5?", answer: "4", options: ["3", "4", "6"] }
    ],
    addition: [
      { type: 'addition', difficulty: 'explorer', question: "What is 1 + 1?", answer: "2", options: ["2", "3", "4"] },
      { type: 'addition', difficulty: 'explorer', question: "What is 2 + 1?", answer: "3", options: ["2", "3", "4"] },
      { type: 'addition', difficulty: 'explorer', question: "What is 1 + 2?", answer: "3", options: ["2", "3", "4"] },
      { type: 'addition', difficulty: 'explorer', question: "What is 2 + 2?", answer: "4", options: ["3", "4", "5"] },
      { type: 'addition', difficulty: 'explorer', question: "What is 3 + 1?", answer: "4", options: ["3", "4", "5"] }
    ]
  },
  
  // Adventurer level (Ages 5-6) - Medium puzzles
  adventurer: {
    alphabet: [
      { type: 'alphabet', difficulty: 'adventurer', question: "What letter comes after P?", answer: "Q", options: ["O", "Q", "R"] },
      { type: 'alphabet', difficulty: 'adventurer', question: "What letter comes before D?", answer: "C", options: ["A", "B", "C"] },
      { type: 'alphabet', difficulty: 'adventurer', question: "What letter is missing? A, B, _, D", answer: "C", options: ["C", "E", "G"] },
      { type: 'alphabet', difficulty: 'adventurer', question: "What letter comes after G?", answer: "H", options: ["F", "H", "I"] },
      { type: 'alphabet', difficulty: 'adventurer', question: "What letter is missing? W, X, _, Z", answer: "Y", options: ["T", "Y", "V"] }
    ],
    numbers: [
      { type: 'numbers', difficulty: 'adventurer', question: "What number comes after 5?", answer: "6", options: ["6", "7", "8"] },
      { type: 'numbers', difficulty: 'adventurer', question: "What number comes before 10?", answer: "9", options: ["8", "9", "11"] },
      { type: 'numbers', difficulty: 'adventurer', question: "What number is missing? 2, 4, 6, _, 10", answer: "8", options: ["7", "8", "9"] },
      { type: 'numbers', difficulty: 'adventurer', question: "What number comes after 14?", answer: "15", options: ["13", "15", "16"] },
      { type: 'numbers', difficulty: 'adventurer', question: "What number is missing? 5, 10, _, 20", answer: "15", options: ["12", "15", "18"] }
    ],
    addition: [
      { type: 'addition', difficulty: 'adventurer', question: "What is 2 + 3?", answer: "5", options: ["4", "5", "6"] },
      { type: 'addition', difficulty: 'adventurer', question: "What is 4 + 4?", answer: "8", options: ["7", "8", "9"] },
      { type: 'addition', difficulty: 'adventurer', question: "What is 5 + 3?", answer: "8", options: ["7", "8", "10"] },
      { type: 'addition', difficulty: 'adventurer', question: "What is 6 + 2?", answer: "8", options: ["7", "8", "9"] },
      { type: 'addition', difficulty: 'adventurer', question: "What is 7 + 3?", answer: "10", options: ["9", "10", "11"] }
    ]
  },
  
  // Champion level (Ages 7-10) - Harder puzzles
  champion: {
    alphabet: [
      { type: 'alphabet', difficulty: 'champion', question: "What letter comes 3 letters after D?", answer: "G", options: ["F", "G", "H"] },
      { type: 'alphabet', difficulty: 'champion', question: "What letter comes 2 letters before J?", answer: "H", options: ["G", "H", "I"] },
      { type: 'alphabet', difficulty: 'champion', question: "What letter is missing? D, H, L, _", answer: "P", options: ["O", "P", "Q"] },
      { type: 'alphabet', difficulty: 'champion', question: "What letter comes 4 letters after M?", answer: "Q", options: ["P", "Q", "R"] },
      { type: 'alphabet', difficulty: 'champion', question: "What letter is missing? B, D, F, _, J", answer: "H", options: ["G", "H", "I"] }
    ],
    numbers: [
      { type: 'numbers', difficulty: 'champion', question: "What number comes 3 numbers after 7?", answer: "10", options: ["9", "10", "11"] },
      { type: 'numbers', difficulty: 'champion', question: "What number comes 2 numbers before 15?", answer: "13", options: ["12", "13", "14"] },
      { type: 'numbers', difficulty: 'champion', question: "What number is missing? 5, 10, 15, _", answer: "20", options: ["18", "19", "20"] },
      { type: 'numbers', difficulty: 'champion', question: "What number is missing? 2, 4, 8, _", answer: "16", options: ["12", "14", "16"] },
      { type: 'numbers', difficulty: 'champion', question: "What number is missing? 25, 20, 15, _, 5", answer: "10", options: ["10", "12", "14"] }
    ],
    addition: [
      { type: 'addition', difficulty: 'champion', question: "What is 12 + 5?", answer: "17", options: ["16", "17", "18"] },
      { type: 'addition', difficulty: 'champion', question: "What is 8 + 7?", answer: "15", options: ["14", "15", "16"] },
      { type: 'addition', difficulty: 'champion', question: "What is 9 + 8?", answer: "17", options: ["16", "17", "18"] },
      { type: 'addition', difficulty: 'champion', question: "What is 11 + 6?", answer: "17", options: ["16", "17", "19"] },
      { type: 'addition', difficulty: 'champion', question: "What is 7 + 9?", answer: "16", options: ["15", "16", "17"] }
    ]
  },
  
  // Bonus questions - Extra challenging
  bonus: {
    alphabet: [
      { type: 'alphabet', difficulty: 'bonus', question: "What letter is 5 letters after J?", answer: "O", options: ["M", "N", "O"] },
      { type: 'alphabet', difficulty: 'bonus', question: "What letter is 3 letters before P?", answer: "M", options: ["L", "M", "N"] },
      { type: 'alphabet', difficulty: 'bonus', question: "What letter is missing? A, E, I, _, Q", answer: "M", options: ["K", "M", "O"] },
      { type: 'alphabet', difficulty: 'bonus', question: "What letter is 7 letters after C?", answer: "J", options: ["I", "J", "K"] },
      { type: 'alphabet', difficulty: 'bonus', question: "What letter is missing? B, E, H, K, _", answer: "N", options: ["M", "N", "O"] }
    ],
    numbers: [
      { type: 'numbers', difficulty: 'bonus', question: "What number is 5 more than 12?", answer: "17", options: ["16", "17", "18"] },
      { type: 'numbers', difficulty: 'bonus', question: "What number is 4 less than 20?", answer: "16", options: ["15", "16", "17"] },
      { type: 'numbers', difficulty: 'bonus', question: "What number is missing? 3, 6, 12, _", answer: "24", options: ["18", "21", "24"] },
      { type: 'numbers', difficulty: 'bonus', question: "What number is missing? 2, 6, 18, _", answer: "54", options: ["36", "42", "54"] },
      { type: 'numbers', difficulty: 'bonus', question: "What number is missing? 25, 20, _, 10, 5", answer: "15", options: ["12", "15", "18"] }
    ],
    addition: [
      { type: 'addition', difficulty: 'bonus', question: "What is 14 + 8?", answer: "22", options: ["21", "22", "23"] },
      { type: 'addition', difficulty: 'bonus', question: "What is 16 + 7?", answer: "23", options: ["22", "23", "24"] },
      { type: 'addition', difficulty: 'bonus', question: "What is 9 + 12?", answer: "21", options: ["20", "21", "22"] },
      { type: 'addition', difficulty: 'bonus', question: "What is 13 + 9?", answer: "22", options: ["21", "22", "24"] },
      { type: 'addition', difficulty: 'bonus', question: "What is 15 + 8?", answer: "23", options: ["22", "23", "25"] }
    ]
  }
};

// Track used puzzles to prevent immediate repeats
const usedPuzzles = {
  explorer: {
    alphabet: [],
    numbers: [],
    addition: []
  },
  adventurer: {
    alphabet: [],
    numbers: [],
    addition: []
  },
  champion: {
    alphabet: [],
    numbers: [],
    addition: []
  },
  bonus: {
    alphabet: [],
    numbers: [],
    addition: []
  }
};

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

// Fetch puzzles by type (for compatibility)
export const fetchPuzzles = async (type, skillLevel = 'adventurer') => {
  return puzzleLibrary[skillLevel]?.[type] || [];
};

// Update user progress (mock implementation)
export const updateUserProgress = async (userId, progressData) => {
  try {
    console.log("Updating progress for user:", userId, progressData);
    return true;
  } catch (error) {
    console.error("Error updating user progress:", error);
    return false;
  }
};

// Get user progress (mock implementation)
export const getUserProgress = async (userId) => {
  try {
    console.log("Getting progress for user:", userId);
    return {
      totalPuzzlesSolved: 0,
      alphabetPuzzlesSolved: 0,
      numberPuzzlesSolved: 0,
      additionPuzzlesSolved: 0,
      hintsUsed: 0,
      lastPlayed: new Date()
    };
  } catch (error) {
    console.error("Error getting user progress:", error);
    return {};
  }
};

// Fetch leaderboard data with current player included
export const fetchLeaderboard = async (limit = 10, currentUser = null) => {
  try {
    // Sample leaderboard data
    const sampleData = [
      {
        id: 'user1',
        name: 'Alex',
        puzzlesSolved: 15,
        badges: [{type: 'alphabet', level: 'gold', name: 'Alphabet Champion', icon: '🏆'}]
      },
      {
        id: 'user2',
        name: 'Sam',
        puzzlesSolved: 12,
        badges: [{type: 'number', level: 'silver', name: 'Number Master', icon: '📊'}]
      },
      {
        id: 'user3',
        name: 'Jordan',
        puzzlesSolved: 8,
        badges: [{type: 'addition', level: 'bronze', name: 'Addition Explorer', icon: '➕'}]
      }
    ];
    
    // If we have a current user, add them to the leaderboard
    if (currentUser) {
      const userEntry = {
        id: currentUser.uid,
        name: currentUser.displayName,
        puzzlesSolved: currentUser.progress?.totalPuzzlesSolved || 0,
        badges: currentUser.badges || []
      };
      
      // Add user to leaderboard data
      sampleData.push(userEntry);
    }
    
    // Sort by puzzles solved (highest first)
    const sortedData = sampleData.sort((a, b) => b.puzzlesSolved - a.puzzlesSolved);
    
    return sortedData.slice(0, limit);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
};
