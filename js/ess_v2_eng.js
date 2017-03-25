//var popup;
// Elements that make up the popup.

// FUNCTIONS FROM HSLAYERS TO PROXY

function proxify(url, toEncoding) {
	toEncoding = angular.isUndefined(toEncoding) ? true : toEncoding;
	var outUrl = url;
	if (url.substring(0, 4) == 'http' && url.indexOf(window.location.origin) == -1) {
		if (typeof use_proxy === 'undefined' || use_proxy === true) {

			outUrl = "/proxy/hsproxy.cgi?";
			if (toEncoding)
				outUrl = outUrl + "toEncoding=utf-8&";
			outUrl = outUrl + "url=" + encodeURIComponent(url);
		}
	}
	return outUrl;
}

function proxifyLayerLoader(lyr, tiled) {
	var src = lyr.getSource();
	if (tiled) {
		var tile_url_function = src.getTileUrlFunction() || src.tileUrlFunction();
		src.setTileUrlFunction(function (b, c, d) {
			return utils.proxify(decodeURIComponent(tile_url_function(b, c, d)));
		});
	} else {
		lyr.getSource().on('imageloadstart', function (img) {
			if (angular.isDefined(img.image.src_))
				img.image.src_ = utils.proxify(decodeURIComponent(img.image.src_), false);
		}, me);
	}
}

function escapeElementName(str) {
	return str.replace(':', '\\:').replace('.', '\\.');
}

//SELECT ?o ?p ?s FROM <http://www.sdi4apps.eu/poi.rdf> WHERE { ?o ?p ?s. {SELECT ?o FROM <http://www.sdi4apps.eu/poi.rdf> WHERE {?o <http://www.opengis.net/ont/geosparql#asWKT> ?geom. ?o  <http://www.openvoc.eu/poi#categoryWaze> <http://www.openvoc.eu/waze_classification#Food_and_drink>. FILTER(isBlank(?geom) = false). <extent>} LIMIT 100}}
var categoryWaze = ['http://gis.zcu.cz/SPOI/Ontology%23natural_feature',
	'http://gis.zcu.cz/SPOI/Ontology%23culture_and_entertainment',
	'http://gis.zcu.cz/SPOI/Ontology%23food_and_drink',
	'http://gis.zcu.cz/SPOI/Ontology%23lodging',
	'http://gis.zcu.cz/SPOI/Ontology%23professional_and_public',
	'http://gis.zcu.cz/SPOI/Ontology%23shopping_and_service',
	'http://gis.zcu.cz/SPOI/Ontology%23transportation',
	'http://gis.zcu.cz/SPOI/Ontology%23other',
	'http://gis.zcu.cz/SPOI/Ontology%23outdoor',
	'http://gis.zcu.cz/SPOI/Ontology%23car_service',
	'http://gis.zcu.cz/SPOI/Ontology%23camp_site',
	'http://gis.zcu.cz/SPOI/Ontology%23information',
	'http://gis.zcu.cz/SPOI/Ontology%23supermarket',
	'http://gis.zcu.cz/SPOI/Ontology%23hotel',
	'http://gis.zcu.cz/SPOI/Ontology%23restaurant',
	'http://gis.zcu.cz/SPOI/Ontology%23pub',
	'http://gis.zcu.cz/SPOI/Ontology%23fast_food',
	'http://gis.zcu.cz/SPOI/Ontology%23cafe',
	'http://gis.zcu.cz/SPOI/Ontology%23bank',
	'http://gis.zcu.cz/SPOI/Ontology%23atm',
	];

//SELECT ?o ?p ?s FROM <http://www.sdi4apps.eu/poi.rdf> WHERE { ?o ?p ?s. {SELECT ?o FROM <http://www.sdi4apps.eu/poi.rdf> WHERE {?o <http://www.opengis.net/ont/geosparql#asWKT> ?geom. ?o <http://www.openvoc.eu/poi#categoryOSM> ?c0. FILTER(str(?c0) = <amenity.bank>). FILTER(isBlank(?geom) = false). <extent>} LIMIT 100}}
var categoryOSM = ['amenity.arts_centre', 'amenity.atm', 'amenity.attraction', 'amenity.bank', 'amenity.bar', 'amenity.bbq', 'amenity.bicycle_parking', 'amenity.bicycle_rental', 'amenity.biergarten', 'amenity.bureau_de_change', 'amenity.bus_station', 'amenity.cafe', 'amenity.car_wash', 'amenity.clinic', 'amenity.dentist', 'amenity.doctors', 'amenity.embassy', 'amenity.fast_food', 'amenity.fire_station', 'amenity.food_court'];

//SELECT ?o ?p ?s FROM <http://www.sdi4apps.eu/poi.rdf> WHERE { ?o ?p ?s. {SELECT ?o FROM <http://www.sdi4apps.eu/poi.rdf> WHERE {?o <http://www.opengis.net/ont/geosparql#asWKT> ?geom. ?o <http://www.openvoc.eu/poi#category> ?c0. FILTER(str(?c0) = <leisure>). FILTER(isBlank(?geom) = false). <extent>} LIMIT 100}}

var category = ['leisure', 'man_made', 'historic', 'tourism', 'amenity', 'building', 'natural', 'place', 'waterway', 'railway', 'aeroway', 'highway', 'religion', 'site_type', 'military', 'boundary', 'shop', 'landuse', 'aerialway', 'sport'];

var format = 'image/png';

// GEOJSON DATA STYLE

var circle = new ol.style.Circle({
		radius : 75,
		fill : null,
		stroke : new ol.style.Stroke({
			color : 'red',
			width : 1
		})
	});

var iconPublic = new ol.style.Icon({
		anchor : [0.5, 0.5],
		size : [52, 52],
		//offset: [52, 0],
		opacity : 1,
		scale : 0.5,
		src : '/ol3/img/public.svg'
	});
var iconLodging = new ol.style.Icon({
		anchor : [0.5, 0.5],
		size : [52, 52],
		//offset: [52, 0],
		opacity : 1,
		scale : 0.5,
		src : '/ol3/img/lodging.svg'
	});
var iconPlace = new ol.style.Icon({
		anchor : [0.5, 0.5],
		size : [52, 52],
		//offset: [52, 0],
		opacity : 1,
		scale : 0.5,
		src : '/ol3/img/download.svg'
	});

var iconClimb = new ol.style.Icon({
		anchor : [0.5, 0.5],
		size : [52, 52],
		//offset: [52, 0],
		opacity : 1,
		scale : 0.5,
		src : '/ol3/img/outdoors.svg'
	});

var iconNatural = new ol.style.Icon({
		anchor : [0.5, 0.5],
		size : [64, 64],
		//offset: [52, 0],
		opacity : 1,
		scale : 0.5,
		src : '/ol3/img/owl.svg'
	});
var iconCulture = new ol.style.Icon({
		anchor : [0.5, 0.5],
		size : [64, 64],
		//offset: [52, 0],
		opacity : 1,
		scale : 0.5,
		src : '/ol3/img/culture.svg'
	});

var iconFood = new ol.style.Icon({
		anchor : [0.5, 0.5],
		size : [64, 64],
		//offset: [52, 0],
		opacity : 1,
		scale : 0.5,
		src : '/ol3/img/food.svg'
	});

var iconShopping = new ol.style.Icon({
		anchor : [0.5, 0.5],
		size : [64, 64],
		//offset: [52, 0],
		opacity : 1,
		scale : 0.5,
		src : '/ol3/img/shopping.svg'
	});

var iconTransportation = new ol.style.Icon({
		anchor : [0.5, 0.5],
		size : [64, 64],
		//offset: [52, 0],
		opacity : 1,
		scale : 0.5,
		src : '/ol3/img/transportation.svg'
	});

var iconCarservices = new ol.style.Icon({
		anchor : [0.5, 0.5],
		size : [64, 64],
		//offset: [52, 0],
		opacity : 1,
		scale : 0.5,
		src : '/ol3/img/carservices.svg'
	});

var styles = {
	'Point' : new ol.style.Style({
		image : iconPlace
	}),
	'LineString' : new ol.style.Style({
		stroke : new ol.style.Stroke({
			color : 'green',
			width : 1
		})
	}),
	'MultiLineString' : new ol.style.Style({
		stroke : new ol.style.Stroke({
			color : 'green',
			width : 1
		})
	}),
	'MultiPoint' : new ol.style.Style({
		image : iconPlace
	}),
	'MultiPolygon' : new ol.style.Style({
		stroke : new ol.style.Stroke({
			color : 'yellow',
			width : 1
		}),
		fill : new ol.style.Fill({
			color : 'rgba(255, 255, 0, 0.1)'
		})
	}),
	'Polygon' : new ol.style.Style({
		stroke : new ol.style.Stroke({
			color : 'blue',
			lineDash : [4],
			width : 3
		}),
		fill : new ol.style.Fill({
			color : 'rgba(0, 0, 255, 0.1)'
		})
	}),
	'GeometryCollection' : new ol.style.Style({
		stroke : new ol.style.Stroke({
			color : 'magenta',
			width : 2
		}),
		fill : new ol.style.Fill({
			color : 'magenta'
		}),
		image : new ol.style.Circle({
			radius : 10,
			fill : null,
			stroke : new ol.style.Stroke({
				color : 'magenta'
			})
		})
	}),
	'Circle' : new ol.style.Style({
		stroke : new ol.style.Stroke({
			color : 'red',
			width : 2
		}),
		fill : new ol.style.Fill({
			color : 'rgba(255,0,0,0.2)'
		})
	})
};

var styleFunction = function (feature) {
	return styles[feature.getGeometry().getType()];
};

// DEFINITION OF THE GEOSPATIAL DATA
	
var ess11 = new ol.layer.Tile({
	source : new ol.source.TileWMS({
	preload : Infinity,
	url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
	serverType : 'geoserver',
	crossOrigin : 'anonymous',
	params : {
	'LAYERS' : "sk_pilot_ess_rasters:1_lesy_biomasa",
	'TILED' : true,
	'FORMAT' : format,
	'VERSION' : '1.1.1'
	}
	}),
visible : false,
		opacity : 0.75
});	


