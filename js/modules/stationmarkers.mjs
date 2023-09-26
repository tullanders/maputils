import Plugin from "../pluginClass.mjs";

const plugin = new Plugin("StationsMarkers");
let stations;
const signatureToCoordinates = (signature) => {
  if (signature == undefined) return [0,0];
  const station = stations.find(item => item.stationSignature == signature && item.latitude && item.longitude);
  return [station.longitude, station.latitude];
}

const layer = L.layerGroup();
plugin.Overlays = {
  'Trainstations': layer
};

const createMarker = (item) => {
  console.log(item);  
  return L.circleMarker([item.latitude, item.longitude], {radius: 3, color: 'black', fillOpacity: 1, weight: 1, opacity: 1})
  .bindPopup(item.stationName).addTo(layer); 
}



// Listen from stations and trains 
// (we can't do anytning until we have both because we need to know the coordinates of the stations)

plugin.addEventListener('EventToPlugin', (e) => {
  if (e.detail.eventName == 'stations') {
    console.log(e.detail.data);
    stations = e.detail.data;
    e.detail.data.forEach(item => { 
      createMarker(item);
    });
  }

});

export default plugin;
