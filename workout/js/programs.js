const ROUTINE_SUPABASE_URL  = "https://xqcqzvcvqpwbjdsdxcan.supabase.co";
const ROUTINE_SUPABASE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxY3F6dmN2cXB3Ympkc2R4Y2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NjI3OTQsImV4cCI6MjA5NDQzODc5NH0.vAwo9NS7MoiVCFikfk39YM9nBr2usyB4jMW2uYXhH98";

const routineClient = window.supabase.createClient(
  ROUTINE_SUPABASE_URL,
  ROUTINE_SUPABASE_KEY
);

let programas  = [];
let rutinaActualId = null;

let currentRestExerciseId = null;

let ejerciciosDisponibles = [];
let currentRestButton = null;

async function cargarProgramas(){

  const {
    data,
    error
  } = await supabaseClient

    .from("programs")

    .select("*")

    .order("id");

  if(error){

    console.error(error);

    return;

  }

  programas =
    data || [];

  renderProgramas();

}//cargarProgramas

async function renderProgramas() {
    const grid = document.getElementById("programGrid");
    if (!grid) return;
  
    if (!programas.length) {
      grid.innerHTML = `
        <div class="routine-card">
          <div class="routine-name">Sin rutinas</div>
          <div class="routine-desc">Presiona + para crear tu primera rutina.</div>
        </div>
      `;
      return;
    }
  
    const cards =
  programas.map(p => {

    console.log(
      "Programa:",
      p
    );

    return `
      <div
        class="routine-card"
        data-id="${p.id}"
      >

        <div class="routine-name">

          ${
            p.nombre

              ? p.nombre.charAt(0)
                  .toUpperCase()

                + p.nombre.slice(1)

              : "Sin nombre"
          }

        </div>

        <div class="routine-desc">

          ${
            p.descripcion ||
            "Sin descripción"
          }

        </div>

      </div>
    `;

  });
  
    grid.innerHTML = cards.join("");
  
    document
      .querySelectorAll(
        ".routine-card"
      )
      .forEach(card => {
    
        card.addEventListener(
          "click",
          () => {
    
            const id =
              parseInt(
                card.dataset.id
              );
    
            abrirDetallePrograma(
              id
            );
    
          }
        );
    
      });
}//renderProgramas()

function abrirRoutineLightbox() {
  const overlay = document.getElementById("routineLightbox");
  if (!overlay) {
    console.error("No existe #routineLightbox en HTML");
    return;
  }

  document.getElementById("rtNombre").value = "";
  document.getElementById("rtDescripcion").value = "";
  //document.getElementById("rtCategoria").value = "";

  overlay.classList.add("open");
}//abrirRoutineLightbox()

function cerrarRoutineLightbox() {
  document.getElementById("routineLightbox").classList.remove("open");
}//cerrarRoutineLightbox()

async function guardarPrograma(){

  const payload = {

    nombre:
      document
        .getElementById("rtNombre")
        .value
        .trim(),

    descripcion:
      document
        .getElementById("rtDescripcion")
        .value
        .trim()

  };

  if(!payload.nombre){

    alert(
      "Escribe un nombre"
    );

    return;

  }

  const { error } =
    await supabaseClient

      .from("programs")

      .insert([payload]);

  if(error){

    console.error(error);

    alert(
      "No se pudo guardar"
    );

    return;

  }

  cerrarRoutineLightbox();

  await cargarProgramas();

}//guardarPrograma

async function abrirDetalleRutina(id) {
    rutinaActualId = id;
  
    const rutina = rutinas.find(r => r.id === id);
    if (!rutina) return;
  
    document.getElementById(
      "viewRoutineTitle"
    ).textContent =
    
      rutina.nombre
    
        ? rutina.nombre.charAt(0)
            .toUpperCase()
    
          + rutina.nombre.slice(1)
    
        : "Sin nombre";
  
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
  
    const scrollBtn =
    document.getElementById(
      "routineScrollTop"
    );
  
  const content =
    document.getElementById(
      "viewRoutineContent"
    );
  
  if (scrollBtn && content) {
  
    content.addEventListener(
      "scroll",
      () => {
  
        scrollBtn.style.display =
  
          content.scrollTop > 250
  
            ? "block"
  
            : "none";
  
      }
    );
  
    scrollBtn.onclick = () => {
  
      content.scrollTo({
  
        top:0,
  
        behavior:"smooth"
  
      });
  
    };
  
  }
  
    await cargarEjerciciosDeRutina(id);
}//abrirDetalleRutina(id)

