
// const coords = {
//   lat: -34.6037,
//   lon: -58.3816
// };

function viajar(coords_) {
  console.log('Viajando a:', coords_);
  // clase loading  
  getTilePicture(coords_.lon, coords_.lat, { zoom: 9, days: 80 }) // sky.js

}

// iniciarConGeolocalizacion(); // navigator.geolocation.getCurrentPosition


// iniciarConIpApi(); // fetch('https://ipapi.co/json/')

