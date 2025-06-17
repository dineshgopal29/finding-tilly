// Game state
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
    difficulty: "novice", // Default difficulty level
    
    // Educational puzzles by category and difficulty
    puzzles: {
        novice: {
            alphabet: [
                { question: "What letter comes after A?", answer: "B", options: ["B", "C", "D"] },
                { question: "What letter comes before D?", answer: "C", options: ["A", "B", "C"] },
                { question: "What letter is missing? A, B, _, D", answer: "C", options: ["C", "E", "G"] },
                { question: "What letter comes after P?", answer: "Q", options: ["O", "Q", "R"] },
                { question: "What letter is missing? W, X, _, Z", answer: "Y", options: ["T", "Y", "V"] }
            ],
            numbers: [
                { question: "What number comes after 5?", answer: "6", options: ["6", "7", "8"] },
                { question: "What number comes before 10?", answer: "9", options: ["8", "9", "11"] },
                { question: "What number is missing? 2, 4, 6, _, 10", answer: "8", options: ["7", "8", "9"] },
                { question: "What number comes after 14?", answer: "15", options: ["13", "15", "16"] },
                { question: "What number is missing? 5, 10, _, 20", answer: "15", options: ["12", "15", "18"] }
            ],
            addition: [
                { question: "What is 2 + 3?", answer: "5", options: ["4", "5", "6"] },
                { question: "What is 4 + 4?", answer: "8", options: ["7", "8", "9"] },
                { question: "What is 5 + 3?", answer: "8", options: ["7", "8", "10"] },
                { question: "What is 6 + 2?", answer: "8", options: ["7", "8", "9"] },
                { question: "What is 7 + 3?", answer: "10", options: ["9", "10", "11"] }
            ]
        },
        scholar: {
            alphabet: [
                { question: "What letter is 3 letters after J?", answer: "M", options: ["L", "M", "N"] },
                { question: "What letter is 2 letters before P?", answer: "N", options: ["M", "N", "O"] },
                { question: "What is the 5th letter of the alphabet?", answer: "E", options: ["D", "E", "F"] },
                { question: "What letter is missing? M, _, O, P", answer: "N", options: ["L", "N", "Q"] },
                { question: "What letter comes 4 letters after R?", answer: "V", options: ["U", "V", "W"] }
            ],
            numbers: [
                { question: "What number is 10 more than 25?", answer: "35", options: ["33", "35", "37"] },
                { question: "What number is 5 less than 42?", answer: "37", options: ["36", "37", "38"] },
                { question: "What number is missing? 10, 20, 30, _, 50", answer: "40", options: ["35", "40", "45"] },
                { question: "What is double 17?", answer: "34", options: ["32", "34", "36"] },
                { question: "What is half of 50?", answer: "25", options: ["20", "25", "30"] }
            ],
            addition: [
                { question: "What is 12 + 15?", answer: "27", options: ["25", "27", "29"] },
                { question: "What is 23 + 19?", answer: "42", options: ["40", "42", "44"] },
                { question: "What is 37 + 16?", answer: "53", options: ["51", "53", "55"] },
                { question: "What is 45 + 28?", answer: "73", options: ["71", "73", "75"] },
                { question: "What is 56 + 37?", answer: "93", options: ["91", "93", "95"] }
            ]
        },
        master: {
            alphabet: [
                { question: "If A=1, B=2, what number is H?", answer: "8", options: ["7", "8", "9"] },
                { question: "What is the 3rd letter before the last letter of the alphabet?", answer: "W", options: ["V", "W", "X"] },
                { question: "What letter is exactly in the middle of the alphabet?", answer: "M", options: ["M", "N", "L"] },
                { question: "If you reverse the first 5 letters of the alphabet, what's the 3rd letter?", answer: "C", options: ["B", "C", "D"] },
                { question: "What letter is at the same position from the end as G is from the start?", answer: "T", options: ["S", "T", "U"] }
            ],
            numbers: [
                { question: "What is the next number? 3, 6, 12, 24, _", answer: "48", options: ["36", "48", "60"] },
                { question: "What is the missing number? 2, 6, 12, 20, _, 42", answer: "30", options: ["28", "30", "32"] },
                { question: "If you add the first 5 positive integers, what do you get?", answer: "15", options: ["10", "15", "20"] },
                { question: "What is 3 squared times 4?", answer: "36", options: ["24", "36", "48"] },
                { question: "What is the sum of the first 3 prime numbers?", answer: "10", options: ["8", "10", "12"] }
            ],
            addition: [
                { question: "What is 125 + 75?", answer: "200", options: ["175", "200", "225"] },
                { question: "What is 246 + 198?", answer: "444", options: ["424", "444", "464"] },
                { question: "What is 333 + 222?", answer: "555", options: ["535", "555", "575"] },
                { question: "What is 512 + 319?", answer: "831", options: ["821", "831", "841"] },
                { question: "What is 777 + 888?", answer: "1665", options: ["1655", "1665", "1675"] }
            ]
        }
    },
    
    // Bonus puzzles for each difficulty level
    bonusPuzzles: {
        novice: [
            { question: "What is 5 + 5 + 5?", answer: "15", options: ["10", "15", "20"] },
            { question: "What letter comes after Z?", answer: "None", options: ["A", "None", "AA"] },
            { question: "Count the vowels: A E I O U. How many?", answer: "5", options: ["4", "5", "6"] }
        ],
        scholar: [
            { question: "If today is Monday, what day will it be in 10 days?", answer: "Thursday", options: ["Wednesday", "Thursday", "Friday"] },
            { question: "What is 100 - 25 + 10?", answer: "85", options: ["75", "85", "95"] },
            { question: "How many sides does a hexagon have?", answer: "6", options: ["5", "6", "7"] }
        ],
        master: [
            { question: "If 3x + 7 = 22, what is x?", answer: "5", options: ["4", "5", "6"] },
            { question: "What is the square root of 144?", answer: "12", options: ["10", "12", "14"] },
            { question: "If a triangle has angles of 30° and 60°, what is the third angle?", answer: "90°", options: ["80°", "90°", "100°"] }
        ]
    },
    
    // Game locations and their properties
    locations: {
        "home": {
            description: "You are at home. Tilly left a puzzle for you to solve!",
            connections: ["garden", "kitchen", "bedroom"],
            puzzleType: "alphabet",
            emoji: "🏠"
        },
        "garden": {
            description: "You're in a beautiful garden. There's a puzzle hidden among the flowers!",
            connections: ["home", "playground"],
            puzzleType: "numbers",
            emoji: "🌺"
        },
        "kitchen": {
            description: "The kitchen smells like cookies! Tilly left a math puzzle on the counter.",
            connections: ["home", "dining_room"],
            puzzleType: "addition",
            emoji: "🍽️"
        },
        "bedroom": {
            description: "This is your cozy bedroom. There's a letter puzzle on your desk!",
            connections: ["home", "closet"],
            puzzleType: "alphabet",
            emoji: "🛏️"
        },
        "playground": {
            description: "A fun playground with swings and slides! You found a number puzzle.",
            connections: ["garden", "treehouse"],
            puzzleType: "numbers",
            emoji: "🛝"
        },
        "dining_room": {
            description: "A large table sits in the middle of this room. There's a math puzzle on it!",
            connections: ["kitchen"],
            puzzleType: "addition",
            emoji: "🍴"
        },
        "closet": {
            description: "A small closet with clothes. You found a letter puzzle hidden inside!",
            connections: ["bedroom"],
            puzzleType: "alphabet",
            emoji: "👕"
        },
        "treehouse": {
            description: "An awesome treehouse high up in a tree! There's a tricky puzzle here.",
            connections: ["playground"],
            puzzleType: "addition",
            emoji: "🌳"
        }
    },
    
    // Leaderboard data
    leaderboard: [
        { name: "Alex", level: "novice", puzzles: 5, moves: 12, date: "2025-06-15" },
        { name: "Sam", level: "scholar", puzzles: 5, moves: 15, date: "2025-06-14" },
        { name: "Jordan", level: "master", puzzles: 5, moves: 10, date: "2025-06-13" }
    ]
};

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const winScreen = document.getElementById('win-screen');
const bonusScreen = document.getElementById('bonus-screen');
const leaderboardScreen = document.getElementById('leaderboard-screen');
const playerNameInput = document.getElementById('player-name');
const startButton = document.getElementById('start-button');
const playerNameDisplay = document.getElementById('player-name-display');
const levelDisplay = document.getElementById('level-display');
const movesCounter = document.getElementById('moves-counter');
const puzzlesSolvedCounter = document.getElementById('puzzles-solved-counter');
const locationImage = document.getElementById('location-image');
const locationDescription = document.getElementById('location-description');
const directionButtons = document.getElementById('direction-buttons');
const puzzleContainer = document.getElementById('puzzle-container');
const puzzleQuestion = document.getElementById('puzzle-question');
const puzzleOptions = document.getElementById('puzzle-options');
const hintButton = document.getElementById('hint-button');
const lookButton = document.getElementById('look-button');
const messageBox = document.getElementById('message-box');
const winStats = document.getElementById('win-stats');
const playAgainButton = document.getElementById('play-again-button');
const printCertificateButton = document.getElementById('print-certificate-button');
const leaderboardButton = document.getElementById('leaderboard-button');
const closeLeaderboardButton = document.getElementById('close-leaderboard-button');
const logoutButton = document.getElementById('logout-button');
const certificateName = document.getElementById('certificate-name');
const certificateStats = document.getElementById('certificate-stats');
const certificateDate = document.getElementById('certificate-date');
const progressBarInner = document.getElementById('progress-bar-inner');
const bonusPuzzleQuestion = document.getElementById('bonus-puzzle-question');
const bonusPuzzleOptions = document.getElementById('bonus-puzzle-options');
const bonusMessage = document.getElementById('bonus-message');
const continueAfterBonusButton = document.getElementById('continue-after-bonus-button');
const leaderboardBody = document.getElementById('leaderboard-body');

