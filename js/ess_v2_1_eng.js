//var popup;
// Elements that make up the popup.


// DEFINITION OF THE GEO LAYERS
skkraje_source = new ol.source.Vector({
		loader : function (extent) {
			$.ajax('http://skpilot-viewer.virt.ics.muni.cz/geoserver/wfs?', {
				type : 'GET',
				data : {
					service : 'WFS',
					version : '1.1.0',
					request : 'GetFeature',
					typename : 'sk_pilot_ess_rasters:sk_kraje',
					srsname : 'EPSG:3857',
					//cql_filter: "property='Value'",
					//cql_filter: "BBOX(geometry," + extent.join(',') + ")",
					bbox : extent.join(',') + ',EPSG:3857'
				},
			}).done(function (response) {
				formatWFS = new ol.format.WFS(),
				skkraje_source.addFeatures(formatWFS.readFeatures(response))
			});
		},
		strategy : ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
				maxZoom : 19
			})),
	});

skkraje_layer = new ol.layer.Vector({
		source : skkraje_source
	});

var ess11 = new ol.layer.Tile({
		source : new ol.source.TileWMS({
			preload : Infinity,

			url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType : 'geoserver',
			crossOrigin : 'anonymous',
			params : {
				'LAYERS' : "sk_pilot_ess_rasters:1_lesy_biomasa",
				'TILED' : true
			}
		})
	});

var ess12 = new ol.layer.Tile({
		source : new ol.source.TileWMS({
			preload : Infinity,
			opacity : 0.5,
			visible : false,
			url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType : 'geoserver',
			crossOrigin : 'anonymous',
			params : {
				'LAYERS' : "sk_pilot_ess_rasters:1_lesy_biomasa_norm",
				'TILED' : true
			}
		})
	});

var ess21 = new ol.layer.Tile({
		source : new ol.source.TileWMS({
			preload : Infinity,
			opacity : 0.5,
			visible : false,
			url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType : 'geoserver',
			crossOrigin : 'anonymous',
			params : {
				'LAYERS' : "sk_pilot_ess_rasters:2_dobytok_float",
				'TILED' : true
			}
		})
	});

var ess22 = new ol.layer.Tile({
		source : new ol.source.TileWMS({
			preload : Infinity,
			opacity : 0.5,
			visible : false,
			url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType : 'geoserver',
			crossOrigin : 'anonymous',
			params : {
				'LAYERS' : "sk_pilot_ess_rasters:2_dobytok_norm",
				'TILED' : true
			}
		})
	});

var ess31 = new ol.layer.Tile({
		source : new ol.source.TileWMS({
			preload : Infinity,
			opacity : 0.5,
			visible : false,
			url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType : 'geoserver',
			crossOrigin : 'anonymous',
			params : {
				'LAYERS' : "sk_pilot_ess_rasters:3_uhlik",
				'TILED' : true
			}
		})
	});

var ess32 = new ol.layer.Tile({
		source : new ol.source.TileWMS({
			preload : Infinity,
			opacity : 0.5,
			visible : false,
			url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType : 'geoserver',
			crossOrigin : 'anonymous',
			params : {
				'LAYERS' : "sk_pilot_ess_rasters:3_uhlik_norm",
				'TILED' : true
			}
		})
	});

var ess41 = new ol.layer.Tile({
		source : new ol.source.TileWMS({
			preload : Infinity,
			opacity : 0.5,
			visible : false,
			url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType : 'geoserver',
			crossOrigin : 'anonymous',
			params : {
				'LAYERS' : "sk_pilot_ess_rasters:4_CR",
				'TILED' : true
			}
		})
	});

var ess42 = new ol.layer.Tile({
		source : new ol.source.TileWMS({
			//preload: Infinity,
			opacity : 0.5,
			visible : false,
			url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType : 'geoserver',
			crossOrigin : 'anonymous',
			params : {
				'LAYERS' : "sk_pilot_ess_rasters:4_CR_norm",
				'TILED' : true
			}
		})
	});

var ess51 = new ol.layer.Tile({
		source : new ol.source.TileWMS({
			preload : Infinity,
			visible : false,
			url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType : 'geoserver',
			crossOrigin : 'anonymous',
			params : {
				'LAYERS' : "sk_pilot_ess_rasters:5_Biodiverzita",
				'TILED' : true
			}
		})
	});

var ess52 = new ol.layer.Tile({
		source : new ol.source.TileWMS({
			preload : Infinity,
			visible : false,
			url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType : 'geoserver',
			crossOrigin : 'anonymous',
			params : {
				'LAYERS' : "sk_pilot_ess_rasters:5_biodiv_norm",
				'TILED' : true
			}
		})
	});

