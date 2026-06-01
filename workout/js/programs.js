let programas = [];

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
