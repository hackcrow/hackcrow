let programas = [];
let programaActivo = null;

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

          ${programa.nombre.charAt(0).toUpperCase() + programa.nombre.slice(1)}
        
        </div>

        <div class="program-desc">

          ${programa.descripcion}

        </div>

      </div>

    `;

  });

  document
  .querySelectorAll(".program-card")
  .forEach(card => {

    card.addEventListener("click", () => {

      const id =
        Number(
          card.dataset.id
        );

      abrirPrograma(id);

    });

  });

}//renderProgramas()

async function guardarRutina(){

  const nombre =
    document
      .getElementById(
        "rtNombre"
      )
      .value
      .trim();

  if(!nombre){

    alert(
      "Escribe un nombre"
    );

    return;

  }

  const descripcion =
    document
      .getElementById(
        "rtDescripcion"
      )
      .value
      .trim();

  const categoria =
    document
      .getElementById(
        "rtCategoria"
      )
      .value
      .trim();

  const {
    error
  } =
    await supabaseClient
      .from("routines")
      .insert([{

        nombre,
        descripcion,
        categoria,

        program_id:
          programaActivo

      }]);

  if(error){

    console.error(
      error
    );

    return;

  }

  document
    .getElementById(
      "rtNombre"
    )
    .value = "";

  document
    .getElementById(
      "rtDescripcion"
    )
    .value = "";

  document
    .getElementById(
      "rtCategoria"
    )
    .value = "";

  document
    .getElementById(
      "routineLightbox"
    )
    .classList
    .remove("open");

  abrirPrograma(
    programaActivo
  );

}//guardarRutina()

async function abrirPrograma(id){

  programaActivo = id;

  const programa =
    programas.find(
      p => p.id === id
    );

  if(!programa) return;

  document.getElementById(
    "viewProgramTitle"
  ).textContent =
    programa.nombre;

  const {
    data:routines,
    error
  } =
    await supabaseClient
      .from("routines")
      .select("*")
      .eq(
        "program_id",
        id
      );

  console.log(
    "routines:",
    routines
  );

  const list =
    document.getElementById(
      "programRoutineList"
    );

  list.innerHTML = "";

  if(
    !routines ||
    routines.length === 0
  ){

    list.innerHTML = `
      <div class="empty-state">
        No hay rutinas
      </div>
    `;

  }else{

    routines.forEach(r => {

      list.innerHTML += `

        <div
          class="routine-row"
          onclick="abrirRutina(${r.id})">

          <div>

            <div class="routine-name">
              ${r.nombre}
            </div>

            <div class="routine-category">
              ${r.categoria ?? ""}
            </div>

          </div>

          <div class="routine-arrow">
            →
          </div>

        </div>

      `;

    });

  }

  document
    .getElementById(
      "viewProgramOverlay"
    )
    .classList
    .add("open");

}//abrirPrograma

async function abrirRutina(id){

  console.log(
    "abrir rutina:",
    id
  );

}

document
  .getElementById(
    "viewProgramClose"
  )
  .addEventListener(
    "click",
    () => {

      document
        .getElementById(
          "viewProgramOverlay"
        )
        .classList
        .remove("open");

    }
  );//boton cerrar programa

/* ===========================
   NUEVA RUTINA
=========================== */

document
  .getElementById("addRoutineBtn")
  .addEventListener("click", () => {

    document
      .getElementById("routineLightbox")
      .classList
      .add("open");

  });

document
  .getElementById("rtCancel")
  .addEventListener("click", () => {

    document
      .getElementById("routineLightbox")
      .classList
      .remove("open");

  });

document
  .getElementById("rtSave")
  .addEventListener(
    "click",
    async () => {

      const nombre =
        document
          .getElementById("rtNombre")
          .value
          .trim();

      if(!nombre) return;

      const descripcion =
        document
          .getElementById("rtDescripcion")
          .value
          .trim();

      const categoria =
        document
          .getElementById("rtCategoria")
          .value
          .trim();

      const { error } =
        await supabaseClient
          .from("routines")
          .insert([{

            nombre,
            descripcion,
            categoria,
            program_id:
              programaActivo

          }]);

      if(error){

        console.error(error);

        return;

      }

      document
        .getElementById(
          "routineLightbox"
        )
        .classList
        .remove("open");

      abrirPrograma(
        programaActivo
      );

    }
  );

document.addEventListener(
  "DOMContentLoaded",
  () => {

    cargarProgramas();

    /* ===========================
       PROGRAMAS
    =========================== */

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

    /* ===========================
       RUTINAS
    =========================== */

    document
      .getElementById(
        "addRoutineBtn"
      )
      .addEventListener(
        "click",
        () => {

          document
            .getElementById(
              "routineLightbox"
            )
            .classList
            .add("open");

        }
      );

    document
      .getElementById(
        "rtCancel"
      )
      .addEventListener(
        "click",
        () => {

          document
            .getElementById(
              "routineLightbox"
            )
            .classList
            .remove("open");

        }
      );

    document
      .getElementById(
        "rtSave"
      )
      .addEventListener(
        "click",
        guardarRutina
      );

  }
);//DOMContentLoaded