var ess12 = new ol.layer.Tile({
	source : new ol.source.TileWMS({
	preload : Infinity,
	url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
	serverType : 'geoserver',
	crossOrigin : 'anonymous',
	params : {
	'LAYERS' : "sk_pilot_ess_rasters:1_lesy_biomasa_norm",
	'TILED' : true,
	'FORMAT' : format,
	'VERSION' : '1.1.1'
	}
	}),
visible : false,
		opacity : 0.75
});	


		
var ess21 = new ol.layer.Tile({
	source : new ol.source.TileWMS({
	preload : Infinity,
	url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
	serverType : 'geoserver',
	crossOrigin : 'anonymous',
	params : {
	'LAYERS' : "sk_pilot_ess_rasters:2_dobytok_float",
	'TILED' : true,
	'FORMAT' : format,
	'VERSION' : '1.1.1'
	}
	}),
visible : false,
		opacity : 0.75
});	


		
var ess22 = new ol.layer.Tile({
	source : new ol.source.TileWMS({
	preload : Infinity,
	url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
	serverType : 'geoserver',
	crossOrigin : 'anonymous',
	params : {
	'LAYERS' : "sk_pilot_ess_rasters:2_dobytok_norm",
	'TILED' : true,
	'FORMAT' : format,
	'VERSION' : '1.1.1'
	}
	}),
visible : false,
		opacity : 0.75
});	

var ess31 = new ol.layer.Tile({
	source : new ol.source.TileWMS({
	preload : Infinity,
	url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
	serverType : 'geoserver',
	crossOrigin : 'anonymous',
	params : {
	'LAYERS' : "sk_pilot_ess_rasters:3_uhlik",
	'TILED' : true,
	'FORMAT' : format,
	'VERSION' : '1.1.1'
	}
	}),
visible : false,
		opacity : 0.75
});	

var ess32 = new ol.layer.Tile({
	source : new ol.source.TileWMS({
	preload : Infinity,
	url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
	serverType : 'geoserver',
	crossOrigin : 'anonymous',
	params : {
	'LAYERS' : "sk_pilot_ess_rasters:3_uhlik_norm",
	'TILED' : true,
	'FORMAT' : format,
	'VERSION' : '1.1.1'
	}
	}),
visible : false,
		opacity : 0.75
});	

	
	
var ess41 = new ol.layer.Tile({
	source : new ol.source.TileWMS({
	preload : Infinity,
	url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
	serverType : 'geoserver',
	crossOrigin : 'anonymous',
	params : {
	'LAYERS' : "sk_pilot_ess_rasters:4_CR",
	'TILED' : true,
	'FORMAT' : format,
	'VERSION' : '1.1.1'
	}
	}),
visible : false,
		opacity : 0.75
});
	


var ess42 = new ol.layer.Tile({
	source : new ol.source.TileWMS({
	preload : Infinity,
	url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
	serverType : 'geoserver',
	crossOrigin : 'anonymous',
	params : {
	'LAYERS' : "sk_pilot_ess_rasters:4_CR_norm",
	'TILED' : true,
	'FORMAT' : format,
	'VERSION' : '1.1.1'
	}
	}),
visible : false,
		opacity : 0.75
});

var ess51 = new ol.layer.Tile({
	source : new ol.source.TileWMS({
	preload : Infinity,
	url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
	serverType : 'geoserver',
	crossOrigin : 'anonymous',
	params : {
	'LAYERS' : "sk_pilot_ess_rasters:5_biodiv",
	'TILED' : true,
	'FORMAT' : format,
	'VERSION' : '1.1.1'
	}
	}),
visible : false,
		opacity : 0.75
});
	
var ess52 = new ol.layer.Tile({
	source : new ol.source.TileWMS({
	preload : Infinity,
	url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
	serverType : 'geoserver',
	crossOrigin : 'anonymous',
	params : {
	'LAYERS' : "sk_pilot_ess_rasters:5_biodiv_norm",
	'TILED' : true,
	'FORMAT' : format,
	'VERSION' : '1.1.1'
	}
	}),
visible : false,
		opacity : 0.75
});

/*
var ess6 = new ol.layer.Tile({
		source : new ol.source.XYZ({
			crossOrigin : null,
			url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/gwc/service/tms/1.0.0/sk_pilot_ess_rasters:6_sluzieb_norm_final@EPSG:3857@png/{z}/{x}/{-y}.png'
		}),
		visible : false,
		opacity : 0.75
	});
*/	
	
var ess6 = new ol.layer.Tile({
source : new ol.source.TileWMS({
preload : Infinity,
url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
serverType : 'geoserver',
crossOrigin : 'anonymous',
params : {
'LAYERS' : "sk_pilot_ess_rasters:6_sluzieb_norm_final",
'TILED' : true,
'FORMAT' : format,
'VERSION' : '1.1.1'
}
}),
visible : true,
		opacity : 0.75
});

/*
	ess6.getSource().on('tileloadstart', function (event) {
	$(document).ready(function () {
		$("#loaderGif").css("display", "block");
	})
});
ess6.getSource().on('tileloadend', function (event) {
	$(document).ready(function () {
		$("#loaderGif").css("display", "none");
	})
});
*/
//olu_sk,olu_si,olu_hu,olu_rs,olu_au
	
var olu_sk = new ol.layer.Tile({
	source : new ol.source.TileWMS({
	preload : Infinity,
	url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
	serverType : 'geoserver',
	crossOrigin : 'anonymous',
	params : {
	'LAYERS' : "olu:lu_elu_object_sk",
	'TILED' : true,
	'FORMAT' : format,
	'VERSION' : '1.1.1'
	}
	}),
visible : false,
		opacity : 0.75
});


var olu_si = new ol.layer.Tile({
	source : new ol.source.TileWMS({
	preload : Infinity,
	url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
	serverType : 'geoserver',
	crossOrigin : 'anonymous',
	params : {
	'LAYERS' : "olu:lu_elu_object_si",
	'TILED' : true,
	'FORMAT' : format,
	'VERSION' : '1.1.1'
	}
	}),
visible : false,
		opacity : 0.75
});

var olu_hu = new ol.layer.Tile({
	source : new ol.source.TileWMS({
	preload : Infinity,
	url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
	serverType : 'geoserver',
	crossOrigin : 'anonymous',
	params : {
	'LAYERS' : "olu:lu_elu_object_hu",
	'TILED' : true,
	'FORMAT' : format,
	'VERSION' : '1.1.1'
	}
	}),
visible : false,
		opacity : 0.75
});

var olu_rs = new ol.layer.Tile({
	source : new ol.source.TileWMS({
	preload : Infinity,
	url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
	serverType : 'geoserver',
	crossOrigin : 'anonymous',
	params : {
	'LAYERS' : "olu:lu_elu_object_rs",
	'TILED' : true,
	'FORMAT' : format,
	'VERSION' : '1.1.1'
	}
	}),
visible : false,
		opacity : 0.75
});

var olu_au = new ol.layer.Tile({
	source : new ol.source.TileWMS({
	preload : Infinity,
	url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
	serverType : 'geoserver',
	crossOrigin : 'anonymous',
	params : {
	'LAYERS' : "olu:lu_elu_object_au",
	'TILED' : true,
	'FORMAT' : format,
	'VERSION' : '1.1.1'
	}
	}),
visible : false,
		opacity : 0.75
});
/*
	olu.getSource().on('tileloadstart', function (event) {
	$(document).ready(function () {
		$("#loaderGif").css("display", "block");
	})
});
olu.getSource().on('tileloadend', function (event) {
	$(document).ready(function () {
		$("#loaderGif").css("display", "none");
	})
});
*/

var skolu_source = new ol.source.Vector({
		format : new ol.format.GeoJSON(),
		url : function (extent) {
			$(document).ready(function () {
				$("#loaderGif").css("display", "block");
			});
			return 'http://data.datacove.eu:8080/geoserver/ows?service=WFS&' +
			'version=1.1.0&request=GetFeature&typename=lu:lu_elu_object_sk&' +
			'outputFormat=application/json&srsname=EPSG:3857&' +
			'bbox=' + extent.join(',') + ',EPSG:3857';
		},
		strategy : ol.loadingstrategy.bbox
	});

skolu_source.on('change', function (e) {
	if (skolu_source.getState() === 'ready') {
		$(document).ready(function () {
			$("#loaderGif").css("display", "none");
		})
	}
});

var skolu_layer = new ol.layer.Vector({
		id : "skolu",
		source : skolu_source,
		style : new ol.style.Style({
			stroke : new ol.style.Stroke({
				color : 'rgba(0, 0, 255, 0.75)',
				width : 1
			})
		}),
		visible : false
	});

var defaultEuropa = new ol.style.Style({
		stroke : new ol.style.Stroke({
			color : '#0000ff',
			width : 1
		})
	});

var skkraje_source = new ol.source.Vector({
		format : new ol.format.GeoJSON(),
		url : function (extent) {
			$(document).ready(function () {
				$("#loaderGif").css("display", "block");
			});
			return 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/ows?service=WFS&' +
			'version=1.1.0&request=GetFeature&typename=zbgis:hranice_kraje_1_3857&' +
			'outputFormat=application/json&srsname=EPSG:3857&' +
			'bbox=' + extent.join(',') + ',EPSG:3857';
		},
		strategy : ol.loadingstrategy.bbox
	});

skkraje_source.on('change', function (e) {
	if (skkraje_source.getState() === 'ready') {
		$(document).ready(function () {
			$("#loaderGif").css("display", "none");
		})
	}
});

var skkraje_layer = new ol.layer.Vector({
		id : "skkraje",
		source : skkraje_source,
		style : new ol.style.Style({
			stroke : new ol.style.Stroke({
				color : 'rgba(0, 0, 255, 0.75)',
				width : 2
			})
		}),
		visible : false
	});

var skokresy_source = new ol.source.Vector({
		format : new ol.format.GeoJSON(),
		url : function (extent) {
			$(document).ready(function () {
				$("#loaderGif").css("display", "block");
			});
			return 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/ows?service=WFS&' +
			'version=1.1.0&request=GetFeature&typename=zbgis:hranice_okresy_1_3857&' +
			'outputFormat=application/json&srsname=EPSG:3857&' +
			'bbox=' + extent.join(',') + ',EPSG:3857';
		},
		strategy : ol.loadingstrategy.bbox
	});

skokresy_source.on('change', function (e) {
	if (skokresy_source.getState() === 'ready') {
		$(document).ready(function () {
			$("#loaderGif").css("display", "none");
		})
	}
});

var skokresy_layer = new ol.layer.Vector({
		id : "skokresy",
		source : skokresy_source,
		style : new ol.style.Style({
			stroke : new ol.style.Stroke({
				color : 'rgba(0, 0, 255, 0.75)',
				width : 2
			})
		}),
		visible : false
	});

var skobce_source = new ol.source.Vector({
		format : new ol.format.GeoJSON(),
		url : function (extent) {
			$(document).ready(function () {
				$("#loaderGif").css("display", "block");
			});
			return 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/ows?service=WFS&' +
			'version=1.1.0&request=GetFeature&typename=zbgis:hranice_obce_1_3857&' +
			'outputFormat=application/json&srsname=EPSG:3857&' +
			'bbox=' + extent.join(',') + ',EPSG:3857';
		},
		strategy : ol.loadingstrategy.bbox
	});

