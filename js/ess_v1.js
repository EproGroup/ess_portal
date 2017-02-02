var popup;
// Elements that make up the popup.


var map = new ol.Map({
  layers: [
	// BASE LAYERS
	new ol.layer.Group({
		layers: [
		new ol.layer.Tile({
		source: new ol.source.OSM()
		}),
		new ol.layer.Tile({
			source: new ol.source.TileJSON({
				url: 'http://api.tiles.mapbox.com/v3/' +
					'mapbox.world-borders-light.jsonp',
				crossOrigin: 'anonymous'
			})
			})
		]
	}),	
	// 1. Produkcia drevnej hmoty
	new ol.layer.Group({
      layers: [
        new ol.layer.Tile({
			source: new ol.source.TileWMS({
			preload: Infinity,
				
			
			url: 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType:'geoserver',
			crossOrigin: 'anonymous',
			params:{
			'LAYERS':"sk_pilot_ess_rasters:1_lesy_biomasa", 'TILED':true
				}
			})
		}),
		new ol.layer.Tile({
			source: new ol.source.TileWMS({
			preload: Infinity,
			opacity: 0.5,
			visible: false,
			url: 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType:'geoserver',
			crossOrigin: 'anonymous',
			params:{
			'LAYERS':"sk_pilot_ess_rasters:1_lesy_biomasa_norm", 'TILED':true
				}
			})
		}) 
      ]
    }),
	// 2. Počet kusov dobytka na ha pasienkov
	new ol.layer.Group({
      layers: [
        new ol.layer.Tile({
			source: new ol.source.TileWMS({
			preload: Infinity,
			opacity: 0.5,
			visible: false,
			url: 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType:'geoserver',
			crossOrigin: 'anonymous',
			params:{
			'LAYERS':"sk_pilot_ess_rasters:2_dobytok_float", 'TILED':true
				}
			})
		}),
		new ol.layer.Tile({
			source: new ol.source.TileWMS({
			preload: Infinity,
			opacity: 0.5,
			visible: false,
			url: 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType:'geoserver',
			crossOrigin: 'anonymous',
			params:{
			'LAYERS':"sk_pilot_ess_rasters:2_dobytok_norm", 'TILED':true
				}
			})
		}) 
      ]
    }),
	// 3. Ukladanie uhlika v jednotlivych typoch krajiny
	new ol.layer.Group({
      layers: [
        new ol.layer.Tile({
			source: new ol.source.TileWMS({
			preload: Infinity,
			opacity: 0.5,
			visible: false,
			url: 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType:'geoserver',
			crossOrigin: 'anonymous',
			params:{
			'LAYERS':"sk_pilot_ess_rasters:3_uhlik", 'TILED':true
				}
			})
		}),
		new ol.layer.Tile({
			source: new ol.source.TileWMS({
			preload: Infinity,
			opacity: 0.5,
			visible: false,
			url: 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType:'geoserver',
			crossOrigin: 'anonymous',
			params:{
			'LAYERS':"sk_pilot_ess_rasters:3_uhlik_norm", 'TILED':true
				}
			})
		}) 
      ]
    }),
	// 4. Kvalita uzemia z hladiska Cestovneho ruchu.
	new ol.layer.Group({
      layers: [
        new ol.layer.Tile({
			source: new ol.source.TileWMS({
			preload: Infinity,
			opacity: 0.5,
			visible: false,
			url: 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType:'geoserver',
			crossOrigin: 'anonymous',
			params:{
			'LAYERS':"sk_pilot_ess_rasters:4_CR", 'TILED':true
				}
			})
		}),
		new ol.layer.Tile({
			source: new ol.source.TileWMS({
			//preload: Infinity,
			opacity: 0.5,
			visible: false,
			url: 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType:'geoserver',
			crossOrigin: 'anonymous',
			params:{
			'LAYERS':"sk_pilot_ess_rasters:4_CR_norm", 'TILED':true
				}
			})
		}) 
      ]
    }),
	// 5. Biodiverzita
 new ol.layer.Group({
      layers: [
        new ol.layer.Tile({
			source: new ol.source.TileWMS({
			preload: Infinity,
			visible: false,
			url: 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType:'geoserver',
			crossOrigin: 'anonymous',
			params:{
			'LAYERS':"sk_pilot_ess_rasters:5_Biodiverzita", 'TILED':true
				}
			})
		}),
		new ol.layer.Tile({
			source: new ol.source.TileWMS({
			preload: Infinity,
			visible: false,
			url: 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType:'geoserver',
			crossOrigin: 'anonymous',
			params:{
			'LAYERS':"sk_pilot_ess_rasters:5_biodiv_norm", 'TILED':true
				}
			})
		}) 
      ]
    }),
// 6. Celkove hodnotenie ESS
 new ol.layer.Group({
      layers: [
        new ol.layer.Tile({
			source: new ol.source.TileWMS({
			preload: Infinity,
			visible: false,
			url: 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType:'geoserver',
			crossOrigin: 'anonymous',
			params:{
			'LAYERS':"sk_pilot_ess_rasters:6_sluzieb_norm_final", 'TILED':true
				}
			})
		}) 
      ]
    })	
  ],
  renderer: 'canvas',//exampleNS.getRendererFromQueryString(),
  target: 'map',
  view: new ol.View({
	//projection : 'EPSG:3857',
    center: ol.proj.transform([19.156944,48.738611], 'EPSG:4326', 'EPSG:3857'),
    zoom: 7
  })
});

