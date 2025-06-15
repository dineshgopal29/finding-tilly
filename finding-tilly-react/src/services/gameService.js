// Enhanced gameService.js with improved randomness and more puzzles

// Generate dynamic alphabet puzzles
const generateAlphabetPuzzles = (difficulty) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const puzzles = [];
  
  // Helper function to get random letter
  const getRandomLetter = (exclude = []) => {
    let letter;
    do {
      letter = alphabet[Math.floor(Math.random() * alphabet.length)];
    } while (exclude.includes(letter));
    return letter;
  };
  
  // Generate "what comes after" puzzles
  for (let i = 0; i < alphabet.length - 1; i++) {
    const letter = alphabet[i];
    const nextLetter = alphabet[i + 1];
    
    // Skip some letters based on difficulty
    if (difficulty === 'explorer' && !['A', 'C', 'E', 'G', 'I', 'K', 'M', 'O'].includes(letter)) continue;
    if (difficulty === 'adventurer' && i % 3 !== 0) continue;
    if (difficulty === 'champion' && i % 2 !== 0) continue;
    
    // Generate wrong options
    const wrongOptions = [];
    while (wrongOptions.length < 2) {
      const wrongOption = getRandomLetter([nextLetter, ...wrongOptions]);
      wrongOptions.push(wrongOption);
    }
    
    puzzles.push({
      type: 'alphabet',
      difficulty,
      question: `What letter comes after ${letter}?`,
      answer: nextLetter,
      options: [nextLetter, ...wrongOptions].sort(() => Math.random() - 0.5)
    });
  }
  
  // Generate "what comes before" puzzles
  for (let i = 1; i < alphabet.length; i++) {
    const letter = alphabet[i];
    const prevLetter = alphabet[i - 1];
    
    // Skip some letters based on difficulty
    if (difficulty === 'explorer' && !['B', 'D', 'F', 'H', 'J', 'L', 'N'].includes(letter)) continue;
    if (difficulty === 'adventurer' && i % 3 !== 1) continue;
    if (difficulty === 'champion' && i % 2 !== 1) continue;
    
    // Generate wrong options
    const wrongOptions = [];
    while (wrongOptions.length < 2) {
      const wrongOption = getRandomLetter([prevLetter, ...wrongOptions]);
      wrongOptions.push(wrongOption);
    }
    
    puzzles.push({
      type: 'alphabet',
      difficulty,
      question: `What letter comes before ${letter}?`,
      answer: prevLetter,
      options: [prevLetter, ...wrongOptions].sort(() => Math.random() - 0.5)
    });
  }
  
  // Generate "what is missing" puzzles
  for (let i = 1; i < alphabet.length - 1; i++) {
    const prevLetter = alphabet[i - 1];
    const letter = alphabet[i];
    const nextLetter = alphabet[i + 1];
    
    // Skip some letters based on difficulty
    if (difficulty === 'explorer' && !['B', 'D', 'F', 'H', 'J', 'L'].includes(letter)) continue;
    if (difficulty === 'adventurer' && i % 3 !== 2) continue;
    if (difficulty === 'champion' && i % 2 !== 0) continue;
    
    // Generate wrong options
    const wrongOptions = [];
    while (wrongOptions.length < 2) {
      const wrongOption = getRandomLetter([letter, ...wrongOptions]);
      wrongOptions.push(wrongOption);
    }
    
    puzzles.push({
      type: 'alphabet',
      difficulty,
      question: `What letter is missing? ${prevLetter}, _, ${nextLetter}`,
      answer: letter,
      options: [letter, ...wrongOptions].sort(() => Math.random() - 0.5)
    });
  }
  
  // For champion level, add pattern puzzles
  if (difficulty === 'champion' || difficulty === 'bonus') {
    const patterns = [
      { step: 2, desc: "every other letter" },
      { step: 3, desc: "every third letter" },
      { step: 4, desc: "every fourth letter" }
    ];
    
    patterns.forEach(pattern => {
      for (let i = 0; i < alphabet.length - pattern.step * 3; i += 2) {
        const first = alphabet[i];
        const second = alphabet[i + pattern.step];
        const third = alphabet[i + pattern.step * 2];
        const answer = alphabet[i + pattern.step * 3];
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomLetter([answer, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          type: 'alphabet',
          difficulty,
          question: `What letter comes next? ${first}, ${second}, ${third}, _`,
          answer,
          options: [answer, ...wrongOptions].sort(() => Math.random() - 0.5)
        });
      }
    });
  }
  
  return puzzles;
};

