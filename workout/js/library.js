const SUPABASE_URL = "https://xqcqzvcvqpwbjdsdxcan.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxY3F6dmN2cXB3Ympkc2R4Y2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NjI3OTQsImV4cCI6MjA5NDQzODc5NH0.vAwo9NS7MoiVCFikfk39YM9nBr2usyB4jMW2uYXhH98";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let ejercicios = [];
let currentIdx = null;

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

async function cargarEjercicios() {
  const { data, error } = await supabaseClient
    .from("exercises")
    .select("*")
    .order("id");

  if (error) {
    console.error(error);
    return;
  }

  ejercicios = data.map(e => ({
    ...e,
    musculo: traducirMusculo(e.parte_cuerpo),
    desc: e.descripcion || "",
    filtro: mapearFiltro(e.parte_cuerpo)
  }));

  renderEjercicios();
}

function renderEjercicios(filtro = "todos") {
  const grid = document.getElementById("exerciseGrid");

  const lista = filtro === "todos"
    ? ejercicios
    : ejercicios.filter(e => e.filtro === filtro);

  grid.innerHTML = lista.map((e) => `
    <div class="exercise-card">
      <button class="edit-btn" data-id="${e.id}" title="Editar">
        ✎
      </button>

      <div class="ex-muscle">${e.musculo}</div>
      <div class="ex-name">${e.nombre}</div>
      <div class="ex-desc">${e.desc || ""}</div>
    </div>
  `).join("");

  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();

      const id = parseInt(btn.dataset.id);
      const idx = ejercicios.findIndex(e => e.id === id);

      if (idx !== -1) {
        openLightbox(idx);
      }
    });
  });
}

function openLightbox(idx) {
  currentIdx = idx;
  const ex = ejercicios[idx];

  document.getElementById("lbNombre").value = ex.nombre || "";
  document.getElementById("lbDescripcion").value = ex.descripcion || "";
  document.getElementById("lbTipo").value = ex.tipo || "";
  document.getElementById("lbEquipo").value = ex.equipo || "";
  document.getElementById("lbMusculoPrimario").value = ex.musculo_primario || "";
  document.getElementById("lbMusculoSecundario").value = ex.musculo_secundario || "";
  document.getElementById("lbParteCuerpo").value = ex.parte_cuerpo || "";
  document.getElementById("lbUnidad").value = ex.unidad || "";
  document.getElementById("lbVideo").value = ex.video_url || "";
  document.getElementById("lbImagen").value = ex.imagen || "";

  document.getElementById("lightboxOverlay").classList.add("open");
}

function closeLightbox() {
  document.getElementById("lightboxOverlay").classList.remove("open");
}

async function saveLightbox() {
  if (currentIdx === null) return;

  const ex = ejercicios[currentIdx];

  const payload = {
    nombre: document.getElementById("lbNombre").value,
    descripcion: document.getElementById("lbDescripcion").value,
    tipo: document.getElementById("lbTipo").value,
    equipo: document.getElementById("lbEquipo").value,
    musculo_primario: document.getElementById("lbMusculoPrimario").value,
    musculo_secundario: document.getElementById("lbMusculoSecundario").value,
    parte_cuerpo: document.getElementById("lbParteCuerpo").value,
    unidad: document.getElementById("lbUnidad").value,
    video_url: document.getElementById("lbVideo").value,
    imagen: document.getElementById("lbImagen").value
  };

  const { error } = await supabaseClient
    .from("exercises")
    .update(payload)
    .eq("id", ex.id);

  if (error) {
    console.error(error);
    alert("No se pudo guardar");
    return;
  }

  closeLightbox();
  cargarEjercicios();
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

  document.getElementById("lbCancel").addEventListener("click", closeLightbox);
  document.getElementById("lbSave").addEventListener("click", saveLightbox);
});