skobce_source.on('change', function (e) {
	if (skobce_source.getState() === 'ready') {
		$(document).ready(function () {
			$("#loaderGif").css("display", "none");
		})
	}
});

var skobce_layer = new ol.layer.Vector({
		id : "skobce",
		source : skobce_source,
		style : new ol.style.Style({
			stroke : new ol.style.Stroke({
				color : 'rgba(0, 0, 255, 0.75)',
				width : 2
			})
		}),
		visible : false
	});

// DATA FROM OTN WFS
var otn_6_wfs_source = new ol.source.Vector({
		format : new ol.format.WFS(),
		url : function (extent) {
			$(document).ready(function () {
				$("#loaderGif").css("display", "block");
			});
			return '/cgi-bin/proxy.cgi?url=' + encodeURIComponent('http://gis.lesprojekt.cz/wms/transport/open_transport_map?service=WFS&' +
				'version=1.1.0&request=GetFeature&typename=road_classes&functionalroadclass_int=6&' +
				'srsname=EPSG:3857&' +
				'bbox=' + extent.join(',') + ',EPSG:3857');
		},
		strategy : ol.loadingstrategy.bbox,
		crossOrigin : null
	});

otn_6_wfs_source.on('change', function (e) {
	if (otn_6_wfs_source.getState() === 'ready') {
		$(document).ready(function () {
			$("#loaderGif").css("display", "none");
		})
	}
});

var otn_6_wfs_layer = new ol.layer.Vector({
		id : "otn_6",
		source : otn_6_wfs_source,
		style : new ol.style.Style({
			stroke : new ol.style.Stroke({
				color : 'rgba(192, 192, 192, 0.75)',
				width : 1
			})
		}),
		visible : false
	});

var otn_5_wfs_source = new ol.source.Vector({
		format : new ol.format.WFS(),
		url : function (extent) {
			$(document).ready(function () {
				$("#loaderGif").css("display", "block");
			});
			return '/cgi-bin/proxy.cgi?url=' + encodeURIComponent('http://gis.lesprojekt.cz/wms/transport/open_transport_map?service=WFS&' +
				'version=1.1.0&request=GetFeature&typename=road_classes&functionalroadclass_int=5&' +
				'srsname=EPSG:3857&' +
				'bbox=' + extent.join(',') + ',EPSG:3857');
		},
		strategy : ol.loadingstrategy.bbox,
		crossOrigin : null
	});

otn_5_wfs_source.on('change', function (e) {
	if (otn_5_wfs_source.getState() === 'ready') {
		$(document).ready(function () {
			$("#loaderGif").css("display", "none");
		})
	}
});

var otn_5_wfs_layer = new ol.layer.Vector({
		id : "otn_5",
		source : otn_5_wfs_source,
		style : new ol.style.Style({
			stroke : new ol.style.Stroke({
				color : 'rgba(128, 128, 128 , 0.75)',
				width : 1.25
			})
		}),
		visible : false
	});

var otn_4_wfs_source = new ol.source.Vector({
		format : new ol.format.WFS(),
		url : function (extent) {
			$(document).ready(function () {
				$("#loaderGif").css("display", "block");
			});
			return '/cgi-bin/proxy.cgi?url=' + encodeURIComponent('http://gis.lesprojekt.cz/wms/transport/open_transport_map?service=WFS&' +
				'version=1.1.0&request=GetFeature&typename=road_classes&functionalroadclass_int=4&' +
				'srsname=EPSG:3857&' +
				'bbox=' + extent.join(',') + ',EPSG:3857');
		},
		strategy : ol.loadingstrategy.bbox,
		crossOrigin : null
	});

otn_4_wfs_source.on('change', function (e) {
	if (otn_4_wfs_source.getState() === 'ready') {
		$(document).ready(function () {
			$("#loaderGif").css("display", "none");
		})
	}
});

var otn_4_wfs_layer = new ol.layer.Vector({
		id : "otn_4",
		source : otn_4_wfs_source,
		style : new ol.style.Style({
			stroke : new ol.style.Stroke({
				color : 'rgba(128, 128, 0, 0.75)',
				width : 1.50
			})
		}),
		visible : false
	});

var otn_3_wfs_source = new ol.source.Vector({
		format : new ol.format.WFS(),
		url : function (extent) {
			$(document).ready(function () {
				$("#loaderGif").css("display", "block");
			});
			return '/cgi-bin/proxy.cgi?url=' + encodeURIComponent('http://gis.lesprojekt.cz/wms/transport/open_transport_map?service=WFS&' +
				'version=1.1.0&request=GetFeature&typename=road_classes&functionalroadclass_int=3&' +
				'srsname=EPSG:3857&' +
				'bbox=' + extent.join(',') + ',EPSG:3857');
		},
		strategy : ol.loadingstrategy.bbox,
		crossOrigin : null
	});

otn_3_wfs_source.on('change', function (e) {
	if (otn_3_wfs_source.getState() === 'ready') {
		$(document).ready(function () {
			$("#loaderGif").css("display", "none");
		})
	}
});

var otn_3_wfs_layer = new ol.layer.Vector({
		id : "otn_3",
		source : otn_3_wfs_source,
		style : new ol.style.Style({
			stroke : new ol.style.Stroke({
				color : 'rgba(128,0,128, 0.75)',
				width : 1.75
			})
		}),
		visible : false
	});

var otn_2_wfs_source = new ol.source.Vector({
		format : new ol.format.WFS(),
		url : function (extent) {
			$(document).ready(function () {
				$("#loaderGif").css("display", "block");
			});
			return '/cgi-bin/proxy.cgi?url=' + encodeURIComponent('http://gis.lesprojekt.cz/wms/transport/open_transport_map?service=WFS&' +
				'version=1.1.0&request=GetFeature&typename=road_classes&functionalroadclass_int=2&' +
				'srsname=EPSG:3857&' +
				'bbox=' + extent.join(',') + ',EPSG:3857');
		},
		strategy : ol.loadingstrategy.bbox,
		crossOrigin : null
	});

otn_2_wfs_source.on('change', function (e) {
	if (otn_2_wfs_source.getState() === 'ready') {
		$(document).ready(function () {
			$("#loaderGif").css("display", "none");
		})
	}
});

var otn_2_wfs_layer = new ol.layer.Vector({
		id : "otn_2",
		source : otn_2_wfs_source,
		style : new ol.style.Style({
			stroke : new ol.style.Stroke({
				color : 'rgba(0,128,128, 0.75)',
				width : 2
			})
		}),
		visible : false
	});

var otn_1_wfs_source = new ol.source.Vector({
		format : new ol.format.WFS(),
		url : function (extent) {
			$(document).ready(function () {
				$("#loaderGif").css("display", "block");
			});
			return '/cgi-bin/proxy.cgi?url=' + encodeURIComponent('http://gis.lesprojekt.cz/wms/transport/open_transport_map?service=WFS&' +
				'version=1.1.0&request=GetFeature&typename=road_classes&functionalroadclass_int=1&' +
				'srsname=EPSG:3857&' +
				'bbox=' + extent.join(',') + ',EPSG:3857');
		},
		strategy : ol.loadingstrategy.bbox,
		crossOrigin : null
	});

otn_1_wfs_source.on('change', function (e) {
	if (otn_1_wfs_source.getState() === 'ready') {
		$(document).ready(function () {
			$("#loaderGif").css("display", "none");
		})
	}
});

var otn_1_wfs_layer = new ol.layer.Vector({
		id : "otn_1",
		source : otn_1_wfs_source,
		style : new ol.style.Style({
			stroke : new ol.style.Stroke({
				color : 'rgba(255,255,0, 0.75)',
				width : 2.25
			})
		}),
		visible : false
	});
/*
var otn_5_geojson_layer = new ol.layer.Vector({
		source : new ol.source.Vector({
			url : '/ol3/data/otn_5.geojson',
			format : new ol.format.GeoJSON()

		}),
		style : styleFunction,
		visible : false
	});
*/
/**
ADDING THE SDI4APPS SPOI DATA AVAILABLE VIA GEOSPARQL
 **/

// SAMPLE SPARQL QUERY http://data.plan4all.eu/sparql?default-graph-uri=&query=SELECT ?o ?p ?s FROM <http://www.sdi4apps.eu/poi.rdf> WHERE { ?o <http://www.openvoc.eu/poi#categoryWaze> <http://www.openvoc.eu/waze_classification#Professional_and_public>. ?o <http://www.opengis.net/ont/geosparql#asWKT> ?geom. FILTER(isBlank(?geom) = false). FILTER(bif:st_intersects(bif:st_geomfromtext("BOX(13.319077491760254 49.6991707786967, 13.45649242401123 49.77184148502897)"), ?geom)).	?o ?p ?s } ORDER BY ?o&should-sponge=&format=application/sparql-results+json&timeout=0&debug=on


function loadFeatures(objects) {
	var features = [];
	var i = 0.0;
	var format = new ol.format.WKT();
	for (var key in objects) {
		i++;
		if (objects[key]["http://www.opengis.net/ont/geosparql#asWKT"]) {
			//alert ("SUCCESSS");
			//console.log(objects[key ]["http://www.opengis.net/ont/geosparql#asWKT"]);
			var g_feature = format.readFeature(objects[key]['http://www.opengis.net/ont/geosparql#asWKT'].toUpperCase());
			objects[key].geometry = g_feature.getGeometry();
			objects[key].geometry.transform('EPSG:4326', 'EPSG:3857');
			delete objects[key]['http://www.opengis.net/ont/geosparql#asWKT'];
			var coord = objects[key].geometry.getCoordinates();
			//objects[key ].geometry = new ol.geom.Point(coord);
			//console.log(coord);
			var feature = new ol.Feature(objects[key]);
			features.push(feature);
			//console.log("FEATURES: " + coord);
		}
	}
	return features;
}
//SPOI PROF AND PUBLIC
var spoiSparqlSourceProfPub = new ol.source.Vector({
		format : new ol.format.GeoJSON(),
		loader : function (extent) {
			$("#loaderGif").css("display", "block");
			extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857", "EPSG:4326"));
			$.ajax({
				url :"http://data.plan4all.eu/sparql?default-graph-uri=&query=SELECT+%3Fo+%3Fp+%3Fs+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi.rdf%3E+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi_changes.rdf%3E+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi_categories.rdf%3E+WHERE+%7B+%3Fo+%3Chttp%3A%2F%2Fwww.openvoc.eu%2Fpoi%23class%3E+%3Fsub.+%3Fsub+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23subClassOf%3E+%3C"+ categoryWaze[4] +"%3E.+%3Fo+%3Chttp%3A%2F%2Fwww.opengis.net%2Font%2Fgeosparql%23asWKT%3E+%3Fgeom.+FILTER%28isBlank%28%3Fgeom%29+%3D+false%29.+FILTER%28bif%3Ast_intersects%28bif%3Ast_geomfromtext%28%22BOX(" + extent[0] + '%20' + extent[1] + ',%20' + extent[2] + '%20' + extent[3] + ")%22%29%2C+%3Fgeom%29%29.%09%3Fo+%3Fp+%3Fs+%7D+ORDER+BY+%3Fo&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on",
				context : this,
				data : {
					format : 'json',
				},
				error : function () {
					alert("WHOOPS ERROR OCCURED");
				},
				success : function (response) {
					var objects = {};
					for (var i = 0; i < response.results.bindings.length; i++) {
						var b = response.results.bindings[i];
						if (typeof objects[b.o.value] === 'undefined') {
							objects[b.o.value] = {
								'poi_id' : b.o.value
							};
						}
						objects[b.o.value][b.p.value] = b.s.value;
					}
					this.addFeatures(loadFeatures(objects));
				},
				type : 'GET'
			});
		},
		strategy : ol.loadingstrategy.bbox,
		crossOrigin : null
	})

	spoiSparqlSourceProfPub.on('change', function (e) {
		if (spoiSparqlSourceProfPub.getState() === 'ready') {
			$(document).ready(function () {
				$("#loaderGif").css("display", "none");
			})
		}
	});

