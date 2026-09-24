/**
 * EngiQuiz - Comprehensive Authentication & MongoDB Atlas Synchronization Client
 */

const AuthKeys = {
  TOKEN: "engiquiz_token",
  USER: "engiquiz_user",
  MONGO_STATUS: "engiquiz_mongo_status"
};

const Auth = {
  getUser() {
    try {
      const data = localStorage.getItem(AuthKeys.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem(AuthKeys.TOKEN) || null;
  },

  isLoggedIn() {
    return !!this.getToken() && !!this.getUser();
  },

  setUserSession(token, user) {
    localStorage.setItem(AuthKeys.TOKEN, token);
    localStorage.setItem(AuthKeys.USER, JSON.stringify(user));
    this.renderNavUser();
    this.applyPersonalization();
  },

  clearSession() {
    localStorage.removeItem(AuthKeys.TOKEN);
    localStorage.removeItem(AuthKeys.USER);
    this.renderNavUser();
    this.applyPersonalization();
  },

  async login(email, password) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid email or password.");
      }
      this.setUserSession(data.token, data.user);
      
      // Auto-fetch synced cloud attempts from MongoDB Atlas
      this.fetchUserCloudData().catch(() => {});
      
      return data;
    } catch (err) {
      throw err;
    }
  },

  async register({ name, email, password, branch, targetExam, avatar }) {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          branch,
          targetExam,
          avatar
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration failed.");
      }
      this.setUserSession(data.token, data.user);
      return data;
    } catch (err) {
      throw err;
    }
  },

  async resetPassword(email, newPassword) {
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), newPassword })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Password reset failed.");
      }
      return data;
    } catch (err) {
      throw err;
    }
  },

  async updateProfile(updates) {
    const token = this.getToken();
    if (!token) throw new Error("Not authenticated");

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Profile update failed.");
      }
      const current = this.getUser() || {};
      const updated = { ...current, ...data.user };
      localStorage.setItem(AuthKeys.USER, JSON.stringify(updated));
      this.renderNavUser();
      this.applyPersonalization();
      return data;
    } catch (err) {
      throw err;
    }
  },

  async logout() {
    const token = this.getToken();
    if (token) {
      fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      }).catch(() => {});
    }
    this.clearSession();
    
    // Redirect if on login or protected page
    if (window.location.pathname.includes("login.html")) {
      window.location.reload();
    } else {
      if (typeof showNotification === "function") {
        showNotification("Signed out successfully.", "info");
      } else {
        window.location.reload();
      }
    }
  },

  async getMongoStatus() {
    try {
      const res = await fetch("/api/mongo/status");
      const data = await res.json();
      localStorage.setItem(AuthKeys.MONGO_STATUS, JSON.stringify(data));
      return data;
    } catch (err) {
      return { connected: false, mode: "offline", error: err.message };
    }
  },

  async retryMongoConnection() {
    try {
      const res = await fetch("/api/mongo/retry", { method: "POST" });
      const data = await res.json();
      localStorage.setItem(AuthKeys.MONGO_STATUS, JSON.stringify(data));
      return data;
    } catch (err) {
      return { connected: false, mode: "offline", error: err.message };
    }
  },

  async syncToMongo(attempt = null, bookmarks = null) {
    const token = this.getToken();
    if (!token) return;

    try {
      await fetch("/api/user/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ attempt, bookmarks })
      });
    } catch (err) {
      console.log("[EngiQuiz Mongo Sync] Sync attempt deferred:", err.message);
    }
  },

  async fetchUserCloudData() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch("/api/user/sync", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        // If user has attempts in Atlas, sync into local storage history
        if (Array.isArray(data.attempts) && data.attempts.length > 0 && typeof Storage !== "undefined") {
          const localHistory = Storage.getHistory();
          const merged = [...data.attempts];
          localHistory.forEach(lh => {
            if (!merged.find(m => m.id === lh.id)) {
              merged.push(lh);
            }
          });
          merged.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          localStorage.setItem("engiquiz_history", JSON.stringify(merged));
        }

        // Sync bookmarks
        if (Array.isArray(data.bookmarks) && typeof Storage !== "undefined") {
          const localBookmarks = Storage.getBookmarks();
          const combined = Array.from(new Set([...localBookmarks, ...data.bookmarks]));
          localStorage.setItem("engiquiz_bookmarks", JSON.stringify(combined));
        }
        return data;
      }
    } catch {
      return null;
    }
  },

  checkPasswordStrength(password) {
    if (!password) return { score: 0, label: "Empty", percent: 0, color: "bg-secondary" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score, label: "Weak", percent: 25, color: "bg-danger" };
      case 2:
        return { score, label: "Fair", percent: 50, color: "bg-warning" };
      case 3:
        return { score, label: "Good", percent: 75, color: "bg-info" };
      case 4:
        return { score, label: "Strong", percent: 100, color: "bg-success" };
      default:
        return { score, label: "Very Weak", percent: 10, color: "bg-danger" };
    }
  },

  renderNavUser() {
    const container = document.getElementById("navUserContainer");
    if (!container) return;

    const user = this.getUser();

    if (!user) {
      container.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <button type="button" class="btn btn-sm btn-outline-purple fw-bold d-flex align-items-center gap-1" id="btnNavSignIn">
            <i class="bi bi-box-arrow-in-right"></i>
            <span>Sign In</span>
          </button>
          <button type="button" class="btn btn-sm btn-purple fw-bold d-none d-md-inline-flex align-items-center gap-1" id="btnNavSignUp">
            <i class="bi bi-person-plus"></i>
            <span>Join Free</span>
          </button>
        </div>
      `;

      document.getElementById("btnNavSignIn")?.addEventListener("click", () => {
        this.openAuthModal("signin");
      });
      document.getElementById("btnNavSignUp")?.addEventListener("click", () => {
        this.openAuthModal("signup");
      });
      return;
    }

    const shortName = user.name ? user.name.split(" ")[0] : "Student";
    const branchAbbr = user.branch ? (user.branch.match(/\(([^)]+)\)/)?.[1] || user.branch.substring(0, 4)) : "ENG";

    container.innerHTML = `
      <div class="dropdown">
        <button class="btn btn-sm btn-user-pill dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <span class="user-avatar-badge">${user.avatar || "🎓"}</span>
          <span class="d-none d-sm-inline fw-bold text-truncate" style="max-width: 110px;">${shortName}</span>
          <span class="badge bg-purple-subtle text-purple d-none d-md-inline" style="font-size: 0.72rem;">${branchAbbr}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm border p-2" style="min-width: 260px;">
          <li class="px-3 py-2 border-bottom mb-2 bg-light rounded-top">
            <div class="fw-bold text-truncate">${user.name}</div>
            <div class="small text-muted text-truncate">${user.email}</div>
            <div class="small text-purple fw-semibold mt-1">
              <i class="bi bi-mortarboard-fill me-1"></i> ${user.branch || "Engineering"}
            </div>
            <div class="small text-muted">
              <i class="bi bi-bullseye me-1"></i> ${user.targetExam || "Target: Placements"}
            </div>
          </li>
          <li>
            <div class="px-3 py-1 small d-flex align-items-center justify-content-between text-muted">
              <span><i class="bi bi-database-check text-success me-1"></i> MongoDB Atlas:</span>
              <span class="badge bg-success-subtle text-success">Active & Synced</span>
            </div>
          </li>
          <li><hr class="dropdown-divider my-2"></li>
          <li>
            <a class="dropdown-item d-flex align-items-center gap-2" href="login.html">
              <i class="bi bi-person-gear text-purple"></i> My Profile & Account
            </a>
          </li>
          <li>
            <a class="dropdown-item d-flex align-items-center gap-2" href="progress.html">
              <i class="bi bi-graph-up text-purple"></i> Performance Analytics
            </a>
          </li>
          <li>
            <a class="dropdown-item d-flex align-items-center gap-2" href="bookmarks.html">
              <i class="bi bi-bookmark-star text-warning"></i> Saved Questions
            </a>
          </li>
          <li>
            <a class="dropdown-item d-flex align-items-center gap-2" href="history.html">
              <i class="bi bi-clock-history text-purple"></i> Quiz History
            </a>
          </li>
          <li><hr class="dropdown-divider my-2"></li>
          <li>
            <button type="button" id="btnLogoutNav" class="dropdown-item text-danger d-flex align-items-center gap-2">
              <i class="bi bi-box-arrow-left"></i> Sign Out
            </button>
          </li>
        </ul>
      </div>
    `;

    document.getElementById("btnLogoutNav")?.addEventListener("click", () => {
      this.logout();
    });
  },

  openAuthModal(initialTab = "signin") {
    // If currently on login.html, simply switch tabs on the page
    if (window.location.pathname.includes("login.html")) {
      const tabTrigger = document.querySelector(`#authTab button[data-bs-target="#${initialTab}-pane"]`);
      if (tabTrigger && typeof bootstrap !== "undefined") {
        const tab = new bootstrap.Tab(tabTrigger);
        tab.show();
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Ensure Universal Auth Modal DOM exists
    let modalEl = document.getElementById("universalAuthModal");
    if (!modalEl) {
      modalEl = document.createElement("div");
      modalEl.id = "universalAuthModal";
      modalEl.className = "modal fade";
      modalEl.tabIndex = -1;
      modalEl.setAttribute("aria-hidden", "true");
      modalEl.innerHTML = `
        <div class="modal-dialog modal-dialog-centered" style="max-width: 520px;">
          <div class="modal-content border shadow-lg" style="border-radius: 16px; overflow: hidden;">
            <div class="modal-header border-bottom px-4 pt-4 pb-3" style="background-color: var(--primary-light);">
              <div class="d-flex align-items-center gap-2">
                <span class="brand-logo-icon fs-4"><i class="bi bi-mortarboard-fill"></i></span>
                <div>
                  <h5 class="modal-title fw-bold mb-0 text-purple">EngiQuiz Student Account</h5>
                  <div class="small text-muted">Cloud synchronization via MongoDB Atlas</div>
                </div>
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body px-4 py-4">
              <!-- Tabs -->
              <ul class="nav nav-pills nav-fill mb-4 p-1 rounded bg-light border" id="modalAuthTabs" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link active fw-bold py-2" id="modal-signin-tab" data-bs-toggle="pill" data-bs-target="#modal-signin-pane" type="button" role="tab">
                    <i class="bi bi-box-arrow-in-right me-1"></i> Sign In
                  </button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link fw-bold py-2" id="modal-signup-tab" data-bs-toggle="pill" data-bs-target="#modal-signup-pane" type="button" role="tab">
                    <i class="bi bi-person-plus me-1"></i> Create Account
                  </button>
                </li>
              </ul>

              <div class="tab-content">
                <!-- MODAL SIGN IN -->
                <div class="tab-pane fade show active" id="modal-signin-pane" role="tabpanel">
                  <div id="modalSignInAlert" class="alert alert-danger d-none py-2 px-3 small" role="alert"></div>

                  <form id="modalSignInForm">
                    <div class="mb-3">
                      <label class="form-label fw-semibold small">Email Address</label>
                      <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                        <input type="email" id="modalLoginEmail" class="form-control" placeholder="student@example.edu" required />
                      </div>
                    </div>

                    <div class="mb-3">
                      <div class="d-flex justify-content-between align-items-center mb-1">
                        <label class="form-label fw-semibold small mb-0">Password</label>
                        <a href="login.html" class="small text-purple text-decoration-none" id="modalForgotLink">Forgot?</a>
                      </div>
                      <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-lock"></i></span>
                        <input type="password" id="modalLoginPassword" class="form-control" placeholder="••••••••" required />
                        <button class="btn btn-outline-secondary password-toggle-btn" type="button" data-target="modalLoginPassword">
                          <i class="bi bi-eye"></i>
                        </button>
                      </div>
                    </div>

                    <button type="submit" id="btnModalSubmitLogin" class="btn btn-purple w-100 fw-bold py-2 shadow-sm mb-3">
                      <i class="bi bi-box-arrow-in-right me-1"></i> Sign In to EngiQuiz
                    </button>
                  </form>

                  <!-- Demo Login Quick Button -->
                  <div class="p-3 border rounded bg-light text-center">
                    <div class="small text-muted mb-2">Want to test instantly?</div>
                    <button type="button" id="btnModalDemoLogin" class="btn btn-outline-purple btn-sm fw-bold w-100">
                      <i class="bi bi-lightning-charge-fill me-1"></i> 1-Click Demo Login (Alex Chen · CSE)
                    </button>
                  </div>
                </div>

                <!-- MODAL SIGN UP -->
                <div class="tab-pane fade" id="modal-signup-pane" role="tabpanel">
                  <div id="modalSignUpAlert" class="alert alert-danger d-none py-2 px-3 small" role="alert"></div>

                  <form id="modalSignUpForm">
                    <div class="mb-2">
                      <label class="form-label fw-semibold small">Full Name</label>
                      <input type="text" id="modalRegName" class="form-control" placeholder="e.g. Maya Sharma" required />
                    </div>

                    <div class="mb-2">
                      <label class="form-label fw-semibold small">Email Address</label>
                      <input type="email" id="modalRegEmail" class="form-control" placeholder="maya@university.edu" required />
                    </div>

                    <div class="row g-2 mb-2">
                      <div class="col-6">
                        <label class="form-label fw-semibold small">Branch</label>
                        <select id="modalRegBranch" class="form-select form-select-sm">
                          <option value="Computer Science & Engineering (CSE)">CSE</option>
                          <option value="Information Technology (IT)">IT</option>
                          <option value="Artificial Intelligence & Data Science (AIDS)">AI & DS</option>
                          <option value="Electronics & Communication (ECE)">ECE</option>
                          <option value="Electrical & Electronics (EEE)">EEE</option>
                          <option value="Mechanical Engineering (MECH)">MECH</option>
                          <option value="Civil Engineering (CIVIL)">CIVIL</option>
                        </select>
                      </div>
                      <div class="col-6">
                        <label class="form-label fw-semibold small">Goal / Exam</label>
                        <select id="modalRegGoal" class="form-select form-select-sm">
                          <option value="Campus Placements & Coding Rounds">Placements</option>
                          <option value="GATE & PSU Examinations">GATE / PSU</option>
                          <option value="Technical Interviews & FAANG">FAANG Prep</option>
                          <option value="Semester & University Exams">Semester</option>
                        </select>
                      </div>
                    </div>

                    <div class="mb-2">
                      <label class="form-label fw-semibold small">Password (min. 6 chars)</label>
                      <div class="input-group">
                        <input type="password" id="modalRegPassword" class="form-control" placeholder="Create password" minlength="6" required />
                        <button class="btn btn-outline-secondary password-toggle-btn" type="button" data-target="modalRegPassword">
                          <i class="bi bi-eye"></i>
                        </button>
                      </div>
                      <div class="progress mt-1 d-none" id="modalPasswordProgress" style="height: 4px;">
                        <div class="progress-bar" id="modalPasswordProgressBar" style="width: 0%;"></div>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="form-label fw-semibold small d-block mb-1">Select Avatar</label>
                      <div class="d-flex gap-2 justify-content-between" id="modalAvatarSelector">
                        <button type="button" class="avatar-btn active" data-av="🎓">🎓</button>
                        <button type="button" class="avatar-btn" data-av="💻">💻</button>
                        <button type="button" class="avatar-btn" data-av="⚡">⚡</button>
                        <button type="button" class="avatar-btn" data-av="🚀">🚀</button>
                        <button type="button" class="avatar-btn" data-av="🤖">🤖</button>
                      </div>
                    </div>

                    <button type="submit" id="btnModalSubmitRegister" class="btn btn-purple w-100 fw-bold py-2 shadow-sm">
                      <i class="bi bi-person-check-fill me-1"></i> Register & Sync with Atlas
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div class="modal-footer justify-content-center bg-light border-top py-2">
              <span class="small text-muted">
                <i class="bi bi-shield-lock-fill text-success me-1"></i> Passwords secured with salted PBKDF2 hashing
              </span>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modalEl);

      // Wire up modal events
      let modalChosenAvatar = "🎓";
      modalEl.querySelectorAll("#modalAvatarSelector .avatar-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          modalEl.querySelectorAll("#modalAvatarSelector .avatar-btn").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          modalChosenAvatar = btn.getAttribute("data-av") || "🎓";
        });
      });

      // Password visibility toggles
      modalEl.querySelectorAll(".password-toggle-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const targetId = btn.getAttribute("data-target");
          const input = document.getElementById(targetId);
          if (input) {
            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";
            btn.innerHTML = isPassword ? `<i class="bi bi-eye-slash"></i>` : `<i class="bi bi-eye"></i>`;
          }
        });
      });

      // Password strength live indicator
      const modalRegPassInput = document.getElementById("modalRegPassword");
      const modalProgressWrap = document.getElementById("modalPasswordProgress");
      const modalProgressBar = document.getElementById("modalPasswordProgressBar");
      modalRegPassInput?.addEventListener("input", (e) => {
        const val = e.target.value;
        if (!val) {
          modalProgressWrap?.classList.add("d-none");
          return;
        }
        modalProgressWrap?.classList.remove("d-none");
        const strength = Auth.checkPasswordStrength(val);
        if (modalProgressBar) {
          modalProgressBar.style.width = `${strength.percent}%`;
          modalProgressBar.className = `progress-bar ${strength.color}`;
        }
      });

      // Modal Sign In Form submission
      document.getElementById("modalSignInForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("modalLoginEmail").value.trim();
        const password = document.getElementById("modalLoginPassword").value;
        const alertEl = document.getElementById("modalSignInAlert");
        const btn = document.getElementById("btnModalSubmitLogin");

        alertEl.classList.add("d-none");
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Signing in...`;

        try {
          await Auth.login(email, password);
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          modalInstance?.hide();
          if (typeof showNotification === "function") {
            showNotification(`Welcome back, ${Auth.getUser()?.name}! Cloud sync active.`, "success");
          }
        } catch (err) {
          alertEl.textContent = err.message || "Failed to sign in.";
          alertEl.classList.remove("d-none");
        } finally {
          btn.disabled = false;
          btn.innerHTML = `<i class="bi bi-box-arrow-in-right me-1"></i> Sign In to EngiQuiz`;
        }
      });

      // Modal Demo Login
      document.getElementById("btnModalDemoLogin")?.addEventListener("click", async () => {
        const btn = document.getElementById("btnModalDemoLogin");
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Loading demo account...`;
        try {
          await Auth.login("student@engiquiz.edu", "demo123");
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          modalInstance?.hide();
          if (typeof showNotification === "function") {
            showNotification("Signed in as Alex Chen (Demo CSE Student)!", "success");
          }
        } catch (err) {
          const alertEl = document.getElementById("modalSignInAlert");
          alertEl.textContent = err.message || "Demo login failed.";
          alertEl.classList.remove("d-none");
        } finally {
          btn.disabled = false;
          btn.innerHTML = `<i class="bi bi-lightning-charge-fill me-1"></i> 1-Click Demo Login (Alex Chen · CSE)`;
        }
      });

      // Modal Register Form submission
      document.getElementById("modalSignUpForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("modalRegName").value.trim();
        const email = document.getElementById("modalRegEmail").value.trim();
        const password = document.getElementById("modalRegPassword").value;
        const branch = document.getElementById("modalRegBranch").value;
        const targetExam = document.getElementById("modalRegGoal").value;
        const avatar = modalChosenAvatar;
        const alertEl = document.getElementById("modalSignUpAlert");
        const btn = document.getElementById("btnModalSubmitRegister");

        alertEl.classList.add("d-none");
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Creating account...`;

        try {
          await Auth.register({ name, email, password, branch, targetExam, avatar });
          const modalInstance = bootstrap.Modal.getInstance(modalEl);
          modalInstance?.hide();
          if (typeof showNotification === "function") {
            showNotification(`Welcome to EngiQuiz, ${name}! Profile linked to MongoDB Atlas.`, "success");
          }
        } catch (err) {
          alertEl.textContent = err.message || "Registration failed.";
          alertEl.classList.remove("d-none");
        } finally {
          btn.disabled = false;
          btn.innerHTML = `<i class="bi bi-person-check-fill me-1"></i> Register & Sync with Atlas`;
        }
      });
    }

    // Switch active tab in modal
    if (typeof bootstrap !== "undefined") {
      const tabTarget = initialTab === "signup" ? "#modal-signup-tab" : "#modal-signin-tab";
      const triggerEl = modalEl.querySelector(tabTarget);
      if (triggerEl) {
        const tab = new bootstrap.Tab(triggerEl);
        tab.show();
      }

      const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
      bsModal.show();
    }
  },

  applyPersonalization() {
    const user = this.getUser();

    // Home Page Hero Personalization
    const heroTitle = document.getElementById("heroWelcomeTitle");
    const heroSubtitle = document.getElementById("heroWelcomeSubtitle");
    const heroUserBadge = document.getElementById("heroUserBadge");
    const heroAuthCta = document.getElementById("heroAuthCta");

    if (heroTitle) {
      if (user) {
        heroTitle.innerHTML = `Welcome back, <span class="text-purple">${user.name.split(" ")[0]}</span>! 🎯`;
      } else {
        heroTitle.innerHTML = `Master Engineering.<br /><span class="text-purple">One Quiz at a Time.</span>`;
      }
    }

    if (heroSubtitle) {
      if (user) {
        heroSubtitle.textContent = `Targeting: ${user.targetExam || "Exams"} · Tailored engineering quizzes for ${user.branch || "your discipline"}.`;
      } else {
        heroSubtitle.textContent = `Practice engineering concepts with randomized quizzes, adjustable difficulty and detailed performance insights.`;
      }
    }

    if (heroUserBadge) {
      if (user) {
        heroUserBadge.innerHTML = `<span class="me-1">${user.avatar || "🎓"}</span> ${user.branch} · <i class="bi bi-database-check text-success ms-1"></i> Atlas Synced`;
        heroUserBadge.classList.remove("d-none");
      } else {
        heroUserBadge.innerHTML = `<i class="bi bi-stars"></i> Unlimited Dynamic Engineering Quizzes`;
        heroUserBadge.classList.remove("d-none");
      }
    }

    if (heroAuthCta) {
      if (user) {
        heroAuthCta.innerHTML = `
          <div class="d-flex align-items-center gap-2 mt-3 pt-2">
            <span class="badge bg-purple-light text-purple px-3 py-2 fw-semibold">
              <i class="bi bi-person-check-fill me-1"></i> Logged in as ${user.name}
            </span>
            <a href="login.html" class="small text-purple text-decoration-underline fw-semibold">View Profile</a>
          </div>
        `;
      } else {
        heroAuthCta.innerHTML = `
          <div class="d-flex align-items-center gap-2 mt-3 pt-2 flex-wrap">
            <button type="button" class="btn btn-sm btn-outline-purple fw-bold" onclick="Auth.openAuthModal('signin')">
              <i class="bi bi-box-arrow-in-right me-1"></i> Sign In to Save Progress
            </button>
            <button type="button" class="btn btn-sm btn-light border fw-semibold text-muted" onclick="Auth.login('student@engiquiz.edu', 'demo123').then(() => showNotification('Demo account loaded!', 'success'))">
              <i class="bi bi-lightning-charge-fill text-warning me-1"></i> 1-Click Demo
            </button>
          </div>
        `;
      }
    }

    // Result Page personalization
    const resultUserGreeting = document.getElementById("resultUserGreeting");
    if (resultUserGreeting) {
      if (user) {
        resultUserGreeting.innerHTML = `Attempt by <strong>${user.name}</strong> (${user.branch}) · Synced to MongoDB Atlas`;
        resultUserGreeting.classList.remove("d-none");
      } else {
        resultUserGreeting.innerHTML = `Guest Session · <a href="javascript:void(0)" onclick="Auth.openAuthModal('signin')" class="text-purple text-decoration-underline">Sign in</a> to save to MongoDB Atlas`;
        resultUserGreeting.classList.remove("d-none");
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  Auth.renderNavUser();
  Auth.applyPersonalization();
});

if (typeof window !== "undefined") {
  window.Auth = Auth;
}
