/**
 * EngiQuiz - Bookmarks Controller
 * Displays saved questions with explanation toggles and allows generating bookmark quizzes.
 */

document.addEventListener("DOMContentLoaded", async () => {
  renderBookmarksList();
  setupBookmarkFilters();
  setupCloudBookmarks();
});

async function setupCloudBookmarks() {
  const badge = document.getElementById("bookmarksCloudBadge");
  if (typeof Auth !== "undefined" && Auth.isLoggedIn()) {
    badge?.classList.remove("d-none");
    try {
      await Auth.pullFromMongo();
      renderBookmarksList();
    } catch (e) {
      console.warn("Initial bookmarks pull deferred:", e);
    }
  }
}

function renderBookmarksList(filterSubject = "All") {
  const container = document.getElementById("bookmarksContainer");
  const emptyState = document.getElementById("bookmarksEmptyState");
  const actionRow = document.getElementById("bookmarksActionRow");
  if (!container || typeof Storage === "undefined" || typeof QuestionEngine === "undefined") return;

  const bookmarkIds = Storage.getBookmarks();

  if (bookmarkIds.length === 0) {
    if (emptyState) emptyState.classList.remove("d-none");
    if (actionRow) actionRow.classList.add("d-none");
    container.innerHTML = "";
    return;
  }

  let questions = bookmarkIds
    .map(id => QuestionEngine.getQuestionById(id))
    .filter(q => q !== null);

  if (filterSubject && filterSubject !== "All") {
    questions = questions.filter(q => q.subject.toLowerCase() === filterSubject.toLowerCase());
  }

  if (questions.length === 0) {
    container.innerHTML = `
      <div class="empty-state py-4">
        <p class="text-muted mb-0">No bookmarked questions for the selected subject "${escapeHtml(filterSubject)}".</p>
      </div>
    `;
    return;
  }

  if (emptyState) emptyState.classList.add("d-none");
  if (actionRow) actionRow.classList.remove("d-none");

  container.innerHTML = "";
  const letters = ["A", "B", "C", "D"];

  questions.forEach(q => {
    const card = document.createElement("div");
    card.className = "card mb-3 p-3";

    const diffBadge = `<span class="badge ${
      q.difficulty === "Easy" ? "badge-diff-easy" : q.difficulty === "Medium" ? "badge-diff-medium" : "badge-diff-hard"
    }">${q.difficulty}</span>`;

    let optionsHtml = `<div class="row g-2 mb-2">`;
    q.options.forEach((opt, idx) => {
      const isCorrect = idx === q.answer;
      optionsHtml += `
        <div class="col-md-6">
          <div class="p-2 border rounded ${isCorrect ? "bg-success-light text-success fw-bold border-success" : "bg-light text-main"} small">
            ${letters[idx]}. ${escapeHtml(opt)} ${isCorrect ? '<i class="bi bi-check-circle-fill ms-1"></i>' : ""}
          </div>
        </div>
      `;
    });
    optionsHtml += `</div>`;

    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="d-flex align-items-center gap-2">
          <span class="badge bg-purple-light text-purple fw-bold">${escapeHtml(q.subject)}</span>
          <span class="badge bg-light text-secondary border">${escapeHtml(q.topic)}</span>
          ${diffBadge}
        </div>
        <button type="button" class="btn btn-sm btn-outline-danger btn-remove-bm" title="Remove Bookmark">
          <i class="bi bi-trash3"></i> Remove
        </button>
      </div>
      <div class="fw-semibold mb-3 fs-6">${escapeHtml(q.question)}</div>
      ${optionsHtml}
      <div class="mt-2 p-2 bg-info-light text-main rounded border small">
        <strong>Explanation:</strong> ${escapeHtml(q.explanation)}
      </div>
    `;

    card.querySelector(".btn-remove-bm")?.addEventListener("click", () => {
      Storage.toggleBookmark(q.id);
      renderBookmarksList(filterSubject);
    });

    container.appendChild(card);
  });
}

function setupBookmarkFilters() {
  const select = document.getElementById("bookmarkSubjectFilter");
  if (select && typeof QuestionEngine !== "undefined") {
    const subjects = QuestionEngine.getSubjects();
    subjects.forEach(subj => {
      const opt = document.createElement("option");
      opt.value = subj;
      opt.textContent = subj;
      select.appendChild(opt);
    });

    select.addEventListener("change", (e) => {
      renderBookmarksList(e.target.value);
    });
  }

  const practiceBtn = document.getElementById("btnPracticeBookmarks");
  if (practiceBtn) {
    practiceBtn.addEventListener("click", () => {
      window.location.href = "quiz.html?mode=bookmarks&fresh=true";
    });
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
