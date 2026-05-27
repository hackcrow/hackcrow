// Archivo library.js completo (versión integrada)
let ejercicios = [];
let currentIdx = null;
let selectedImageFile = null;

const LIBRARY_SUPABASE_URL = "https://xqcqzvcvqpwbjdsdxcan.supabase.co";
const LIBRARY_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxY3F6dmN2cXB3Ympkc2R4Y2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NjI3OTQsImV4cCI6MjA5NDQzODc5NH0.vAwo9NS7MoiVCFikfk39YM9nBr2usyB4jMW2uYXhH98";

const supabaseClient = window.supabase.createClient(LIBRARY_SUPABASE_URL, LIBRARY_SUPABASE_KEY);

let musclePickerTarget = null;

let secondaryMusclesSelected = [];

const MUSCLE_DATA = [

  {
    value: "esternocleidomastoideo",
    label: "Esternocleidomastoideo",
    image: "../src/muscles/01_esternocleidomastoideo.png"
  },

  {
    value: "elevador_escapula",
    label: "Elevador de la escápula",
    image: "../src/muscles/02_elevador_escapula.png"
  },

  {
    value: "pectoral_mayor_esternal",
    label: "Pectoral mayor (porción esternal)",
    image: "../src/muscles/03_pectoral_mayor_esternal.png"
  },

  {
    value: "pectoral_mayor_clavicular",
    label: "Pectoral mayor (porción clavicular)",
    image: "../src/muscles/04_pectoral_mayor_clavicular.png"
  },

  {
    value: "deltoides_anterior",
    label: "Deltoides anterior",
    image: "../src/muscles/05_deltoides_anterior.png"
  },

  {
    value: "deltoides_lateral",
    label: "Deltoides lateral",
    image: "../src/muscles/06_deltoides_lateral.png"
  },

  {
    value: "deltoides_posterior",
    label: "Deltoides posterior",
    image: "../src/muscles/07_deltoides_posterior.png"
  },

  {
    value: "trapecio_superior",
    label: "Trapecio (fibras superiores)",
    image: "../src/muscles/08_trapecio_superior.png"
  },

  {
    value: "trapecio_medio",
    label: "Trapecio (fibras medias)",
    image: "../src/muscles/09_trapecio_medio.png"
  },

  {
    value: "trapecio_inferior",
    label: "Trapecio (fibras inferiores)",
    image: "../src/muscles/10_trapecio_inferior.png"
  },

  {
    value: "infraespinoso",
    label: "Infraespinoso",
    image: "../src/muscles/11_infraespinoso.png"
  },

  {
    value: "redondo_mayor",
    label: "Redondo mayor",
    image: "../src/muscles/12_redondo_mayor.png"
  },

  {
    value: "redondo_menor",
    label: "Redondo menor",
    image: "../src/muscles/13_redondo_menor.png"
  },

  {
    value: "dorsal_ancho",
    label: "Dorsal ancho",
    image: "../src/muscles/14_dorsal_ancho.png"
  },

  {
    value: "erector_columna",
    label: "Erector de la columna",
    image: "../src/muscles/15_erector_columna.png"
  },

  {
    value: "serrato_anterior",
    label: "Serrato anterior",
    image: "../src/muscles/16_serrato_anterior.png"
  },

  {
    value: "triceps_braquial",
    label: "Tríceps braquial",
    image: "../src/muscles/17_triceps_braquial.png"
  },

  {
    value: "biceps_braquial",
    label: "Bíceps braquial",
    image: "../src/muscles/18_biceps_braquial.png"
  },

  {
    value: "braquial_anterior",
    label: "Braquial anterior",
    image: "../src/muscles/19_braquial_anterior.png"
  },

  {
    value: "braquiorradial",
    label: "Braquiorradial",
    image: "../src/muscles/20_braquiorradial.png"
  },

  {
    value: "extensores_muneca",
    label: "Extensores de la muñeca",
    image: "../src/muscles/21_extensores_muneca.png"
  },

  {
    value: "flexores_muneca",
    label: "Flexores de la muñeca",
    image: "../src/muscles/22_flexores_muneca.png"
  },

  {
    value: "recto_abdominal",
    label: "Recto abdominal",
    image: "../src/muscles/23_recto_abdominal.png"
  },

  {
    value: "transverso_abdomen",
    label: "Transverso del abdomen",
    image: "../src/muscles/24_transverso_abdomen.png"
  },

  {
    value: "oblicuos",
    label: "Oblicuos",
    image: "../src/muscles/25_oblicuos.png"
  },

  {
    value: "cuadriceps",
    label: "Cuádriceps",
    image: "../src/muscles/26_cuadriceps.png"
  },

  {
    value: "sartorio",
    label: "Sartorio",
    image: "../src/muscles/27_sartorio.png"
  },

  {
    value: "tensor_fascia_lata",
    label: "Tensor de la fascia lata",
    image: "../src/muscles/28_tensor_fascia_lata.png"
  },

  {
    value: "aductor_largo",
    label: "Aductor largo",
    image: "../src/muscles/29_aductor_largo.png"
  },

  {
    value: "pectineo",
    label: "Pectíneo",
    image: "../src/muscles/30_pectineo.png"
  },

  {
    value: "iliopsoas",
    label: "Iliopsoas",
    image: "../src/muscles/31_iliopsoas.png"
  },

  {
    value: "aductor_mayor",
    label: "Aductor mayor",
    image: "../src/muscles/32_aductor_mayor.png"
  },

  {
    value: "gluteo_mayor",
    label: "Glúteo mayor",
    image: "../src/muscles/33_gluteo_mayor.png"
  },

  {
    value: "gluteo_medio",
    label: "Glúteo medio",
    image: "../src/muscles/34_gluteo_medio.png"
  },

  {
    value: "gluteo_menor",
    label: "Glúteo menor",
    image: "../src/muscles/35_gluteo_menor.png"
  },

  {
    value: "isquiotibiales",
    label: "Isquiotibiales",
    image: "../src/muscles/36_isquiotibiales.png"
  },

  {
    value: "gracil",
    label: "Grácil",
    image: "../src/muscles/37_gracil.png"
  },

  {
    value: "gastrocnemio",
    label: "Gastrocnemio",
    image: "../src/muscles/38_gastrocnemio.png"
  },

  {
    value: "soleo",
    label: "Sóleo",
    image: "../src/muscles/39_soleo.png"
  },

  {
    value: "tibial_anterior",
    label: "Tibial anterior",
    image: "../src/muscles/40_tibial_anterior.png"
  }

];

