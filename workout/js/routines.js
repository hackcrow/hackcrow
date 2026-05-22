const ROUTINE_SUPABASE_URL  = "https://xqcqzvcvqpwbjdsdxcan.supabase.co";
const ROUTINE_SUPABASE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxY3F6dmN2cXB3Ympkc2R4Y2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NjI3OTQsImV4cCI6MjA5NDQzODc5NH0.vAwo9NS7MoiVCFikfk39YM9nBr2usyB4jMW2uYXhH98";

const routineClient = window.supabase.createClient(
  ROUTINE_SUPABASE_URL,
  ROUTINE_SUPABASE_KEY
);

let rutinas = [];
let rutinaActualId = null;

let ejerciciosDisponibles = [];


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

async function abrirDetalleRutina(id) {
  rutinaActualId = id;

  const rutina = rutinas.find(r => r.id === id);
  if (!rutina) return;

  document.getElementById("viewRoutineTitle").textContent = rutina.nombre;

  document.getElementById("viewRoutineContent").innerHTML = `
    <p style="margin-bottom:14px;color:var(--text-muted);">
      ${rutina.descripcion || "Sin descripción"}
    </p>

    <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:18px;">
      Categoría: ${rutina.categoria || "General"}
    </div>

    <button id="addExerciseToRoutine" class="btn">
      + Agregar ejercicio
    </button>

    <div id="routineExerciseList" style="margin-top:18px;"></div>
  `;

  document.getElementById("viewRoutineOverlay").classList.add("open");

  document
    .getElementById("addExerciseToRoutine")
    .addEventListener("click", abrirSelectorEjercicios);

  await cargarEjerciciosDeRutina(id);
}

function cerrarDetalleRutina() {
  const overlay = document.getElementById("viewRoutineOverlay");
  const volverSelector = overlay.dataset.returnToSelector === "true";

  overlay.classList.remove("open");
  overlay.dataset.returnToSelector = "false";

  if (volverSelector) {
    const selector = document.getElementById("addExerciseOverlay");
    selector.style.visibility = "visible";
  }
}

async function abrirSelectorEjercicios() {
  const { data, error } = await routineClient
    .from("exercises")
    .select("id,nombre,nombre_en")
    .order("nombre");

  const { data: existentes } = await routineClient
    .from("routine_exercises")
    .select("exercise_id")
    .eq("routine_id", rutinaActualId);

  const ejerciciosExistentes = (existentes || []).map(
    e => e.exercise_id
  );

  if (error) {
    console.error(error);
    return;
  }

  ejerciciosDisponibles = data || [];

  renderSelectorEjercicios(
    ejerciciosDisponibles,
    ejerciciosExistentes
  );

  document.getElementById("addExerciseOverlay").classList.add("open");
}

function cerrarSelectorEjercicios() {
  document.getElementById("addExerciseOverlay").classList.remove("open");
}

function renderSelectorEjercicios(lista, existentes = []) {
  const box = document.getElementById("exercisePickerList");

  box.innerHTML = lista.map(e => `
    <div class="picker-row">
      <div class="picker-info" data-id="${e.id}">
        <div class="picker-name-en">${e.nombre_en || ""}</div>
        <div class="picker-name-es">${e.nombre || ""}</div>
      </div>

      <button
        class="picker-add-btn"
        data-id="${e.id}"
        ${existentes.includes(e.id) ? "disabled" : ""}
        style="
          ${existentes.includes(e.id)
            ? "opacity:0.45;pointer-events:none;color:#00ff88;"
            : ""
          }
        "
      >
        ${existentes.includes(e.id) ? "✓" : "＋"}
      </button>
    </div>
  `).join("");

  // VER DETALLE EJERCICIO
  document.querySelectorAll(".picker-info").forEach(item => {
    item.onclick = () => {
      const exId = parseInt(item.dataset.id);
      abrirVistaEjercicio(exId);
    };
  });

  // AGREGAR EJERCICIO
  document.querySelectorAll(".picker-add-btn").forEach(btn => {
    btn.onclick = async (ev) => {
      ev.stopPropagation();

      const exerciseId = parseInt(btn.dataset.id);

      if (!rutinaActualId) return;

      // evita doble click
      if (btn.dataset.loading === "true") return;
      btn.dataset.loading = "true";

      const { error } = await routineClient
        .from("routine_exercises")
        .insert([
          {
            routine_id: rutinaActualId,
            exercise_id: exerciseId
          }
        ]);

      if (error) {
        console.error(error);
        btn.dataset.loading = "false";
        alert("No se pudo agregar");
        return;
      }

      btn.textContent = "✓";
      btn.style.color = "#00ff88";
      btn.style.pointerEvents = "none";

      //cerrarSelectorEjercicios();

      await abrirDetalleRutina(rutinaActualId);
    };
  });
}

