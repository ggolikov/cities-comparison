require('leaflet-ajax');

/**
** Set map & baselayers
*/

var map = L.map(document.getElementsByClassName('map')[0]).setView([55.58415969422116, 37.385264449999966],9);
var mapBox = L.tileLayer.provider('MapBox', {id: 'businesstat.liek2okp', accessToken: 'pk.eyJ1IjoiYnVzaW5lc3N0YXQiLCJhIjoiQ1hVdVdxZyJ9.sXqLsSh-1vhh11_BSL-g4Q'}).addTo(map);
L.control.scale().addTo(map);

/**
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

      secondFeature.once('data:loaded', function() {
            this.eachLayer(function(layer){
              secondCenter = layer.getBounds().getCenter();
              secondCenter = [secondCenter.lat, secondCenter.lng];
            });

            var zero  = [0,37.6137272],
                polar = [84.886737,32.405546],
                east  = [55.753707000000006, 80],
                west  = [55.753707000000006, -4.25];
                spb   = [59.938879,30.315212],
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
            // var x = Math.random()*180;

            /*
            ** function LatLng shift
            */

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

            // reset coordinates array clone to default to avoid shift

            for (var j = 0; j < firstLatLngs.length; j++) {
              firstLatLngsClone[j] = new Array();
              for(var l = 0; l < firstLatLngs[j].length; l++){
                firstLatLngsClone[j].push(firstLatLngs[j][l]);
              }
            };

            map.removeLayer(firstFeature);
            map.fitBounds(shift.getBounds());

      });

    }  //select
  }); //autocomplete
}); //$