// Difficulty level buttons
const levelNovice = document.getElementById('level-novice');
const levelScholar = document.getElementById('level-scholar');
const levelMaster = document.getElementById('level-master');

// Initialize the game
function initGame() {
    // Ensure correct initial screen visibility
    welcomeScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    winScreen.classList.add('hidden');
    bonusScreen.classList.add('hidden');
    leaderboardScreen.classList.add('hidden');
    
    // Event listeners
    startButton.addEventListener('click', startGame);
    hintButton.addEventListener('click', getHint);
    lookButton.addEventListener('click', lookAround);
    playAgainButton.addEventListener('click', resetGame);
    printCertificateButton.addEventListener('click', printCertificate);
    leaderboardButton.addEventListener('click', showLeaderboard);
    closeLeaderboardButton.addEventListener('click', hideLeaderboard);
    logoutButton.addEventListener('click', logout);
    continueAfterBonusButton.addEventListener('click', continueAfterBonus);
    
    // Difficulty level selection
    levelNovice.addEventListener('click', () => selectDifficulty('novice'));
    levelScholar.addEventListener('click', () => selectDifficulty('scholar'));
    levelMaster.addEventListener('click', () => selectDifficulty('master'));
    
    // Allow pressing Enter to start the game
    playerNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            startGame();
        }
    });
}