function bindInputs(layerid, layer) {
  new ol.dom.Input($(layerid + ' .visible')[0])
      .bindTo('checked', layer, 'visible');
  //$.each(['opacity', 'hue', 'saturation', 'contrast', 'brightness'],
  $.each(['opacity'],
      function(i, v) {
        new ol.dom.Input($(layerid + ' .' + v)[0])
            .bindTo('value', layer, v)
            .transform(parseFloat, String);
      }
  );
}
map.getLayers().forEach(function(layer, i) {
  bindInputs('#layer' + i, layer);
  if (layer instanceof ol.layer.Group) {
    layer.getLayers().forEach(function(sublayer, j) {
      bindInputs('#layer' + i + j, sublayer);
    });
  }
});

$('#layertree li > span').click(function() {
  $(this).siblings('fieldset').toggle();
}).siblings('fieldset').hide();

//GET FEATURE INFO


var wmsSource = new ol.source.TileWMS({
  url: 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms',
  params: {'LAYERS': 'sk_pilot_ess_rasters:1_lesy_biomasa,sk_pilot_ess_rasters:1_lesy_biomasa_norm,sk_pilot_ess_rasters:2_dobytok_float,sk_pilot_ess_rasters:2_dobytok_norm,sk_pilot_ess_rasters:3_uhlik,sk_pilot_ess_rasters:3_uhlik_norm,sk_pilot_ess_rasters:4_CR,sk_pilot_ess_rasters:4_CR_norm,sk_pilot_ess_rasters:5_Biodiverzita,sk_pilot_ess_rasters:5_biodiv_norm,sk_pilot_ess_rasters:6_sluzieb_norm_final'},
  serverType: 'geoserver',
  crossOrigin: ''
});

var view = new ol.View({
    projection: 'EPSG:3857',
	center: ol.proj.transform([19.156944,48.738611], 'EPSG:4326', 'EPSG:3857'),
    zoom: 7
  });

map.on('singleclick', function(evt) {
$('#mapicon').hide();
//$('#mapiconpopup').hide();
  var coord = evt.coordinate;
  var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coord, "EPSG:3857", "EPSG:4326"));
  document.getElementById('info').innerHTML = '';
  var viewResolution = (view.getResolution());
  var url = wmsSource.getGetFeatureInfoUrl(
      evt.coordinate, viewResolution, 'EPSG:3857',
      {'INFO_FORMAT': 'text/html',
	  'FEATURE_COUNT': '20'});
  if (url) {
    document.getElementById('info').innerHTML =
        '<h2>'+ hdms +'</h2><iframe seamless src="' + url + '"></iframe>';
	}
	map.addOverlay(new ol.Overlay({
	  position: coord,
      element: $('<img id="mapicon" src="http://skpilot-viewer.virt.ics.muni.cz/ol3/img/mapicon2.png" align="middle">').popover({'placement': 'top','html': true,'content':'<div width="250px"><strong>You clicked here: <h1>'+ hdms +'</h1></strong><iframe seamless src="' + url + '" width="240px"></iframe></div>'}).on('click', function (e) { $(".location-popover").not(this).popover('hide'); })
	}));
	
  /*
  var coord = evt.coordinate;
  var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coord, "EPSG:3857", "EPSG:4326"));
  $(document.getElementById('info').innerHTML =
        '<div id="infoPointCoord" style="float: left"><span>'+ hdms +'</span></div>'); */
});


map.on('pointermove', function(evt) {
  if (evt.dragging) {
    return;
  }
  var pixel = map.getEventPixel(evt.originalEvent);
  var hit = map.forEachLayerAtPixel(pixel, function(layer) {
    return true;
  });
  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

// MAP CONTROLS

//Attribution
var myAttributionControl = new ol.control.Attribution({
  className:'ol-attribution', //default parameter
  target:null, //default parameter. Places attribution in a div
});
map.addControl(myAttributionControl);


//Mouse Position
var mousePositionControl = new ol.control.MousePosition({
  className:'ol-full-screen', //default parameter
  coordinateFormat:ol.coordinate.createStringXY(4), //This is the format we want the coordinate in. 
  //The number arguement in createStringXY is the number of decimal places.
  projection:"EPSG:3857", //This is the actual projection of the coordinates. 
  //Luckily, if our map is not native to the projection here, the coordinates will be transformed to the appropriate projection.
  className:"custom-mouse-position",
  target:undefined, //define a target if you have a div you want to insert into already,
  undefinedHTML: '&nbsp;' //what openlayers will use if the map returns undefined for a map coordinate.
});
map.addControl(mousePositionControl);

//Full Screen
var myFullScreenControl = new ol.control.FullScreen();
map.addControl(myFullScreenControl);

//ZoomSlider
var myZoomSlider = new ol.control.ZoomSlider();
map.addControl(myZoomSlider);
//The zoom slider is a nice addition to your map. It is wise to have it accompany your zoom buttons.

//ScaleLine
var myScaleLine = new ol.control.ScaleLine()
map.addControl(myScaleLine);
//I often use the scale line. The default implementation looks nice

//Rotate
var myRotateControl = new ol.control.Rotate()
map.addControl(myRotateControl);

//ZoomToExtent
var myExtentButton = new ol.control.ZoomToExtent({
    extent:undefined
});