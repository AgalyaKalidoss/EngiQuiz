/**
 * EngiQuiz - Result & Question Review Controller
 * Displays comprehensive score metrics, confetti celebration, and in-depth question explanations.
 */

document.addEventListener("DOMContentLoaded", async () => {
  await renderQuizResult();
});

async function renderQuizResult() {
  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get("id");

  let record = null;
  if (typeof Storage !== "undefined") {
    if (quizId) {
      record = Storage.getQuizAttemptById(quizId);
    }
    if (!record) {
      record = Storage.getLastResult();
    }
  }

  // Fallback to MongoDB Atlas cloud fetch if not found in local storage
  if (!record && quizId && typeof Auth !== "undefined") {
    try {
      record = await Auth.fetchCloudAttempt(quizId);
    } catch (e) {
      console.warn("Could not fetch cloud attempt:", e);
    }
  }

  if (!record || !Array.isArray(record.questions) || record.questions.length === 0) {
    document.getElementById("resultLoadingContainer")?.classList.add("d-none");
    document.getElementById("resultEmptyContainer")?.classList.remove("d-none");
    return;
  }

  // Populate Header & Title
  const titleEl = document.getElementById("resultSubjectTitle");
  if (titleEl) {
    titleEl.textContent = `${record.subject} – ${record.topic || "All Topics"}`;
  }

  // Populate Score
  const scoreNum = document.getElementById("resultScoreNumber");
  if (scoreNum) {
    scoreNum.textContent = `${record.correct} / ${record.questionsCount}`;
  }

  const scorePct = document.getElementById("resultScorePercentage");
  if (scorePct) {
    scorePct.textContent = `${record.percentage}% Accuracy`;
  }

  // Stats
  document.getElementById("statCorrectCount").textContent = record.correct;
  document.getElementById("statWrongCount").textContent = record.wrong;
  document.getElementById("statUnansweredCount").textContent = record.unanswered;
  document.getElementById("statTimeTaken").textContent = record.timeTaken || "00:00";

  // Trigger celebration if high score
  if (record.percentage >= 80 && typeof confetti === "function") {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  // Action Buttons
  setupResultActionButtons(record);

  // Render Detailed Question Review
  renderQuestionReviewList(record);

  // Show content container
  document.getElementById("resultLoadingContainer")?.classList.add("d-none");
  document.getElementById("resultContentContainer")?.classList.remove("d-none");
}

function setupResultActionButtons(record) {
  // Retake button
  const retakeBtn = document.getElementById("btnRetakeQuiz");
  if (retakeBtn) {
    retakeBtn.addEventListener("click", () => {
      // Start fresh quiz with same subject and topic
      const count = record.questionsCount || 10;
      window.location.href = `quiz.html?subject=${encodeURIComponent(record.subject)}&topic=${encodeURIComponent(record.topic || "All Topics")}&count=${count}&fresh=true`;
    });
  }

  // Practice Mistakes button
  const mistakesBtn = document.getElementById("btnPracticeMistakes");
  if (mistakesBtn) {
    const mistakes = typeof Storage !== "undefined" ? Storage.getMistakes() : {};
    if (Object.keys(mistakes).length > 0) {
      mistakesBtn.classList.remove("d-none");
      mistakesBtn.addEventListener("click", () => {
        window.location.href = "quiz.html?mode=mistakes&fresh=true";
      });
    } else {
      mistakesBtn.classList.add("d-none");
    }
  }
}

function renderQuestionReviewList(record) {
  const container = document.getElementById("reviewQuestionsList");
  if (!container) return;

  container.innerHTML = "";
  const letters = ["A", "B", "C", "D"];

  record.questions.forEach((q, idx) => {
    const userAnsIdx = record.userAnswers ? record.userAnswers[idx] : undefined;
    const isAnswered = userAnsIdx !== undefined;
    const isCorrect = isAnswered && userAnsIdx === q.answer;
    const isBookmarked = typeof Storage !== "undefined" ? Storage.isBookmarked(q.id) : false;

    const card = document.createElement("div");
    card.className = `review-card ${isCorrect ? "review-correct" : isAnswered ? "review-wrong" : "review-skipped"}`;

    // Tag Bar
    const statusBadge = isCorrect
      ? `<span class="badge bg-success-light text-success fw-bold px-2 py-1"><i class="bi bi-check-circle-fill"></i> Correct</span>`
      : isAnswered
      ? `<span class="badge bg-danger-light text-danger fw-bold px-2 py-1"><i class="bi bi-x-circle-fill"></i> Incorrect</span>`
      : `<span class="badge bg-secondary-subtle text-secondary fw-bold px-2 py-1"><i class="bi bi-dash-circle-fill"></i> Unanswered</span>`;

    const diffBadge = `<span class="badge ${
      q.difficulty === "Easy" ? "badge-diff-easy" : q.difficulty === "Medium" ? "badge-diff-medium" : "badge-diff-hard"
    }">${q.difficulty}</span>`;

    // Options HTML
    let optionsHtml = "";
    q.options.forEach((optText, oIdx) => {
      const isTargetAnswer = oIdx === q.answer;
      const isUserPick = isAnswered && oIdx === userAnsIdx;

      let optClass = "review-option";
      let statusIcon = "";

      if (isTargetAnswer) {
        optClass += " is-correct-target";
        statusIcon = `<i class="bi bi-check2-circle text-success fs-5"></i>`;
      } else if (isUserPick) {
        optClass += " is-user-mistake";
        statusIcon = `<i class="bi bi-x-circle text-danger fs-5"></i>`;
      }

      optionsHtml += `
        <div class="${optClass}">
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-light text-dark border fw-bold">${letters[oIdx]}</span>
            <span>${escapeHtml(optText)}</span>
          </div>
          <div>${statusIcon}</div>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="d-flex align-items-center gap-2">
          <span class="fw-bold fs-5 text-main">Question ${idx + 1}</span>
          ${statusBadge}
          ${diffBadge}
          <span class="badge bg-light text-secondary border">${escapeHtml(q.topic || "Topic")}</span>
        </div>
        <div>
          <button type="button" class="btn-bookmark ${isBookmarked ? "bookmarked" : ""}" data-qid="${q.id}" title="Bookmark Question">
            <i class="bi ${isBookmarked ? "bi-star-fill text-warning" : "bi-star"}"></i>
          </button>
        </div>
      </div>

      <div class="question-prompt mb-3">
        ${escapeHtml(q.question)}
      </div>

      <div class="options-review-list mb-3">
        ${optionsHtml}
      </div>

      <div class="explanation-box">
        <div class="d-flex align-items-start gap-2">
          <i class="bi bi-lightbulb-fill text-primary fs-5 mt-1"></i>
          <div>
            <strong>Explanation:</strong>
            <p class="mb-0 mt-1">${escapeHtml(q.explanation)}</p>
          </div>
        </div>
      </div>
    `;

    // Add bookmark listener
    const bookmarkBtn = card.querySelector(".btn-bookmark");
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener("click", () => {
        if (typeof Storage !== "undefined") {
          const nowBookmarked = Storage.toggleBookmark(q.id);
          bookmarkBtn.classList.toggle("bookmarked", nowBookmarked);
          const starIcon = bookmarkBtn.querySelector("i");
          if (starIcon) {
            starIcon.className = nowBookmarked ? "bi bi-star-fill text-warning" : "bi bi-star";
          }
        }
      });
    }

    container.appendChild(card);
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
