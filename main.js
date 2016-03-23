require('leaflet-ajax');
// var geojsonProject = require('geojson-project');

/**
** Set map & baselayers
*/

var attr_osm = 'Map data &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors',
attr_overpass = 'POI via <a href="http://www.overpass-api.de/">Overpass API</a>';

var map = L.map(document.getElementsByClassName('map')[0]).setView([55.58415969422116, 37.385264449999966],9);
var mapBox = L.tileLayer.provider('MapBox', {id: 'businesstat.liek2okp', accessToken: 'pk.eyJ1IjoiYnVzaW5lc3N0YXQiLCJhIjoiQ1hVdVdxZyJ9.sXqLsSh-1vhh11_BSL-g4Q'}).addTo(map);
L.control.scale().addTo(map);

/**
** get OverPass JSON (xhr)
*/

// var coords;
// var xhr = new XMLHttpRequest();
// xhr.open('GET', 'http://overpass-api.de/api/interpreter?data=[out%3Ajson][timeout%3A25]%3B%28relation[%22boundary%22%3D%22administrative%22][%22name%22%3D%22%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0%22]%3B%29%3Bout%20body%3B%3E%3Bout%20skel%20qt%3B%0A', true);
// xhr.send();
//
// xhr.onreadystatechange = function() {
//     if (this.readyState != 4) return;
//     // console.log(xhr);
//     if (xhr.responseText) {
//      var osm_data = xhr.responseText;
//   if (osm_data) {
//
//     var JSON = osmtogeojson(osm_data);
//
//     var array = [];
//     var data = L.geoJson(JSON, {
//       onEachFeature: function(feature) {
//         array.push(feature.geometry.coordinates);
//       }
//     }).addTo(map);
//     array.pop();
//     coords = array[0][0];
//     coords.forEach(function(x){x.reverse()});
//     console.log(array[0]);
//   }
// }
// }

/**
** Set GeoJSON
** &
** search-box
*/

var borders, districts, shift;
var query1 = [];
var query2 = [];
var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);

/*
**  configure first input
*/

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
    minLength: 1,
    select: function(event, ui) {
      query1.length = 0;
      if (borders) {
        map.removeLayer(borders);
      }
      if (shift) {
        map.removeLayer(shift);
      }
      query1.push(ui.item.value);

      borders = new L.geoJson.ajax("https://raw.githubusercontent.com/ggolikov/cities-comparison/master/src/moscow.geo.json", {
        onEachFeature: function(feature, layer) {
          layer.bindPopup(feature.properties.name);
          map.fitBounds(layer.getBounds());
        },
        style: function(feature) {
          switch (feature.properties.name) {
            case 'Зеленоградский административный округ': return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
            case 'Восточный административный округ':   return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
            case 'Юго-Восточный административный округ':   return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
            case 'Южный административный округ':   return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
            case 'Юго-Западный административный округ':   return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
            case 'Западный административный округ':   return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
            case 'Северо-Западный административный округ':   return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
            case 'Северный административный округ':   return {weight: 3, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
            case 'Северо-Восточный административный округ':   return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
            case 'Центральный административный округ':   return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
            case 'Троицкий административный округ':   return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
            case 'Новомосковский административный округ':   return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
          }
        },
        filter: function(feature) {
          return feature.name == query1[query1.length-1];
        }
      });

    //   var distStyle = {
    //     weight: 1,
    //     color: "grey",
    //     fillColor: "white",
    //     opacity: 1,
    //     fillOpacity: 0
    //   };
    //
    //   districts = new L.geoJson.ajax("https://raw.githubusercontent.com/ggolikov/cities-comparison/master/src/moscow_districts.geo.json", {
    //     onEachFeature: function(feature, layer) {
    //       layer.bindPopup(feature.properties.NAME);
    //       layer.on({
    //         mouseover: highlightFeature,
    //         mouseout: resetHighlight,
    //       });
    //     },
    //     style: distStyle,
    //     filter: function(feature) {
    //       return feature.properties.NAME_AO + ' административный округ' == query[query.length-1];
    //     }
    //   });
    //
    //   function highlightFeature(e) {
    //     var layer = e.target;
    //     layer.setStyle({
    //       weight: 1,
    //       color: "grey",
    //       fillColor: "yellow",
    //       fillOpacity: 0.3
    //     });
    //   }
    //
    // function resetHighlight(e) {
    //     districts.resetStyle(e.target);
    // }

    $('#second-city').removeAttr("disabled");

    // map.addLayer(districts);
    map.addLayer(borders);
    }
    });
});