async function abrirVistaEjercicio(exId) {
  const selectorAbierto = document
    .getElementById("addExerciseOverlay")
    .classList.contains("open");

  //if (selectorAbierto) {
    //cerrarSelectorEjercicios();
  //}

  const { data, error } = await routineClient
    .from("exercises")
    .select("*")
    .eq("id", exId)
    .single();

  if (error || !data) {
    console.error(error);
    return;
  }

  const ex = data;

  document.getElementById("viewRoutineContent").innerHTML = `
    ${ex.imagen
      ? `<img class="detail-img" src="${ex.imagen}" style="width:100%;max-height:220px;object-fit:contain;border-radius:12px;margin-bottom:16px;background:#0a0a0a;">`
      : `<div class="card-thumb no-image-box">No image</div>`
    }
  
    <div class="detail-section">
      <h2 class="detail-name-en">${ex.nombre_en || ex.nombre || ""}</h2>
      <div class="detail-name-es">${ex.nombre || ""}</div>
  
      <p>${ex.descripcion || ""}</p>
  
      <div class="detail-meta"><span style="color:#e5e7eb;font-weight:600;">Tipo:</span> <span style="color:#00ff88;">${formatValue(ex.tipo)}</span></div>
<div class="detail-meta"><span style="color:#e5e7eb;font-weight:600;">Equipo:</span> <span style="color:#00ff88;">${formatValue(ex.equipo)}</span></div>
<div class="detail-meta"><span style="color:#e5e7eb;font-weight:600;">Músculo primario:</span> <span style="color:#00ff88;">${formatValue(ex.musculo_primario)}</span></div>
<div class="detail-meta"><span style="color:#e5e7eb;font-weight:600;">Músculo secundario:</span> <span style="color:#00ff88;">${formatValue(ex.musculo_secundario)}</span></div>
<div class="detail-meta"><span style="color:#e5e7eb;font-weight:600;">Parte del cuerpo:</span> <span style="color:#00ff88;">${formatValue(ex.parte_cuerpo)}</span></div>
  
      ${
        ex.video_url
          ? `<a class="detail-video" href="${ex.video_url}" target="_blank">Ver video ↗</a>`
          : ""
      }
    </div>
  `;

  document.getElementById("viewRoutineOverlay").dataset.returnToSelector =
    selectorAbierto ? "true" : "false";

  document.getElementById("addExerciseOverlay").style.visibility = "hidden";
  document.getElementById("viewRoutineOverlay").classList.add("open");
}

function formatValue(value) {
  if (!value) return "-";

  const map = {
    peso_corporal: "Peso corporal",
    peso_extra: "Peso extra",
    rueda_abdominal: "Rueda abdominal",
    upper_arms: "Brazos",
    full_body: "Cuerpo completo",
    chest: "Pecho",
    back: "Espalda",
    thighs: "Piernas",
    glutes: "Glúteos",
    shoulders: "Hombros",
    abdominals: "Abdominales",
    core: "Core",
    pectorals: "Pectorales",
    quadriceps: "Cuádriceps",
    biceps: "Bíceps",
    triceps: "Tríceps",
    hamstrings: "Isquiotibiales",
    obliques: "Oblicuos",
    fuerza: "Fuerza",
    cardio: "Cardio",
    flexibilidad: "Flexibilidad",
    movilidad: "Movilidad",
    isometrico: "Isométrico",
    pliometrico: "Pliométrico",
    resistencia: "Resistencia",
    mancuernas: "Mancuernas",
    banda: "Banda"
  };

  return map[value] || value.replaceAll("_", " ");
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
   await cargarEjerciciosDeRutina(rutinaActualId);
   await cargarRutinas();
}

