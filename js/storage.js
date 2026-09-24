/**
 * EngiQuiz - LocalStorage Management Module
 * Safe, robust, error-tolerant persistence layer.
 */

const StorageKeys = {
  HISTORY: "engiquiz_history",
  BOOKMARKS: "engiquiz_bookmarks",
  MISTAKES: "engiquiz_mistakes",
  SETTINGS: "engiquiz_settings",
  STREAK: "engiquiz_streak",
  CURRENT_QUIZ: "engiquiz_current_quiz",
  LAST_RESULT: "engiquiz_last_result",
  DAILY: "engiquiz_daily"
};

const Storage = {
  /**
   * Helper to safely read from localStorage
   */
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null || item === undefined) return defaultValue;
      return JSON.parse(item);
    } catch (err) {
      console.warn(`[EngiQuiz Storage] Error parsing key "${key}":`, err);
      return defaultValue;
    }
  },

  /**
   * Helper to safely write to localStorage
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`[EngiQuiz Storage] Error writing key "${key}":`, err);
      return false;
    }
  },

  /**
   * Settings & Theme
   */
  getSettings() {
    return this.get(StorageKeys.SETTINGS, { theme: "light" });
  },

  saveSettings(settings) {
    const current = this.getSettings();
    return this.set(StorageKeys.SETTINGS, { ...current, ...settings });
  },

  getTheme() {
    return this.getSettings().theme || "light";
  },

  setTheme(theme) {
    this.saveSettings({ theme });
    this.applyTheme(theme);
    return theme;
  },

  applyTheme(theme) {
    const targetTheme = theme || this.getTheme();
    document.documentElement.setAttribute("data-bs-theme", targetTheme);
    document.documentElement.setAttribute("data-theme", targetTheme);

    const toggleBtn = document.getElementById("themeToggleBtn");
    if (toggleBtn) {
      const icon = toggleBtn.querySelector("i");
      const text = toggleBtn.querySelector(".theme-text");
      if (icon) {
        icon.className = targetTheme === "dark" ? "bi bi-sun-fill text-warning" : "bi bi-moon-stars-fill text-purple";
      }
      if (text) {
        text.textContent = targetTheme === "dark" ? "Light Mode" : "Dark Mode";
      }
    }
  },

  toggleTheme() {
    const current = this.getTheme();
    const next = current === "dark" ? "light" : "dark";
    return this.setTheme(next);
  },

  /**
   * History
   */
  getHistory() {
    const history = this.get(StorageKeys.HISTORY, []);
    return Array.isArray(history) ? history : [];
  },

  saveQuizAttempt(attempt) {
    const history = this.getHistory();
    // Add unique ID and timestamp if missing
    const record = {
      id: attempt.id || `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      subject: attempt.subject,
      topic: attempt.topic || "All Topics",
      difficulty: attempt.difficulty || "Mixed",
      questionsCount: attempt.questionsCount || attempt.questions?.length || 0,
      correct: attempt.correct || 0,
      wrong: attempt.wrong || 0,
      unanswered: attempt.unanswered || 0,
      percentage: Math.round(attempt.percentage || ((attempt.correct || 0) / (attempt.questionsCount || 1)) * 100),
      timeTaken: attempt.timeTaken || "00:00",
      timeTakenSeconds: attempt.timeTakenSeconds || 0,
      date: attempt.date || new Date().toISOString(),
      formattedDate: attempt.formattedDate || new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      questions: attempt.questions || [],
      userAnswers: attempt.userAnswers || {}
    };

    history.unshift(record);
    // Keep up to 200 attempts
    if (history.length > 200) history.pop();
    this.set(StorageKeys.HISTORY, history);

    // Also update streak
    this.updateStreak();

    // Trigger cloud synchronization if logged in
    if (typeof Auth !== "undefined" && Auth.isLoggedIn()) {
      Auth.syncToMongo({
        attempt: record,
        streak: this.getStreak(),
        mistakes: this.getMistakes(),
        bookmarks: this.getBookmarks()
      });
    }

    return record;
  },

  getQuizAttemptById(id) {
    const history = this.getHistory();
    return history.find(h => h.id === id) || null;
  },

  clearHistory() {
    if (typeof Auth !== "undefined" && Auth.isLoggedIn()) {
      Auth.deleteCloudHistory();
    }
    return this.set(StorageKeys.HISTORY, []);
  },

  /**
   * Merge cloud data downloaded from MongoDB Atlas
   */
  mergeCloudData(cloudData) {
    if (!cloudData || typeof cloudData !== "object") return;
    const { attempts, bookmarks, streak, mistakes } = cloudData;

    // 1. Attempts: Merge without duplicating by ID
    if (Array.isArray(attempts) && attempts.length > 0) {
      const localHistory = this.getHistory();
      const existingIds = new Set(localHistory.map(h => h.id));
      const newFromCloud = attempts.filter(a => !existingIds.has(a.id));
      const combined = [...localHistory, ...newFromCloud];
      combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      if (combined.length > 200) combined.length = 200;
      this.set(StorageKeys.HISTORY, combined);
    }

    // 2. Bookmarks: Union of cloud & local
    if (Array.isArray(bookmarks) && bookmarks.length > 0) {
      const localBookmarks = this.getBookmarks();
      const combinedBookmarks = Array.from(new Set([...localBookmarks, ...bookmarks]));
      this.set(StorageKeys.BOOKMARKS, combinedBookmarks);
    }

    // 3. Streak
    if (streak && typeof streak === "object" && typeof streak.currentStreak === "number") {
      const localStreak = this.getStreak();
      const best = Math.max(localStreak.bestStreak || 0, streak.bestStreak || 0);
      const current = Math.max(localStreak.currentStreak || 0, streak.currentStreak || 0);
      const lastDate = streak.lastQuizDate || localStreak.lastQuizDate;
      this.set(StorageKeys.STREAK, { currentStreak: current, bestStreak: best, lastQuizDate: lastDate });
    }

    // 4. Mistakes
    if (mistakes && typeof mistakes === "object") {
      const localMistakes = this.getMistakes();
      const combinedMistakes = { ...localMistakes, ...mistakes };
      this.set(StorageKeys.MISTAKES, combinedMistakes);
    }
  },

  /**
   * Bookmarks
   */
  getBookmarks() {
    const bookmarks = this.get(StorageKeys.BOOKMARKS, []);
    return Array.isArray(bookmarks) ? bookmarks : [];
  },

  isBookmarked(questionId) {
    const bookmarks = this.getBookmarks();
    return bookmarks.includes(questionId);
  },

  toggleBookmark(questionId) {
    const bookmarks = this.getBookmarks();
    const index = bookmarks.indexOf(questionId);
    let bookmarked = false;
    if (index > -1) {
      bookmarks.splice(index, 1);
      bookmarked = false;
    } else {
      bookmarks.push(questionId);
      bookmarked = true;
    }
    this.set(StorageKeys.BOOKMARKS, bookmarks);

    // Sync bookmarks with cloud
    if (typeof Auth !== "undefined" && Auth.isLoggedIn()) {
      Auth.syncToMongo({ bookmarks });
    }

    return bookmarked;
  },

  /**
   * Mistakes tracking
   */
  getMistakes() {
    const mistakes = this.get(StorageKeys.MISTAKES, {});
    return typeof mistakes === "object" && mistakes !== null ? mistakes : {};
  },

  recordMistake(questionId, subject, topic) {
    const mistakes = this.getMistakes();
    const existing = mistakes[questionId] || { count: 0, subject, topic };
    existing.count += 1;
    existing.lastFailed = Date.now();
    existing.subject = subject || existing.subject;
    existing.topic = topic || existing.topic;
    mistakes[questionId] = existing;
    this.set(StorageKeys.MISTAKES, mistakes);
  },

  clearMistake(questionId) {
    const mistakes = this.getMistakes();
    if (mistakes[questionId]) {
      delete mistakes[questionId];
      this.set(StorageKeys.MISTAKES, mistakes);
    }
  },

  /**
   * Streak management
   */
  getStreak() {
    const defaultStreak = {
      currentStreak: 0,
      bestStreak: 0,
      lastQuizDate: null
    };
    return this.get(StorageKeys.STREAK, defaultStreak);
  },

  updateStreak() {
    const streak = this.getStreak();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    if (!streak.lastQuizDate) {
      streak.currentStreak = 1;
      streak.bestStreak = 1;
      streak.lastQuizDate = today;
    } else if (streak.lastQuizDate === today) {
      // Already completed today, streak remains intact
    } else {
      const last = new Date(streak.lastQuizDate);
      const now = new Date(today);
      const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        streak.currentStreak += 1;
        if (streak.currentStreak > streak.bestStreak) {
          streak.bestStreak = streak.currentStreak;
        }
      } else if (diffDays > 1) {
        // Streak broken
        streak.currentStreak = 1;
      }
      streak.lastQuizDate = today;
    }

    this.set(StorageKeys.STREAK, streak);
    return streak;
  },

  /**
   * Active quiz session persistence (for recovery)
   */
  saveCurrentQuiz(session) {
    return this.set(StorageKeys.CURRENT_QUIZ, session);
  },

  getCurrentQuiz() {
    return this.get(StorageKeys.CURRENT_QUIZ, null);
  },

  clearCurrentQuiz() {
    localStorage.removeItem(StorageKeys.CURRENT_QUIZ);
  },

  /**
   * Last result (for result.html display)
   */
  saveLastResult(result) {
    return this.set(StorageKeys.LAST_RESULT, result);
  },

  getLastResult() {
    return this.get(StorageKeys.LAST_RESULT, null);
  },

  /**
   * Daily Challenge
   */
  getDailyState() {
    const today = new Date().toISOString().split("T")[0];
    const daily = this.get(StorageKeys.DAILY, { date: today, completed: false, score: 0, total: 10 });
    if (daily.date !== today) {
      return { date: today, completed: false, score: 0, total: 10 };
    }
    return daily;
  },

  saveDailyState(score, total = 10) {
    const today = new Date().toISOString().split("T")[0];
    const data = { date: today, completed: true, score, total, completedAt: new Date().toISOString() };
    this.set(StorageKeys.DAILY, data);
    return data;
  },

  /**
   * Global aggregated stats
   */
  getOverallStats() {
    const history = this.getHistory();
    const streak = this.getStreak();

    const quizzesTaken = history.length;
    let questionsSolved = 0;
    let totalCorrect = 0;
    let bestScore = 0;

    history.forEach(h => {
      questionsSolved += (h.questionsCount || 0);
      totalCorrect += (h.correct || 0);
      if (h.percentage > bestScore) {
        bestScore = h.percentage;
      }
    });

    const averageAccuracy = questionsSolved > 0 ? Math.round((totalCorrect / questionsSolved) * 100) : 0;

    return {
      quizzesTaken,
      questionsSolved,
      totalCorrect,
      averageAccuracy,
      bestScore,
      currentStreak: streak.currentStreak || 0,
      bestStreak: streak.bestStreak || 0
    };
  }
};

// Auto apply theme on script load
if (typeof document !== "undefined") {
  Storage.applyTheme();
}

if (typeof window !== "undefined") {
  window.Storage = Storage;
}
