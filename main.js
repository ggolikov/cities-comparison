require('leaflet-ajax');

/**
** Set MapQuest
*/

var mapQuest = L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="www.openstreetmap.org/copyright">OpenStreetMap</a>'
          });

var map = L.map(document.getElementsByClassName('map')[0]).setView([56, 37], 5);
map.addLayer(mapQuest);

/**
** Set GeoJSON
*/

var borders = new L.GeoJSON(districts, {
    onEachFeature: function(feature, marker) {
      marker.bindPopup(feature.properties.name);
    },

  });
map.addLayer(borders);

/**
** search-box
*/

var firstSearchControl = new L.Control.Search({
  container: 'first-city',
  layer: borders,
  propertyName: 'name',
  circleLocation: false,
  collapsed: false
});

firstSearchControl.on('search_locationfound', function(e) {
    e.layer.filter = function(feature){
      if(document.getElementsByClassName('search-input')[1].value) {
        return feature.properties.street == document.getElementsByClassName('search-input')[1].value;
      }
    };
		map.fitBounds(e.layer);
    if(e.layer._popup) {
      e.layer.openPopup();
    };
})

var secondSearchControl = new L.Control.Search({
  container: 'second-city',
  layer: borders,
  propertyName: 'name',
  circleLocation: false,
  collapsed: false
});

secondSearchControl.on('search_locationfound', function(e) {
		map.fitBounds(e.layer);
    if(e.layer._popup) {
      e.layer.openPopup();
    }
})

map.addControl(firstSearchControl);
map.addControl(secondSearchControl);
