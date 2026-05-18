/* Workout — app.js */
const SUPABASE_URL = "https://xqcqzvcvqpwbjdsdxcan.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxY3F6dmN2cXB3Ympkc2R4Y2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NjI3OTQsImV4cCI6MjA5NDQzODc5NH0.vAwo9NS7MoiVCFikfk39YM9nBr2usyB4jMW2uYXhH98";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
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
  const today  = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;

  chart.innerHTML = labels.map((d, i) => {
    const cls = i < todayIdx ? "done" : i === todayIdx ? "today" : "";
    const h   = i < todayIdx ? Math.floor(Math.random() * 30 + 20) : i === todayIdx ? 15 : 4;
    return `
      <div class="week-bar-wrap">
        <div class="week-bar ${cls}" style="height:${h}px"></div>
        <div class="week-day">${d}</div>
      </div>`;
  }).join("");
}

/* =============================================
   MENU
============================================= */

const menuBtn  = document.getElementById("menuBtn");
const dropMenu = document.getElementById("dropMenu");
const overlay  = document.getElementById("overlay");

function openMenu() {
  if (menuBtn)  menuBtn.classList.add("open");
  if (dropMenu) dropMenu.classList.add("open");
  if (overlay)  overlay.classList.add("active");
}

function closeMenu() {
  if (menuBtn)  menuBtn.classList.remove("open");
  if (dropMenu) dropMenu.classList.remove("open");
  if (overlay)  overlay.classList.remove("active");
}

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    dropMenu.classList.contains("open") ? closeMenu() : openMenu();
  });
}

if (overlay) {
  overlay.addEventListener("click", closeMenu);
}

/* =============================================
   THEME TOGGLE
============================================= */

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const html    = document.documentElement;
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
   cargarContadorEjercicios();
   cargarContadorRutinas();
});

async function cargarContadorEjercicios() {
  const { count, error } = await supabaseClient
    .from("exercises")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error(error);
    return;
  }

  const el = document.getElementById("exerciseCount");
  if (el) el.textContent = count || 0;
}

async function cargarContadorRutinas() {
  const el = document.getElementById("routineCount");
  if (el) {
    el.textContent = 0;
  }
}
