// Import all plugins
import openrailwaymap from './modules/openrailwaymap.mjs';
import osm from './modules/osm.mjs';
import stationsdata from './modules/stationsdata.mjs';
import trainIcons from './modules/trainicons.mjs';
import stationMarkers from './modules/stationmarkers.mjs';
import trainAnnouncement from './modules/trainannouncement.mjs';
import smhiradar from './modules/smhiradar.mjs';
import sidebar from './modules/sidebar.mjs';
import stationsidebar from './modules/stationsidebar.mjs';
import trainMessage from './modules/trainmessage.mjs';

// Push plugins to array
const plugins = [osm, openrailwaymap,smhiradar, stationsdata, trainAnnouncement, trainIcons, trainMessage, sidebar, stationMarkers, stationsidebar];

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

// Send to all plugins that they have been loaded
plugins.forEach(plugin => {
    plugin.dispatchEvent(new CustomEvent('EventToPlugin', {detail: {sender: plugin, data:plugin.Name, eventName: 'pluginLoaded'}}));
});

// Add layers to map
var layerControl = L.control.layers(baseLayers, overlays).addTo(map);