const MUSCULOS = [
  "esternocleidomastoideo",
  "elevador_escapula",

  "pectoral_mayor_esternal",
  "pectoral_mayor_clavicular",

  "deltoides_anterior",
  "deltoides_lateral",
  "deltoides_posterior",

  "trapecio_superior",
  "trapecio_medio",
  "trapecio_inferior",

  "infraespinoso",

  "redondo_mayor",
  "redondo_menor",

  "dorsal_ancho",

  "erector_columna",

  "serrato_anterior",

  "triceps_braquial",
  "biceps_braquial",

  "braquial_anterior",
  "braquiorradial",

  "extensores_muneca",
  "flexores_muneca",

  "recto_abdominal",
  "transverso_abdomen",
  "oblicuos",

  "cuadriceps",
  "sartorio",
  "tensor_fascia_lata",

  "aductor_largo",
  "pectineo",
  "iliopsoas",
  "aductor_mayor",

  "gluteo_mayor",
  "gluteo_medio",
  "gluteo_menor",

  "isquiotibiales",

  "gracil",

  "gastrocnemio",
  "soleo",
  "tibial_anterior"
];

function formatMusculoNombre(value) {

  if (!value) return "—";

  const map = {
    pectorals: "Pectorales",
    shoulders: "Hombros",
    back: "Espalda",
    arms: "Brazos",
    legs: "Piernas",
    core: "Core",
    glutes: "Glúteos",
    cardio: "Cardio",
    triceps: "Triceps",

    esternocleidomastoideo:
      "Esternocleidomastoideo",

    elevador_escapula:
      "Elevador de la escápula",

    pectoral_mayor_esternal:
      "Pectoral mayor (esternal)",

    pectoral_mayor_clavicular:
      "Pectoral mayor (clavicular)",

    deltoides_anterior:
      "Deltoides anterior",

    deltoides_lateral:
      "Deltoides lateral",

    deltoides_posterior:
      "Deltoides posterior",

    trapecio_superior:
      "Trapecio superior",

    trapecio_medio:
      "Trapecio medio",

    trapecio_inferior:
      "Trapecio inferior",

    infraespinoso:
      "Infraespinoso",

    redondo_mayor:
      "Redondo mayor",

    redondo_menor:
      "Redondo menor",

    dorsal_ancho:
      "Dorsal ancho",

    erector_columna:
      "Erector de la columna",

    serrato_anterior:
      "Serrato anterior",

    triceps_braquial:
      "Tríceps braquial",

    biceps_braquial:
      "Bíceps braquial",

    braquial_anterior:
      "Braquial anterior",

    braquiorradial:
      "Braquiorradial",

    extensores_muneca:
      "Extensores de muñeca",

    flexores_muneca:
      "Flexores de muñeca",

    recto_abdominal:
      "Recto abdominal",

    transverso_abdomen:
      "Transverso abdominal",

    oblicuos:
      "Oblicuos",

    cuadriceps:
      "Cuádriceps",

    sartorio:
      "Sartorio",

    tensor_fascia_lata:
      "Tensor fascia lata",

    aductor_largo:
      "Aductor largo",

    pectineo:
      "Pectíneo",

    iliopsoas:
      "Iliopsoas",

    aductor_mayor:
      "Aductor mayor",

    gluteo_mayor:
      "Glúteo mayor",

    gluteo_medio:
      "Glúteo medio",

    gluteo_menor:
      "Glúteo menor",

    isquiotibiales:
      "Isquiotibiales",

    gracil:
      "Grácil",

    gastrocnemio:
      "Gastrocnemio",

    soleo:
      "Sóleo",

    tibial_anterior:
      "Tibial anterior"

  };

  return map[value] || value;

}

