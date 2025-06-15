import React, { useState, useEffect } from 'react';
import { useGameContext } from '../contexts/GameContext';
import { getRandomPuzzle, updateUserProgress } from '../services/gameService';
import '../styles/PuzzleDisplay.css';

// Enhanced puzzle display component with visual aids, animations, and bonus questions
const PuzzleDisplay = () => {
  const { gameState, updateGameState, playSound } = useGameContext();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVisualAid, setShowVisualAid] = useState(false);
  const [visualAidType, setVisualAidType] = useState(null);
  const [streak, setStreak] = useState(0);
  const [showingBonusQuestion, setShowingBonusQuestion] = useState(false);
  const [bonusQuestionTime, setBonusQuestionTime] = useState(null);
  
  // Fetch a puzzle when component mounts or location changes
  useEffect(() => {
    let isMounted = true;
    
    const fetchPuzzle = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      const location = gameState.locations[gameState.currentLocation];
      const puzzleType = location.puzzleType;
      
      try {
        console.log("Fetching puzzle of type:", puzzleType);
        // Get puzzle based on skill level
        const newPuzzle = await getRandomPuzzle(puzzleType, null, gameState.skillLevel || 'adventurer');
        
        if (newPuzzle && isMounted) {
          console.log("Fetched puzzle:", newPuzzle);
          updateGameState({
            currentPuzzle: newPuzzle
          });
          
          // Determine if we should show a visual aid for this puzzle
          if (puzzleType === 'addition') {
            setVisualAidType('addition');
          } else if (puzzleType === 'alphabet' && newPuzzle.question.includes("missing")) {
            setVisualAidType('alphabet');
          } else if (puzzleType === 'numbers' && newPuzzle.question.includes("missing")) {
            setVisualAidType('numbers');
          } else {
            setVisualAidType(null);
          }
        }
      } catch (error) {
        console.error("Error fetching puzzle:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    // Only fetch if we don't have a puzzle or if location changed
    if (!gameState.currentPuzzle || 
        gameState.currentPuzzle.type !== gameState.locations[gameState.currentLocation].puzzleType) {
      fetchPuzzle();
    } else {
      setLoading(false);
    }
    
    return () => {
      isMounted = false;
    };
  }, [gameState.currentLocation, gameState.locations, updateGameState, gameState.skillLevel]);
  
  // Handle moving to next puzzle
  const handleNextPuzzle = async () => {
    setLoading(true);
    setSelectedAnswer(null);
    setFeedback(null);
    setShowVisualAid(false);
    
    const location = gameState.locations[gameState.currentLocation];
    const puzzleType = location.puzzleType;
    
    try {
      // If showing bonus question, clear that state
      if (showingBonusQuestion) {
        setShowingBonusQuestion(false);
        // After bonus question is completed, show win screen
        setTimeout(() => {
          playSound('win');
          updateGameState({ gameWon: true });
        }, 500);
        return;
      }
      
      // Get puzzle based on skill level
      const newPuzzle = await getRandomPuzzle(puzzleType, null, gameState.skillLevel || 'adventurer');
      updateGameState({
        currentPuzzle: newPuzzle
      });
      
      // Determine if we should show a visual aid for this puzzle
      if (puzzleType === 'addition') {
        setVisualAidType('addition');
      } else if (puzzleType === 'alphabet' && newPuzzle.question.includes("missing")) {
        setVisualAidType('alphabet');
      } else if (puzzleType === 'numbers' && newPuzzle.question.includes("missing")) {
        setVisualAidType('numbers');
      } else {
        setVisualAidType(null);
      }
    } catch (error) {
      console.error("Error fetching next puzzle:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch bonus question
  const fetchBonusQuestion = async (puzzleType) => {
    try {
      setLoading(true);
      // Get a harder bonus question
      const bonusQuestion = await getRandomPuzzle(puzzleType, 'bonus');
      
      if (bonusQuestion) {
        updateGameState({
          currentPuzzle: bonusQuestion,
          isBonusQuestion: true
        });
      }
    } catch (error) {
      console.error("Error fetching bonus question:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle visual aid
  const toggleVisualAid = () => {
    setShowVisualAid(!showVisualAid);
  };
  
  // Generate visual aid based on puzzle type
  const renderVisualAid = () => {
    if (!gameState.currentPuzzle) return null;
    
    const puzzle = gameState.currentPuzzle;
    
    if (visualAidType === 'alphabet') {
      // Alphabet visual aid - show alphabet sequence
      return (
        <div className="visual-aid alphabet-aid">
          <div className="alphabet-sequence">
            {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((letter, index) => (
              <span key={index} className="letter">{letter}</span>
            ))}
          </div>
        </div>
      );
    } else if (visualAidType === 'numbers') {
      // Number visual aid - show number sequence
      return (
        <div className="visual-aid number-aid">
          <div className="number-sequence">
            {Array.from({length: 20}, (_, i) => i + 1).map((num) => (
              <span key={num} className="number">{num}</span>
            ))}
          </div>
        </div>
      );
    } else if (visualAidType === 'addition') {
      // Addition visual aid - show counting objects
      // Extract numbers from the question (e.g., "What is 2 + 3?")
      const numbers = puzzle.question.match(/\d+/g);
      if (numbers && numbers.length >= 2) {
        const num1 = parseInt(numbers[0]);
        const num2 = parseInt(numbers[1]);
        
        return (
          <div className="visual-aid addition-aid">
            <div className="addition-objects">
              <div className="object-group">
                {Array.from({length: num1}, (_, i) => (
                  <span key={`a${i}`} className="object">🍎</span>
                ))}
              </div>
              <span className="plus-sign">+</span>
              <div className="object-group">
                {Array.from({length: num2}, (_, i) => (
                  <span key={`b${i}`} className="object">🍎</span>
                ))}
              </div>
              <span className="equals-sign">=</span>
              <div className="object-group result">
                <span className="question-mark">?</span>
              </div>
            </div>
          </div>
        );
      }
    }
    
    return null;
  };
  
  // Check answer
  const checkAnswer = async (answer) => {
    if (selectedAnswer !== null || !gameState.currentPuzzle) return;
    
    setSelectedAnswer(answer);
    
    if (answer === gameState.currentPuzzle.answer) {
      // Play correct sound
      playSound('correct');
      
      // Increment streak
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Special celebration for streaks
      let message = "That's correct! Great job!";
      if (newStreak === 3) {
        message = "That's correct! You're on a roll! 🔥";
      } else if (newStreak === 5) {
        message = "That's correct! Amazing streak! 🌟";
      } else if (newStreak > 5) {
        message = "That's correct! Incredible! 🏆";
      }
      
      // Special message for bonus question
      if (showingBonusQuestion) {
        message = "Wow! You solved the bonus question! You're amazing! 🌟";
      }
      
      setFeedback({ 
        correct: true, 
        message: message,
        showNextButton: true
      });
      
      // Update progress
      if (gameState.userId) {
        const puzzleType = gameState.locations[gameState.currentLocation].puzzleType;
        const progressUpdate = {
          totalPuzzlesSolved: (gameState.progress.totalPuzzlesSolved || 0) + 1
        };
        
        if (puzzleType === 'alphabet') {
          progressUpdate.alphabetPuzzlesSolved = (gameState.progress.alphabetPuzzlesSolved || 0) + 1;
        } else if (puzzleType === 'numbers') {
          progressUpdate.numberPuzzlesSolved = (gameState.progress.numberPuzzlesSolved || 0) + 1;
        } else if (puzzleType === 'addition') {
          progressUpdate.additionPuzzlesSolved = (gameState.progress.additionPuzzlesSolved || 0) + 1;
        }
        
        await updateUserProgress(gameState.userId, progressUpdate);
      }
      
      // If not already showing bonus question
      if (!showingBonusQuestion) {
        // Update local state
        const newPuzzlesSolved = gameState.puzzlesSolved + 1;
        updateGameState({
          puzzlesSolved: newPuzzlesSolved,
          moves: gameState.moves + 1
        });
        
        // Check if game is won or if we should show bonus question
        if (newPuzzlesSolved >= 5) {
          // Check if they solved all puzzles quickly (under 2 minutes) with few hints
          const totalTime = gameState.gameStartTime ? (Date.now() - gameState.gameStartTime) / 1000 : 300;
          if (totalTime < 120 && gameState.hintsUsed <= 1 && newStreak >= 3) {
            // They solved it quickly with no/few hints and have a streak - offer bonus question
            setTimeout(() => {
              setShowingBonusQuestion(true);
              setBonusQuestionTime(totalTime);
              // Fetch a harder bonus question
              const puzzleType = gameState.locations[gameState.currentLocation].puzzleType;
              fetchBonusQuestion(puzzleType);
            }, 1500);
          } else {
            // Regular win condition
            setTimeout(() => {
              playSound('win');
              updateGameState({ gameWon: true });
            }, 1000);
          }
        }
      }
      
    } else {
      // Play wrong sound
      playSound('wrong');
      
      // Reset streak on wrong answer
      setStreak(0);
      
      setFeedback({ correct: false, message: "That's not quite right. Try again!" });
      
      // Update moves in state
      updateGameState({
        moves: gameState.moves + 1
      });
      
      // Clear feedback after delay
      setTimeout(() => {
        setSelectedAnswer(null);
        setFeedback(null);
      }, 1500);
    }
  };
  
  if (loading) {
    return (
      <div className="puzzle-container">
        <h3>Puzzle</h3>
        <div className="loading">Loading puzzle...</div>
      </div>
    );
  }
  
  if (!gameState.currentPuzzle) {
    return (
      <div className="puzzle-container">
        <h3>Puzzle</h3>
        <div className="loading">Finding a puzzle...</div>
      </div>
    );
  }
  
  // Shuffle options for display
  const shuffledOptions = [...gameState.currentPuzzle.options].sort(() => Math.random() - 0.5);
  
  return (
    <div className="puzzle-container">
      <h3>
        {showingBonusQuestion ? (
          <span className="bonus-label">Bonus Question!</span>
        ) : (
          "Puzzle"
        )}
      </h3>
      
      <div className={`puzzle-question ${showingBonusQuestion ? 'bonus-question' : ''}`}>
        {gameState.currentPuzzle.question}
      </div>
      
      {visualAidType && (
        <button 
          className="visual-aid-toggle"
          onClick={toggleVisualAid}
        >
          {showVisualAid ? "Hide Helper" : "Show Helper"}
        </button>
      )}
      
      {showVisualAid && renderVisualAid()}
      
      <div className="puzzle-options">
        {shuffledOptions.map((option, index) => (
          <button
            key={index}
            className={`puzzle-option ${selectedAnswer === option ? 
              (option === gameState.currentPuzzle.answer ? 'correct' : 'incorrect') : ''} ${showingBonusQuestion ? 'bonus-option' : ''}`}
            onClick={() => checkAnswer(option)}
            disabled={selectedAnswer !== null}
          >
            {option}
          </button>
        ))}
      </div>
      
      {feedback && (
        <div className={`feedback ${feedback.correct ? 'correct-feedback' : 'incorrect-feedback'}`}>
          {feedback.message}
        </div>
      )}
      
      {/* Next Puzzle button that appears after correct answer */}
      {feedback && feedback.correct && feedback.showNextButton && (
        <button 
          className={`next-puzzle-button ${showingBonusQuestion ? 'bonus-button' : ''}`}
          onClick={handleNextPuzzle}
        >
          {showingBonusQuestion ? "Continue to Win!" : "Next Puzzle"}
        </button>
      )}
      
      <div className="puzzle-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{width: `${(gameState.puzzlesSolved / 5) * 100}%`}}
          ></div>
        </div>
        <div className="progress-text">
          Puzzles solved: {gameState.puzzlesSolved} / 5
          {showingBonusQuestion && <span className="bonus-indicator"> + Bonus!</span>}
        </div>
        {streak >= 2 && (
          <div className="streak-counter">
            <span className="streak-icon">🔥</span> {streak}
          </div>
        )}
        {gameState.skillLevel && (
          <div className="skill-level-indicator">
            {gameState.skillLevel === 'explorer' && <span>🌱 Explorer</span>}
            {gameState.skillLevel === 'adventurer' && <span>🌟 Adventurer</span>}
            {gameState.skillLevel === 'champion' && <span>🏆 Champion</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default PuzzleDisplay;