// Generate dynamic number puzzles
const generateNumberPuzzles = (difficulty) => {
  const puzzles = [];
  
  // Helper function to get random number in range
  const getRandomNumber = (min, max, exclude = []) => {
    let num;
    do {
      num = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (exclude.includes(num));
    return num;
  };
  
  // Define ranges based on difficulty
  const ranges = {
    explorer: { min: 1, max: 10 },
    adventurer: { min: 1, max: 20 },
    champion: { min: 1, max: 50 },
    bonus: { min: 1, max: 100 }
  };
  
  const { min, max } = ranges[difficulty];
  
  // Generate "what comes after" puzzles
  for (let i = min; i < max; i++) {
    // Skip some numbers based on difficulty
    if (difficulty === 'explorer' && i > 5 && i % 2 !== 0) continue;
    if (difficulty === 'adventurer' && i > 10 && i % 3 !== 0) continue;
    if (difficulty === 'champion' && i % 5 !== 0 && i % 7 !== 0) continue;
    
    const nextNumber = i + 1;
    
    // Generate wrong options
    const wrongOptions = [];
    while (wrongOptions.length < 2) {
      const wrongOption = getRandomNumber(i + 2, i + 5, [nextNumber, ...wrongOptions]);
      wrongOptions.push(wrongOption);
    }
    
    puzzles.push({
      type: 'numbers',
      difficulty,
      question: `What number comes after ${i}?`,
      answer: String(nextNumber),
      options: [String(nextNumber), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5)
    });
  }
  
  // Generate "what comes before" puzzles
  for (let i = min + 1; i <= max; i++) {
    // Skip some numbers based on difficulty
    if (difficulty === 'explorer' && i > 5 && i % 2 !== 0) continue;
    if (difficulty === 'adventurer' && i > 10 && i % 3 !== 0) continue;
    if (difficulty === 'champion' && i % 5 !== 0 && i % 7 !== 0) continue;
    
    const prevNumber = i - 1;
    
    // Generate wrong options
    const wrongOptions = [];
    while (wrongOptions.length < 2) {
      const wrongOption = getRandomNumber(Math.max(min, i - 5), i - 2, [prevNumber, ...wrongOptions]);
      wrongOptions.push(wrongOption);
    }
    
    puzzles.push({
      type: 'numbers',
      difficulty,
      question: `What number comes before ${i}?`,
      answer: String(prevNumber),
      options: [String(prevNumber), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5)
    });
  }
  
  // Generate "what is missing" puzzles
  for (let i = min + 1; i < max; i++) {
    // Skip some numbers based on difficulty
    if (difficulty === 'explorer' && i > 5 && i % 2 !== 0) continue;
    if (difficulty === 'adventurer' && i > 10 && i % 3 !== 0) continue;
    if (difficulty === 'champion' && i % 5 !== 0 && i % 7 !== 0) continue;
    
    const prevNumber = i - 1;
    const nextNumber = i + 1;
    
    // Generate wrong options
    const wrongOptions = [];
    while (wrongOptions.length < 2) {
      const wrongOption = getRandomNumber(min, max, [i, ...wrongOptions]);
      wrongOptions.push(wrongOption);
    }
    
    puzzles.push({
      type: 'numbers',
      difficulty,
      question: `What number is missing? ${prevNumber}, _, ${nextNumber}`,
      answer: String(i),
      options: [String(i), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5)
    });
  }
  
  // Generate pattern puzzles
  if (difficulty === 'adventurer' || difficulty === 'champion' || difficulty === 'bonus') {
    // Define patterns based on difficulty
    const patterns = [];
    
    if (difficulty === 'adventurer') {
      patterns.push(
        { step: 2, count: 4, start: 2 },  // 2, 4, 6, 8
        { step: 5, count: 4, start: 5 }   // 5, 10, 15, 20
      );
    }
    
    if (difficulty === 'champion') {
      patterns.push(
        { step: 3, count: 4, start: 3 },   // 3, 6, 9, 12
        { step: 5, count: 4, start: 5 },   // 5, 10, 15, 20
        { step: 10, count: 4, start: 10 }, // 10, 20, 30, 40
        { step: -5, count: 4, start: 25 }  // 25, 20, 15, 10
      );
    }
    
    if (difficulty === 'bonus') {
      patterns.push(
        { step: 2, count: 5, start: 1 },    // 1, 3, 5, 7, 9
        { step: 3, count: 5, start: 2 },    // 2, 5, 8, 11, 14
        { step: 5, count: 5, start: 5 },    // 5, 10, 15, 20, 25
        { step: -10, count: 5, start: 50 }, // 50, 40, 30, 20, 10
        { multiply: 2, count: 4, start: 2 } // 2, 4, 8, 16
      );
    }
    
    patterns.forEach(pattern => {
      const sequence = [];
      let current = pattern.start;
      
      for (let i = 0; i < pattern.count; i++) {
        sequence.push(current);
        if (pattern.multiply) {
          current *= pattern.multiply;
        } else {
          current += pattern.step;
        }
      }
      
      // Create missing number puzzles from the sequence
      for (let i = 1; i < sequence.length - 1; i++) {
        const missingNumber = sequence[i];
        const sequenceCopy = [...sequence];
        sequenceCopy[i] = '_';
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomNumber(
            Math.max(min, missingNumber - 10), 
            Math.min(max, missingNumber + 10), 
            [missingNumber, ...wrongOptions]
          );
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          type: 'numbers',
          difficulty,
          question: `What number is missing? ${sequenceCopy.join(', ')}`,
          answer: String(missingNumber),
          options: [String(missingNumber), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5)
        });
      }
      
      // Create "what comes next" puzzles
      const nextNumber = sequence[sequence.length - 1];
      const sequenceWithoutLast = sequence.slice(0, -1);
      
      // Generate wrong options
      const wrongOptions = [];
      while (wrongOptions.length < 2) {
        const wrongOption = getRandomNumber(
          Math.max(min, nextNumber - 10), 
          Math.min(max, nextNumber + 10), 
          [nextNumber, ...wrongOptions]
        );
        wrongOptions.push(wrongOption);
      }
      
      puzzles.push({
        type: 'numbers',
        difficulty,
        question: `What number comes next? ${sequenceWithoutLast.join(', ')}, _`,
        answer: String(nextNumber),
        options: [String(nextNumber), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5)
      });
    });
  }
  
  return puzzles;
};

