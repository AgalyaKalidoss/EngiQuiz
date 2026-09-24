/**
 * EngiQuiz - Question Engine & Quiz Generator
 * Handles validation, filtering, randomization, option shuffling, and quiz creation.
 */

const QuestionEngine = {
  _validatedQuestions: null,

  /**
   * Validates a single question against strict integrity rules
   */
  validateQuestion(q) {
    if (!q || typeof q !== "object") {
      console.warn("[EngiQuiz Validator] Skipping non-object question:", q);
      return false;
    }
    if (!q.id || typeof q.id !== "string" || !q.id.trim()) {
      console.warn("[EngiQuiz Validator] Missing or invalid id:", q);
      return false;
    }
    if (!q.subject || typeof q.subject !== "string" || !q.subject.trim()) {
      console.warn(`[EngiQuiz Validator] Missing subject for question ${q.id}`);
      return false;
    }
    if (!q.topic || typeof q.topic !== "string") {
      console.warn(`[EngiQuiz Validator] Missing topic for question ${q.id}`);
      return false;
    }
    if (!["Easy", "Medium", "Hard"].includes(q.difficulty)) {
      console.warn(`[EngiQuiz Validator] Invalid difficulty "${q.difficulty}" for question ${q.id}`);
      return false;
    }
    if (!q.question || typeof q.question !== "string" || !q.question.trim()) {
      console.warn(`[EngiQuiz Validator] Empty question text for question ${q.id}`);
      return false;
    }
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      console.warn(`[EngiQuiz Validator] Question ${q.id} must have exactly 4 options. Found:`, q.options);
      return false;
    }
    if (typeof q.answer !== "number" || q.answer < 0 || q.answer > 3) {
      console.warn(`[EngiQuiz Validator] Invalid answer index "${q.answer}" for question ${q.id}`);
      return false;
    }
    if (!q.explanation || typeof q.explanation !== "string" || !q.explanation.trim()) {
      console.warn(`[EngiQuiz Validator] Missing explanation for question ${q.id}`);
      return false;
    }
    return true;
  },

  /**
   * Retrieves and caches all validated questions
   */
  getAllQuestions() {
    if (this._validatedQuestions) {
      return this._validatedQuestions;
    }
    const raw = (typeof RAW_QUESTIONS !== "undefined" && Array.isArray(RAW_QUESTIONS)) ? RAW_QUESTIONS : [];
    const valid = [];
    const idSet = new Set();

    for (const q of raw) {
      if (this.validateQuestion(q)) {
        if (idSet.has(q.id)) {
          console.warn(`[EngiQuiz Validator] Duplicate question id "${q.id}" detected. Skipping duplicate.`);
          continue;
        }
        idSet.add(q.id);
        valid.push(q);
      }
    }
    this._validatedQuestions = valid;
    return this._validatedQuestions;
  },

  /**
   * Get single question by ID
   */
  getQuestionById(id) {
    return this.getAllQuestions().find(q => q.id === id) || null;
  },

  /**
   * Retrieve list of distinct subjects
   */
  getSubjects() {
    const list = [];
    const seen = new Set();
    this.getAllQuestions().forEach(q => {
      if (!seen.has(q.subject)) {
        seen.add(q.subject);
        list.push(q.subject);
      }
    });
    return list;
  },

  /**
   * Retrieve topics for a subject
   */
  getTopicsBySubject(subjectName) {
    const topics = new Set();
    this.getAllQuestions().forEach(q => {
      if (q.subject.toLowerCase() === subjectName.toLowerCase()) {
        topics.add(q.topic);
      }
    });
    return Array.from(topics);
  },

  /**
   * Get subject statistics
   */
  getSubjectStats(subjectName) {
    const questions = this.getAllQuestions().filter(
      q => q.subject.toLowerCase() === subjectName.toLowerCase()
    );

    const easy = questions.filter(q => q.difficulty === "Easy").length;
    const medium = questions.filter(q => q.difficulty === "Medium").length;
    const hard = questions.filter(q => q.difficulty === "Hard").length;

    // Calculate user accuracy in this subject from history
    let accuracy = null;
    if (typeof Storage !== "undefined") {
      const history = Storage.getHistory().filter(
        h => h.subject.toLowerCase() === subjectName.toLowerCase()
      );
      if (history.length > 0) {
        let totalQ = 0;
        let correctQ = 0;
        history.forEach(h => {
          totalQ += (h.questionsCount || 0);
          correctQ += (h.correct || 0);
        });
        if (totalQ > 0) {
          accuracy = Math.round((correctQ / totalQ) * 100);
        }
      }
    }

    return {
      total: questions.length,
      easy,
      medium,
      hard,
      topicsCount: this.getTopicsBySubject(subjectName).length,
      accuracy
    };
  },

  /**
   * Deep clone helper
   */
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Fisher-Yates shuffle that returns a new array
   */
  shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  },

  /**
   * Deep clones a question and shuffles its 4 options,
   * accurately re-mapping the correct answer index to the new position.
   */
  cloneAndShuffleOptions(originalQuestion) {
    const cloned = this.deepClone(originalQuestion);
    const originalAnswerText = originalQuestion.options[originalQuestion.answer];

    // Create array of indexed options to shuffle
    const paired = originalQuestion.options.map((opt, idx) => ({
      text: opt,
      isCorrect: idx === originalQuestion.answer
    }));

    // Shuffle options
    const shuffledPairs = this.shuffleArray(paired);

    cloned.options = shuffledPairs.map(p => p.text);
    cloned.answer = shuffledPairs.findIndex(p => p.isCorrect);

    // Double check integrity assertion
    if (cloned.options[cloned.answer] !== originalAnswerText) {
      console.error("[EngiQuiz] Critical error in option shuffling: Answer mapping mismatch!");
      // Fallback to original
      cloned.options = [...originalQuestion.options];
      cloned.answer = originalQuestion.answer;
    }

    return cloned;
  },

  /**
   * Filter questions by criteria
   */
  filterQuestions({ subject, topic, difficulties = [] }) {
    let pool = this.getAllQuestions();

    if (subject && subject !== "All" && subject !== "all") {
      pool = pool.filter(q => q.subject.toLowerCase() === subject.toLowerCase());
    }

    if (topic && topic !== "All" && topic !== "all" && topic !== "All Topics") {
      pool = pool.filter(q => q.topic.toLowerCase() === topic.toLowerCase());
    }

    if (Array.isArray(difficulties) && difficulties.length > 0) {
      const diffLower = difficulties.map(d => d.toLowerCase());
      pool = pool.filter(q => diffLower.includes(q.difficulty.toLowerCase()));
    }

    return pool;
  },

  /**
   * Generate an unlimited, fresh, randomized quiz
   */
  generateQuiz({
    subject,
    topic = "All Topics",
    difficulties = ["Easy", "Medium", "Hard"],
    count = 10,
    avoidRecent = true
  }) {
    // 1. Filter by criteria
    let available = this.filterQuestions({ subject, topic, difficulties });

    if (available.length === 0) {
      return {
        success: false,
        error: `No questions found matching the selected subject "${subject}", topic "${topic}", and difficulties [${difficulties.join(", ")}].`,
        questions: [],
        availableCount: 0
      };
    }

    // 2. Anti-duplicate logic across quizzes
    let candidates = [...available];
    if (avoidRecent && typeof Storage !== "undefined") {
      const history = Storage.getHistory();
      // Collect IDs of questions used in last 3 attempts of same subject
      const recentIds = new Set();
      const recentAttempts = history.filter(h => h.subject.toLowerCase() === (subject || "").toLowerCase()).slice(0, 3);
      recentAttempts.forEach(h => {
        if (Array.isArray(h.questions)) {
          h.questions.forEach(q => recentIds.add(q.id));
        }
      });

      const unseen = candidates.filter(q => !recentIds.has(q.id));
      // If we have enough unseen questions, use them; otherwise blend unseen with seen
      if (unseen.length >= count) {
        candidates = unseen;
      } else if (unseen.length > 0) {
        // Prefer unseen first, then older questions
        const seen = candidates.filter(q => recentIds.has(q.id));
        candidates = [...this.shuffleArray(unseen), ...this.shuffleArray(seen)];
      }
    }

    // 3. Shuffle candidate questions
    candidates = this.shuffleArray(candidates);

    // 4. Select requested count with Set to ensure zero duplicates within same quiz
    const actualCount = Math.min(count, available.length);
    const selected = [];
    const selectedIds = new Set();

    for (const q of candidates) {
      if (!selectedIds.has(q.id)) {
        selectedIds.add(q.id);
        selected.push(q);
        if (selected.length === actualCount) break;
      }
    }

    // If still need more and candidates had duplicates for some reason, fill from available
    if (selected.length < actualCount) {
      for (const q of this.shuffleArray(available)) {
        if (!selectedIds.has(q.id)) {
          selectedIds.add(q.id);
          selected.push(q);
          if (selected.length === actualCount) break;
        }
      }
    }

    // 5. Clone and randomize options for each selected question
    const finalizedQuestions = selected.map(q => this.cloneAndShuffleOptions(q));

    const notice = available.length < count
      ? `Only ${available.length} questions available for this selection. Generating a quiz with all ${available.length} questions.`
      : null;

    return {
      success: true,
      notice,
      subject: subject || "Mixed",
      topic: topic || "All Topics",
      difficulties,
      totalAvailable: available.length,
      requestedCount: count,
      questions: finalizedQuestions
    };
  },

  /**
   * Generate a quiz from user's mistakes history
   */
  generateMistakeQuiz(count = 10) {
    if (typeof Storage === "undefined") {
      return { success: false, error: "Storage unavailable" };
    }
    const mistakes = Storage.getMistakes();
    const mistakeIds = Object.keys(mistakes);

    if (mistakeIds.length === 0) {
      return {
        success: false,
        error: "Great! You haven't recorded any mistakes yet. Practice some quizzes to build your review list."
      };
    }

    // Prioritize questions missed multiple times
    mistakeIds.sort((a, b) => (mistakes[b].count || 0) - (mistakes[a].count || 0));

    const matched = [];
    const seen = new Set();

    for (const id of mistakeIds) {
      const q = this.getQuestionById(id);
      if (q && !seen.has(q.id)) {
        seen.add(q.id);
        matched.push(q);
        if (matched.length >= count) break;
      }
    }

    if (matched.length === 0) {
      return {
        success: false,
        error: "None of your recorded mistake questions exist in the current bank."
      };
    }

    const finalized = this.shuffleArray(matched).map(q => this.cloneAndShuffleOptions(q));

    return {
      success: true,
      subject: "Mistake Review",
      topic: "Targeted Practice",
      difficulties: ["Mixed"],
      questions: finalized
    };
  },

  /**
   * Generate a quiz from bookmarked questions
   */
  generateBookmarkQuiz(count = 20) {
    if (typeof Storage === "undefined") {
      return { success: false, error: "Storage unavailable" };
    }
    const bookmarkIds = Storage.getBookmarks();

    if (bookmarkIds.length === 0) {
      return {
        success: false,
        error: "No saved questions yet. Explore questions and click the star icon to bookmark them for later practice."
      };
    }

    const matched = [];
    const seen = new Set();

    for (const id of bookmarkIds) {
      const q = this.getQuestionById(id);
      if (q && !seen.has(q.id)) {
        seen.add(q.id);
        matched.push(q);
        if (matched.length >= count) break;
      }
    }

    if (matched.length === 0) {
      return {
        success: false,
        error: "None of your bookmarked questions exist in the current bank."
      };
    }

    const finalized = this.shuffleArray(matched).map(q => this.cloneAndShuffleOptions(q));

    return {
      success: true,
      subject: "Bookmarked Questions",
      topic: "Personal Review",
      difficulties: ["Mixed"],
      questions: finalized
    };
  },

  /**
   * Generate a deterministic Daily Challenge quiz based on today's date
   */
  generateDailyQuiz(dateString = null) {
    const date = dateString || new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const all = this.getAllQuestions();

    if (all.length === 0) {
      return { success: false, error: "No questions available." };
    }

    // Simple deterministic pseudo-random number generator based on date hash
    let hash = 0;
    for (let i = 0; i < date.length; i++) {
      hash = ((hash << 5) - hash) + date.charCodeAt(i);
      hash |= 0;
    }
    hash = Math.abs(hash);

    // Pick 10 questions across diverse subjects deterministically
    const selected = [];
    const usedIds = new Set();
    const subjects = this.getSubjects();

    // Pick 1 from each subject if possible
    for (let i = 0; i < 10; i++) {
      const targetSubj = subjects[(hash + i) % subjects.length];
      const subjQuestions = all.filter(q => q.subject === targetSubj && !usedIds.has(q.id));

      if (subjQuestions.length > 0) {
        const picked = subjQuestions[(hash + (i * 7)) % subjQuestions.length];
        usedIds.add(picked.id);
        selected.push(picked);
      } else {
        // Fallback to any unused question
        const remaining = all.filter(q => !usedIds.has(q.id));
        if (remaining.length > 0) {
          const picked = remaining[(hash + (i * 13)) % remaining.length];
          usedIds.add(picked.id);
          selected.push(picked);
        }
      }
    }

    const finalized = selected.map(q => this.cloneAndShuffleOptions(q));

    return {
      success: true,
      subject: "Daily Challenge",
      topic: date,
      difficulties: ["Mixed"],
      questions: finalized,
      isDaily: true,
      date
    };
  }
};

if (typeof window !== "undefined") {
  window.QuestionEngine = QuestionEngine;
}
