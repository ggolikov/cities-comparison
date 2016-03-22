require('leaflet-ajax');

/**
** Set Mapbox
*/
var attr_osm = 'Map data &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors',
attr_overpass = 'POI via <a href="http://www.overpass-api.de/">Overpass API</a>';

var map = L.map(document.getElementsByClassName('map')[0]).setView([55.58415969422116, 37.385264449999966],9);
var mapBox = L.tileLayer.provider('MapBox', {id: 'businesstat.liek2okp', accessToken: 'pk.eyJ1IjoiYnVzaW5lc3N0YXQiLCJhIjoiQ1hVdVdxZyJ9.sXqLsSh-1vhh11_BSL-g4Q'}).addTo(map);
L.control.scale().addTo(map);

/**
** Set OverPassAPI
*/

var opl = new L.OverPassLayer({
  // query: 'node(BBOX)["boundary"="administrative"]["admin_level"="8"]["name" = "городское поселение Сергиев Посад"];out;',
  query: 'node["amenity"="school"](BBOX);out;',
});

map.addLayer(opl);

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
      **    move polygon
      */

      // districts.once('data:loaded', function() {
      //   var poly = new L.Polygon(borders.getLayers()[0].getLatLngs());
      //   var newJSON = poly.toGeoJSON();
      //   console.log(newJSON);
      //   var center = poly.getBounds().getCenter();
      //   var points = poly.getLatLngs();
      //     var offsets = []
      //     for (var i = 0; i < points.length; i++)  {
      //       var point = [];
      //       point.push(points[i].lat - center.lat);
      //       point.push(points[i].lng - center.lng);
      //       offsets.push(point);
      //     }
      //     offsets.push(point);
      //
      //     var lat = districts.getBounds().getCenter().lat;
      //     var lng = districts.getBounds().getCenter().lng;
      //     map.panTo(borders.getBounds().getCenter());
      //     var newpoints = [];
      //     for (var i = 0; i < offsets.length; i++)  {
      //       var point = [];
      //       point.push(lat + offsets[i][0]);
      //       point.push(lng + offsets[i][1]);
      //       newpoints.push(point);
	    //     }
      //       shift = L.polygon(newpoints, {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2}).addTo(map);
      //       map.removeLayer(borders);
      //       console.log(shift.getBounds());
      //       map.fitBounds(shift.getBounds());
      // });

      /*
      **    overlay implementation using D3
      */

  //   districts.once('data:loaded', function() {
  //       var poly = new L.Polygon(borders.getLayers()[0].getLatLngs());
  //       // map.addLayer(poly);
  //       var newJSON = poly.toGeoJSON();
  //       console.log(poly);
  //       console.log(newJSON);
  //
  //       var svg = d3.select(map.getPanes().overlayPane).append("svg"),
  //       g = svg.append("g").attr("class", "leaflet-zoom-hide");
  //
  //       d3.json("https://raw.githubusercontent.com/ggolikov/cities-comparison/master/src/moscow.geo.json", function(error, collection) {
  //         if (error) throw error;
  //         console.log(collection);
  //         var okrug = collection.features;
  //         okrug.filter(function(feature){
  //             return feature.name == 'Центральный административный округ';//query1[query1.length-1];
  //             // console.log(feature.name);
  //         });
  //         console.log(okrug);
  //         console.log(borders);
  //         console.log(query1[query1.length-1]);
  //
  //         // var width = document.getElementsByClassName('map')[0].width,
  //         // height = document.getElementsByClassName('map')[0].height;
  //
  //         var projection = d3.geo.mercator();
  //           // .scale((width + 1) / 2 / Math.PI)
  //           // .translate([width / 2, height / 2])
  //           // .precision(.1);
  //
  //         var transform = d3.geo.transform({point: projectPoint}),
  //             path = d3.geo.path().projection(projection);
  //
  //             var feature = g.selectAll("path")
  //               .data(collection.features)
  //           .enter().append("path");
  //         map.on("viewreset", reset);
  //         reset();
  //
  //         // Reposition the SVG to cover the features.
  //         function reset() {
  //           var bounds = path.bounds(collection),
  //               topLeft = bounds[0],
  //               bottomRight = bounds[1];
  //
  //           svg .attr("width", bottomRight[0] - topLeft[0])
  //               .attr("height", bottomRight[1] - topLeft[1])
  //               .style("left", topLeft[0] + "px")
  //               .style("top", topLeft[1] + "px");
  //
  //           g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
  //
  //           feature.attr("d", path);
  //         }
  //
  //         // Use Leaflet to implement a D3 geometric transformation.
  //         function projectPoint(x, y) {
  //           var point = map.latLngToLayerPoint(new L.LatLng(y, x));
  //           this.stream.point(point.x, point.y);
  //         }
  //       });
  // });

  /*
  **    reproject
  */

      districts.once('data:loaded', function() {
        console.log(borders.getLayers().getLatLngs());
        console.log(districts.getLayers().getLatLngs());
                    var poly = new L.Polygon(borders.getLayers()[0].getLatLngs());
            var newPoly = new L.Polygon(districts.getLayers()[0].getLatLngs());
            var wgs84 = 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]';
            proj4.defs('EPSG:3410', "+proj=cea +lon_0=0 +lat_ts=30 +x_0=0 +y_0=0 +a=6371228 +b=6371228 +units=m +no_defs");
            proj4.defs('SR-ORG:6864', "+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
            var customProjection = proj4('SR-ORG:6864');

            /*
            ** LatLng shift
            */

            var zero = [0,37.6137272],
                polar = [84.886737,32.405546],
                east = [55.753707000000006, 80],
                west = [55.753707000000006, -4.25];
                spb = [59.938879,30.315212],
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
            // var x = 37.6137272;
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

            var shift = L.polygon(llArray, {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2}).addTo(map);
            map.removeLayer(borders);
            map.fitBounds(shift.getBounds());
      });

    }  //select
  }); //autocomplete
}); //$
