let ejercicios = [];
let ejercicioData = [];
let currentIdx = null;

/* =========================
   LOCAL STORAGE
========================= */

function guardarLocal() {
  localStorage.setItem("workout_ejercicios", JSON.stringify(ejercicios));
  localStorage.setItem("workout_ejercicioData", JSON.stringify(ejercicioData));
}

function cargarLocal() {
  const ejerciciosGuardados = localStorage.getItem("workout_ejercicios");
  const dataGuardada = localStorage.getItem("workout_ejercicioData");

  if (ejerciciosGuardados) {
    ejercicios = JSON.parse(ejerciciosGuardados);
  }

  if (dataGuardada) {
    ejercicioData = JSON.parse(dataGuardada);
  }
}

/* =========================
   UTILIDADES
========================= */

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

/* =========================
   CARGAR JSON
========================= */

async function cargarEjercicios() {
  try {
    const response = await fetch("../src/exercises.json");
    const data = await response.json();

    if (!localStorage.getItem("workout_ejercicios")) {
      ejercicios = data.map(e => ({
        ...e,
        musculo: traducirMusculo(e.parte_cuerpo),
        desc: e.descripcion || "",
        tags: [e.equipo.replaceAll("_", " "), e.tipo],
        filtro: mapearFiltro(e.parte_cuerpo)
      }));

      ejercicioData = ejercicios.map(e => ({
        imagen: e.imagen || null,
        descripcion: e.descripcion || "",
        tipo: e.tipo || "",
        equipo: e.equipo || "",
        musculoPrimario: e.musculo_primario || "",
        musculoSecundario: e.musculo_secundario || "",
        parteCuerpo: e.parte_cuerpo || "",
        video: e.video_url || ""
      }));

      guardarLocal();
    }

    cargarLocal();
    renderEjercicios();

  } catch (error) {
    console.error(error);
  }
}

/* =========================
   RENDER
========================= */

function renderEjercicios(filtro = "todos") {
  const grid = document.getElementById("exerciseGrid");
  if (!grid) return;

  const lista = filtro === "todos"
    ? ejercicios.map((e, i) => ({ ...e, _idx: i }))
    : ejercicios.map((e, i) => ({ ...e, _idx: i })).filter(e => e.filtro === filtro);

  grid.innerHTML = lista.map(e => `
    <div class="exercise-card">
      <button class="edit-btn" data-idx="${e._idx}">✎</button>
      <div class="ex-muscle">${e.musculo}</div>
      <div class="ex-name">${e.nombre}</div>
      <div class="ex-desc">${e.desc}</div>
      <div class="ex-tags">
        ${e.tags.map(t => `<span class="ex-tag">${t}</span>`).join("")}
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      openLightbox(parseInt(btn.dataset.idx));
    });
  });
}

/* =========================
   LIGHTBOX
========================= */

const lbOverlay = document.getElementById("lightboxOverlay");
const lbCancel = document.getElementById("lbCancel");
const lbSave = document.getElementById("lbSave");

function openLightbox(idx) {
  currentIdx = idx;
  const ex = ejercicios[idx];
  const data = ejercicioData[idx];

  document.getElementById("lbNombre").value = ex.nombre;
  document.getElementById("lbDescripcion").value = data.descripcion;
  document.getElementById("lbTipo").value = data.tipo;
  document.getElementById("lbEquipo").value = data.equipo;
  document.getElementById("lbMusculoPrimario").value = data.musculoPrimario;
  document.getElementById("lbMusculoSecundario").value = data.musculoSecundario;
  document.getElementById("lbParteCuerpo").value = data.parteCuerpo;
  document.getElementById("lbVideo").value = data.video;

  lbOverlay.classList.add("open");
}

function closeLightbox() {
  lbOverlay.classList.remove("open");
  currentIdx = null;
}

function saveLightbox() {
  if (currentIdx === null) return;

  ejercicios[currentIdx].nombre = document.getElementById("lbNombre").value;
  ejercicios[currentIdx].desc = document.getElementById("lbDescripcion").value;

  ejercicioData[currentIdx].descripcion = document.getElementById("lbDescripcion").value;
  ejercicioData[currentIdx].tipo = document.getElementById("lbTipo").value;
  ejercicioData[currentIdx].equipo = document.getElementById("lbEquipo").value;
  ejercicioData[currentIdx].musculoPrimario = document.getElementById("lbMusculoPrimario").value;
  ejercicioData[currentIdx].musculoSecundario = document.getElementById("lbMusculoSecundario").value;
  ejercicioData[currentIdx].parteCuerpo = document.getElementById("lbParteCuerpo").value;
  ejercicioData[currentIdx].video = document.getElementById("lbVideo").value;

  guardarLocal();

  closeLightbox();

  const activePill = document.querySelector(".pill.active");
  renderEjercicios(activePill.dataset.filter);
}

lbCancel.addEventListener("click", closeLightbox);
lbSave.addEventListener("click", saveLightbox);

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
