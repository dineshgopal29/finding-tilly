import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../contexts/GameContext';
import '../styles/PuzzleDisplay.css';

const PuzzleDisplay = ({ puzzle, skillLevel }) => {
  const { checkAnswer, loadBonusPuzzle, checkBonusAnswer } = useGameContext();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const [bonusPuzzle, setBonusPuzzle] = useState(null);
  const [bonusSelectedOption, setBonusSelectedOption] = useState(null);
  const [bonusResult, setBonusResult] = useState(null);
  const navigate = useNavigate();

  // Reset state when puzzle changes
  useEffect(() => {
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
  }, [puzzle]);

  // Handle option selection
  const handleOptionSelect = async (option) => {
    if (showFeedback) return; // Prevent multiple selections during feedback
    
    setSelectedOption(option);
    setShowFeedback(true);
    
    const result = await checkAnswer(option);
    setIsCorrect(result.isCorrect);
    
    if (result.showBonus) {
      // Load bonus puzzle after a delay
      setTimeout(() => {
        handleShowBonus();
      }, 1500);
    } else {
      // Hide feedback after a delay
      setTimeout(() => {
        setShowFeedback(false);
      }, 1500);
    }
  };

  // Handle showing bonus puzzle
  const handleShowBonus = async () => {
    const bonusPuzzle = await loadBonusPuzzle();
    setBonusPuzzle(bonusPuzzle);
    setShowBonus(true);
  };

  // Handle bonus option selection
  const handleBonusOptionSelect = async (option) => {
    if (bonusResult !== null) return; // Prevent multiple selections
    
    setBonusSelectedOption(option);
    const isCorrect = await checkBonusAnswer(option);
    setBonusResult(isCorrect);
  };

  // Continue after bonus puzzle
  const handleContinueAfterBonus = () => {
    navigate('/win');
  };

  // If no puzzle is available yet
  if (!puzzle) {
    return (
      <div className="puzzle-container">
        <h3>Puzzle</h3>
        <div className="puzzle-loading">Loading puzzle...</div>
      </div>
    );
  }

  // Show bonus puzzle if active
  if (showBonus && bonusPuzzle) {
    return (
      <div className="bonus-puzzle-container">
        <h3>Bonus Challenge!</h3>
        <div className="bonus-puzzle-question">{bonusPuzzle.question}</div>
        
        <div className="bonus-puzzle-options">
          {bonusPuzzle.options.map((option, index) => (
            <button
              key={index}
              className={`bonus-option ${
                bonusSelectedOption === option
                  ? bonusResult
                    ? 'correct'
                    : 'incorrect'
                  : ''
              }`}
              onClick={() => handleBonusOptionSelect(option)}
              disabled={bonusResult !== null}
            >
              {option}
            </button>
          ))}
        </div>
        
        {bonusResult !== null && (
          <div className="bonus-result">
            <p className={bonusResult ? 'correct-message' : 'incorrect-message'}>
              {bonusResult
                ? 'Amazing! You solved the bonus puzzle!'
                : "That's not quite right, but that's okay! It was a bonus challenge."}
            </p>
            <button className="continue-button" onClick={handleContinueAfterBonus}>
              Continue Adventure
            </button>
          </div>
        )}
      </div>
    );
  }

  // Regular puzzle display
  return (
    <div className="puzzle-container">
      <h3>Puzzle</h3>
      <div className="puzzle-question">{puzzle.question}</div>
      
      <div className="puzzle-options">
        {puzzle.options.map((option, index) => (
          <button
            key={index}
            className={`puzzle-option ${
              showFeedback && selectedOption === option
                ? isCorrect
                  ? 'correct'
                  : 'incorrect'
                : ''
            }`}
            onClick={() => handleOptionSelect(option)}
            disabled={showFeedback}
          >
            {option}
          </button>
        ))}
      </div>
      
      {showFeedback && (
        <div className="feedback-message">
          {isCorrect ? (
            <p className="correct-message">That's correct! Great job!</p>
          ) : (
            <p className="incorrect-message">That's not quite right. Try again!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PuzzleDisplay;
