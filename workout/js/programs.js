
async function cargarProgramas() {
  console.log("cargar programas");
}//cargarProgramas()

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

function guardarPrograma(){

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

  console.log({
    nombre,
    descripcion
  });

}//guardarPrograma()

document.addEventListener(
  "DOMContentLoaded",
  () => {

    cargarProgramas();

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

  }
);//DOMContentLoaded
