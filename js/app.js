// ===== Estado =====
let tareas = [];
let siguienteId = 1;

// ===== Referencias al DOM =====
const formulario = document.getElementById('formulario');
const campo = document.getElementById('nueva-tarea');
const mensajeError = document.getElementById('error');
const lista = document.getElementById('lista');
const mensajeVacio = document.getElementById('vacio');
const spanTotal = document.getElementById('total');
const spanCompletadas = document.getElementById('completadas');
const spanPendientes = document.getElementById('pendientes');
const progreso = document.getElementById('progreso');
const progresoBarra = document.getElementById('progreso-barra');
const progresoTexto = document.getElementById('progreso-texto');

// ===== Lógica =====
function agregarTarea(texto) {
  tareas.push({ id: siguienteId++, texto: texto, completada: false });
  render();
}

function completarTarea(id) {
  const tarea = tareas.find((t) => t.id === id);
  if (tarea) {
    tarea.completada = true;
    render();
  }
}

function eliminarTarea(id) {
  tareas = tareas.filter((t) => t.id !== id);
  render();
}

// ===== Vista =====
function crearElementoTarea(tarea) {
  const li = document.createElement('li');
  li.className = 'tarea' + (tarea.completada ? ' tarea--completada' : '');
  li.dataset.id = tarea.id;

  const texto = document.createElement('p');
  texto.className = 'tarea__texto';
  texto.textContent = (tarea.completada ? '[x] ' : '[ ] ') + tarea.texto;

  const acciones = document.createElement('div');
  acciones.className = 'tarea__acciones';

  // El botón Completar desaparece cuando la tarea ya está completada
  if (!tarea.completada) {
    const btnCompletar = document.createElement('button');
    btnCompletar.type = 'button';
    btnCompletar.className = 'btn-completar';
    btnCompletar.textContent = 'Completar';
    acciones.appendChild(btnCompletar);
  }

  const btnEliminar = document.createElement('button');
  btnEliminar.type = 'button';
  btnEliminar.className = 'btn-eliminar';
  btnEliminar.textContent = 'Eliminar';
  acciones.appendChild(btnEliminar);

  li.append(texto, acciones);
  return li;
}

function actualizarContador() {
  const total = tareas.length;
  const completadas = tareas.filter((t) => t.completada).length;
  const porcentaje = total === 0 ? 0 : Math.round((completadas / total) * 100);

  spanTotal.textContent = total;
  spanCompletadas.textContent = completadas;
  spanPendientes.textContent = total - completadas;

  progresoBarra.style.width = porcentaje + '%';
  progreso.setAttribute('aria-valuenow', porcentaje);
  progresoTexto.textContent = porcentaje + '% completado';
}

function render() {
  lista.innerHTML = '';
  tareas.forEach((tarea) => lista.appendChild(crearElementoTarea(tarea)));
  mensajeVacio.hidden = tareas.length > 0;
  actualizarContador();
}

// ===== Eventos =====
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const texto = campo.value.trim();

  if (texto === '') {
    mensajeError.hidden = false;
    campo.focus();
    return;
  }

  mensajeError.hidden = true;
  agregarTarea(texto);
  campo.value = '';
  campo.focus();
});

// Delegación de eventos: un solo listener para todos los botones de la lista
lista.addEventListener('click', (evento) => {
  const boton = evento.target.closest('button');
  if (!boton) return;

  const id = Number(boton.closest('.tarea').dataset.id);

  if (boton.classList.contains('btn-completar')) {
    completarTarea(id);
  } else if (boton.classList.contains('btn-eliminar')) {
    eliminarTarea(id);
  }
});

campo.addEventListener('input', () => {
  if (campo.value.trim() !== '') mensajeError.hidden = true;
});

render();
