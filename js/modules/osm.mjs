import Plugin from "../pluginClass.mjs";

const plugin = new Plugin("OSM");
const maxZoom = 19;

plugin.BaseLayers = {
    'Color map': L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18,attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}),
    'Grayscale map': L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {className:'leaflet-grayscale', maxZoom: 18,attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'})
    };

export default plugin;
