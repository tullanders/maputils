import Plugin from "../pluginClass.mjs";

const plugin = new Plugin("TrainIcons");

const layer = L.markerClusterGroup({chunkDelay:2000});

plugin.Overlays = {
  'Trains': layer
};

const createHtmlPopup = (item) => {
  let html = `<b>${(item.trainId) ? item.trainId : item.otn}</b>
  <br>${item.trainOwner}
  <br>${item.signature}
  <br>${item.plannedTime}
  <br>${item.actualTime}`;

  return html;
}

const createIcon = (item) => {
  const marker = L.marker(item.coordinates).bindPopup(createHtmlPopup(item));
  layer.addLayer(marker); 
  return marker;
}

const updatePosition = (item) => {
  const icon = trains.get(item.trainId);
  if (item && item.coordinates) icon.setLatLng(item.coordinates);
  var popup = icon.getPopup();
   popup.setContent(createHtmlPopup(item));
}

// Keep the trains in a map
const trains = new Map();

// Listen from stations and trains 
// (we can't do anytning until we have both because we need to know the coordinates of the stations)
plugin.addEventListener('EventToPlugin', (e) => {
  if (e.detail.eventName == 'trainData') {
    e.detail.data.forEach(item => {
      // check if train already exists
      if (trains.has(item.trainId)) {
        updatePosition(item);
      } 
      else {
        trains.set(item.trainId, createIcon(item)); 
      } 
    });
  }
});

export default plugin;
