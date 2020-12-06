//fetch all data from DB and save it to global array

window.addEventListener('load', function(){
    fetch('/allideas')
    .then(res => res.json())
    .then(data => {
        console.log(data);
        // let ideasData = data.data;

        // let parent = document.getElementById('feed');
        // //Loop through the data & append info to the page
        // for (let i=0; i < chirpData.length; i++){
        //     let newChirp = document.createElement('p');
        //     let chirpContent = chirpData[i].name + " : " + chirpData[i].msg;
        //     console.log(chirpContent);
        //     newChirp.innerHTML = chirpContent;
        //     feed.appendChild(newChirp);
        })
    });


const api_url = "https://data.cityofnewyork.us/resource/s4kf-3yrf.geojson";

mapboxgl.accessToken = 'pk.eyJ1IjoibW9ua2V5LWhhcmJvciIsImEiOiJja2h1cW1iNHYwNDd4MnRtbzQyd3NwejdjIn0.AWdWKkXgKST-dZeAGinXfg';

let i = 0;

// initialize Mapbox GL JS
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-73.975484, 40.799283],
    zoom: 16,
    maxBounds: [
        [-74.04728500751165, 40.68392799015035], // Southwest 
        [-73.91058699000139, 40.87764500765852] // Northeast 
    ]
})


// load GeoJSON data set - async/wait is same as using "than" order of actions
async function getLinks() {
    const response = await fetch(api_url);
    const data = await response.json();
    for (i = 0; i < 60; i++) {
        // console.log(data.features[i].street_address);
        lat = data.features[i].properties.latitude;
        lon = data.features[i].properties.longitude;

        // create DOM element for the marker
        let el = document.createElement('div');
        el.className = 'marker';

        // create the popup
        let popup = new mapboxgl.Popup({ offset: 25 }).setText(
            'Let us liberate this Link !   '
        );

        // add markers
        let marker = new mapboxgl.Marker(el)
            .setLngLat([lon, lat]) // [lng, lat] coordinates to place the marker
            .setPopup(popup) // sets a popup on this marker
            .addTo(map); // add the marker to the map 

        let currdataObj = data.features[i];
        registerClickEvent(el, currdataObj); //???
    }
}
getLinks();

let linkAddressEl = document.getElementById("link-address");
let currLinkAddress;

//function to set click event that happens on the marker
function registerClickEvent(theEl, theObj) {
    theEl.addEventListener('click', function () {
        console.log("Marker Clicked"); //napisene w terminal
        console.log(theObj); //all data for this location
        console.log(theObj.properties.street_address); //adres napisany w terminal
        currLinkAddress = theObj.properties.street_address;
        linkAddressEl.innerHTML = currLinkAddress;

        //show ideas for this address only on the page
        //fetch(‘/ideas/‘+currLinkAddress , .....

        fetch('/allideas/' + currLinkAddress);
        
    })
}

let submitbutton = document.getElementById("idea-button")
submitbutton.addEventListener("click", function () {
    let location = currLinkAddress;
    let name = document.getElementById('idea-name').value;
    console.log(name); //imie /napisene w terminal
    let content = document.getElementById('idea-content').value;
    console.log(content); //idea napisene w terminal
    let ideaObject = {
        "name": name,
        "content": content,
        "address": location
    }; //NOW idea Object has location connected to name/content

    fetch('/postidea', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ideaObject)
    })
        .then(res => res.json())
        .then(data => {
            console.log(data); //WRONG
            let newidea = document.createElement('p')
            newidea.innerHTML = ideaObject.content;
        })

    console.log(ideaObject); 
})
