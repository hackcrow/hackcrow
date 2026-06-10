let programas = [];
let programaActivo = null;
let rutinaActiva = null;
let ejerciciosSeleccionados = [];
let ejercicioPendienteEliminar = null;
let programToDelete = null;
let routineToDelete = null;

async function cargarProgramas(){

  const { data, error } =
    await supabaseClient
      .from("programs")
      .select("*")
      .order(
        "created_at",
        {
          ascending:false
        }
      );

  console.log(
    "program count:",
    data?.length
  );

  console.log(
    "program error:",
    error
  );

  if(error){

    console.error(error);

    return;

  }

  programas =
    data || [];

  renderProgramas();

}//cargarProgramas()

function confirmarEliminarPrograma( id, nombre ){

  programToDelete = id;

  document
    .getElementById(
      "confirmDeleteProgramText"
    )
    .textContent =
      `¿Eliminar "${nombre}"?`;

  document
    .getElementById(
      "confirmDeleteProgramOverlay"
    )
    .classList
    .add("open");

}//confirmarEliminarPrograma

function confirmarEliminarRutina(
  id,
  nombre
){

  routineToDelete = id;

  document
    .getElementById(
      "confirmDeleteRoutineText"
    )
    .textContent =
      `¿Eliminar "${nombre}"?`;

  document
    .getElementById(
      "confirmDeleteRoutineOverlay"
    )
    .classList
    .add("open");

}//confirmarEliminarRutina

async function cargarRutinasEliminar(){

  const list =
    document.getElementById(
      "deleteRoutineList"
    );

  list.innerHTML =
    "Loading...";

  const {
      data:programs,
      error
    }
    =
    await supabaseClient
      .from("programs")
      .select("*")
      .order(
        "created_at",
        {
          ascending:false
        }
      );

  if(error){

    console.error(
      error
    );

    list.innerHTML =
      "Error loading routines";

    return;

  }

  list.innerHTML = "";

  programs.forEach(
      programa => {
    
        list.innerHTML += `
    
          <div
            class="delete-routine-item">
    
            <span>
    
              ${programa.nombre}
    
            </span>
    
            <button
              class="routine-delete-btn"
              onclick="confirmarEliminarPrograma(${programa.id}, '${programa.nombre}')">
    
              🗑
    
            </button>
    
          </div>
    
        `;
    
      }
    );

}//cargarRutinasEliminar

function toggleExerciseCard(
  button
){

  const card =
    button.closest(
      ".routine-exercise-card"
    );

  const expanded =
    card.classList.contains(
      "expanded"
    );

  document
    .querySelectorAll(
      ".routine-exercise-card"
    )
    .forEach(c => {

      c.classList.remove(
        "expanded"
      );

      const btn =
        c.querySelector(
          ".exercise-expand-btn"
        );

      if(btn){

        btn.textContent =
          "▼";

      }

    });

  if(
    !expanded
  ){

    card.classList.add(
      "expanded"
    );

    button.textContent =
      "▲";

  }

}//toggleExerciseCard

function mostrarToast(
  mensaje
){

  const toast =
    document.getElementById(
      "toast"
    );

  document
    .getElementById(
      "toastMessage"
    )
    .textContent =
      mensaje;

  toast.classList.add(
    "show"
  );

  setTimeout(
    () => {

      toast.classList.remove(
        "show"
      );

    },
    2500
  );

}//mostrarToast

