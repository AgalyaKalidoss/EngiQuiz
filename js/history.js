/**
 * EngiQuiz - History Controller
 * Displays searchable, filterable log of past quiz attempts with review links.
 */

document.addEventListener("DOMContentLoaded", async () => {
  renderHistoryTable();
  setupHistoryFilters();
  setupCloudSync();
});

async function setupCloudSync() {
  const cloudBadge = document.getElementById("historyCloudBadge");
  const syncBtn = document.getElementById("btnSyncCloudHistory");

  if (typeof Auth !== "undefined" && Auth.isLoggedIn()) {
    cloudBadge?.classList.remove("d-none");
    syncBtn?.classList.remove("d-none");

    syncBtn?.addEventListener("click", async () => {
      syncBtn.disabled = true;
      syncBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span> Pulling...`;
      await Auth.pullFromMongo();
      renderHistoryTable();
      syncBtn.disabled = false;
      syncBtn.innerHTML = `<i class="bi bi-arrow-repeat me-1"></i> Refresh Cloud Tests`;
    });

    // Auto pull on page load
    try {
      await Auth.pullFromMongo();
      renderHistoryTable();
    } catch (e) {
      console.warn("Initial history pull deferred:", e);
    }
  }
}

function renderHistoryTable(filterSubject = "All") {
  const container = document.getElementById("historyTableBody");
  const emptyState = document.getElementById("historyEmptyState");
  const tableContainer = document.getElementById("historyTableContainer");
  if (!container || typeof Storage === "undefined") return;

  const history = Storage.getHistory();

  let filtered = history;
  if (filterSubject && filterSubject !== "All") {
    filtered = history.filter(h => h.subject.toLowerCase() === filterSubject.toLowerCase());
  }

  if (filtered.length === 0) {
    if (tableContainer) tableContainer.classList.add("d-none");
    if (emptyState) emptyState.classList.remove("d-none");
    return;
  }

  if (emptyState) emptyState.classList.add("d-none");
  if (tableContainer) tableContainer.classList.remove("d-none");

  container.innerHTML = "";

  filtered.forEach(h => {
    const tr = document.createElement("tr");

    const badgeClass = h.percentage >= 80 ? "bg-success-light text-success" : h.percentage >= 60 ? "bg-warning-light text-warning" : "bg-danger-light text-danger";
    const dateStr = h.formattedDate || new Date(h.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    tr.innerHTML = `
      <td class="fw-bold">${escapeHtml(h.subject)}</td>
      <td><span class="badge bg-light text-secondary border">${escapeHtml(h.topic || "All Topics")}</span></td>
      <td><span class="badge bg-light text-muted border">${escapeHtml(h.difficulty || "Mixed")}</span></td>
      <td class="text-center">${h.questionsCount}</td>
      <td class="text-center fw-semibold">${h.correct} / ${h.questionsCount}</td>
      <td class="text-center"><span class="badge ${badgeClass} fw-bold fs-6">${h.percentage}%</span></td>
      <td class="text-center text-muted font-monospace">${h.timeTaken || "00:00"}</td>
      <td class="text-muted small">${dateStr}</td>
      <td class="text-end">
        <a href="result.html?id=${h.id}" class="btn btn-sm btn-purple-outline">
          <i class="bi bi-eye"></i> Review
        </a>
      </td>
    `;
    container.appendChild(tr);
  });
}

function setupHistoryFilters() {
  const select = document.getElementById("historySubjectFilter");
  if (select && typeof QuestionEngine !== "undefined") {
    const subjects = QuestionEngine.getSubjects();
    subjects.forEach(subj => {
      const opt = document.createElement("option");
      opt.value = subj;
      opt.textContent = subj;
      select.appendChild(opt);
    });

    select.addEventListener("change", (e) => {
      renderHistoryTable(e.target.value);
    });
  }

  // Clear history button
  const clearBtn = document.getElementById("btnClearHistoryBtn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your entire quiz history? This cannot be undone.")) {
        if (typeof Storage !== "undefined") {
          Storage.clearHistory();
          renderHistoryTable();
        }
      }
    });
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
