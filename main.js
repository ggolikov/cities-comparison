require('leaflet-ajax');

/** search-box
*/
var first = document.getElementById('first-city');
first.style.background = 'yellow';
/**
* Set CartoDB Dark Matter Basemap to both map-divs
*/

var mapQuest = L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="www.openstreetmap.org/copyright">OpenStreetMap</a>'
          });

var map = L.map(document.getElementsByClassName('map')[0]).setView([56, 37], 5);
map.addLayer(mapQuest);
var featuresLayer = new L.GeoJSON(districts, {
    onEachFeature: function(feature, marker) {
      marker.bindPopup(feature.properties.name);
    }
  });
map.addLayer(featuresLayer);
