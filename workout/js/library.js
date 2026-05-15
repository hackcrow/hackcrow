/* workout/js/library.js — usando exercises.json */

let ejercicios = [];
let ejercicioData = [];
let currentIdx = null;

/* =============================================
   UTILIDADES
============================================= */

function mapearFiltro(parte) {
  const mapa = {
    chest: "pecho",
    back: "espalda",
    thighs: "piernas",
    glutes: "piernas",
    shoulders: "hombros",
    abdominals: "core",
    lower_back: "espalda",
    upper_arms: "brazos",
    core: "cardio",
    calves: "cardio"
  };
  return mapa[parte] || "todos";
}

function traducirMusculo(parte) {
  const mapa = {
    chest: "Pecho",
    back: "Espalda",
    thighs: "Piernas",
    glutes: "Piernas",
    shoulders: "Hombros",
    abdominals: "Core",
    lower_back: "Espalda",
    upper_arms: "Brazos",
    core: "Cardio",
    calves: "Cardio"
  };
  return mapa[parte] || parte;
}

/* =============================================
   CARGAR JSON
============================================= */

async function cargarEjercicios() {
  try {
    const response = await fetch("../data/exercises.json");

    if (!response.ok) {
      throw new Error("No se pudo cargar exercises.json");
    }

    const data = await response.json();

    ejercicios = data.map(e => ({
      ...e,
      musculo: traducirMusculo(e.parte_cuerpo),
      desc: `${e.tipo} · ${e.equipo.replaceAll("_", " ")}`,
      tags: [e.tipo, e.equipo.replaceAll("_", " ")],
      filtro: mapearFiltro(e.parte_cuerpo)
    }));

    ejercicioData = ejercicios.map(e => ({
      imagen: e.imagen || null,
      tipo: e.tipo || "",
      equipo: e.equipo || "",
      musculoPrimario: e.musculo_primario || "",
      musculoSecundario: e.musculo_secundario || "",
      parteCuerpo: e.parte_cuerpo || "",
      video: e.video_url || "",
    }));

    renderEjercicios();

  } catch (error) {
    console.error("Error cargando ejercicios:", error);
  }
}

/* =============================================
   RENDER TARJETAS
============================================= */

function renderEjercicios(filtro = "todos") {
  const grid = document.getElementById("exerciseGrid");
  if (!grid) return;

  const lista = filtro === "todos"
    ? ejercicios.map((e, i) => ({ ...e, _idx: i }))
    : ejercicios
        .map((e, i) => ({ ...e, _idx: i }))
        .filter(e => e.filtro === filtro);

  if (!lista.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>Sin ejercicios en esta categoría aún.</p>
      </div>`;
    return;
  }

  grid.innerHTML = lista.map(e => `
    <div class="exercise-card" data-idx="${e._idx}">
      <div class="ex-muscle">${e.musculo}</div>
      <div class="ex-name">${e.nombre}</div>
      <div class="ex-desc">${e.desc}</div>
      <div class="ex-tags">
        ${e.tags.map(t => `<span class="ex-tag">${t}</span>`).join("")}
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".exercise-card").forEach(card => {
    card.addEventListener("click", () => {
      openLightbox(parseInt(card.dataset.idx));
    });
  });
}

/* =============================================
   LIGHTBOX
============================================= */

const lbOverlay    = document.getElementById("lightboxOverlay");
const lbCancel     = document.getElementById("lbCancel");
const lbSave       = document.getElementById("lbSave");
const lbImageArea  = document.getElementById("lbImageArea");
const lbImageInput = document.getElementById("lbImageInput");
const lbImageEl    = document.getElementById("lbImageEl");
const lbImagePh    = document.getElementById("lbImagePlaceholder");

function openLightbox(idx) {
  currentIdx = idx;
  const ex   = ejercicios[idx];
  const data = ejercicioData[idx];

  document.getElementById("lbNombre").value            = ex.nombre;
  document.getElementById("lbTipo").value              = data.tipo;
  document.getElementById("lbEquipo").value            = data.equipo;
  document.getElementById("lbMusculoPrimario").value   = data.musculoPrimario;
  document.getElementById("lbMusculoSecundario").value = data.musculoSecundario;
  document.getElementById("lbParteCuerpo").value       = data.parteCuerpo;
  document.getElementById("lbVideo").value             = data.video;

  if (data.imagen) {
    lbImageEl.src = data.imagen;
    lbImageEl.style.display = "block";
    lbImagePh.style.display = "none";
  } else {
    lbImageEl.style.display = "none";
    lbImagePh.style.display = "flex";
  }

  lbOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lbOverlay.classList.remove("open");
  document.body.style.overflow = "";
  currentIdx = null;
}

function saveLightbox() {
  if (currentIdx === null) return;

  const nuevoNombre = document.getElementById("lbNombre").value.trim();
  if (nuevoNombre) ejercicios[currentIdx].nombre = nuevoNombre;

  ejercicioData[currentIdx] = {
    imagen: ejercicioData[currentIdx].imagen,
    tipo: document.getElementById("lbTipo").value,
    equipo: document.getElementById("lbEquipo").value,
    musculoPrimario: document.getElementById("lbMusculoPrimario").value,
    musculoSecundario: document.getElementById("lbMusculoSecundario").value,
    parteCuerpo: document.getElementById("lbParteCuerpo").value,
    video: document.getElementById("lbVideo").value,
  };

  closeLightbox();

  const activePill = document.querySelector(".pill.active");
  renderEjercicios(activePill ? activePill.dataset.filter : "todos");
}

/* =============================================
   EVENTOS
============================================= */

lbImageArea.addEventListener("click", () => lbImageInput.click());

lbImageInput.addEventListener("change", () => {
  const file = lbImageInput.files[0];
  if (!file || currentIdx === null) return;

  const reader = new FileReader();
  reader.onload = e => {
    ejercicioData[currentIdx].imagen = e.target.result;
    lbImageEl.src = e.target.result;
    lbImageEl.style.display = "block";
    lbImagePh.style.display = "none";
  };
  reader.readAsDataURL(file);
});

lbCancel.addEventListener("click", closeLightbox);
lbSave.addEventListener("click", saveLightbox);

lbOverlay.addEventListener("click", e => {
  if (e.target === lbOverlay) closeLightbox();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && lbOverlay.classList.contains("open")) {
    closeLightbox();
  }
});

/* =============================================
   INIT
============================================= */

document.addEventListener("DOMContentLoaded", () => {
  cargarEjercicios();

  document.querySelectorAll(".pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      renderEjercicios(pill.dataset.filter);
    });
  });
});
