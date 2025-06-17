// Game service with puzzle generation and game logic

// Generate dynamic alphabet puzzles for different difficulty levels
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
  
  // Generate puzzles based on difficulty
  switch (difficulty) {
    case 'novice':
      // Simple "what comes after" puzzles
      for (let i = 0; i < 5; i++) {
        const letterIndex = Math.floor(Math.random() * 20); // Random letter from A to T
        const letter = alphabet[letterIndex];
        const nextLetter = alphabet[letterIndex + 1];
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomLetter([nextLetter, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What letter comes after ${letter}?`,
          answer: nextLetter,
          options: [nextLetter, ...wrongOptions].sort(() => Math.random() - 0.5),
          type: 'alphabet'
        });
      }
      
      // Simple "what comes before" puzzles
      for (let i = 0; i < 5; i++) {
        const letterIndex = Math.floor(Math.random() * 20) + 1; // Random letter from B to U
        const letter = alphabet[letterIndex];
        const prevLetter = alphabet[letterIndex - 1];
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomLetter([prevLetter, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What letter comes before ${letter}?`,
          answer: prevLetter,
          options: [prevLetter, ...wrongOptions].sort(() => Math.random() - 0.5),
          type: 'alphabet'
        });
      }
      
      // Add fun alphabet puzzles with emojis
      const alphabetEmojis = {
        'A': '🍎 Apple',
        'B': '🐻 Bear',
        'C': '🐱 Cat',
        'D': '🐶 Dog',
        'E': '🐘 Elephant',
        'F': '🐟 Fish',
        'G': '🦒 Giraffe',
        'H': '🏠 House',
        'I': '🍦 Ice cream',
        'J': '🤹 Juggler',
        'K': '🪁 Kite',
        'L': '🦁 Lion',
        'M': '🐵 Monkey',
        'N': '📰 Newspaper',
        'O': '🐙 Octopus',
        'P': '🐧 Penguin',
        'Q': '👸 Queen',
        'R': '🐇 Rabbit',
        'S': '🐍 Snake',
        'T': '🐯 Tiger',
        'U': '☂️ Umbrella',
        'V': '🚐 Van',
        'W': '🐺 Wolf',
        'X': '📦 Box',
        'Y': '🧶 Yarn',
        'Z': '🦓 Zebra'
      };
      
      for (let i = 0; i < 5; i++) {
        const letterIndex = Math.floor(Math.random() * alphabet.length);
        const letter = alphabet[letterIndex];
        const emoji = alphabetEmojis[letter].split(' ')[0];
        const word = alphabetEmojis[letter].split(' ')[1];
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomLetter([letter, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `${emoji} ${word} starts with what letter?`,
          answer: letter,
          options: [letter, ...wrongOptions].sort(() => Math.random() - 0.5),
          type: 'alphabet'
        });
      }
      break;
      
    case 'scholar':
      // "What letter is X letters after" puzzles
      for (let i = 0; i < 5; i++) {
        const step = Math.floor(Math.random() * 3) + 2; // 2-4 steps
        const letterIndex = Math.floor(Math.random() * (26 - step));
        const letter = alphabet[letterIndex];
        const targetLetter = alphabet[letterIndex + step];
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomLetter([targetLetter, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What letter is ${step} letters after ${letter}?`,
          answer: targetLetter,
          options: [targetLetter, ...wrongOptions].sort(() => Math.random() - 0.5),
          type: 'alphabet'
        });
      }
      
      // "What is the Xth letter" puzzles
      for (let i = 0; i < 5; i++) {
        const position = Math.floor(Math.random() * 20) + 1; // 1st to 20th letter
        const letter = alphabet[position - 1];
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomLetter([letter, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What is the ${position}${getOrdinalSuffix(position)} letter of the alphabet?`,
          answer: letter,
          options: [letter, ...wrongOptions].sort(() => Math.random() - 0.5),
          type: 'alphabet'
        });
      }
      
      // Missing letter puzzles
      const words = [
        { word: 'C_T', answer: 'A' },
        { word: '_OG', answer: 'D' },
        { word: 'BE_', answer: 'D' },
        { word: '_AT', answer: 'H' },
        { word: 'S_Y', answer: 'K' },
        { word: '_UN', answer: 'S' },
        { word: 'PE_', answer: 'N' },
        { word: '_IG', answer: 'P' },
        { word: 'B_G', answer: 'A' },
        { word: '_UP', answer: 'C' }
      ];
      
      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        const { word, answer } = words[randomIndex];
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomLetter([answer, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What letter is missing? ${word}`,
          answer,
          options: [answer, ...wrongOptions].sort(() => Math.random() - 0.5),
          type: 'alphabet'
        });
      }
      break;
      
    case 'master':
      // Pattern recognition puzzles
      for (let i = 0; i < 5; i++) {
        const step = Math.floor(Math.random() * 2) + 2; // 2-3 steps
        const startIndex = Math.floor(Math.random() * (26 - (step * 3)));
        
        const first = alphabet[startIndex];
        const second = alphabet[startIndex + step];
        const third = alphabet[startIndex + (step * 2)];
        const answer = alphabet[startIndex + (step * 3)];
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomLetter([answer, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What letter comes next? ${first}, ${second}, ${third}, _`,
          answer: answer,
          options: [answer, ...wrongOptions].sort(() => Math.random() - 0.5),
          type: 'alphabet'
        });
      }
      
      // Position from end puzzles
      for (let i = 0; i < 5; i++) {
        const position = Math.floor(Math.random() * 20) + 1; // 1st to 20th letter from end
        const letter = alphabet[25 - (position - 1)];
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomLetter([letter, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What is the ${position}${getOrdinalSuffix(position)} letter from the end of the alphabet?`,
          answer: letter,
          options: [letter, ...wrongOptions].sort(() => Math.random() - 0.5),
          type: 'alphabet'
        });
      }
      
      // Vowel/consonant puzzles
      const vowels = ['A', 'E', 'I', 'O', 'U'];
      for (let i = 0; i < 5; i++) {
        const isVowel = Math.random() > 0.5;
        const possibleLetters = isVowel ? vowels : alphabet.split('').filter(l => !vowels.includes(l));
        const answer = possibleLetters[Math.floor(Math.random() * possibleLetters.length)];
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongPool = isVowel ? alphabet.split('').filter(l => !vowels.includes(l)) : vowels;
          const wrongOption = wrongPool[Math.floor(Math.random() * wrongPool.length)];
          if (!wrongOptions.includes(wrongOption)) {
            wrongOptions.push(wrongOption);
          }
        }
        
        puzzles.push({
          question: `Which of these is a ${isVowel ? 'vowel' : 'consonant'}?`,
          answer,
          options: [answer, ...wrongOptions].sort(() => Math.random() - 0.5),
          type: 'alphabet'
        });
      }
      break;
      
    default:
      // Default to novice puzzles
      return generateAlphabetPuzzles('novice');
  }
  
  return puzzles;
};

// Generate dynamic number puzzles for different difficulty levels
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
  
  // Generate puzzles based on difficulty
  switch (difficulty) {
    case 'novice':
      // Simple "what comes after" puzzles
      for (let i = 0; i < 5; i++) {
        const number = Math.floor(Math.random() * 10) + 1; // 1-10
        const nextNumber = number + 1;
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomNumber(1, 15, [nextNumber, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What number comes after ${number}?`,
          answer: String(nextNumber),
          options: [String(nextNumber), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5),
          type: 'numbers'
        });
      }
      
      // Simple "what comes before" puzzles
      for (let i = 0; i < 5; i++) {
        const number = Math.floor(Math.random() * 10) + 2; // 2-11
        const prevNumber = number - 1;
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomNumber(1, 15, [prevNumber, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What number comes before ${number}?`,
          answer: String(prevNumber),
          options: [String(prevNumber), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5),
          type: 'numbers'
        });
      }
      
      // Visual counting puzzles with emojis
      const countingEmojis = ['🍎', '🐻', '🐱', '🐶', '🍦', '🎈', '🎁', '⭐', '🦄', '🚀'];
      for (let i = 0; i < 5; i++) {
        const count = Math.floor(Math.random() * 5) + 1; // 1-5
        const emoji = countingEmojis[Math.floor(Math.random() * countingEmojis.length)];
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomNumber(1, 7, [count, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `How many ${emoji} do you see? ${emoji.repeat(count)}`,
          answer: String(count),
          options: [String(count), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5),
          type: 'numbers'
        });
      }
      break;
      
    case 'scholar':
      // "What number is X more than" puzzles
      for (let i = 0; i < 5; i++) {
        const step = Math.floor(Math.random() * 5) + 5; // 5-9 steps
        const number = Math.floor(Math.random() * 20) + 1; // 1-20
        const targetNumber = number + step;
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomNumber(number, number + 15, [targetNumber, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What number is ${step} more than ${number}?`,
          answer: String(targetNumber),
          options: [String(targetNumber), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5),
          type: 'numbers'
        });
      }
      
      // Sequence puzzles
      for (let i = 0; i < 5; i++) {
        const step = Math.floor(Math.random() * 3) + 2; // 2-4 steps
        const start = Math.floor(Math.random() * 10) + 1; // 1-10
        
        const sequence = [start, start + step, start + (step * 2)];
        const answer = start + (step * 3);
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomNumber(answer - 5, answer + 5, [answer, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What number comes next? ${sequence.join(', ')}, _`,
          answer: String(answer),
          options: [String(answer), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5),
          type: 'numbers'
        });
      }
      
      // Even/odd number puzzles
      for (let i = 0; i < 5; i++) {
        const isEven = Math.random() > 0.5;
        const numbers = [];
        
        // Generate 3 even or odd numbers
        for (let j = 0; j < 3; j++) {
          let num;
          do {
            num = Math.floor(Math.random() * 20) + 1;
          } while (numbers.includes(num) || (num % 2 === 0) !== isEven);
          numbers.push(num);
        }
        
        // Generate answer - another even or odd number
        let answer;
        do {
          answer = Math.floor(Math.random() * 20) + 1;
        } while (numbers.includes(answer) || (answer % 2 === 0) !== isEven);
        
        // Generate wrong options - numbers of opposite type
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          let wrongOption;
          do {
            wrongOption = Math.floor(Math.random() * 20) + 1;
          } while (
            numbers.includes(wrongOption) || 
            wrongOptions.includes(wrongOption) || 
            (wrongOption % 2 === 0) === isEven
          );
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `Which number belongs with this group? ${numbers.join(', ')}`,
          answer: String(answer),
          options: [String(answer), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5),
          type: 'numbers'
        });
      }
      break;
      
    case 'master':
      // Complex sequence puzzles
      for (let i = 0; i < 5; i++) {
        // Different types of sequences
        const sequenceTypes = [
          // Arithmetic (add constant)
          () => {
            const step = Math.floor(Math.random() * 5) + 3; // 3-7 steps
            const start = Math.floor(Math.random() * 10) + 1; // 1-10
            
            const sequence = [start, start + step, start + (step * 2)];
            const answer = start + (step * 3);
            
            return {
              sequence,
              answer,
              range: [answer - 10, answer + 10]
            };
          },
          // Geometric (multiply by constant)
          () => {
            const multiplier = Math.floor(Math.random() * 2) + 2; // 2-3 multiplier
            const start = Math.floor(Math.random() * 3) + 1; // 1-3
            
            const sequence = [start, start * multiplier, start * Math.pow(multiplier, 2)];
            const answer = start * Math.pow(multiplier, 3);
            
            return {
              sequence,
              answer,
              range: [answer - 15, answer + 15]
            };
          },
          // Fibonacci-like (add previous two)
          () => {
            const start1 = Math.floor(Math.random() * 5) + 1; // 1-5
            const start2 = Math.floor(Math.random() * 5) + 1; // 1-5
            
            const sequence = [start1, start2, start1 + start2];
            const answer = start2 + sequence[2];
            
            return {
              sequence,
              answer,
              range: [answer - 10, answer + 10]
            };
          }
        ];
        
        // Pick a random sequence type
        const sequenceGenerator = sequenceTypes[Math.floor(Math.random() * sequenceTypes.length)];
        const { sequence, answer, range } = sequenceGenerator();
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomNumber(range[0], range[1], [answer, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What number comes next? ${sequence.join(', ')}, _`,
          answer: String(answer),
          options: [String(answer), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5),
          type: 'numbers'
        });
      }
      
      // Double/half puzzles
      for (let i = 0; i < 5; i++) {
        const isDouble = Math.random() > 0.5;
        const number = isDouble ? 
          Math.floor(Math.random() * 25) + 5 : // 5-29 for doubling
          Math.floor(Math.random() * 10) * 2 + 10; // 10-28 (even numbers) for halving
        
        const answer = isDouble ? number * 2 : number / 2;
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomNumber(
            Math.max(1, answer - 10), 
            answer + 10, 
            [answer, ...wrongOptions]
          );
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What is ${isDouble ? 'double' : 'half'} of ${number}?`,
          answer: String(answer),
          options: [String(answer), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5),
          type: 'numbers'
        });
      }
      
      // Missing number puzzles
      for (let i = 0; i < 5; i++) {
        const max = Math.floor(Math.random() * 5) + 5; // 5-9
        const numbers = Array.from({length: max}, (_, i) => i + 1);
        const missingIndex = Math.floor(Math.random() * numbers.length);
        const missingNumber = numbers[missingIndex];
        
        // Remove the missing number
        numbers.splice(missingIndex, 1);
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomNumber(1, max + 3, [missingNumber, ...wrongOptions, ...numbers]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What number is missing? ${numbers.join(', ')}`,
          answer: String(missingNumber),
          options: [String(missingNumber), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5),
          type: 'numbers'
        });
      }
      break;
      
    default:
      // Default to novice puzzles
      return generateNumberPuzzles('novice');
  }
  
  return puzzles;
};

