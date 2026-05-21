// Archivo library.js completo (versión integrada)
let ejercicios = [];
let currentIdx = null;
let selectedImageFile = null;

const SUPABASE_URL = "https://xqcqzvcvqpwbjdsdxcan.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxY3F6dmN2cXB3Ympkc2R4Y2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NjI3OTQsImV4cCI6MjA5NDQzODc5NH0.vAwo9NS7MoiVCFikfk39YM9nBr2usyB4jMW2uYXhH98";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let musclePickerTarget = null;

const MUSCLE_DATA = [
  {
    value: "deltoides_anterior",
    label: "Deltoides anterior",
    image: "../src/muscles/test.png"
  },

  {
    value: "deltoides_lateral",
    label: "Deltoides lateral",
    image: "../src/muscles/test.png"
  },

  {
    value: "deltoides_posterior",
    label: "Deltoides posterior",
    image: "../src/muscles/test.png"
  },

  {
    value: "pectoral_mayor_esternal",
    label: "Pectoral mayor (porción esternal)",
    image: "../src/muscles/test.png"
  },

  {
    value: "trapecio_superior",
    label: "Trapecio (fibras superiores)",
    image: "../src/muscles/test.png"
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

  const nombres = {

    esternocleidomastoideo:
      "Esternocleidomastoideo",

    elevador_escapula:
      "Elevador de la escápula",

    pectoral_mayor_esternal:
      "Pectoral mayor (porción esternal)",

    pectoral_mayor_clavicular:
      "Pectoral mayor (porción clavicular)",

    deltoides_anterior:
      "Deltoides anterior",

    deltoides_lateral:
      "Deltoides lateral",

    deltoides_posterior:
      "Deltoides posterior",

    trapecio_superior:
      "Trapecio (fibras superiores)",

    trapecio_medio:
      "Trapecio (fibras medias)",

    trapecio_inferior:
      "Trapecio (fibras inferiores)",

    infraespinoso:
      "Infraespinoso",

    redondo_mayor:
      "Redondo mayor",

    redondo_menor:
      "Redondo menor",

    dorsal_ancho:
      "Dorsal ancho (Latissimus dorsi)",

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
      "Extensores de la muñeca",

    flexores_muneca:
      "Flexores de la muñeca",

    recto_abdominal:
      "Recto abdominal",

    transverso_abdomen:
      "Transverso del abdomen",

    oblicuos:
      "Oblicuos",

    cuadriceps:
      "Cuádriceps",

    sartorio:
      "Sartorio",

    tensor_fascia_lata:
      "Tensor de la fascia lata",

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
      "Gastrocnemio (Gemelos)",

    soleo:
      "Sóleo",

    tibial_anterior:
      "Tibial anterior"
  };

  return nombres[value] || value;
}

function abrirMusclePicker(target) {

  musclePickerTarget = target;

  const overlay =
    document.getElementById("musclePickerOverlay");

  const list =
    document.getElementById("musclePickerList");

  list.innerHTML = MUSCLE_DATA.map(m => `
    <div class="muscle-item"
      data-value="${m.value}"
      data-label="${m.label}">

      <img class="muscle-thumb"
        src="${m.image}">

      <div class="muscle-name">
        ${m.label}
      </div>

      <div class="muscle-select-btn">
        ＋
      </div>

    </div>
  `).join("");

  overlay.classList.add("open");

  document.querySelectorAll(".muscle-item").forEach(item => {

    item.addEventListener("click", () => {

      const value = item.dataset.value;
      const label = item.dataset.label;

      if (musclePickerTarget === "primario") {

        document.getElementById("lbMusculoPrimarioBtn")
          .textContent = label;

        document.getElementById("lbMusculoPrimarioBtn")
          .dataset.value = value;

      }

      if (musclePickerTarget === "secundario") {

        document.getElementById("lbMusculoSecundarioBtn")
          .textContent = label;

        document.getElementById("lbMusculoSecundarioBtn")
          .dataset.value = value;

      }

      cerrarMusclePicker();

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

function openLightbox(idx) {
  document.getElementById("lbTitle").textContent = "Editar ejercicio";
  currentIdx = idx;
  const ex = ejercicios[idx];

  document.getElementById("lbNombreEn").value = ex.nombre_en || "";
  document.getElementById("lbNombre").value = ex.nombre || "";
  document.getElementById("lbDescripcion").value = ex.descripcion || "";
  document.getElementById("lbTipo").value = ex.tipo || "";
  document.getElementById("lbEquipo").value = ex.equipo || "";
  document.getElementById("lbMusculoPrimarioBtn")
    .textContent =
      formatMusculoNombre(ex.musculo_primario) ||
      "— Seleccionar —";
  
  document.getElementById("lbMusculoPrimarioBtn")
    .dataset.value =
      ex.musculo_primario || "";
 document.getElementById("lbMusculoSecundarioBtn")
    .textContent =
      formatMusculoNombre(ex.musculo_secundario) ||
      "— Seleccionar —";
  
  document.getElementById("lbMusculoSecundarioBtn")
    .dataset.value =
      ex.musculo_secundario || "";
  document.getElementById("lbParteCuerpo").value = ex.parte_cuerpo || "";
  document.getElementById("lbVideo").value = ex.video_url || "";
  document.getElementById("lbTipoRegistro").value = ex.tipo_registro || "repeticiones";

  const imgEl = document.getElementById("lbImageEl");
  const placeholder = document.getElementById("lbImagePlaceholder");
  
  if (ex.imagen) {
    imgEl.src = ex.imagen;
    imgEl.style.display = "block";
    placeholder.style.display = "none";
  } else {
    imgEl.src = "";
    imgEl.style.display = "none";
    placeholder.style.display = "flex";
  
    placeholder.innerHTML = `
      <span class="lb-upload-text">NO IMAGE<br><small>click to upload</small></span>
    `;
  }

  document.getElementById("lightboxOverlay").classList.add("open");
}

function closeLightbox() {
  document.getElementById("lightboxOverlay").classList.remove("open");
}

async function saveLightbox() {
  const payload = {
    nombre_en: document.getElementById("lbNombreEn").value.trim(),
    nombre: document.getElementById("lbNombre").value.trim(),
    descripcion: document.getElementById("lbDescripcion").value.trim(),
    tipo: document.getElementById("lbTipo").value,
    equipo: document.getElementById("lbEquipo").value,
    musculo_primario: document.getElementById("lbMusculoPrimario").value,
    musculo_secundario: document.getElementById("lbMusculoSecundario").value,
    parte_cuerpo: document.getElementById("lbParteCuerpo").value,
    tipo_registro: document.getElementById("lbTipoRegistro").value,
    video_url: document.getElementById("lbVideo").value.trim()
  };

  // si se seleccionó imagen nueva
  if (selectedImageFile) {
    const imageBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(selectedImageFile);
    });

    payload.imagen = imageBase64;
  } else if (currentIdx !== null && ejercicios[currentIdx]?.imagen) {
    // conservar imagen existente al editar
    payload.imagen = ejercicios[currentIdx].imagen;
  }

  let result;

  if (currentIdx === null) {
    result = await supabaseClient.from("exercises").insert([payload]);
  } else {
    const id = ejercicios[currentIdx].id;
    result = await supabaseClient.from("exercises").update(payload).eq("id", id);
  }

  if (result.error) {
    console.error(result.error);
    alert("Error al guardar");
    return;
  }

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

function openViewLightbox(idx) {
  currentIdx = idx;
  const ex = ejercicios[idx];
  const nombreEs = ex.nombre || "";
  const nombreEn = ex.nombre_en || "";

  document.getElementById("viewContent").innerHTML = `
    ${ex.imagen
      ? `<img class="detail-img" src="${ex.imagen}" alt="${nombreEs}">`
      : `<div class="card-thumb no-image-box">No image</div>`
    }

    <div class="detail-section">
      <h2 class="detail-name-en">${nombreEn || nombreEs}</h2>
      <div class="detail-name-es">${nombreEs}</div>

      <p>${ex.descripcion || ""}</p>

      <div class="detail-meta"><span class="meta-label">Tipo:</span> <span class="meta-value">${formatValue(ex.tipo)}</span></div>
      <div class="detail-meta"><span class="meta-label">Equipo:</span> <span class="meta-value">${formatValue(ex.equipo)}</span></div>
      <div class="detail-meta"><span class="meta-label">Músculo primario:</span> <span class="meta-value">${formatValue(ex.musculo_primario)}</span></div>
      <div class="detail-meta"><span class="meta-label">Músculo secundario:</span> <span class="meta-value">${formatValue(ex.musculo_secundario)}</span></div>
      <div class="detail-meta"><span class="meta-label">Parte del cuerpo:</span> <span class="meta-value">${formatValue(ex.parte_cuerpo)}</span></div>

      ${
        ex.video_url
          ? `<a class="detail-video" href="${ex.video_url}" target="_blank">Ver video ↗</a>`
          : ""
      }
    </div>
  `;

  document.getElementById("viewOverlay").classList.add("open");
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

      document.getElementById("lbNombreEn").value = "";
      document.getElementById("lbNombre").value = "";
      document.getElementById("lbDescripcion").value = "";
      document.getElementById("lbTipo").value = "";
      document.getElementById("lbEquipo").value = "";
      document.getElementById("lbTipoRegistro").value = "";
      document.getElementById("lbParteCuerpo").value = "";
      document.getElementById("lbVideo").value = "";

      // MÚSCULOS

      document.getElementById("lbMusculoPrimarioBtn")
        .textContent = "— Seleccionar —";

      document.getElementById("lbMusculoPrimarioBtn")
        .dataset.value = "";

      document.getElementById("lbMusculoSecundarioBtn")
        .textContent = "— Seleccionar —";

      document.getElementById("lbMusculoSecundarioBtn")
        .dataset.value = "";

      // IMAGEN

      document.getElementById("lbImageEl").style.display =
        "none";

      document.getElementById("lbImagePlaceholder").style.display =
        "flex";

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
  
      console.log("PRIMARIO BTN ENCONTRADO");
    
      primarioBtn.addEventListener("click", () => {
    
        console.log("CLICK PRIMARIO");
    
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