function abrirMusclePicker(target) {

  musclePickerTarget = target;

  const overlay =
    document.getElementById("musclePickerOverlay");

  const list =
    document.getElementById("musclePickerList");

  list.innerHTML = MUSCLE_DATA.map(m => {

    const isSelected =
      musclePickerTarget === "secundario" &&
      secondaryMusclesSelected.includes(m.value);

    return `
      <div class="muscle-item
        ${isSelected ? "selected" : ""}"

        data-value="${m.value}"
        data-label="${m.label}">

        <img
          class="muscle-thumb"
          src="${m.image}">

        <div class="muscle-name">
          ${m.label}
        </div>

        <div class="muscle-select-btn">
          ${isSelected ? "✓" : "＋"}
        </div>

      </div>
    `;

  }).join("");

  overlay.classList.add("open");

  document.querySelectorAll(".muscle-item")
    .forEach(item => {

      item.addEventListener("click", () => {

        const value = item.dataset.value;
        const label = item.dataset.label;

        // PRIMARIO
        if (musclePickerTarget === "primario") {

          document.getElementById("lbMusculoPrimarioBtn")
            .textContent = label;

          document.getElementById("lbMusculoPrimarioBtn")
            .dataset.value = value;

          cerrarMusclePicker();

          return;

        }

        // SECUNDARIO MULTI SELECT
        if (musclePickerTarget === "secundario") {

          const alreadySelected =
            secondaryMusclesSelected.includes(value);

          if (alreadySelected) {

            secondaryMusclesSelected =
              secondaryMusclesSelected.filter(v => v !== value);

          } else {

            secondaryMusclesSelected.push(value);

          }

          const secondaryBtn =
            document.getElementById("lbMusculoSecundarioBtn");

          if (secondaryMusclesSelected.length === 0) {

            secondaryBtn.textContent =
              "— Seleccionar —";

            secondaryBtn.dataset.value = "";

          } else {

            secondaryBtn.textContent =
              `${secondaryMusclesSelected.length} músculos seleccionados`;

            secondaryBtn.dataset.value =
              secondaryMusclesSelected.join(",");

          }

          // refrescar visual
          abrirMusclePicker("secundario");

        }

      });

    });

}

function cerrarMusclePicker() {

  document.getElementById("musclePickerOverlay")
    .classList.remove("open");

}

async function cargarEjercicios() {
  const loading = document.getElementById("loadingExercises");
  if (loading) loading.style.display = "block";

  const { data, error } = await supabaseClient.from("exercises").select("*").order("id");
  if (error) {
    console.error(error);
    return;
  }

  ejercicios = data || [];
  if (loading) loading.style.display = "none";
  renderEjercicios();
}

