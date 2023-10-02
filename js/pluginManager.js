// Import all plugins
import openrailwaymap from './modules/openrailwaymap.mjs';
import osm from './modules/osm.mjs';
import trainIcons from './modules/trainicons.mjs';
import stationsdata from './modules/stationsdata.mjs';
import stationMarkers from './modules/stationmarkers.mjs';
import trainAnnouncement from './modules/trainannouncement.mjs';
import trvwms from './modules/trvwms.mjs';
import smhiradar from './modules/smhiradar.mjs';

// Push plugins to array
const plugins = [osm, openrailwaymap, stationsdata, stationMarkers, trainAnnouncement, trainIcons, trvwms, smhiradar];

// Add layers from plugins and also listen for events from plugins
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

// Dispatch event to all plugins except sender
const sendEvent = (sender, eventName, payload) => {
    plugins.forEach(plugin => {
        if (sender.Name != plugin.Name) plugin.dispatchEvent(new CustomEvent('EventToPlugin', {detail: {sender: sender, data:payload, eventName: eventName}}));
    });
};

// Add layers to map
var layerControl = L.control.layers(baseLayers, overlays).addTo(map);

