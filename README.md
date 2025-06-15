# Finding Tilly - Educational Kid-Friendly Web Game

A fun and educational React-based game for young children to find Tilly by solving alphabet, number, and addition puzzles.

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

3. Set up Firebase:
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Authentication and Firestore Database
   - Copy `.env.example` to `.env` and update with your Firebase configuration

4. Start the development server:
   ```
   npm start
   ```

## How to Play

1. Enter your child's name and select an appropriate skill level
2. Navigate through different locations by clicking on the direction buttons
3. Solve educational puzzles at each location
4. Use the "Get a Hint" button if your child needs help
5. Use the "Look Around" button to get more details about the current location
6. Solve 5 puzzles to find Tilly and win the game!
7. Quick learners may get a bonus question for an extra challenge

## Technologies Used

- React.js
- Firebase (Authentication, Firestore)
- React Router
- CSS3 with animations

## Development Journey

This project was developed with educational goals in mind, focusing on creating an engaging learning experience for young children. The development process is documented in the `finding_tilly_game.md` file, which covers:

- Initial concept and design
- Educational content development
- User interface considerations for young children
- Implementation of gamification elements
- Testing and feedback from children

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by educational research on early childhood learning
- Special thanks to all the children who tested the game and provided feedback
