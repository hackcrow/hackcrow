
const workoutClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

console.log("workouts.js cargado");

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
    .classList
    .remove("open");

}//cerrarNuevoEntrenamiento

document
  .getElementById(
    "addWorkoutBtn"
  )
  ?.addEventListener(
    "click",
    abrirNuevoEntrenamiento
  );

document
  .getElementById(
    "wkCancel"
  )
  ?.addEventListener(
    "click",
    cerrarNuevoEntrenamiento
  );