function renderEjercicios(filtro = "todos") {
  const grid = document.getElementById("exerciseGrid");
  const mapaFiltros = {
    pecho: "chest",
    espalda: "back",
    piernas: "thighs",
    hombros: "shoulders",
    core: "abdominals",
    brazos: "upper_arms",
    cardio: "cardio"
  };

const lista = filtro === "todos"
  ? ejercicios
  : ejercicios.filter(e => e.parte_cuerpo === mapaFiltros[filtro]);

  grid.innerHTML = lista.map((e) => {
    const imagenHTML = e.imagen
      ? `<img class="card-thumb" src="${e.imagen}" alt="${e.nombre || ''}">`
      : `<div class="card-thumb no-image-box">No image</div>`;

    return `
      <div class="exercise-card" data-id="${e.id}">
        <button class="edit-btn" data-id="${e.id}" title="Editar">
          <svg viewBox="0 0 24 24" class="edit-icon"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.96 1.96 3.75 3.75 2.13-1.79z"/></svg>
        </button>
        <div class="ex-muscle">${e.musculo || ""}</div>
        <div class="ex-name-en">${e.nombre_en || e.nombre || ""}</div>
        <div class="ex-name-es">${e.nombre || ""}</div>
        ${imagenHTML}
        <div class="ex-desc">${e.descripcion || ""}</div>

        <div class="card-tags">
          ${e.equipo ? `<span class="card-tag">${formatValue(e.equipo)}</span>` : ""}
          ${e.parte_cuerpo ? `<span class="card-tag">${formatValue(e.parte_cuerpo)}</span>` : ""}
        </div>
        
      </div>
    `;
  }).join("");

  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const idx = ejercicios.findIndex(e => e.id === id);
      if (idx !== -1) openLightbox(idx);
    });
  });

  document.querySelectorAll(".exercise-card").forEach(card => {
    card.addEventListener("click", () => {
      const id = parseInt(card.dataset.id);
      const idx = ejercicios.findIndex(e => e.id === id);
      if (idx !== -1) openViewLightbox(idx);
    });
  });
}

function formatEquipo(value) {

  if (!value) return "—";

  const map = {

    peso_corporal: "Peso corporal",
    mancuernas: "Mancuernas",
    barra: "Barra",
    barra_z: "Barra Z",
    peso_extra: "Peso extra",
    banda: "Banda",
    rueda_abdominal: "Rueda abdominal"

  };

  return map[value] || value;

}

function openLightbox(idx) {

  currentIdx = idx;

  const ex = ejercicios[idx];

  document.getElementById("lbTitle").textContent =
    "Editar ejercicio";

  document.getElementById("lbNombreEn").value =
    ex.nombre_en || "";

  document.getElementById("lbNombre").value =
    ex.nombre || "";

  document.getElementById("lbDescripcion").value =
    ex.descripcion || "";

  document.getElementById("lbTipo").value =
    ex.tipo || "";

  document.getElementById("lbEquipo").value =
    ex.equipo || "";

  document.getElementById("lbParteCuerpo").value =
    ex.parte_cuerpo || "";

  document.getElementById("lbTipoRegistro").value =
    ex.tipo_registro || "";

  document.getElementById("lbVideo").value =
    ex.video_url || "";

  // MUSCULO PRIMARIO
  document.getElementById("lbMusculoPrimarioBtn")
    .textContent =
      ex.musculo_primario
        ? formatMusculoNombre(ex.musculo_primario)
        : "— Seleccionar —";

  document.getElementById("lbMusculoPrimarioBtn")
    .dataset.value =
      ex.musculo_primario || "";

  // MUSCULOS SECUNDARIOS
  secondaryMusclesSelected =
    ex.musculo_secundario
      ? ex.musculo_secundario.split(",")
      : [];

  const secondaryBtn =
    document.getElementById("lbMusculoSecundarioBtn");

  if (secondaryMusclesSelected.length === 0) {

    secondaryBtn.textContent =
      "— Seleccionar —";

    secondaryBtn.dataset.value = "";

  } else {

    secondaryBtn.textContent =
      `${secondaryMusclesSelected.length} músculos seleccionados`;

    secondaryBtn.dataset.value =
      secondaryMusclesSelected.join(",");

  }

  // IMAGEN
  if (ex.imagen) {

    document.getElementById("lbImageEl").src =
      ex.imagen;

    document.getElementById("lbImageEl")
      .style.display = "block";

    document.getElementById("lbImagePlaceholder")
      .style.display = "none";

  } else {

    document.getElementById("lbImageEl")
      .style.display = "none";

    document.getElementById("lbImagePlaceholder")
      .style.display = "flex";

  }

  document.getElementById("lightboxOverlay")
    .classList.add("open");

}

