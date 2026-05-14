/* workout/js/library.js — v2 */

/* =============================================
   DATA
============================================= */

const ejercicios = [
  { nombre:"Flexiones estándar",        musculo:"Pecho",   desc:"Posición clásica de empuje. Manos al ancho de hombros.",             tags:["sin equipo","empuje"],       filtro:"pecho"   },
  { nombre:"Flexiones diamante",         musculo:"Pecho",   desc:"Manos formando un diamante. Mayor activación de tríceps.",            tags:["sin equipo","tríceps"],      filtro:"pecho"   },
  { nombre:"Flexiones declinadas",       musculo:"Pecho",   desc:"Pies elevados para trabajar la parte superior del pecho.",            tags:["sin equipo","empuje"],       filtro:"pecho"   },
  { nombre:"Flexiones inclinadas",       musculo:"Pecho",   desc:"Manos elevadas. Activa el pecho inferior.",                          tags:["sin equipo","empuje"],       filtro:"pecho"   },
  { nombre:"Sentadilla",                 musculo:"Piernas", desc:"El ejercicio fundamental de tren inferior. Rodillas sobre pies.",     tags:["sin equipo","básico"],       filtro:"piernas" },
  { nombre:"Zancada estática",           musculo:"Piernas", desc:"Un pie adelantado. Baja la rodilla trasera hacia el suelo.",          tags:["sin equipo","glúteo"],       filtro:"piernas" },
  { nombre:"Sentadilla búlgara",         musculo:"Piernas", desc:"Pie trasero elevado. Fuerza unilateral y equilibrio.",               tags:["silla","glúteo"],            filtro:"piernas" },
  { nombre:"Puente de glúteo",           musculo:"Piernas", desc:"Tumbado boca arriba. Eleva caderas contrayendo glúteos.",             tags:["suelo","glúteo"],            filtro:"piernas" },
  { nombre:"Plancha",                    musculo:"Core",    desc:"Posición isométrica. Mantén el cuerpo recto como tabla.",            tags:["sin equipo","isometría"],    filtro:"core"    },
  { nombre:"Crunch",                     musculo:"Core",    desc:"Eleva solo los hombros del suelo. Contrae el abdomen.",              tags:["suelo","básico"],            filtro:"core"    },
  { nombre:"Elevación de piernas",       musculo:"Core",    desc:"Tumbado, sube y baja las piernas sin tocar el suelo.",              tags:["suelo","bajo vientre"],      filtro:"core"    },
  { nombre:"Mountain climbers",          musculo:"Core",    desc:"En posición de plancha, alterna rodillas al pecho rápido.",          tags:["sin equipo","cardio"],       filtro:"core"    },
  { nombre:"Superman",                   musculo:"Espalda", desc:"Boca abajo, eleva brazos y piernas simultáneamente.",                tags:["suelo","lumbar"],            filtro:"espalda" },
  { nombre:"Remo invertido (mesa)",      musculo:"Espalda", desc:"Bajo una mesa, tira del cuerpo hacia arriba con los brazos.",        tags:["mesa","tirón"],              filtro:"espalda" },
  { nombre:"Pike push-up",              musculo:"Hombros", desc:"En V invertida, flexiona codos para bajar la cabeza al suelo.",      tags:["sin equipo","empuje"],       filtro:"hombros" },
  { nombre:"Flexión lateral de hombro", musculo:"Hombros", desc:"De pie, eleva los brazos lateralmente.",                             tags:["sin equipo","básico"],       filtro:"hombros" },
  { nombre:"Fondos en silla",            musculo:"Brazos",  desc:"Manos en silla detrás, baja y sube flexionando los codos.",          tags:["silla","tríceps"],           filtro:"brazos"  },
  { nombre:"Curl de bícep (sin peso)",   musculo:"Brazos",  desc:"Simula curl usando la resistencia del brazo contrario.",             tags:["sin equipo","bícep"],        filtro:"brazos"  },
  { nombre:"Jumping jacks",             musculo:"Cardio",  desc:"Salta abriendo y cerrando piernas y brazos. Activa el cuerpo.",      tags:["sin equipo","calentamiento"],filtro:"cardio"  },
  { nombre:"Burpees",                   musculo:"Cardio",  desc:"Plancha + salto. El ejercicio de cuerpo completo más exigente.",     tags:["sin equipo","completo"],     filtro:"cardio"  },
  { nombre:"Salto de cuerda (sin cuerda)",musculo:"Cardio",desc:"Imita el salto de cuerda sin usarla. Excelente cardio en casa.",     tags:["sin equipo","ritmo"],        filtro:"cardio"  },
];

/* datos extra editables por ejercicio (índice = posición en array) */
const ejercicioData = ejercicios.map(() => ({
  imagen: null,
  tipo: "",
  equipo: "",
  musculoPrimario: "",
  musculoSecundario: "",
  parteCuerpo: "",
  video: "",
}));