function cerrarDetalleRutina() {
    const overlay = document.getElementById("viewRoutineOverlay");
    const volverSelector = overlay.dataset.returnToSelector === "true";
  
    overlay.classList.remove("open");
    overlay.dataset.returnToSelector = "false";
  
    if (volverSelector) {
      const selector = document.getElementById("addExerciseOverlay");
      selector.style.visibility = "visible";
    }
}//cerrarDetalleRutina()

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
}//abrirSelectorEjercicios()

function cerrarSelectorEjercicios() {
  document.getElementById("addExerciseOverlay").classList.remove("open");
}//cerrarSelectorEjercicios()

function renderSelectorEjercicios(
  lista,
  existentes = []
) {

  const box =
    document.getElementById(
      "exercisePickerList"
    );

  box.innerHTML = lista.map(e => `

    <div class="picker-row">

      <div
        class="picker-info"
        data-id="${e.id}"
      >

        <div class="picker-name-en">
          ${e.nombre_en || ""}
        </div>

        <div class="picker-name-es">
          ${e.nombre || ""}
        </div>

      </div>

      <button
        class="picker-add-btn"
        data-id="${e.id}"

        ${existentes.includes(e.id)
          ? "disabled"
          : ""
        }

        style="
          ${
            existentes.includes(e.id)

            ? `
              opacity:0.45;
              pointer-events:none;
              color:#00ff88;
            `

            : ""
          }
        "
      >

        ${
          existentes.includes(e.id)
            ? "✓"
            : "＋"
        }

      </button>

    </div>

  `).join("");

  /* =========================
     VER DETALLE EJERCICIO
  ========================= */

  document
    .querySelectorAll(".picker-info")
    .forEach(item => {

      item.onclick = () => {

        const exId =
          parseInt(item.dataset.id);

        abrirVistaEjercicio(exId);

      };

    });

  /* =========================
     AGREGAR EJERCICIO
  ========================= */

  document
    .querySelectorAll(
      ".picker-add-btn"
    )
    .forEach(btn => {

      btn.onclick = async (ev) => {

        ev.stopPropagation();

        const exerciseId =
          parseInt(btn.dataset.id);

        if(!rutinaActualId)
          return;

        /* evita doble click */

        if(
          btn.dataset.loading === "true"
        ) return;

        btn.dataset.loading = "true";

        /* =========================
           OBTENER ÚLTIMO ORDEN
        ========================= */

        const {
          data:lastExercise
        } = await routineClient

          .from("routine_exercises")

          .select("orden")

          .eq(
            "routine_id",
            rutinaActualId
          )

          .order(
            "orden",
            { ascending:false }
          )

          .limit(1)

          .maybeSingle();

        const nuevoOrden =

          lastExercise?.orden

            ? lastExercise.orden + 1

            : 1;

        /* =========================
           INSERT EXERCISE
        ========================= */

        const {
          data:insertedExercise,
          error:errorInsert
        } = await routineClient

          .from("routine_exercises")

          .insert([
            {
              routine_id:
                rutinaActualId,

              exercise_id:
                exerciseId,

              orden:
                nuevoOrden
            }
          ])

          .select()

          .single();

        if(errorInsert){

          console.error(errorInsert);

          btn.dataset.loading =
            "false";

          alert(
            "No se pudo agregar"
          );

          return;

        }

        /* =========================
           CREAR PRIMER SET
        ========================= */

        await routineClient

          .from("routine_sets")

          .insert([
            {
              routine_exercise_id:
                insertedExercise.id,

              set_number:1,

              weight:0,

              reps:0
            }
          ]);

        /* =========================
           UPDATE UI
        ========================= */

        btn.textContent = "✓";

        btn.style.color = "#00ff88";

        btn.style.pointerEvents =
          "none";

        await abrirDetalleRutina(
          rutinaActualId
        );

        await cargarProgramas();

      };

    });

}//renderSelectorEjercicios

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
}//abrirVistaEjercicio(exId)

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
}//formatValue(value)

async function agregarEjercicioARutina(exerciseId) {
  cerrarSelectorEjercicios();
  abrirDetalleRutina(rutinaActualId);
   await cargarEjerciciosDeRutina(rutinaActualId);
   await cargarProgramas();
}//agregarEjercicioARutina(exerciseId)

