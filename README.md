# Map Utils
This javascript utility makes it easier to create maps with multiple layers and data sources. It uses Leaflet as map framework.

## Overview
Map Utils is a javascript framework for working with plugin architecture where each plugin has no dependency to other plugins. The only global objects is the DOM and Leaflet map. Map Util is suitable for not just map, but to all kinds of javascript solutions with intensive data flow.

The framework contains two important functions:
1. Orchestrate plugins
2. The plugins

### pluginManager.js
Plugin Manager has responsibility to:
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

# Set up
To use all the sample plugins you must create a key for getting data from Trafikverket´s Open API (Swedish Transport Administration).