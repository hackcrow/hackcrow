const ROUTINE_SUPABASE_URL  = "https://xqcqzvcvqpwbjdsdxcan.supabase.co";
const ROUTINE_SUPABASE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxY3F6dmN2cXB3Ympkc2R4Y2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NjI3OTQsImV4cCI6MjA5NDQzODc5NH0.vAwo9NS7MoiVCFikfk39YM9nBr2usyB4jMW2uYXhH98";

const routineClient = window.supabase.createClient(
  ROUTINE_SUPABASE_URL,
  ROUTINE_SUPABASE_KEY
);

let rutinas = [];

let ejerciciosDisponibles = [];
let rutinaActualId = null;

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

  if (!rutinas.length) {
    grid.innerHTML = `
      <div class="routine-card">
        <div class="routine-name">Sin rutinas</div>
        <div class="routine-desc">Presiona + para crear tu primera rutina.</div>
      </div>
    `;
    return;
  }

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

  document.querySelectorAll(".routine-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = parseInt(card.dataset.id);
      abrirDetalleRutina(id);
    });
  });
}

function abrirRoutineLightbox() {
  const overlay = document.getElementById("routineLightbox");
  if (!overlay) {
    console.error("No existe #routineLightbox en HTML");
    return;
  }

  document.getElementById("rtNombre").value = "";
  document.getElementById("rtDescripcion").value = "";
  document.getElementById("rtCategoria").value = "";

  overlay.classList.add("open");
}

function cerrarRoutineLightbox() {
  document.getElementById("routineLightbox").classList.remove("open");
}

async function guardarRutina() {
  const payload = {
    nombre: document.getElementById("rtNombre").value.trim(),
    descripcion: document.getElementById("rtDescripcion").value.trim(),
    categoria: document.getElementById("rtCategoria").value
  };

  if (!payload.nombre) {
    alert("Escribe un nombre");
    return;
  }

  const { error } = await routineClient
    .from("routines")
    .insert([payload]);

  if (error) {
    console.error(error);
    alert("No se pudo guardar");
    return;
  }

  cerrarRoutineLightbox();
  await cargarRutinas();
}

function abrirDetalleRutina(id) {
  rutinaActualId = id;
  
  const rutina = rutinas.find(r => r.id === id);
  if (!rutina) return;

  document.getElementById("viewRoutineTitle").textContent = rutina.nombre;

  document.getElementById("viewRoutineContent").innerHTML = `
    <p style="margin-bottom:14px;color:var(--text-muted);">
      ${rutina.descripcion || "Sin descripción"}
    </p>

    <div style="font-size:0.85rem;color:var(--text-dim);margin-bottom:18px;">
      Categoría: ${rutina.categoria || "General"}
    </div>

    <button id="addExerciseToRoutine" class="btn">+ Agregar ejercicio</button>

    <div id="routineExerciseList" style="margin-top:18px;"></div>
  `;

  document.getElementById("viewRoutineOverlay").classList.add("open");

  document.getElementById("addExerciseToRoutine")
  .addEventListener("click", abrirSelectorEjercicios);
}

function cerrarDetalleRutina() {
  document.getElementById("viewRoutineOverlay").classList.remove("open");
}

async function abrirSelectorEjercicios() {
  const { data, error } = await routineClient
    .from("exercises")
    .select("id,nombre,nombre_en")
    .order("nombre");

  if (error) {
    console.error(error);
    return;
  }

  ejerciciosDisponibles = data || [];
  renderSelectorEjercicios(ejerciciosDisponibles);

  document.getElementById("addExerciseOverlay").classList.add("open");
}

function cerrarSelectorEjercicios() {
  document.getElementById("addExerciseOverlay").classList.remove("open");
}

function renderSelectorEjercicios(lista) {
  const box = document.getElementById("exercisePickerList");

  box.innerHTML = lista.map(e => `
    <div class="picker-row" data-id="${e.id}">
      <div>
        <div style="font-size:0.85rem;color:#00ff88;">${e.nombre_en || ""}</div>
        <div style="font-size:0.78rem;color:var(--text-muted);">${e.nombre || ""}</div>
      </div>
      <button class="picker-add-btn" data-id="${e.id}">＋</button>
    </div>
  `).join("");

  document.querySelectorAll(".picker-add-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const exId = parseInt(btn.dataset.id);
      agregarEjercicioARutina(exId);
    });
  });
}

async function agregarEjercicioARutina(exerciseId) {
  const { error } = await routineClient
    .from("routine_exercises")
    .insert([{
      routine_id: rutinaActualId,
      exercise_id: exerciseId,
      orden: 1
    }]);

  if (error) {
    console.error(error);
    alert("No se pudo agregar");
    return;
  }

  cerrarSelectorEjercicios();
  abrirDetalleRutina(rutinaActualId);
}

document.addEventListener("DOMContentLoaded", () => {
  cargarRutinas();

  const addBtn = document.getElementById("addRoutineBtn");
  const cancelBtn = document.getElementById("rtCancel");
  const saveBtn = document.getElementById("rtSave");

  if (addBtn) addBtn.addEventListener("click", abrirRoutineLightbox);
  if (cancelBtn) cancelBtn.addEventListener("click", cerrarRoutineLightbox);
  if (saveBtn) saveBtn.addEventListener("click", guardarRutina);

  const closeView = document.getElementById("viewRoutineClose");
  if (closeView) closeView.addEventListener("click", cerrarDetalleRutina);

  const addExerciseClose = document.getElementById("addExerciseClose");
  if (addExerciseClose) addExerciseClose.addEventListener("click", cerrarSelectorEjercicios);
});
