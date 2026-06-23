let currentWorkoutId = null;
let currentWorkoutName = "";

const workoutClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

function capitalizar(texto){

  if(!texto) return "";

  return texto.charAt(0).toUpperCase() +
         texto.slice(1);

}//capitalizar

function abrirNuevoEntrenamiento(){

 document
    .getElementById(
      "workoutLightbox"
    )
    .classList
    .add("open");

}//abrirNuevoEntrenamiento

function cerrarNuevoEntrenamiento(){

  document
    .getElementById(
      "workoutLightbox"
    )
    ?.classList
    .remove("open");

}//cerrarNuevoEntrenamiento

function obtenerDatosWorkout(){

  return {

    nombre:
      document
        .getElementById("wkNombre")
        .value
        .trim(),

    descripcion:
      document
        .getElementById("wkDescripcion")
        .value
        .trim()

  };

}//obtenerDatosWorkout

async function guardarWorkout(){

  const datos =
    obtenerDatosWorkout();

  if(!datos.nombre){

    alert(
      "Ingresa un nombre"
    );

    return;

  }

  const {
    error
  } = await workoutClient

    .from("workouts")

    .insert([

      {

        nombre:
          datos.nombre,

        descripcion:
          datos.descripcion

      }

    ]);

  if(error){

    console.error(error);

    alert(
      "Error al guardar"
    );

    return;

  }

  cerrarNuevoEntrenamiento();

  document
    .getElementById("wkNombre")
    .value = "";

  document
    .getElementById("wkDescripcion")
    .value = "";

  cargarWorkouts();

}//guardarWorkout

document

  .getElementById(
    "wkSave"
  )

  ?.addEventListener(

    "click",

    guardarWorkout

  );

async function cargarWorkouts(){

  const grid =
    document.getElementById(
      "workoutGrid"
    );

  grid.innerHTML = "";

  const {
    data,
    error
  } = await workoutClient

    .from("workouts")

    .select("*")

    .order(
      "created_at",
      {
        ascending:false
      }
    );

  if(error){

    console.error(error);

    return;

  }

  data.forEach(

    workout => {

      const card =
        document.createElement(
          "div"
        );

      card.className =
        "workout-card";

      card.innerHTML = `

        <div class="workout-name">

          ${capitalizar(workout.nombre)}

        </div>

        <div class="workout-description">

          ${capitalizar(workout.descripcion || "")}

        </div>

      `;

      card.addEventListener(

        "click",

        ()=>{

          currentWorkoutId =
            workout.id;

          currentWorkoutName =
            workout.nombre;

          abrirProgramas();

        }

      );

      grid.appendChild(
        card
      );

    }

  );

}//cargarWorkouts

function abrirProgramas(){

  document
    .getElementById(
      "programsTitle"
    )
    .textContent =
      capitalizar(
        currentWorkoutName
      );

  cargarProgramas();

  document
    .getElementById(
      "programsOverlay"
    )
    .classList
    .add("open");

}//abrirProgramas

function cerrarProgramas(){

  document
    .getElementById(
      "programsOverlay"
    )
    .classList
    .remove("open");

}//cerrarProgramas

async function cargarProgramas(){

  const container =
    document.getElementById(
      "programsList"
    );

  container.innerHTML = "";

  const {
    data,
    error
  } = await workoutClient

    .from("programs")

    .select("*")

    .eq(
      "workout_id",
      currentWorkoutId
    )

    .order(
      "created_at",
      {
        ascending:false
      }
    );

  if(error){

    console.error(error);

    return;

  }

  data.forEach(

    program => {

      const item =
        document.createElement(
          "div"
        );

      item.className =
        "program-item";

      item.textContent =
        capitalizar(
          program.nombre
        );

      container.appendChild(
        item
      );

    }

  );

}//cargarProgramas

function abrirNuevoPrograma(){

  document
    .getElementById(
      "programLightbox"
    )
    .classList
    .add("open");

}//abrirNuevoPrograma

function cerrarNuevoPrograma(){

  document
    .getElementById(
      "programLightbox"
    )
    .classList
    .remove("open");

}//cerrarNuevoPrograma

document.addEventListener(

  "DOMContentLoaded",

  ()=>{

    const addBtn =
      document.getElementById(
        "addWorkoutBtn"
      );

    const cancelBtn =
      document.getElementById(
        "wkCancel"
      );

    const saveBtn =
      document.getElementById(
        "wkSave"
      );

    addBtn?.addEventListener(
      "click",
      abrirNuevoEntrenamiento
    );

    cancelBtn?.addEventListener(
      "click",
      cerrarNuevoEntrenamiento
    );

    saveBtn?.addEventListener(
      "click",
      guardarWorkout
    );

    document
      .getElementById(
        "closeProgramsBtn"
      )
      ?.addEventListener(
        "click",
        cerrarProgramas
      );

    cargarWorkouts();

  }

  document
    .getElementById(
      "addProgramBtn"
    )
    ?.addEventListener(
      "click",
      abrirNuevoPrograma
    );

document
    .getElementById(
      "pgCancel"
    )
    ?.addEventListener(
      "click",
      cerrarNuevoPrograma
    );
  

);//DOMContentLoaded



