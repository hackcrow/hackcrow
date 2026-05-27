const SUPABASE_URL =
  "TU_URL";

const SUPABASE_KEY =
  "TU_KEY";

const workoutClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    await loadTopbar();

    await loadHamburgerMenu();

    cargarRutinasWorkout();

  }
);

async function cargarRutinasWorkout(){

  const { data, error } =
    await workoutClient

      .from("routines")

      .select("*")

      .order("id");

  if(error){

    console.error(error);

    return;

  }

  const box =
    document.getElementById(
      "workoutRoutineList"
    );

  if(!box) return;

  box.innerHTML =
    (data || []).map(r => `

      <div
        class="workout-card"
      >

        <div class="workout-name">

          ${
            r.nombre

              ? r.nombre.charAt(0)
                  .toUpperCase()

                + r.nombre.slice(1)

              : "Sin nombre"
          }

        </div>

        <div
          class="workout-description"
        >

          ${
            r.descripcion
            || "Sin descripción"
          }

        </div>

        <div
          class="workout-footer"
        >

          <span>
            ${
              r.categoria
              || "General"
            }
          </span>

          <button
            class="btn start-workout-btn"
            data-routine-id="${r.id}"
          >

            Iniciar

          </button>

        </div>

      </div>

    `).join("");

}
