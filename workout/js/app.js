/* Workout v7 - app.js */

/* =============================================
   STREAK DOTS
============================================= */
function renderStreak() {
  const dots = document.getElementById("streakDots");
  if (!dots) return;

  const days = 7;
  const todayIndex = new Date().getDay();

  dots.innerHTML = Array.from({ length: days }, (_, i) => {
    const cls = i < todayIndex ? "done" : i === todayIndex ? "today" : "";
    return `<div class="streak-dot ${cls}"></div>`;
  }).join("");
}

/* =============================================
   WEEK CHART
============================================= */
function renderWeekChart() {
  const chart = document.getElementById("weekChart");
  if (!chart) return;

  const labels = ["L","M","X","J","V","S","D"];
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  chart.innerHTML = labels.map((d, i) => {
    const cls = i < todayIdx ? "done" : i === todayIdx ? "today" : "";
    const h = i < todayIdx ? Math.floor(Math.random() * 30 + 20) : i === todayIdx ? 15 : 4;

    return `
      <div class="week-bar-wrap">
        <div class="week-bar ${cls}" style="height:${h}px"></div>
        <div class="week-day">${d}</div>
      </div>
    `;
  }).join("");
}

/* =============================================
   NAVIGATION
============================================= */
function navigate(page) {
  const dashboard = document.getElementById("page-dashboard");
  const biblioteca = document.getElementById("page-biblioteca");

  if (dashboard) {
    dashboard.style.display = page === "dashboard" ? "" : "none";
  }

  if (biblioteca) {
    biblioteca.className = page === "biblioteca" ? "active" : "";
  }

  document.querySelectorAll(".menu-item").forEach(el => {
    el.classList.toggle("active", el.dataset.page === page);
  });

  closeMenu();
  window.scrollTo(0, 0);
}

/* =============================================
   MENU
============================================= */
const menuBtn = document.getElementById("menuBtn");
const dropMenu = document.getElementById("dropMenu");
const overlay = document.getElementById("overlay");

function openMenu() {
  menuBtn.classList.add("open");
  dropMenu.classList.add("open");
  overlay.classList.add("active");
}

function closeMenu() {
  menuBtn.classList.remove("open");
  dropMenu.classList.remove("open");
  overlay.classList.remove("active");
}

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    dropMenu.classList.contains("open") ? closeMenu() : openMenu();
  });
}

if (overlay) {
  overlay.addEventListener("click", closeMenu);
}

document.addEventListener("click", e => {
  const el = e.target.closest("[data-page]");
  if (el && el.dataset.page) {
    navigate(el.dataset.page);
  }
});

/* =============================================
   THEME TOGGLE
============================================= */
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const html = document.documentElement;
    const current = html.getAttribute("data-theme");
    html.setAttribute("data-theme", current === "dark" ? "light" : "dark");
  });
}

/* =============================================
   INIT
============================================= */
document.addEventListener("DOMContentLoaded", () => {
  renderStreak();
  renderWeekChart();
});
