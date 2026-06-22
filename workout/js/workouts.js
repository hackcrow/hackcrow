const workoutClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

function abrirNuevoEntrenamiento(){

  alert("CLICK");

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

          ${workout.nombre}

        </div>

        <div class="workout-description">

          ${workout.descripcion || ""}

        </div>

      `;

      grid.appendChild(
        card
      );

    }

  );

}//cargarWorkouts

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

    cargarWorkouts();

  }
);//DOMContentLoaded