function closeLightbox() {

  clearFieldErrors();

  document
    .getElementById("lightboxOverlay")
    .classList.remove("open");

}

function clearFieldErrors() {

  document
    .querySelectorAll(".error")
    .forEach(el => {

      el.classList.remove("error");

    });

  document
    .querySelectorAll(".field-error-text")
    .forEach(el => {

      el.remove();

    });

}

function showFieldError(element, message) {

  element.classList.add("error");

  const error =
    document.createElement("div");

  error.className =
    "field-error-text";

  error.textContent = message;

  element.parentNode.appendChild(error);

}

async function saveLightbox() {

  clearFieldErrors();

  /* =========================
     VALIDACIONES
  ========================= */

  const nombreEn =
    document.getElementById("lbNombreEn")
      .value
      .trim();

  const nombre =
    document.getElementById("lbNombre")
      .value
      .trim();

  const descripcion =
    document.getElementById("lbDescripcion")
      .value
      .trim();

  const tipo =
    document.getElementById("lbTipo")
      .value;

  const equipo =
    document.getElementById("lbEquipo")
      .value;

  const parteCuerpo =
    document.getElementById("lbParteCuerpo")
      .value;

  const tipoRegistro =
    document.getElementById("lbTipoRegistro")
      .value;

  const musculoPrimario =
    document.getElementById("lbMusculoPrimarioBtn")
      .dataset.value || "";

  const musculoSecundario =
    document.getElementById("lbMusculoSecundarioBtn")
      .dataset.value || "";

  const videoUrl =
    document.getElementById("lbVideo")
      .value
      .trim();

  /* =========================
     CAMPOS OBLIGATORIOS
  ========================= */

  if (!nombreEn) {

    showFieldError(

      document.getElementById("lbNombreEn"),

      "Ingresa el nombre en inglés"

    );

    return;

  }

  if (!nombre) {

    showFieldError(

      document.getElementById("lbNombre"),

      "Ingresa el nombre en español"

    );

    return;

  }

  if (!tipo) {

    showFieldError(

      document.getElementById("lbTipo"),

      "Selecciona el tipo de ejercicio"

    );

    return;

  }

  if (!equipo) {

    showFieldError(

      document.getElementById("lbEquipo"),

      "Selecciona el equipo"

    );

    return;

  }

  if (!parteCuerpo) {

    showFieldError(

      document.getElementById("lbParteCuerpo"),

      "Selecciona la parte del cuerpo"

    );

    return;

  }

  if (!musculoPrimario) {

    showFieldError(

      document.getElementById(
        "lbMusculoPrimarioBtn"
      ),

      "Selecciona el músculo primario"

    );

    return;

  }

  if (!tipoRegistro) {

    showFieldError(

      document.getElementById("lbTipoRegistro"),

      "Selecciona el tipo de registro"

    );

    return;

  }

  /* =========================
     PAYLOAD
  ========================= */

  const payload = {

    nombre_en: nombreEn,

    nombre: nombre,

    descripcion: descripcion,

    tipo: tipo,

    equipo: equipo,

    musculo_primario: musculoPrimario,

    musculo_secundario: musculoSecundario,

    parte_cuerpo: parteCuerpo,

    tipo_registro: tipoRegistro,

    video_url: videoUrl

  };

  /* =========================
     IMAGEN
  ========================= */

  if (selectedImageFile) {

    const imageBase64 =
      await new Promise((resolve) => {

        const reader = new FileReader();

        reader.onload = (e) =>
          resolve(e.target.result);

        reader.readAsDataURL(
          selectedImageFile
        );

      });

    payload.imagen = imageBase64;

  } else if (

    currentIdx !== null &&
    ejercicios[currentIdx]?.imagen

  ) {

    payload.imagen =
      ejercicios[currentIdx].imagen;

  }

  /* =========================
     INSERT / UPDATE
  ========================= */

  let result;

  if (currentIdx === null) {

    result = await supabaseClient
      .from("exercises")
      .insert([payload]);

  } else {

    const id =
      ejercicios[currentIdx].id;

    result = await supabaseClient
      .from("exercises")
      .update(payload)
      .eq("id", id);

  }

  /* =========================
     ERROR
  ========================= */

  if (result.error) {

    console.error(result.error);

    alert("Error al guardar");

    return;

  }

  /* =========================
     FINALIZAR
  ========================= */

  selectedImageFile = null;

  closeLightbox();

  await cargarEjercicios();

}

