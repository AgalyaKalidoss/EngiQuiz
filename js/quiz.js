/**
 * EngiQuiz - Active Quiz Controller
 * Handles timer, navigation, state preservation, auto-submit, and scoring.
 */

let quizState = {
  questions: [],
  currentIndex: 0,
  answers: {}, // questionIndex -> selectedOptionIndex
  totalTimeSeconds: 600,
  timeRemaining: 600,
  timerInterval: null,
  subject: "Quiz",
  topic: "All Topics",
  difficulty: "Mixed",
  isDaily: false,
  startTime: null
};

document.addEventListener("DOMContentLoaded", () => {
  initializeQuiz();
});

function initializeQuiz() {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");
  const subjectParam = urlParams.get("subject");
  const topicParam = urlParams.get("topic");
  const diffParam = urlParams.get("difficulty");
  const rawCount = parseInt(urlParams.get("count"), 10) || 10;
  const countParam = Math.min(50, Math.max(1, rawCount)); // Clamp to max 50
  const shouldShuffle = urlParams.get("shuffle") !== "false";

  let generated = null;

  // Check if we should restore an existing active quiz or start new
  const savedQuiz = typeof Storage !== "undefined" ? Storage.getCurrentQuiz() : null;
  const isFresh = urlParams.get("fresh") === "true";

  if (savedQuiz && !isFresh && (!mode && !subjectParam)) {
    // Restore saved quiz
    quizState = savedQuiz;
    renderCurrentQuestion();
    startTimer();
    return;
  }

  // Generate new quiz based on mode or params
  if (mode === "mistakes") {
    generated = QuestionEngine.generateMistakeQuiz(countParam);
  } else if (mode === "bookmarks") {
    generated = QuestionEngine.generateBookmarkQuiz(countParam);
  } else if (mode === "daily") {
    generated = QuestionEngine.generateDailyQuiz();
  } else if (subjectParam) {
    const difficulties = diffParam ? diffParam.split(",") : ["Easy", "Medium", "Hard"];
    generated = QuestionEngine.generateQuiz({
      subject: subjectParam,
      topic: topicParam || "All Topics",
      difficulties,
      count: countParam,
      avoidRecent: true
    });
  } else {
    // Default fallback: Quick Practice (10 questions across Java or first subject)
    generated = QuestionEngine.generateQuiz({
      subject: "Java",
      topic: "All Topics",
      difficulties: ["Easy", "Medium", "Hard"],
      count: 10
    });
  }

  if (!generated || !generated.success || !generated.questions || generated.questions.length === 0) {
    const msg = generated ? generated.error : "Could not initialize quiz.";
    alert(msg);
    window.location.href = "practice.html";
    return;
  }

  // Initialize new state
  const totalSeconds = generated.questions.length * 60; // 1 min per question
  quizState = {
    questions: generated.questions,
    currentIndex: 0,
    answers: {},
    totalTimeSeconds: totalSeconds,
    timeRemaining: totalSeconds,
    timerInterval: null,
    subject: generated.subject,
    topic: generated.topic,
    difficulty: Array.isArray(generated.difficulties) ? generated.difficulties.join(", ") : (generated.difficulty || "Mixed"),
    isDaily: generated.isDaily || false,
    startTime: Date.now()
  };

  // Save session state
  if (typeof Storage !== "undefined") {
    Storage.saveCurrentQuiz(quizState);
  }

  // Setup UI elements and events
  setupQuizEventListeners();
  renderCurrentQuestion();
  renderNavigationMatrix();
  startTimer();
}

function setupQuizEventListeners() {
  document.getElementById("btnPrevQ")?.addEventListener("click", () => {
    if (quizState.currentIndex > 0) {
      quizState.currentIndex--;
      renderCurrentQuestion();
    }
  });

  document.getElementById("btnNextQ")?.addEventListener("click", () => {
    if (quizState.currentIndex < quizState.questions.length - 1) {
      quizState.currentIndex++;
      renderCurrentQuestion();
    }
  });

  document.getElementById("btnSubmitQuiz")?.addEventListener("click", () => {
    promptSubmitConfirmation();
  });

  document.getElementById("btnBookmarkCurrent")?.addEventListener("click", () => {
    const currentQ = quizState.questions[quizState.currentIndex];
    if (currentQ && typeof Storage !== "undefined") {
      const isNowBookmarked = Storage.toggleBookmark(currentQ.id);
      updateBookmarkButton(isNowBookmarked);
    }
  });

  document.getElementById("btnShuffleQuizOrder")?.addEventListener("click", () => {
    shuffleActiveQuiz();
  });

  document.getElementById("modalConfirmSubmitBtn")?.addEventListener("click", () => {
    const modalEl = document.getElementById("submitConfirmModal");
    if (modalEl && typeof bootstrap !== "undefined") {
      const modal = bootstrap.Modal.getInstance(modalEl);
      if (modal) modal.hide();
    }
    submitQuiz(false);
  });
}

