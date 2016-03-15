require('leaflet-ajax');

/**
** Set Mapbox
*/


var map = L.map(document.getElementsByClassName('map')[0]).setView([55.58415969422116, 37.385264449999966], 9);
var mapBox = L.tileLayer.provider('MapBox', {id: 'businesstat.liek2okp', accessToken: 'pk.eyJ1IjoiYnVzaW5lc3N0YXQiLCJhIjoiQ1hVdVdxZyJ9.sXqLsSh-1vhh11_BSL-g4Q'}).addTo(map);

/**
** Set GeoJSON
** &
** search-box
*/

var borders, districts;
var novo = [];
var query = [];
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
      query.length = 0;
      if (borders) {
        map.removeLayer(borders);
      }
      // if (districts) {
      //   map.removeLayer(districts);
      // }
      query.push(ui.item.value);

      borders = new L.geoJson.ajax("https://raw.githubusercontent.com/ggolikov/cities-comparison/master/src/moscow.geo.json", {
        onEachFeature: function(feature, layer) {
          layer.bindPopup(feature.properties.name);
          // novo.push(layer.getLatLngs());
          // console.log(novo[0]);
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
          return feature.name == query[query.length-1];
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
        query.length = 0;
        if (districts) {
          map.removeLayer(districts);
        }
        query.push(ui.item.value);

        var distStyle = {
          weight: 1,
          color: "grey",
          fillColor: randomColor,
          opacity: 1,
          fillOpacity: 0.7
        };

        districts = new L.geoJson.ajax("https://raw.githubusercontent.com/ggolikov/cities-comparison/master/src/moscow_districts.geo.json", {
          onEachFeature: function(feature, layer) {
            map.fitBounds(layer.getBounds());
            // console.log(layer.getBounds());
            layer.bindPopup(feature.properties.NAME);
            layer.on({
              mouseover: highlightFeature,
              mouseout: resetHighlight,
            });
          },
          style: distStyle,
          filter: function(feature) {
            return feature.properties.NAME == query[query.length-1];
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
**    move polygon
*/

      districts.once('data:loaded', function() {
        var poly = new L.Polygon(borders.getLayers()[0].getLatLngs());
        var center = poly.getBounds().getCenter();
        var points = poly.getLatLngs();
          var offsets = []
          for (var i = 0; i < points.length; i++)  {
            var point = [];
            point.push(points[i].lat - center.lat);
            point.push(points[i].lng - center.lng);
            offsets.push(point);
          }
          offsets.push(point);

          var lat = districts.getBounds().getCenter().lat;
          var lng = districts.getBounds().getCenter().lng;
          map.panTo(borders.getBounds().getCenter());
          var newpoints = [];
          for (var i = 0; i < offsets.length; i++)  {
            var point = [];
            point.push(lat + offsets[i][0]);
            point.push(lng + offsets[i][1]);
            newpoints.push(point);
	        }
            var shift = L.polygon(newpoints, {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2}).addTo(map);
            map.fitBounds(shift);
            map.removeLayer(borders);
      });

    }
  });
});