var spoiSparqlLyr1 = new ol.layer.Vector({
		id : "spoiSparqlLyr1",
		source : spoiSparqlSourceProfPub,
		style : new ol.style.Style({
			image : iconPublic
		}),
		visible : false

	})
	//SPOI OUTDOORS
	var spoiSparqlSourceOutDor = new ol.source.Vector({
		format : new ol.format.GeoJSON(),
		loader : function (extent) {
			$("#loaderGif").css("display", "block");
			extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857", "EPSG:4326"));
			$.ajax({
				url :"http://data.plan4all.eu/sparql?default-graph-uri=&query=SELECT+%3Fo+%3Fp+%3Fs+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi.rdf%3E+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi_changes.rdf%3E+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi_categories.rdf%3E+WHERE+%7B+%3Fo+%3Chttp%3A%2F%2Fwww.openvoc.eu%2Fpoi%23class%3E+%3Fsub.+%3Fsub+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23subClassOf%3E+%3C"+ categoryWaze[8] +"%3E.+%3Fo+%3Chttp%3A%2F%2Fwww.opengis.net%2Font%2Fgeosparql%23asWKT%3E+%3Fgeom.+FILTER%28isBlank%28%3Fgeom%29+%3D+false%29.+FILTER%28bif%3Ast_intersects%28bif%3Ast_geomfromtext%28%22BOX(" + extent[0] + '%20' + extent[1] + ',%20' + extent[2] + '%20' + extent[3] + ")%22%29%2C+%3Fgeom%29%29.%09%3Fo+%3Fp+%3Fs+%7D+ORDER+BY+%3Fo&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on",
				context : this,
				data : {
					format : 'json',
				},
				error : function () {
					alert("WHOOPS ERROR OCCURED");
				},
				success : function (response) {
					var objects = {};
					for (var i = 0; i < response.results.bindings.length; i++) {
						var b = response.results.bindings[i];
						if (typeof objects[b.o.value] === 'undefined') {
							objects[b.o.value] = {
								'poi_id' : b.o.value
							};
						}
						objects[b.o.value][b.p.value] = b.s.value;
					}
					this.addFeatures(loadFeatures(objects));
				},
				type : 'GET'
			});
		},
		strategy : ol.loadingstrategy.bbox,
		crossOrigin : null
	})

	spoiSparqlSourceOutDor.on('change', function (e) {
		if (spoiSparqlSourceOutDor.getState() === 'ready') {
			$(document).ready(function () {
				$("#loaderGif").css("display", "none");
			})
		}
	});

var spoiSparqlLyr2 = new ol.layer.Vector({
		id : "spoiSparqlLyr2",
		source : spoiSparqlSourceOutDor,
		style : new ol.style.Style({
			image : iconClimb
		}),
		visible : false,
	})
	//SPOI OTHER
	var spoiSparqlSourceOther = new ol.source.Vector({
		format : new ol.format.GeoJSON(),
		loader : function (extent) {
			$("#loaderGif").css("display", "block");
			extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857", "EPSG:4326"));
			$.ajax({
				url :"http://data.plan4all.eu/sparql?default-graph-uri=&query=SELECT+%3Fo+%3Fp+%3Fs+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi.rdf%3E+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi_changes.rdf%3E+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi_categories.rdf%3E+WHERE+%7B+%3Fo+%3Chttp%3A%2F%2Fwww.openvoc.eu%2Fpoi%23class%3E+%3Fsub.+%3Fsub+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23subClassOf%3E+%3C"+ categoryWaze[7] +"%3E.+%3Fo+%3Chttp%3A%2F%2Fwww.opengis.net%2Font%2Fgeosparql%23asWKT%3E+%3Fgeom.+FILTER%28isBlank%28%3Fgeom%29+%3D+false%29.+FILTER%28bif%3Ast_intersects%28bif%3Ast_geomfromtext%28%22BOX(" + extent[0] + '%20' + extent[1] + ',%20' + extent[2] + '%20' + extent[3] + ")%22%29%2C+%3Fgeom%29%29.%09%3Fo+%3Fp+%3Fs+%7D+ORDER+BY+%3Fo&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on",
				context : this,
				data : {
					format : 'json',
				},
				error : function () {
					alert("WHOOPS ERROR OCCURED");
				},
				success : function (response) {
					var objects = {};

					for (var i = 0; i < response.results.bindings.length; i++) {
						var b = response.results.bindings[i];
						//console.log(JSON.stringify(b));

						if (typeof objects[b.o.value] === 'undefined') {
							objects[b.o.value] = {
								'poi_id' : b.o.value
							};
						}
						objects[b.o.value][b.p.value] = b.s.value;

					}
					this.addFeatures(loadFeatures(objects));
				},
				type : 'GET'
			});
		},
		strategy : ol.loadingstrategy.bbox,
		crossOrigin : null
	})
	spoiSparqlSourceOther.on('change', function (e) {
		if (spoiSparqlSourceOther.getState() === 'ready') {
			$(document).ready(function () {
				$("#loaderGif").css("display", "none");
			})
		}
	});

var spoiSparqlLyr3 = new ol.layer.Vector({
		id : "spoiSparqlLyr3",
		source : spoiSparqlSourceOther,
		style : new ol.style.Style({
			image : iconPlace
		}),
		visible : false,
	})

	//SPOI LODGING
	var spoiSparqlSourceLodging = new ol.source.Vector({
		format : new ol.format.GeoJSON(),
		loader : function (extent) {
			$("#loaderGif").css("display", "block");
			extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857", "EPSG:4326"));
			$.ajax({
				url :"http://data.plan4all.eu/sparql?default-graph-uri=&query=SELECT+%3Fo+%3Fp+%3Fs+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi.rdf%3E+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi_changes.rdf%3E+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi_categories.rdf%3E+WHERE+%7B+%3Fo+%3Chttp%3A%2F%2Fwww.openvoc.eu%2Fpoi%23class%3E+%3Fsub.+%3Fsub+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23subClassOf%3E+%3C"+ categoryWaze[3] +"%3E.+%3Fo+%3Chttp%3A%2F%2Fwww.opengis.net%2Font%2Fgeosparql%23asWKT%3E+%3Fgeom.+FILTER%28isBlank%28%3Fgeom%29+%3D+false%29.+FILTER%28bif%3Ast_intersects%28bif%3Ast_geomfromtext%28%22BOX(" + extent[0] + '%20' + extent[1] + ',%20' + extent[2] + '%20' + extent[3] + ")%22%29%2C+%3Fgeom%29%29.%09%3Fo+%3Fp+%3Fs+%7D+ORDER+BY+%3Fo&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on",
				context : this,
				data : {
					format : 'json',
				},
				error : function () {
					alert("WHOOPS ERROR OCCURED");
				},
				success : function (response) {
					var objects = {};

					for (var i = 0; i < response.results.bindings.length; i++) {
						var b = response.results.bindings[i];
						//console.log(JSON.stringify(b));

						if (typeof objects[b.o.value] === 'undefined') {
							objects[b.o.value] = {
								'poi_id' : b.o.value
							};
						}
						objects[b.o.value][b.p.value] = b.s.value;

					}
					this.addFeatures(loadFeatures(objects));
				},
				type : 'GET'
			});
		},
		strategy : ol.loadingstrategy.bbox,
		crossOrigin : null
	})
	spoiSparqlSourceLodging.on('change', function (e) {
		if (spoiSparqlSourceLodging.getState() === 'ready') {
			$(document).ready(function () {
				$("#loaderGif").css("display", "none");
			})
		}
	});

var spoiSparqlLyr4 = new ol.layer.Vector({
		id : "spoiSparqlLyr4",
		source : spoiSparqlSourceLodging,
		style : new ol.style.Style({
			image : iconLodging
		}),
		visible : false,
	})

	//SPOI NATURAL FEATURES
	var spoiSparqlSourceNatural = new ol.source.Vector({
		format : new ol.format.GeoJSON(),
		loader : function (extent) {
			$("#loaderGif").css("display", "block");
			extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857", "EPSG:4326"));
			$.ajax({
				url :"http://data.plan4all.eu/sparql?default-graph-uri=&query=SELECT+%3Fo+%3Fp+%3Fs+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi.rdf%3E+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi_changes.rdf%3E+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi_categories.rdf%3E+WHERE+%7B+%3Fo+%3Chttp%3A%2F%2Fwww.openvoc.eu%2Fpoi%23class%3E+%3Fsub.+%3Fsub+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23subClassOf%3E+%3C"+ categoryWaze[0] +"%3E.+%3Fo+%3Chttp%3A%2F%2Fwww.opengis.net%2Font%2Fgeosparql%23asWKT%3E+%3Fgeom.+FILTER%28isBlank%28%3Fgeom%29+%3D+false%29.+FILTER%28bif%3Ast_intersects%28bif%3Ast_geomfromtext%28%22BOX(" + extent[0] + '%20' + extent[1] + ',%20' + extent[2] + '%20' + extent[3] + ")%22%29%2C+%3Fgeom%29%29.%09%3Fo+%3Fp+%3Fs+%7D+ORDER+BY+%3Fo&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on",
				context : this,
				data : {
					format : 'json',
				},
				error : function () {
					alert("WHOOPS ERROR OCCURED");
				},
				success : function (response) {
					var objects = {};

					for (var i = 0; i < response.results.bindings.length; i++) {
						var b = response.results.bindings[i];
						//console.log(JSON.stringify(b));

						if (typeof objects[b.o.value] === 'undefined') {
							objects[b.o.value] = {
								'poi_id' : b.o.value
							};
						}
						objects[b.o.value][b.p.value] = b.s.value;

					}
					this.addFeatures(loadFeatures(objects));
				},
				type : 'GET'
			});
		},
		strategy : ol.loadingstrategy.bbox,
		crossOrigin : null
	})
	spoiSparqlSourceNatural.on('change', function (e) {
		if (spoiSparqlSourceNatural.getState() === 'ready') {
			$(document).ready(function () {
				$("#loaderGif").css("display", "none");
			})
		}
	});

