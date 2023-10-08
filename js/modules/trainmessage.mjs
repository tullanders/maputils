import Plugin from "../pluginClass.mjs";

const plugin = new Plugin("TrainMessage");
const layerGroup = L.layerGroup();
plugin.Overlays = {
    'TrainMessage': layerGroup
    };


const q = `
<REQUEST>
    <LOGIN authenticationkey="your key" />
      <QUERY objecttype="TrainMessage" schemaversion="1.7">
            <FILTER>
                <GT name="PrognosticatedEndDateTimeTrafficImpact" value="2023-05-10" />
            </FILTER>
      </QUERY>
</REQUEST>
  `;
let stations;
plugin.addEventListener('EventToPlugin', (e) => {
    // trigger when event is "stations" (beacuse we need the coordinates of the stations)
    if (e.detail.eventName == 'stations') {
        e.detail.data.then(data => {
            stations = new Map(data.map((obj) => [obj.signature, obj]));
            getTrainMessages();
        });
        
    }
});

const getTrainMessages = () => {
    const url = "https://api.trafikinfo.trafikverket.se/v2/data.json";

    fetch(url, {
    
        method: "POST",
        body: q,
        headers: {
            "Content-Type": "application/xml"
        }
    }).then(response => response.json())
    .then(data => {
        data.RESPONSE.RESULT[0].TrainMessage.forEach(item => {
            const date1 = new Date(item.StartDateTime);
            const date2 = new Date(item.PrognosticatedEndDateTimeTrafficImpact);
            const currentDate = new Date();
            const header = item.Header;
            const description = item.ExternalDescription;
            if (date1 < currentDate && date2 > currentDate) {
                item.TrafficImpact.forEach(impact => {
                    const latlngs = [];
                    if (impact.AffectedLocation != undefined) {
                        impact.AffectedLocation.forEach(affected => {
                            const station = stations.get(affected.LocationSignature);
                            latlngs.push([station.latitude, station.longitude]);
                        });
                        L.polyline(latlngs, {color: 'red'}).addTo(layerGroup)
                            .bindPopup('<b>' + header + '</b><br/>' + description);
                    }

                });
                

            }
            
        });
      
      //plugin.dispatchEvent(new CustomEvent('EventFromPlugin', {detail: {data:stations, eventName: 'stations'}}));
    
    });
}

export default plugin;
