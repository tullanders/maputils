import Plugin from "../pluginClass.mjs";

const plugin = new Plugin("TrainAnnouncement");




const q = `
<REQUEST>
      <LOGIN authenticationkey="" />
      <QUERY objecttype="TrainAnnouncement" schemaversion="1.8" sseurl="true" limit="1000" orderby="TimeAtLocation DESC">
      <FILTER>
      <EQ name="TrainOwner" value="GC"/>
      </FILTER>
      </QUERY>
</REQUEST>
  `;  

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

// Function to parse data and dispatch event
const parseData = (data) => {
  const trains = data.RESPONSE.RESULT[0].TrainAnnouncement;
  plugin.dispatchEvent(new CustomEvent('EventFromPlugin', {detail: {data:trains, eventName: 'trainData'}}));
} 




export default plugin;
