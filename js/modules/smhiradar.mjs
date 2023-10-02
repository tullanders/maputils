import Plugin from "../pluginClass.mjs";

const plugin = new Plugin("SMHI Radar");
const maxZoom = 19;

// REFERENSDOKUMENTATION:
// https://www.smhi.se/data/utforskaren-oppna-data/se-acmf-meteorologiska-observationer-radarbilder-png-och-geotif

var imageUrl = 'https://opendata-download-radar.smhi.se/api/version/latest/area/sweden/product/comp/latest.png',
    imageBounds = [[53.869605, 9.319165 ], [69.419707, 29.799063]];


plugin.Overlays = {
    'SMHI Radar': L.imageOverlay(imageUrl, imageBounds)
    };


export default plugin;
