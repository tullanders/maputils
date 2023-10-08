import Plugin from "../pluginClass.mjs";

const plugin = new Plugin("StationsMarkers");

const layer = L.layerGroup();
plugin.Overlays = {
  'Train Stations': layer
};

const createMarker = (item) => {
  const marker =  L.circleMarker([item.latitude, item.longitude], {radius: 3, color: 'black', fillOpacity: 1, weight: 1, opacity: 1})
    .addTo(layer)
    .on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      plugin.dispatchEvent(new CustomEvent('EventFromPlugin', {detail: {data:item, eventName: 'stationClicked'}}));

  });
}



// Get stations through the station event
plugin.addEventListener('EventToPlugin', (e) => {
  if (e.detail.eventName == 'stations') {
    e.detail.data.then(data => {
      data.forEach(item => { 
        createMarker(item);
      });      
    })

  }

});

export default plugin;
