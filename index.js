const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Game state
let prompts = [];

// Load prompts from prompts.json
try {
  const promptsPath = path.join(__dirname, 'prompts.json');
  const promptsData = fs.readFileSync(promptsPath, 'utf8');
  prompts = JSON.parse(promptsData);
  console.log('Prompts loaded successfully:', prompts);
} catch (error) {
  console.error('Error loading prompts.json:', error);
}

// Shuffle prompts array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

prompts = shuffleArray(prompts);

// Initialize revealedWords array for each prompt
prompts = prompts.map(prompt => ({
  ...prompt,
  revealedWords: Array(prompt.prompt.split(" ").length).fill("_")
}));

let currentPromptIndex = 0;
let gameActive = true; // Flag to prevent multiple prompt changes

io.on('connection', (socket) => {
  console.log('New client connected');

  let wrongGuessCounter = 0; // Initialize wrong guess counter for this client

  // Function to send the current game state to *all* clients
  const broadcastGameState = () => {
    io.emit('gameState', {
      currentPromptIndex: currentPromptIndex,
      revealedWords: prompts[currentPromptIndex].revealedWords,
      prompts: prompts
    });
  };

  // Function to reveal a random word
  const revealRandomWord = () => {
    const prompt = prompts[currentPromptIndex];
    const unrevealedIndices = prompt.revealedWords.reduce((acc, word, index) => {
      if (word === "_") {
        acc.push(index);
      }
      return acc;
    }, []);

    if (unrevealedIndices.length > 0) {
      const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
      prompt.revealedWords[randomIndex] = prompt.prompt.toLowerCase().split(" ")[randomIndex];
    }
  };

  // Send initial game state to the *new* client
  socket.emit('gameState', {
      currentPromptIndex: currentPromptIndex,
      revealedWords: prompts[currentPromptIndex].revealedWords,
      prompts: prompts
  });

  // Handle guess submission
  socket.on('guess', (guess) => {
    if (!gameActive) return;

    console.log('Guess received:', guess);

    const prompt = prompts[currentPromptIndex];
    const remainingWords = prompt.prompt.toLowerCase().split(" ");
    let correctGuess = false;

    // Reveal all occurrences of the guessed word
    for (let i = 0; i < remainingWords.length; i++) {
      if (remainingWords[i] === guess && prompt.revealedWords[i] === "_") {
        prompt.revealedWords[i] = guess;
        correctGuess = true;
      }
    }

    if (!correctGuess) {
      wrongGuessCounter++; // Increment wrong guess counter on wrong guess
    } else {
      wrongGuessCounter = 0; // Reset wrong guess counter on correct guess
    }

    if (wrongGuessCounter >= 10) {
      revealRandomWord(); // Reveal a random word
      wrongGuessCounter = 0; // Reset wrong guess counter
    }

    // Check if all words have been guessed
    if (prompt.revealedWords.every(word => word !== "_")) {
      gameActive = false; // Prevent further guesses

      // All words guessed, move to the next prompt after a delay
      broadcastGameState(); // to reveal the last word
      setTimeout(() => {
        currentPromptIndex++;
        if (currentPromptIndex >= prompts.length) {
          // Game Over
          io.emit('gameOver', "Congratulations! You've completed all prompts!");
          gameActive = false;
          return;
        }
        // Reset revealedWords for the next prompt
        prompts = prompts.map(prompt => ({
            ...prompt,
            revealedWords: Array(prompt.prompt.split(" ").length).fill("_")
        }));
        broadcastGameState(); // Use broadcastGameState to update all clients
        gameActive = true; // Reset game state
      }, 3000);
    } else {
      // Not all words guessed, send the updated game state
      broadcastGameState(); // Use broadcastGameState to update all clients
    }

    if (correctGuess) {
      socket.emit('wow'); // Emit "wow" event to the specific client
    } else {
      socket.emit('wrong'); // Emit "wrong" event to the specific client
    }
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});