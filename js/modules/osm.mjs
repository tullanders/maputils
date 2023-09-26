import Plugin from "../pluginClass.mjs";

const plugin = new Plugin("OSM");
const maxZoom = 19;

plugin.BaseLayers = {
    'OpenStreetMap': L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18,attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'})
    };

plugin.addEventListener('EventToPlugin', (e) => {
    console.log(e);
});


export default plugin;
