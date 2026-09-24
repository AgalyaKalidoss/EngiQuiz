/**
 * EngiQuiz - LocalStorage Management Module
 * Safe, robust, error-tolerant persistence layer with strict per-user isolation.
 */

const StorageKeys = {
  SETTINGS: "engiquiz_settings",
  CURRENT_QUIZ: "engiquiz_current_quiz",
  LAST_RESULT: "engiquiz_last_result"
};

// Purge legacy unisolated keys to eliminate cross-contamination from prior sessions
(function purgeLegacyContaminatedKeys() {
  try {
    localStorage.removeItem("engiquiz_history");
    localStorage.removeItem("engiquiz_bookmarks");
    localStorage.removeItem("engiquiz_mistakes");
    localStorage.removeItem("engiquiz_streak");
    localStorage.removeItem("engiquiz_daily");
  } catch (e) {
    // Ignore storage errors in restricted contexts
  }
})();

const Storage = {
  /**
   * Returns a namespace prefix based on the currently authenticated user.
   * Isolates records between User A, User B, and guest visitors.
   */
  getActiveUserPrefix() {
    try {
      if (typeof Auth !== "undefined" && typeof Auth.getUser === "function") {
        const user = Auth.getUser();
        if (user && user.id) {
          return `engiquiz_usr_${user.id}_`;
        }
      }
    } catch {
      // Fallback to guest if Auth is unavailable
    }
    return "engiquiz_guest_";
  },

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
   * Settings & Theme (Device-level preference)
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
   * History (Isolated by authenticated user)
   */
  getHistory() {
    const key = `${this.getActiveUserPrefix()}history`;
    const history = this.get(key, []);
    return Array.isArray(history) ? history : [];
  },

  setHistory(historyList) {
    const key = `${this.getActiveUserPrefix()}history`;
    this.set(key, Array.isArray(historyList) ? historyList : []);
  },

  saveQuizAttempt(attempt) {
    const key = `${this.getActiveUserPrefix()}history`;
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
    this.set(key, history);

    // Also update streak for this isolated user
    this.updateStreak();

    return record;
  },

  getQuizAttemptById(id) {
    const history = this.getHistory();
    return history.find(h => h.id === id) || null;
  },

  clearHistory() {
    const key = `${this.getActiveUserPrefix()}history`;
    return this.set(key, []);
  },

  /**
   * Bookmarks (Isolated by authenticated user)
   */
  getBookmarks() {
    const key = `${this.getActiveUserPrefix()}bookmarks`;
    const bookmarks = this.get(key, []);
    return Array.isArray(bookmarks) ? bookmarks : [];
  },

  setBookmarks(bookmarksList) {
    const key = `${this.getActiveUserPrefix()}bookmarks`;
    this.set(key, Array.isArray(bookmarksList) ? bookmarksList : []);
  },

  isBookmarked(questionId) {
    const bookmarks = this.getBookmarks();
    return bookmarks.includes(questionId);
  },

  toggleBookmark(questionId) {
    const key = `${this.getActiveUserPrefix()}bookmarks`;
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
    this.set(key, bookmarks);

    // If authenticated, sync with server
    if (typeof Auth !== "undefined" && typeof Auth.isLoggedIn === "function" && Auth.isLoggedIn()) {
      Auth.syncToMongo(null, bookmarks).catch(() => {});
    }

    return bookmarked;
  },

  /**
   * Mistakes tracking (Isolated by authenticated user)
   */
  getMistakes() {
    const key = `${this.getActiveUserPrefix()}mistakes`;
    const mistakes = this.get(key, {});
    return typeof mistakes === "object" && mistakes !== null ? mistakes : {};
  },

  recordMistake(questionId, subject, topic) {
    const key = `${this.getActiveUserPrefix()}mistakes`;
    const mistakes = this.getMistakes();
    const existing = mistakes[questionId] || { count: 0, subject, topic };
    existing.count += 1;
    existing.lastFailed = Date.now();
    existing.subject = subject || existing.subject;
    existing.topic = topic || existing.topic;
    mistakes[questionId] = existing;
    this.set(key, mistakes);
  },

  clearMistake(questionId) {
    const key = `${this.getActiveUserPrefix()}mistakes`;
    const mistakes = this.getMistakes();
    if (mistakes[questionId]) {
      delete mistakes[questionId];
      this.set(key, mistakes);
    }
  },

  /**
   * Streak management (Isolated by authenticated user)
   */
  getStreak() {
    const key = `${this.getActiveUserPrefix()}streak`;
    const defaultStreak = {
      currentStreak: 0,
      bestStreak: 0,
      lastQuizDate: null
    };
    return this.get(key, defaultStreak);
  },

  updateStreak() {
    const key = `${this.getActiveUserPrefix()}streak`;
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

    this.set(key, streak);
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
    try {
      localStorage.removeItem(StorageKeys.CURRENT_QUIZ);
    } catch {}
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
   * Daily Challenge (Isolated by authenticated user)
   */
  getDailyState() {
    const key = `${this.getActiveUserPrefix()}daily`;
    const today = new Date().toISOString().split("T")[0];
    const daily = this.get(key, { date: today, completed: false, score: 0, total: 10 });
    if (daily.date !== today) {
      return { date: today, completed: false, score: 0, total: 10 };
    }
    return daily;
  },

  saveDailyState(score, total = 10) {
    const key = `${this.getActiveUserPrefix()}daily`;
    const today = new Date().toISOString().split("T")[0];
    const data = { date: today, completed: true, score, total, completedAt: new Date().toISOString() };
    this.set(key, data);
    return data;
  },

  /**
   * Clear user cached data
   */
  clearUserData(userId) {
    if (!userId) return;
    const prefix = `engiquiz_usr_${userId}_`;
    try {
      localStorage.removeItem(`${prefix}history`);
      localStorage.removeItem(`${prefix}bookmarks`);
      localStorage.removeItem(`${prefix}mistakes`);
      localStorage.removeItem(`${prefix}streak`);
      localStorage.removeItem(`${prefix}daily`);
    } catch {}
  },

  clearGuestData() {
    try {
      localStorage.removeItem("engiquiz_guest_history");
      localStorage.removeItem("engiquiz_guest_bookmarks");
      localStorage.removeItem("engiquiz_guest_mistakes");
      localStorage.removeItem("engiquiz_guest_streak");
      localStorage.removeItem("engiquiz_guest_daily");
    } catch {}
  },

  /**
   * Global aggregated stats for the current isolated user
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
