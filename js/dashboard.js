/**
 * EngiQuiz - Dashboard & Landing Controller
 * Powers dynamic statistics, recent attempts, quick practice, and daily challenge on index.html.
 */

document.addEventListener("DOMContentLoaded", () => {
  renderDashboard();
});

window.addEventListener("auth:ready", () => {
  renderDashboard();
});

window.addEventListener("data:synced", () => {
  renderDashboard();
});

window.addEventListener("auth:logout", () => {
  renderDashboard();
});

function renderDashboard() {
  if (typeof Storage === "undefined") return;

  const stats = Storage.getOverallStats();

  // Populate overall stats
  const quizzesEl = document.getElementById("dashQuizzesTaken");
  if (quizzesEl) quizzesEl.textContent = stats.quizzesTaken;

  const questionsEl = document.getElementById("dashQuestionsSolved");
  if (questionsEl) questionsEl.textContent = stats.questionsSolved;

  const accuracyEl = document.getElementById("dashAverageAccuracy");
  if (accuracyEl) accuracyEl.textContent = `${stats.averageAccuracy}%`;

  const bestScoreEl = document.getElementById("dashBestScore");
  if (bestScoreEl) bestScoreEl.textContent = `${stats.bestScore}%`;

  const streakEl = document.getElementById("dashStreakDays");
  if (streakEl) streakEl.textContent = `${stats.currentStreak} Days`;

  // Render Daily Challenge Card
  renderDailyChallengeCard();

  // Render Continue Practicing Subjects (Top 4 subjects)
  renderContinuePracticing();

  // Render Recent Activity (Last 3 attempts)
  renderRecentActivity();

  // Render Weak Topics
  renderWeakTopicsDashboard();
}

function renderDailyChallengeCard() {
  const dailyContainer = document.getElementById("dailyChallengeCardContainer");
  if (!dailyContainer || typeof Storage === "undefined") return;

  const dailyState = Storage.getDailyState();
  const today = new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

  let actionHtml = "";
  if (dailyState.completed) {
    actionHtml = `
      <div class="d-flex align-items-center gap-2">
        <span class="badge bg-success-light text-success fs-6 px-3 py-2">
          <i class="bi bi-check-circle-fill"></i> Completed Today (${dailyState.score}/${dailyState.total})
        </span>
        <a href="quiz.html?mode=daily&fresh=true" class="btn btn-sm btn-outline-secondary">Retake</a>
      </div>
    `;
  } else {
    actionHtml = `
      <a href="quiz.html?mode=daily&fresh=true" class="btn btn-purple px-4 py-2 fw-bold">
        <i class="bi bi-play-circle-fill me-1"></i> Start Challenge
      </a>
    `;
  }

  dailyContainer.innerHTML = `
    <div class="daily-card shadow-sm">
      <div class="row align-items-center">
        <div class="col-md-8 mb-3 mb-md-0">
          <div class="d-flex align-items-center gap-2 mb-2">
            <span class="badge bg-purple text-white px-2 py-1"><i class="bi bi-lightning-charge-fill"></i> Daily Quiz</span>
            <span class="text-muted small">${today}</span>
          </div>
          <h3 class="h4 fw-bold mb-1">Today's Engineering Challenge</h3>
          <p class="text-muted mb-0">10 curated questions across core engineering domains with mixed difficulty. Boost your daily streak!</p>
        </div>
        <div class="col-md-4 text-md-end">
          ${actionHtml}
        </div>
      </div>
    </div>
  `;
}

function renderContinuePracticing() {
  const container = document.getElementById("continuePracticingGrid");
  if (!container || typeof SUBJECTS === "undefined") return;

  container.innerHTML = "";
  // Pick top 4 subjects
  const topSubjects = SUBJECTS.slice(0, 4);

  topSubjects.forEach(subj => {
    const stats = QuestionEngine.getSubjectStats(subj.name);
    const accText = stats.accuracy !== null ? `${stats.accuracy}%` : "Not attempted";
    const accClass = stats.accuracy === null ? "text-muted" : stats.accuracy >= 80 ? "accuracy-high" : stats.accuracy >= 60 ? "accuracy-mid" : "accuracy-low";

    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-3 mb-3";
    col.innerHTML = `
      <div class="subject-card h-100">
        <div class="subject-card-header">
          <div class="subject-icon-box">
            <i class="bi ${subj.icon}"></i>
          </div>
          <span class="badge bg-light text-secondary border">${subj.branch}</span>
        </div>
        <h4 class="subject-title">${escapeHtml(subj.name)}</h4>
        <p class="subject-desc">${escapeHtml(subj.description)}</p>
        <div class="subject-meta">
          <span><i class="bi bi-question-circle"></i> ${stats.total} Questions</span>
          <span>Acc: <span class="badge ${accClass}">${accText}</span></span>
        </div>
        <a href="practice.html?subject=${encodeURIComponent(subj.name)}" class="btn btn-purple w-100">
          Practice Now
        </a>
      </div>
    `;
    container.appendChild(col);
  });
}

