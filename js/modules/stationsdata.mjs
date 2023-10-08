import Plugin from "../pluginClass.mjs";

const plugin = new Plugin("Stations");


const transformItem = (item) => {
  let pattern = /\d*[.]\d*/gm;
  let coordinates = item.Geometry.WGS84.match(pattern)
  let lng = parseFloat(coordinates[0], 0);
  let lat = parseFloat(coordinates[1], 0);
  let returnvalue = {
      name: item.AdvertisedLocationName,
      signature: item.LocationSignature,
      longitude: lng,
      latitude: lat
  };
  return returnvalue;
}

let stations; 

const getStationsFromTrv = () => {
    console.log('getStationsFromTrv')
    const q = `
    <REQUEST>
        <LOGIN authenticationkey="c78a25063ffe44bcbdbcf8fa85d13fe1" />
        <QUERY objecttype="TrainStation" schemaversion="1">
            <INCLUDE>AdvertisedLocationName</INCLUDE>
            <INCLUDE>LocationSignature</INCLUDE>
            <INCLUDE>Geometry.WGS84</INCLUDE>
        </QUERY>
    </REQUEST>`;
    
    const url = "https://api.trafikinfo.trafikverket.se/v2/data.json";
    
    return fetch(url, {
        method: "POST",
        body: q,
        headers: {
            "Content-Type": "application/xml"
        }
    }).then(response => response.json())
    .then(data => {
        const stations = data.RESPONSE.RESULT[0].TrainStation.map(transformItem);
        localStorage.setItem('stations', JSON.stringify(stations));
        return stations;
    });
    
}

const getStationsFromLocalStorage = new Promise((resolve, reject) => {
    stations = (stations) ? stations : JSON.parse(localStorage.getItem('stations'));
    if (stations) {
        resolve(stations);
    }
    else {
        reject(null);
    }
});

// this is the function that we will attach to the payload
const getStations = new Promise((resolve, reject) => {
    getStationsFromLocalStorage.then(stations => {
        resolve(stations);
    }).catch(error => {
        getStationsFromTrv().then(stations => {
            resolve(stations);
        });
    });
}
);


plugin.addEventListener('EventToPlugin', (e) => {
    if (e.detail.data = plugin.Name && e.detail.eventName == 'pluginLoaded') {
        plugin.dispatchEvent(new CustomEvent('EventFromPlugin', {detail: {data:getStations, eventName: 'stations'}}));

    }
});




export default plugin;
