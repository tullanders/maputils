import Plugin from "../pluginClass.mjs";

const plugin = new Plugin("OpenRailwayMap");
const maxZoom = 19;

plugin.Overlays = {
    'OpenRailwayMap' : L.tileLayer('http://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {maxZoom: maxZoom, attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, rendering CC-BY-SA OpenRailwayMap'}),
    'maxspeed' : L.tileLayer('http://{s}.tiles.openrailwaymap.org/maxspeed/{z}/{x}/{y}.png', {maxZoom: maxZoom, attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, rendering CC-BY-SA OpenRailwayMap'}),
    'signals' : L.tileLayer('http://{s}.tiles.openrailwaymap.org/signals/{z}/{x}/{y}.png', {maxZoom: maxZoom, attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, rendering CC-BY-SA OpenRailwayMap'}),
    'electrification' : L.tileLayer('http://{s}.tiles.openrailwaymap.org/electrification/{z}/{x}/{y}.png', {maxZoom: maxZoom, attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, rendering CC-BY-SA OpenRailwayMap'}),
    'gauge' : L.tileLayer('http://{s}.tiles.openrailwaymap.org/gauge/{z}/{x}/{y}.png', {maxZoom: maxZoom, attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, rendering CC-BY-SA OpenRailwayMap'}),
    }; 



export default plugin;