async function guardarSeleccionEjercicios(){

  const {
    data:actuales,
    error
  } =
    await supabaseClient
      .from("routine_exercises")
      .select("*")
      .eq(
        "routine_id",
        rutinaActiva
      );

  if(error){

    console.error(error);
    return;

  }

  const idsActuales =
    actuales.map(
      e => e.exercise_id
    );

  const eliminar =
    idsActuales.filter(
      id =>
        !ejerciciosSeleccionados.includes(
          id
        )
    );

  if(
    eliminar.length > 0
  ){

    const {
      error:deleteError
    } =
      await supabaseClient
        .from("routine_exercises")
        .delete()
        .eq(
          "routine_id",
          rutinaActiva
        )
        .in(
          "exercise_id",
          eliminar
        );

    if(deleteError){

      console.error(
        deleteError
      );

      return;

    }

  }

  const agregar =
    ejerciciosSeleccionados.filter(
      id =>
        !idsActuales.includes(
          id
        )
    );

  if(
    agregar.length > 0
  ){

    const nuevos =
      agregar.map(
        (
          exerciseId,
          index
        ) => ({

          routine_id:
            rutinaActiva,

          exercise_id:
            exerciseId,

          orden:
            idsActuales.length +
            index +
            1

        })
      );

    const {
      error:insertError
    } =
      await supabaseClient
        .from(
          "routine_exercises"
        )
        .insert(
          nuevos
        );

    if(insertError){

      console.error(
        insertError
      );

      return;

    }

  }

  document
    .getElementById(
      "exercisePickerOverlay"
    )
    .classList
    .remove("open");

  await abrirRutina(
    rutinaActiva
  );

  mostrarToast(
  "✓ Cambios guardados"
);

}//guardarSeleccionEjercicios



function abrirProgramLightbox(){

  document
    .getElementById(
      "programLightbox"
    )
    .classList.add(
      "open"
    );

}//abrirProgramLightbox()

function deleteSet(button){

  const row =
    button.closest(
      ".set-row"
    );

  row.remove();

}//deleteSet

function addSet(button){

  const card =
    button.closest(
      ".routine-exercise-card"
    );

  const rowsContainer =
    card.querySelector(
      ".set-rows"
    );

  const setNumber =
    rowsContainer.children.length + 1;

  rowsContainer.innerHTML += `

    <div class="set-row">

      <div>${setNumber}</div>

      <div>—</div>

      <div>

        <input
          type="text"
          value="0">

      </div>

      <div>

        <input
          type="text"
          value="0">

      </div>

      <div>

        <button
          class="delete-set-btn"
          onclick="deleteSet(this)">

          ✕

        </button>

      </div>

    </div>

  `;

}//addSet

function cerrarProgramLightbox(){

  document
    .getElementById(
      "programLightbox"
    )
    .classList.remove(
      "open"
    );

}//cerrarProgramLightbox()

async function guardarPrograma(){
  console.log(
  "guardarPrograma"
);
  const nombre =
    document
      .getElementById(
        "pgNombre"
      )
      .value
      .trim();

  const descripcion =
    document
      .getElementById(
        "pgDescripcion"
      )
      .value
      .trim();

  if(!nombre) return;

  const { error } =
    await supabaseClient
      .from("programs")
      .insert([
        {
          nombre,
          descripcion
        }
      ]);

  if(error){

    console.error(error);

    return;

  }

  cerrarProgramLightbox();

  cargarProgramas();

}//guardarPrograma

function renderProgramas(){

  const grid =
    document.getElementById(
      "programGrid"
    );

  if(!grid) return;

  grid.innerHTML = "";

  programas.forEach(programa => {

    grid.innerHTML += `

      <div
        class="program-card"
        data-id="${programa.id}"
      >

        <div class="program-name">

          ${programa.nombre.charAt(0).toUpperCase() + programa.nombre.slice(1)}
        
        </div>

        <div class="program-desc">

          ${programa.descripcion}

        </div>

      </div>

    `;

  });

  document
  .querySelectorAll(".program-card")
  .forEach(card => {

    card.addEventListener("click", () => {

      const id =
        Number(
          card.dataset.id
        );

      abrirPrograma(id);

    });

  });

}//renderProgramas()

