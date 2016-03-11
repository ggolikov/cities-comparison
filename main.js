require('leaflet-ajax');

/**
** Set MapQuest
*/

var mapQuest = L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="www.openstreetmap.org/copyright">OpenStreetMap</a>'
          });

var map = L.map(document.getElementsByClassName('map')[0]).setView([55.58415969422116, 37.385264449999966], 9);
map.addLayer(mapQuest);

/**
** Set GeoJSON
**
** search-box
*/

var borders;
var query = [];

$(function() {
  $('#first-city').autocomplete({
    source: function(request, response) {
      $.ajax({
        url: "https://raw.githubusercontent.com/ggolikov/cities-comparison/master/src/moscow.geo.json",
        dataType: "json",
        data: request,
        success: function(data) {
          response($.map(data.features, function(item) {
             if (item.name.toLowerCase().indexOf(request.term.toLowerCase()) > -1) {
              return {
                label: item.name,
                value: item.name
              };
            }
          }))
        }
      });
    },
    minLength: 3,
    select: function(event, ui) {
      query.length = 0;
      if (borders) {
        map.removeLayer(borders);
      }
      query.push(ui.item.value);

      borders = new L.geoJson.ajax("https://raw.githubusercontent.com/ggolikov/cities-comparison/master/src/moscow.geo.json", {
        onEachFeature: function(feature, layer) {
          layer.bindPopup(feature.properties.name);
          map.fitBounds(layer.getBounds());
        },
        style: function(feature) {
          switch (feature.properties.name) {
            case 'Зеленоградский административный округ': return {weight: 2, color: "red", fillColor: "yellow", opacity: 1, fillOpacity: 0.2};
            case 'Восточный административный округ':   return {weight: 2, color: "red", fillColor: "yellow", opacity: 1, fillOpacity: 0.2};
            case 'Юго-Восточный административный округ':   return {weight: 2, color: "red", fillColor: "yellow", opacity: 1, fillOpacity: 0.2};
            case 'Южный административный округ':   return {weight: 2, color: "red", fillColor: "yellow", opacity: 1, fillOpacity: 0.2};
            case 'Юго-Западный административный округ':   return {weight: 2, color: "red", fillColor: "yellow", opacity: 1, fillOpacity: 0.2};
            case 'Западный административный округ':   return {weight: 2, color: "red", fillColor: "yellow", opacity: 1, fillOpacity: 0.2};
            case 'Северо-Западный административный округ':   return {weight: 2, color: "red", fillColor: "yellow", opacity: 1, fillOpacity: 0.2};
            case 'Северный административный округ':   return {weight: 2, color: "red", fillColor: "yellow", opacity: 1, fillOpacity: 0.2};
            case 'Северо-Восточный административный округ':   return {weight: 2, color: "red", fillColor: "yellow", opacity: 1, fillOpacity: 0.2};
            case 'Центральный административный округ':   return {weight: 2, color: "red", fillColor: "yellow", opacity: 1, fillOpacity: 0.2};
            case 'Троицкий административный округ':   return {weight: 2, color: "red", fillColor: "yellow", opacity: 1, fillOpacity: 0.2};
            case 'Новомосковский административный округ':   return {weight: 2, color: "red", fillColor: "yellow", opacity: 1, fillOpacity: 0.2};
          }
        },
        filter: function(feature) {
          return feature.name == query[query.length-1];
        }
      });
      map.addLayer(borders);
    }
  });
});
