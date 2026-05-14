/* Workout — library.js */

const ejercicios = [
  // PECHO
  { nombre:"Flexiones estándar",        musculo:"Pecho",   desc:"Posición clásica de empuje. Manos al ancho de hombros.",             tags:["sin equipo","empuje"],       filtro:"pecho"   },
  { nombre:"Flexiones diamante",         musculo:"Pecho",   desc:"Manos formando un diamante. Mayor activación de tríceps.",            tags:["sin equipo","tríceps"],      filtro:"pecho"   },
  { nombre:"Flexiones declinadas",       musculo:"Pecho",   desc:"Pies elevados para trabajar la parte superior del pecho.",            tags:["sin equipo","empuje"],       filtro:"pecho"   },
  { nombre:"Flexiones inclinadas",       musculo:"Pecho",   desc:"Manos elevadas. Activa el pecho inferior.",                          tags:["sin equipo","empuje"],       filtro:"pecho"   },
  // PIERNAS
  { nombre:"Sentadilla",                 musculo:"Piernas", desc:"El ejercicio fundamental de tren inferior. Rodillas sobre pies.",     tags:["sin equipo","básico"],       filtro:"piernas" },
  { nombre:"Zancada estática",           musculo:"Piernas", desc:"Un pie adelantado. Baja la rodilla trasera hacia el suelo.",          tags:["sin equipo","glúteo"],       filtro:"piernas" },
  { nombre:"Sentadilla búlgara",         musculo:"Piernas", desc:"Pie trasero elevado. Fuerza unilateral y equilibrio.",               tags:["silla","glúteo"],            filtro:"piernas" },
  { nombre:"Puente de glúteo",           musculo:"Piernas", desc:"Tumbado boca arriba. Eleva caderas contrayendo glúteos.",             tags:["suelo","glúteo"],            filtro:"piernas" },
  // CORE
  { nombre:"Plancha",                    musculo:"Core",    desc:"Posición isométrica. Mantén el cuerpo recto como tabla.",            tags:["sin equipo","isometría"],    filtro:"core"    },
  { nombre:"Crunch",                     musculo:"Core",    desc:"Eleva solo los hombros del suelo. Contrae el abdomen.",              tags:["suelo","básico"],            filtro:"core"    },
  { nombre:"Elevación de piernas",       musculo:"Core",    desc:"Tumbado, sube y baja las piernas sin tocar el suelo.",              tags:["suelo","bajo vientre"],      filtro:"core"    },
  { nombre:"Mountain climbers",          musculo:"Core",    desc:"En posición de plancha, alterna rodillas al pecho rápido.",          tags:["sin equipo","cardio"],       filtro:"core"    },
  // ESPALDA
  { nombre:"Superman",                   musculo:"Espalda", desc:"Boca abajo, eleva brazos y piernas simultáneamente.",                tags:["suelo","lumbar"],            filtro:"espalda" },
  { nombre:"Remo invertido (mesa)",      musculo:"Espalda", desc:"Bajo una mesa, tira del cuerpo hacia arriba con los brazos.",        tags:["mesa","tirón"],              filtro:"espalda" },
  // HOMBROS
  { nombre:"Pike push-up",              musculo:"Hombros", desc:"En V invertida, flexiona codos para bajar la cabeza al suelo.",      tags:["sin equipo","empuje"],       filtro:"hombros" },
  { nombre:"Flexión lateral de hombro", musculo:"Hombros", desc:"De pie, eleva los brazos lateralmente.",                             tags:["sin equipo","básico"],       filtro:"hombros" },
  // BRAZOS
  { nombre:"Fondos en silla",            musculo:"Brazos",  desc:"Manos en silla detrás, baja y sube flexionando los codos.",          tags:["silla","tríceps"],           filtro:"brazos"  },
  { nombre:"Curl de bícep (sin peso)",   musculo:"Brazos",  desc:"Simula curl usando la resistencia del brazo contrario.",             tags:["sin equipo","bícep"],        filtro:"brazos"  },
  // CARDIO
  { nombre:"Jumping jacks",             musculo:"Cardio",  desc:"Salta abriendo y cerrando piernas y brazos. Activa el cuerpo.",      tags:["sin equipo","calentamiento"],filtro:"cardio"  },
  { nombre:"Burpees",                   musculo:"Cardio",  desc:"Plancha + salto. El ejercicio de cuerpo completo más exigente.",     tags:["sin equipo","completo"],     filtro:"cardio"  },
  { nombre:"Salto de cuerda (sin cuerda)",musculo:"Cardio",desc:"Imita el salto de cuerda sin usarla. Excelente cardio en casa.",     tags:["sin equipo","ritmo"],        filtro:"cardio"  },
];

function renderEjercicios(filtro = "todos") {
  const grid = document.getElementById("exerciseGrid");
  if (!grid) return;

  const lista = filtro === "todos"
    ? ejercicios
    : ejercicios.filter(e => e.filtro === filtro);

  if (!lista.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>Sin ejercicios en esta categoría aún.</p>
      </div>`;
    return;
  }

  grid.innerHTML = lista.map(e => `
    <div class="exercise-card">
      <div class="ex-muscle">${e.musculo}</div>
      <div class="ex-name">${e.nombre}</div>
      <div class="ex-desc">${e.desc}</div>
      <div class="ex-tags">
        ${e.tags.map(t => `<span class="ex-tag">${t}</span>`).join("")}
      </div>
    </div>
  `).join("");
}

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
