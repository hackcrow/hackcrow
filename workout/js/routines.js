const ROUTINE_SUPABASE_URL = "https://xqcqzvcvqpwbjdsdxcan.supabase.co";
const ROUTINE_SUPABASE_KEY = "TU_SUPABASE_KEY";

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
