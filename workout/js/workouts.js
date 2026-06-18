
const workoutClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

console.log(
  document.getElementById("addWorkoutBtn")
);

console.log(
  "addWorkoutBtn:",
  document.getElementById("addWorkoutBtn")
);

console.log(
  "workoutLightbox:",
  document.getElementById("workoutLightbox")
);

console.log(
  "wkCancel:",
  document.getElementById("wkCancel")
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