// Select difficulty level
function selectDifficulty(level) {
    gameState.difficulty = level;
    
    // Update UI
    levelNovice.classList.remove('selected');
    levelScholar.classList.remove('selected');
    levelMaster.classList.remove('selected');
    
    document.getElementById(`level-${level}`).classList.add('selected');
}

// Start the game
function startGame() {
    const name = playerNameInput.value.trim();
    if (name === '') {
        showMessage('Please enter your name to start the adventure!');
        return;
    }
    
    gameState.playerName = name;
    gameState.gameStarted = true;
    gameState.puzzlesSolved = 0;
    gameState.moves = 0;
    gameState.hintsUsed = 0;
    
    // Randomly place Tilly in one of the locations
    const possibleLocations = Object.keys(gameState.locations);
    gameState.tillyLocation = possibleLocations[Math.floor(Math.random() * possibleLocations.length)];
    
    // Update UI
    playerNameDisplay.textContent = `Explorer: ${gameState.playerName}`;
    updateLevelDisplay();
    movesCounter.textContent = `Moves: ${gameState.moves}`;
    puzzlesSolvedCounter.textContent = `Puzzles: ${gameState.puzzlesSolved}/5`;
    updateProgressBar();
    
    // Switch screens
    welcomeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // Update game display
    updateGameDisplay();
    
    // Show welcome message
    showMessage(`Welcome, ${gameState.playerName}! Let's find Tilly by solving puzzles! Where should we look first?`);
}

