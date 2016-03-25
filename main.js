require('leaflet-ajax');

/**
** Set map & baselayers
*/
var attr_osm = 'Map data &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors',
attr_overpass = 'POI via <a href="http://www.overpass-api.de/">Overpass API</a>';

var map = L.map(document.getElementsByClassName('map')[0]).setView([55.58415969422116, 37.385264449999966],9);
var mapBox = L.tileLayer.provider('MapBox', {id: 'businesstat.liek2okp', accessToken: 'pk.eyJ1IjoiYnVzaW5lc3N0YXQiLCJhIjoiQ1hVdVdxZyJ9.sXqLsSh-1vhh11_BSL-g4Q'}).addTo(map);
L.control.scale().addTo(map);

/**
<<<<<<< HEAD
<<<<<<< HEAD
** Set OverPassAPI
*/

var opl = new L.OverPassLayer({
  // query: 'node(BBOX)["boundary"="administrative"]["admin_level"="8"]["name" = "городское поселение Сергиев Посад"];out;',
  query: 'node["amenity"="school"](BBOX);out;',
});

map.addLayer(opl);
=======
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
>>>>>>> refs/remotes/origin/master

/**
=======
>>>>>>> refs/remotes/origin/master
** Set GeoJSON
** &
** search-box
*/

var firstFeature, secondFeature, shift;
var firstLatLngs = [];
var secondLatLngs = [];
var firstCenter, secondCenter;
var firstLatLngsClone, firstCenterClone;
var query1 = [];
var query2 = [];
var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);

var style = {
  weight: 2,
  color: "grey",
  fillColor: randomColor,
  opacity: 1,
  fillOpacity: 0.2
};

/*
**  configure first input
*/