async function guardarRutina(){

  const nombre =
    document
      .getElementById(
        "rtNombre"
      )
      .value
      .trim();

  if(!nombre){

    alert(
      "Escribe un nombre"
    );

    return;

  }

  const descripcion =
    document
      .getElementById(
        "rtDescripcion"
      )
      .value
      .trim();

  const categoria =
    document
      .getElementById(
        "rtCategoria"
      )
      .value
      .trim();

  const {
    error
  } =
    await supabaseClient
      .from("routines")
      .insert([{

        nombre,
        descripcion,
        categoria,

        program_id:
          programaActivo

      }]);

  if(error){

    console.error(
      error
    );

    return;

  }

  document
    .getElementById(
      "rtNombre"
    )
    .value = "";

  document
    .getElementById(
      "rtDescripcion"
    )
    .value = "";

  document
    .getElementById(
      "rtCategoria"
    )
    .value = "";

  document
    .getElementById(
      "routineLightbox"
    )
    .classList
    .remove("open");

  abrirPrograma(
    programaActivo
  );

}//guardarRutina()

async function abrirPrograma(id){

  programaActivo = id;

  const programa =
    programas.find(
      p => p.id === id
    );

  if(!programa) return;

  const nombrePrograma =
  programa.nombre
    ? programa.nombre
        .toLowerCase()
        .replace(
          /\b\w/g,
          letra =>
            letra.toUpperCase()
        )
    : "";

document.getElementById(
  "viewProgramTitle"
).textContent =
  nombrePrograma;

  const list =
    document.getElementById(
      "programRoutineList"
    );

  list.innerHTML = `

    <div class="loading-routines">

      Loading...

    </div>

  `;

  document
    .getElementById(
      "viewProgramOverlay"
    )
    .classList
    .add("open");

  const {
    data:routines,
    error
  } =
    await supabaseClient
      .from("routines")
      .select("*")
      .eq(
        "program_id",
        id
      );

  console.log(
    "routines:",
    routines
  );

  list.innerHTML = "";

  if(
    !routines ||
    routines.length === 0
  ){

    list.innerHTML = `
      <div class="empty-state">
        No hay rutinas
      </div>
    `;

  }else{

    routines.forEach(r => {

      list.innerHTML += `

        <div
          class="routine-row">

          <div
            class="routine-main"
            onclick="abrirRutina(${r.id})">

            <div>

              <div class="routine-name">

                ${
                  r.nombre
                    ? r.nombre
                        .toLowerCase()
                        .replace(
                          /\b\w/g,
                          letra => letra.toUpperCase()
                        )
                    : ""
                }
              
              </div>
              
              <div class="routine-category">
              
                ${
                  r.categoria
                    ? r.categoria
                        .toLowerCase()
                        .replace(
                          /\b\w/g,
                          letra => letra.toUpperCase()
                        )
                    : ""
                }
              
              </div>

            </div>

          </div>

          <div
            class="routine-actions">

            <button
              class="routine-delete-btn"
              onclick="
                event.stopPropagation();
                confirmarEliminarRutina(
                  ${r.id},
                  '${r.nombre}'
                );
              ">

              🗑

            </button>

            <div
              class="routine-arrow">

              →

            </div>

          </div>

        </div>

      `;

    });

  }

}//abrirPrograma

function agregarEjercicioARutina(id){

  console.log(
    "agregar ejercicio:",
    id
  );

}//agregarEjercicioARutina

