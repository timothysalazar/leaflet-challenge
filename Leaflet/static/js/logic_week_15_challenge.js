let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL and print out our data to console and as map
d3.json(queryUrl).then(function (data) {
    console.log(data.features);
    createMap(data.features);
});

function createMap(earthquakes) {
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create a color scale for the depth of earthquakes
    function getColor(depth) {
        return depth > 90 ? "#FF0000" :
               depth > 70 ? "#FF6600" :
               depth > 50 ? "#FFCC00" :
               depth > 30 ? "#FFFF00" :
               depth > 10 ? "#CCFF00" :
                            "#00FF00";
    }

    // Function to set radius based on magnitude
    function getRadius(magnitude) {
        return magnitude * 5;
    }

    //Use the geoJSON to create marker layer 
    let earthquakeLayer = L.geoJSON(earthquakes,{
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, marker){
          marker.bindPopup(
            `<h1>${feature.properties["place"]}</h1>
            <h3>Magnitude: ${feature.properties["mag"]}</h3>
            <h3>Depth: ${feature.geometry.coordinates[2]}</h3>`
          );
        }
      });

  // Create an overlays object.
  let overlays = {
    "Earthquakes": earthquakeLayer
  };
  
    // Create a new map.
    // Edit the code to add the earthquake data to the layers.
    let myMap = L.map("map", {
      center: [
        17.09, -0.71
      ],
      zoom: 2,
      layers: [street]
    });
  
    // Create a layer control that contains our baseMaps.
    // Be sure to add an overlay Layer that contains the earthquake GeoJSON.
    L.control.layers(baseMaps, overlays, {
      collapsed: false
    }).addTo(myMap);

}  