function shuffleActiveQuiz() {
  if (!quizState.questions || quizState.questions.length <= 1) return;

  // Preserve answers mapped by question ID
  const answeredById = {};
  quizState.questions.forEach((q, idx) => {
    if (quizState.answers[idx] !== undefined) {
      answeredById[q.id] = quizState.answers[idx];
    }
  });

  // Fisher-Yates shuffle the questions
  const shuffled = [...quizState.questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  quizState.questions = shuffled;

  // Remap answers to new indices
  const newAnswers = {};
  quizState.questions.forEach((q, newIdx) => {
    if (answeredById[q.id] !== undefined) {
      newAnswers[newIdx] = answeredById[q.id];
    }
  });
  quizState.answers = newAnswers;

  // Render question and matrix
  renderCurrentQuestion();
  renderNavigationMatrix();

  if (typeof Storage !== "undefined") {
    Storage.saveCurrentQuiz(quizState);
  }

  if (typeof showNotification === "function") {
    showNotification("Questions shuffled in fresh order!", "info");
  }
}

function startTimer() {
  if (quizState.timerInterval) {
    clearInterval(quizState.timerInterval);
  }

  updateTimerDisplay();

  quizState.timerInterval = setInterval(() => {
    quizState.timeRemaining--;

    // Periodically sync to storage
    if (quizState.timeRemaining % 5 === 0 && typeof Storage !== "undefined") {
      Storage.saveCurrentQuiz(quizState);
    }

    updateTimerDisplay();

    if (quizState.timeRemaining <= 0) {
      clearInterval(quizState.timerInterval);
      handleTimeExpired();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerBox = document.getElementById("quizTimerDisplay");
  if (!timerBox) return;

  const seconds = Math.max(0, quizState.timeRemaining);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const formatted = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  timerBox.innerHTML = `<i class="bi bi-clock-history"></i> ${formatted}`;

  // Styling based on time remaining
  timerBox.classList.remove("timer-warning", "timer-danger");
  if (seconds <= 30) {
    timerBox.classList.add("timer-danger");
  } else if (seconds <= 60) {
    timerBox.classList.add("timer-warning");
  }
}

function handleTimeExpired() {
  const toastContainer = document.getElementById("timeUpAlert");
  if (toastContainer) {
    toastContainer.classList.remove("d-none");
  }
  // Auto submit with answers preserved
  setTimeout(() => {
    submitQuiz(true);
  }, 1000);
}

function renderCurrentQuestion() {
  const currentQ = quizState.questions[quizState.currentIndex];
  if (!currentQ) return;

  // Header and Meta
  const headerMeta = document.getElementById("quizHeaderSubject");
  if (headerMeta) {
    headerMeta.textContent = `${quizState.subject} · ${currentQ.topic || quizState.topic}`;
  }

  const counterEl = document.getElementById("quizQuestionCounter");
  if (counterEl) {
    counterEl.textContent = `Question ${quizState.currentIndex + 1} of ${quizState.questions.length}`;
  }

  // Progress Bar
  const progressFill = document.getElementById("quizProgressFill");
  if (progressFill) {
    const pct = ((quizState.currentIndex + 1) / quizState.questions.length) * 100;
    progressFill.style.width = `${pct}%`;
  }

  // Difficulty badge
  const diffBadge = document.getElementById("quizDiffBadge");
  if (diffBadge) {
    diffBadge.textContent = currentQ.difficulty;
    diffBadge.className = `badge ${
      currentQ.difficulty === "Easy" ? "badge-diff-easy" : currentQ.difficulty === "Medium" ? "badge-diff-medium" : "badge-diff-hard"
    }`;
  }

  // Bookmark status
  const isBookmarked = typeof Storage !== "undefined" ? Storage.isBookmarked(currentQ.id) : false;
  updateBookmarkButton(isBookmarked);

  // Question Prompt
  const promptEl = document.getElementById("quizQuestionPrompt");
  if (promptEl) {
    promptEl.textContent = currentQ.question;
  }

  // Options Grid
  const optionsGrid = document.getElementById("quizOptionsContainer");
  if (optionsGrid) {
    optionsGrid.innerHTML = "";
    const letters = ["A", "B", "C", "D"];
    const selectedAns = quizState.answers[quizState.currentIndex];

    currentQ.options.forEach((optText, optIdx) => {
      const isSelected = selectedAns === optIdx;
      const optItem = document.createElement("div");
      optItem.className = `option-item ${isSelected ? "selected" : ""}`;
      optItem.setAttribute("role", "button");
      optItem.setAttribute("tabindex", "0");
      optItem.innerHTML = `
        <div class="option-letter">${letters[optIdx]}</div>
        <div class="option-text">${escapeHtml(optText)}</div>
      `;

      optItem.addEventListener("click", () => {
        selectOption(optIdx);
      });

      // Keyboard accessibility (Space or Enter to select)
      optItem.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectOption(optIdx);
        }
      });

      optionsGrid.appendChild(optItem);
    });
  }

  // Button States
  const btnPrev = document.getElementById("btnPrevQ");
  if (btnPrev) {
    btnPrev.disabled = quizState.currentIndex === 0;
  }

  const btnNext = document.getElementById("btnNextQ");
  if (btnNext) {
    if (quizState.currentIndex === quizState.questions.length - 1) {
      btnNext.innerHTML = `Review Submit <i class="bi bi-arrow-right"></i>`;
    } else {
      btnNext.innerHTML = `Next <i class="bi bi-arrow-right"></i>`;
    }
  }

  // Update navigation matrix
  renderNavigationMatrix();

  // Save session state
  if (typeof Storage !== "undefined") {
    Storage.saveCurrentQuiz(quizState);
  }
}

function selectOption(optIndex) {
  quizState.answers[quizState.currentIndex] = optIndex;
  renderCurrentQuestion();
  renderNavigationMatrix();
}

function updateBookmarkButton(isBookmarked) {
  const btn = document.getElementById("btnBookmarkCurrent");
  if (!btn) return;

  if (isBookmarked) {
    btn.innerHTML = `<i class="bi bi-star-fill text-warning"></i>`;
    btn.classList.add("bookmarked");
    btn.title = "Bookmarked (Click to remove)";
  } else {
    btn.innerHTML = `<i class="bi bi-star"></i>`;
    btn.classList.remove("bookmarked");
    btn.title = "Bookmark question";
  }
}

function renderNavigationMatrix() {
  const container = document.getElementById("quizNavMatrix");
  if (!container) return;

  container.innerHTML = "";

  quizState.questions.forEach((_, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "matrix-btn";
    btn.textContent = idx + 1;

    const isCurrent = idx === quizState.currentIndex;
    const isAnswered = quizState.answers[idx] !== undefined;

    if (isCurrent) btn.classList.add("current");
    if (isAnswered) btn.classList.add("answered");

    btn.addEventListener("click", () => {
      quizState.currentIndex = idx;
      renderCurrentQuestion();
    });

    container.appendChild(btn);
  });
}

function promptSubmitConfirmation() {
  const answeredCount = Object.keys(quizState.answers).length;
  const total = quizState.questions.length;
  const unanswered = total - answeredCount;

  const modalEl = document.getElementById("submitConfirmModal");
  const modalText = document.getElementById("submitModalSummaryText");

  if (modalText) {
    if (unanswered > 0) {
      modalText.innerHTML = `You have answered <strong>${answeredCount}</strong> of <strong>${total}</strong> questions. <br><span class="text-danger fw-bold">${unanswered} question(s) remain unanswered.</span>`;
    } else {
      modalText.innerHTML = `Great! You have answered all <strong>${total}</strong> questions.`;
    }
  }

  if (modalEl && typeof bootstrap !== "undefined") {
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  } else {
    // Native fallback if bootstrap modal not available
    const confirmMsg = unanswered > 0
      ? `You have ${unanswered} unanswered question(s). Submit quiz now?`
      : "Submit quiz now?";
    if (confirm(confirmMsg)) {
      submitQuiz(false);
    }
  }
}

function submitQuiz(autoSubmitted = false) {
  if (quizState.timerInterval) {
    clearInterval(quizState.timerInterval);
  }

  // Calculate results
  let correct = 0;
  let wrong = 0;
  let unanswered = 0;

  const total = quizState.questions.length;
  const timeTakenSeconds = quizState.totalTimeSeconds - Math.max(0, quizState.timeRemaining);
  const timeTakenM = Math.floor(timeTakenSeconds / 60);
  const timeTakenS = timeTakenSeconds % 60;
  const timeTakenFormatted = `${String(timeTakenM).padStart(2, "0")}:${String(timeTakenS).padStart(2, "0")}`;

  quizState.questions.forEach((q, idx) => {
    const userAns = quizState.answers[idx];
    if (userAns === undefined) {
      unanswered++;
    } else if (userAns === q.answer) {
      correct++;
      // If was previously in mistakes, clear it
      if (typeof Storage !== "undefined") {
        Storage.clearMistake(q.id);
      }
    } else {
      wrong++;
      // Record mistake
      if (typeof Storage !== "undefined") {
        Storage.recordMistake(q.id, q.subject, q.topic);
      }
    }
  });

  const percentage = Math.round((correct / total) * 100);

  const attemptRecord = {
    id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    subject: quizState.subject,
    topic: quizState.topic,
    difficulty: quizState.difficulty,
    questionsCount: total,
    correct,
    wrong,
    unanswered,
    percentage,
    timeTaken: timeTakenFormatted,
    timeTakenSeconds,
    date: new Date().toISOString(),
    isDaily: quizState.isDaily,
    questions: quizState.questions,
    userAnswers: quizState.answers
  };

  if (typeof Storage !== "undefined") {
    // Save to history
    Storage.saveQuizAttempt(attemptRecord);
    // Save to last result
    Storage.saveLastResult(attemptRecord);
    // If daily, record daily completion
    if (quizState.isDaily) {
      Storage.saveDailyState(correct, total);
    }
    // Clear in-progress session
    Storage.clearCurrentQuiz();

    // Sync to MongoDB Atlas if user is authenticated
    if (typeof Auth !== "undefined" && Auth.isLoggedIn()) {
      Auth.syncToMongo(attemptRecord, Storage.getBookmarks());
    }
  }

  // Redirect to results page
  window.location.href = `result.html?id=${attemptRecord.id}`;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
