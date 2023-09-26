
const plugins = [];
import openrailwaymap from './modules/openrailwaymap.mjs';
import osm from './modules/osm.mjs';
import stations from './modules/stations.mjs';
import trainAnnouncement from './modules/trainannouncement.mjs';
import trainIcons from './modules/trainicons.mjs';


plugins.push(osm);
plugins.push(openrailwaymap);
plugins.push(stations);
plugins.push(trainAnnouncement);
plugins.push(trainIcons);


const baseLayers = {};
const overlays = {};

plugins.forEach(plugin => {
    if (plugin.BaseLayers) {
        Object.assign(baseLayers, plugin.BaseLayers);

    };

    if (plugin.Overlays) {
        Object.assign(overlays, plugin.Overlays);
    };

    plugin.addEventListener('EventFromPlugin', (e) => {
        sendEvent(plugin.Name,e.detail.eventName, e.detail.data)
    });

});

const sendEvent = (sender, eventName, payload) => {
    plugins.forEach(plugin => {
        if (sender.Name != plugin.Name) plugin.dispatchEvent(new CustomEvent('EventToPlugin', {detail: {sender: sender, data:payload, eventName: eventName}}));
    });
};

var layerControl = L.control.layers(baseLayers, overlays).addTo(map);