/*
**  configure second input
*/

$(function() {
    $('#second-city').autocomplete({
      source: function(request, response) {
        $.ajax({
          url: "https://raw.githubusercontent.com/ggolikov/cities-comparison/master/src/moscow_districts.geo.json",
          dataType: "json",
          data: request,
          success: function(data) {
            response($.map(data.features, function(item) {
               if (item.properties.NAME.toLowerCase().indexOf(request.term.toLowerCase()) > -1) {
                return {
                  label: item.properties.NAME,
                  value: item.properties.NAME
                };
              }
            }))
          }
        });
      },
      minLength: 1,

      select: function(event, ui) {
        query2.length = 0;
        if (districts) {
          map.removeLayer(districts);
        }
        if (shift) {
          map.removeLayer(shift);
        }
        query2.push(ui.item.value);

        var distStyle = {
          weight: 1,
          color: "grey",
          fillColor: randomColor,
          opacity: 1,
          fillOpacity: 0.7
        };

        districts = new L.geoJson.ajax("https://raw.githubusercontent.com/ggolikov/cities-comparison/master/src/moscow_districts.geo.json", {
          onEachFeature: function(feature, layer) {
            // map.fitBounds(layer.getBounds());
            layer.bindPopup(feature.properties.NAME);
            layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight,
            });
          },
          style: distStyle,
          filter: function(feature) {
            return feature.properties.NAME == query2[query2.length-1];
          }
        });

        function highlightFeature(e) {
          var layer = e.target;
          layer.setStyle({
            weight: 1,
            color: "grey",
            fillColor: "yellow",
            fillOpacity: 0.3
          });
        }

        function resetHighlight(e) {
          districts.resetStyle(e.target);
        }

        map.addLayer(districts);

  /*
  **    reproject
  */

      districts.once('data:loaded', function() {
            // var poly = new L.Polygon(coords);
            var poly = new L.Polygon(borders.getLayers()[0].getLatLngs());
            var newPoly = new L.Polygon(districts.getLayers()[0].getLatLngs());
            // var wgs84 = 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]';
            // proj4.defs('EPSG:3410', "+proj=cea +lon_0=0 +lat_ts=30 +x_0=0 +y_0=0 +a=6371228 +b=6371228 +units=m +no_defs");
            // proj4.defs('SR-ORG:6864', "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
            // var customProjection = proj4('SR-ORG:6864');

            /*
            ** LatLng shift
            */

            var zero  = [0,37.6137272],
                polar = [84.886737,32.405546],
                east  = [55.753707000000006, 80],
                west  = [55.753707000000006, -4.25];
                spb   = [59.938879,30.315212],
                sochi = [43.585525, 39.723062];

            var center = poly.getBounds().getCenter();
            var newCenter = newPoly.getBounds().getCenter();

            var y = newCenter.lat;
            var x = newCenter.lng;
            // var y = zero[0];
            // var x = zero[1];
            // var y = polar[0];
            // var x = polar[1];
            // var y = spb[0];
            // var x = spb[1];
            // var y = sochi[0];
            // var x = sochi[1];
            // var y = east[0];
            // var x = east[1];
            // var y = west[0];
            // var x = west[1];
            // var y = Math.random()*90;
            // var x = Math.random()*180;

            var scaleFactor2 = 1/Math.cos((Math.PI*y)/180);

            var offsets = [];
            for (var i = 0; i < poly._latlngs.length; i++)  {
              var point = [];
              point.push(poly._latlngs[i].lat - center.lat);
              point.push(poly._latlngs[i].lng - center.lng);
              var scaleFactor1 = 1/Math.cos((Math.PI*poly._latlngs[i].lat)/180);
              point.push(scaleFactor1);
              offsets.push(point);
            }

            var llArray = [];
            for (var i = 0; i < offsets.length; i++)  {
              var point = [];
              point.push(y + offsets[i][0]);
              point.push(x + offsets[i][1]*(scaleFactor2/offsets[i][2]));
              llArray.push(point);
            }

            shift = L.polygon(llArray, {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2}).addTo(map);
            map.removeLayer(borders);
            map.fitBounds(shift.getBounds());
      });

    }  //select
  }); //autocomplete
}); //$
