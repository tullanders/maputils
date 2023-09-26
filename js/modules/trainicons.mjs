import Plugin from "../pluginClass.mjs";

const plugin = new Plugin("TrainIcons");
let stations;
const signatureToCoordinates = (signature) => {
  const station = stations.find(item => item.stationSignature == signature);
  return [station.latitude, station.longitude];
}

const layer = L.layerGroup();
plugin.Overlays = {
  'Trains': layer
};

const createIcon = (item) => {
  return L.marker(signatureToCoordinates(item.LocationSignature))
  .bindPopup(item.AdvertisedTrainIdent).addTo(layer);
  
}

// Keep the trains in a map
const trains = new Map();

// Listen from stations and trains 
// (we can't do anytning until we have both because we need to know the coordinates of the stations)

plugin.addEventListener('EventToPlugin', (e) => {
  if (e.detail.eventName == 'stations') {
    stations = e.detail.data;
  }

  if (e.detail.eventName == 'trainData') {
    const data = e.detail.data;
    data.forEach(item => {
      trains.set(item.AdvertisedTrainIdent, item);
    });
    trains.forEach((value, key) => {
      console.log(value, key)

      createIcon(value);
    });

    console.log(trains)
  }
});

export default plugin;
