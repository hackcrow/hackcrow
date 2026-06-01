let programas = [];

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

  if(!nombre) return;

  programas.push({

    id: Date.now(),

    nombre,

    descripcion

  });

  cerrarProgramLightbox();

  renderProgramas();

}//guardarPrograma()

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

          ${programa.nombre}

        </div>

        <div class="program-desc">

          ${programa.descripcion}

        </div>

      </div>

    `;

  });

}//renderProgramas()

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