var spoiSparqlLyr5 = new ol.layer.Vector({
		id : "spoiSparqlLyr5",
		source : spoiSparqlSourceNatural,
		style : new ol.style.Style({
			image : iconNatural
		}),
		visible : false,
	})

	//SPOI CULTURE AND ENTERTAINMENT FEATURES
	var spoiSparqlSourceCultural = new ol.source.Vector({
		format : new ol.format.GeoJSON(),
		loader : function (extent) {
			$("#loaderGif").css("display", "block");
			extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857", "EPSG:4326"));
			$.ajax({
				url :"http://data.plan4all.eu/sparql?default-graph-uri=&query=SELECT+%3Fo+%3Fp+%3Fs+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi.rdf%3E+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi_changes.rdf%3E+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi_categories.rdf%3E+WHERE+%7B+%3Fo+%3Chttp%3A%2F%2Fwww.openvoc.eu%2Fpoi%23class%3E+%3Fsub.+%3Fsub+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23subClassOf%3E+%3C"+ categoryWaze[1] +"%3E.+%3Fo+%3Chttp%3A%2F%2Fwww.opengis.net%2Font%2Fgeosparql%23asWKT%3E+%3Fgeom.+FILTER%28isBlank%28%3Fgeom%29+%3D+false%29.+FILTER%28bif%3Ast_intersects%28bif%3Ast_geomfromtext%28%22BOX(" + extent[0] + '%20' + extent[1] + ',%20' + extent[2] + '%20' + extent[3] + ")%22%29%2C+%3Fgeom%29%29.%09%3Fo+%3Fp+%3Fs+%7D+ORDER+BY+%3Fo&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on",
				context : this,
				data : {
					format : 'json',
				},
				error : function () {
					alert("WHOOPS ERROR OCCURED");
				},
				success : function (response) {
					var objects = {};

					for (var i = 0; i < response.results.bindings.length; i++) {
						var b = response.results.bindings[i];
						//console.log(JSON.stringify(b));

						if (typeof objects[b.o.value] === 'undefined') {
							objects[b.o.value] = {
								'poi_id' : b.o.value
							};
						}
						objects[b.o.value][b.p.value] = b.s.value;

					}
					this.addFeatures(loadFeatures(objects));
				},
				type : 'GET'
			});
		},
		strategy : ol.loadingstrategy.bbox,
		crossOrigin : null
	})
	spoiSparqlSourceCultural.on('change', function (e) {
		if (spoiSparqlSourceCultural.getState() === 'ready') {
			$(document).ready(function () {
				$("#loaderGif").css("display", "none");
			})
		}
	});

var spoiSparqlLyr6 = new ol.layer.Vector({
		id : "spoiSparqlLyr6",
		source : spoiSparqlSourceCultural,
		style : new ol.style.Style({
			image : iconCulture
		}),
		visible : false,
	})

	//SPOI FOOD AND DRINK
	var spoiSparqlSourceFood = new ol.source.Vector({
		format : new ol.format.GeoJSON(),
		loader : function (extent) {
			$("#loaderGif").css("display", "block");
			extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857", "EPSG:4326"));
			$.ajax({
				url :"http://data.plan4all.eu/sparql?default-graph-uri=&query=SELECT+%3Fo+%3Fp+%3Fs+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi.rdf%3E+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi_changes.rdf%3E+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi_categories.rdf%3E+WHERE+%7B+%3Fo+%3Chttp%3A%2F%2Fwww.openvoc.eu%2Fpoi%23class%3E+%3Fsub.+%3Fsub+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23subClassOf%3E+%3C"+ categoryWaze[2] +"%3E.+%3Fo+%3Chttp%3A%2F%2Fwww.opengis.net%2Font%2Fgeosparql%23asWKT%3E+%3Fgeom.+FILTER%28isBlank%28%3Fgeom%29+%3D+false%29.+FILTER%28bif%3Ast_intersects%28bif%3Ast_geomfromtext%28%22BOX(" + extent[0] + '%20' + extent[1] + ',%20' + extent[2] + '%20' + extent[3] + ")%22%29%2C+%3Fgeom%29%29.%09%3Fo+%3Fp+%3Fs+%7D+ORDER+BY+%3Fo&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on",
				context : this,
				data : {
					format : 'json',
				},
				error : function () {
					alert("WHOOPS ERROR OCCURED");
				},
				success : function (response) {
					var objects = {};

					for (var i = 0; i < response.results.bindings.length; i++) {
						var b = response.results.bindings[i];
						//console.log(JSON.stringify(b));

						if (typeof objects[b.o.value] === 'undefined') {
							objects[b.o.value] = {
								'poi_id' : b.o.value
							};
						}
						objects[b.o.value][b.p.value] = b.s.value;

					}
					this.addFeatures(loadFeatures(objects));
				},
				type : 'GET'
			});
		},
		strategy : ol.loadingstrategy.bbox,
		crossOrigin : null
	})
	spoiSparqlSourceFood.on('change', function (e) {
		if (spoiSparqlSourceFood.getState() === 'ready') {
			$(document).ready(function () {
				$("#loaderGif").css("display", "none");
			})
		}
	});

var spoiSparqlLyr7 = new ol.layer.Vector({
		id : "spoiSparqlLyr7",
		source : spoiSparqlSourceFood,
		style : new ol.style.Style({
			image : iconFood
		}),
		visible : false,
	})

	//SPOI SHOPPING
	var spoiSparqlSourceShopping = new ol.source.Vector({
		format : new ol.format.GeoJSON(),
		loader : function (extent) {
			$("#loaderGif").css("display", "block");
			extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857", "EPSG:4326"));
			$.ajax({
				url :"http://data.plan4all.eu/sparql?default-graph-uri=&query=SELECT+%3Fo+%3Fp+%3Fs+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi.rdf%3E+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi_changes.rdf%3E+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi_categories.rdf%3E+WHERE+%7B+%3Fo+%3Chttp%3A%2F%2Fwww.openvoc.eu%2Fpoi%23class%3E+%3Fsub.+%3Fsub+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23subClassOf%3E+%3C"+ categoryWaze[5] +"%3E.+%3Fo+%3Chttp%3A%2F%2Fwww.opengis.net%2Font%2Fgeosparql%23asWKT%3E+%3Fgeom.+FILTER%28isBlank%28%3Fgeom%29+%3D+false%29.+FILTER%28bif%3Ast_intersects%28bif%3Ast_geomfromtext%28%22BOX(" + extent[0] + '%20' + extent[1] + ',%20' + extent[2] + '%20' + extent[3] + ")%22%29%2C+%3Fgeom%29%29.%09%3Fo+%3Fp+%3Fs+%7D+ORDER+BY+%3Fo&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on",
				context : this,
				data : {
					format : 'json',
				},
				error : function () {
					alert("WHOOPS ERROR OCCURED");
				},
				success : function (response) {
					var objects = {};

					for (var i = 0; i < response.results.bindings.length; i++) {
						var b = response.results.bindings[i];
						//console.log(JSON.stringify(b));

						if (typeof objects[b.o.value] === 'undefined') {
							objects[b.o.value] = {
								'poi_id' : b.o.value
							};
						}
						objects[b.o.value][b.p.value] = b.s.value;

					}
					this.addFeatures(loadFeatures(objects));
				},
				type : 'GET'
			});
		},
		strategy : ol.loadingstrategy.bbox,
		crossOrigin : null
	})
	spoiSparqlSourceShopping.on('change', function (e) {
		if (spoiSparqlSourceShopping.getState() === 'ready') {
			$(document).ready(function () {
				$("#loaderGif").css("display", "none");
			})
		}
	});

var spoiSparqlLyr8 = new ol.layer.Vector({
		id : "spoiSparqlLyr8",
		source : spoiSparqlSourceShopping,
		style : new ol.style.Style({
			image : iconShopping
		}),
		visible : false,
	})

	//SPOI TRANSPORTATION
	var spoiSparqlSourceTransport = new ol.source.Vector({
		format : new ol.format.GeoJSON(),
		loader : function (extent) {
			$("#loaderGif").css("display", "block");
			extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857", "EPSG:4326"));
			$.ajax({
				url :"http://data.plan4all.eu/sparql?default-graph-uri=&query=SELECT+%3Fo+%3Fp+%3Fs+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi.rdf%3E+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi_changes.rdf%3E+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi_categories.rdf%3E+WHERE+%7B+%3Fo+%3Chttp%3A%2F%2Fwww.openvoc.eu%2Fpoi%23class%3E+%3Fsub.+%3Fsub+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23subClassOf%3E+%3C"+ categoryWaze[6] +"%3E.+%3Fo+%3Chttp%3A%2F%2Fwww.opengis.net%2Font%2Fgeosparql%23asWKT%3E+%3Fgeom.+FILTER%28isBlank%28%3Fgeom%29+%3D+false%29.+FILTER%28bif%3Ast_intersects%28bif%3Ast_geomfromtext%28%22BOX(" + extent[0] + '%20' + extent[1] + ',%20' + extent[2] + '%20' + extent[3] + ")%22%29%2C+%3Fgeom%29%29.%09%3Fo+%3Fp+%3Fs+%7D+ORDER+BY+%3Fo&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on",
				context : this,
				data : {
					format : 'json',
				},
				error : function () {
					alert("WHOOPS ERROR OCCURED");
				},
				success : function (response) {
					var objects = {};

					for (var i = 0; i < response.results.bindings.length; i++) {
						var b = response.results.bindings[i];
						//console.log(JSON.stringify(b));

						if (typeof objects[b.o.value] === 'undefined') {
							objects[b.o.value] = {
								'poi_id' : b.o.value
							};
						}
						objects[b.o.value][b.p.value] = b.s.value;

					}
					this.addFeatures(loadFeatures(objects));
				},
				type : 'GET'
			});
		},
		strategy : ol.loadingstrategy.bbox,
		crossOrigin : null
	})
	spoiSparqlSourceTransport.on('change', function (e) {
		if (spoiSparqlSourceTransport.getState() === 'ready') {
			$(document).ready(function () {
				$("#loaderGif").css("display", "none");
			})
		}
	});

