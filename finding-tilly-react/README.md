# Finding Tilly - Educational Kid-Friendly React Game

A fun and educational React-based game for young children to find Tilly by solving alphabet, number, and addition puzzles.

## Overview

Finding Tilly is an interactive educational game designed for children ages 3-10. Players navigate through different locations, solving age-appropriate puzzles related to alphabet recognition, number sequences, and basic addition. After solving 5 puzzles, they find Tilly!

## Features

- **Age-appropriate skill levels**:
  - 🌱 Novice Explorer (Ages 3-6): Simple puzzles for preschoolers
  - 🌟 Curious Scholar (Ages 7-12): Moderate puzzles for elementary students
  - 🏆 Puzzle Master (Ages 13+): More challenging puzzles for older kids and adults

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
   git clone https://github.com/yourusername/finding-tilly.git
   cd finding-tilly/finding-tilly-react
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Firebase:
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Authentication and Firestore Database
   - Create a `.env` file in the project root with your Firebase configuration:
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

## Firebase Setup

This app uses Firebase for:
- User authentication
- Storing game progress
- Leaderboard functionality
- Tracking achievements and badges

Make sure to set up the following collections in your Firestore database:
- `users`: Store user profiles and progress
- `gameSessions`: Track individual game sessions
- `puzzleResults`: Store results of individual puzzles
- `badges`: Track achievements earned by users

## Technologies Used

- React.js
- React Router
- Firebase (Authentication, Firestore)
- CSS3 with animations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by educational research on early childhood learning
- Special thanks to all the children who tested the game and provided feedback
