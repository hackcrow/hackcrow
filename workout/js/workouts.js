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

    console.log(
      "addWorkoutBtn:",
      addBtn
    );

    console.log(
      "wkCancel:",
      cancelBtn
    );

    addBtn?.addEventListener(
      "click",
      abrirNuevoEntrenamiento
    );

    cancelBtn?.addEventListener(
      "click",
      cerrarNuevoEntrenamiento
    );

  }
);
