const ejercicios = [
  { nombre:"Flexiones estándar", musculo:"Pecho", desc:"Posición clásica de empuje. Manos al ancho de hombros.", tags:["sin equipo","empuje"], filtro:"pecho" },
  { nombre:"Flexiones diamante", musculo:"Pecho", desc:"Manos formando un diamante. Mayor activación de tríceps.", tags:["sin equipo","tríceps"], filtro:"pecho" },
  { nombre:"Sentadilla", musculo:"Piernas", desc:"El ejercicio fundamental de tren inferior.", tags:["sin equipo","básico"], filtro:"piernas" },
  { nombre:"Plancha", musculo:"Core", desc:"Posición isométrica.", tags:["sin equipo","isometría"], filtro:"core" },
  { nombre:"Superman", musculo:"Espalda", desc:"Boca abajo, eleva brazos y piernas.", tags:["suelo","lumbar"], filtro:"espalda" },
  { nombre:"Pike push-up", musculo:"Hombros", desc:"Trabaja hombros y tríceps.", tags:["sin equipo","empuje"], filtro:"hombros" },
  { nombre:"Fondos en silla", musculo:"Brazos", desc:"Excelente para tríceps.", tags:["silla","tríceps"], filtro:"brazos" },
  { nombre:"Burpees", musculo:"Cardio", desc:"Ejercicio de cuerpo completo.", tags:["sin equipo","completo"], filtro:"cardio" }
];

function renderEjercicios(filtro = "todos") {
  const grid = document.getElementById("exerciseGrid");
  if (!grid) return;

  const lista = filtro === "todos"
    ? ejercicios
    : ejercicios.filter(e => e.filtro === filtro);

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

document.querySelectorAll(".pill").forEach(pill => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    renderEjercicios(pill.dataset.filter);
  });
});

renderEjercicios();
