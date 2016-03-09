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

var countries = [
    { value: 'Andorra', data: 'AD' },
    // ...
    { value: 'Zimbabwe', data: 'ZZ' }
];

$('#first-city').autocomplete({
    serviceUrl: 'https://raw.githubusercontent.com/ggolikov/cities-comparison/master/src/districts.js',
    type: "POST",
    crossDomain: true,
    onSelect: function (suggestion) {
        console.log(('You selected: ' + suggestion.value + ', ' + suggestion.data));
    }
});
