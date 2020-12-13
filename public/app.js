const api_url = "https://data.cityofnewyork.us/resource/s4kf-3yrf.geojson";

mapboxgl.accessToken = 'pk.eyJ1IjoibW9ua2V5LWhhcmJvciIsImEiOiJja2h1cW1iNHYwNDd4MnRtbzQyd3NwejdjIn0.AWdWKkXgKST-dZeAGinXfg';

let i = 0;

// Set bounds to New York, New York
let bounds = [
    [-74.25909, 40.477399], // Southwest coordinates
    [-73.700272, 40.917577] // Northeast coordinates
    ];

// initialize Mapbox GL JS
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-73.9978, 40.7209],
    zoom: 13,
    maxBounds: bounds // Sets bounds as max
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
        // let popup = new mapboxgl.Popup({ offset: 90 }).setText(
        //     'Select a Link and imagine its Liberation'
        // );

        // add markers
        let marker = new mapboxgl.Marker(el)
            .setLngLat([lon, lat]) // [lng, lat] coordinates to place the marker
            // .setPopup(popup) // sets a popup on this marker
            .addTo(map); // add the marker to the map 

        let currdataObj = data.features[i];
        registerClickEvent(el, currdataObj); //???    
    }
}
getLinks();

let linkAddressEl = document.getElementById("link-address");
let currLinkAddress;

let secondPage = document.getElementById("input-area");
let allideasButton = document.getElementById("all-button");
let introPage = document.getElementById("intro-text");

let lastClickedEl;


//function to set click event that happens on the marker
function registerClickEvent(theEl, theObj) {
    theEl.addEventListener('click', function () {
        if (lastClickedEl) {
            lastClickedEl.classList.remove ("marker-clicked");
        }
        theEl.classList.add("marker-clicked");
        lastClickedEl = theEl;

        currLinkAddress = theObj.properties.street_address;
        linkAddressEl.innerHTML = currLinkAddress;

        //switch visibility after user clicks on marker
        secondPage.style.visibility = "visible";
        allideasButton.style.visibility = "visible";
        introPage.style.display = "none";

        fetch("/ideas/" + currLinkAddress)
            .then((res) => res.json())
            .then((data) => {
                // console.log(data);
                let locationIdeas = data;
                let locationInfo = document.getElementById("location-info");
                  //clears all text
                  locationInfo.innerHTML="";
                for (i = 0; i < locationIdeas.length; i++) {
                    let newEntry = document.createElement("p");
                    newEntry.innerHTML = locationIdeas[i].content;
                    locationInfo.appendChild(newEntry);
                };
            })

    })
}

let submitbutton = document.getElementById("idea-button")
submitbutton.addEventListener("click", function () {
    let location = currLinkAddress;
    let name = document.getElementById('idea-name').value;
    // console.log(name); //imie /napisene w terminal
    let content = document.getElementById('idea-content').value;
    // console.log(content); //idea napisene w terminal

    let ideaObject = {
        "name": name,
        "content": content,
        "address": location
    }; //ideaObject has location (address) connected to name/content


    fetch('/postidea', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ideaObject)
    })
        .then(res => res.json())
        .then(data => {
            // console.log(data); 
            let newidea = document.createElement('p')
            newidea.innerHTML = ideaObject.content;

        })

//clear input fields
function clearinputFields() {
    document.getElementById("myForm").reset();
}
clearinputFields();

})

// event to display all ideas when button clicked
let allButton = document.getElementById("all-button");
allButton.addEventListener("click", function () {
    console.log("show ALL ideas button clicked");
    fetchallIdeas();
    let div = document.getElementById('all-info');
    if (div.style.display !== 'none') {
        div.style.display = 'none';
    }
    else {
        div.style.display = 'block';
    }
});

function fetchallIdeas() {
    fetch("/allideas")
        .then((res) => res.json())
        .then((data) => {
            let allIdeas = data;
            let allInfo = document.getElementById("all-info");
            for (i = 0; i < allIdeas.length; i++) {
                let newEntry = document.createElement("p");
                newEntry.innerHTML = allIdeas[i].content;
                allInfo.appendChild(newEntry);
            };
        })
}