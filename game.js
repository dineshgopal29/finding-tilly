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
    
    // Educational puzzles by category
    puzzles: {
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
    
    // Game locations and their properties
    locations: {
        "home": {
            description: "You are at home. Tilly left a puzzle for you to solve!",
            connections: ["garden", "kitchen", "bedroom"],
            puzzleType: "alphabet",
            image: "images/home.png"
        },
        "garden": {
            description: "You're in a beautiful garden. There's a puzzle hidden among the flowers!",
            connections: ["home", "playground"],
            puzzleType: "numbers",
            image: "images/garden.png"
        },
        "kitchen": {
            description: "The kitchen smells like cookies! Tilly left a math puzzle on the counter.",
            connections: ["home", "dining_room"],
            puzzleType: "addition",
            image: "images/kitchen.png"
        },
        "bedroom": {
            description: "This is your cozy bedroom. There's a letter puzzle on your desk!",
            connections: ["home", "closet"],
            puzzleType: "alphabet",
            image: "images/bedroom.png"
        },
        "playground": {
            description: "A fun playground with swings and slides! You found a number puzzle.",
            connections: ["garden", "treehouse"],
            puzzleType: "numbers",
            image: "images/playground.png"
        },
        "dining_room": {
            description: "A large table sits in the middle of this room. There's a math puzzle on it!",
            connections: ["kitchen"],
            puzzleType: "addition",
            image: "images/dining_room.png"
        },
        "closet": {
            description: "A small closet with clothes. You found a letter puzzle hidden inside!",
            connections: ["bedroom"],
            puzzleType: "alphabet",
            image: "images/closet.png"
        },
        "treehouse": {
            description: "An awesome treehouse high up in a tree! There's a tricky puzzle here.",
            connections: ["playground"],
            puzzleType: "addition",
            image: "images/treehouse.png"
        }
    }
};

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const winScreen = document.getElementById('win-screen');
const playerNameInput = document.getElementById('player-name');
const startButton = document.getElementById('start-button');
const playerNameDisplay = document.getElementById('player-name-display');
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

// Sound effects
let soundEffects = {
    move: new Audio('sounds/move.mp3'),
    correct: new Audio('sounds/pickup.mp3'),
    hint: new Audio('sounds/hint.mp3'),
    win: new Audio('sounds/win.mp3'),
    wrong: new Audio('sounds/wrong.mp3')
};

// Initialize the game
function initGame() {
    // Event listeners
    startButton.addEventListener('click', startGame);
    hintButton.addEventListener('click', getHint);
    lookButton.addEventListener('click', lookAround);
    playAgainButton.addEventListener('click', resetGame);
    
    // Allow pressing Enter to start the game
    playerNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            startGame();
        }
    });
    
    // Preload images
    preloadImages();
}

// Preload all location images
function preloadImages() {
    for (const location in gameState.locations) {
        const img = new Image();
        img.src = gameState.locations[location].image;
    }
    // Also preload the win image
    const winImg = new Image();
    winImg.src = 'images/tilly_found.png';
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
    
    // Randomly place Tilly in one of the locations
    const possibleLocations = Object.keys(gameState.locations);
    gameState.tillyLocation = possibleLocations[Math.floor(Math.random() * possibleLocations.length)];
    
    // Update UI
    playerNameDisplay.textContent = `Explorer: ${gameState.playerName}`;
    
    // Switch screens
    welcomeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // Update game display
    updateGameDisplay();
    
    // Show welcome message
    showMessage(`Welcome, ${gameState.playerName}! Let's find Tilly by solving puzzles! Where should we look first?`);
}

// Update the game display based on current location
function updateGameDisplay() {
    const location = gameState.locations[gameState.currentLocation];
    
    // Update location image
    locationImage.src = location.image;
    locationImage.alt = `Image of ${gameState.currentLocation}`;
    
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
    puzzlesSolvedCounter.textContent = `Puzzles: ${gameState.puzzlesSolved}`;
}

// Update the puzzle display
function updatePuzzleDisplay(puzzleType) {
    // Get a random puzzle of the specified type
    const puzzles = gameState.puzzles[puzzleType];
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
        // Play correct sound
        try {
            soundEffects.correct.play();
        } catch (e) {
            console.log('Sound could not be played');
        }
        
        // Increment puzzles solved
        gameState.puzzlesSolved++;
        puzzlesSolvedCounter.textContent = `Puzzles: ${gameState.puzzlesSolved}`;
        
        // Show success message
        showMessage("That's correct! Great job!");
        
        // Check if we've solved enough puzzles to find Tilly
        if (gameState.puzzlesSolved >= 5) {
            // Tilly is found!
            findTilly();
        } else {
            // Generate a new puzzle
            const location = gameState.locations[gameState.currentLocation];
            updatePuzzleDisplay(location.puzzleType);
        }
    } else {
        // Play wrong sound
        try {
            soundEffects.wrong.play();
        } catch (e) {
            console.log('Sound could not be played');
        }
        
        // Show try again message
        showMessage("That's not quite right. Try again!");
    }
}

// Move to a new location
function moveToLocation(location) {
    // Play sound effect
    try {
        soundEffects.move.play();
    } catch (e) {
        console.log('Sound could not be played');
    }
    
    gameState.moves++;
    gameState.currentLocation = location;
    
    // Update UI
    updateGameDisplay();
    
    // Show message
    showMessage(`You moved to the ${formatLocationName(location)}. Can you solve the puzzle here?`);
}

// Get a hint
function getHint() {
    // Play sound effect
    try {
        soundEffects.hint.play();
    } catch (e) {
        console.log('Sound could not be played');
    }
    
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

// Find Tilly after solving enough puzzles
function findTilly() {
    // Play win sound
    try {
        soundEffects.win.play();
    } catch (e) {
        console.log('Sound could not be played');
    }
    
    gameState.gameWon = true;
    
    // Update win stats
    winStats.textContent = `You found Tilly after solving ${gameState.puzzlesSolved} puzzles in ${gameState.moves} moves and used ${gameState.hintsUsed} hints!`;
    
    // Switch to win screen
    gameScreen.classList.add('hidden');
    winScreen.classList.remove('hidden');
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

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', initGame);
