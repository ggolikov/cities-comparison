require('leaflet-ajax');

/**
** Set Mapbox
*/

var map = L.map(document.getElementsByClassName('map')[0]).setView([55.58415969422116, 37.385264449999966],9);
var mapBox = L.tileLayer.provider('MapBox', {id: 'businesstat.liek2okp', accessToken: 'pk.eyJ1IjoiYnVzaW5lc3N0YXQiLCJhIjoiQ1hVdVdxZyJ9.sXqLsSh-1vhh11_BSL-g4Q'}).addTo(map);

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
        var poly = new L.Polygon(borders.getLayers()[0].getLatLngs());
        // map.addLayer(poly);
        var newPoly = new L.Polygon(districts.getLayers()[0].getLatLngs());
        // var behrmann = 'PROJCS["World_Behrmann",GEOGCS["GCS_WGS_1984",DATUM["WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]],PROJECTION["Behrmann"],PARAMETER["False_Easting",0],PARAMETER["False_Northing",0],PARAMETER["Central_Meridian",0],UNIT["Meter",1],AUTHORITY["EPSG","54017"]]';
        var customProjection = 'PROJCS["NAD83 / Massachusetts Mainland",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4269"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",42.68333333333333],PARAMETER["standard_parallel_2",41.71666666666667],PARAMETER["latitude_of_origin",41],PARAMETER["central_meridian",-71.5],PARAMETER["false_easting",200000],PARAMETER["false_northing",750000],AUTHORITY["EPSG","26986"],AXIS["X",EAST],AXIS["Y",NORTH]]';
        // var customProjection = '';
        var customProjection = 'PROJCS["US National Atlas Equal Area",GEOGCS["Unspecified datum based upon the Clarke 1866 Authalic Sphere",DATUM["Not_specified_based_on_Clarke_1866_Authalic_Sphere",SPHEROID["Clarke 1866 Authalic Sphere",6370997,0,AUTHORITY["EPSG","7052"]],AUTHORITY["EPSG","6052"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4052"]],PROJECTION["Lambert_Azimuthal_Equal_Area"],PARAMETER["latitude_of_center",45],PARAMETER["longitude_of_center",-100],PARAMETER["false_easting",0],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["X",EAST],AXIS["Y",NORTH],AUTHORITY["EPSG","2163"]]';
        var customProjection = 'PROJCS["WGS 84 / World Equidistant Cylindrical",GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]],PROJECTION["Equirectangular"],PARAMETER["latitude_of_origin",0],PARAMETER["central_meridian",0],PARAMETER["false_easting",0],PARAMETER["false_northing",0],UNIT["metre",1,AUTHORITY["EPSG","9001"]],AXIS["X",EAST],AXIS["Y",NORTH],AUTHORITY["EPSG","4087"]]';
        // var customProjection = 'PROJCS["Sphere_Behrmann",GEOGCS["GCS_Sphere",DATUM["Not_specified_based_on_Authalic_Sphere",SPHEROID["Sphere",6371000,0]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]],PROJECTION["Behrmann"],PARAMETER["False_Easting",0],PARAMETER["False_Northing",0],PARAMETER["Central_Meridian",0],UNIT["Meter",1],AUTHORITY["EPSG","53017"]]';
        var wgs84 = 'GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.0174532925199433,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"]]';

        var projectedCoords = [];
        for (var i = 0; i < poly._latlngs.length; i++) {
          var coordinate = proj4(customProjection, [poly._latlngs[i].lat, poly._latlngs[i].lng]);
          projectedCoords.push(coordinate);
        }
        var zero = proj4(customProjection, [0,0]),
            polar = proj4(customProjection, [80,80]);
        console.log(zero, polar);

        projectedCoords.push(projectedCoords[0]);
        var center = poly.getBounds().getCenter();
        var projectedCenter = proj4(customProjection, [center.lat, center.lng]);
        var newCenter = newPoly.getBounds().getCenter();
        var newProjectedCenter = proj4(customProjection, [newCenter.lat, newCenter.lng]);

            var offsets = [];
            for (var i = 0; i < projectedCoords.length; i++)  {
              var point = [];
              point.push(projectedCoords[i][0] - projectedCenter[0]);
              point.push(projectedCoords[i][1] - projectedCenter[1]);
              offsets.push(point);
            }

            // var x = newProjectedCenter[0];
            // var y = newProjectedCenter[1];
            var x = zero[0];
            var y = zero[1];
            // var x = polar[0];
            // var y = polar[1];

            map.panTo(borders.getBounds().getCenter());
            var newPoints = [];
            for (var i = 0; i < offsets.length; i++)  {
              var point = [];
              point.push(x + offsets[i][0]);
              point.push(y + offsets[i][1]);
              newPoints.push(point);
  	        }
            var llArray = [];
            for (var i = 0; i < newPoints.length; i++) {
              var ll = proj4(customProjection).inverse([newPoints[i][0],newPoints[i][1]]);
              llArray.push(ll);
            }
            shift = L.polygon(llArray, {weight: 2, color: "grey", fillColor: randomColor, opacity: 1, fillOpacity: 0.2}).addTo(map);
            map.removeLayer(borders);
              // console.log(shift.getBounds());
              map.fitBounds(shift.getBounds());
            //
            //
            //

      });

    }  //select
  }); //autocomplete
}); //$
