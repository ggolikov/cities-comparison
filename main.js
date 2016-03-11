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
var txt = 'Красногвардейский район';

var borders = new L.geoJson.ajax("https://raw.githubusercontent.com/ggolikov/cities-comparison/master/src/districts.js", {
    onEachFeature: function(feature, marker) {
      marker.bindPopup(feature.properties.name);
    },
    // filter: function(feature){
    //   return feature.properties.name == txt;
    // }
  });
map.addLayer(borders);

var first = document.getElementById('first-city');

/**
** search-box
*/


var smth = [
  "aaa",
  "bbb",
  "baa",
  "abbc",
  "C",
]

$(function() {
  $('#first-city').autocomplete({
        source: function(request, response) {
            $.ajax({
              url: "/search",
                dataType: "json",
                type : 'Get',
                data: {
                  q: request.term
                },
                success: function(data) {
                    response(data);
                },
                error: function(data) {
                    $('#first-city').removeClass('ui-autocomplete-loading');
                }
            });
        },
        minLength: 1,
        open: function() {},
        close: function() {},
        focus: function(event,ui) {},
        select: function(event, ui) {}
    });
});
var json;
var xhr = new XMLHttpRequest();
xhr.open('GET', '/search/example.json', true);
xhr.send();
// xhr.onreadystatechange = function() {
//   if (xhr.readyState != 4) return;
//   else {
//     json = xhr.responseText;
//   }
// }
xhr.onload = function() {
  json = xhr.responseText;
  console.log(json);
}