async function cargarEjerciciosDeRutina(rutinaId) {

  const { data, error } = await routineClient
    .from("routine_exercises")
    .select(`
      exercise_id,
      exercises (
        id,
        nombre,
        nombre_en,
        equipo
      )
    `)
    .eq("routine_id", rutinaId);

  if (error) {

    console.error(error);

    return;

  }

  const box =
    document.getElementById(
      "routineExerciseList"
    );

  if (!box) return;

  box.innerHTML = (data || []).length

    ? data.map((item, index) => `

        <div class="routine-ex-item">

          <!-- HEADER -->

          <div
            class="routine-ex-header clickable"
            data-accordion="${index}"
          >

            <div>

              <div class="routine-ex-name">
                ${item.exercises?.nombre_en || ""}
              </div>

              <div class="routine-ex-equipment">
                ${formatValue(
                  item.exercises?.equipo
                ) || "Sin equipo"}
              </div>

            </div>

            <div class="accordion-arrow">
              ▾
            </div>

          </div>

          <!-- CONTENT -->

          <div
            class="
              routine-ex-content
              ${index === 0 ? "open" : ""}
            "
            id="accordion-${index}"
          >

            <div class="routine-sets-table-wrap">

              <table class="routine-sets-table">

                <thead>

                  <tr>

                    <th>Set</th>

                    <th>Anterior</th>

                    <th>Lbs</th>

                    <th>Reps</th>

                  </tr>

                </thead>

                <tbody
                  id="sets-body-${index}"
                >

                  <tr>

                    <td class="set-number">
                      1
                    </td>

                    <td class="set-prev">
                      —
                    </td>

                    <td>

                      <input
                        type="number"
                        class="set-input"
                        placeholder="0"
                      >

                    </td>

                    <td>

                      <input
                        type="number"
                        class="set-input"
                        placeholder="0"
                      >

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

            <!-- ADD SET -->

            <button
              class="add-set-btn"
              data-set="${index}"
            >

              + Add Set

            </button>

          </div>

        </div>

      `).join("")

    : `

      <div class="routine-empty">

        Sin ejercicios aún

      </div>

    `;

  /* =========================
     ACCORDION
  ========================= */

  document
    .querySelectorAll(".clickable")
    .forEach(header => {

      header.addEventListener(
        "click",
        () => {

          const id =
            header.dataset.accordion;

          document
            .querySelectorAll(
              ".routine-ex-content"
            )
            .forEach(el => {

              el.classList.remove("open");

            });

          document
            .getElementById(
              `accordion-${id}`
            )
            .classList.add("open");

        }
      );

    });

  /* =========================
     ADD SET
  ========================= */

  document
    .querySelectorAll(".add-set-btn")
    .forEach(btn => {

      btn.addEventListener(
        "click",
        () => {

          const idx =
            btn.dataset.set;

          const tbody =
            document.getElementById(
              `sets-body-${idx}`
            );

          const setCount =
            tbody.querySelectorAll("tr")
              .length + 1;

          tbody.insertAdjacentHTML(
            "beforeend",

            `

            <tr>

              <td class="set-number">
                ${setCount}
              </td>

              <td class="set-prev">
                —
              </td>

              <td>

                <input
                  type="number"
                  class="set-input"
                  placeholder="0"
                >

              </td>

              <td>

                <input
                  type="number"
                  class="set-input"
                  placeholder="0"
                >

              </td>

            </tr>

            `
          );

        }
      );

    });

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
