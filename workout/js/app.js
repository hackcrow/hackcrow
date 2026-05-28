/* Workout — app.js */
const SUPABASE_URL = "https://xqcqzvcvqpwbjdsdxcan.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxY3F6dmN2cXB3Ympkc2R4Y2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NjI3OTQsImV4cCI6MjA5NDQzODc5NH0.vAwo9NS7MoiVCFikfk39YM9nBr2usyB4jMW2uYXhH98";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

/* =============================================
   STREAK DOTS
============================================= */

function renderStreak(){

  const dots =
    document.getElementById(
      "streakDots"
    );

  if(!dots) return;

  const days = 7;

  const todayIndex =
    new Date().getDay();

  dots.innerHTML =
    Array.from(
      { length:days },
      (_,i) => {

        const cls =
          i < todayIndex

            ? "done"

            : i === todayIndex

              ? "today"

              : "";

        return `
          <div
            class="
              streak-dot
              ${cls}
            "
          ></div>
        `;

      }
    ).join("");

}//renderStreak

/* =============================================
   WEEK CHART
============================================= */

function renderWeekChart(){

  const chart =
    document.getElementById(
      "weekChart"
    );

  if(!chart) return;

  const labels =
    ["L","M","X","J","V","S","D"];

  const today =
    new Date().getDay();

  const todayIdx =
    today === 0

      ? 6

      : today - 1;

  chart.innerHTML =
    labels.map((d,i) => {

      const cls =
        i < todayIdx

          ? "done"

          : i === todayIdx

            ? "today"

            : "";

      const h =
        i < todayIdx

          ? Math.floor(
              Math.random() * 30 + 20
            )

          : i === todayIdx

            ? 15

            : 4;

      return `
        <div class="week-bar-wrap">

          <div
            class="
              week-bar
              ${cls}
            "
            style="
              height:${h}px
            "
          ></div>

          <div class="week-day">
            ${d}
          </div>

        </div>
      `;

    }).join("");

}//renderWeekChart

/* =============================================
   THEME TOGGLE
============================================= */

document.addEventListener(
  "click",
  e => {

    if(
      e.target.closest(
        "#themeToggle"
      )
    ){

      const html =
        document.documentElement;

      const current =
        html.getAttribute(
          "data-theme"
        );

      html.setAttribute(
        "data-theme",

        current === "dark"

          ? "light"

          : "dark"
      );

    }

  }
);

/* =============================================
   HAMBURGER MENU
============================================= */

async function loadHamburgerMenu(){

  const isInsideFolder =
    window.location.pathname.includes(
      "/file/"
    );

  const path =
    isInsideFolder

      ? "../components/hamburger-menu.html"

      : "components/hamburger-menu.html";

  const response =
    await fetch(path);

  const html =
    await response.text();

  const container =
    document.getElementById(
      "menuContainer"
    );

  if(container){

    container.innerHTML =
      html;

    initHamburgerMenu();

  }

}//loadHamburgerMenu

/* =============================================
   INIT MENU
============================================= */

function initHamburgerMenu(){

  const menuBtn =
    document.getElementById(
      "menuBtn"
    );

  const dropMenu =
    document.getElementById(
      "dropMenu"
    );

  const overlay =
    document.getElementById(
      "overlay"
    );

  if(
    !menuBtn ||
    !dropMenu ||
    !overlay
  ) return;

  function openMenu(){

    menuBtn.classList.add(
      "open"
    );

    dropMenu.classList.add(
      "open"
    );

    overlay.classList.add(
      "active"
    );

  }

  function closeMenu(){

    menuBtn.classList.remove(
      "open"
    );

    dropMenu.classList.remove(
      "open"
    );

    overlay.classList.remove(
      "active"
    );

  }

  menuBtn.onclick = () => {

    dropMenu.classList.contains(
      "open"
    )

      ? closeMenu()

      : openMenu();

  };

  overlay.onclick =
    closeMenu;

}//initHamburgerMenu

/* =============================================
   TOPBAR
============================================= */

async function loadTopbar(){

  const isInsideFolder =
    window.location.pathname.includes(
      "/file/"
    );

  const path =
    isInsideFolder

      ? "../components/topbar.html"

      : "components/topbar.html";

  const response =
    await fetch(path);

  const html =
    await response.text();

  const container =
    document.getElementById(
      "topbarContainer"
    );

  if(container){

    container.innerHTML =
      html;

  }

}//loadTopbar

/* =============================================
   CONTADOR EJERCICIOS
============================================= */

async function cargarContadorEjercicios(){

  const {
    count,
    error
  } = await supabaseClient

    .from("exercises")

    .select(
      "*",
      {
        count:"exact",
        head:true
      }
    );

  console.log(
    "exercise count:",
    count
  );

  console.log(
    "exercise error:",
    error
  );

  if(error){

    console.error(error);

    return;

  }

  const el =
    document.getElementById(
      "exerciseCount"
    );

  if(el){

    el.textContent =
      count || 0;

  }

}//cargarContadorEjercicios

/* =============================================
   CONTADOR RUTINAS
============================================= */

async function cargarContadorRutinas(){

  const {
    count,
    error
  } = await supabaseClient

    .from("routines")

    .select(
      "*",
      {
        count:"exact",
        head:true
      }
    );

  console.log(
    "routine count:",
    count
  );

  console.log(
    "routine error:",
    error
  );

  if(error){

    console.error(error);

    return;

  }

  const el =
    document.getElementById(
      "routineCount"
    );

  if(el){

    el.textContent =
      count || 0;

  }

}//cargarContadorRutinas

/* =============================================
   INIT
============================================= */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    await loadTopbar();

    await loadHamburgerMenu();

    renderStreak();

    renderWeekChart();

    await cargarContadorEjercicios();

    await cargarContadorRutinas();

  }
);