async function abrirSelectorEjercicios(){

    document
      .getElementById(
        "saveExerciseSelection"
      )
      .style.display =
        "none";
  
    document
    .getElementById(
    "loadingExercisePicker"
    )
    .style.display =
    "block";
    
    document
    .getElementById(
    "exercisePickerOverlay"
    )
    .classList
    .add("open");
    
    document
    .getElementById(
    "exercisePickerList"
    )
    .innerHTML = "";
    
    const {
    data:actuales
    } =
    await supabaseClient
    .from("routine_exercises")
    .select("exercise_id")
    .eq(
    "routine_id",
    rutinaActiva
    );
    
    ejerciciosSeleccionados =
    actuales.map(
    e => e.exercise_id
    );
    
    const {
    data:ejercicios,
    error
    } =
    await supabaseClient
    .from("exercises")
    .select("*")
    .order("nombre_en");
    
    const list =
    document.getElementById(
    "exercisePickerList"
    );
    
    list.innerHTML = "";
    
    ejercicios.forEach(e => {
    
    list.innerHTML += `
    
      <div
        class="picker-exercise-row ${
          ejerciciosSeleccionados.includes(e.id)
            ? "selected"
            : ""
        }"
        onclick="toggleExerciseSelection(this, ${e.id})">
    
        <div class="picker-thumb">
    
          ${
            e.imagen
              ? `
                <img
                  src="${e.imagen}"
                  alt="${e.nombre_en}">
              `
              : ""
          }
    
        </div>
    
        <div class="picker-info">
    
          <div class="exercise-name">
    
            ${e.nombre_en}
    
          </div>
    
          <div class="exercise-muscle">
    
            ${
              e.parte_cuerpo
                ? e.parte_cuerpo
                    .replaceAll("_"," ")
                    .toLowerCase()
                    .replace(
                      /\b\w/g,
                      letra =>
                        letra.toUpperCase()
                    )
                : ""
            }
    
          </div>
    
        </div>
    
        <div class="picker-check">
    
          ✔
    
        </div>
    
      </div>
    
    `;
    
    });
    
    document
      .getElementById(
        "loadingExercisePicker"
      )
      .style.display =
        "none";
    
    document
      .getElementById(
        "saveExerciseSelection"
      )
      .style.display =
        "block";

}//abrirSelectorEjercicios


function toggleExerciseSelection(
    element,
    exerciseId
  ){
  
    element.classList.toggle(
      "selected"
    );
  
    if(
      element.classList.contains(
        "selected"
      )
    ){
  
      if(
        !ejerciciosSeleccionados.includes(
          exerciseId
        )
      ){
  
        ejerciciosSeleccionados.push(
          exerciseId
        );
  
      }
  
    }else{
  
      ejerciciosSeleccionados =
        ejerciciosSeleccionados.filter(
          id =>
            id !== exerciseId
        );
  
    }
  
    console.log(
      ejerciciosSeleccionados
    );

}//toggleExerciseSelection

async function agregarEjercicioARutina(id){

    const {
    data:actuales
    } =
    await supabaseClient
    .from("routine_exercises")
    .select("orden")
    .eq(
    "routine_id",
    rutinaActiva
    )
    .order(
    "orden",
    { ascending:false }
    )
    .limit(1);
    
    const nuevoOrden =
    actuales?.length
    ? actuales[0].orden + 1
    : 1;
    
    const {
    error
    } =
    await supabaseClient
    .from("routine_exercises")
    .insert({
    routine_id: rutinaActiva,
    exercise_id: id,
    orden: nuevoOrden
    });
    
    if(error){
    
    ```
    console.error(error);
    return;
    ```
    
    }
    
    document
    .getElementById(
    "exercisePickerOverlay"
    )
    .classList
    .remove("open");
    
    abrirRutina(
    rutinaActiva
    );

}//agregarEjercicioARutina