function openConfirmModal({

  title = "Confirmar",
  message = "¿Seguro?",
  confirmText = "Eliminar"

}){

  return new Promise(resolve => {

    const overlay =
      document.getElementById(
        "confirmOverlay"
      );

    const titleEl =
      document.getElementById(
        "confirmTitle"
      );

    const msgEl =
      document.getElementById(
        "confirmMessage"
      );

    const okBtn =
      document.getElementById(
        "confirmOk"
      );

    const cancelBtn =
      document.getElementById(
        "confirmCancel"
      );

    titleEl.textContent =
      title;

    msgEl.textContent =
      message;

    okBtn.textContent =
      confirmText;

    overlay.classList.add(
      "open"
    );

    const close = value => {

      overlay.classList.remove(
        "open"
      );

      resolve(value);

    };

    okBtn.onclick =
      () => close(true);

    cancelBtn.onclick =
      () => close(false);

    overlay.onclick = e => {

      if(
        e.target === overlay
      ){

        close(false);

      }

    };

  });

}////openConfirmModal

async function cargarEjerciciosDeRutina(rutinaId) {

  const { data, error } = await routineClient

    .from("routine_exercises")

    .select(`
      id,
      exercise_id,
      rest_time,

      exercises (
        id,
        nombre,
        nombre_en,
        equipo
      ),

      routine_sets (
        id,
        set_number,
        weight,
        reps
      )
    `)

    .eq(
      "routine_id",
      rutinaId
    )

    .order(
      "orden",
      { ascending:true }
    );

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

        <div
          class="routine-ex-item"
          draggable="true"
          data-routine-exercise-id="${item.id}"
        >

          <!-- HEADER -->

         <div
            class="routine-ex-header clickable"
            data-accordion="${index}"
          >
          
            <div class="drag-handle">
              ≡
            </div>
          
            <div class="routine-ex-main">
          
              <div class="routine-ex-name">
                ${item.exercises?.nombre_en || ""}
              </div>
          
              <div class="routine-ex-equipment">
                ${formatValue(
                  item.exercises?.equipo
                ) || "Sin equipo"}
              </div>
          
            </div>
          
            <button
              class="delete-ex-btn delete-routine-ex-btn"
              data-routine-exercise-id="${item.id}"
            >
          
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
          
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
          
              </svg>
          
            </button>
          
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

            <!-- REST TIMER -->

            <div class="exercise-rest-timer">

              <span class="rest-label">
                Temporizador de descanso:
              </span>

              <button
                class="rest-time-btn"
                data-routine-exercise="${item.id}"
              >

                ${item.rest_time || "Apagado"}

              </button>

            </div>

            <!-- TABLE -->

            <div class="routine-sets-table-wrap">

              <table class="routine-sets-table">

                <thead>

                  <tr>

                    <th>Set</th>

                    <th>Anterior</th>

                    <th>Lbs</th>

                    <th>Reps</th>

                    <th></th>

                  </tr>

                </thead>

                <tbody
                  id="sets-body-${index}"
                >

                  ${(item.routine_sets || [])

                    .sort(
                      (a,b) =>
                        a.set_number - b.set_number
                    )

                    .map(set => `

                      <tr>

                        <td class="set-number">
                          ${set.set_number}
                        </td>

                        <td class="set-prev">
                          —
                        </td>

                        <td>

                          <input
                            type="number"
                            class="
                              set-input
                              set-weight-input
                            "
                            data-set-id="${set.id}"
                            value="${set.weight || 0}"
                            placeholder="0"
                          >

                        </td>

                        <td>

                          <input
                            type="number"
                            class="
                              set-input
                              set-reps-input
                            "
                            data-set-id="${set.id}"
                            value="${set.reps || 0}"
                            placeholder="0"
                          >

                        </td>

                        <td>

                          <button
                            class="delete-ex-btn"
                            data-set-id="${set.id}"
                          >

                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="1.8"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              width="20"
                              height="20"
                            >

                              <path d="M3 6h18" />
                              <path d="M8 6V4h8v2" />
                              <path d="M19 6l-1 14H6L5 6" />
                              <path d="M10 11v6" />
                              <path d="M14 11v6" />

                            </svg>

                          </button>

                        </td>

                      </tr>

                    `).join("")}

                </tbody>

              </table>

            </div>

            <!-- ADD SET -->

            <button
              class="add-set-btn"
              data-set="${index}"
              data-routine-exercise="${item.id}"
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
        async () => {

          const idx =
            btn.dataset.set;

          const routineExerciseId =
            btn.dataset.routineExercise;

          const tbody =
            document.getElementById(
              `sets-body-${idx}`
            );

          const setCount =
            tbody.querySelectorAll("tr")
              .length + 1;

          /* INSERT DB */

          const {
            data:newSet,
            error:errorInsert
          } = await routineClient

            .from("routine_sets")

            .insert([
              {
                routine_exercise_id:
                  routineExerciseId,

                set_number:
                  setCount,

                weight:0,

                reps:0
              }
            ])

            .select()

            .single();

          if(errorInsert){

            console.error(errorInsert);

            return;

          }

          /* UPDATE UI */

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
                  class="
                    set-input
                    set-weight-input
                  "
                  data-set-id="${newSet.id}"
                  value="0"
                  placeholder="0"
                >

              </td>

              <td>

                <input
                  type="number"
                  class="
                    set-input
                    set-reps-input
                  "
                  data-set-id="${newSet.id}"
                  value="0"
                  placeholder="0"
                >

              </td>

              <td>

                <button
                  class="delete-ex-btn"
                  data-set-id="${newSet.id}"
                >

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    width="20"
                    height="20"
                  >

                    <path d="M3 6h18" />
                    <path d="M8 6V4h8v2" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />

                  </svg>

                </button>

              </td>

            </tr>

            `
          );

          attachSetAutosave();
          attachDeleteSetEvents();

        }
      );

    });

  /* =========================
     DRAG & DROP
  ========================= */

  const draggableItems =
    document.querySelectorAll(
      ".routine-ex-item"
    );

  let draggedItem = null;

  draggableItems.forEach(item => {

    item.addEventListener(
      "dragstart",
      () => {

        draggedItem = item;

        item.classList.add(
          "dragging"
        );

      }
    );

    item.addEventListener(
      "dragend",
      async () => {

        item.classList.remove(
          "dragging"
        );

        document
          .querySelectorAll(
            ".routine-ex-item"
          )
          .forEach(el => {

            el.classList.remove(
              "drag-over"
            );

          });

        const updatedItems =
          document.querySelectorAll(
            ".routine-ex-item"
          );

        for(
          let i = 0;
          i < updatedItems.length;
          i++
        ){

          const id =
            updatedItems[i].dataset
              .routineExerciseId;

          await routineClient

            .from("routine_exercises")

            .update({
              orden:i + 1
            })

            .eq(
              "id",
              id
            );

        }

      }
    );

    item.addEventListener(
      "dragover",
      (e) => {

        e.preventDefault();

        if(
          item !== draggedItem
        ){

          item.classList.add(
            "drag-over"
          );

        }

      }
    );

    item.addEventListener(
      "dragleave",
      () => {

        item.classList.remove(
          "drag-over"
        );

      }
    );

    item.addEventListener(
      "drop",
      (e) => {

        e.preventDefault();

        item.classList.remove(
          "drag-over"
        );

        if(
          item !== draggedItem
        ){

          const container =
            item.parentNode;

          const items =
            [
              ...container.querySelectorAll(
                ".routine-ex-item"
              )
            ];

          const draggedIndex =
            items.indexOf(
              draggedItem
            );

          const targetIndex =
            items.indexOf(item);

          if(
            draggedIndex < targetIndex
          ){

            item.after(
              draggedItem
            );

          } else {

            item.before(
              draggedItem
            );

          }

        }

      }
    );

  });

  attachSetAutosave();
  attachDeleteSetEvents();
  attachDeleteRoutineExerciseEvents();
}//cargarEjerciciosDeRutina(rutinaId)

function fillRestTimerOptions(){

    const select =
      document.getElementById(
        "restTimerSelect"
      );
  
    if(!select) return;
  
    select.innerHTML = `
      <option value="Apagado">
        Apagado
      </option>
    `;
  
    for(let i = 5; i <= 150; i += 5){
  
      const min =
        Math.floor(i / 60);
  
      const sec =
        i % 60;
  
      let label = "";
  
      if(min > 0){
  
        label += `${min}min`;
  
      }
  
      if(sec > 0){
  
        label +=
          `${min > 0 ? " " : ""}${sec}s`;
  
      }
  
      select.innerHTML += `
        <option value="${label}">
          ${label}
        </option>
      `;
  
    }

}//fillRestTimerOptions()

function attachSetAutosave(){

  document
    .querySelectorAll(
      ".set-weight-input, .set-reps-input"
    )
    .forEach(input => {

      input.addEventListener(
        "change",
        async () => {

          const setId =
            input.dataset.setId;

          const row =
            input.closest("tr");

          const weight =
            row.querySelector(
              ".set-weight-input"
            ).value || 0;

          const reps =
            row.querySelector(
              ".set-reps-input"
            ).value || 0;

          const { error } =
            await routineClient

              .from("routine_sets")

              .update({
                weight,
                reps
              })

              .eq(
                "id",
                setId
              );

          if(error){

            console.error(error);

          }

        }
      );

    });

}//attachSetAutosave()

function attachDeleteSetEvents(){

  document
    .querySelectorAll(
      ".delete-ex-btn[data-set-id]"
    )
    .forEach(btn => {

      btn.onclick = async () => {

        const setId =
          btn.dataset.setId;

        const row =
          btn.closest("tr");

        if(!setId || !row)
          return;

        const { error } =
          await routineClient

            .from("routine_sets")

            .delete()

            .eq(
              "id",
              setId
            );

        if(error){

          console.error(error);

          return;

        }

        row.remove();

      };

    });

}//attachDeleteSetEvents

function attachDeleteRoutineExerciseEvents(){

  document
    .querySelectorAll(
      ".delete-routine-ex-btn"
    )
    .forEach(btn => {

      btn.onclick = async (e) => {

        e.stopPropagation();

        const confirmed =
          await openConfirmModal({
        
            title:
              "Eliminar ejercicio",
        
            message:
              "Esta acción eliminará el ejercicio y todos sus sets.",
        
            confirmText:
              "Eliminar"
        
          });
        
        if(!confirmed) return;

        const routineExerciseId =
          btn.dataset.routineExerciseId;

        const { error } =
          await routineClient

            .from("routine_exercises")

            .delete()

            .eq(
              "id",
              routineExerciseId
            );

        if(error){

          console.error(error);

          alert(
            "No se pudo eliminar"
          );

          return;

        }

        await abrirDetalleRutina(
          rutinaActualId
        );

        await cargarProgramas();

      };

    });

}//attachDeleteRoutineExerciseEvents

async function abrirDeleteRoutineOverlay(){

  const overlay =
    document.getElementById(
      "deleteRoutineOverlay"
    );

  const list =
    document.getElementById(
      "deleteRoutineList"
    );

  const { data, error } =
    await routineClient

      .from("routines")

      .select(`
        id,
        nombre,
        categoria
      `)

      .order(
        "created_at",
        { ascending:false }
      );

  if(error){

    console.error(error);

    return;

  }

  list.innerHTML =
    (data || []).map(routine => `

      <div
        class="delete-routine-row"
      >

        <div
          class="delete-routine-info"
        >

          <div
            class="delete-routine-name"
          >
          
            ${
              routine.nombre
          
                ? routine.nombre.charAt(0)
                    .toUpperCase()
          
                  + routine.nombre.slice(1)
          
                : "Sin nombre"
            }
          
          </div>

          <div
            class="delete-routine-meta"
          >

            ${routine.categoria || "Sin categoría"}

          </div>

        </div>

        <button
          class="
            delete-ex-btn
            delete-routine-final-btn
          "
          data-routine-id="${routine.id}"
        >

          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >

            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />

          </svg>

        </button>

      </div>

    `).join("");

  overlay.classList.add(
    "open"
  );

  attachDeleteRoutineFinalEvents();

}//abrirDeleteRoutineOverlay

function attachDeleteRoutineFinalEvents(){

  document
    .querySelectorAll(
      ".delete-routine-final-btn"
    )
    .forEach(btn => {

      btn.onclick = async () => {

        const routineId =
          btn.dataset.routineId;

        const confirmed =
          await openConfirmModal({

            title:
              "Eliminar rutina",

            message:
              "Esta acción eliminará todos los ejercicios y sets de la rutina.",

            confirmText:
              "Eliminar"

          });

        if(!confirmed) return;

        const { error } =
          await routineClient

            .from("routines")

            .delete()

            .eq(
              "id",
              routineId
            );

        if(error){

          console.error(error);

          return;

        }

        await cargarProgramas();

        await abrirDeleteRoutineOverlay();

      };

    });

}//attachDeleteRoutineFinalEvents

document
  .getElementById(
    "closeDeleteRoutineOverlay"
  )
  .onclick = () => {

    document
      .getElementById(
        "deleteRoutineOverlay"
      )
      .classList.remove(
        "open"
      );

  };//document

async function abrirDetallePrograma(
  programId
){

  const overlay =
    document.getElementById(
      "viewProgramOverlay"
    );

  const title =
    document.getElementById(
      "viewProgramTitle"
    );

  const list =
    document.getElementById(
      "programRoutineList"
    );

  if(
    !overlay ||
    !title ||
    !list
  ){
    return;
  }

  overlay.classList.add(
    "active"
  );

  /* =============================================
     OBTENER PROGRAMA
  ============================================= */

  const {
    data,
    error:programError
  } = await supabaseClient

    .from("programs")

    .select("*")

    .eq(
      "id",
      programId
    );

  if(programError){

    console.error(
      programError
    );

    return;

  }

  if(
    !data ||
    !data.length
  ){

    console.error(
      "Programa no encontrado"
    );

    return;

  }

  const programa =
    data[0];

  title.textContent =
    programa.nombre ||
    "Programa";

  /* =============================================
     OBTENER RUTINAS
  ============================================= */

  const {
    data:routines,
    error
  } = await supabaseClient

    .from("routines")

    .select("*")

    .eq(
      "program_id",
      programId
    )

    .order("id");

  if(error){

    console.error(error);

    return;

  }

  /* =============================================
     SIN RUTINAS
  ============================================= */

  if(
    !routines ||
    !routines.length
  ){

    list.innerHTML = `
      <div class="routine-card">

        <div class="routine-name">
          Sin rutinas
        </div>

        <div class="routine-desc">
          Agrega tu primera rutina.
        </div>

      </div>
    `;

    return;

  }

  /* =============================================
     RENDER RUTINAS
  ============================================= */

  list.innerHTML =
    routines.map(r => `

      <div
        class="routine-card"
        data-id="${r.id}"
      >

        <div class="routine-name">

          ${
            r.nombre

              ? r.nombre.charAt(0)
                  .toUpperCase()

                + r.nombre.slice(1)

              : "Sin nombre"
          }

        </div>

        <div class="routine-desc">

          ${
            r.descripcion ||
            "Sin descripción"
          }

        </div>

      </div>

    `).join("");

}//abrirDetallePrograma

document
  .getElementById(
    "viewProgramClose"
  )
  ?.addEventListener(
    "click",
    () => {

      document
        .getElementById(
          "viewProgramOverlay"
        )
        .classList.remove(
          "active"
        );

    }
  );

document.addEventListener("DOMContentLoaded", () => {

  cargarProgramas();

  const addBtn =
    document.getElementById(
      "addRoutineBtn"
    );

  const cancelBtn =
    document.getElementById(
      "rtCancel"
    );

  const saveBtn =
    document.getElementById(
      "rtSave"
    );

  if (addBtn)
    addBtn.addEventListener(
      "click",
      abrirRoutineLightbox
    );

  if (cancelBtn)
    cancelBtn.addEventListener(
      "click",
      cerrarRoutineLightbox
    );

  if (saveBtn)
    saveBtn.addEventListener(
      "click",
      guardarPrograma
    );

  const closeView =
    document.getElementById(
      "viewRoutineClose"
    );

  if (closeView)
    closeView.addEventListener(
      "click",
      cerrarDetalleRutina
    );

  const addExerciseClose =
    document.getElementById(
      "addExerciseClose"
    );

  if (addExerciseClose)
    addExerciseClose.addEventListener(
      "click",
      cerrarSelectorEjercicios
    );

  /* =========================
     DELETE ROUTINE
  ========================= */

  const deleteRoutineBtn =
    document.getElementById(
      "deleteRoutineBtn"
    );

  if(deleteRoutineBtn){

    deleteRoutineBtn.onclick =
      async () => {

        abrirDeleteRoutineOverlay();

      };

  }

});//DOMContentLoaded