var spoiSparqlLyr9 = new ol.layer.Vector({
		id : "spoiSparqlLyr9",
		source : spoiSparqlSourceTransport,
		style : new ol.style.Style({
			image : iconTransportation
		}),
		visible : false,
	})

	//SPOI CAR SERVICES
	var spoiSparqlSourceCar = new ol.source.Vector({
		format : new ol.format.GeoJSON(),
		loader : function (extent) {
			$("#loaderGif").css("display", "block");
			extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857", "EPSG:4326"));
			$.ajax({
				url :"http://data.plan4all.eu/sparql?default-graph-uri=&query=SELECT+%3Fo+%3Fp+%3Fs+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi.rdf%3E+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi_changes.rdf%3E+FROM+%3Chttp%3A%2F%2Fwww.sdi4apps.eu%2Fpoi_categories.rdf%3E+WHERE+%7B+%3Fo+%3Chttp%3A%2F%2Fwww.openvoc.eu%2Fpoi%23class%3E+%3Fsub.+%3Fsub+%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23subClassOf%3E+%3C"+ categoryWaze[9] +"%3E.+%3Fo+%3Chttp%3A%2F%2Fwww.opengis.net%2Font%2Fgeosparql%23asWKT%3E+%3Fgeom.+FILTER%28isBlank%28%3Fgeom%29+%3D+false%29.+FILTER%28bif%3Ast_intersects%28bif%3Ast_geomfromtext%28%22BOX(" + extent[0] + '%20' + extent[1] + ',%20' + extent[2] + '%20' + extent[3] + ")%22%29%2C+%3Fgeom%29%29.%09%3Fo+%3Fp+%3Fs+%7D+ORDER+BY+%3Fo&should-sponge=&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on",
				context : this,
				data : {
					format : 'json',
				},
				error : function () {
					alert("WHOOPS ERROR OCCURED");
				},
				success : function (response) {
					var objects = {};

					for (var i = 0; i < response.results.bindings.length; i++) {
						var b = response.results.bindings[i];
						//console.log(JSON.stringify(b));

						if (typeof objects[b.o.value] === 'undefined') {
							objects[b.o.value] = {
								'poi_id' : b.o.value
							};
						}
						objects[b.o.value][b.p.value] = b.s.value;

					}
					this.addFeatures(loadFeatures(objects));
				},
				type : 'GET'
			});
		},
		strategy : ol.loadingstrategy.bbox,
		crossOrigin : null
	})
	spoiSparqlSourceCar.on('change', function (e) {
		if (spoiSparqlSourceCar.getState() === 'ready') {
			$(document).ready(function () {
				$("#loaderGif").css("display", "none");
			})
		}
	});

var spoiSparqlLyr10 = new ol.layer.Vector({
		id : "spoiSparqlLyr10",
		source : spoiSparqlSourceCar,
		style : new ol.style.Style({
			image : iconCarservices
		}),
		visible : false,
	})


// EUNIS ES DATA

/*
var eunes1 = new ol.layer.Tile({
		source: new ol.source.XYZ({
		crossOrigin:null,
		url:'http://skpilot-viewer.virt.ics.muni.cz/geoserver/gwc/service/tms/1.0.0/geonode:chko_cerova_vrchovina@EPSG:900913@png/{z}/{x}/{-y}.png'
		}),
		visible : false,
		opacity : 0.75
		});


	var eunes1 = new ol.layer.Tile({
		source : new ol.source.TileWMS({
			preload : Infinity,
			opacity : 0.5,
			visible : false,
			url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType : 'geoserver',
			crossOrigin : 'anonymous',
			params : {
				'LAYERS' : "geonode:chko_cerova_vrchovina",
				'TILED' : true,
				'FORMAT' : format,
				'VERSION' : '1.1.1'
			}
		})
	});

*/	

var infoLayersEss = [ess11, ess12, ess21, ess22, ess31, ess32, ess41, ess42, ess51, ess52, ess6];
var map = new ol.Map({
		layers : [
			// BASE LAYERS
			new ol.layer.Group({
				layers : [
					new ol.layer.Tile({
						source : new ol.source.OSM()
					}),
					skkraje_layer,
					skokresy_layer,
					skobce_layer

				]
			}),
			// 1. Produkcia drevnej hmoty
			new ol.layer.Group({
				layers : [ess11, ess12]
			}),
			// 2. Počet kusov dobytka na ha pasienkov
			new ol.layer.Group({
				layers : [ess21, ess22]
			}),
			// 3. Ukladanie uhlika v jednotlivych typoch krajiny
			new ol.layer.Group({
				layers : [ess31, ess32]
			}),
			// 4. Kvalita uzemia z hladiska Cestovneho ruchu.
			new ol.layer.Group({
				layers : [ess41, ess42]
			}),
			// 5. Biodiverzita
			new ol.layer.Group({
				layers : [ess51, ess52]
			}),
			// 6. Celkove hodnotenie ESS
			new ol.layer.Group({
				layers : [ess6]
			}),

			// 7. Vyuzitie uzemia
			new ol.layer.Group({
				layers : [olu_sk,olu_si,olu_hu,olu_rs,olu_au]
			}),
			// 8. Open Transport Net
			new ol.layer.Group({
				layers : [otn_6_wfs_layer, otn_5_wfs_layer, otn_4_wfs_layer, otn_3_wfs_layer, otn_2_wfs_layer, otn_1_wfs_layer]
			}),
			// 9. Smart Points of Interest
			new ol.layer.Group({
				layers : [spoiSparqlLyr1, spoiSparqlLyr2, spoiSparqlLyr3, spoiSparqlLyr4, spoiSparqlLyr5, spoiSparqlLyr6, spoiSparqlLyr7, spoiSparqlLyr8, spoiSparqlLyr9, spoiSparqlLyr10]
			})
		],
		renderer : 'canvas', //exampleNS.getRendererFromQueryString(),
		target : 'map',
		interactions : ol.interaction.defaults({
			doubleClickZoom : false
		}),
		view : new ol.View({
			//projection : 'EPSG:3857',
			center : ol.proj.transform([19.156944, 48.738611], 'EPSG:4326', 'EPSG:3857'),
			zoom : 6
		})
	});

// SELECT INTERACTIONS

var selectNUTS = new ol.style.Style({
		stroke : new ol.style.Stroke({
			color : '#ff0000',
			width : 2
		})
	});
var style;
var selectSPOI = new ol.style.Style({
		image : new ol.style.Circle({
			fill : new ol.style.Fill({
				color : 'rgba(255, 255, 0, 0.5)'
			}),
			stroke : new ol.style.Stroke({
				color : 'ff0000'
			}),
			radius : 30
		})
	});
var selectInteractions = new ol.interaction.Select({
		condition : ol.events.condition.singleClick,
		toggleCondition : ol.events.condition.shiftKeyOnly,
		layers : function (layer) {
			/*
			if (skobce_layer.getVisible() == true) {
				return layer.get('id') == 'skobce';
			}
			if (skokresy_layer.getVisible() == true) {
				return layer.get('id') == 'skokresy';
			}
			if (skkraje_layer.getVisible() == true) {
				return layer.get('id') == 'skkraje';
			}
			if (spoiSparqlLyr5.getVisible() == true) {
				return layer.get('id') == 'spoiSparqlLyr5';
			} else if (spoiSparqlLyr1.getVisible() == true) {
				return layer.get('id') == 'spoiSparqlLyr1';
				
			
			}
			*/
			return layer.get('selectable') == true;
		},
		style : [selectSPOI, selectNUTS]
	});
	
spoiSparqlLyr10.set('selectable', true);
spoiSparqlLyr1.set('selectable', true);
spoiSparqlLyr2.set('selectable', true);
spoiSparqlLyr3.set('selectable', true);
spoiSparqlLyr4.set('selectable', true);
spoiSparqlLyr5.set('selectable', true);
spoiSparqlLyr6.set('selectable', true);
spoiSparqlLyr7.set('selectable', true);
spoiSparqlLyr8.set('selectable', true);
spoiSparqlLyr9.set('selectable', true);
skobce_layer.set('selectable', true);
skokresy_layer.set('selectable', true);
skkraje_layer.set('selectable', true);
otn_1_wfs_layer.set('selectable', true);
otn_2_wfs_layer.set('selectable', true);
otn_3_wfs_layer.set('selectable', true);
otn_4_wfs_layer.set('selectable', true);
otn_5_wfs_layer.set('selectable', true);
otn_6_wfs_layer.set('selectable', true);
skolu_layer.set('selectable', true);

/*
var modify = new ol.interaction.Modify({
features : selectInteraction.getFeatures()
});
 */
map.getInteractions().extend([selectInteractions]);

var selected_features = selectInteractions.getFeatures();

selected_features.on('add', function (evt) {
	console.log(evt.element);

	if (evt.element.T['poi_id']) {
		//console.log(evt.element.T);
		var swalText = '<table>';
		$.each(evt.element.T, function (key, value) {
			if (key != 'geometry' && key != 'poi_id') {
				swalText += '<tr><td><a href="' + key + '">' + key.substring(key.lastIndexOf("/") + 1, key.length) + ' : </a><a href="' + value + '">' + value + '</a></td></tr>'
			}
		});
		swalText += '</table>'
		swal({
			title : 'Map Feature Info',
			type : 'info',
			text : swalText
		});
	}
	
	if (evt.element.T['HILUCS_Code']) {
		//console.log(evt.element.T);
		var swalText = '<div>';
		$.each(evt.element.T, function (key, value) {
			if (key != 'geometry') {
				swalText += '<p>'+key+' : ' + value + '</p>'
			}
		});
		swalText += '</div>'
		swal({
			title : 'Map Feature Info',
			type : 'info',
			text : swalText
		});
	}
	var gmlID,
	name,
	allData;
	var feature = evt.element;
	var fid = feature.getId();
	var featureType = (fid.split("."))[0];
	var coord = feature.getGeometry().getCoordinates();
	var extent = feature.getGeometry().getExtent();
	var center = ol.extent.getCenter(extent);
	var extentCenter = (center + ',' + center);
	console.log("FEATURE ID IS: " + fid);
	console.log("FEATURE EXTENT IS: " + extent);
	console.log("FEATURE TYPE IS: " + featureType);
	console.log("CENTER OF EXTENT IS: " + center);
	var postData = '<wfs:GetFeature service="WFS" version="1.1.0" xmlns:sk_zbgis="sk_zbgis" xmlns:wfs="http://www.opengis.net/wfs" xmlns="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://skpilot-viewer.virt.ics.muni.cz/geoserver/schemas/wfs/1.1.0/wfs.xsd">' +
		'<wfs:Query typeName="' + featureType + '">' +
		'<Filter>' +
		'<Contains>' +
		'<PropertyName>geom</PropertyName>' +
		'<gml:Point srsName="http://www.opengis.net/gml/srs/epsg.xml#3857">' +
		'<gml:coordinates>' + center + '</gml:coordinates>' +
		'</gml:Point>' +
		'</Contains>' +
		'</Filter>' +
		'</wfs:Query>' +
		'</wfs:GetFeature>';
	$.ajax({
		type : 'POST',
		url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/ows',
		data : postData,
		//crossDomain : true,
		contentType : "text/xml",
		dataType : "text",
		success : function (xml) {
			var formatWFS = new ol.format.WFS();
			//var featuresInExtent = formatWFS.readFeatures(xml);
			name = $(xml).find("gml\\:featureMembers, featureMembers").first().find("sk_zbgis\\:nm3, nm3").text();
			//gmlID = $(xml).find("gml\\:featureMembers, featureMembers").find("[gml\\:id, id]").text();

			gmlID = $(xml).find(escapeElementName('sk_zbgis:' + featureType + '')).attr('gml:id');
			allData = $(xml).find(escapeElementName('sk_zbgis:' + featureType + '')).find().children();
			var featureInfoContent;
			//console.log(gmlID);
			//console.log(name);
			var parseXML = $.parseXML(xml);
			var wfsCollection = escapeElementName('wfs:FeatureCollection');
			var fetureMember = $(parseXML).find("gml\\:featureMembers, featureMembers").first().find("sk_zbgis\\:" + featureType + ", " + featureType + "").contents().each(function () {
					if (this.nodeName.indexOf("geom") === -1) {
						featureInfoContent += this.nodeName + ": " + this.textContent + "\n";
						console.log(this.nodeName + ": " + this.textContent + "\n");
					}
				});

			if (featureInfoContent != undefined) {
				swal("Map Feature Info", featureInfoContent);
			}

		}
	});
})

