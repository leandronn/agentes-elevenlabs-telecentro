/* global google, BASE_URL */

function _google_maps(options, markers, marker_callback){
    
    var mapa = null;
    
    var settings = $.extend({
            contenedor: '',
            zoom: 12,
            center: {
                latitud: -32.9521898,
                longitud: -60.7666797
            },
            icons: {
                common: BASE_URL + 'assets/images/icons/markerclusterer/avalian_markers_green.png',
                active: BASE_URL + 'assets/images/icons/markerclusterer/icon-google-map-active.png',
                cluster: BASE_URL + 'assets/images/icons/markerclusterer/m'
            }
        }, options);
    
    /**
     * Funciones de inicializacion del mapa
     * 
     * @returns {undefined}
     */
    function _init(){
        var container = document.getElementById(settings.contenedor);
        var center_maps = new google.maps.LatLng(settings.center.latitud, settings.center.longitud);
        mapa = new google.maps.Map(container, { 
            zoom: settings.zoom, 
            center: center_maps,  
            mapTypeId: google.maps.MapTypeId.ROADMAP ,
            gestureHandling: 'cooperative',      // los posibles valores son cooperative, none, greedy, auto
            styles: [
                {
                  featureType: "poi", 
                  stylers: [
                    { visibility: "off" } 
                  ]
                }
              ]
        });
        if (typeof markers == "object"){
            markers = _agrupar_marcadores(markers);            
            var bound = new google.maps.LatLngBounds();
            var marker = [];
            
            $.each(markers, function(){
                var latitud = parseFloat(this[0].latitud);
                var longitud = parseFloat(this[0].longitud);
                if (typeof latitud != "undefined" && typeof longitud != "undefined"){
                    var title = _graph_title_marker(this);
                    var position = new google.maps.LatLng(latitud, longitud);
                    bound.extend(position);
            
                    var marcador = new google.maps.Marker({
                        position: position,
                        map: mapa,
                        title: title
                    });
                    marcador.setIcon(settings.icons.common);
                    _graph_info_marker(this, marcador, marker_callback);
                    marker.push(marcador);
                }
            });
            
            new MarkerClusterer(mapa, marker, {
                imagePath: settings.icons.cluster
            });
            
            
            mapa.fitBounds(bound);
            
        }
    }
    
    /**
     * obtiene el title de los marcadores, si sobre el mismo punto se encuentran varias marcas, el titulo se generaliza en la cantidad de las mismas
     * 
     * @param {object} marker_group         array conteniendo las marcars
     * @returns {String}
     */
    function _graph_title_marker(marker_group){
        if (marker_group.length > 1){
            return marker_group.length + " Prestadores";
        } else {
            if (marker_group[0].titulo != ''){
                return marker_group[0].titulo;
            }
            if (marker_group[0].subtitulo != ''){
                return marker_group[0].subtitulo;
            }
            if (marker_group[0].texto != ''){
                return marker_group[0].texto;
            }
            return "";
        }
    }
    
    /**
     * Grafica el contenido de los marcadores (cuadro de diálogo visualizado al hacer click)
     * 
     * @param {Object} marker_group             Array de Objetos marcadores (los marcadores tienen las propiedades titulo, latitud y longitud)
     * @param {Object} marcador                 El marcador que se va a graficar
     * @param {type} callback                   Funcion a llamar al abrir el cuadro de diálogo del marcador
     * @returns {undefined}
     */
    function _graph_info_marker(marker_group, marcador, callback){
        var _html = '<div class="maps-markers-group-list">';
        var param = {
            titulo: '',
            latitud: '',
            longitud: ''
        };
        $.each(marker_group, function(){
            if (this.titulo != ''){
                _html += '<h4>' + this.titulo + '</h4>';
                param = {
                    titulo: this.titulo,
                    latitud: this.latitud,
                    longitud: this.longitud
                };
            }
            if (this.subtitulo != ''){
                _html += '<p>' + this.subtitulo + '</p>';
                if (param.titulo == ''){
                    param = {
                        titulo: this.subtitulo,
                        latitud: this.latitud,
                        longitud: this.longitud
                    };
                }
            }
            if (this.texto != ''){
                _html += '<p>' + this.texto + '</p>';
                if (param.titulo == ''){
                    param = {
                        titulo: this.texto,
                        latitud: this.latitud,
                        longitud: this.longitud
                    };
                }
            }
            if (this.titulo != '' || this.subtitulo != '' || this.texto != ''){
                _html += '<hr>';
            }
        });
        _html += '</div>';
        var infowindow = new google.maps.InfoWindow({
            content: _html
        });
        marcador.addListener('click', function() {
            infowindow.open(mapa, marcador);
            if (typeof callback == "function"){
                callback(param);
            }
        });
    }
    
    /**
     * Agrupa marcadores por ubicación geográfica (latitud / longitud)
     * 
     * @param {Object} marcadores           Array de marcadores que se van a agrupar
     * @returns {Object}                    Array de marcadores
     */
    function _agrupar_marcadores(marcadores){
        var resp = {};
        $.each(marcadores, function(){
            if (typeof this.latitud != "undefined" && typeof this.longitud != "undefined"){
                var code = "c" + this.latitud + "" + this.longitud;
                code = code.split("-").join("x");
                code = code.split(".").join("_");
                if (typeof resp[code] == "undefined"){
                    resp[code] = new Array();
                }
                resp[code].push({
                    latitud: this.latitud,
                    longitud: this.longitud,
                    titulo: typeof this.titulo == "undefined" ? "" : this.titulo,
                    subtitulo: typeof this.subtitulo == "undefined" ? "" : this.subtitulo,
                    texto: typeof this.texto == "undefined" ? "" : this.texto
                });
            }
        });
        return resp;
    }
    
    /**
     * Setea el centro del mapa
     * 
     * @param {float} latitud               Latitud del centro del mapa
     * @param {float} longitud              Longitud del centro del mapa
     * @returns {undefined}
     */
    this.set_center = function(latitud, longitud){
        latitud = parseFloat(latitud);
        longitud = parseFloat(longitud);
        mapa.setCenter({lat: latitud, lng: longitud});
    };
    
    /**
     * Setea el zoom del mapa
     * 
     * @param {integer} zoom            valor del zoom del mapa
     * @returns {undefined}
     */
    this.set_zoom = function(zoom){
        mapa.setZoom(zoom);
    };
    
    /**
     * Grafica la ruta entre origen y destinoi
     * 
     * @param {object} origen               origen de la ruta con las propiedades latitud y longitud
     * @param {object} destino              destinio de la ruta con las propiedades latitud y longitud
     * @param {string} modo                 Modo de conduccion (WALKING, BICYCLING, DRIVING default)
     * @returns {undefined}
     */
   // Array para almacenar las rutas anteriores
 
var previousRoutes = [];
var selectedRoute = null; // Ruta actualmente seleccionada
var routeCounter = 66; // Código ASCII para la letra 'B'

this.route = function(origen, destino, modo) {
    // Determina el modo de viaje
    if (modo === 'WALKING') {
        modo = google.maps.TravelMode.WALKING;
    } else if (modo === 'BICYCLING') {
        modo = google.maps.TravelMode.BICYCLING;
    } else {
        modo = google.maps.TravelMode.DRIVING;
    }

    var start = new google.maps.LatLng(parseFloat(origen.latitud), parseFloat(origen.longitud));
    var end = new google.maps.LatLng(parseFloat(destino.latitud), parseFloat(destino.longitud));
    var request = {
        origin: start,
        destination: end,
        travelMode: modo
    };

    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            
            var routePolyline = new google.maps.Polyline({
                path: response.routes[0].overview_path,
                strokeColor: "#0000FF", 
                strokeOpacity: 1.0,
                strokeWeight: 4,
                map: mapa
            });

            previousRoutes.forEach(function(route) {
                route.setOptions({
                    strokeColor: "#808080", 
                    strokeOpacity: 0.5,
                    strokeWeight: 4
                });
            });

            new google.maps.Marker({
                position: start,
                map: mapa,
                label: 'A'
            });

            var label = String.fromCharCode(routeCounter); 
            new google.maps.Marker({
                position: end,
                map: mapa,
                label: label
            });
            routeCounter++;            
            google.maps.event.addListener(routePolyline, 'click', function() {
                selectRoute(routePolyline);
            });

            // Ajustar el mapa para mostrar toda la ruta
            var bounds = new google.maps.LatLngBounds();
            response.routes[0].overview_path.forEach(function(location) {
                bounds.extend(location);
            });
            mapa.fitBounds(bounds);

            previousRoutes.push(routePolyline);
            selectRoute(routePolyline);

        } else {
            console.log("Directions Request failed: " + status);
        }
    });
};

function setMapZoom(level) {
    if (mapa) {
        mapa.setZoom(level);
    } else {
        console.log("El mapa no está inicializado.");
    }
}

function selectRoute(route) {
    if (selectedRoute) {
        
        selectedRoute.setOptions({
            strokeColor: "#808080", // Gris para la ruta deseleccionada
            strokeOpacity: 1.0,
            strokeWeight: 4
        });
    }

    
    route.setOptions({
        strokeColor: "#0000FF", // Azul para la ruta seleccionada
        strokeOpacity: 1.0,
        strokeWeight: 4
    });

    selectedRoute = route; 
}

   


    _init();
}

var google_maps = null;