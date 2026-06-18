const SUPABASE_URL =
  "TU_URL";

const SUPABASE_KEY =
  "TU_KEY";

const workoutClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

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
