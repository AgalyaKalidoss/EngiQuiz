/**
 * EngiQuiz - Progress & Performance Analytics Controller
 * Handles Chart.js charts, weak-topic identification, mistake reviews, and achievements.
 */

let subjectChartInstance = null;
let trendChartInstance = null;

document.addEventListener("DOMContentLoaded", async () => {
  const user = await Auth.requireAuth();
  if (!user) return;

  const main = document.getElementById("progressMain");
  if (main) main.style.display = "";

  await Auth.fetchUserCloudData();
  renderProgressPage();
});

function renderProgressPage() {
  if (typeof Storage === "undefined") return;

  const stats = Storage.getOverallStats();
  const history = Storage.getHistory();

  // Populate Summary Cards
  document.getElementById("progOverallAccuracy").textContent = `${stats.averageAccuracy}%`;
  document.getElementById("progQuizzesTaken").textContent = stats.quizzesTaken;
  document.getElementById("progQuestionsSolved").textContent = stats.questionsSolved;
  document.getElementById("progBestScore").textContent = `${stats.bestScore}%`;
  document.getElementById("progStreak").textContent = `${stats.currentStreak} Days`;

  // Render Charts
  renderCharts(history);

  // Render Weak Topics
  renderDetailedWeakTopics(history);

  // Render Mistakes Review
  renderMistakesSection();

  // Render Achievements
  renderAchievements(stats, history);
}

function renderCharts(history) {
  if (typeof Chart === "undefined") {
    console.warn("Chart.js is not loaded.");
    return;
  }

  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  const textColor = isDark ? "#94a3b8" : "#64748b";
  const gridColor = isDark ? "#334155" : "#e2e8f0";

  // 1. Subject Performance Bar Chart
  const subjectStats = {};
  history.forEach(h => {
    if (!subjectStats[h.subject]) {
      subjectStats[h.subject] = { total: 0, correct: 0 };
    }
    subjectStats[h.subject].total += (h.questionsCount || 0);
    subjectStats[h.subject].correct += (h.correct || 0);
  });

  const subjectLabels = Object.keys(subjectStats);
  const subjectAccuracies = subjectLabels.map(s => {
    const data = subjectStats[s];
    return data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
  });

  const ctxSubject = document.getElementById("chartSubjectPerformance")?.getContext("2d");
  if (ctxSubject) {
    if (subjectChartInstance) subjectChartInstance.destroy();

    subjectChartInstance = new Chart(ctxSubject, {
      type: "bar",
      data: {
        labels: subjectLabels.length > 0 ? subjectLabels : ["No Data Yet"],
        datasets: [{
          label: "Accuracy (%)",
          data: subjectAccuracies.length > 0 ? subjectAccuracies : [0],
          backgroundColor: "#8b5cf6",
          borderColor: "#6f42c1",
          borderWidth: 1,
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { color: textColor, callback: val => `${val}%` },
            grid: { color: gridColor }
          },
          x: {
            ticks: { color: textColor },
            grid: { display: false }
          }
        }
      }
    });
  }

  // 2. Accuracy Trend Line Chart (Last 10 attempts chronologically)
  const recent10 = history.slice(0, 10).reverse();
  const trendLabels = recent10.map((h, i) => `Q${i + 1}`);
  const trendData = recent10.map(h => h.percentage);

  const ctxTrend = document.getElementById("chartAccuracyTrend")?.getContext("2d");
  if (ctxTrend) {
    if (trendChartInstance) trendChartInstance.destroy();

    trendChartInstance = new Chart(ctxTrend, {
      type: "line",
      data: {
        labels: trendLabels.length > 0 ? trendLabels : ["Start"],
        datasets: [{
          label: "Score (%)",
          data: trendData.length > 0 ? trendData : [0],
          borderColor: "#6f42c1",
          backgroundColor: "rgba(111, 66, 193, 0.1)",
          fill: true,
          tension: 0.3,
          pointBackgroundColor: "#6f42c1",
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { color: textColor, callback: val => `${val}%` },
            grid: { color: gridColor }
          },
          x: {
            ticks: { color: textColor },
            grid: { display: false }
          }
        }
      }
    });
  }
}