$(function() {
  $('#first-city').autocomplete({
    source: function(request, response) {
      $.ajax({
        url: "https://raw.githubusercontent.com/ggolikov/cities-comparison/master/example/admin_level_5.geo.json",
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
      if (firstFeature) {
        map.removeLayer(firstFeature);
      }
      if (shift) {
        map.removeLayer(shift);
      }
      query1.push(ui.item.value);

      firstFeature = new L.geoJson.ajax("https://raw.githubusercontent.com/ggolikov/cities-comparison/master/example/admin_level_5.geo.json", {
        onEachFeature: function(feature, layer) {
          layer.bindPopup(feature.properties.name);
          map.fitBounds(layer.getBounds());
        },
        style: style,
        // style: function(feature) {
        //   switch (feature.properties.name) {
        //     case 'Зеленоградский административный округ': return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
        //     case 'Восточный административный округ':   return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
        //     case 'Юго-Восточный административный округ':   return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
        //     case 'Южный административный округ':   return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
        //     case 'Юго-Западный административный округ':   return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
        //     case 'Западный административный округ':   return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
        //     case 'Северо-Западный административный округ':   return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
        //     case 'Северный административный округ':   return {weight: 3, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
        //     case 'Северо-Восточный административный округ':   return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
        //     case 'Центральный административный округ':   return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
        //     case 'Троицкий административный округ':   return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
        //     case 'Новомосковский административный округ':   return {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2};
        //   }
        // },
        filter: function(feature) {
          return feature.name == query1[query1.length-1];
        }
      });

      firstFeature.once('data:loaded', function() {
            this.eachLayer(function(layer){
              firstLatLngs = layer.getLatLngs();
              firstCenter = layer.getBounds().getCenter();
            });

            // convert LatLng objects to coordinate arrays

            firstLatLngs.forEach(function(arr){
              for (var i = 0; i < arr.length; i++){
                arr[i] = [arr[i].lat, arr[i].lng];
              }
            });

            firstCenter = [firstCenter.lat, firstCenter.lng];

            // clone converted arrays to the new array to prevent changes

            firstLatLngsClone = [];
            for (var j = 0; j < firstLatLngs.length; j++) {
              firstLatLngsClone[j] = new Array();
              for(var l = 0; l < firstLatLngs[j].length; l++){
                firstLatLngsClone[j].push(firstLatLngs[j][l]);
              }
            };

            firstCenterClone = firstCenter.slice();
      });

    $('#second-city').removeAttr("disabled");

    map.addLayer(firstFeature);

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
          url: "https://raw.githubusercontent.com/ggolikov/cities-comparison/master/example/admin_level_9.geo.json",
          dataType: "json",
          data: request,
          success: function(data) {
            response($.map(data.features, function(item) {
               if (item.properties.name.toLowerCase().indexOf(request.term.toLowerCase()) > -1) {
                return {
                  label: item.properties.name,
                  value: item.properties.name
                };
              }
            }))
          }
        });
      },
      minLength: 1,

      select: function(event, ui) {
        query2.length = 0;
        if (secondFeature) {
          map.removeLayer(secondFeature);
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

        secondFeature = new L.geoJson.ajax("https://raw.githubusercontent.com/ggolikov/cities-comparison/master/example/admin_level_9.geo.json", {
          onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.name);
            layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight,
            });
          },
          style: distStyle,
          filter: function(feature) {
            return feature.properties.name == query2[query2.length-1];
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
          secondFeature.resetStyle(e.target);
        }

        map.addLayer(secondFeature);

  /*
  **    reproject
  */

<<<<<<< HEAD
      districts.once('data:loaded', function() {
<<<<<<< HEAD
        console.log(borders.getLayers().getLatLngs());
        console.log(districts.getLayers().getLatLngs());
                    var poly = new L.Polygon(borders.getLayers()[0].getLatLngs());
            var newPoly = new L.Polygon(districts.getLayers()[0].getLatLngs());
            var wgs84 = 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]';
            proj4.defs('EPSG:3410', "+proj=cea +lon_0=0 +lat_ts=30 +x_0=0 +y_0=0 +a=6371228 +b=6371228 +units=m +no_defs");
            proj4.defs('SR-ORG:6864', "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
            var customProjection = proj4('SR-ORG:6864');
=======
            // var poly = new L.Polygon(coords);
            var poly = new L.Polygon(borders.getLayers()[0].getLatLngs());
            var newPoly = new L.Polygon(districts.getLayers()[0].getLatLngs());
            // var wgs84 = 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]';
            // proj4.defs('EPSG:3410', "+proj=cea +lon_0=0 +lat_ts=30 +x_0=0 +y_0=0 +a=6371228 +b=6371228 +units=m +no_defs");
            // proj4.defs('SR-ORG:6864', "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
            // var customProjection = proj4('SR-ORG:6864');
>>>>>>> refs/remotes/origin/master

            /*
            ** LatLng shift
            */
=======
      secondFeature.once('data:loaded', function() {
            this.eachLayer(function(layer){
              secondCenter = layer.getBounds().getCenter();
              secondCenter = [secondCenter.lat, secondCenter.lng];
            });
>>>>>>> refs/remotes/origin/master

<<<<<<< HEAD
            var zero = [0,37.6137272],
                polar = [84.886737,32.405546],
                east = [55.753707000000006, 80],
                west = [55.753707000000006, -4.25];
                spb = [59.938879,30.315212],
=======
            var zero  = [0,37.6137272],
                polar = [84.886737,32.405546],
                east  = [55.753707000000006, 80],
                west  = [55.753707000000006, -4.25];
                spb   = [59.938879,30.315212],
>>>>>>> refs/remotes/origin/master
                sochi = [43.585525, 39.723062];

            var y = secondCenter[0];
            var x = secondCenter[1];
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
<<<<<<< HEAD
            // var x = 37.6137272;
=======
            // var x = Math.random()*180;

<<<<<<< HEAD
>>>>>>> refs/remotes/origin/master
=======
            /*
            ** function LatLng shift
            */

>>>>>>> refs/remotes/origin/master
            var scaleFactor2 = 1/Math.cos((Math.PI*y)/180);

            function shiftCoords(arr) {

              // for (var i = 0; i < arr.length; i++)  {
              //   var scaleFactor1 = 1/Math.cos((Math.PI*arr[i][0])/180);
              //   arr[i][0] = arr[i][0] - firstCenterClone[0] + y;
              //   arr[i][1] = (arr[i][1] - firstCenterClone[1])*(scaleFactor2/scaleFactor1) + x;
              //
              //   // arr[i][0] = arr[i][0]/2;
              //   // arr[i][1] = arr[i][1]/2;
              //   // arr[i] = [0,2];
              //
              // }

                var offsets = [];
                for (var i = 0; i < arr.length; i++)  {
                  var point = [];
                  var scaleFactor1 = 1/Math.cos((Math.PI*arr[i][0])/180);
                  point.push(arr[i][0] - firstCenter[0]);
                  point.push(arr[i][1] - firstCenter[1]);
                  point.push(scaleFactor1);
                  offsets.push(point);
                }

                var llArray = [];
                for (var k = 0; k < offsets.length; k++)  {
                  var point = [];
                  point.push(y + offsets[k][0]);
                  point.push(x + offsets[k][1]*(scaleFactor2/offsets[k][2]));
                  llArray.push(point);
                }

                for(var l = 0; l < arr.length; l++) {
                  arr[l] = llArray[l];
                }
            }

            // shifting cloned array

            firstLatLngsClone.forEach(shiftCoords);

            // drawing shifted polygon

            shift = new L.multiPolygon(firstLatLngsClone, style).addTo(map);

<<<<<<< HEAD
<<<<<<< HEAD
            var shift = L.polygon(llArray, {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2}).addTo(map);
=======
            shift = L.polygon(llArray, {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2}).addTo(map);
>>>>>>> refs/remotes/origin/master
            map.removeLayer(borders);
=======
            // reset coordinates array clone to default to avoid shift

            for (var j = 0; j < firstLatLngs.length; j++) {
              firstLatLngsClone[j] = new Array();
              for(var l = 0; l < firstLatLngs[j].length; l++){
                firstLatLngsClone[j].push(firstLatLngs[j][l]);
              }
            };

            map.removeLayer(firstFeature);
>>>>>>> refs/remotes/origin/master
            map.fitBounds(shift.getBounds());

      });

    }  //select
  }); //autocomplete
}); //$
