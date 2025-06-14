This is a small personal experiment to check out the current state of vibe-coding!
That means to use as much AI as possible and to do as little as possible by hand.

Let's see if I can create a small browser-based multiplayer-game with the help of AI :)

Static version:
'https://martinschmeisser1.github.io/promptguessr/'

Multiplayer-version with synchronized game-state:
'https://promptguessr.onrender.com/'

# 🧠 Prompt Guessing Game

## 🎯 Overview

**Prompt Guessing Game** is a web app where multiple users can see a KI-generated image and try to guess the prompt that generated it – one word at a time.

It offers a synchronized multiplayer experience, allowing players to collaborate in real-time.

---

## 🕹️ Game Concept

- The app displays a **KI-generated AI image**.
- This image was created using a **prompt**.
- The prompt is split into individual words.
- Players guess one word at a time:
  - Correct guesses are revealed to all players in real-time.
  - When all words are guessed, the next image appears.
- The game features synchronized multiplayer: anyone who opens the page sees the same round and can play together in real-time.

---

## 🧱 Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express and Socket.IO
- **Hosting**: Render
- **Storage**: Static files (images + prompts in JSON)

---

## 📁 Project Structure

/index.html
/style.css
/script.js
/prompts.json
/index.js
/assets/
image1.jpg
image2.jpg

---

## 🚀 Goal

A fun game to experiment with web development, image-based prompts, and collaborative guessing!