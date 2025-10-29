/**
 * Lógica principal: coordenadas, eventos, viajes.
 */

const coords = {
  lat: -34.6037,
  lon: -58.3816
};

function viajar(coords_) {
  console.log('Viajando a:', coords_);
  document.body.classList.add('loading');
  
  getTilePicture(coords_.lon, coords_.lat, { zoom: 9, days: 80 })
    .then((img) => {
      agregarImagen(img);
      
      // Modificar coords para el próximo viaje
      coords_.lat += Math.random() * 1 - 0.5;
      coords_.lon += Math.random() * 1 - 0.5;
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(() => {
      document.body.classList.remove('loading');
    });
}

function iniciarConGeolocalizacion() {
  navigator.geolocation.getCurrentPosition((pos) => {
    console.log('Posición inicial:', pos.coords);
    const coords = {
      lat: pos.coords.latitude,
      lon: pos.coords.longitude
    };

  // Auto-viajar cada 3 segundos
    setInterval(() => {
      viajar(coords);
    }, 3000);
  });
  
}
function iniciarConIpApi() {
  fetch('https://ipapi.co/json/')
    .then((resp) => resp.json())
    .then((data) => {
      console.log('Posición inicial por IP:', data);
      const coords = {
        lat: data.latitude,
        lon: data.longitude
      };

      // Auto-viajar cada 3 segundos
      setInterval(() => {
        viajar(coords);
      }, 3000);
    })
    .catch((e) => {
      console.error('Error obteniendo ubicación por IP:', e);
    });
}


// iniciarConGeolocalizacion();
iniciarConIpApi();