function renderDetailedWeakTopics(history) {
  const container = document.getElementById("detailedWeakTopicsList");
  if (!container) return;

  if (history.length === 0) {
    container.innerHTML = `
      <div class="empty-state py-4">
        <i class="bi bi-bullseye empty-state-icon fs-2"></i>
        <div class="empty-state-title fs-6">No quiz data available yet.</div>
        <p class="empty-state-text small mb-0">Take practice quizzes to identify conceptual areas needing reinforcement.</p>
      </div>
    `;
    return;
  }

  const topicMap = {};
  history.forEach(h => {
    if (Array.isArray(h.questions)) {
      h.questions.forEach((q, idx) => {
        const key = `${q.subject}___${q.topic}`;
        if (!topicMap[key]) {
          topicMap[key] = { subject: q.subject, topic: q.topic, total: 0, correct: 0 };
        }
        topicMap[key].total++;
        if (h.userAnswers && h.userAnswers[idx] === q.answer) {
          topicMap[key].correct++;
        }
      });
    }
  });

  const weakList = Object.values(topicMap)
    .filter(t => t.total >= 2)
    .map(t => ({
      ...t,
      accuracy: Math.round((t.correct / t.total) * 100)
    }))
    .filter(t => t.accuracy < 75)
    .sort((a, b) => a.accuracy - b.accuracy);

  if (weakList.length === 0) {
    container.innerHTML = `
      <div class="p-3 text-center text-success small bg-success-light rounded-3 border border-success">
        <i class="bi bi-trophy-fill fs-4 d-block mb-1 text-warning"></i>
        <strong>Outstanding Work!</strong> No weak topics detected with accuracy below 75%.
      </div>
    `;
    return;
  }

  let html = `<div class="row">`;
  weakList.forEach(item => {
    html += `
      <div class="col-md-6 mb-3">
        <div class="p-3 border rounded-3 bg-card h-100 d-flex flex-column justify-content-between">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <span class="badge bg-light text-secondary border small">${escapeHtml(item.subject)}</span>
              <h5 class="fw-bold mt-1 mb-0 fs-6">${escapeHtml(item.topic)}</h5>
            </div>
            <span class="badge bg-danger-light text-danger fw-bold fs-6">${item.accuracy}%</span>
          </div>
          <p class="text-muted small mb-3">${item.correct} correct of ${item.total} attempted questions.</p>
          <a href="practice.html?subject=${encodeURIComponent(item.subject)}&topic=${encodeURIComponent(item.topic)}" class="btn btn-sm btn-outline-danger w-100 fw-bold">
            <i class="bi bi-arrow-repeat me-1"></i> Practice Topic
          </a>
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

function renderMistakesSection() {
  const container = document.getElementById("mistakesReviewList");
  const practiceBtn = document.getElementById("btnPracticeAllMistakes");
  if (!container || typeof Storage === "undefined") return;

  const mistakes = Storage.getMistakes();
  const mistakeIds = Object.keys(mistakes);

  if (mistakeIds.length === 0) {
    container.innerHTML = `
      <div class="empty-state py-4">
        <i class="bi bi-check-circle-fill text-success fs-1 mb-2"></i>
        <div class="empty-state-title fs-6">Great! You haven't recorded any mistakes yet.</div>
        <p class="empty-state-text small mb-0">Whenever you answer a question incorrectly, it will be automatically tracked here for targeted review.</p>
      </div>
    `;
    if (practiceBtn) practiceBtn.classList.add("d-none");
    return;
  }

  if (practiceBtn) {
    practiceBtn.classList.remove("d-none");
    practiceBtn.onclick = () => {
      window.location.href = "quiz.html?mode=mistakes&fresh=true";
    };
  }

  // Display mistake items
  let html = `<div class="list-group list-group-flush border rounded-3 overflow-hidden">`;
  mistakeIds.forEach(id => {
    const item = mistakes[id];
    const q = typeof QuestionEngine !== "undefined" ? QuestionEngine.getQuestionById(id) : null;
    const qPrompt = q ? q.question : `Question ID: ${id}`;
    const subject = item.subject || (q ? q.subject : "Engineering");
    const topic = item.topic || (q ? q.topic : "General");

    html += `
      <div class="list-group-item p-3 d-flex justify-content-between align-items-center">
        <div class="me-3">
          <div class="d-flex align-items-center gap-2 mb-1">
            <span class="badge bg-purple-light text-purple small">${escapeHtml(subject)}</span>
            <span class="badge bg-light text-secondary border small">${escapeHtml(topic)}</span>
            <span class="badge bg-danger-light text-danger fw-bold small">Wrong ${item.count} time${item.count > 1 ? "s" : ""}</span>
          </div>
          <div class="text-main fw-medium small">${escapeHtml(qPrompt)}</div>
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

function renderAchievements(stats, history) {
  const container = document.getElementById("achievementsGrid");
  if (!container) return;

  // Criteria definition
  const hasFirstQuiz = stats.quizzesTaken >= 1;
  const has100Questions = stats.questionsSolved >= 100;
  const has7Streak = (stats.currentStreak >= 7) || (stats.bestStreak >= 7);
  const hasPerfectScore = history.some(h => h.percentage === 100 && h.questionsCount >= 5);
  const has10Quizzes = stats.quizzesTaken >= 10;

  // Check Subject Master: >= 20 questions in any subject with >= 90% accuracy
  const subjectTotals = {};
  history.forEach(h => {
    if (!subjectTotals[h.subject]) subjectTotals[h.subject] = { total: 0, correct: 0 };
    subjectTotals[h.subject].total += (h.questionsCount || 0);
    subjectTotals[h.subject].correct += (h.correct || 0);
  });
  const hasSubjectMaster = Object.values(subjectTotals).some(
    s => s.total >= 20 && (s.correct / s.total) >= 0.9
  );

  const badges = [
    { title: "First Quiz", icon: "🏆", desc: "Completed your first quiz attempt", unlocked: hasFirstQuiz },
    { title: "100 Questions", icon: "🎯", desc: "Solved 100 questions across subjects", unlocked: has100Questions },
    { title: "7 Day Streak", icon: "🔥", desc: "Practiced for 7 consecutive days", unlocked: has7Streak },
    { title: "Perfect Score", icon: "💯", desc: "Achieved 100% on a full quiz", unlocked: hasPerfectScore },
    { title: "10 Quizzes", icon: "📚", desc: "Completed 10 comprehensive quizzes", unlocked: has10Quizzes },
    { title: "Subject Master", icon: "🧠", desc: "Scored 90%+ with 20+ questions in a subject", unlocked: hasSubjectMaster }
  ];

  let html = "";
  badges.forEach(b => {
    html += `
      <div class="col-6 col-md-4 col-lg-2 mb-3">
        <div class="achievement-card ${b.unlocked ? "unlocked shadow-sm" : "locked"}">
          <div class="achievement-icon">${b.icon}</div>
          <div class="achievement-title">${b.title}</div>
          <div class="achievement-desc">${b.desc}</div>
        </div>
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
