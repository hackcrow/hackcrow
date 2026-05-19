const SUPABASE_URL = "https://xqcqzvcvqpwbjdsdxcan.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxY3F6dmN2cXB3Ympkc2R4Y2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NjI3OTQsImV4cCI6MjA5NDQzODc5NH0.vAwo9NS7MoiVCFikfk39YM9nBr2usyB4jMW2uYXhH98";


const routineClient = window.supabase.createClient(
  ROUTINE_SUPABASE_URL,
  ROUTINE_SUPABASE_KEY
);

let rutinas = [];

async function cargarRutinas() {
  const loading = document.getElementById("loadingRoutines");

  if (loading) loading.style.display = "block";

  const { data, error } = await routineClient
    .from("routines")
    .select("*")
    .order("id");

  if (error) {
    console.error(error);
    return;
  }

  rutinas = data || [];

  if (loading) loading.style.display = "none";

  renderRutinas();
}

async function renderRutinas() {
  const grid = document.getElementById("routineGrid");
  if (!grid) return;

  const cards = await Promise.all(
    rutinas.map(async (r) => {
      const { count } = await routineClient
        .from("routine_exercises")
        .select("*", { count: "exact", head: true })
        .eq("routine_id", r.id);

      return `
        <div class="routine-card" data-id="${r.id}">
          <div class="routine-name">${r.nombre}</div>
          <div class="routine-desc">${r.descripcion || "Sin descripción"}</div>

          <div class="routine-meta">
            <span>${r.categoria || "General"}</span>
            <span class="routine-count">${count || 0} ejercicios</span>
          </div>
        </div>
      `;
    })
  );

  grid.innerHTML = cards.join("");
}

document.addEventListener("DOMContentLoaded", () => {
  cargarRutinas();
});

async function guardarRutina() {
  const payload = {
    nombre: document.getElementById("rtNombre").value.trim(),
    descripcion: document.getElementById("rtDescripcion").value.trim(),
    categoria: document.getElementById("rtCategoria").value
  };

  if (!payload.nombre) return;

  const { error } = await routineClient
    .from("routines")
    .insert([payload]);

  if (error) {
    console.error(error);
    alert("No se pudo guardar");
    return;
  }

  cerrarRoutineLightbox();
  cargarRutinas();
}

function abrirRoutineLightbox() {
  document.getElementById("rtNombre").value = "";
  document.getElementById("rtDescripcion").value = "";
  document.getElementById("rtCategoria").value = "";
  document.getElementById("routineLightbox").classList.add("open");
}

function cerrarRoutineLightbox() {
  document.getElementById("routineLightbox").classList.remove("open");
}

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addRoutineBtn");
  const cancelBtn = document.getElementById("rtCancel");
  const saveBtn = document.getElementById("rtSave");

  if (addBtn) addBtn.addEventListener("click", abrirRoutineLightbox);
  if (cancelBtn) cancelBtn.addEventListener("click", cerrarRoutineLightbox);
  if (saveBtn) saveBtn.addEventListener("click", guardarRutina);
});
