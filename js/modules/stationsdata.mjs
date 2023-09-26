import Plugin from "../pluginClass.mjs";

const plugin = new Plugin("TrainAnnouncement");


const transformItem = (item) => {
  let pattern = /\d*[.]\d*/gm;
  let coordinates = item.Geometry.WGS84.match(pattern)
  let lng = parseFloat(coordinates[0], 0);
  let lat = parseFloat(coordinates[1], 0);
  let returnvalue = {
      stationName: item.AdvertisedLocationName,
      stationSignature: item.LocationSignature,
      longitude: lng,
      latitude: lat
  };
  return returnvalue;
}

const q = `
<REQUEST>
    <LOGIN authenticationkey="your key" />
    <QUERY objecttype="TrainStation" schemaversion="1">
        <INCLUDE>AdvertisedLocationName</INCLUDE>
        <INCLUDE>LocationSignature</INCLUDE>
        <INCLUDE>Geometry.WGS84</INCLUDE>
    </QUERY>
</REQUEST>`;

const url = "https://api.trafikinfo.trafikverket.se/v2/data.json";

fetch(url, {

    method: "POST",
    body: q,
    headers: {
        "Content-Type": "application/xml"
    }
}).then(response => response.json())
.then(data => {
  const stations = data.RESPONSE.RESULT[0].TrainStation.map(transformItem);
  plugin.dispatchEvent(new CustomEvent('EventFromPlugin', {detail: {data:stations, eventName: 'stations'}}));

});

export default plugin;
