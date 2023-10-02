import Plugin from "../pluginClass.mjs";

const plugin = new Plugin("TRV WMS");
const maxZoom = 19;
const layers = {};

plugin.Overlays = layers;



const getLayers = () => {
    const url = 'https://geo-baninfo.trafikverket.se/mapservice/wms.axd/BanInfo?';
    let xhr = new XMLHttpRequest();
    const layers = {};
    xhr.open('GET', url + "request=getcapabilities&SERVICE=WMS", false);
    xhr.send('');
    if (xhr.status != 200) { // analyze HTTP status of the response
        console.log(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
    } else { // show the result


        let xml = xhr.responseXML;
        

        let wmsLayers = xml.getElementsByTagName('Layer');
        let _this = this;
        for (var i = 0; i < wmsLayers.length; i++) {
            let onlineRes = wmsLayers[i].querySelector('Style >LegendURL>OnlineResource');
            let imgUrl;
            if (onlineRes && onlineRes.hasAttribute('xlink:href')) {
                imgUrl = onlineRes.getAttribute('xlink:href');
            };

            let key = wmsLayers[i].querySelector('Title').innerHTML;
            let item = L.tileLayer.wms(url, {
                layers: wmsLayers[i].querySelector('Name').innerHTML,
                name: wmsLayers[i].querySelector('Title').innerHTML,
                format: 'image/png',
                transparent: 'true'
            }).on('add', function (e) {

                if (imgUrl) {
                    let a = document.createElement('a');
                    a.setAttribute('href', '#');
                    a.className = 'legendLink'
                    a.addEventListener('click',function () {
                        window.open(imgUrl);
                        return;
                    });
                    a.innerHTML = 'Visa legend för ' + key + '<br/>';
                    a.id = e.target.wmsParams.layers;
                    //_this.legendControl.getContainer().appendChild(a)

                }

            }).on('remove', function (e) {
                //if (currentLegendWindow) { currentLegendWindow.close(); };
                //currentLegendWindow = null;
                let a = document.getElementById(e.target.wmsParams.layers);
                if (a) a.remove();
            });

            layers[key] = item;
        };

        return layers;

    };        
}
Object.assign(layers, getLayers());


export default plugin;
