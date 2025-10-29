/**
 * Módulo para obtener imágenes satelitales sin API keys.
 * Usa NASA GIBS (público, sin autenticación).
 */

/**
 * Obtiene una imagen satelital (tile) para las coordenadas dadas.
 * @param {number} lon - Longitud en grados (-180..180)
 * @param {number} lat - Latitud en grados (-90..90)
 * @param {object} [options]
 * @param {number} [options.zoom=9] - Nivel de zoom (0..9)
 * @param {number} [options.days=80] - Días hacia atrás a intentar
 * @returns {Promise<HTMLImageElement>}
 */
function getTilePicture(lon, lat, options = {}) {
  const { zoom = 9, days = 80 } = options;
  const z = Math.max(0, Math.min(9, zoom));
  const clampedLat = Math.max(-85.05112878, Math.min(85.05112878, lat));
  
  const { x, y } = lonLatToTile(lon, clampedLat, z);
  const urls = buildTileUrls(x, y, z, days);
  return intentarCargar(urls);
}

// --- Helpers internos ---

function lonLatToTile(lon, lat, z) {
  const n = Math.pow(2, z);
  const x = Math.floor(((lon + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  );
  return { x, y };
}

function buildTileUrls(x, y, z, days) {
  const base = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best';
  const capas = [
    'VIIRS_SNPP_CorrectedReflectance_TrueColor',
    'MODIS_Terra_CorrectedReflectance_TrueColor'
  ];
  const tileMatrix = 'GoogleMapsCompatible_Level9';
  
  const urls = [];
  const hoy = new Date();
  const offsets = Array.from({ length: days }, (_, i) => -i);
  
  // Shuffle offsets para variar fechas
  for (let i = offsets.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [offsets[i], offsets[j]] = [offsets[j], offsets[i]];
  }
  
  for (const off of offsets) {
    const fecha = new Date(hoy);
    fecha.setUTCDate(fecha.getUTCDate() + off);
    const fechaStr = fecha.toISOString().slice(0, 10);
    const ts = Date.now();
    
    for (const capa of capas) {
      urls.push(`${base}/${capa}/default/${fechaStr}/${tileMatrix}/${z}/${y}/${x}.jpg?t=${ts}`);
    }
  }
  
  return urls;
}

async function intentarCargar(urls) {
  for (const url of urls) {
    try {
      const img = await cargarImagen(url);
      console.log('✓ Tile cargado:', url);
      return img;
    } catch (_) {
      // Silenciar 404s esperados, continuar con siguiente fecha
    }
  }
  throw new Error('No hay tiles disponibles para estas coordenadas en el rango de fechas.');
}

function cargarImagen(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}
