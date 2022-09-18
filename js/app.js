// Constructores

function Seguro(marca, year, tipo) {
  this.marca = marca;
  this.year = year;
  this.tipo = tipo;
}

// Realiza la cotizacion

Seguro.prototype.cotizarSeguro = function () {
  /*
        1 = Americano 1.15
        2 = Asiatico 1.05
        3 = Europeo 1.35
    */

  let cantidad;
  const base = 2000;

  switch (this.marca) {
    case "1":
      cantidad = base * 1.15;
      break;
    case "2":
      cantidad = base * 1.05;
      break;
    case "3":
      cantidad = base * 1.35;
      break;
    default:
      break;
  }

  //leer el año
  const diferencia = new Date().getFullYear() - parseInt(this.year);

  // cada año que la diferencia es mayor, el costo se va reducir un 3%.
  cantidad -= (diferencia * 3 * cantidad) / 100;

  /*
    Si el seguro es básico se multiplica por un 30% más
    Si el seguro es completo se multiplica por un 50% más
  */

  if (this.tipo === "basico") {
    cantidad *= 1.3;
  } else {
    cantidad *= 1.5;
  }

  return cantidad;
};

function UI() {}

UI.prototype.llenarOpciones = () => {
  const max = new Date().getFullYear();
  min = max - 20;

  const selectYear = document.querySelector("#year");

  for (let i = max; i >= min; i--) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = i;

    selectYear.appendChild(option);
  }
};
//Muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
  const alerta = document.querySelector(".mensaje");
  if (alerta) {
    return;
  }
  const div = document.createElement("div");

  if (tipo === "error") {
    div.classList.add("error");
  } else {
    div.classList.add("correcto");
  }
  div.classList.add("mensaje", "mt-10");
  div.textContent = mensaje;

  //insertar en el html
  const formulario = document.querySelector("#cotizar-seguro");
  formulario.insertBefore(div, document.querySelector("#resultado"));

  setTimeout(() => {
    div.remove();
  }, 3000);
};

UI.prototype.mostrarResultado = (total, seguro) => {
  const { marca, year, tipo } = seguro;
  let textoMarca;
  switch (marca) {
    case "1":
      textoMarca = "Americano";
      break;
    case "2":
      textoMarca = "Asiatico";
      break;
    case "3":
      textoMarca = "Europeo";
      break;
    default:
      break;
  }
  //Crear el resultado
  const div = document.createElement("div");
  div.classList.add("mt-10");

  div.innerHTML = `
        <p class="header">Tu Resumen </p>
        <p class="font-bold">Marca: <span class="font-normal">${textoMarca}</span> </p>
        <p class="font-bold">Año: <span class="font-normal"> ${year}</span> </p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize"> ${tipo}</span> </p>
        <p class="font-bold">Total: <span class="font-normal">$ ${total}</span> </p>
    `;

  const resultadoDiv = document.querySelector("#resultado");

  // Mostrar el spinner
  const spinner = document.querySelector("#cargando");
  spinner.style.display = "block";
  setTimeout(() => {
    spinner.style.display = "none";
    resultadoDiv.appendChild(div);
  }, 3000);
};

// Instanciar ui
const ui = new UI();

document.addEventListener("DOMContentLoaded", () => {
  ui.llenarOpciones();
});

eventListeners();
function eventListeners() {
  const formulario = document.querySelector("#cotizar-seguro");
  formulario.addEventListener("submit", cotizarSeguro);
}

function cotizarSeguro(e) {
  e.preventDefault();

  // Leer marca seleccionada
  const marca = document.querySelector("#marca").value;
  //Leer año seleccionado
  const year = document.querySelector("#year").value;

  // leer tipo de seguro
  const tipo = document.querySelector('input[name="tipo"]:checked').value;

  if (marca === "" || year === "" || tipo === "") {
    ui.mostrarMensaje("Todos los campos son obligatorios", "error");
    return;
  }
  //Ocultar cotizaciones previas
  const resultados = document.querySelector("#resultado div");
  if (resultados !== null) {
    resultados.remove();
  }

  ui.mostrarMensaje("Cotizando...", "exito");

  //Instanciar el seguro
  const seguro = new Seguro(marca, year, tipo);
  const total = seguro.cotizarSeguro();

  //Utilizar el prototype que va cotizar
  ui.mostrarResultado(total, seguro);
}
