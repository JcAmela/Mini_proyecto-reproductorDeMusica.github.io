// Declaración de variables y elementos de la interfaz
let listaCanciones = [
  {
    nombre: "Primera canción",
    archivo: "1.mp3",
  },
  {
    nombre: "Segunda canción",
    archivo: "2.mp3",
  },
  {
    nombre: "Tercera canción",
    archivo: "3.mp3",
  },
];

let indiceCancionActual = null;
let modoAleatorio = false;
let modoRepetir = false;

const vistaListaCanciones = document.getElementById("trackList");
const reproductorAudio = document.getElementById("musicPlayer");
const vistaNombreCancion = document.getElementById("trackName");
const botonReproducir = document.getElementById("playButton");
const botonPausar = document.getElementById("pauseButton");
const botonAnterior = document.getElementById("previousButton");
const botonSiguiente = document.getElementById("nextButton");
const barraProgreso = document.getElementById("progressBar");
const contenedorBarraProgreso = document.getElementById("progress-container");

// Asignar eventos a los botones de reproducir y pausar
botonReproducir.addEventListener("click", reproducirCancionActual);
botonPausar.addEventListener("click", pausarCancionActual);

// Funciones para reproducir y pausar canciones
function reproducirCancionActual() {
  reproductorAudio.play();
  botonReproducir.style.display = 'none';
  botonPausar.style.display = 'inline';
}

function pausarCancionActual() {
  reproductorAudio.pause();
  botonReproducir.style.display = 'inline';
  botonPausar.style.display = 'none';
}

// Controlar la barra de progreso
contenedorBarraProgreso.addEventListener("click", establecerProgresoReproduccion);
reproductorAudio.addEventListener("timeupdate", actualizarProgresoReproduccion);

function actualizarProgresoReproduccion(evento) {
  const { duration, currentTime } = evento.srcElement;
  const porcentajeProgreso = (currentTime / duration) * 100;
  barraProgreso.style.width = porcentajeProgreso + "%";
}

function establecerProgresoReproduccion(evento) {
  const anchoTotal = this.offsetWidth;
  const posicionClic = evento.offsetX;
  const tiempoActual = (posicionClic / anchoTotal) * reproductorAudio.duration;
  reproductorAudio.currentTime = tiempoActual;
}

// Cambiar la canción en reproducción
function cambiarClaseActiva(ultimoIndice, nuevoIndice) {
  const enlaces = document.querySelectorAll("a");
  if (ultimoIndice !== null) {
    enlaces[ultimoIndice].classList.remove("active");
  }
  enlaces[nuevoIndice].classList.add("active");
}

function cambiarTituloCancion(indiceCancion) {
  vistaNombreCancion.innerText = listaCanciones[indiceCancion].nombre;
}

// Cargar las canciones y actualizar la interfaz
function cargarCanciones() {
  vistaListaCanciones.innerHTML = '';
  listaCanciones.forEach((cancion, indice) => {
    const li = document.createElement("li");
    const enlace = document.createElement("a");
    enlace.textContent = cancion.nombre;
    enlace.href = "#";
    enlace.addEventListener("click", () => cargarCancion(indice));
    li.appendChild(enlace);
    vistaListaCanciones.appendChild(li);
  });
  
  // Cargar la primera canción en la lista
  cargarCancion(0);
}

function cargarCancion(indiceCancion) {
  if (indiceCancion !== indiceCancionActual) {
    cambiarClaseActiva(indiceCancionActual, indiceCancion);
    indiceCancionActual = indiceCancion;
    reproductorAudio.src = "./audio/" + listaCanciones[indiceCancion].archivo;
    reproducirCancionActual();
    cambiarTituloCancion(indiceCancion);
  }
}

// Saltar a la siguiente canción
botonSiguiente.addEventListener("click", siguienteCancion);
botonAnterior.addEventListener("click", cancionAnterior);

function cancionAnterior() {
  if (indiceCancionActual > 0) {
    cargarCancion(indiceCancionActual - 1);
  } else {
    cargarCancion(listaCanciones.length - 1);
  }
}

function siguienteCancion() {
  if (indiceCancionActual < listaCanciones.length - 1) {
    cargarCancion(indiceCancionActual + 1);
  } else {
    cargarCancion(0);
  }
}

// Repetir la canción si se termina
reproductorAudio.addEventListener("ended", () => {
  if (modoRepetir) {
    cargarCancion(indiceCancionActual);
  } else {
    siguienteCancion();
  }
});

// Cargar las canciones al cargar la página
window.addEventListener("load", cargarCanciones);