async function abrirRutina(id){

  rutinaActiva = id;

  const list =
    document.getElementById(
      "routineExerciseList"
    );

  document
    .getElementById(
      "routineDetailOverlay"
    )
    .classList
    .add("open");

  list.innerHTML = `

    <div class="loading-routines">

      Loading

    </div>

  `;

  const {
    data:rutina
  } =
    await supabaseClient
      .from("routines")
      .select("*")
      .eq("id", id)
      .single();

  console.log(
    "nombre rutina:",
    rutina.nombre
  );

  console.log(
    "nombre formateado:",
    rutina.nombre
      ? rutina.nombre
          .toLowerCase()
          .replace(
            /\b\w/g,
            letra =>
              letra.toUpperCase()
          )
      : ""
  );

  document
    .getElementById(
      "routineDetailTitle"
    )
    .textContent =
      rutina.nombre
        ? rutina.nombre
            .toLowerCase()
            .replace(
              /\b\w/g,
              letra =>
                letra.toUpperCase()
            )
        : "";

  const {
    data:ejercicios,
    error
  } =
    await supabaseClient
      .from("routine_exercises")
      .select(`
        *,
        exercises(*),
        routine_sets(*)
      `)
      .eq(
        "routine_id",
        id
      )
      .order(
        "orden"
      );

  console.log(
    ejercicios
  );

  console.log(
    "rutina id:",
    id
  );

  console.log(
    "ejercicios:",
    ejercicios
  );

  console.log(
    "error:",
    error
  );

  list.innerHTML = "";

  if(
    !ejercicios ||
    ejercicios.length === 0
  ){

    list.innerHTML = `
      <div class="empty-state">
        No hay ejercicios
      </div>
    `;

  }else{

    ejercicios.forEach(e => {

    let setsHtml = "";

    if(
      e.routine_sets &&
      e.routine_sets.length > 0
    ){

      e.routine_sets.forEach(
        set => {

          setsHtml += `

            <div class="set-row">

              <div>${set.set_number}</div>

                <div>
                
                  ${set.weight}x${set.reps}
                
                </div>
                
                <div>
                
                  <input
                    type="text"
                    value="${set.weight}">
                
                </div>
                
                <div>
                
                  <input
                    type="text"
                    value="${set.reps}">
                
                </div>

              <div>

                <button
                  class="delete-set-btn"
                  onclick="deleteSet(this)">

                  ✕

                </button>

              </div>

            </div>

          `;

        }
      );

    }else{

      setsHtml = `

        <div class="set-row">

          <div>1</div>

          <div>—</div>

          <div>

            <input
              type="text"
              value="0">

          </div>

          <div>

            <input
              type="text"
              value="0">

          </div>

          <div>

            <button
              class="delete-set-btn"
              onclick="deleteSet(this)">

              ✕

            </button>

          </div>

        </div>

      `;

    }

    list.innerHTML += `
  
      <div
          class="routine-exercise-card"
          data-routine-exercise-id="${e.id}"
          draggable="true">

        <div class="routine-exercise-header">
        
          <div
            class="routine-exercise-info"
            onclick="abrirDetalleEjercicio(${e.exercises.id})">
        
            <div class="exercise-drag">
        
              ☰
        
            </div>
        
            <div>
        
              <div class="exercise-name">
        
                ${e.exercises?.nombre_en ?? "No Name"}
        
              </div>
        
              <div class="exercise-muscle">
        
                ${
                  e.exercises?.parte_cuerpo
                    ? e.exercises.parte_cuerpo
                        .replaceAll("_"," ")
                        .toLowerCase()
                        .replace(
                          /\b\w/g,
                          letra =>
                            letra.toUpperCase()
                        )
                    : ""
                }
        
              </div>
        
            </div>
        
          </div>
        
          <div class="routine-exercise-actions">
        
            <button
              class="exercise-delete-btn"
              onclick="event.stopPropagation();eliminarEjercicio(${e.id}, '${e.exercises?.nombre_en ?? "Exercise"}');">
            
              🗑
            
            </button>
        
            <button
              class="exercise-expand-btn"
              onclick="event.stopPropagation();toggleExerciseCard(this);">
        
              ▼
        
            </button>
        
          </div>
        
        </div>
        
        <div class="routine-exercise-body">
        
          <div class="exercise-rest-timer">

              <label>
            
                Rest Timer
            
              </label>
            
              <select
                class="rest-time-select"
                onchange="guardarRestTime(this, ${e.id})">
            
                <option
                  value=""
                  ${!e.rest_time ? "selected" : ""}>
            
                  Off
            
                </option>
            
                <option
                  value="30"
                  ${e.rest_time == 30 ? "selected" : ""}>
            
                  30s
            
                </option>
            
                <option
                  value="60"
                  ${e.rest_time == 60 ? "selected" : ""}>
            
                  60s
            
                </option>
            
                <option
                  value="90"
                  ${e.rest_time == 90 ? "selected" : ""}>
            
                  90s
            
                </option>
            
                <option
                  value="120"
                  ${e.rest_time == 120 ? "selected" : ""}>
            
                  120s
            
                </option>
            
                <option
                  value="180"
                  ${e.rest_time == 180 ? "selected" : ""}>
            
                  180s
            
                </option>
            
              </select>
            
            </div>
        
          <div class="set-table">
        
            <div class="set-header">

              <div>Set</div>
            
              <div>Previous</div>
            
              <div>Lbs</div>
            
              <div>Reps</div>
            
              <div></div>
            
            </div>
        
            <div class="set-rows">

              ${setsHtml}

            </div>
        
          </div>
        
          <button
            class="btn btn-ghost add-set-btn"
            onclick="addSet(this)">
        
            + Add Set
        
          </button>

          <button
            class="btn btn-ghost save-sets-btn"
            onclick="guardarSets(this)">
            
            Save Sets
            
          </button>
        
        </div>
        
      </div>
  
    `;

  });

}

  activarDragDropEjercicios();

  document
    .getElementById(
      "routineDetailOverlay"
    )
    .classList
    .add("open");

}//abrirRutina