// Generate dynamic addition puzzles
const generateAdditionPuzzles = (difficulty) => {
  const puzzles = [];
  
  // Define ranges based on difficulty
  const ranges = {
    explorer: { max: 5, maxSum: 5 },
    adventurer: { max: 10, maxSum: 10 },
    champion: { max: 12, maxSum: 20 },
    bonus: { max: 20, maxSum: 30 }
  };
  
  const { max, maxSum } = ranges[difficulty];
  
  // Generate addition puzzles
  for (let a = 1; a <= max; a++) {
    for (let b = 1; b <= max; b++) {
      const sum = a + b;
      
      // Skip if sum is too large for this difficulty
      if (sum > maxSum) continue;
      
      // Skip some combinations based on difficulty
      if (difficulty === 'explorer' && a > 3 && b > 3) continue;
      if (difficulty === 'adventurer' && a + b > 15) continue;
      
      // Generate wrong options
      const wrongOptions = [];
      while (wrongOptions.length < 2) {
        // Generate wrong answers close to the correct sum
        const offset = Math.floor(Math.random() * 3) + 1;
        const direction = Math.random() > 0.5 ? 1 : -1;
        const wrongOption = sum + (offset * direction);
        
        // Ensure wrong option is positive and not the same as the correct answer
        if (wrongOption > 0 && wrongOption !== sum && !wrongOptions.includes(wrongOption)) {
          wrongOptions.push(wrongOption);
        }
      }
      
      puzzles.push({
        type: 'addition',
        difficulty,
        question: `What is ${a} + ${b}?`,
        answer: String(sum),
        options: [String(sum), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5)
      });
    }
  }
  
  return puzzles;
};