var dirty = {};

function bindInputs(layerid, layer) {
	var visibilityInput = $(layerid + ' .visible');
	visibilityInput.on('change', function () {
		layer.setVisible(this.checked);
	});
	visibilityInput.prop('checked', layer.getVisible());

	$.each(['opacity'],
		function (i, v) {
		var input = $(layerid + ' input.' + v);
		input.on('input change', function () {
			layer.set(v, parseFloat(this.value));
		});
		input.val(String(layer.get(v)));
	});
}

map.getLayers().forEach(function (layer, i) {
	bindInputs('#layer' + i, layer);
	if (layer instanceof ol.layer.Group) {
		layer.getLayers().forEach(function (sublayer, j) {
			bindInputs('#layer' + i + j, sublayer);
		});
	}
});

$('#visible7').click();
//$('#visible70').click();
$('#visible8').click();
//$('#visible70').click();
$('#visible9').click();
/*
$('#layertree li > span').click(function() {
$(this).siblings('fieldset').toggle();
}).siblings('fieldset').hide();
 */

$('#layertree li fieldset > span').click(function () {
	$(this).next().toggle();
}).next().hide();

$('#layertree li fieldset > span').click(function () {
	$(this).parent().next().toggle();
}).parent().next().hide();

//GET FEATURE INFO

var wmsSource = new ol.source.TileWMS({
		url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms',
		params : {
			'LAYERS' : 'sk_pilot_ess_rasters:1_lesy_biomasa,sk_pilot_ess_rasters:1_lesy_biomasa_norm,sk_pilot_ess_rasters:2_dobytok_float,sk_pilot_ess_rasters:2_dobytok_norm,sk_pilot_ess_rasters:3_uhlik,sk_pilot_ess_rasters:3_uhlik_norm,sk_pilot_ess_rasters:4_CR,sk_pilot_ess_rasters:4_CR_norm,sk_pilot_ess_rasters:5_biodiv,sk_pilot_ess_rasters:5_biodiv_norm,sk_pilot_ess_rasters:6_sluzieb_norm_final,olu:lu_elu_object_sk'
		},
		serverType : 'geoserver',
		crossOrigin : null
	});

var view = new ol.View({
		projection : 'EPSG:3857',
		center : ol.proj.transform([19.156944, 48.738611], 'EPSG:4326', 'EPSG:3857'),
		zoom : 7
	});
var myReceivedData = [];
var chartData = []; //+100 bodov :)
var A = 0;
var B = 0;
var C = 0;
var D = 0;
var E = 0;
var F = 0;
var G = 0;
var H = 0;
var I = 0;
var J = 0;
var K = 0;
var LU = 0;
var graf = [];
var LUK = 0;

function findBy(layer, key, value) {

	if (layer.get(key) === value) {
		return layer;
	}

	// Find recursively if it is a group
	if (layer.getLayers) {
		var layers = layer.getLayers().getArray(),
		len = layers.length,
		result;
		for (var i = 0; i < len; i++) {
			result = findBy(layers[i], key, value);
			if (result) {
				return result;
			}
		}
	}
	return null;
}

