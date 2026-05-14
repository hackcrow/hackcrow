/* Workout v7 - library.js */

const ejercicios = [
  { nombre:"Flexiones estándar", musculo:"Pecho", desc:"Posición clásica de empuje. Manos al ancho de hombros.", tags:["sin equipo","empuje"], filtro:"pecho" },
  { nombre:"Flexiones diamante", musculo:"Pecho", desc:"Manos formando un diamante. Mayor activación de tríceps.", tags:["sin equipo","tríceps"], filtro:"pecho" },
  { nombre:"Flexiones declinadas", musculo:"Pecho", desc:"Pies elevados para trabajar el pecho superior.", tags:["sin equipo","empuje"], filtro:"pecho" },
  { nombre:"Flexiones inclinadas", musculo:"Pecho", desc:"Manos elevadas. Activa el pecho inferior.", tags:["sin equipo","empuje"], filtro:"pecho" },

  { nombre:"Sentadilla", musculo:"Piernas", desc:"El ejercicio fundamental de tren inferior.", tags:["sin equipo","básico"], filtro:"piernas" },
  { nombre:"Zancada estática", musculo:"Piernas", desc:"Un pie adelantado. Baja la rodilla trasera.", tags:["sin equipo","glúteo"], filtro:"piernas" },
  { nombre:"Sentadilla búlgara", musculo:"Piernas", desc:"Pie trasero elevado.", tags:["silla","glúteo"], filtro:"piernas" },
  { nombre:"Puente de glúteo", musculo:"Piernas", desc:"Eleva caderas contrayendo glúteos.", tags:["suelo","glúteo"], filtro:"piernas" },

  { nombre:"Plancha", musculo:"Core", desc:"Mantén el cuerpo recto.", tags:["sin equipo","isometría"], filtro:"core" },
  { nombre:"Crunch", musculo:"Core", desc:"Eleva solo los hombros.", tags:["suelo","básico"], filtro:"core" },
  { nombre:"Elevación de piernas", musculo:"Core", desc:"Sube y baja piernas.", tags:["suelo","abdomen"], filtro:"core" },

  { nombre:"Superman", musculo:"Espalda", desc:"Eleva brazos y piernas.", tags:["suelo","lumbar"], filtro:"espalda" },
  { nombre:"Pike push-up", musculo:"Hombros", desc:"Flexiona codos en V.", tags:["sin equipo","empuje"], filtro:"hombros" },
  { nombre:"Fondos en silla", musculo:"Brazos", desc:"Tríceps usando silla.", tags:["silla","tríceps"], filtro:"brazos" },
  { nombre:"Burpees", musculo:"Cardio", desc:"Plancha + salto.", tags:["sin equipo","completo"], filtro:"cardio" }
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
      </div>
    `;
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