// Update the level display
function updateLevelDisplay() {
    levelDisplay.textContent = `Level: ${formatDifficultyName(gameState.difficulty)}`;
    levelDisplay.className = gameState.difficulty;
}

// Update the game display based on current location
function updateGameDisplay() {
    const location = gameState.locations[gameState.currentLocation];
    
    // Update location emoji
    locationImage.textContent = location.emoji;
    locationImage.className = 'location-emoji';
    
    // Update location description
    locationDescription.textContent = location.description;
    
    // Update direction buttons
    directionButtons.innerHTML = '';
    location.connections.forEach(connection => {
        const button = document.createElement('button');
        button.className = 'direction-button';
        button.textContent = formatLocationName(connection);
        button.addEventListener('click', () => moveToLocation(connection));
        directionButtons.appendChild(button);
    });
    
    // Update puzzle
    updatePuzzleDisplay(location.puzzleType);
    
    // Update counters
    movesCounter.textContent = `Moves: ${gameState.moves}`;
    puzzlesSolvedCounter.textContent = `Puzzles: ${gameState.puzzlesSolved}/5`;
    updateProgressBar();
}

// Update the puzzle display
function updatePuzzleDisplay(puzzleType) {
    // Get a random puzzle of the specified type for the current difficulty
    const puzzles = gameState.puzzles[gameState.difficulty][puzzleType];
    const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    gameState.currentPuzzle = randomPuzzle;
    
    // Update puzzle question
    puzzleQuestion.textContent = randomPuzzle.question;
    
    // Update puzzle options
    puzzleOptions.innerHTML = '';
    
    // Shuffle options for variety
    const shuffledOptions = [...randomPuzzle.options].sort(() => Math.random() - 0.5);
    
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'puzzle-option';
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option));
        puzzleOptions.appendChild(button);
    });
}

// Check the answer to the current puzzle
function checkAnswer(selectedAnswer) {
    gameState.moves++;
    movesCounter.textContent = `Moves: ${gameState.moves}`;
    
    if (selectedAnswer === gameState.currentPuzzle.answer) {
        // Increment puzzles solved
        gameState.puzzlesSolved++;
        puzzlesSolvedCounter.textContent = `Puzzles: ${gameState.puzzlesSolved}/5`;
        updateProgressBar();
        
        // Show success message
        showMessage("That's correct! Great job!");
        
        // Check if we've solved enough puzzles to find Tilly
        if (gameState.puzzlesSolved >= 5) {
            // Show bonus puzzle
            showBonusPuzzle();
        } else {
            // Generate a new puzzle
            const location = gameState.locations[gameState.currentLocation];
            updatePuzzleDisplay(location.puzzleType);
        }
    } else {
        // Show try again message
        showMessage("That's not quite right. Try again!");
    }
}

// Show bonus puzzle
function showBonusPuzzle() {
    // Get a random bonus puzzle for the current difficulty
    const bonusPuzzles = gameState.bonusPuzzles[gameState.difficulty];
    const randomBonusPuzzle = bonusPuzzles[Math.floor(Math.random() * bonusPuzzles.length)];
    gameState.currentPuzzle = randomBonusPuzzle;
    
    // Update bonus puzzle question
    bonusPuzzleQuestion.textContent = randomBonusPuzzle.question;
    
    // Update bonus puzzle options
    bonusPuzzleOptions.innerHTML = '';
    
    // Shuffle options for variety
    const shuffledOptions = [...randomBonusPuzzle.options].sort(() => Math.random() - 0.5);
    
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'bonus-option';
        button.textContent = option;
        button.addEventListener('click', () => checkBonusAnswer(option));
        bonusPuzzleOptions.appendChild(button);
    });
    
    // Show bonus screen
    gameScreen.classList.add('hidden');
    bonusScreen.classList.remove('hidden');
    bonusMessage.textContent = "";
    continueAfterBonusButton.classList.add('hidden');
}