map.on('dblclick', function (evt) {
	//$('#mapicon').hide();
	//$('#mapiconpopup').hide();
	var coord = evt.coordinate;
	var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coord, "EPSG:3857", "EPSG:4326"));
	var viewResolution = /** @type {number} */
		(view.getResolution());
	//var getinfojson = '';
	var getinfojson = wmsSource.getGetFeatureInfoUrl(
			evt.coordinate, viewResolution, 'EPSG:3857', {
			'INFO_FORMAT' : 'application/json',
			'FEATURE_COUNT' : '20'
		});
	console.log(getinfojson);
	if (getinfojson) {
		$(function () {
			$.getJSON(getinfojson, function (json) {
				myReceivedData = [];
				A = json.features[0].properties.BIOMASA;
				B = json.features[1].properties.BIOMASA_NORM;
				C = json.features[2].properties.DOBYTOK;
				D = json.features[3].properties.DOBYTOK_NORM;
				E = json.features[4].properties.UHLIK; //.toFixed(4);
				F = json.features[5].properties.UHLIK_NORM; //.toFixed(4);
				G = json.features[6].properties.KVALITA_UZEMIA_CEST_RUCH;
				H = json.features[7].properties.KV_UZ_CR_NORM;
				I = json.features[8].properties.BIODIVERZITA;
				J = json.features[9].properties.BIOD_NORM;
				K = json.features[10].properties.HODNOTA_ESS;
				//LU = json.features[11].properties.hilucs_value;
				//LUK = LU.substr(49);
				//console.log(A);
				//console.log(B);
				//console.log(C);
				//console.log(D);
				//console.log(E);
				//console.log(F);
				//console.log(G);
				//console.log(H);
				//console.log(I);
				//console.log(J);
				//console.log(K);
				myTbody = $('<tbody>');

				chartData = [];

				if (A > '0') {
					myRow = $('<tr>').append("<td>Paper pulp</td>").append("<td>" + json.features[0].properties.BIOMASA + "</td>").append("<td>hectar/year</td>");
					myTbody.append(myRow);
				} else {
					AV = 'N/A';
				};

				if (B > '0' && B <= '0.2') {
					myRow = $('<tr>').append("<td>Paper pulp normalized</td>").append("<td>" + json.features[1].properties.BIOMASA_NORM + "</td>").append("<td>very low level of wood</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Paper pulp normalized',
						data : [B]
					});
				} else if (B > '0.2' && B <= '0.4') {
					myRow = $('<tr>').append("<td>Paper pulp normalized</td>").append("<td>" + json.features[1].properties.BIOMASA_NORM + "</td>").append("<td>low level of wood</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Paper pulp normalized',
						data : [B]
					});
				} else if (B > '0.4' && B <= '0.6') {
					myRow = $('<tr>').append("<td>Paper pulp normalized</td>").append("<td>" + json.features[1].properties.BIOMASA_NORM + "</td>").append("<td>average level of wood</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Paper pulp normalized',
						data : [B]
					});
				} else if (B > '0.6' && B <= '0.8') {
					myRow = $('<tr>').append("<td>Paper pulp normalized</td>").append("<td>" + json.features[1].properties.BIOMASA_NORM + "</td>").append("<td>high level of wood</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Paper pulp normalized',
						data : [B]
					});
				} else if (B > '0.8' && B <= '1') {
					myRow = $('<tr>').append("<td>Paper pulp normalized</td>").append("<td>" + json.features[1].properties.BIOMASA_NORM + "</td>").append("<td>very high level of wood</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Paper pulp normalized',
						data : [B]
					});
				} else {};

				if (C > '0') {
					myRow = $('<tr>').append("<td>Livestock</td>").append("<td>" + json.features[2].properties.DOBYTOK + "</td>").append("<td>pieces/hectar</td>");
					myTbody.append(myRow);
				} else {
					CV = 'N/A';
				};

				if (D > '0' && D <= '0.2') {
					myRow = $('<tr>').append("<td>Livestock normalized</td>").append("<td>" + json.features[3].properties.DOBYTOK_NORM + "</td>").append("<td>very low number of livestock</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Livestock normalized',
						data : [D]
					});
				} else if (D > '0.2' && D <= '0.4') {
					myRow = $('<tr>').append("<td>Livestock normalized</td>").append("<td>" + json.features[3].properties.DOBYTOK_NORM + "</td>").append("<td>low level of livestock</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Livestock normalized',
						data : [D]
					});
				} else if (D > '0.4' && D <= '0.6') {
					myRow = $('<tr>').append("<td>Livestock normalized</td>").append("<td>" + json.features[3].properties.DOBYTOK_NORM + "</td>").append("<td>average level of livestock</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Livestock normalized',
						data : [D]
					});
				} else if (D > '0.6' && D <= '0.8') {
					myRow = $('<tr>').append("<td>Livestock normalized</td>").append("<td>" + json.features[3].properties.DOBYTOK_NORM + "</td>").append("<td>high level of livestock</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Livestock normalized',
						data : [D]
					});

				} else if (D > '0.8' && D <= '1') {
					myRow = $('<tr>').append("<td>Livestock normalized</td>").append("<td>" + json.features[3].properties.DOBYTOK_NORM + "</td>").append("<td>very high level of livestock</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Livestock normalized',
						data : [D]
					});
				}

				if (E > '0') {
					myRow = $('<tr>').append("<td>Carbon</td>").append("<td>" + json.features[4].properties.UHLIK + "</td>").append("<td>ton/year</td>");
					myTbody.append(myRow);
				} else {
					EV = 'N/A';
				};

				if (F > '0' && F <= '0.2') {
					myRow = $('<tr>').append("<td>Carbon (norm.)</td>").append("<td>" + json.features[5].properties.UHLIK_NORM + "</td>").append("<td>very low volume of sequestrated carbon</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Carbon (norm.)',
						data : [F]
					});
				} else if (F > '0.2' && F <= '0.4') {
					myRow = $('<tr>').append("<td>Carbon (norm.)</td>").append("<td>" + json.features[5].properties.UHLIK_NORM + "</td>").append("<td>low volume of sequestrated carbon</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Carbon (norm.)',
						data : [F]
					});
				} else if (F > '0.4' && F <= '0.6') {
					myRow = $('<tr>').append("<td>Carbon (norm.)</td>").append("<td>" + json.features[5].properties.UHLIK_NORM + "</td>").append("<td>average volume of sequestrated carbon</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Carbon (norm.)',
						data : [F]
					});
				} else if (F > '0.6' && F <= '0.8') {
					myRow = $('<tr>').append("<td>Carbon (norm.)</td>").append("<td>" + json.features[5].properties.UHLIK_NORM + "</td>").append("<td>high volume of sequestrated carbon</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Carbon (norm.)',
						data : [F]
					});

				} else if (F > '0.8' && F <= '1.1') {
					myRow = $('<tr>').append("<td>Carbon (norm.)</td>").append("<td>" + F + "</td>").append("<td>very high volume of sequestrated carbon</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Carbon (norm.)',
						data : [F]
					});
				} else {};

				if (G > '0') {
					myRow = $('<tr>').append("<td>Landscape quality from tourism perspective</td>").append("<td>" + json.features[6].properties.KVALITA_UZEMIA_CEST_RUCH + "</td>").append("<td>1..10</td>");
					myTbody.append(myRow);

				} else {
					GV = 'N/A';
				};

				if (H > '0' && H <= '0.2') {
					myRow = $('<tr>').append("<td>Landscape quality from tourism perspective (norm.)</td>").append("<td>" + json.features[7].properties.KV_UZ_CR_NORM + "</td>").append("<td>very low potential</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Landscape quality from tourism perspective (norm.)',
						data : [H]
					});

				} else if (H > '0.2' && H <= '0.4') {
					myRow = $('<tr>').append("<td>Landscape quality from tourism perspective (norm.)</td>").append("<td>" + json.features[7].properties.KV_UZ_CR_NORM + "</td>").append("<td>low potential</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Landscape quality from tourism perspective (norm.)',
						data : [H]
					});
				} else if (H > '0.4' && H <= '0.6') {
					myRow = $('<tr>').append("<td>Landscape quality from tourism perspective (norm.)</td>").append("<td>" + json.features[7].properties.KV_UZ_CR_NORM + "</td>").append("<td>average potential</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Landscape quality from tourism perspective (norm.)',
						data : [H]
					});
				} else if (H > '0.6' && H <= '0.8') {
					myRow = $('<tr>').append("<td>Landscape quality from tourism perspective (norm.)</td>").append("<td>" + json.features[7].properties.KV_UZ_CR_NORM + "</td>").append("<td>high potential</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Landscape quality from tourism perspective (norm.)',
						data : [H]
					});
				} else if (H > '0.8' && H <= '1') {
					myRow = $('<tr>').append("<td>Landscape quality from tourism perspective (norm.)</td>").append("<td>" + json.features[7].properties.KV_UZ_CR_NORM + "</td>").append("<td>very high potential</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Landscape quality from tourism perspective (norm.)',
						data : [H]
					});
				} else {};

				if (I > '0') {
					myRow = $('<tr>').append("<td>Biodiversity</td>").append("<td>" + json.features[8].properties.BIODIVERZITA + "</td>").append("<td>0..6000</td>");
					myTbody.append(myRow);

				} else {
					IV = 'N/A';
				};

				if (J > '0' && J <= '0.2') {
					myRow = $('<tr>').append("<td>Biodiversity (norm.)</td>").append("<td>" + json.features[9].properties.BIOD_NORM + "</td>").append("<td>very low biodiversity</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Biodiversity (norm.)',
						data : [J]
					});
				} else if (J > '0.2' && J <= '0.4') {
					myRow = $('<tr>').append("<td>Biodiversity (norm.)</td>").append("<td>" + json.features[9].properties.BIOD_NORM + "</td>").append("<td>low biodiversity</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Biodiversity (norm.)',
						data : [J]
					});
				} else if (J > '0.4' && J <= '0.6') {
					myRow = $('<tr>').append("<td>Biodiversity (norm.)</td>").append("<td>" + json.features[9].properties.BIOD_NORM + "</td>").append("<td>average biodiversity</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Biodiversity (norm.)',
						data : [J]
					});
				} else if (J > '0.6' && J <= '0.8') {
					myRow = $('<tr>').append("<td>Biodiversity (norm.)</td>").append("<td>" + json.features[9].properties.BIOD_NORM + "</td>").append("<td>high biodiversity</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Biodiversity (norm.)',
						data : [J]
					});
				} else if (J > '0.8' && J <= '1') {
					myRow = $('<tr>').append("<td>Biodiversity (norm.)</td>").append("<td>" + json.features[9].properties.BIOD_NORM + "</td>").append("<td>very high biodiversity</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Biodiversity (norm.)',
						data : [J]
					});
				} else {};

				if (K > '0' && K <= '0.2') {
					myRow = $('<tr>').append("<td>Overall value of evaluated ESS</td>").append("<td>" + json.features[10].properties.BIOD_NORM + "</td>").append("<td>very low overall value of ESS</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Overall value of evaluated ESS',
						data : [K]
					});
				} else if (K > '0.2' && K <= '0.4') {
					myRow = $('<tr>').append("<td>Overall value of evaluated ESS</td>").append("<td>" + json.features[10].properties.BIOD_NORM + "</td>").append("<td>low overall value of ESS</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Overall value of evaluated ESS',
						data : [K]
					});
				} else if (K > '0.4' && K <= '0.6') {
					myRow = $('<tr>').append("<td>Overall value of evaluated ESS</td>").append("<td>" + json.features[10].properties.BIOD_NORM + "</td>").append("<td>average overall value of ESS</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Overall value of evaluated ESS',
						data : [K]
					});
				} else if (K > '0.6' && K <= '0.8') {
					myRow = $('<tr>').append("<td>Overall value of evaluated ESS</td>").append("<td>" + json.features[10].properties.BIOD_NORM + "</td>").append("<td>high overall value of ESS</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Overall value of evaluated ESS',
						data : [K]
					});
				} else if (K > '0.8') {
					myRow = $('<tr>').append("<td>Overall value of evaluated ESS</td>").append("<td>" + json.features[10].properties.BIOD_NORM + "</td>").append("<td>very high overall value of ESS</td>");
					myTbody.append(myRow);
					chartData.push({
						name : 'Overall value of evaluated ESS',
						data : [K]
					});
				} else {};

				// GENERATE THE OUTPUT POPUP
				myDiv = $('<div><h4>Geographic location: ' + hdms + '</h4></div>');
				myTableDiv = $('<div>').addClass('table-responsive');
				myTable = $('<table>').addClass('table').addClass('table-striped');

				myThead = $('<thead>')
					.append('<tr>')
					.append('<th>Type of ESS</th>')
					.append('<th>Value</th>')
					.append('<th>Unit/Normalized value</th>');
				myTableDiv.append(myTable)
				myTable.append(myThead);
				myTable.append(myTbody);
				myH4 = $('<h4>Graphical representation of normalized values of ESS</h4>');
				myDiv2 = $('<div id="graf" ></div>');
				//myDiv3=$('<div id="hilucs" ><h4>INSPIRE kód využitia územia: <a href="'+ LU +'" target="_blank">'+ LUK +'</a></h4></div>');

				$("#md-info-body").empty(); // vycistit
				$("#md-info-body").append(myDiv);
				$("#md-info-body").append(myTableDiv);
				$("#md-info-body").append(myH4);
				$("#md-info-body").append(myDiv2);
				//$("#md-info-body").append(myDiv3);

				$('#md-info').modal('show'); // toto by malo byt nakonci celeho toho
				//chartData = '['+ B +', '+ D +', '+ F +', '+ H +', '+ J + ', '+ K +']';
				//chartData musi byt [{ name: nieco data: nieco }, { name: nieco data: nieco }]

				/*
				categories: [
				'B - BIOMASA_NORM',
				'D - DOBYTOK_NORM',
				'F - UHLIK_NORM',
				'H - KV_UZ_CR_NORM',
				'J - BIOD_NORM',
				'K - HODNOTA_ESS'
				],
				 */

				//console.log(chartData);

				chartOptions = {
					chart : {
						type : 'column',
						renderTo : 'graf'
					},
					title : {
						text : ''
					},
					xAxis : {
						categories : [
							'ESS - normalized values'
						],
						crosshair : true
					},
					yAxis : {
						min : 0,
						title : {
							text : 'Normalized value'
						}
					},
					tooltip : {
						headerFormat : '<span style="font-size:10px">{point.key}</span><table>',
						pointFormat : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
						'<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
						footerFormat : '</table>',
						shared : true,
						useHTML : true
					},
					plotOptions : {
						column : {
							pointPadding : 0.2,
							borderWidth : 0
						}
					},
					series : chartData
				};

				$('#graf').highcharts(chartOptions);
			});
		})
	};
});

map.on('pointermove', function (evt) {
	if (evt.dragging) {
		return;
	}
	var pixel = map.getEventPixel(evt.originalEvent);
	var hit = map.forEachLayerAtPixel(pixel, function (layer) {
			return true;
		});
	map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

// MAP CONTROLS

//Attribution
var myAttributionControl = new ol.control.Attribution({
		className : 'ol-attribution', //default parameter
		target : null, //default parameter. Places attribution in a div
	});
map.addControl(myAttributionControl);

//Mouse Position
var mousePositionControl = new ol.control.MousePosition({
		className : 'ol-full-screen', //default parameter
		coordinateFormat : ol.coordinate.createStringXY(4), //This is the format we want the coordinate in.
		//The number arguement in createStringXY is the number of decimal places.
		projection : "EPSG:3857", //This is the actual projection of the coordinates.
		//Luckily, if our map is not native to the projection here, the coordinates will be transformed to the appropriate projection.
		className : "custom-mouse-position",
		target : undefined, //define a target if you have a div you want to insert into already,
		undefinedHTML : '&nbsp;' //what openlayers will use if the map returns undefined for a map coordinate.
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
		extent : undefined
	});

var interaction = new ol.interaction.DragBox({
		condition : ol.events.condition.noModifierKeys,
		style : new ol.style.Style({
			stroke : new ol.style.Stroke({
				color : [0, 0, 255, 1]
			})
		})
	});

interaction.on('boxend', function (evt) {
	var geom = evt.target.getGeometry();
	console.log(geom);
	var feat = new ol.Feature({
			geometry : geom
		});
	source.addFeature(feat);
});