function formatValue(value) {
  if (!value) return "-";

  const map = {
    peso_corporal: "Peso corporal",
    peso_extra: "Peso extra",
    rueda_abdominal: "Rueda abdominal",
    upper_arms: "Brazos",
    full_body: "Cuerpo completo",
    chest: "Pecho",
    back: "Espalda",
    thighs: "Piernas",
    glutes: "Glúteos",
    shoulders: "Hombros",
    abdominals: "Abdominales",
    core: "Core",
    pectorals: "Pectorales",
    quadriceps: "Cuádriceps",
    biceps: "Bíceps",
    triceps: "Tríceps",
    hamstrings: "Isquiotibiales",
    obliques: "Oblicuos",
    fuerza: "Fuerza",
    cardio: "Cardio",
    flexibilidad: "Flexibilidad",
    movilidad: "Movilidad",
    isometrico: "Isométrico",
    pliometrico: "Pliométrico",
    resistencia: "Resistencia",
    mancuernas: "Mancuernas",
    banda: "Banda"
  };

  return map[value] || value.replaceAll("_", " ");
}

function renderMuscleChips(musclesString) {

  if (!musclesString) return "—";

  return musclesString
    .split(",")
    .map(m => `
      <div class="muscle-chip">
        ${formatMusculoNombre(m)}
      </div>
    `)
    .join("");

}

function formatParteCuerpo(value) {

  if (!value) return "—";

  const map = {

    chest: "Pecho",
    back: "Espalda",
    thighs: "Piernas",
    glutes: "Glúteos",
    shoulders: "Hombros",
    abdominals: "Abdominales",
    upper_arms: "Brazos",
    core: "Core"

  };

  return map[value] || value;

}

function openViewLightbox(idx) {

  const ex = ejercicios[idx];

  currentIdx = idx;

  function renderMuscleChips(musclesString) {

    if (!musclesString) return "—";

    return musclesString
      .split(",")
      .map(m => `
        <div class="muscle-chip">
          ${formatMusculoNombre(m)}
        </div>
      `)
      .join("");

  }

  document.getElementById("viewContent").innerHTML = `
    <div class="view-image-wrap">

      ${
        ex.imagen
          ? `
            <img
              src="${ex.imagen}"
              class="view-image">
          `
          : `
            <div class="view-no-image">
              No image
            </div>
          `
      }

    </div>

    <div class="detail-grid">

      <div class="detail-row">

        <div class="detail-label">
          Nombre en inglés
        </div>

        <div class="detail-value">
          ${ex.nombre_en || "—"}
        </div>

      </div>

      <div class="detail-row">

        <div class="detail-label">
          Nombre en español
        </div>

        <div class="detail-value">
          ${ex.nombre || "—"}
        </div>

      </div>

      <div class="detail-row">

        <div class="detail-label">
          Tipo
        </div>

        <div class="detail-value">
          ${ex.tipo || "—"}
        </div>

      </div>

      <div class="detail-row">

        <div class="detail-label">
          Equipo
        </div>

        <div class="detail-value">
          ${formatEquipo(ex.equipo)}
        </div>

      </div>

      <div class="detail-row">

        <div class="detail-label">
          Parte del cuerpo
        </div>

        <div class="detail-value">
          ${formatParteCuerpo(ex.parte_cuerpo)}
        </div>

      </div>

      <!-- MUSCULO PRIMARIO -->

      <div class="detail-row">

        <div class="detail-label">
          Músculo primario
        </div>

        <div class="muscle-chip-wrap">

          ${
            ex.musculo_primario
              ? `
                <div class="muscle-chip primary">
                  ${formatMusculoNombre(ex.musculo_primario)}
                </div>
              `
              : "—"
          }

        </div>

      </div>

      <!-- MUSCULOS SECUNDARIOS -->

      <div class="detail-row">

        <div class="detail-label">
          Músculos secundarios
        </div>

        <div class="muscle-chip-wrap">
          ${renderMuscleChips(ex.musculo_secundario)}
        </div>

      </div>

      <div class="detail-row">

        <div class="detail-label">
          Descripción
        </div>

        <div class="detail-value">
          ${ex.descripcion || "—"}
        </div>

      </div>

    </div>

    <div class="detail-row">

      <div class="detail-label">
        Video de referencia
      </div>
    
      <div class="detail-value">
    
        ${
          ex.video_url
            ? `
              <a
                href="${ex.video_url}"
                target="_blank"
                class="detail-link">
    
                Abrir video
              </a>
            `
            : "—"
        }
    
      </div>
    
    </div>

  `;

  document.getElementById("viewOverlay")
    .classList.add("open");

}