// Check the answer to the bonus puzzle
function checkBonusAnswer(selectedAnswer) {
    if (selectedAnswer === gameState.currentPuzzle.answer) {
        // Show success message
        bonusMessage.textContent = "Amazing! You solved the bonus puzzle!";
        bonusMessage.className = "correct-answer";
    } else {
        // Show try again message
        bonusMessage.textContent = "That's not quite right, but that's okay! It was a bonus challenge.";
        bonusMessage.className = "wrong-answer";
    }
    
    // Show continue button
    continueAfterBonusButton.classList.remove('hidden');
}

// Continue after bonus puzzle
function continueAfterBonus() {
    // Tilly is found!
    showWinScreen();
}

// Move to a new location
function moveToLocation(location) {
    gameState.moves++;
    gameState.currentLocation = location;
    
    // Check if player found Tilly!
    if (gameState.currentLocation === gameState.tillyLocation && gameState.puzzlesSolved >= 5) {
        showWinScreen();
        return;
    }
    
    // Update UI
    updateGameDisplay();
    
    // Show message
    showMessage(`You moved to the ${formatLocationName(location)}. Can you solve the puzzle here?`);
}

// Get a hint
function getHint() {
    gameState.hintsUsed++;
    gameState.moves++;
    
    // Update moves counter
    movesCounter.textContent = `Moves: ${gameState.moves}`;
    
    // Give a hint for the current puzzle
    const puzzle = gameState.currentPuzzle;
    let hintMessage = "";
    
    if (puzzle.question.includes("letter")) {
        hintMessage = `Think about the alphabet: A, B, C, D, E, F...`;
    } else if (puzzle.question.includes("number")) {
        hintMessage = `Count carefully: 1, 2, 3, 4, 5...`;
    } else if (puzzle.question.includes("+")) {
        hintMessage = `Try counting on your fingers!`;
    } else {
        hintMessage = `Think carefully about the question!`;
    }
    
    showMessage(`Hint: ${hintMessage}`);
}

// Look around the current location
function lookAround() {
    gameState.moves++;
    
    // Update moves counter
    movesCounter.textContent = `Moves: ${gameState.moves}`;
    
    // Show a more detailed description
    const location = gameState.locations[gameState.currentLocation];
    let message = `You look carefully around the ${formatLocationName(gameState.currentLocation)}. `;
    
    // Add some random details based on the location
    const details = {
        "home": ["You notice some alphabet blocks on the floor.", "There's a counting chart on the wall.", "You see some math flashcards on the table."],
        "garden": ["The flowers are arranged in numbered rows.", "There are alphabet stones in the garden path.", "You see numbers painted on the garden gnomes."],
        "kitchen": ["There's a recipe with numbers on the counter.", "Alphabet magnets are on the fridge.", "You see measuring cups with numbers."],
        "bedroom": ["There's an alphabet poster on the wall.", "You see numbered building blocks on the shelf.", "There's a counting book on the bed."],
        "playground": ["The hopscotch has numbers painted on it.", "There are alphabet tiles on the play wall.", "You see numbered steps on the slide."],
        "dining_room": ["The placemats have numbers on them.", "There are alphabet soup cans on the shelf.", "You see numbered plates in the cabinet."],
        "closet": ["The hangers are numbered in order.", "There are alphabet labels on the storage boxes.", "You see numbered shoe cubbies."],
        "treehouse": ["There's a number puzzle on the floor.", "You see alphabet flags hanging from the ceiling.", "There's a math game on the small table."]
    };
    
    // Add a random detail
    const locationDetails = details[gameState.currentLocation];
    if (locationDetails) {
        message += locationDetails[Math.floor(Math.random() * locationDetails.length)];
    }
    
    // Add hint about puzzles
    message += " Solving puzzles will help you find Tilly!";
    
    showMessage(message);
}