function activarDragDropEjercicios(){

  const draggableItems =
    document.querySelectorAll(
      ".routine-exercise-card"
    );

  let draggedItem =
    null;

  draggableItems.forEach(
    item => {

      item.addEventListener(
        "dragstart",
        () => {

          draggedItem =
            item;

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
              ".routine-exercise-card"
            )
            .forEach(
              el => {

                el.classList.remove(
                  "drag-over"
                );

              }
            );

          const updatedItems =
            document.querySelectorAll(
              ".routine-exercise-card"
            );

          for(
            let i = 0;
            i < updatedItems.length;
            i++
          ){

            const id =
              updatedItems[i]
                .dataset
                .routineExerciseId;

            await supabaseClient

              .from(
                "routine_exercises"
              )

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
        e => {

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
        e => {

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
                  ".routine-exercise-card"
                )
              ];

            const draggedIndex =
              items.indexOf(
                draggedItem
              );

            const targetIndex =
              items.indexOf(
                item
              );

            if(
              draggedIndex <
              targetIndex
            ){

              item.after(
                draggedItem
              );

            }else{

              item.before(
                draggedItem
              );

            }

          }

        }
      );

    }
  );

}//activarDragDropEjercicios


document
  .getElementById(
    "viewProgramClose"
  )
  .addEventListener(
    "click",
    () => {

      document
        .getElementById(
          "viewProgramOverlay"
        )
        .classList
        .remove("open");

    }
  );//boton cerrar programa

/* ===========================
   NUEVA RUTINA
=========================== */

document
  .getElementById("addRoutineBtn")
  .addEventListener("click", () => {

    document
      .getElementById("routineLightbox")
      .classList
      .add("open");

  });

document
  .getElementById("rtCancel")
  .addEventListener("click", () => {

    document
      .getElementById("routineLightbox")
      .classList
      .remove("open");

  });

document
  .getElementById("rtSave")
  .addEventListener(
    "click",
    async () => {

      const nombre =
        document
          .getElementById("rtNombre")
          .value
          .trim();

      if(!nombre) return;

      const descripcion =
        document
          .getElementById("rtDescripcion")
          .value
          .trim();

      const categoria =
        document
          .getElementById("rtCategoria")
          .value
          .trim();

      const { error } =
        await supabaseClient
          .from("routines")
          .insert([{

            nombre,
            descripcion,
            categoria,
            program_id:
              programaActivo

          }]);

      if(error){

        console.error(error);

        return;

      }

      document
        .getElementById(
          "routineLightbox"
        )
        .classList
        .remove("open");

      abrirPrograma(
        programaActivo
      );

    }
  );

