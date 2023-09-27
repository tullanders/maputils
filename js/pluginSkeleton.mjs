import Plugin from "../pluginClass.mjs";

const plugin = new Plugin("SkeletonPlugin");

const marker = L.marker([60.61796757372054,15.617887147843696])
  .on('click', () => {
    plugin.dispatchEvent(new CustomEvent('EventFromPlugin', {detail: {data:'Hello From Skeleton', eventName: 'MarkerClick'}}));
  });

plugin.Overlays = {
  'Town Falun': marker
};

plugin.addEventListener('EventToPlugin', (e) => {
  if (e.detail.eventName == 'stations') {
    console.log(e.detail);
  }

});

export default plugin;
