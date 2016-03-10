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

var borders = new L.geoJson.ajax("https://raw.githubusercontent.com/ggolikov/cities-comparison/master/src/districts.js", {
    onEachFeature: function(feature, marker) {
      marker.bindPopup(feature.properties.name);
    },
  });
map.addLayer(borders);

/**
** search-box
*/

// $('#first-city').autocomplete({
  // serviceUrl: 'https://raw.githubusercontent.com/ggolikov/cities-comparison/master/src/countries.js',


$(function() {
    var availableTags = [
      "ActionScript",
      "AppleScript",
      "Asp",
      "BASIC",
      "C",
      "C++",
      "Clojure",
      "COBOL",
      "ColdFusion",
      "Erlang",
      "Fortran",
      "Groovy",
      "Haskell",
      "Java",
      "JavaScript",
      "Lisp",
      "Perl",
      "PHP",
      "Python",
      "Ruby",
      "Scala",
      "Scheme"
    ];
$('#first-city').autocomplete({
      // source:
    });
  });
