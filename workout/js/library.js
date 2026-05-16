// Archivo library.js completo (versión integrada)
let ejercicios = [];
let currentIdx = null;
let selectedImageFile = null;

const SUPABASE_URL = "https://xqcqzvcvqpwbjdsdxcan.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxY3F6dmN2cXB3Ympkc2R4Y2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NjI3OTQsImV4cCI6MjA5NDQzODc5NH0.vAwo9NS7MoiVCFikfk39YM9nBr2usyB4jMW2uYXhH98";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function cargarEjercicios() {
  const loading = document.getElementById("loadingExercises");
  if (loading) loading.style.display = "block";

  const { data, error } = await supabaseClient.from("exercises").select("*").order("id");
  if (error) {
    console.error(error);
    return;
  }

  ejercicios = data || [];
  if (loading) loading.style.display = "none";
  renderEjercicios();
}

function renderEjercicios(filtro = "todos") {
  const grid = document.getElementById("exerciseGrid");
  const lista = filtro === "todos" ? ejercicios : ejercicios.filter(e => e.filtro === filtro);

  grid.innerHTML = lista.map((e) => {
    const imagenHTML = e.imagen
      ? `<img class="card-thumb" src="${e.imagen}" alt="${e.nombre || ''}">`
      : `<div class="card-thumb no-image-box">No image</div>`;

    return `
      <div class="exercise-card" data-id="${e.id}">
        <button class="edit-btn" data-id="${e.id}" title="Editar">
          <svg viewBox="0 0 24 24" class="edit-icon"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.96 1.96 3.75 3.75 2.13-1.79z"/></svg>
        </button>
        <div class="ex-muscle">${e.musculo || ""}</div>
        <div class="ex-name-en">${e.nombre_en || e.nombre || ""}</div>
        <div class="ex-name-es">${e.nombre || ""}</div>
        ${imagenHTML}
        <div class="ex-desc">${e.descripcion || ""}</div>
      </div>
    `;
  }).join("");

  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const idx = ejercicios.findIndex(e => e.id === id);
      if (idx !== -1) openLightbox(idx);
    });
  });

  document.querySelectorAll(".exercise-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = parseInt(card.dataset.id);
      const idx = ejercicios.findIndex(e => e.id === id);
      if (idx !== -1) openViewLightbox(idx);
    });
  });
}

function openLightbox(idx) {
  currentIdx = idx;
  document.getElementById("lightboxOverlay").classList.add("open");
}

function closeLightbox() {
  document.getElementById("lightboxOverlay").classList.remove("open");
}

async function saveLightbox() {
  closeLightbox();
  await cargarEjercicios();
}

function openViewLightbox(idx) {
  currentIdx = idx;
  const ex = ejercicios[idx];
  const nombreEs = ex.nombre || "";
  const nombreEn = ex.nombre_en || "";

  document.getElementById("viewContent").innerHTML = `
    ${ex.imagen ? `<img class="detail-img" src="${ex.imagen}" alt="${nombreEs}">` : ""}
    <div class="detail-section">
      <h2 class="detail-name-en">${nombreEn || nombreEs}</h2>
      <div class="detail-name-es">${nombreEs}</div>
      <p>${ex.descripcion || ""}</p>
      <div class="detail-meta"><span class="meta-label">Tipo:</span> <span class="meta-value">${ex.tipo || "-"}</span></div>
      <div class="detail-meta"><span class="meta-label">Equipo:</span> <span class="meta-value">${ex.equipo || "-"}</span></div>
    </div>
  `;

  document.getElementById("viewOverlay").classList.add("open");
}

function closeViewLightbox() {
  document.getElementById("viewOverlay").classList.remove("open");
}

document.addEventListener("DOMContentLoaded", () => {
  cargarEjercicios();

  document.querySelectorAll(".pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      renderEjercicios(pill.dataset.filter);
    });
  });

  const lbCancel = document.getElementById("lbCancel");
  const lbSave = document.getElementById("lbSave");
  if (lbCancel) lbCancel.addEventListener("click", closeLightbox);
  if (lbSave) lbSave.addEventListener("click", saveLightbox);

  const viewClose = document.getElementById("viewClose");
  const viewEditBtn = document.getElementById("viewEditBtn");
  if (viewClose) viewClose.addEventListener("click", closeViewLightbox);
  if (viewEditBtn) viewEditBtn.addEventListener("click", () => {
    closeViewLightbox();
    openLightbox(currentIdx);
  });
});
