/*
 Map Selection Handler
 */
 
 /*
map.on('singleclick', function(e) {
  $('#mapSelectionDetails .modal-body').empty();
  var selectedCoords = ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326');
  var coordText = $("<p></p>").text("You clicked at: " + ol.coordinate.toStringXY(selectedCoords, 3));
  $('#mapSelectionDetails .modal-body').append(coordText);
  $("#mapSelectionDetails").modal('show');
});

*/

/*
 Search Submission Handler
 */
var renderPlacename = function(data){
  if (data.totalResultsCount === 0) {
    var notifyOpts = {position: 'bottom', className: 'warn', autoHideDelay: 2000};
    $('#placename-input').notify('No Results Found', notifyOpts);
  } else {
    var lng = parseFloat(data.geonames[0].lng);
    var lat = parseFloat(data.geonames[0].lat);
    map.setView(
      new ol.View({
        center: ol.proj.transform([lng, lat], 'EPSG:4326', 'EPSG:3857'),
        zoom: 12
      })
    );
    $('#placename-input').val('');
  }
};

/*
 Search Form Handler
 */
$('#placename-search').on('submit', function(e) {
  e.preventDefault();
  var spinnerOpts = {opacity: 0.25, lines: 15, length: 10, width: 1, scale: 3};
  //var spinner = new Spinner(spinnerOpts).spin(document.getElementById('wrapper'));
  $.ajax({
    url: 'http://api.geonames.org/search',
    dataType: 'json',
    data: {type: 'json', username: 'kpurdon', name: $('#placename-input').val()},
    success: function(data, textStatus, jqXHR) {
      renderPlacename(data);
      //spinner.stop();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      $.notify('Search Failed');
      //spinner.stop();
    }
  });
});