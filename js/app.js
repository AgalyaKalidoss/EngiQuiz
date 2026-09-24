/**
 * EngiQuiz - Common Application Logic
 * Navbar, Theme Toggle, Streak Display, Navigation helpers.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Apply saved theme immediately
  if (typeof Storage !== "undefined") {
    Storage.applyTheme();
    updateNavbarStreak();
  }

  // Theme toggle button click handler
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      if (typeof Storage !== "undefined") {
        Storage.toggleTheme();
      }
    });
  }

  // Highlight active navbar link based on current path
  highlightActiveNavLink();
});

function updateNavbarStreak() {
  const streakEl = document.getElementById("navStreakBadge");
  if (!streakEl || typeof Storage === "undefined") return;

  const streak = Storage.getStreak();
  const count = streak.currentStreak || 0;
  streakEl.innerHTML = `<i class="bi bi-fire text-warning"></i> ${count} Day${count === 1 ? "" : "s"}`;
}

function highlightActiveNavLink() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".engi-navbar .nav-link");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;
    const linkPath = href.split("/").pop();

    if (linkPath === currentPath || (currentPath === "" && linkPath === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Global utility for triggering toast/notification if needed
function showNotification(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toastId = `toast_${Date.now()}`;
  const bgClass = type === "success" ? "bg-success text-white" : type === "danger" ? "bg-danger text-white" : "bg-purple text-white";

  const toastHtml = `
    <div id="${toastId}" class="toast align-items-center ${bgClass} border-0 shadow" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body fw-medium">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  container.insertAdjacentHTML("beforeend", toastHtml);
  const toastEl = document.getElementById(toastId);
  if (typeof bootstrap !== "undefined" && bootstrap.Toast) {
    const bsToast = new bootstrap.Toast(toastEl, { delay: 3500 });
    bsToast.show();
    toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
  }
}