function renderRecentActivity() {
  const container = document.getElementById("recentActivityContainer");
  if (!container || typeof Storage === "undefined") return;

  const history = Storage.getHistory();
  if (history.length === 0) {
    container.innerHTML = `
      <div class="empty-state py-4 my-2">
        <i class="bi bi-clock-history empty-state-icon fs-2"></i>
        <div class="empty-state-title fs-6">Your quiz journey starts here.</div>
        <p class="empty-state-text small mb-3">Complete your first quiz to see your detailed performance history and progress.</p>
        <a href="practice.html" class="btn btn-purple btn-sm">Take Your First Quiz</a>
      </div>
    `;
    return;
  }

  const recent = history.slice(0, 3);
  let html = `<div class="list-group list-group-flush border rounded-3 overflow-hidden">`;

  recent.forEach(h => {
    const badgeClass = h.percentage >= 80 ? "bg-success-light text-success" : h.percentage >= 60 ? "bg-warning-light text-warning" : "bg-danger-light text-danger";
    html += `
      <div class="list-group-item d-flex justify-content-between align-items-center p-3">
        <div>
          <div class="fw-bold fs-6">${escapeHtml(h.subject)} – ${escapeHtml(h.topic || "All Topics")}</div>
          <div class="text-muted small">
            ${h.formattedDate || new Date(h.date).toLocaleDateString()} · ${h.questionsCount} questions · ${h.timeTaken || "00:00"}
          </div>
        </div>
        <div class="d-flex align-items-center gap-3">
          <span class="badge ${badgeClass} fs-6 px-3 py-2 fw-bold">${h.percentage}%</span>
          <a href="result.html?id=${h.id}" class="btn btn-sm btn-outline-secondary">Review</a>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}

function renderWeakTopicsDashboard() {
  const container = document.getElementById("weakTopicsContainer");
  if (!container || typeof Storage === "undefined") return;

  const history = Storage.getHistory();
  if (history.length === 0) {
    container.innerHTML = `
      <div class="p-3 text-center text-muted small bg-light rounded-3 border">
        Practice quizzes to automatically analyze and identify topics that need reinforcement.
      </div>
    `;
    return;
  }

  // Calculate topic accuracy
  const topicStats = {};
  history.forEach(h => {
    if (Array.isArray(h.questions)) {
      h.questions.forEach((q, idx) => {
        const key = `${q.subject}___${q.topic}`;
        if (!topicStats[key]) {
          topicStats[key] = { subject: q.subject, topic: q.topic, total: 0, correct: 0 };
        }
        topicStats[key].total++;
        const userAns = h.userAnswers ? h.userAnswers[idx] : undefined;
        if (userAns === q.answer) {
          topicStats[key].correct++;
        }
      });
    }
  });

  const list = Object.values(topicStats)
    .filter(t => t.total >= 2)
    .map(t => ({
      ...t,
      accuracy: Math.round((t.correct / t.total) * 100)
    }))
    .filter(t => t.accuracy < 75)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  if (list.length === 0) {
    container.innerHTML = `
      <div class="p-3 text-center text-success small bg-success-light rounded-3 border border-success">
        <i class="bi bi-shield-check fs-5 d-block mb-1"></i>
        <strong>Excellent!</strong> No weak topics detected with accuracy below 75%. Keep up the momentum!
      </div>
    `;
    return;
  }

  let html = "";
  list.forEach(item => {
    html += `
      <div class="weak-topic-item">
        <div>
          <div class="fw-bold">${escapeHtml(item.subject)}: ${escapeHtml(item.topic)}</div>
          <div class="text-muted small">${item.accuracy}% accuracy across ${item.total} attempts</div>
        </div>
        <a href="practice.html?subject=${encodeURIComponent(item.subject)}&topic=${encodeURIComponent(item.topic)}" class="btn btn-sm btn-outline-danger fw-semibold">
          Practice Topic
        </a>
      </div>
    `;
  });

  container.innerHTML = html;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
