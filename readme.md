This is a small personal experiment to check out the current state of vibe-coding!
That means to use as much AI as possible and to do as little as possible by hand.

Let's see if I can create a small browser-based multiplayer-game with the help of AI :)

Try it out here:
'https://martinschmeisser1.github.io/promptguessr/'

# 🧠 Prompt Guessing Game

## 🎯 Overview

**Prompt Guessing Game** is a small, browser-based web app where multiple users can see a **KI-generated image** and try to guess the **prompt** that generated it – one word at a time.

It's designed to be lightweight, requires no login, backend, or database, and is hosted freely via **GitHub Pages**.

---

## 🕹️ Game Concept

- The app displays a **pre-generated AI image**.
- This image was created using a **prompt** (e.g., _"A giraffe sitting in a tree"_).
- The prompt is split into individual words.
- Players guess one word at a time:
  - Correct guesses are revealed.
  - When all words are guessed, the next image appears.
- The game is "pseudo-multiplayer": anyone who opens the page sees the same round (but there's no real-time sync or user accounts).

---

## 🧱 Tech Stack

- **Frontend Only**: HTML, CSS, JavaScript
- **Hosting**: GitHub Pages (Free)
- **Backend**: None
- **Storage**: Static files (images + prompts in JSON)

---

## 📁 Project Structure (Example)

/index.html
/style.css
/script.js
/prompts.json
/assets/
image1.jpg
image2.jpg

---

## 🚀 Goal

A simple, fun game to experiment with static web development, image-based prompts, and collaborative guessing — perfect for sharing with friends!
