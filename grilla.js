/**
 * Gestión de la grilla 4×4 de imágenes satelitales.
 */

const MAX_ITEMS = 16;
const ultimas = [];

/**
 * Agrega una imagen a la grilla (al principio).
 * Mantiene solo las últimas 16.
 */
function agregarImagen(img) {
  ultimas.unshift(img);
  if (ultimas.length > MAX_ITEMS) {
    ultimas.length = MAX_ITEMS;
  }
  renderizarGrilla();
}

/**
 * Renderiza todas las imágenes en el DOM.
 */
function renderizarGrilla() {
  const $grid = document.getElementById('grid');
  if (!$grid) return;
  
  $grid.innerHTML = '';
  
  for (const img of ultimas) {
    const div = document.createElement('div');
    div.className = 'item';
    img.loading = 'lazy';
    img.decoding = 'async';
    div.appendChild(img);
    $grid.appendChild(div);
  }
  
  ajustarTamanoCeldas();
}

/**
 * Ajusta el tamaño de las celdas para que la grilla 4×4
 * entre completa sin scroll vertical.
 */
function ajustarTamanoCeldas() {
  const $grid = document.getElementById('grid');
  if (!$grid) return;
  
  const estilos = getComputedStyle($grid);
  const gap = parseFloat(estilos.gap) || 0;
  const cols = 4, rows = 4;
  const totalGapW = gap * (cols - 1);
  const totalGapH = gap * (rows - 1);
  const cw = $grid.clientWidth;
  const ch = $grid.clientHeight;
  
  if (!cw || !ch) return;
  
  const cellFromWidth = (cw - totalGapW) / cols;
  const cellFromHeight = (ch - totalGapH) / rows;
  const cell = Math.max(0, Math.floor(Math.min(cellFromWidth, cellFromHeight)));
  
  $grid.style.setProperty('--cell', `${cell}px`);
}

// Escuchar cambios de tamaño de ventana
window.addEventListener('resize', ajustarTamanoCeldas);
window.addEventListener('DOMContentLoaded', ajustarTamanoCeldas);
