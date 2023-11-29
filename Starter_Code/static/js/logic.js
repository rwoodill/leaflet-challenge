// Rachel Woodill 2023-11-27


// Use this link to get the GeoJSON data.
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(url).then(function(response){
    let earthQuakeFeatures = response.features;

    let earthquakeMarkers = [];

    for (let i = 0; i < earthQuakeFeatures.length; i++){
        let thisEQ = earthQuakeFeatures[i];

        earthquakeMarkers.push(
            L.circle([thisEQ.geometry.coordinates[1], thisEQ.geometry.coordinates[0]], {
                fillOpacity: 0.5,
                color: "white",
                fillColor: "green",
                radius: 5000
            }).bindPopup(`<h3>${thisEQ.properties.place}</h3><hr><p>${new Date(thisEQ.properties.time)}</p>`)
        )
    }

      // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
      // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
        "Street Map": streetmap,
        "Topographic Map": topo
    };

    let earthquakes = L.layerGroup(earthquakeMarkers); 

      // Create an overlayMaps object to hold the bikeStations layer.
    let overlayMaps = {
        "Earthquakes": earthquakes
    };

     // Create the map object with options.
    let myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, topo, earthquakes]
    });

      // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

});  

//layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);


// let myMap = L.map("map", {
//     center: [37.09, -95.71],
//     zoom: 5
//   });