function renderDeleteTable(lista = ejercicios) {
  const tbody = document.getElementById("deleteTableBody");
  if (!tbody) return;

  const visibles = lista.slice(0, 12);

  tbody.innerHTML = visibles.map(e => `
    <tr>
      <td>${e.nombre_en || ""}</td>
      <td>${e.nombre || ""}</td>
      <td>
        <button class="delete-row-btn" data-id="${e.id}" title="Eliminar">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"/>
            <path d="M8 6V4h8v2"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6"/>
            <path d="M14 11v6"/>
          </svg>
        </button>
      </td>
    </tr>
  `).join("");

  document.querySelectorAll(".delete-row-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = parseInt(btn.dataset.id);

      const confirmOverlay = document.getElementById("confirmDeleteOverlay");
      const confirmOk = document.getElementById("confirmDeleteOk");
      const confirmCancel = document.getElementById("confirmDeleteCancel");
      
      confirmOverlay.classList.add("open");
      
      confirmCancel.onclick = () => {
        confirmOverlay.classList.remove("open");
      };
      
      confirmOk.onclick = async () => {
        confirmOverlay.classList.remove("open");
      
        const { error } = await supabaseClient
          .from("exercises")
          .delete()
          .eq("id", id);
      
        if (error) {
          console.error(error);
          alert("No se pudo eliminar");
          return;
        }
      
        ejercicios = ejercicios.filter(e => e.id !== id);
        aplicarFiltrosDelete();
        renderEjercicios();
      };
      return;

      const { error } = await supabaseClient
        .from("exercises")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(error);
        alert("No se pudo eliminar");
        return;
      }

      ejercicios = ejercicios.filter(e => e.id !== id);

      aplicarFiltrosDelete(); // mantiene filtros
      renderEjercicios();     // refresca tarjetas
    });
  });
}

function aplicarFiltrosDelete() {
  const en = document.getElementById("filterNameEn").value.toLowerCase().trim();
  const es = document.getElementById("filterNameEs").value.toLowerCase().trim();

  const filtrados = ejercicios.filter(e => {
    const nombreEn = (e.nombre_en || "").toLowerCase();
    const nombreEs = (e.nombre || "").toLowerCase();

    return nombreEn.includes(en) && nombreEs.includes(es);
  });

  renderDeleteTable(filtrados);
}

function closeViewLightbox() {
  document.getElementById("viewOverlay").classList.remove("open");
}