// Show win screen when Tilly is found
function showWinScreen() {
    gameState.gameWon = true;
    
    // Update win stats
    winStats.textContent = `You found Tilly after solving ${gameState.puzzlesSolved} puzzles in ${gameState.moves} moves and used ${gameState.hintsUsed} hints!`;
    
    // Update certificate
    certificateName.textContent = gameState.playerName;
    certificateStats.textContent = `Level: ${formatDifficultyName(gameState.difficulty)} | Puzzles: ${gameState.puzzlesSolved} | Moves: ${gameState.moves}`;
    
    // Set certificate date
    const today = new Date();
    certificateDate.textContent = today.toLocaleDateString();
    
    // Add to leaderboard
    addToLeaderboard();
    
    // Switch to win screen
    bonusScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    winScreen.classList.remove('hidden');
}

// Add current game to leaderboard
function addToLeaderboard() {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    gameState.leaderboard.push({
        name: gameState.playerName,
        level: gameState.difficulty,
        puzzles: gameState.puzzlesSolved,
        moves: gameState.moves,
        date: dateString
    });
    
    // Sort leaderboard by level difficulty (master > scholar > novice) and then by moves (ascending)
    gameState.leaderboard.sort((a, b) => {
        const levelOrder = { master: 3, scholar: 2, novice: 1 };
        if (levelOrder[b.level] !== levelOrder[a.level]) {
            return levelOrder[b.level] - levelOrder[a.level];
        }
        return a.moves - b.moves;
    });
}

// Show leaderboard
function showLeaderboard() {
    // Update leaderboard table
    leaderboardBody.innerHTML = '';
    
    gameState.leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        
        const rankCell = document.createElement('td');
        rankCell.textContent = index + 1;
        row.appendChild(rankCell);
        
        const nameCell = document.createElement('td');
        nameCell.textContent = entry.name;
        row.appendChild(nameCell);
        
        const levelCell = document.createElement('td');
        levelCell.textContent = formatDifficultyName(entry.level);
        row.appendChild(levelCell);
        
        const puzzlesCell = document.createElement('td');
        puzzlesCell.textContent = entry.puzzles;
        row.appendChild(puzzlesCell);
        
        const movesCell = document.createElement('td');
        movesCell.textContent = entry.moves;
        row.appendChild(movesCell);
        
        const dateCell = document.createElement('td');
        dateCell.textContent = entry.date;
        row.appendChild(dateCell);
        
        leaderboardBody.appendChild(row);
    });
    
    // Show leaderboard screen
    gameScreen.classList.add('hidden');
    leaderboardScreen.classList.remove('hidden');
}

// Hide leaderboard
function hideLeaderboard() {
    leaderboardScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
}

// Print certificate
function printCertificate() {
    window.print();
}

// Logout
function logout() {
    // Reset game state
    resetGame();
    
    // Switch back to welcome screen
    gameScreen.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
}

// Show a message in the message box
function showMessage(message) {
    messageBox.textContent = message;
    
    // Add a brief animation
    messageBox.style.backgroundColor = 'rgba(255, 158, 68, 0.4)';
    setTimeout(() => {
        messageBox.style.backgroundColor = 'rgba(255, 158, 68, 0.2)';
    }, 300);
}

// Update progress bar
function updateProgressBar() {
    const progress = (gameState.puzzlesSolved / 5) * 100;
    progressBarInner.style.width = `${progress}%`;
}

// Reset the game
function resetGame() {
    // Reset game state
    gameState.currentLocation = "home";
    gameState.inventory = [];
    gameState.hintsUsed = 0;
    gameState.moves = 0;
    gameState.puzzlesSolved = 0;
    gameState.gameWon = false;
    
    // Randomly place Tilly again
    const possibleLocations = Object.keys(gameState.locations);
    gameState.tillyLocation = possibleLocations[Math.floor(Math.random() * possibleLocations.length)];
    
    // Switch back to game screen
    winScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // Update game display
    updateGameDisplay();
    
    // Show message
    showMessage("Let's play again! Can you solve the puzzles to find Tilly?");
}

// Helper function to format location names for display
function formatLocationName(location) {
    // Replace underscores with spaces and capitalize each word
    return location
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Helper function to format difficulty names for display
function formatDifficultyName(difficulty) {
    switch (difficulty) {
        case 'novice':
            return 'Novice Explorer';
        case 'scholar':
            return 'Curious Scholar';
        case 'master':
            return 'Puzzle Master';
        default:
            return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);
