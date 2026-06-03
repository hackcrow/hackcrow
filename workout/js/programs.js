let programas = [];
let programaActivo = null;
let rutinaActiva = null;
let ejerciciosSeleccionados = [];

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

async function guardarSeleccionEjercicios(){
   console.log(
    "ENTRO A GUARDAR"
  );


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

  const agregar =
    ejerciciosSeleccionados.filter(
      id =>
        !idsActuales.includes(
          id
        )
    );

  console.log(
    "eliminar:",
    eliminar
  );

  console.log(
    "agregar:",
    agregar
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

  document.getElementById(
    "viewProgramTitle"
  ).textContent =
    programa.nombre;

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

  const list =
    document.getElementById(
      "programRoutineList"
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
          class="routine-row"
          onclick="abrirRutina(${r.id})">

          <div>

            <div class="routine-name">
              ${r.nombre}
            </div>

            <div class="routine-category">
              ${r.categoria ?? ""}
            </div>

          </div>

          <div class="routine-arrow">
            →
          </div>

        </div>

      `;

    });

  }

  document
    .getElementById(
      "viewProgramOverlay"
    )
    .classList
    .add("open");

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
    
    const {
    data:rutina
    } =
    await supabaseClient
    .from("routines")
    .select("*")
    .eq("id", id)
    .single();
    
    document
    .getElementById(
    "routineDetailTitle"
    )
    .textContent =
    rutina.nombre;
    
    const {
    data:ejercicios,
    error
    } =
    await supabaseClient
    .from("routine_exercises")
    .select(`         *,
            exercises(*)
          `)
    .eq(
    "routine_id",
    id
    )
    .order(
    "orden"
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
    
    const list =
    document.getElementById(
    "routineExerciseList"
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
    
      list.innerHTML += `
    
        <div
            class="routine-exercise-row"
            onclick="abrirDetalleEjercicio(${e.exercises.id})">
          
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
    
      `;
    
    });
    
    }
    
    document
    .getElementById(
    "routineDetailOverlay"
    )
    .classList
    .add("open");

}//abrirRutina


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

function guardarSeleccionEjercicios(){

  console.log(
    ejerciciosSeleccionados
  );

}//guardarSeleccionEjercicios

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

    console.log(
  document.getElementById(
    "saveExerciseSelection"
  )
);

    console.log(
  document.getElementById(
    "saveExerciseSelection"
  )
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
