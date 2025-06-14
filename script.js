const startGameButton = document.getElementById('startGame');
const introductionPage = document.getElementById('introduction-page');
const gameContainer = document.getElementById('game-container');

const guessInput = document.getElementById("guessInput");
const submitGuess = document.getElementById("submitGuess");
const revealedWordsElement = document.getElementById("revealedWords");
const promptImage = document.getElementById("promptImage");

let prompts = [];
let currentPromptIndex = 0;
let revealedWords = [];

// Connect to Socket.IO server
const socket = io();

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('gameState', (state) => {
  console.log('Game state received:', state);
  currentPromptIndex = state.currentPromptIndex;
  prompts = state.prompts;
  revealedWords = state.revealedWords;
  updateUI();
});

socket.on('wow', () => {
  displayWowImage();
});

socket.on('wrong', () => {
  displayWrongMessage();
});

socket.on('gameOver', (message) => {
  revealedWordsElement.textContent = message;
  guessInput.disabled = true;
  submitGuess.disabled = true;
});

function updateUI() {
  if (!prompts || prompts.length === 0) {
    console.warn("Prompts data is empty or not yet loaded.");
    return;
  }
  if (currentPromptIndex >= prompts.length) {
    revealedWordsElement.textContent = "Congratulations! You've completed all prompts!";
    guessInput.disabled = true;
    submitGuess.disabled = true;
    return;
  }

  const prompt = prompts[currentPromptIndex];
  if (!prompt) {
    console.warn(`No prompt found at index ${currentPromptIndex}`);
    return;
  }

  revealedWords = prompts[currentPromptIndex].revealedWords;
  const remainingWords = prompt.prompt.toLowerCase().split(" ");


  updateRevealedWords();
  promptImage.src = prompt.image;
}

function updateRevealedWords() {
  revealedWordsElement.innerHTML = "";

  revealedWords.forEach((word, index) => {
    const span = document.createElement("span");
    if (word === "_") {
      span.textContent = "_".repeat(word.length);
      span.classList.add("unrevealed-word");
    } else {
      span.textContent = word;
    }
    revealedWordsElement.appendChild(span);
    revealedWordsElement.appendChild(document.createTextNode(" "));
  });

  const promptPrefix = document.getElementById("promptPrefix");
  promptPrefix.innerHTML = "create a picture of&nbsp;";
}

// Function to display "WOW" image
function displayWowImage() {
  const wowImage = document.createElement("img");
  wowImage.src = "./assets/wow.jpg";
  wowImage.style.position = "absolute";
  wowImage.style.width = "100px"; // Set a fixed width for the image
  wowImage.style.height = "auto"; // Maintain aspect ratio

  // Generate random position within the viewport
  const randomX = Math.random() * (window.innerWidth - 100); // Subtract width of the image
  const randomY = Math.random() * (window.innerHeight - 100); // Subtract height of the image
  wowImage.style.left = `${randomX}px`;
  wowImage.style.top = `${randomY}px`;

  // Add the image to the body
  document.body.appendChild(wowImage);

  // Remove the image after 1 second
  setTimeout(() => {
    document.body.removeChild(wowImage);
  }, 1000);
}

// Function to display "WRONG" message
function displayWrongMessage() {
  const wrongMessage = document.createElement("div");
  wrongMessage.textContent = "WRONG";
  wrongMessage.style.position = "absolute";
  wrongMessage.style.color = "red";
  wrongMessage.style.fontSize = "24px";
  wrongMessage.style.fontWeight = "bold";

  // Generate random position within the viewport
  const randomX = Math.random() * (window.innerWidth - 100); // Subtract width of the message
  const randomY = Math.random() * (window.innerHeight - 50); // Subtract height of the message
  wrongMessage.style.left = `${randomX}px`;
  wrongMessage.style.top = `${randomY}px`;

  // Add the message to the body
  document.body.appendChild(wrongMessage);

  // Remove the message after 1 second
  setTimeout(() => {
    document.body.removeChild(wrongMessage);
  }, 1000);
}

submitGuess.addEventListener("click", () => {
  const guess = guessInput.value.trim().toLowerCase();
  if (guess) {
    socket.emit('guess', guess);
    guessInput.value = "";
  }
});

guessInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitGuess.click();
  }
});

startGameButton.addEventListener('click', () => {
  introductionPage.style.display = 'none';
  gameContainer.style.display = 'block';
});