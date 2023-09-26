export default class Plugin extends EventTarget{
    #baseLayers;
    #overlays;
    #data;
    constructor(name) {
        super();
        this.Name = name;
    };

    // Used by other plugins to get data from the plugin instance
    get Data() {
        return this.#data;
    }
    
    set Data(data) {
        this.#data = data;
    };

    // Used by pluginManager to get map layers
    get BaseLayers() {
        return this.#baseLayers;
    }

    // Set layers from the instance
    set BaseLayers(layers) {
        this.#baseLayers = layers;
    };

    // Used by pluginManager to get map layers
    get Overlays() {
        return this.#overlays;
    }

    // Set layers from the instance
    set Overlays(layers) {
        this.#overlays = layers;
    };
  }