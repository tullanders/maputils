import Plugin from "../pluginClass.mjs";

const plugin = new Plugin("TrainAnnouncement");

let stations;

const q = `
<REQUEST>
      <LOGIN authenticationkey="your_key" />
      <QUERY objecttype="TrainAnnouncement" schemaversion="1.8" sseurl="true" limit="1000" orderby="TimeAtLocation desc">
      <FILTER>
      <!--EQ name="TrainOwner" value="SJ"/-->
      </FILTER>
      </QUERY>
</REQUEST>
  `;  


// Listen
plugin.addEventListener('EventToPlugin', (e) => {
  // Run this plugin after stations is loaded to convert station signature to coordinates
  if (e.detail.eventName == 'stations') {
   
    e.detail.data.then(data => {
      stations = new Map(data.map((obj) => [obj.signature, obj]));
      const url = "https://api.trafikinfo.trafikverket.se/v2/data.json";

      fetch(url, {
          method: "POST",
          body: q,
          headers: {
              "Content-Type": "application/xml"
          }
      }).then(response => response.json())
      .then(data => {
        parseData(data);
      
        // Get SSE URL
        const sseurl = data.RESPONSE.RESULT[0].INFO.SSEURL;
        
        // Connect to SSE
        const eventSource = new EventSource(sseurl);
        //console.log(sseurl);
        // Listen for messages
        eventSource.onmessage = (e) => {
          parseData(JSON.parse(e.data));
        }
      });

    });
  }
});

const updateTrain = (item, train) => {
  const station = stations.get(item.LocationSignature);
  train.trainId = item.AdvertisedTrainIdent;
  train.otn = item.OperationalTrainNumber;
  train.trainOwner = item.TrainOwner;
  train.activity = item.Activity;
  train.plannedTime = item.AdvertisedTimeAtLocation;
  train.actualTime = item.TimeAtLocation;
  train.signature = item.LocationSignature;
  train.cancelled = item.Cancelled;
  train.deleted = item.deleted;
  train.coordinates = [station.latitude, station.longitude]
}

// Function to parse data and dispatch event
const parseData = (data) => {
  const trains = data.RESPONSE.RESULT[0].TrainAnnouncement
  // create a map to ensure unique trains
  const map = new Map();

  // loop through all trains
  trains.forEach(item => {
    if (map.has(item.AdvertisedTrainIdent)) {
      // update train
      const train = map.get(item.AdvertisedTrainIdent);
      if (item.TimeAtLocation > train.actualTime) updateTrain(item, train);
    }
    else {
      // create train
      const train = {};
      updateTrain(item, train);
      map.set(item.AdvertisedTrainIdent, train);
    }
  });
  plugin.dispatchEvent(new CustomEvent('EventFromPlugin', {detail: {data:[...map.values()], eventName: 'trainData'}}));

  
    
};

export default plugin;
