/* =============================================
   PROGRAMS
============================================= */

let programas = [];

/* =============================================
   LOAD PROGRAMS
============================================= */

async function cargarProgramas(){

  const loading =
    document.getElementById(
      "loadingPrograms"
    );

  if(loading){

    loading.style.display =
      "block";

  }

  const {
    data,
    error
  } = await supabaseClient

    .from("programs")

    .select("*")

    .order(
      "id",
      {
        ascending:false
      }
    );

  if(error){

    console.error(error);

    return;

  }

  programas = data || [];

  renderProgramas();

  if(loading){

    loading.style.display =
      "none";

  }

}//cargarProgramas

/* =============================================
   RENDER PROGRAMS
============================================= */

async function renderProgramas(){

  const grid =
    document.getElementById(
      "programGrid"
    );

  if(!grid) return;

  if(!programas.length){

    grid.innerHTML = `

      <div class="program-card">

        <div class="program-name">
          Sin programas
        </div>

        <div class="program-desc">
          Presiona + para crear tu primer programa.
        </div>

      </div>

    `;

    return;

  }

  const cards =
    programas.map(p => {

      return `

        <div
          class="program-card"
          data-id="${p.id}"
        >

          <div class="program-name">

            ${
              p.nombre

                ? p.nombre.charAt(0)
                    .toUpperCase()

                  + p.nombre.slice(1)

                : "Sin nombre"
            }

          </div>

          <div class="program-desc">

            ${
              p.descripcion ||
              "Sin descripción"
            }

          </div>

        </div>

      `;

    });

  grid.innerHTML =
    cards.join("");

  document
    .querySelectorAll(
      ".program-card"
    )
    .forEach(card => {

      card.addEventListener(
        "click",
        () => {

          const id =
            parseInt(
              card.dataset.id
            );

          abrirDetallePrograma(
            id
          );

        }
      );

    });

}//renderProgramas

/* =============================================
   OPEN PROGRAM LIGHTBOX
============================================= */

function abrirProgramLightbox(){

  const overlay =
    document.getElementById(
      "programLightbox"
    );

  if(!overlay) return;

  document
    .getElementById(
      "pgNombre"
    )
    .value = "";

  document
    .getElementById(
      "pgDescripcion"
    )
    .value = "";

  overlay.classList.add(
    "active"
  );

}//abrirProgramLightbox

/* =============================================
   CLOSE PROGRAM LIGHTBOX
============================================= */

function cerrarProgramLightbox(){

  document
    .getElementById(
      "programLightbox"
    )
    .classList.remove(
      "active"
    );

}//cerrarProgramLightbox

/* =============================================
   SAVE PROGRAM
============================================= */

async function guardarPrograma(){

  const payload = {

    nombre:
      document
        .getElementById(
          "pgNombre"
        )
        .value
        .trim(),

    descripcion:
      document
        .getElementById(
          "pgDescripcion"
        )
        .value
        .trim()

  };

  if(!payload.nombre){

    alert(
      "Escribe un nombre"
    );

    return;

  }

  const { error } =
    await supabaseClient

      .from("programs")

      .insert([
        payload
      ]);

  if(error){

    console.error(error);

    alert(
      "No se pudo guardar"
    );

    return;

  }

  cerrarProgramLightbox();

  await cargarProgramas();

}//guardarPrograma

/* =============================================
   OPEN PROGRAM DETAIL
============================================= */

async function abrirDetallePrograma(
  programId
){

  const overlay =
    document.getElementById(
      "viewProgramOverlay"
    );

  const title =
    document.getElementById(
      "viewProgramTitle"
    );

  const list =
    document.getElementById(
      "programRoutineList"
    );

  if(!overlay || !title || !list){

    return;

  }

  overlay.classList.add(
    "active"
  );

  const {
    data:programa,
    error:programError
  } = await supabaseClient

    .from("programs")

    .select("*")

    .eq(
      "id",
      programId
    )

    .single();

  if(programError || !programa){

    console.error(
      "Programa no encontrado"
    );

    return;

  }

  title.textContent =
    programa.nombre;

  const {
    data:routines,
    error
  } = await supabaseClient

    .from("routines")

    .select("*")

    .eq(
      "program_id",
      programId
    )

    .order("id");

  if(error){

    console.error(error);

    return;

  }

  if(!routines.length){

    list.innerHTML = `

      <div class="program-card">

        <div class="program-name">
          Sin rutinas
        </div>

        <div class="program-desc">
          Agrega tu primera rutina.
        </div>

      </div>

    `;

    return;

  }

  list.innerHTML =
    routines.map(r => `

      <div class="program-card">

        <div class="program-name">

          ${
            r.nombre

              ? r.nombre.charAt(0)
                  .toUpperCase()

                + r.nombre.slice(1)

              : "Sin nombre"
          }

        </div>

        <div class="program-desc">

          ${
            r.descripcion ||
            "Sin descripción"
          }

        </div>

      </div>

    `).join("");

}//abrirDetallePrograma

/* =============================================
   CLOSE PROGRAM DETAIL
============================================= */

function cerrarDetallePrograma(){

  document
    .getElementById(
      "viewProgramOverlay"
    )
    .classList.remove(
      "active"
    );

}//cerrarDetallePrograma

/* =============================================
   DELETE PROGRAM OVERLAY
============================================= */

function abrirDeleteProgramOverlay(){

  document
    .getElementById(
      "deleteProgramOverlay"
    )
    .classList.add(
      "active"
    );

}//abrirDeleteProgramOverlay

function cerrarDeleteProgramOverlay(){

  document
    .getElementById(
      "deleteProgramOverlay"
    )
    .classList.remove(
      "active"
    );

}//cerrarDeleteProgramOverlay

/* =============================================
   INIT
============================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    cargarProgramas();

    document
      .getElementById(
        "addProgramBtn"
      )
      ?.addEventListener(
        "click",
        abrirProgramLightbox
      );

    document
      .getElementById(
        "pgCancel"
      )
      ?.addEventListener(
        "click",
        cerrarProgramLightbox
      );

    document
      .getElementById(
        "pgSave"
      )
      ?.addEventListener(
        "click",
        guardarPrograma
      );

    document
      .getElementById(
        "viewProgramClose"
      )
      ?.addEventListener(
        "click",
        cerrarDetallePrograma
      );

    document
      .getElementById(
        "deleteProgramBtn"
      )
      ?.addEventListener(
        "click",
        abrirDeleteProgramOverlay
      );

    document
      .getElementById(
        "closeDeleteProgramOverlay"
      )
      ?.addEventListener(
        "click",
        cerrarDeleteProgramOverlay
      );

  }
);//DOMContentLoaded
