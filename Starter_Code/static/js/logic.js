// Rachel Woodill 2023-11-27

// Use this link to get the GeoJSON data.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// ----------------------------------------------------------------
// Function to select the colour of the points based on the depth of the earthquake
// ----------------------------------------------------------------
function chooseColour(depth){
    if (depth > 90){
        return "red"
    }
    else if (depth > 70){
        return "orangered"
    }
    else if (depth > 60){
        return "orange"
    }
    else if (depth > 30){
        return "gold"
    }
    else if (depth > 10){
        return "yellow"
    }
    else return "lightgreen"
} //end of function chooseColour


// ----------------------------------------------------------------
// Function to customize the radius of the circle based on the magnitude of the earthquake
// ----------------------------------------------------------------
function chooseRadius(magnitude){
    return magnitude * 50000;
} //end of function chooseRadius


// ----------------------------------------------------------------
// Function to create the features based on the earthquake data
// ----------------------------------------------------------------
function createFeatures (earthquakeData){
    let earthQuakeFeatures = earthquakeData.features;

    let earthquakeMarkers = [];
    //console.log(earthQuakeFeatures);

    for (let i = 0; i < earthQuakeFeatures.length; i++){
        let thisEQ = earthQuakeFeatures[i];

        earthquakeMarkers.push(
            L.circle([thisEQ.geometry.coordinates[1], thisEQ.geometry.coordinates[0]], {
                fillOpacity: 0.5,
                color: "white",
                fillColor: chooseColour(thisEQ.geometry.coordinates[2]),
                radius: chooseRadius(thisEQ.properties.mag)
            }).bindPopup(`<h3>Location: ${thisEQ.properties.place}</h3><hr><p>DateTime: ${new Date(thisEQ.properties.time)}</p><p>Magnitude: ${thisEQ.properties.mag}</p><p>Depth: ${thisEQ.geometry.coordinates[2]}</p>`)
        )
    }    
    // create a layer group using the marker data
    let earthquakes = L.layerGroup(earthquakeMarkers); 
    // call the createMap function, passing it the layer group created above
    createMap(earthquakes)
} //end of function createFeatures


// ----------------------------------------------------------------
// Function to create the map based on the earthquake layer
// ----------------------------------------------------------------
function createMap(earthquakes) {
    // Create the tile layer that will be the background of our map.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create an overlayMaps object to hold the earthquakes layer.
    let overlayMaps = {
        "Earthquakes": earthquakes
    };

    // Create the map object with options.
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [street, topo, earthquakes]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
} //end of function createMap


// ----------------------------------------------------------------
// Use d3 to access the data from the url
// ----------------------------------------------------------------
d3.json(url).then(function(response){
    createFeatures(response);
});  