var ess6 = new ol.layer.Tile({
		source : new ol.source.TileWMS({
			preload : Infinity,
			visible : false,
			url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType : 'geoserver',
			crossOrigin : 'anonymous',
			params : {
				'LAYERS' : "sk_pilot_ess_rasters:6_sluzieb_norm_final",
				'TILED' : true
			}
		})
	});

var olu = new ol.layer.Tile({
		source : new ol.source.TileWMS({
			//preload: Infinity,
			url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType : 'geoserver',
			visible : false,
			crossOrigin : null,
			params : {
				'LAYERS' : "sk_land_use:land_use_existing",
				'TILED' : true
			}
		})
	});

var selectEuropa = new ol.style.Style({
		stroke : new ol.style.Stroke({
			color : '#ff0000',
			width : 2
		})
	});

var defaultEuropa = new ol.style.Style({
		stroke : new ol.style.Stroke({
			color : '#0000ff',
			width : 1
		})
	});

var vectorEuropa = new ol.layer.Vector({
		id : 'slovakia',
		source : new ol.source.GeoJSON({
			projection : 'EPSG:3857',
			url : '../data/nutsv9_lea_sk.geojson'
		}),
		style : defaultEuropa
	});

var selectInteraction = new ol.interaction.Select({
		condition : ol.events.condition.singleClick,
		toggleCondition : ol.events.condition.shiftKeyOnly,
		layers : function (layer) {
			return layer.get('id') == 'slovakia';
		},
		style : selectEuropa
	});

/*
var modify = new ol.interaction.Modify({
features: selectInteraction.getFeatures()
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
					new ol.layer.Tile({
						source : new ol.source.TileJSON({
							url : 'http://api.tiles.mapbox.com/v3/' +
							'mapbox.world-borders-light.jsonp',
							crossOrigin : 'anonymous'
						})
					}),
					vectorEuropa
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
				layers : [olu]
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
			zoom : 7
		})
	});

map.getInteractions().extend([selectInteraction /*, modify*/
	]);

var selected_features = selectInteraction.getFeatures();

var dirty = {};

selected_features.on('add', function (evt) {
	var feature = evt.element;
	var fid = feature.getId();
	feature.on('change', function (evt) {
		dirty[evt.target.getId()] = true;
	});
});

selected_features.on('remove', function (evt) {
	var feature = evt.element;
	var fid = feature.getId();
	if (dirty[fid]) {
		console.log('changed');
	}
});

function bindInputs(layerid, layer) {
	new ol.dom.Input($(layerid + ' .visible')[0])
	.bindTo('checked', layer, 'visible');
	//$.each(['opacity', 'hue', 'saturation', 'contrast', 'brightness'],
	$.each(['opacity'],
		function (i, v) {
		new ol.dom.Input($(layerid + ' .' + v)[0])
		.bindTo('value', layer, v)
		.transform(parseFloat, String);
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
$('#visible70').click();

/*
$('#layertree li > span').click(function() {
$(this).siblings('fieldset').toggle();
}).siblings('fieldset').hide();
 */

$('#layertree li fieldset > span').click(function () {
	$(this).next().toggle();
}).next().hide();

//GET FEATURE INFO

var wmsSource = new ol.source.TileWMS({
		url : 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms',
		params : {
			'LAYERS' : 'sk_pilot_ess_rasters:1_lesy_biomasa,sk_pilot_ess_rasters:1_lesy_biomasa_norm,sk_pilot_ess_rasters:2_dobytok_float,sk_pilot_ess_rasters:2_dobytok_norm,sk_pilot_ess_rasters:3_uhlik,sk_pilot_ess_rasters:3_uhlik_norm,sk_pilot_ess_rasters:4_CR,sk_pilot_ess_rasters:4_CR_norm,sk_pilot_ess_rasters:5_Biodiverzita,sk_pilot_ess_rasters:5_biodiv_norm,sk_pilot_ess_rasters:6_sluzieb_norm_final,sk_land_use:land_use_existing'
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
	infoLayersEss.forEach(function (layer, i, layers) {
		if (layer.getVisible()) {
			getinfojson = layer.getSource().getGetFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:3857', {
					'INFO_FORMAT' : 'application/json',
					'FEATURE_COUNT' : '20'
				})
				console.log(getinfojson);
				$.getJSON(getinfojson, function (json){
				var prop_biom = json.features[0].properties;
				console.log(prop_biom);
				});
				
				
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
		}
	})

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