// Generate all puzzles
const generateAllPuzzles = () => {
  const difficulties = ['explorer', 'adventurer', 'champion', 'bonus'];
  const puzzleLibrary = {};
  
  difficulties.forEach(difficulty => {
    puzzleLibrary[difficulty] = {
      alphabet: generateAlphabetPuzzles(difficulty),
      numbers: generateNumberPuzzles(difficulty),
      addition: generateAdditionPuzzles(difficulty)
    };
  });
  
  return puzzleLibrary;
};

// Generate the puzzle library
const puzzleLibrary = generateAllPuzzles();

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

// Track puzzles used in the current game session
const sessionUsedPuzzles = {
  explorer: {
    alphabet: new Set(),
    numbers: new Set(),
    addition: new Set()
  },
  adventurer: {
    alphabet: new Set(),
    numbers: new Set(),
    addition: new Set()
  },
  champion: {
    alphabet: new Set(),
    numbers: new Set(),
    addition: new Set()
  },
  bonus: {
    alphabet: new Set(),
    numbers: new Set(),
    addition: new Set()
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
    
    // Filter out recently used puzzles (both in current session and recent history)
    let availablePuzzles = puzzles.filter(puzzle => 
      !usedPuzzles[actualDifficulty][type].includes(puzzle.question) &&
      !sessionUsedPuzzles[actualDifficulty][type].has(puzzle.question)
    );
    
    // If we've used too many puzzles in this session, reset the session tracking
    if (availablePuzzles.length < puzzles.length * 0.2) {
      console.log("Running low on puzzles, resetting session tracking for type:", type);
      sessionUsedPuzzles[actualDifficulty][type].clear();
      
      // Refilter with only the recent history filter
      availablePuzzles = puzzles.filter(puzzle => 
        !usedPuzzles[actualDifficulty][type].includes(puzzle.question)
      );
    }
    
    // If we've used all puzzles in recent history, reset that too
    if (availablePuzzles.length === 0) {
      console.log("All puzzles used in recent history, resetting for type:", type);
      usedPuzzles[actualDifficulty][type] = [];
      availablePuzzles = puzzles.filter(puzzle => 
        !sessionUsedPuzzles[actualDifficulty][type].has(puzzle.question)
      );
    }
    
    // If we still have no puzzles, just use all puzzles
    if (availablePuzzles.length === 0) {
      console.log("No available puzzles after filtering, using all puzzles for type:", type);
      availablePuzzles = puzzles;
    }
    
    // Get a random puzzle
    const randomIndex = Math.floor(Math.random() * availablePuzzles.length);
    const selectedPuzzle = availablePuzzles[randomIndex];
    
    // Add to used puzzles tracking
    usedPuzzles[actualDifficulty][type].push(selectedPuzzle.question);
    sessionUsedPuzzles[actualDifficulty][type].add(selectedPuzzle.question);
    
    // Keep used puzzles list from growing too large
    if (usedPuzzles[actualDifficulty][type].length > Math.min(10, puzzles.length / 2)) {
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

// Reset session puzzle tracking (call this when starting a new game)
export const resetSessionPuzzles = () => {
  Object.keys(sessionUsedPuzzles).forEach(difficulty => {
    Object.keys(sessionUsedPuzzles[difficulty]).forEach(type => {
      sessionUsedPuzzles[difficulty][type].clear();
    });
  });
  console.log("Session puzzle tracking reset");
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
