import Plugin from "../pluginClass.mjs";

const plugin = new Plugin("StationSidebar");

let openSidebar;
plugin.addEventListener('EventToPlugin', (e) => {
  if (e.detail.eventName == 'sidebarLoaded') {
    openSidebar = e.detail.data;
  };

  if (e.detail.eventName == 'stationClicked' && openSidebar) {
    // add marker to map:
    var marker = L.marker([e.detail.data.latitude, e.detail.data.longitude]).addTo(map);

    // create sidebar html
    const div = document.createElement('div');
    const h1 = document.createElement('h1');
    h1.innerHTML = e.detail.data.name;
    div.appendChild(h1);  

    // open sidebar (function from sidebar plugin)
    openSidebar(div);

    // center map:
    map.panTo([e.detail.data.latitude, e.detail.data.longitude]);

    map.on('click', () => {
      map.removeLayer(marker);
    });
  }

});

export default plugin;