async function guardarSets(button){

  const card =
    button.closest(
      ".routine-exercise-card"
    );

  const routineExerciseId =
    Number(
      card.dataset
        .routineExerciseId
    );

  const rows =
    card.querySelectorAll(
      ".set-row"
    );

  const sets = [];

  rows.forEach(
    (
      row,
      index
    ) => {

      const inputs =
        row.querySelectorAll(
          "input"
        );

      sets.push({

        routine_exercise_id:
          routineExerciseId,

        set_number:
          index + 1,

        weight:
          Number(
            inputs[0].value
          ) || 0,

        reps:
          Number(
            inputs[1].value
          ) || 0

      });

    }
  );

  const {
    error:deleteError
  } =
    await supabaseClient
      .from(
        "routine_sets"
      )
      .delete()
      .eq(
        "routine_exercise_id",
        routineExerciseId
      );

  if(deleteError){

    console.error(
      deleteError
    );

    return;

  }

  const {
    error:insertError
  } =
    await supabaseClient
      .from(
        "routine_sets"
      )
      .insert(
        sets
      );

  if(insertError){

    console.error(
      insertError
    );

    return;

  }

  mostrarToast(
    "Sets guardados"
  );

}//guardarSets

function abrirDetalleEjercicio(id){

  console.log(
  "detalle ejercicio:",
  id
  );
  
  const modal =
  document.getElementById(
  "exerciseDetailOverlay"
  );
  
  console.log(modal);
  
  modal.classList.add("open");

}//abrirDetalleEjercicio

async function eliminarEjercicio(
  routineExerciseId,
  nombreEjercicio
){

  ejercicioPendienteEliminar =
    routineExerciseId;

  document
    .querySelector(
      "#deleteExerciseOverlay .lightbox-body p"
    )
    .textContent =
      `¿Deseas eliminar "${nombreEjercicio}" de la rutina?`;

  document
    .getElementById(
      "deleteExerciseOverlay"
    )
    .classList
    .add("open");

}//eliminarEjercicio

async function guardarRestTime(
  select,
  routineExerciseId
){

  const valor =
    select.value === ""
      ? null
      : Number(
          select.value
        );

  const {
    error
  } =
    await supabaseClient
      .from(
        "routine_exercises"
      )
      .update({

        rest_time:
          valor

      })
      .eq(
        "id",
        routineExerciseId
      );

  if(error){

    console.error(
      error
    );

    mostrarToast(
      "Error"
    );

    return;

  }

  mostrarToast(
    "Rest Timer actualizado"
  );

}//guardarRestTime

document
  .getElementById(
    "deleteExerciseCancel"
  )
  .addEventListener(
    "click",
    () => {

      document
        .getElementById(
          "deleteExerciseOverlay"
        )
        .classList
        .remove("open");

      ejercicioPendienteEliminar =
        null;

    }
  );

document
  .getElementById(
    "deleteExerciseConfirm"
  )
  .addEventListener(
    "click",
    async () => {

      if(
        !ejercicioPendienteEliminar
      ){
        return;
      }

      const {
        error
      } =
        await supabaseClient
          .from(
            "routine_exercises"
          )
          .delete()
          .eq(
            "id",
            ejercicioPendienteEliminar
          );

      if(error){

        console.error(
          error
        );

        mostrarToast(
          "Error al eliminar"
        );

        return;

      }

      document
        .getElementById(
          "deleteExerciseOverlay"
        )
        .classList
        .remove("open");

      mostrarToast(
        "Ejercicio eliminado"
      );

      abrirRutina(
        rutinaActiva
      );

    }
  );//document eliminar ejercicio

document
  .getElementById(
    "deleteProgramBtn"
  )
  .addEventListener(
    "click",
    async () => {

      await cargarRutinasEliminar();

      document
        .getElementById(
          "deleteRoutineOverlay"
        )
        .classList
        .add("open");

    }
  );

document
  .getElementById(
    "deleteRoutineClose"
  )
  .addEventListener(
    "click",
    () => {

      document
        .getElementById(
          "deleteRoutineOverlay"
        )
        .classList
        .remove("open");

    }
  );

