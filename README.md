# Map Utils
This javascript utility makes it easier to create maps with many layers and complex data sources, especially streaming data. It uses Leaflet as map framework.

## Overview
Map Utils is a Javascript framework that targets easy and robust code management and development when adding new features and functionality. 

The framework contains two important features:
1. Orchestrate plugins
2. The plugins

### pluginManager.js
Plugin Manager orchestrates all plugins.

1. Load all plugins
2. Recieve events from each plugin
3. Broadcast those events to every other plugins
4. Collect map layers from plugins that has one
    * Map Layers can be of type *BaseMap* or *Overlay*
5. Add map layers to Leaflet (or actually to layer control)

### pluginClass.js
This is the base class for all plugins. It derives from EventTarget that make it possible for creating and recieving events.
#### Event types
* EventFromPlugin (plugin -> pluginManager)
* EventToPlugin (pluginManager->plugin)

# How to run this sample
Download the code and just run index.html.

## Sample plugins
Some of the sample plugins requires a key from [Trafikverket (Swedish Transport Administration)](https://api.trafikinfo.trafikverket.se/API). It's Open Data and anyone can register to get access to their API. 

Sample Plugins:
* osm.mjs - provides a OpenStreetMap basemap to Leaflet
* openrailwaymap.mjs - provides overlays with different OSM-features
* stationsdata.mjs - gets all the primary stations in Sweden through Trafikverket´s API
* stationmarkers.mjs - Creates cicleMarker overlay to the Leaflet map
* trainannouncement.mjs - fetches train movements in realtime. It uses SSE (Server Send Event, Eventsourcing) service from Trafikverket
* trainicons.mjs - creates markers for the trains
* pluginSkeleton.mjs - a template for creating new map layers and data sources.

# Tutorial - create plugins
In this tutorial we'll create two plugins:
1. First plugin (data only). Gets your current location with Geolocation API (data only) and trigger event with coordinates as payload
2. Second plugin (map layer): Recieves event from first plugin and adds a marker layer to the map

## Plugin MyLocationData
This plugin is only a data source. It try to get the position object from the browsers Geolocation API and create an event and send it as the payload.

1. Copy pluginSkeleton.js into the modules folder
2. Rename it to "mylocationData.mjs"
3. Remove all content in the file
2. Paste the following code:
```
import Plugin from "../pluginClass.mjs";

const plugin = new Plugin("MyLocationData");

const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      plugin.dispatchEvent(new CustomEvent('EventFromPlugin', {detail: {data:position, eventName: 'Location'}}));
    });
  } 
}
export default plugin;

```
One done, one to go!

## Plugin MyLocationLayer
This plugin will expose a Leaflet Marker for the plugin manager with coordinates from the previous plugin. 

1. Copy pluginSkeleton.js into the modules folder
2. Rename it to "mylocationData.mjs"
3. Remove all content in the file
4. Paste the following code:
```
import Plugin from "../pluginClass.mjs";

const plugin = new Plugin("MyLocationLayer");

const marker = L.marker([0,0]);

plugin.Overlays = {
  'My position': marker
};

plugin.addEventListener('EventToPlugin', (e) => {
  console.log(e.detail)
  if (e.detail.eventName == 'Location' && e.detail.sender == 'MyLocationData') {
    console.log(e.detail.data.coords)
    const coords = [e.detail.data.coords.latitude, e.detail.data.coords.longitude];
    marker.setLatLng(coords);
  }

});

export default plugin;
```
And we´re done! We have accomplished two plugins with minimal code. Note that mylocationlayer.mjs is acually exposing a layerGroup to the pluginManager. It's most likely that the layer plugin will get coordinates *after* it has been created, so it's a good idea to provide a layerGroup and then we can add the marker when we recieve coordinates.