// Generate dynamic addition puzzles for different difficulty levels
const generateAdditionPuzzles = (difficulty) => {
  const puzzles = [];
  
  // Helper function to get random number in range
  const getRandomNumber = (min, max, exclude = []) => {
    let num;
    do {
      num = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (exclude.includes(num));
    return num;
  };
  
  // Generate puzzles based on difficulty
  switch (difficulty) {
    case 'novice':
      // Simple addition with small numbers
      for (let i = 0; i < 10; i++) {
        const a = Math.floor(Math.random() * 5) + 1; // 1-5
        const b = Math.floor(Math.random() * 5) + 1; // 1-5
        const sum = a + b;
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomNumber(2, 12, [sum, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What is ${a} + ${b}?`,
          answer: String(sum),
          options: [String(sum), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5)
        });
      }
      break;
      
    case 'scholar':
      // Addition with medium numbers
      for (let i = 0; i < 5; i++) {
        const a = Math.floor(Math.random() * 10) + 5; // 5-14
        const b = Math.floor(Math.random() * 10) + 5; // 5-14
        const sum = a + b;
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomNumber(sum - 5, sum + 5, [sum, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What is ${a} + ${b}?`,
          answer: String(sum),
          options: [String(sum), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5)
        });
      }
      
      // Three number addition
      for (let i = 0; i < 5; i++) {
        const a = Math.floor(Math.random() * 5) + 1; // 1-5
        const b = Math.floor(Math.random() * 5) + 1; // 1-5
        const c = Math.floor(Math.random() * 5) + 1; // 1-5
        const sum = a + b + c;
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomNumber(sum - 3, sum + 3, [sum, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What is ${a} + ${b} + ${c}?`,
          answer: String(sum),
          options: [String(sum), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5)
        });
      }
      break;
      
    case 'master':
      // Addition with larger numbers
      for (let i = 0; i < 5; i++) {
        const a = Math.floor(Math.random() * 50) + 10; // 10-59
        const b = Math.floor(Math.random() * 50) + 10; // 10-59
        const sum = a + b;
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomNumber(sum - 10, sum + 10, [sum, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What is ${a} + ${b}?`,
          answer: String(sum),
          options: [String(sum), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5)
        });
      }
      
      // Word problems
      const wordProblems = [
        (a, b) => `If you have ${a} apples and get ${b} more, how many apples do you have in total?`,
        (a, b) => `There are ${a} birds in a tree and ${b} more birds join them. How many birds are there now?`,
        (a, b) => `You read ${a} pages on Monday and ${b} pages on Tuesday. How many pages did you read in total?`,
        (a, b) => `If you have ${a} stickers and your friend gives you ${b} more, how many stickers do you have now?`,
        (a, b) => `There are ${a} red balloons and ${b} blue balloons. How many balloons are there altogether?`
      ];
      
      for (let i = 0; i < 5; i++) {
        const a = Math.floor(Math.random() * 20) + 5; // 5-24
        const b = Math.floor(Math.random() * 20) + 5; // 5-24
        const sum = a + b;
        
        // Pick a random word problem
        const problemIndex = Math.floor(Math.random() * wordProblems.length);
        const question = wordProblems[problemIndex](a, b);
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomNumber(sum - 5, sum + 5, [sum, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question,
          answer: String(sum),
          options: [String(sum), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5)
        });
      }
      break;
      
    default:
      // Default to novice puzzles
      return generateAdditionPuzzles('novice');
  }
  
  return puzzles;
};

// Generate bonus puzzles for different difficulty levels
const generateBonusPuzzles = (difficulty) => {
  const puzzles = [];
  
  // Helper function to get random number in range
  const getRandomNumber = (min, max, exclude = []) => {
    let num;
    do {
      num = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (exclude.includes(num));
    return num;
  };
  
  // Generate puzzles based on difficulty
  switch (difficulty) {
    case 'novice':
      // Simple counting puzzle
      {
        const count = Math.floor(Math.random() * 5) + 3; // 3-7
        const answer = count;
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomNumber(1, 10, [answer, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `How many stars do you see? ${'⭐'.repeat(count)}`,
          answer: String(answer),
          options: [String(answer), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5)
        });
      }
      
      // Simple vowel counting
      {
        const words = [
          { word: 'APPLE', answer: '2' },
          { word: 'BANANA', answer: '3' },
          { word: 'CAT', answer: '1' },
          { word: 'ELEPHANT', answer: '3' },
          { word: 'FISH', answer: '1' }
        ];
        
        const { word, answer } = words[Math.floor(Math.random() * words.length)];
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = String(getRandomNumber(1, 5, [parseInt(answer), ...wrongOptions.map(Number)]));
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `How many vowels (A, E, I, O, U) are in the word ${word}?`,
          answer,
          options: [answer, ...wrongOptions].sort(() => Math.random() - 0.5)
        });
      }
      break;
      
    case 'scholar':
      // Simple subtraction
      {
        const a = Math.floor(Math.random() * 10) + 5; // 5-14
        const b = Math.floor(Math.random() * 5) + 1; // 1-5
        const answer = a - b;
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomNumber(1, 15, [answer, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What is ${a} - ${b}?`,
          answer: String(answer),
          options: [String(answer), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5)
        });
      }
      
      // Simple multiplication
      {
        const a = Math.floor(Math.random() * 5) + 1; // 1-5
        const b = Math.floor(Math.random() * 5) + 1; // 1-5
        const answer = a * b;
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomNumber(1, 25, [answer, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What is ${a} × ${b}?`,
          answer: String(answer),
          options: [String(answer), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5)
        });
      }
      break;
      
    case 'master':
      // Mixed operations
      {
        const a = Math.floor(Math.random() * 10) + 5; // 5-14
        const b = Math.floor(Math.random() * 5) + 1; // 1-5
        const c = Math.floor(Math.random() * 5) + 1; // 1-5
        const answer = a + b - c;
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomNumber(1, 20, [answer, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What is ${a} + ${b} - ${c}?`,
          answer: String(answer),
          options: [String(answer), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5)
        });
      }
      
      // Simple division
      {
        const b = Math.floor(Math.random() * 5) + 1; // 1-5
        const a = b * (Math.floor(Math.random() * 5) + 1); // Ensure divisible
        const answer = a / b;
        
        // Generate wrong options
        const wrongOptions = [];
        while (wrongOptions.length < 2) {
          const wrongOption = getRandomNumber(1, 10, [answer, ...wrongOptions]);
          wrongOptions.push(wrongOption);
        }
        
        puzzles.push({
          question: `What is ${a} ÷ ${b}?`,
          answer: String(answer),
          options: [String(answer), ...wrongOptions.map(String)].sort(() => Math.random() - 0.5)
        });
      }
      break;
      
    default:
      // Default to novice puzzles
      return generateBonusPuzzles('novice');
  }
  
  return puzzles;
};

// Helper function to get ordinal suffix
const getOrdinalSuffix = (num) => {
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) {
    return 'st';
  }
  if (j === 2 && k !== 12) {
    return 'nd';
  }
  if (j === 3 && k !== 13) {
    return 'rd';
  }
  return 'th';
};

// Generate all puzzles for a game session
export const generateGamePuzzles = (difficulty) => {
  // Generate more puzzles than needed to increase variety
  const alphabetPuzzles = generateAlphabetPuzzles(difficulty);
  const numberPuzzles = generateNumberPuzzles(difficulty);
  const additionPuzzles = generateAdditionPuzzles(difficulty);
  const bonusPuzzles = generateBonusPuzzles(difficulty);
  
  // Shuffle all puzzle arrays to increase randomness
  return {
    alphabet: alphabetPuzzles.sort(() => Math.random() - 0.5),
    numbers: numberPuzzles.sort(() => Math.random() - 0.5),
    addition: additionPuzzles.sort(() => Math.random() - 0.5),
    bonus: bonusPuzzles.sort(() => Math.random() - 0.5)
  };
};

// Get a random puzzle of specified type
export const getRandomPuzzle = (puzzles, type) => {
  if (!puzzles || !puzzles[type] || puzzles[type].length === 0) {
    return null;
  }
  
  // Increase randomness by shuffling the array first
  const shuffledPuzzles = [...puzzles[type]].sort(() => Math.random() - 0.5);
  const randomIndex = Math.floor(Math.random() * shuffledPuzzles.length);
  return shuffledPuzzles[randomIndex];
};

// Get a random bonus puzzle
export const getRandomBonusPuzzle = (puzzles) => {
  if (!puzzles || !puzzles.bonus || puzzles.bonus.length === 0) {
    return null;
  }
  
  // Increase randomness by shuffling the array first
  const shuffledBonusPuzzles = [...puzzles.bonus].sort(() => Math.random() - 0.5);
  const randomIndex = Math.floor(Math.random() * shuffledBonusPuzzles.length);
  return shuffledBonusPuzzles[randomIndex];
};

// Get emoji for location
export const getLocationEmoji = (location) => {
  const locationEmojis = {
    home: '🏠',
    garden: '🌺',
    kitchen: '🍽️',
    bedroom: '🛏️',
    dining_room: '🍴',
    closet: '👕',
    playground: '🛝',
    treehouse: '🌳',
    tilly: '🧸'  // Tilly is now a teddy bear
  };
  
  return locationEmojis[location] || '📍';
};

// Format location name for display
export const formatLocationName = (location) => {
  if (!location) return '';
  
  return location
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Format difficulty level name
export const formatDifficultyName = (level) => {
  switch (level) {
    case 'novice':
      return 'Novice Explorer';
    case 'scholar':
      return 'Curious Scholar';
    case 'master':
      return 'Puzzle Master';
    default:
      return level.charAt(0).toUpperCase() + level.slice(1);
  }
};

export default {
  generateGamePuzzles,
  getRandomPuzzle,
  getRandomBonusPuzzle,
  getLocationEmoji,
  formatLocationName,
  formatDifficultyName
};
