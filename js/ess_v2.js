//var popup;
// Elements that make up the popup.

skkraje_source = new ol.source.Vector({
	loader: function(extent) {
		$.ajax('http://skpilot-viewer.virt.ics.muni.cz/geoserver/wfs?',{
			type: 'GET',
			data: {
				service: 'WFS',
				version: '1.1.0',
				request: 'GetFeature',
				typename: 'sk_pilot_ess_rasters:sk_kraje',
				srsname: 'EPSG:3857',
				//cql_filter: "property='Value'",
				//cql_filter: "BBOX(geometry," + extent.join(',') + ")",
				bbox: extent.join(',') + ',EPSG:3857'
				},
			}).done(function(response) {
				formatWFS = new ol.format.WFS(),
				skkraje_source.addFeatures(formatWFS.readFeatures(response))
				});
		},
		strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
			maxZoom: 19
			})),
	});

skkraje_layer = new ol.layer.Vector({
      source: skkraje_source
  }); 

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
		],
    }),

// 7. Vyuzitie uzemia
new ol.layer.Group({
      layers: [
        new ol.layer.Tile({
			source: new ol.source.TileWMS({
			//preload: Infinity,
			url: 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms?',
			serverType:'geoserver',
			visible: false,
			crossOrigin: null,
			params:{
			'LAYERS':"sk_land_use:land_use_existing", 'TILED':true
				}
			})
		})
		],
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
$('#visible7').click();
$('#visible70').click();

/*
$('#layertree li > span').click(function() {
  $(this).siblings('fieldset').toggle();
}).siblings('fieldset').hide();
*/

$('#layertree li fieldset > span').click(function() {
  $(this).next().toggle();
}).next().hide();

//GET FEATURE INFO

var wmsSource = new ol.source.TileWMS({
  url: 'http://skpilot-viewer.virt.ics.muni.cz/geoserver/wms',
  params: {'LAYERS': 'sk_pilot_ess_rasters:1_lesy_biomasa,sk_pilot_ess_rasters:1_lesy_biomasa_norm,sk_pilot_ess_rasters:2_dobytok_float,sk_pilot_ess_rasters:2_dobytok_norm,sk_pilot_ess_rasters:3_uhlik,sk_pilot_ess_rasters:3_uhlik_norm,sk_pilot_ess_rasters:4_CR,sk_pilot_ess_rasters:4_CR_norm,sk_pilot_ess_rasters:5_Biodiverzita,sk_pilot_ess_rasters:5_biodiv_norm,sk_pilot_ess_rasters:6_sluzieb_norm_final,sk_land_use:land_use_existing'},
  serverType: 'geoserver',
  crossOrigin: null
});

var view = new ol.View({
    projection: 'EPSG:3857',
	center: ol.proj.transform([19.156944,48.738611], 'EPSG:4326', 'EPSG:3857'),
    zoom: 7
  });
var myReceivedData=[];
var chartData=[]; //+100 bodov :)
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
var graf=[];
var LUK = 0;
map.on('singleclick', function(evt) {
//$('#mapicon').hide();
//$('#mapiconpopup').hide();
  var coord = evt.coordinate;
  var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coord, "EPSG:3857", "EPSG:4326"));
  var viewResolution = /** @type {number} */ (view.getResolution());
  var getinfojson = wmsSource.getGetFeatureInfoUrl(
      evt.coordinate, viewResolution, 'EPSG:3857',
      {'INFO_FORMAT': 'application/json',
	  'FEATURE_COUNT': '20'});
	  console.log(getinfojson);
 if (getinfojson){
	 $(function () {
	 	$.getJSON(getinfojson, function (json) {
			myReceivedData=[];
			A = json.features[0].properties.BIOMASA;
			B = json.features[1].properties.BIOMASA_NORM;
			C = json.features[2].properties.DOBYTOK;
			D = json.features[3].properties.DOBYTOK_NORM;
			E = json.features[4].properties.UHLIK;//.toFixed(4);
			F = json.features[5].properties.UHLIK_NORM;//.toFixed(4);
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
			myTbody=$('<tbody>');
			
			chartData = [];
			
			if (A > '0'){
				myRow=$('<tr>').append("<td>Biomasa</td>").append("<td>"+json.features[0].properties.BIOMASA+"</td>").append("<td>hektar/rok</td>");
				myTbody.append(myRow);	
			}
			else {
				AV = 'N/A';
			};
			
			
			if (B > '0' && B <= '0.2'){
				myRow=$('<tr>').append("<td>Biomasa normalizovaná</td>").append("<td>"+json.features[1].properties.BIOMASA_NORM+"</td>").append("<td>velmi nizky objem drevnej hmoty</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Biomasa normalizovaná', data: [B] });
			}
			else if (B > '0.2' && B <= '0.4'){
				myRow=$('<tr>').append("<td>Biomasa normalizovaná</td>").append("<td>"+json.features[1].properties.BIOMASA_NORM+"</td>").append("<td>nizky objem drevnej hmoty</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Biomasa normalizovaná', data: [B] });
			}
			else if (B > '0.4' && B <= '0.6'){
				myRow=$('<tr>').append("<td>Biomasa normalizovaná</td>").append("<td>"+json.features[1].properties.BIOMASA_NORM+"</td>").append("<td>stredný objem drevnej hmoty</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Biomasa normalizovaná', data: [B] });
			}
			else if (B > '0.6' && B <= '0.8'){
				myRow=$('<tr>').append("<td>Biomasa normalizovaná</td>").append("<td>"+json.features[1].properties.BIOMASA_NORM+"</td>").append("<td>vysoký objem drevnej hmoty</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Biomasa normalizovaná', data: [B] });
			}
			else if (B > '0.8' && B <= '1'){
				myRow=$('<tr>').append("<td>Biomasa normalizovaná</td>").append("<td>"+json.features[1].properties.BIOMASA_NORM+"</td>").append("<td>veľmi vysoký objem drevnej hmoty</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Biomasa normalizovaná', data: [B] });
			}
			else {};			
			
			if (C > '0'){
				myRow=$('<tr>').append("<td>Dobytok</td>").append("<td>"+json.features[2].properties.DOBYTOK+"</td>").append("<td>kusov/hektar</td>");
				myTbody.append(myRow);	
			}
			else {
				CV = 'N/A';
			};
			
			if (D > '0' && D <='0.2'){
				myRow=$('<tr>').append("<td>Dobytok normalizovaný</td>").append("<td>"+json.features[3].properties.DOBYTOK_NORM+"</td>").append("<td>veľmi nízky počet dobytka</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Dobytok normalizovaný', data: [D] });
			}
			else if (D > '0.2' && D <='0.4')
			{
				myRow=$('<tr>').append("<td>Dobytok normalizovaný</td>").append("<td>"+json.features[3].properties.DOBYTOK_NORM+"</td>").append("<td>nízky počet dobytka</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Dobytok normalizovaný', data: [D] });
			}
			else if (D > '0.4' && D <='0.6')
			{
				myRow=$('<tr>').append("<td>Dobytok normalizovaný</td>").append("<td>"+json.features[3].properties.DOBYTOK_NORM+"</td>").append("<td>stredný počet dobytka</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Dobytok normalizovaný', data: [D] });
			}
			else if (D > '0.6' && D <='0.8')
			{
				myRow=$('<tr>').append("<td>Dobytok normalizovaný</td>").append("<td>"+json.features[3].properties.DOBYTOK_NORM+"</td>").append("<td>vysoký počet dobytka</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Dobytok normalizovaný', data: [D] });
				
			}
			else if (D > '0.8' && D <='1')
			{
				myRow=$('<tr>').append("<td>Dobytok normalizovaný</td>").append("<td>"+json.features[3].properties.DOBYTOK_NORM+"</td>").append("<td>veľmi vysoký počet dobytka</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Dobytok normalizovaný', data: [D] });
			}
			
			if (E > '0'){
				myReceivedData['UHLIK']=json.features[4].properties.UHLIK;
				myRow=$('<tr>').append("<td>Uhlík</td>").append("<td>"+json.features[4].properties.UHLIK+"</td>").append("<td>ton/rok</td>");
				myTbody.append(myRow);
			}
			else {
				EV = 'N/A';
			};
			
			if (F > '0' && F <= '0.2'){
				myRow=$('<tr>').append("<td>Uhlík (norm.)</td>").append("<td>"+json.features[5].properties.UHLIK_NORM+"</td>").append("<td>velmi nizky objem ukladaného CO2 v krajine</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Uhlík (norm.)', data: [F] });
			}
			else if (F > '0.2' && F <= '0.4')
			{
				myRow=$('<tr>').append("<td>Uhlík (norm.)</td>").append("<td>"+json.features[5].properties.UHLIK_NORM+"</td>").append("<td>nizky objem ukladaného CO2 v krajine</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Uhlík (norm.)', data: [F] });
			}
			else if (F > '0.4' && F <= '0.6')
			{
				myRow=$('<tr>').append("<td>Uhlík (norm.)</td>").append("<td>"+json.features[5].properties.UHLIK_NORM+"</td>").append("<td>stredný objem ukladaného CO2 v krajine</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Uhlík (norm.)', data: [F] });
			}
			else if (F > '0.6' && F <= '0.8')
			{
				myRow=$('<tr>').append("<td>Uhlík (norm.)</td>").append("<td>"+json.features[5].properties.UHLIK_NORM+"</td>").append("<td>vysoký objem ukladaného CO2 v krajine</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Uhlík (norm.)', data: [F] });
				
			}
			else if (F > '0.8' && F <= '1.1')
			{
				myRow=$('<tr>').append("<td>Uhlík (norm.)</td>").append("<td>"+F+"</td>").append("<td>veľmi vysoký objem ukladaného CO2 v krajine</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Uhlík (norm.)', data: [F] });
			}
			else {};
			
			if (G > '0'){
				myRow=$('<tr>').append("<td>Kvalita územia pre cestovný ruch</td>").append("<td>"+json.features[6].properties.KVALITA_UZEMIA_CEST_RUCH+"</td>").append("<td>1..10</td>");
				myTbody.append(myRow);
				
			}
			else {
				GV = 'N/A';
			};
			
			if (H > '0' && H <= '0.2'){
				myRow=$('<tr>').append("<td>Kvalita územia pre cestovný ruch (norm.)</td>").append("<td>"+json.features[7].properties.KV_UZ_CR_NORM+"</td>").append("<td>velmi nizky potenciál územia na využitie z hľadiska cestovného ruchu</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Kvalita územia pre cestovný ruch (norm.)', data: [H] });
				
			}
			else if (H > '0.2' && H <= '0.4'){
				myRow=$('<tr>').append("<td>Kvalita územia pre cestovný ruch (norm.)</td>").append("<td>"+json.features[7].properties.KV_UZ_CR_NORM+"</td>").append("<td>nizky potenciál územia na využitie z hľadiska cestovného ruchu</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Kvalita územia pre cestovný ruch (norm.)', data: [H] });
			}
			else if (H > '0.4' && H <= '0.6'){
				myRow=$('<tr>').append("<td>Kvalita územia pre cestovný ruch (norm.)</td>").append("<td>"+json.features[7].properties.KV_UZ_CR_NORM+"</td>").append("<td>stredný potenciál územia na využitie z hľadiska cestovného ruchu</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Kvalita územia pre cestovný ruch (norm.)', data: [H] });
			}
			else if (H > '0.6' && H <= '0.8'){
				myRow=$('<tr>').append("<td>Kvalita územia pre cestovný ruch (norm.)</td>").append("<td>"+json.features[7].properties.KV_UZ_CR_NORM+"</td>").append("<td>vysoký potenciál územia na využitie z hľadiska cestovného ruchu</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Kvalita územia pre cestovný ruch (norm.)', data: [H] });
			}
			else if (H > '0.8' && H <= '1'){
				myRow=$('<tr>').append("<td>Kvalita územia pre cestovný ruch (norm.)</td>").append("<td>"+json.features[7].properties.KV_UZ_CR_NORM+"</td>").append("<td>veľmi vysoký potenciál územia na využitie z hľadiska cestovného ruchu</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Kvalita územia pre cestovný ruch (norm.)', data: [H] });
			}
			else {};
			
			if (I > '0'){
				myRow=$('<tr>').append("<td>Biodiverzita</td>").append("<td>"+json.features[8].properties.BIODIVERZITA+"</td>").append("<td>0..6000</td>");
				myTbody.append(myRow);
				
			}
			else {
				IV = 'N/A';
			};
			
			if (J > '0' && J <= '0.2'){
				myRow=$('<tr>').append("<td>Biodiverzira (norm.)</td>").append("<td>"+json.features[9].properties.BIOD_NORM+"</td>").append("<td>velmi nizka biodiverzita</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Biodiverzira (norm.)', data: [J] });
			}
			else if (J > '0.2' && J <= '0.4'){
				myRow=$('<tr>').append("<td>Biodiverzira (norm.)</td>").append("<td>"+json.features[9].properties.BIOD_NORM+"</td>").append("<td>nizka biodiverzita</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Biodiverzira (norm.)', data: [J] });
			}
			else if (J > '0.4' && J <= '0.6'){
				myRow=$('<tr>').append("<td>Biodiverzira (norm.)</td>").append("<td>"+json.features[9].properties.BIOD_NORM+"</td>").append("<td>stredná biodiverzita</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Biodiverzira (norm.)', data: [J] });
			}
			else if (J > '0.6' && J <= '0.8'){
				myRow=$('<tr>').append("<td>Biodiverzira (norm.)</td>").append("<td>"+json.features[9].properties.BIOD_NORM+"</td>").append("<td>vysoká biodiverzita</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Biodiverzira (norm.)', data: [J] });
			}
			else if (J > '0.8' && J <= '1'){
				myRow=$('<tr>').append("<td>Biodiverzira (norm.)</td>").append("<td>"+json.features[9].properties.BIOD_NORM+"</td>").append("<td>veľmi vysoká biodiverzita</td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Biodiverzira (norm.)', data: [J] });
			}
			else {};
			
			if (K > '0'){
				myRow=$('<tr>').append("<td>Celková hodnota ESS</td>").append("<td>"+json.features[10].properties.HODNOTA_ESS+"</td>").append("<td></td>");
				myTbody.append(myRow);
				chartData.push({ name: 'Celková hodnota ESS', data: [K] });
			}
			else {
				KV = 'N/A';
			};
			
			myDiv=$('<div><h4>Geografická poloha: ' + hdms + '</h4></div>');
			myTableDiv=$('<div>').addClass('table-responsive');
			myTable=$('<table>').addClass('table').addClass('table-striped');
			
			myThead=$('<thead>')
						.append('<tr>')
						.append('<th>Typ ESS</th>')
						.append('<th>Hodnota</th>')
						.append('<th>Jednotka</th>');
			myTableDiv.append(myTable)
			myTable.append(myThead);
			myTable.append(myTbody);
			myH4=$('<h4>Grafické znázornenie normalizovaných hodnôt ESS</h4>');
			myDiv2=$('<div id="graf" ></div>');
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
				chart: {
				type: 'column',
				renderTo: 'graf'
				},
				title: {
					text: ''
				},
				xAxis: {
					categories: [
						'Normované hodnoty ESS'
					],
				crosshair: true
				},
				yAxis: {
					min: 0,
					title: {
						text: 'Normalizovaná hodnota ESS'
					}
				},
				tooltip: {
					headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
					pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
						'<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
					footerFormat: '</table>',
					shared: true,
					useHTML: true
				},
				plotOptions: {
					column: {
						pointPadding: 0.2,
						borderWidth: 0
					}
				},
				series: chartData
			};
			
			
			  $('#graf').highcharts(chartOptions);
			});
		})
	};


    
 /* 
  if (url) {
    document.getElementById('info').innerHTML =
        '<h2>'+ hdms +'</h2><div class="container"><div class="modal fade" id="myModal" role="dialog"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">'+ hdms +'</h4></div><div class="modal-body"><p>This is a large modal.</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div></div>';
      //alert ('You clicked here:' + coord);
	}
	map.addOverlay(new ol.Overlay({
	  position: coord,
      element: $('<img id="mapicon" src="data/mapicon2.png" align="middle">').popover({'placement': 'top','html': true,'content':'<div width="250px"><strong>You clicked here: <h1>'+ hdms +'</h1></strong><iframe seamless src="' + url + '" width="240px"></iframe></div>'}).on('click', function (e) { $(".location-popover").not(this).popover('hide'); }),
	}));
	
	map.addOverlay(new ol.Overlay({
	  position: coord,
      element: $('<img id="mapicon" src="data/mapicon2.png" align="middle">').popover({'placement': 'top','html': true,'content':'<div class="container"><div class="modal fade" id="myModal" role="dialog"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Modal Header</h4></div><div class="modal-body"><p>This is a large modal.</p></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div></div></div></div>'}).on('click', function (e) { $(".location-popover").not(this).popover('hide'); }),
	}));
	*/
	
/*   var coord = evt.coordinate;
  var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coord, "EPSG:3857", "EPSG:4326"));
  $(document.getElementById('info').innerHTML =
        '<div id="infoPointCoord" style="float: left"><span>'+ hdms +'</span></div>'); */



//PARSING GET FEATURE INFO JSON TO EXTRACT VALUES FOR ESS


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