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

var borders, districts, shift;
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
      if (shift) {
        map.removeLayer(shift);
      }
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
        if (shift) {
          map.removeLayer(shift);
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
            // map.fitBounds(layer.getBounds());
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

    districts.once('data:loaded', function() {
        var poly = new L.Polygon(borders.getLayers()[0].getLatLngs());
        var newJSON = poly.toGeoJSON();
        console.log(newJSON);

        var svg = d3.select(map.getPanes().overlayPane).append("svg"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide");

        // var width = 700,
        // height = 580;
        //
        // var albersProjection = d3.geo.albers()
        //   .scale( 190000 )
        //   .rotate( [71.057,0] )
        //   .center( [0, 42.313] )
        //   .translate( [width/2,height/2] );
        //
        // var geoPath = d3.geo.path()
        //   .projection( albersProjection );
        //
        // borders.selectAll("path")
        //   .data(borders.features)
        //   .enter()
        //   .append("path")
        //   .attr( "fill", "#ccc" )
        //   .attr( "d", geoPath );


      function createSVG(error, borders) {
          if (error) throw error;

          var transform = d3.geo.transform({point: projectPoint}),
          projection = d3.geo.albers(),
            // .rotate([96, 0])
            // .center([-0.6, 38.7])
            // .parallels([29.5, 45.5])
            // .scale(1070)
            // .translate([960/2,500/2])
            // .precision(0.1),
          path = d3.geo.path().projection(transform);

          var feature = g.selectAll("path")
            .data(borders.features)
            .enter().append("path");

            map.on("viewreset", reset);
            reset();

  // Reposition the SVG to cover the features.
        function reset() {
            var bounds = path.bounds(borders),
              topLeft = bounds[0],
                bottomRight = bounds[1];

        svg.attr("width", bottomRight[0] - topLeft[0])
          .attr("height", bottomRight[1] - topLeft[1])
          .style("left", topLeft[0] + "px")
          .style("top", topLeft[1] + "px");

        g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

        feature.attr("d", path);
      }

      // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
      var point = map.latLngToLayerPoint(new L.LatLng(y, x));
      this.stream.point(point.x, point.y);
    }
  };
  createSVG();
  });
  } //select
  }); //autocomplete
}); //$
