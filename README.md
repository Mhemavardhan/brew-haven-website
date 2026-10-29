# Brew Haven — Artisanal Coffee & Online Table Reservation System

> **Software Engineering and System Design (SESD) — Assignment 3**  
> **Course Code:** 24CS301PC311 | **Department:** Computer Science and Engineering  
> **Institution:** SR University  

---

## ☕ Project Overview

**Brew Haven** is a modern, responsive single-page web application developed for a specialty coffee shop. It showcases handcrafted espresso drinks, artisan cold brews, fresh in-house bakery treats, and an interactive client-side **Online Table Reservation System**.

The project demonstrates professional frontend design principles alongside industry-standard **Git version control and GitHub Pages static deployment workflows**.

---

## ✨ Key Features

- **Responsive Hero Landing:** Engaging brand identity, promotional tagline, real-time café highlights, and dual call-to-actions.
- **Categorized Menu Filter:** Interactive filtering for *All Selections*, *Hot Brews*, *Cold Specialties*, and *Bakery & Bites*.
- **Interactive Table Reservation System:** Real-time form validation (name, email, phone, dining date, time slot, party size, seating zone), input sanitization, past-date disabling, and dynamic instant booking confirmation modal with unique reference codes.
- **Location & Café Hours:** Transparent operational schedules, contact channels, and physical address details.
- **Fully Responsive Architecture:** Optimized across mobile smartphones, tablets, laptops, and ultra-wide desktop viewports with a collapsible navigation drawer.
- **Client-Side Simulation:** Clear architecture noting that table bookings are verified client-side for demonstration without external server dependencies.

---

## 🛠️ Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic document structuring (`header`, `nav`, `section`, `article`, `footer`, accessible forms) |
| **CSS3** | Custom typography, Flexbox, CSS Grid, media queries, CSS variables, modal overlays |
| **JavaScript (ES6+)** | DOM manipulation, hamburger menu toggle, menu category filtering, form validation, dynamic modal |
| **Git** | Distributed version control (branches, commits, merges, conflict resolution) |
| **GitHub Pages** | Static cloud deployment and hosting |

---

## 📁 Project Directory Structure

```text
BrewHaven/
├── index.html               # Main website markup & semantic sections
├── style.css                # Responsive stylesheet and typography
├── script.js                # Interactive logic, filtering & reservation engine
├── assets/
│   └── images/              # Optimized SVG coffee art, logos and icons
│       ├── logo.svg
│       ├── hero-coffee.svg
│       ├── espresso.svg
│       ├── cappuccino.svg
│       ├── coldbrew.svg
│       └── pastry.svg
├── README.md                # Project documentation & Git workflow guide
└── .gitignore               # Ignored system and build files
```

---

## 🚀 How to Run Locally

1. **Clone or Download the Repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/brew-haven-website.git
   cd brew-haven-website
   ```

2. **Open in Any Modern Browser:**
   - On macOS:
     ```bash
     open index.html
     ```
   - On Windows:
     ```bash
     start index.html
     ```
   - Or using Python's built-in local development server:
     ```bash
     python3 -m http.server 8000
     ```
     Then navigate to `http://localhost:8000` in your web browser.

---

## 🔄 Git Workflow Summary

This repository was constructed and version-controlled following the official SESD Lab 3 guidelines:

1. **Repository Initialization:**
   `git init` to initialize the local version control tracking.
2. **User Configuration:**
   Configured global/local identity using `git config user.name` and `git config user.email`.
3. **Staging & Commit Milestones:**
   Staged changes incrementally with `git add .` and committed using descriptive messages.
4. **Branching & Feature Isolation:**
   Created isolated feature branches (`feature/responsive-design` and `feature/reservation-validation`) to build and test improvements independently before merging into `main`.
5. **Controlled Conflict Resolution:**
   Demonstrated branch conflict identification, inspected diff markers (`<<<<<<<`, `=======`, `>>>>>>>`), and cleanly resolved content overlap.
6. **GitHub Synchronization & Pages Deployment:**
   Linked to GitHub via `git remote add origin` and deployed live using **GitHub Pages** from the `main` branch root.

---

## 🌐 Live Deployment & Repository Links

- **GitHub Repository:** [https://github.com/Mhemavardhan/brew-haven-website](https://github.com/Mhemavardhan/brew-haven-website)
- **Live GitHub Pages URL:** [https://mhemavardhan.github.io/brew-haven-website/](https://mhemavardhan.github.io/brew-haven-website/)

---

## 👥 Student & Academic Credentials

- **Course:** Software Engineering and System Design (24CS301PC311)
- **Institution:** SR University, Warangal / Hyderabad
- **Department:** Computer Science and Engineering (School of CS & AI)
- **Assignment:** SESD Lab Assignment 03/12
