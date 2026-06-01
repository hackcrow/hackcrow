
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

document.addEventListener(
  "DOMContentLoaded",
  () => {

    cargarProgramas();

  }
);//DOMContentLoaded
