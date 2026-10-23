# Minor Project 03: CineSky Hub - Dual Dashboard (Weather & Cinematic Vault) 🌦️🎬

Developed as part of the Unlox Academy Web Development curriculum[cite: 1].

---

## 📋 Project Overview
**CineSky Hub** is a professional, responsive dual-app dashboard combining a real-time atmospheric weather station and a cinematic vault for movies and web series, powered by live public REST APIs[cite: 1].

### ✨ Key Features
1. **Atmospheric Weather App:** 
   - Real-time meteorological data search for any city worldwide[cite: 1].
   - Displays temperature, feels-like metrics, humidity, wind speed, atmospheric pressure, visibility, and local sunrise/sunset timings.
2. **Cinematic Vault (Movies & Web Series):**
   - **Dynamic Startup Feed:** Automatically loads a curated mix of blockbuster movies and hit web series on launch.
   - **Category Filtering:** Quick-select dropdown to instantly toggle between **All Categories**, **Movies Only**, and **Web Series Only**.
   - **Interactive Details Modal:** Click on any title to view deep metadata including full plots, IMDB star ratings, lead cast/actors, directors, release dates, and total seasons count.
3. **Unified Navigation:** Sleek, dark-themed responsive UI with smooth transitions across the landing page, weather radar, and movie vault.

---

## 🛠️ Technology Stack
- **HTML5**[cite: 1]
- **CSS3** (Responsive design, custom gradients, Flexbox, and CSS Grid)
- **JavaScript (ES6+)** (Async/Await, Fetch API, DOM Manipulation, Error Handling)[cite: 1]
- **Public APIs:** OpenWeatherMap API & OMDb API[cite: 1]
- **Git & GitHub** for version control[cite: 1]

---

## 📁 File Structure
```text
cinesky-hub/
│
├── index.html                # Main landing dashboard
├── README.md                 # Project documentation
│
├── weather-app/              # Application 1: Weather App
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── movie-app/                # Application 2: Movie & Web Series Vault
    ├── index.html
    ├── style.css
    └── script.js