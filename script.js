const guessInput = document.getElementById("guessInput");
const submitGuess = document.getElementById("submitGuess");
const revealedWordsElement = document.getElementById("revealedWords");
const promptImage = document.getElementById("promptImage");

let prompts = []; // Loaded from prompts.json
let currentPromptIndex = 0;
let revealedWords = [];
let remainingWords = [];
let wrongGuessCounter = 0; // Counter for consecutive wrong guesses


// Fetch prompts.json
fetch('./prompts.json')
  .then(response => response.json())
  .then(data => {
    prompts = shuffleArray(data); // Shuffle the prompts array
    loadPrompt(currentPromptIndex);
  })
  .catch(error => console.error("Error loading prompts.json:", error));

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


// Load the current prompt
function loadPrompt(index) {
  const prompt = prompts[index];
  // Split the single prompt string into individual words
  remainingWords = prompt.prompt.toLowerCase().split(" "); // Normalize all words to lowercase
  revealedWords = Array(remainingWords.length).fill("_"); // Create underscores for each word
  updateRevealedWords();

  // Set the image source
  promptImage.src = prompt.image;
}

// Update the revealed words display
function updateRevealedWords() {
  revealedWordsElement.innerHTML = ""; // Clear previous content

  revealedWords.forEach((word, index) => {
    const span = document.createElement("span");
    if (word === "_") {
      span.textContent = "_".repeat(remainingWords[index].length); // Display underscores based on word length
      span.classList.add("unrevealed-word");
    } else {
      span.textContent = word; // Display revealed word
    }
    revealedWordsElement.appendChild(span);
    revealedWordsElement.appendChild(document.createTextNode(" ")); // Add space between words
  });

  // Add a small space between "of" and the first unrevealed word
  const promptPrefix = document.getElementById("promptPrefix");
  promptPrefix.innerHTML = "create a picture of&nbsp;";
}

// Check if the guess is correct
function checkGuess(guess) {
  const wordIndex = remainingWords.indexOf(guess); // Check if the guessed word exists in the remaining words
  if (wordIndex !== -1) {
    revealedWords[wordIndex] = remainingWords[wordIndex]; // Reveal the guessed word
    remainingWords[wordIndex] = null; // Mark the word as guessed
    updateRevealedWords();

    // Display "WOW" image at a random position
    displayWowImage();

    // Clear the input field
    guessInput.value = "";

    wrongGuessCounter = 0; // Reset the wrong guess counter

    // Check if all words have been guessed
    if (remainingWords.every(word => word === null)) {
      guessInput.disabled = true;
      submitGuess.disabled = true;

      setTimeout(() => {
        currentPromptIndex++;
        if (currentPromptIndex < prompts.length) {
          loadPrompt(currentPromptIndex);
          guessInput.disabled = false;
          submitGuess.disabled = false;
          guessInput.value = ""; // Clear input for the next round
        } else {
          revealedWordsElement.textContent = "Congratulations! You've completed all prompts!";
        }
      }, 3000);
    }
  } else {
    // Display "WRONG" message at a random position
    displayWrongMessage();

    // Clear the input field
    guessInput.value = "";

    wrongGuessCounter++; // Increment the wrong guess counter
    if (wrongGuessCounter >= 10) {
      revealRandomWord(); // Reveal a random word if 10 wrong guesses in a row
      wrongGuessCounter = 0; // Reset the counter
    }
  }
}

// Function to reveal a random word
function revealRandomWord() {
  const unrevealedIndices = remainingWords.reduce((acc, word, index) => {
    if (word !== null) {
      acc.push(index);
    }
    return acc;
  }, []);

  if (unrevealedIndices.length > 0) {
    const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
    revealedWords[randomIndex] = remainingWords[randomIndex];
    remainingWords[randomIndex] = null;
    updateRevealedWords();
  }
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

// Add event listener for the "Submit Guess" button
submitGuess.addEventListener("click", () => {
  const guess = guessInput.value.trim().toLowerCase();
  if (guess) {
    checkGuess(guess);
  }
});

// Add event listener for the "Enter" key
guessInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    submitGuess.click(); // Trigger the button's click event
  }
});