document.addEventListener("DOMContentLoaded", () => {

  cargarEjercicios();

  // FILTROS SUPERIORES

  document.querySelectorAll(".pill").forEach(pill => {

    pill.addEventListener("click", () => {

      document.querySelectorAll(".pill")
        .forEach(p => p.classList.remove("active"));

      pill.classList.add("active");

      renderEjercicios(pill.dataset.filter);

    });

  });

  // TIPO REGISTRO AUTOMÁTICO

  const equipoSelect =
    document.getElementById("lbEquipo");

  const tipoRegistro =
    document.getElementById("lbTipoRegistro");

  if (equipoSelect && tipoRegistro) {

    equipoSelect.addEventListener("change", () => {

      const equipo = equipoSelect.value;

      const ejerciciosPorRepeticiones = [
        "peso_corporal",
        "mancuernas",
        "barra",
        "barra_z"
      ];

      if (ejerciciosPorRepeticiones.includes(equipo)) {

        tipoRegistro.value = "repeticiones";

      } else {

        tipoRegistro.value = "";

      }

    });

  }

  // BOTONES LIGHTBOX

  const lbCancel =
    document.getElementById("lbCancel");

  const lbSave =
    document.getElementById("lbSave");

  if (lbCancel)
    lbCancel.addEventListener("click", closeLightbox);

  if (lbSave)
    lbSave.addEventListener("click", saveLightbox);

  // DETALLE EJERCICIO

  const viewClose =
    document.getElementById("viewClose");

  const viewEditBtn =
    document.getElementById("viewEditBtn");

  if (viewClose)
    viewClose.addEventListener("click", closeViewLightbox);

  if (viewEditBtn) {

    viewEditBtn.addEventListener("click", () => {

      closeViewLightbox();

      openLightbox(currentIdx);

    });

  }

  // IMAGEN EJERCICIO

  const imageArea =
    document.getElementById("lbImageArea");

  const imageInput =
    document.getElementById("lbImageInput");

  if (imageArea && imageInput) {

    imageArea.addEventListener("click", () => {

      imageInput.click();

    });

    imageInput.addEventListener("change", (e) => {

      const file = e.target.files[0];

      if (!file) return;

      selectedImageFile = file;

      const reader = new FileReader();

      reader.onload = function(ev) {

        document.getElementById("lbImageEl").src =
          ev.target.result;

        document.getElementById("lbImageEl").style.display =
          "block";

        document.getElementById("lbImagePlaceholder").style.display =
          "none";

      };

      reader.readAsDataURL(file);

    });

  }

  // BOTÓN AGREGAR EJERCICIO

  const addBtn =
    document.getElementById("addExerciseBtn");

  const scrollBtn =
    document.getElementById("scrollTopBtn");

  if (addBtn) {

    document.getElementById("lbTitle").textContent =
      "Agregar ejercicio";

    addBtn.addEventListener("click", () => {

        currentIdx = null;
      
        // RESET MULTISELECT
        secondaryMusclesSelected = [];
      
        document.getElementById("lbTitle").textContent =
          "Agregar ejercicio";
      
        document.getElementById("lbNombreEn").value = "";
      
        document.getElementById("lbNombre").value = "";
      
        document.getElementById("lbDescripcion").value = "";
      
        document.getElementById("lbTipo").value = "";
      
        document.getElementById("lbEquipo").value = "";
      
        document.getElementById("lbParteCuerpo").value = "";
      
        document.getElementById("lbTipoRegistro").value = "";
      
        document.getElementById("lbVideo").value = "";
      
        // PRIMARIO
        document.getElementById("lbMusculoPrimarioBtn")
          .textContent = "— Seleccionar —";
      
        document.getElementById("lbMusculoPrimarioBtn")
          .dataset.value = "";
      
        // SECUNDARIO
        document.getElementById("lbMusculoSecundarioBtn")
          .textContent = "— Seleccionar —";
      
        document.getElementById("lbMusculoSecundarioBtn")
          .dataset.value = "";
      
        // IMAGEN
        document.getElementById("lbImageEl")
          .style.display = "none";
      
        document.getElementById("lbImagePlaceholder")
          .style.display = "flex";
      
        document.getElementById("lightboxOverlay")
          .classList.add("open");
      
      });

  }

  // BOTÓN SCROLL TOP

  window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

      scrollBtn.style.display = "block";

    } else {

      scrollBtn.style.display = "none";

    }

  });

  if (scrollBtn) {

    scrollBtn.addEventListener("click", () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    });

  }

  // POPUP ELIMINAR

  const deleteBtn =
    document.getElementById("deleteListBtn");

  const deleteClose =
    document.getElementById("deleteClose");

  if (deleteBtn) {

    deleteBtn.addEventListener("click", () => {

      renderDeleteTable();

      document.getElementById("deleteOverlay")
        .classList.add("open");

    });

  }

  if (deleteClose) {

    deleteClose.addEventListener("click", () => {

      document.getElementById("deleteOverlay")
        .classList.remove("open");

    });

  }

  // FILTROS ELIMINAR

  const filterNameEn =
    document.getElementById("filterNameEn");

  const filterNameEs =
    document.getElementById("filterNameEs");

  if (filterNameEn) {

    filterNameEn.addEventListener(
      "input",
      aplicarFiltrosDelete
    );

  }

  if (filterNameEs) {

    filterNameEs.addEventListener(
      "input",
      aplicarFiltrosDelete
    );

  }

  // MUSCLE PICKER

  const primarioBtn =
    document.getElementById("lbMusculoPrimarioBtn");

  const secundarioBtn =
    document.getElementById("lbMusculoSecundarioBtn");

  const muscleClose =
    document.getElementById("musclePickerClose");

   if (primarioBtn) {
  
      //console.log("PRIMARIO BTN ENCONTRADO");
    
      primarioBtn.addEventListener("click", () => {
    
        //console.log("CLICK PRIMARIO");
    
        abrirMusclePicker("primario");
    
      });
    
    }

  if (secundarioBtn) {

    secundarioBtn.addEventListener("click", () => {

      abrirMusclePicker("secundario");

    });

  }

  if (muscleClose) {

    muscleClose.addEventListener(
      "click",
      cerrarMusclePicker
    );

  }

});




