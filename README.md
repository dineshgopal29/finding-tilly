# Finding Tilly - Educational Kid-Friendly Web Game

A fun and educational React-based game for young children to find Tilly by solving alphabet, number, and addition puzzles.

![Finding Tilly Game](images/finding_tilly_screenshot.png)

## Overview

Finding Tilly is an interactive educational game designed for children ages 3-10. Players navigate through different locations, solving age-appropriate puzzles related to alphabet recognition, number sequences, and basic addition. After solving 5 puzzles, they find Tilly!

## Features

- **Age-appropriate skill levels**:
  - 🌱 Explorer (Ages 3-4): Simple puzzles for preschoolers
  - 🌟 Adventurer (Ages 5-6): Moderate puzzles for kindergarteners
  - 🏆 Champion (Ages 7-10): More challenging puzzles for elementary students

- **Educational content**:
  - Alphabet recognition and sequencing
  - Number recognition and counting
  - Basic addition (sums up to 20)
  - Pattern recognition

- **Engaging gameplay elements**:
  - Visual learning aids for each puzzle type
  - Streak counter for consecutive correct answers
  - Bonus questions for quick learners
  - Celebration effects and printable certificate
  - Leaderboard to track progress

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/dineshgopal29/finding-tilly.git
   cd finding-tilly
   ```

2. Install dependencies:
   ```
   cd finding-tilly-react
   npm install
   ```

3. Set up Firebase (optional):
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Authentication and Firestore Database
   - Create a `.env` file in the finding-tilly-react directory with your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Build for production:
   ```
   npm run build
   ```

## How to Play

1. Enter your child's name and select an appropriate skill level
2. Navigate through different locations by clicking on the direction buttons
3. Solve educational puzzles at each location
4. Use the "Get a Hint" button if your child needs help
5. Use the "Look Around" button to get more details about the current location
6. Solve 5 puzzles to find Tilly and win the game!
7. Quick learners may get a bonus question for an extra challenge

## Project Structure

```
finding-tilly-react/
├── public/                 # Public assets
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── GameScreen.js   # Main game screen
│   │   ├── LeaderboardScreen.js # Leaderboard display
│   │   ├── LocationDisplay.js # Location visualization
│   │   ├── PuzzleDisplay.js # Puzzle interface
│   │   ├── WelcomeScreen.js # Initial screen
│   │   └── WinScreen.js    # Victory screen
│   ├── contexts/           # React contexts
│   │   ├── AuthContext.js  # Authentication context
│   │   └── GameContext.js  # Game state management
│   ├── services/           # Service functions
│   │   └── gameService.js  # Game logic and puzzles
│   ├── styles/             # CSS files
│   ├── App.js              # Main App component
│   └── index.js            # Entry point
└── package.json            # Dependencies and scripts
```

## Component Architecture

### Core Components

1. **WelcomeScreen**: Entry point where players enter their name and select skill level
2. **GameScreen**: Main game interface with location display, navigation, and puzzles
3. **LocationDisplay**: Visual representation of the current location
4. **PuzzleDisplay**: Interactive puzzle interface with progress tracking
5. **WinScreen**: Celebration screen when Tilly is found
6. **LeaderboardScreen**: Display of top players and achievements

### State Management

The game uses React Context API for state management:

1. **GameContext**: Manages game state including:
   - Player information
   - Current location
   - Puzzles solved
   - Game progress
   - Win conditions

2. **AuthContext**: Handles user authentication (optional Firebase integration)

## Educational Design

### Skill Levels

1. **Explorer (Ages 3-4)**:
   - Simple alphabet recognition (A, B, C)
   - Basic number recognition (1, 2, 3)
   - Simple addition with sums up to 5

2. **Adventurer (Ages 5-6)**:
   - Intermediate alphabet sequences
   - Number sequences up to 20
   - Addition with sums up to 10

3. **Champion (Ages 7-10)**:
   - Complex alphabet patterns
   - Number sequences and patterns
   - Addition with sums up to 20

### Visual Learning Aids

Each puzzle type includes optional visual aids:
- Alphabet puzzles: Complete alphabet display
- Number puzzles: Number line visualization
- Addition puzzles: Object-based counting aids

## Technologies Used

- React.js
- React Router
- CSS3 with animations
- Firebase (optional for authentication and data storage)

## Development Journey

This project was developed with educational goals in mind, focusing on creating an engaging learning experience for young children. The development process is documented in the `finding_tilly_game.md` file, which covers:

- Initial concept and design
- Educational content development
- User interface considerations for young children
- Implementation of gamification elements
- Testing and feedback from children

## Future Enhancements

- Subtraction and multiplication puzzles for older children
- Customizable difficulty settings
- More locations and puzzle types
- Audio narration for younger players
- Parent dashboard to track learning progress

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by educational research on early childhood learning
- Special thanks to all the children who tested the game and provided feedback

## Contact

For questions or feedback, please open an issue on this repository or contact the maintainer.