document
  .getElementById(
    "cancelDeleteProgramBtn"
  )
  .addEventListener(
    "click",
    () => {

      document
        .getElementById(
          "confirmDeleteProgramOverlay"
        )
        .classList
        .remove("open");

      programToDelete =
        null;

    }
  );

document
  .getElementById(
    "confirmDeleteProgramBtn"
  )
  .addEventListener(
    "click",
    async () => {

      if(
        !programToDelete
      ) return;

      const {
        error
      } =
        await supabaseClient
          .from("programs")
          .delete()
          .eq(
            "id",
            programToDelete
          );

      if(error){

        console.error(
          error
        );

        return;

      }

      document
        .getElementById(
          "confirmDeleteProgramOverlay"
        )
        .classList
        .remove("open");

      document
        .getElementById(
          "deleteRoutineOverlay"
        )
        .classList
        .remove("open");

      programToDelete =
        null;

      await cargarProgramas();

    }
  );

document
  .getElementById(
    "cancelDeleteRoutineBtn"
  )
  .addEventListener(
    "click",
    () => {

      document
        .getElementById(
          "confirmDeleteRoutineOverlay"
        )
        .classList
        .remove("open");

      routineToDelete =
        null;

    }
  );

document
  .getElementById(
    "confirmDeleteRoutineBtn"
  )
  .addEventListener(
    "click",
    async () => {

      if(
        !routineToDelete
      ) return;

      const {
        error
      } =
        await supabaseClient
          .from("routines")
          .delete()
          .eq(
            "id",
            routineToDelete
          );

      if(error){

        console.error(
          error
        );

        return;

      }

      document
        .getElementById(
          "confirmDeleteRoutineOverlay"
        )
        .classList
        .remove("open");

      routineToDelete =
        null;

      await abrirPrograma(
        programaActivo
      );

    }
  );

//DOMContentLoaded

document.addEventListener(
  "DOMContentLoaded",
  () => {

    cargarProgramas();

    /* ===========================
       PROGRAMAS
    =========================== */

    document
      .getElementById(
        "addProgramBtn"
      )
      .addEventListener(
        "click",
        abrirProgramLightbox
      );

    document
      .getElementById(
        "pgCancel"
      )
      .addEventListener(
        "click",
        cerrarProgramLightbox
      );

    document
      .getElementById(
        "pgSave"
      )
      .addEventListener(
        "click",
        guardarPrograma
      );

    /* ===========================
       RUTINAS
    =========================== */

    document
      .getElementById(
        "addRoutineBtn"
      )
      .addEventListener(
        "click",
        () => {

          document
            .getElementById(
              "routineLightbox"
            )
            .classList
            .add("open");

        }
      );

    document
      .getElementById(
        "rtCancel"
      )
      .addEventListener(
        "click",
        () => {

          document
            .getElementById(
              "routineLightbox"
            )
            .classList
            .remove("open");

        }
      );

    document
      .getElementById(
        "detailExerciseClose"
      )
      .addEventListener(
        "click",
        () => {
    
          document
            .getElementById(
              "exerciseDetailOverlay"
            )
            .classList
            .remove("open");
    
        }
      );

    document
      .getElementById(
        "addExerciseBtn"
      )
      .addEventListener(
        "click",
        abrirSelectorEjercicios
      );
    
    document
      .getElementById(
        "exercisePickerClose"
      )
      .addEventListener(
        "click",
        () => {
    
          document
            .getElementById(
              "exercisePickerOverlay"
            )
            .classList
            .remove("open");
    
        }
      );
    
    document
      .getElementById(
        "routineDetailClose"
      )
      .addEventListener(
        "click",
        () => {
    
          document
            .getElementById(
              "routineDetailOverlay"
            )
            .classList
            .remove("open");
    
        }
      );
    
    document
      .getElementById(
        "saveExerciseSelection"
      )
      .addEventListener(
        "click",
        guardarSeleccionEjercicios
      );
    
    document
      .getElementById(
        "rtSave"
      )
      .addEventListener(
        "click",
        guardarRutina
      );
    
    }
);//DOMContentLoaded