/* =============================================
   RENDER TARJETAS
============================================= */

function renderEjercicios(filtro = "todos") {
  const grid = document.getElementById("exerciseGrid");
  if (!grid) return;

  const lista = filtro === "todos"
    ? ejercicios.map((e, i) => ({ ...e, _idx: i }))
    : ejercicios.map((e, i) => ({ ...e, _idx: i })).filter(e => e.filtro === filtro);

  if (!lista.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>Sin ejercicios en esta categoría aún.</p>
      </div>`;
    return;
  }

  grid.innerHTML = lista.map(e => `
    <div class="exercise-card" data-idx="${e._idx}">
      <div class="ex-muscle">${e.musculo}</div>
      <div class="ex-name">${e.nombre}</div>
      <div class="ex-desc">${e.desc}</div>
      <div class="ex-tags">
        ${e.tags.map(t => `<span class="ex-tag">${t}</span>`).join("")}
      </div>
    </div>
  `).join("");

  /* click en tarjeta → abrir lightbox */
  grid.querySelectorAll(".exercise-card").forEach(card => {
    card.addEventListener("click", () => {
      openLightbox(parseInt(card.dataset.idx));
    });
  });
}

/* =============================================
   LIGHTBOX
============================================= */

let currentIdx = null;

const lbOverlay   = document.getElementById("lightboxOverlay");
const lbCancel    = document.getElementById("lbCancel");
const lbSave      = document.getElementById("lbSave");
const lbImageArea = document.getElementById("lbImageArea");
const lbImageInput= document.getElementById("lbImageInput");
const lbImageEl   = document.getElementById("lbImageEl");
const lbImagePh   = document.getElementById("lbImagePlaceholder");

function openLightbox(idx) {
  currentIdx = idx;
  const ex   = ejercicios[idx];
  const data = ejercicioData[idx];

  /* rellenar campos */
  document.getElementById("lbNombre").value           = ex.nombre;
  document.getElementById("lbTipo").value             = data.tipo;
  document.getElementById("lbEquipo").value           = data.equipo;
  document.getElementById("lbMusculoPrimario").value  = data.musculoPrimario;
  document.getElementById("lbMusculoSecundario").value= data.musculoSecundario;
  document.getElementById("lbParteCuerpo").value      = data.parteCuerpo;
  document.getElementById("lbVideo").value            = data.video;

  /* imagen */
  if (data.imagen) {
    lbImageEl.src = data.imagen;
    lbImageEl.style.display = "block";
    lbImagePh.style.display = "none";
  } else {
    lbImageEl.style.display = "none";
    lbImagePh.style.display = "flex";
  }

  lbOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lbOverlay.classList.remove("open");
  document.body.style.overflow = "";
  currentIdx = null;
}

function saveLightbox() {
  if (currentIdx === null) return;

  /* actualizar nombre en array */
  const nuevoNombre = document.getElementById("lbNombre").value.trim();
  if (nuevoNombre) ejercicios[currentIdx].nombre = nuevoNombre;

  /* guardar datos extra */
  ejercicioData[currentIdx] = {
    imagen:           ejercicioData[currentIdx].imagen,
    tipo:             document.getElementById("lbTipo").value,
    equipo:           document.getElementById("lbEquipo").value,
    musculoPrimario:  document.getElementById("lbMusculoPrimario").value,
    musculoSecundario:document.getElementById("lbMusculoSecundario").value,
    parteCuerpo:      document.getElementById("lbParteCuerpo").value,
    video:            document.getElementById("lbVideo").value,
  };

  closeLightbox();

  /* re-renderizar para reflejar cambios */
  const activePill = document.querySelector(".pill.active");
  renderEjercicios(activePill ? activePill.dataset.filter : "todos");
}

/* IMAGEN — click en área */
lbImageArea.addEventListener("click", () => lbImageInput.click());

lbImageInput.addEventListener("change", () => {
  const file = lbImageInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    ejercicioData[currentIdx].imagen = e.target.result;
    lbImageEl.src = e.target.result;
    lbImageEl.style.display = "block";
    lbImagePh.style.display = "none";
  };
  reader.readAsDataURL(file);
});

/* BOTONES */
lbCancel.addEventListener("click", closeLightbox);
lbSave.addEventListener("click",   saveLightbox);

/* cerrar al click en el fondo oscuro */
lbOverlay.addEventListener("click", e => {
  if (e.target === lbOverlay) closeLightbox();
});

/* cerrar con Escape */
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && lbOverlay.classList.contains("open")) closeLightbox();
});

/* =============================================
   INIT
============================================= */

document.addEventListener("DOMContentLoaded", () => {
  renderEjercicios();

  document.querySelectorAll(".pill").forEach(pill => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      renderEjercicios(pill.dataset.filter);
    });
  });
});
