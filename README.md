# EngiQuiz - Engineering Quiz & Practice Web Application

EngiQuiz is a fast, responsive, and completely client-side engineering quiz web application designed for students and educators. It delivers randomized, multi-subject engineering quizzes with zero server overhead, no login requirements, and instant performance analytics stored directly in the browser's `localStorage`.

---

## 🚀 Key Features

* **Multiple Engineering Branches & Subjects**:
  * Computer Science & IT (Java, Python, DBMS, SQL, Data Structures & Algorithms, Operating Systems, Computer Networks)
  * AI & Data Science (Machine Learning Fundamentals)
  * Easily extensible schema for ECE, EEE, Mechanical, and Civil Engineering
* **Dynamic & Anti-Duplicate Quiz Engine**:
  * Questions are randomized on every attempt.
  * Options (A, B, C, D) are scrambled using the Fisher-Yates algorithm while preserving answer key integrity.
  * Smart anti-duplicate selection avoids questions recently seen in past attempts.
  * Unlimited quiz generation with zero question reuse within the same session.
* **Granular Difficulty & Topic Customization**:
  * Filter questions by topic or multi-select difficulty levels (Easy, Medium, Hard).
  * Live question pool availability indicator with real-time feedback.
* **Exam Simulation & Distraction-Free UI**:
  * Real-time countdown timer with amber and red pulse warnings.
  * Question navigation matrix to quickly review answered, current, and unanswered items.
  * Auto-submission upon timer expiration.
* **Instant Scoring & Conceptual Review**:
  * Detailed review cards highlighting correct answers, incorrect selections, and in-depth explanations.
  * Confetti celebration for scores exceeding 80%.
* **Smart Progress Tracking & Analytics**:
  * Overall accuracy %, total quizzes taken, and total questions solved.
  * Interactive Subject Performance (Bar Chart) and Score Progression (Line Chart) via Chart.js.
  * **Weak Topic Identification**: Automatically highlights topics with accuracy below 75% with a 1-click practice button.
  * **Mistakes Bank**: Tracks wrong answers and clears them automatically once answered correctly.
  * **Streak Tracking**: Tracks consecutive days of practice.
  * **Milestone Badges**: Unlockable achievements (First Quiz, 100 Questions, 7-Day Streak, Perfect Score, Subject Master).
* **Question Bookmarking**:
  * Star questions during tests or reviews to build a personalized revision bank.
* **Daily Challenge**:
  * Deterministic daily quiz featuring 10 curated questions across diverse disciplines.
* **Clean Engineering Theme**:
  * Professional purple & white palette with dark mode / light mode toggle.
  * Mobile and tablet responsive layout with 48px+ touch targets.

---

## 📂 Project Structure

```text
├── index.html              # Landing page & quick dashboard
├── subjects.html           # Subject browser with branch filters and live search
├── practice.html           # Quiz configuration screen (topics, difficulties, counts)
├── quiz.html               # Distraction-free active quiz interface
├── result.html             # Detailed score breakdown & conceptual solution review
├── progress.html           # Analytics dashboard, weak topics, mistakes bank & badges
├── history.html            # Complete history table of past attempts
├── bookmarks.html          # Bookmarked questions manager and practice launcher
├── css/
│   ├── style.css           # Global theme, CSS variables, buttons, navbar & typography
│   ├── dashboard.css       # Stat cards, subject cards, charts & achievements styling
│   ├── quiz.css            # Quiz interface, timer animations, matrix & review cards
│   └── responsive.css      # Touch targets and tablet/mobile media queries
├── js/
│   ├── app.js              # Navbar wiring, theme toggle & streak display
│   ├── storage.js          # LocalStorage persistence layer with error handling
│   ├── questions.js        # Validation, filtering, anti-duplicate & quiz generator
│   ├── dashboard.js        # Home dashboard logic & recent attempts
│   ├── quiz.js             # Active quiz timer, state management & submission
│   ├── result.js           # Result computation, confetti & explanations
│   ├── progress.js         # Chart.js charts, weak topic analysis & badges
│   ├── history.js          # Searchable & filterable attempt history
│   ├── bookmarks.js        # Saved questions controller
│   └── daily.js            # Daily challenge utilities
└── data/
    ├── subjects.js         # Catalog of engineering branches and subjects
    └── questions.js        # 160+ verified technical questions bank
```

---

## 🛠️ Technology Stack

* **Markup**: HTML5 (semantic, accessible)
* **Styling**: Bootstrap 5.3 + Custom CSS3 variables
* **Icons**: Bootstrap Icons
* **Scripting**: Vanilla JavaScript (ES6+ modular design)
* **Visualization**: Chart.js
* **Persistence**: Browser `localStorage` (No backend or database needed)

---

## 📦 Adding New Questions

To add more questions to EngiQuiz, simply append question objects to `RAW_QUESTIONS` in `data/questions.js`:

```javascript
{
  id: "java_new_01",
  branch: "CSE",
  subject: "Java",
  topic: "Concurrency",
  difficulty: "Hard", // "Easy" | "Medium" | "Hard"
  question: "What is the purpose of the volatile keyword in Java?",
  options: [
    "It ensures visibility of changes to variables across threads",
    "It makes a variable immutable and thread-safe",
    "It synchronizes all methods operating on the variable",
    "It prevents garbage collection of the variable"
  ],
  answer: 0, // Zero-indexed position of the correct option (0, 1, 2, or 3)
  explanation: "The volatile keyword in Java guarantees that reads and writes are made directly to main memory rather than thread CPU caches, ensuring memory visibility."
}
```

The `QuestionEngine` automatically validates all questions at runtime and rejects malformed records.

---

## 🌐 Deployment Instructions

EngiQuiz is a 100% static application and can be hosted immediately on any web server or static hosting provider.

### 1. GitHub Pages
1. Push this repository to GitHub.
2. Go to **Settings** > **Pages**.
3. Under **Branch**, select `main` (or `master`) and directory `/ (root)`.
4. Click **Save**. Your site will be live at `https://<username>.github.io/<repo-name>/`.

### 2. Netlify
1. Drag and drop the project folder into [Netlify Drop](https://app.netlify.com/drop), or connect your Git repository.
2. Build command: *(leave empty or use `npm run build`)*.
3. Publish directory: `.` (or `dist` if building with Vite).

### 3. Vercel
1. Run `vercel` in the project directory or import your GitHub repository into the Vercel dashboard.
2. Framework Preset: **Other** / **Vite**.
3. Deploy!

---

## 📄 License
MIT License. Free for students, educators, and developers to use and expand.
