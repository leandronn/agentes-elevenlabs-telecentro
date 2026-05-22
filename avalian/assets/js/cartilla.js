/* global BASE_URL, busqueda_centros, busqueda_cartilla */

function _cartilla(options){

    
     var settings = $.extend({
            selector: {
                credencial: "",
                clase: "",
                especialidad: "",
                provincia: "",
                localidad: "",
                tipo_busqueda: "",
                cercania: "",
                cercania_latitud: "",
                cercania_longitud: "",
                profesional: "",
                planes: "",
                plan: false
            },
            containers: {
                resultados_crecanias: "",
                busqueda_localidad: '',
                busqueda_cercania: '',
                cartilla: '',
                mas_resultados: ''
            },
            vars:{
                resultados_pagina: 9,
                paginaActual: 1
            },
            filter:{
                clase: '',
                especialidad: ''
            },
            content: {
                especialidades: [],
                prestadores: []
            },
            xhr: {
                cartilla: BASE_URL + 'xhr/cartilla.php'
            }
        }, options);
    
    var _self = this;

    
    
    function _graph_sin_resultados(element){
        $(element).find("option").remove();
        $(element).append('<option value="">Sin Resultados</option>');
    }
    
    function _graph_recuperando(element){
        $(element).find("option").remove();
        $(element).append('<option value="" selected="" disabled="">(recuperando...)</option>');
    }
    
    function _graph_cartilla_prestadores(prestadores) {
        
        $(settings.containers.buscando).hide();
        $(settings.containers.items_resultados_cartillas).find(".pagination-container").remove();
        $(settings.containers.items_resultados_cartillas).find(".resultado-cartilla").remove();
        $(settings.containers.items_resultados_cartillas).find(".container-ver-mas").remove();
        
         if($(settings.selector.cercania).val() != ''){
            $(settings.selector.direccion_llegar).val($(settings.selector.cercania).val())
            
            $("#cartilla_llegar_latitud").val($(cartilla_cercania_latitud).val())
            $("#cartilla_llegar_longitud").val($(cartilla_cercania_longitud).val())
            console.log($("#cartilla_llegar_longitud").val());
            console.log($("#cartilla_llegar_latitud").val());
        }else{
            $(settings.selector.direccion_llegar).val()
        } 
        if (prestadores.length > 0) {
            var marcadores = [];
            var itemsPorPagina = 6;
            var totalPaginas = Math.ceil(prestadores.length / itemsPorPagina);
            var paginasVisibles = 4;
           
            
            $.each(prestadores, function(index) {
                var pagina = Math.floor(index / itemsPorPagina) + 1;
                var email = this.mail || this.web || '';
                var visible = pagina === 1 ? '' : ' style="display: none;"';
                var _html = `
                <div class="col-12 mb-3 resultado-cartilla" data-page="${pagina}"${visible}>
                    ${this.nombre ? `<p>${this.nombre}</p>` : ''}
                    <div class="grid">
                        <div class="col1">
                            ${this.domicilio ? `<h5>${this.domicilio}</h5>` : ''}
                             ${this.localidad ? `<h5>${this.localidad}</h5>` : ''}
                            ${this.telefono ? `<h5>Tel: ${this.telefono}</h5>` : ''}
                            ${this.email ? `<h5>${this.email}</h5>` : ''}
                        </div>
                        <div class="col2">
                            <a href="#" class="btn btn-outline btn-mapa-center" data-titulo="${this.nombre}" data-latitud="${this.latitud}" data-longitud="${this.longitud}">ver en mapa</a>
                        </div>
                    </div>
                </div>`;
                marcadores.push({
                    latitud: this.latitud,
                    longitud: this.longitud,
                    titulo: this.nombre,
                    subtitulo: this.domicilio,
                    texto: this.telefono
                });
    
                $(settings.containers.items_resultados_cartillas).append(_html);
            });
    
            if (totalPaginas > 1) {
                
                
                var paginationHtml = '<div id="pagination" class="pagination-container text-center"><nav aria-label="Page navigation"><ul class="pagination align-items-center justify-content-center">';
                
                paginationHtml += `<li class="page-item disabled hide">
                    <a class="prev-page" href="#" aria-label="Previous">
                        <span aria-hidden="true">&lt; Anterior</span>
                    </a>
                </li>`;
    
                for (var i = 1; i <= totalPaginas; i++) {
                    paginationHtml += `<li class="page-item ${i === 1 ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>`;
                }
    
                paginationHtml += `<li class="page-item ${totalPaginas > 1 ? '' : 'disabled'}" >
                    <a class=" next-page" href="#" aria-label="Next">
                        <span aria-hidden="true">Siguiente &gt;</span>
                    </a>
                </li>`;
    
                paginationHtml += '</ul></nav></div>';
                $(settings.containers.items_resultados_cartillas).append(paginationHtml);
    
                
                mostrarPagina(settings.vars.paginaActual, totalPaginas, paginasVisibles);
                
                $('.pagination').on('click', 'a.prev-page', function(e) {
                    e.preventDefault();
                    
                    $(this).closest("ul").find(".next-page").parent().removeClass("hide")
                    if (settings.vars.paginaActual > 1) {
                        settings.vars.paginaActual--;
                        mostrarPagina(settings.vars.paginaActual, totalPaginas, paginasVisibles);
                    }
                });

                
                $('.pagination').on('click', 'a.next-page', function(e) {
                    e.preventDefault();
                    $(this).closest("ul").find(".prev-page").parent().removeClass("hide")
                    if (settings.vars.paginaActual < totalPaginas) {
                        settings.vars.paginaActual++;
                        mostrarPagina(settings.vars.paginaActual, totalPaginas, paginasVisibles);
                    }

                });
               
                $('.pagination').on('click', 'a.page-link', function(e) {
                    e.preventDefault();
                    var selectedPage = $(this).data('page');
                    $(this).closest("ul").find(".prev-page").parent().removeClass("hide")
                    $(this).closest("ul").find(".next-page").parent().removeClass("hide")
                  
                    if(selectedPage === 1){
                        $(this).parent().prev().addClass("hide")
                        
                    }
                    if(selectedPage === (totalPaginas)){
                        $(this).parent().next().addClass("hide")
                    }
                    if (selectedPage !== settings.vars.paginaActual) {
                        settings.vars.paginaActual = selectedPage;
                        mostrarPagina(settings.vars.paginaActual, totalPaginas, paginasVisibles);
                    }
                });

                
            }
    
            $(settings.containers.resultados_prestadores).show();
    
            google_maps = new _google_maps({
                contenedor: $(settings.containers.mapa).attr("id")
            }, marcadores, _self.definir_mapa_seleccion);
        } else {
            $(settings.containers.empty_results).show();
        }
    }
    

        function mostrarPagina(paginaActual, totalPaginas, paginasVisibles) {
            if (paginaActual != null) {
              
                $('.pagination li').removeClass('active');
                $(`.pagination a[data-page="${paginaActual}"]`).parent().addClass('active');
        
                $('.resultado-cartilla').hide();
                $(`.resultado-cartilla[data-page="${paginaActual}"]`).show();
        
                var startPage = Math.max(1, paginaActual - Math.floor(paginasVisibles / 2));
                var endPage = Math.min(totalPaginas, startPage + paginasVisibles - 1);
        
                if (startPage > 1) startPage++; 
                if (endPage < totalPaginas) endPage--; 
        
                $('.pagination a.page-link').parent().addClass('d-none');
        
                $(`.pagination a[data-page="1"]`).parent().removeClass('d-none');
        
                for (var i = startPage; i <= endPage; i++) {
                    $(`.pagination a[data-page="${i}"]`).parent().removeClass('d-none');
                }
        
                $(`.pagination a[data-page="${totalPaginas}"]`).parent().removeClass('d-none');
        
                $('.pagination .page-ellipsis').remove();
        
                if (startPage > 2) {
                    $(`.pagination a[data-page="1"]`).parent().after('<li class="page-item disabled page-ellipsis"><span class="page-link">...</span></li>');
                }
        
                if (endPage < totalPaginas - 1) {
                    $(`.pagination a[data-page="${endPage}"]`).parent().after('<li class="page-item disabled page-ellipsis"><span class="page-link">...</span></li>');
                }
        
                $('.prev-page').parent().toggleClass('disabled', paginaActual === 1);
                $('.next-page').parent().toggleClass('disabled', paginaActual === totalPaginas);
        
                $('.prev-page').parent().removeClass('d-none');
                $('.next-page').parent().removeClass('d-none');

                var targetElement = document.getElementById('container_results');
                            
                if (targetElement && targetElement.children.length > 0) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        }
        
        
    
    
    
    function _graph_centros(centros){
        $(settings.containers.buscando_centros).hide();
        $(settings.containers.items_resultados_centros).find(".resultado-centros").remove();
        $(settings.containers.items_resultados_filiales).find(".resultado-centros").remove();
        $(settings.containers.items_resultados_centros).hide();
        $(settings.containers.items_resultados_filiales).hide();
        if (centros.length > 0){
            var tiene_centros = false;
            var tiene_filiales = false;
            var marcadores = new Array();
            $.each(centros, function(){
                var _html = '<div class="col-12 col-md-4 col-lg-3 resultado-centros">';
                _html += '<h5 class="avalian-strong">' + this.agencia + '</h5>';
                _html += '<p>' + this.domicilio + '</p>';
                if (this.telefono) {
                    _html += '<p>Tel: ' + this.telefono + '</p>';
                }
                _html += '<p>' + this.email + '</p>';
                if (!this.telefono) {
                    _html += '<p>&nbsp</p>';
                }
                _html += '<a href="#" class="btn btn-outline btn-mapa-center" data-titulo="' + this.agencia + '" data-latitud="' + this.latitud + '" data-longitud="' + this.longitud + '">ver en mapa</a>';
                _html += '</div>';
                marcadores.push({
                    latitud: this.latitud,
                    longitud: this.longitud,
                    titulo: this.agencia,
                    subtitulo: this.domicilio,
                    texto: this.telefono ?? ''
                });
                if (this.tipo == 'AGE'){
                    $(settings.containers.items_resultados_centros).append(_html);
                    tiene_centros = true;
                } else {
                    $(settings.containers.items_resultados_filiales).append(_html);
                    tiene_filiales = true;
                }
            });
            if (tiene_centros || tiene_filiales){
                $(settings.containers.resultados_centros).show();
            }
            if (tiene_filiales){
                $(settings.containers.items_resultados_filiales).show();
            }
            if (tiene_centros){
                $(settings.containers.items_resultados_centros).show();
            }
            google_maps = new _google_maps({
                contenedor: $(settings.containers.mapa).attr("id")
            }, marcadores, _self.definir_mapa_seleccion);
        } else {
            $(settings.containers.empty_results_centros).show();
        }
    }
    
    function _init(){
        _graph_recuperando($(settings.selector.credencial));
        _graph_recuperando($(settings.selector.centros_provincias));
        _graph_recuperando($(settings.selector.provincia));
        _graph_recuperando($(settings.selector.clase));
        
        
        if (typeof busqueda_centros == 'object'){
            _self.buscar_centros();
        } else if (typeof busqueda_cartilla == 'object'){
            _self.buscar_cartilla();
        }
        var filter = '';
        if ($(settings.selector.provincia).data("filter")){
            filter = $(settings.selector.provincia).data("filter");
        } else if ($(settings.selector.centros_provincias).data("filter")){
            filter = $(settings.selector.centros_provincias).data("filter");
        }

        $.ajax({
            url: settings.xhr.cartilla,
            type: 'POST',
            dataType: 'json',
            data: {
                accion: 'credenciales_provincias_calses',
                filter: filter,
                filter_planes: settings.selector.plan
            },
            beforeSend: function() {
                //$('html, body').animate({ scrollTop: $('#blk_cartilla').offset().top - 200 + $('#blk_cartilla').outerHeight() }, 'slow');
                $('#loadingIndicator').css("display", "block");
                
                //$('#loadingIndicator').show();
            },
            success: function(_json){
                $('#loadingIndicator').css("display", "none");
                $('#form-search').css("display","flex")
                //$('html, body').animate({ scrollTop: $('#form-search').offset().top }, 'slow');
                //$('html, body').stop(true).animate({ scrollTop: $('#form-search').offset().top}, 'slow');
              // $('html, body').stop(true).animate({ scrollTop: $('#form-search').offset().top + $('#form-search').outerHeight() - $(window).height()}, 'slow');
              //var targetOffset = $('#form-search').offset().top; 
             var targetElement = document.getElementById('form-search');
                    
                 if (targetElement && targetElement.children.length > 0) {
                    targetElement.scrollIntoView({
                        behavior: 'auto',
                        block: "start", 
                        inline: "start" 
                    });
                } 

             
                if (_json.success && _json.msg){
                    if (_json.msg.credenciales){
                        $(settings.selector.credencial).find("option").remove();
                        $(settings.selector.credencial).append('<option value="">Seleccioná</option>');
                        $.each(_json.msg.credenciales, function(){
                            $(settings.selector.credencial).append('<option value="' + this.id + '">' + this.descripcion + '</option>');
                        });
                        if (typeof busqueda_cartilla == 'object'){
                            $(settings.selector.credencial).val(busqueda_cartilla.credencial);
                        }
                    } else {
                        _graph_sin_resultados(settings.selector.credencial);
                    }
                    if (_json.msg.provincias){
                        
                        $(settings.selector.provincia).find("option").remove();
                        $(settings.selector.centros_provincias).find("option").remove();
                        $(settings.selector.provincia).append('<option value="">Seleccioná una Región o Provincia</option>');
                        $(settings.selector.centros_provincias).append('<option value="">Seleccioná una Región o Provincia</option>');
                        $.each(_json.msg.provincias, function(){
                            var _html = '<option value="' + this.codigo + '" data-tipo="' + this.tipo + '">' + this.nombre + '</option>';
                            $(settings.selector.provincia).append(_html);
                            $(settings.selector.centros_provincias).append(_html);
                        });
                        if (typeof busqueda_centros == 'object'){
                            $(settings.selector.centros_provincias).val(busqueda_centros.provincia);
                            _self.centros_localidades();
                        } else if (typeof busqueda_cartilla == 'object'){
                            $(settings.selector.provincia).val(busqueda_cartilla.provincia);
                            _self.localidades();
                        }
                       
                    } else {
                        _graph_sin_resultados(settings.selector.provincia);
                        _graph_sin_resultados(settings.selector.centros_provincias);
                    }
                    if (_json.msg.clases){
                       
                        $(settings.selector.clase).find("option").remove();
                       
                        $(settings.selector.clase).append('<option value="">Tipo de prestador</option>');
                        $.each(_json.msg.clases, function(){
                            let selected = settings.filter.clase != null && settings.filter.clase === this.id? 'selected="selected"' : ''; 
                            $(settings.selector.clase).append('<option value="' + this.id + '" '+selected +'>' + this.descripcion + '</option>');
                        });
                        //console.log(settings.filter.clase)
                        if(settings.filter.clase != null && settings.filter.especialidad != null){
                            $(settings.selector.clase).val(settings.filter.clase);
                            if ( settings.filter.especialidad != ''){
                                $(settings.selector.especialidad).val(settings.filter.especialidad);
                            } 
                        }
                       
                        //if (typeof busqueda_cartilla == 'object'){
                            $(settings.selector.clase).val(settings.filter.clase);
                            _self.especialidades();
                        //}
                    } else {
                        _graph_sin_resultados(settings.selector.clase);
                    }
                } else {
                    _graph_sin_resultados(settings.selector.credencial);
                    _graph_sin_resultados(settings.selector.provincia);
                    _graph_sin_resultados(settings.selector.centros_provincias);
                    _graph_sin_resultados(settings.selector.clase);
                }
            },
            error: function(){
                _graph_sin_resultados(settings.selector.credencial);
                _graph_sin_resultados(settings.selector.provincia);
                _graph_sin_resultados(settings.selector.centros_provincias);
                _graph_sin_resultados(settings.selector.clase);
            }
        });
    }
    
    function _graph_cercanias_llegar(cercanias){
        
        $(settings.containers.resultados_cercanias_llegar).html("");
        $.each(cercanias, function(){
            var p = $("<p>").addClass("item-cercania")
                    .data("latitud", this.location.latitud)
                    .data("longitud", this.location.longitud)
                    .html(this.name)
                    .on("click", function(){
                        _self.cercania_llegar(this);
                    });
            $(settings.containers.resultados_cercanias_llegar).append(p);
        });
    }
    
    function _graph_cercanias(cercanias){
        $(settings.containers.resultados_crecanias).html("");
        $.each(cercanias, function(){
            var p = $("<p>").addClass("item-cercania")
                    .data("latitud", this.location.latitud)
                    .data("longitud", this.location.longitud)
                    .html(this.name)
                    .on("click", function(){
                        _self.cercania(this);
                    });
            $(settings.containers.resultados_crecanias).append(p);
        });        
    }
        
    this.ver_mas_resultados = function(){
        var current = $(".resultado-cartilla[data-page]:visible").last().data("page");
        current ++;
        $(".resultado-cartilla[data-page=" + current + "]").slideDown();
        if ($(".resultado-cartilla[data-page=" + (current + 1) + "]").length == 0){
            $(".container-ver-mas").remove();
        }
    };
        
    this.definir_mapa_seleccion = function(param){
        $(settings.selector.prestador_llegar).val(param.titulo).data({latitud: param.latitud, longitud: param.longitud});
        $(settings.selector.prestador_llegar).focus();
    };

    this.cercania_llegar = function(element){
        
        var latitud = $(element).data("latitud");
        var longitud = $(element).data("longitud");
        var content = $(element).html();
        $(settings.selector.direccion_llegar).val(content);
        $(settings.selector.cartilla_llegar_latitud).val(latitud);
        $(settings.selector.cartilla_llegar_longitud).val(longitud);
        $(settings.containers.resultados_cercanias_llegar).html("");
    };
    
    this.cercania = function(element){
    
        var latitud = $(element).data("latitud");
        var longitud = $(element).data("longitud");
        var content = $(element).html();
        $(settings.selector.cercania).val(content);
        $(settings.selector.cercania_latitud).val(latitud);
        $(settings.selector.cercania_longitud).val(longitud);
        $(settings.containers.resultados_crecanias).html("");
    };
    
    this.direccion_llegar = function(){
        var direccion = $.trim($(settings.selector.direccion_llegar).val());
        if (direccion != '' && direccion.length >= 3){
            $.ajax({
                url: settings.xhr.cartilla,
                type: 'POST',
                dataType: 'json',
                data: {
                    accion: 'cercanias',
                    direccion: direccion
                },
                success: function(_json){
                    if (_json.success){
                        _graph_cercanias_llegar(_json.msg.cercanias);
                    }
                },
                error: function(){
                    
                }
            });
        } else {
            $(settings.containers.resultados_crecanias).html("");
        }
    };
    
    this.direccion = function(){
        
        var direccion = $.trim($(settings.selector.cercania).val());
        if (direccion != '' && direccion.length >= 3){
            $.ajax({
                url: settings.xhr.cartilla,
                type: 'POST',
                dataType: 'json',
                data: {
                    accion: 'cercanias',
                    direccion: direccion
                },
                success: function(_json){
                    if (_json.success){
                        _graph_cercanias(_json.msg.cercanias);
                    }
                },
                error: function(){
                    
                }
            });
        } else {
            $(settings.containers.resultados_crecanias).html("");
        }
    };
    
    this.centros_localidades = function(){
        var element = $(settings.selector.centros_localidad);
        var provincia = $(settings.selector.centros_provincias).val();
        var filter = '';
        if (element.data("filter")){
            filter = element.data("filter");
        }
        if (provincia != ''){
            _graph_recuperando(element);
            $.ajax({
                url: settings.xhr.cartilla,
                type: 'POST',
                dataType: 'json',
                data: {
                    accion: 'localidades',
                    provincia: provincia,
                    filter: filter
                },
                success: function(_json){
                    $(element).find("option").remove();
                    if (_json.success && _json.msg && _json.msg.localidades){
                        $(element).append('<option value="0">Seleccioná una localidad</option>');
                        $.each(_json.msg.localidades, function(){
                            $(element).append('<option value="' + this.id + '">' + this.nombre + '</option>');
                        });
                        if (typeof busqueda_centros == 'object'){
                            $(element).val(busqueda_centros.localidad);
                        }
                    } else {
                        _graph_sin_resultados(element);
                    }
                },
                error: function(){
                    _graph_sin_resultados(element);
                }
            });
        }
    };
    
    this.localidades = function(){        
        var element = $(settings.selector.localidad);
        var provincia = $(settings.selector.provincia).val();
        
        if($(settings.selector.provincia).find('option:selected').data('tipo') == "P"){
            $(settings.selector.localidad).show()
            $(settings.selector.localidad).parent().show()
           
        
            var filter = "";
            if (element.data("filter")){
                filter = element.data("filter");
            }
            if (provincia != ''){
            _graph_recuperando(element);
            $.ajax({
                url: settings.xhr.cartilla,
                type: 'POST',
                dataType: 'json',
                data: {
                    accion: 'localidades',
                    provincia: provincia,
                    filter: filter
                },
                success: function(_json){
                   
                    $(element).find("option").remove();
                    if (_json.success && _json.msg && _json.msg.localidades && _json.msg.localidades.length > 0){
                        $(element).append('<option value="0">Seleccioná una localidad</option>');
                        $.each(_json.msg.localidades, function(){
                            $(element).append('<option value="' + this.id + '">' + this.nombre + '</option>');
                        });
                        if (typeof busqueda_cartilla == 'object'){
                            $(element).val(busqueda_cartilla.localidad);
                        }
                    } else {
                        _graph_sin_resultados(element);
                    }
                },
                error: function(){
                    _graph_sin_resultados(element);
                }
            });
         }
        }else{
            $(settings.selector.localidad).val("")
            $(settings.selector.localidad).hide()
            $(settings.selector.localidad).parent().hide()
        } 
    };
    
    this.especialidades = function(){
        var clase = $(settings.selector.clase).val();
    
        if (clase != ''){
            var element = settings.selector.especialidad;
            $(element).find('option').prop('selected', false);
            _graph_recuperando(element);
            $.ajax({
                url: settings.xhr.cartilla,
                type: 'POST',
                dataType: 'json',
                data: {
                    accion: 'especialidades',
                    clase: clase
                },
                success: function(_json){
                  
                    if (_json.success && _json.msg && _json.msg.especialidades){   
                        
                          $(element).html('<option value="">Seleccioná especialidad</option>');
                        $.each(_json.msg.especialidades, function(){
                            
                            let selected = settings.filter.especialidad != null && this.id === settings.filter.especialidad? 'selected' : ''
                            
                            $(element).append('<option value="' + this.especialidad + '" '+selected+' >' + this.especialidad + '</option>');
                        }); 
                        /* if (typeof busqueda_cartilla == 'object'){
                            $(element).val(busqueda_cartilla.especialidad);
                        }  */
                    } else {
                        _graph_sin_resultados(element);
                    }
                },
                error: function(){
                    _graph_sin_resultados(element);
                }
            });
        }
    };

    this.planes = function(){        
        var element = $(settings.selector.planes);
        var credencial = $(settings.selector.credencial).val();
        var filter = "";
        if (element.data("filter")){
            filter = element.data("filter");
        }
        
        /* if(credencial != 'CLASICA'){
            $(element).html(" ");
            $(element).closest(".planes").css("display", "none");
        }
        else { */
            $(element).closest(".planes").css("display", "block");
            _graph_recuperando(element);
            $.ajax({
                url: settings.xhr.cartilla,
                type: 'POST',
                dataType: 'json',
                data: {
                    accion: 'planes',
                    credencial: credencial,
                    filter: filter
                },
                success: function(_json){
                    
                    $(element).find("option").remove();
                    if (_json.success && _json.msg && _json.msg.planes){
                        $(element).append('<option value="">Planes</option>');
                        $.each(_json.msg.planes, function(){
                            if(credencial == 'CLASICA' && this.credencial == 'CLASICA'){
                                $(element).append('<option value="' + this.codigo + '">' + this.descripcion + '</option>');
                            }
                        });
                        if (typeof busqueda_cartilla == 'object'){
                            $(element).val(busqueda_cartilla.planes);
                        }
                    } else {
                        _graph_sin_resultados(element);
                    }
                },
                error: function(){
                    _graph_sin_resultados(element);
                }
            });
        
    };

    
   
    this.buscar_cartilla = function(){
        var especialidad = '';
        var credencial = '';
        var tipo_prestador = '';
        var localidad = '';
        var provincia = '';
        //var plan = '';
        var localidad_nombre = '';
        if (typeof busqueda_cartilla == 'object' && busqueda_cartilla.init == true){
            especialidad = busqueda_cartilla.especialidad;
            credencial = busqueda_cartilla.credencial;
            tipo_prestador = busqueda_cartilla.clase;
            localidad = busqueda_cartilla.localidad;
            provincia = busqueda_cartilla.provincia;
            //plan = busqueda_cartilla.plan;
            localidad_nombre = busqueda_cartilla.localidad_nombre;
            busqueda_cartilla.init = false;
        } else {
            especialidad = $(settings.selector.especialidad).val();
            credencial = $(settings.selector.credencial).val();
            tipo_prestador = $(settings.selector.clase).val();
            
            localidad = $(settings.selector.localidad).val();
            provincia = $(settings.selector.provincia).val();
            //plan = $(settings.selector.plan).val();
            localidad_nombre = $.trim($(settings.selector.localidad).find("option:selected").html());
        }
        var tipo_busqueda = $(settings.selector.tipo_busqueda + ":checked").val();
        var latitud = $(settings.selector.cercania_latitud).val();
        var longitud = $(settings.selector.cercania_longitud).val();
        var error = new Array();
        
        if (credencial == ''){
            error.push("Indique su <b>Credencial</b>");
        }
        if (tipo_prestador == ''){
            error.push("Seleccione el <b>Tipo de Prestador</b>");
        }
        if (especialidad === '' && $(settings.selector.especialidad).closest(".filtros").css('display') === 'block') {
            error.push("Debe seleccionar una <b>Especialidad</b>");
        }
      
        if (tipo_busqueda == 'localidad'){

            // console.log("Localidad", $(settings.selector.localidad).val())
            // console.log("Localidad nombre", localidad_nombre);
           
            if (provincia == ''){
                error.push("Seleccione la <b>Provincia</b>");
            }
            
            if (($(settings.selector.localidad).val() == null || $(settings.selector.localidad).val() == 0) && $(settings.selector.provincia).find('option:selected').data('tipo') == "P"){
                error.push("La <b>Localidad</b> es obligatorio");
            }
        } else {
            if (latitud == '' || longitud == ''){
                error.push("Ingrese su <b>Dirección</b>");
            }
        }
        if (error.length > 0){
            gritter(error.join("<br>"));
        } else {
            if ($(settings.selector.button_buscar_cartilla).data("action") == "submit"){
                var form = $(settings.selector.button_buscar_cartilla).closest("form");
                $(form).find(settings.selector.localidad_nombre).val(localidad_nombre);
                $(form).submit();
            } else {
                $(settings.containers.resultados_prestadores).hide();
                $(settings.containers.empty_results).hide();
                $(settings.containers.buscando).hide();
                let clase = $(settings.selector.clase).find('option:selected').text();
                var profesional = $(settings.selector.profesional).val();
                let ciudad = $(settings.selector.localidad).find('option:selected').text()
                let tipo = $(settings.selector.provincia).find('option:selected').data('tipo') 
                /*console.log( tipo == "P"? ' en ' + ucwords(ciudad) : '')*/
                $(settings.containers.titulo_busqueda).html(
                    (especialidad)? ucwords(especialidad) : ucwords(clase) + 
                    ( tipo == "P"? ' en ' + ucwords(ciudad) : '') 
                );
                let button = this;
                $(button).html("Buscando...")
                if ($(settings.containers.buscando).length) {
                   
                   var targetElement = document.getElementById(settings.containers.buscando);
                  
                   if (targetElement && targetElement.children.length > 0) {
                       targetElement.scrollIntoView({
                           behavior: 'smooth',
                           block: 'start'
                       });
                   }
                   
                }

                ciudad = $(settings.selector.localidad).find('option:selected').val() != ''? $(settings.selector.localidad).find('option:selected').text() : '';
               
                $.ajax({
                    url: settings.xhr.cartilla,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        accion: 'cartilla',
                        credencial: credencial,
                        clase: tipo_prestador,
                        especialidad: especialidad,
                        tipo_busqueda: tipo_busqueda,
                        cercania_latitud: latitud,
                        cercania_longitud: longitud,
                        provincia: provincia,
                        localidad: ciudad,
                        profesional: profesional,
                        //plan: plan
                    },
                    success: function(_json){
                        
                        $(button).html("Buscar")
                        if (_json.success){
                            settings.containers.prestadores = _json.msg.cartilla;
                            _graph_cartilla_prestadores(_json.msg.cartilla);
                            
                            var targetElement = document.getElementById('container_results');
                            

                            if (targetElement && targetElement.children.length > 0) {
                                targetElement.scrollIntoView({
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }
                            
                          
                        } else if (_json.msg){
                            
                            gritter(_json.msg);
                            $(settings.containers.buscando).hide();
                        } else {
                            gritter("En estos momentos no es posible realizar la accion solicitada<br>Vuelva a intentar más tarde");
                            $(settings.containers.buscando).hide();
                        }
                    },
                    error: function(){
                        $(this).html("Buscar")
                        gritter("En estos momentos no es posible realizar la accion solicitada<br>Vuelva a intentar más tarde");
                        $(settings.containers.buscando).hide();
                    }
                });
            }
        }
    };
   
    this.buscar_centros = function(){
        var localidad = '';
        if (typeof busqueda_centros == 'object' && busqueda_centros.init == true){
            localidad = busqueda_centros.localidad;
            busqueda_centros.init = false;
        } else {
            localidad = $(settings.selector.centros_localidad).val();
        }
        if (localidad == ''){
            gritter("Debe seleccionar una localidad");
        } else {
            if ($(settings.selector.button_buscar_centros).data("action") == "submit"){
               $(settings.selector.button_buscar_centros).closest("form").submit();
            } else {
                $(settings.containers.resultados_centros).hide();
                $(settings.containers.empty_results_centros).hide();
                $(settings.containers.buscando_centros).show();
                scroll_to_element($(settings.containers.buscando_centros), -200);
                $.ajax({
                    url: settings.xhr.cartilla,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        accion: 'centros_atencion',
                        localidad: localidad
                    },
                    success: function(_json){
                        if (_json.success){
                            _graph_centros(_json.msg.centros);
                        } else if (_json.msg){
                            gritter(_json.msg);
                            $(settings.containers.buscando_centros).hide();
                        } else {
                            gritter("En estos momentos no es posible realizar la accion solicitada<br>Vuelva a intentar más tarde");
                            $(settings.containers.buscando_centros).hide();
                        }
                    },
                    error: function(){
                        gritter("En estos momentos no es posible realizar la accion solicitada<br>Vuelva a intentar más tarde");
                        $(settings.containers.buscando_centros).hide();
                    }
                });
            }
        }
    };

    this.compartir = function(){
        var latitud_origen = $(settings.selector.cartilla_llegar_latitud).val();
        var longitud_origen = $(settings.selector.cartilla_llegar_longitud).val();
        var metodo = $(settings.selector.transporte_llegar).val();
        var latitud_destino = $(settings.selector.prestador_llegar).data("latitud");
        var longitud_destino = $(settings.selector.prestador_llegar).data("longitud");
        var origen = latitud_origen + "," + longitud_origen;
        var destino = latitud_destino + "," + longitud_destino;
        var errors = new Array();
        if (latitud_origen == '' || longitud_origen == ''){
            errors.push("Seleccioná tu <b>Dirección</b>");
        }
        if (latitud_destino == '' || longitud_destino == ''){
            errors.push("Indicá un <b>Prestador</b> del mapa");
        }
        if (metodo == ''){
            errors.push("Elegí un <b>Medio de Transporte</b>");
        }
        if (errors.length > 0){
            gritter(errors.join("<br>"));
        } else {
            var googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origen}&destination=${destino}&travelmode=${metodo}`;

            window.open(googleMapsUrl, '_blank');
        }
       
    }
    
    this.mapa_llegar = function(){
        var latitud_origen = $(settings.selector.cartilla_llegar_latitud).val();
        var longitud_origen = $(settings.selector.cartilla_llegar_longitud).val();
        var metodo = $(settings.selector.transporte_llegar).val();
        var latitud_destino = $(settings.selector.prestador_llegar).data("latitud");
        var longitud_destino = $(settings.selector.prestador_llegar).data("longitud");
        if(metodo.toLowerCase() == "transit"){
            var origen = `${latitud_origen},${longitud_origen}`;
            var destino = `${latitud_destino},${longitud_destino}`;
            var googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origen}&destination=${destino}&travelmode=${metodo}`;

            window.open(googleMapsUrl, '_blank');
        }
        var errors = new Array();
        if (latitud_origen == '' || longitud_origen == ''){
            errors.push("Seleccioná tu <b>Dirección</b>");
        }
        if (latitud_destino == '' || longitud_destino == ''){
            errors.push("Indicá un <b>Prestador</b> del mapa");
        }
        if (metodo == ''){
            errors.push("Elegí un <b>Medio de Transporte</b>");
        }
        if (errors.length > 0){
            gritter(errors.join("<br>"));
        } else {
            var origen = {
                latitud: latitud_origen,
                longitud: longitud_origen
            };
            var destino = {
                latitud: latitud_destino,
                longitud: longitud_destino
            };
            google_maps.route(origen, destino, metodo);
            var targetElement = document.getElementById($(settings.containers.mapa).attr("id"));    
            if (targetElement && targetElement.children.length > 0) {
                var elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                var offsetPosition = elementPosition - 150;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    };
    
    this.imprimir_cartilla = async function(){
       
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        const imageUrl = "./assets/images/portada.jpg";
        const img = new Image();
        img.src = imageUrl;
        
        const { PDFDocument, rgb, StandardFonts } = PDFLib;
        
        try {
            const pdfDoc = await PDFDocument.create();
        
            const coverImageUrl = './assets/images/portada.jpg'; // Imagen para la primera página
            const coverImageResponse = await fetch(coverImageUrl);
        
            const coverImageBytes = await coverImageResponse.arrayBuffer();
            const coverImage = await pdfDoc.embedJpg(coverImageBytes);
        
            const coverPage = pdfDoc.addPage([600, 800]);
            coverPage.drawImage(coverImage, {
                x: 0,
                y: 0,
                width: 600,
                height: 800,
            });
        
            const dataImageUrl = './assets/images/plantilla.jpg'; // Imagen para las páginas de datos
            const dataImageResponse = await fetch(dataImageUrl);
        
            const dataImageBytes = await dataImageResponse.arrayBuffer();
            const dataImage = await pdfDoc.embedJpg(dataImageBytes);
        
            const jsonData = settings.containers.prestadores;
            const title = "Elija su preferencia de " + $(settings.containers.titulo_busqueda).html();
        
            /* const pageWidth = 600;
            const pageHeight = 800;
            const numCols = 3; // Número de columnas
            const colWidth = (pageWidth - 70) / numCols; // Ancho de cada columna
            const rowHeight = 80; // Altura de cada fila
            const fontSize = 10;
            const nameFontSize = 8.9; // Tamaño de fuente para el nombre
            const marginTop = 150; // Margen superior
            const marginLeft = 30; // Margen izquierdo
            const marginRight = 10; // Margen derecho
            const marginBottom = 280; // Margen inferior
            const titleFontSize = 15; // Tamaño de fuente para el título
            const titleMarginTop = 70; // Margen superior para el título
            const titlePadding = 15; // Padding en todas las direcciones del título
            const rightPadding = 20; 
            const titleBorderRadius = 100; // Radio del borde redondeado en la parte derecha del título
        
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        
            const addPageWithBackground = () => {
                const page = pdfDoc.addPage([pageWidth, pageHeight]);
                page.drawImage(dataImage, {
                    x: 0,
                    y: 0,
                    width: pageWidth,
                    height: pageHeight,
                });
        
                
                const textWidth = boldFont.widthOfTextAtSize(title, titleFontSize) + 20;
                const textHeight = boldFont.heightAtSize(titleFontSize);


                page.drawRectangle({
                    x: marginLeft - titlePadding - 20,
                    y: pageHeight - titleMarginTop - textHeight / 4 - rightPadding + 8,
                    width: textWidth,
                    height: textHeight + 2 * titlePadding,
                    color: rgb(0 / 255, 152 / 255, 107 / 255),
                });
                
                
                const radius = (textHeight + 2 * titlePadding) / 2; 
                
                
                page.drawEllipse({
                    x: marginLeft + textWidth  - titlePadding + radius - 40, 
                    y: pageHeight - titleMarginTop / 2 - textHeight / 2 - rightPadding - 1.5, 
                    xScale: radius, 
                    yScale: radius, 
                    color: rgb(0 / 255, 152 / 255, 107 / 255),
                });
        
                
                page.drawText(title, {
                    x: marginLeft,
                    y: pageHeight - titleMarginTop,
                    size: titleFontSize,
                    font: boldFont,
                    color: rgb(255 / 255, 255 / 255, 255 / 255), 
                });
        
                return page;
            };
        
            let currentPage = addPageWithBackground();
            let x = marginLeft; 
            let y = pageHeight - marginTop; 
        
            const addRecord = (record, xOffset) => {
                const nombre = (record.nombre || '').toString();
                const domicilio = (record.domicilio || '').toString();
                const telefono = (record.telefono || '').toString();
        
                currentPage.drawText(nombre, {
                    x: x + xOffset,
                    y: y,
                    size: nameFontSize,
                    font: boldFont,
                    color: rgb(0 / 255, 152 / 255, 107 / 255),
                });
                currentPage.drawText(domicilio, {
                    x: x + xOffset,
                    y: y - 20,
                    size: fontSize,
                    font: font,
                    color: rgb(150 / 255, 150 / 255, 150 / 255),
                });
                currentPage.drawText(telefono, {
                    x: x + xOffset,
                    y: y - 40,
                    size: fontSize,
                    font: font,
                    color: rgb(150 / 255, 150 / 255, 150 / 255),
                });
        
                y -= rowHeight;
            }; */

            // Definición de variables
                const pageWidth = 600;
                const pageHeight = 800;
                const numCols = 3; // Número de columnas
                const colWidth = (pageWidth - 70) / numCols; // Ancho de cada columna
                const rowHeight = 80; // Altura de cada fila
                const fontSize = 10;
                const nameFontSize = 8.9; // Tamaño de fuente para el nombre
                const marginTop = 150; // Margen superior
                const marginLeft = 30; // Margen izquierdo
                const marginRight = 10; // Margen derecho
                const marginBottom = 280; // Margen inferior
                const titleFontSize = 15; // Tamaño de fuente para el título
                const titleMarginTop = 70; // Margen superior para el título
                const titlePadding = 15; // Padding en todas las direcciones del título
                const rightPadding = 20;
                const titleBorderRadius = 100; // Radio del borde redondeado en la parte derecha del título

                const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
                const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

                // Función para dividir texto en líneas basadas en un ancho máximo
                const wrapText = (text, font, fontSize, maxWidth) => {
                    const words = text.split(' ');
                    let lines = [];
                    let currentLine = '';

                    for (let word of words) {
                        let testLine = currentLine + (currentLine ? ' ' : '') + word;
                        let testWidth = font.widthOfTextAtSize(testLine, fontSize);

                        if (testWidth > maxWidth) {
                            lines.push(currentLine);
                            currentLine = word;
                        } else {
                            currentLine = testLine;
                        }
                    }

                    lines.push(currentLine);
                    return lines;
                };

                // Función para agregar una página con fondo
                const addPageWithBackground = () => {
                    const page = pdfDoc.addPage([pageWidth, pageHeight]);
                    page.drawImage(dataImage, {
                        x: 0,
                        y: 0,
                        width: pageWidth,
                        height: pageHeight,
                    });

                    const textWidth = boldFont.widthOfTextAtSize(title, titleFontSize) + 20;
                    const textHeight = boldFont.heightAtSize(titleFontSize);

                    page.drawRectangle({
                        x: marginLeft - titlePadding - 20,
                        y: pageHeight - titleMarginTop - textHeight / 4 - rightPadding + 8,
                        width: textWidth,
                        height: textHeight + 2 * titlePadding,
                        color: rgb(0 / 255, 152 / 255, 107 / 255),
                    });

                    const radius = (textHeight + 2 * titlePadding) / 2;

                    page.drawEllipse({
                        x: marginLeft + textWidth - titlePadding + radius - 40,
                        y: pageHeight - titleMarginTop / 2 - textHeight / 2 - rightPadding - 1.5,
                        xScale: radius,
                        yScale: radius,
                        color: rgb(0 / 255, 152 / 255, 107 / 255),
                    });

                    page.drawText(title, {
                        x: marginLeft,
                        y: pageHeight - titleMarginTop,
                        size: titleFontSize,
                        font: boldFont,
                        color: rgb(255 / 255, 255 / 255, 255 / 255),
                    });

                    return page;
                };

                // Función para limpiar caracteres no soportados
                // Caracteres ascii qie no son palabras - tabs - saltos de linea
                function cleanString(str) {
                    return str
                    .replace(/\t|\r|\n/g, ' ') 
                    .replace(/[\x00-\x08\x0B-\x1F\x7F-\x9F]/g, '') 
                    .replace(/[^\x20-\x7E\xA0-\xFF]/g, '');
                }

                // Inicializa la primera página
                let currentPage = addPageWithBackground();
                let x = marginLeft;
                let y = pageHeight - marginTop;

                // Función para agregar un registro a la página
                const addRecord = (record, xOffset) => {
                    const nombre = cleanString((record.nombre || '').toString());
                    const domicilio = cleanString((record.domicilio || '').toString());
                    const ciudad = cleanString((record.localidad || '').toString());
                    const telefono = cleanString((record.telefono || '').toString());

                    const maxNameWidth = colWidth - 20; // Ajusta el ancho máximo según sea necesario
                    const nameLines = wrapText(nombre, boldFont, nameFontSize, maxNameWidth);

                    let yOffset = y;

                    // Dibuja cada línea del nombre
                    for (let line of nameLines) {
                        currentPage.drawText(line, {
                            x: x + xOffset,
                            y: yOffset,
                            size: nameFontSize,
                            font: boldFont,
                            color: rgb(0 / 255, 152 / 255, 107 / 255),
                        });
                        yOffset -= nameFontSize + 2; // Ajusta la separación entre líneas
                    }

                    // Dibuja domicilio y teléfono
                    currentPage.drawText(domicilio, {
                        x: x + xOffset,
                        y: yOffset - 20,
                        size: fontSize,
                        font: font,
                        color: rgb(150 / 255, 150 / 255, 150 / 255),
                    });

                    currentPage.drawText(ciudad, {
                        x: x + xOffset,
                        y: yOffset - 30,
                        size: fontSize,
                        font: font,
                        color: rgb(150 / 255, 150 / 255, 150 / 255),
                    });

                    currentPage.drawText(telefono, {
                        x: x + xOffset,
                        y: yOffset - 40,
                        size: fontSize,
                        font: font,
                        color: rgb(150 / 255, 150 / 255, 150 / 255),
                    });

                    y -= rowHeight;
                };


        
            jsonData.forEach((item, index) => {
                const colIndex = index % numCols;
                x = marginLeft + colIndex * (colWidth + marginRight);
        
                const itemsPerPage = Math.floor((pageHeight - marginTop - marginBottom) / rowHeight) * numCols;
                const rowIndex = Math.floor((index % itemsPerPage) / numCols);
                y = pageHeight - marginTop - (rowIndex * rowHeight);
        
                if (index % itemsPerPage === 0 && index !== 0) {
                    currentPage = addPageWithBackground();
                    y = pageHeight - marginTop; 
                }
        
                addRecord(item, 0);
            });
        
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
        
            const a = document.createElement('a');
            a.href = url;
            a.download = 'cartilla.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
        }
    };
    
   

    $('.filter').on("click", function(e){
        if($(this).data('clase') == '2'){
            $('#popup').fadeIn();
        }else{
        $('#form-search').hide()
        $('#container_results').hide()
        $('#container_find_empty').hide()
        $(settings.selector.especialidad).val("")
        $('#form-search').children().removeAttr('style')
        $('#cartilla_localidades').html('<option selected value="0">Seleccioná una localidad</option>')
        $('#planes').html('<option selected value="">Planes</option>')
        $('#cartilla_profesional').val('')
        
       /*  $(this).parent().find('.box.active').find('img:first').css('display','block')
        $(this).parent().find('.box.active p').css('color','#01996c')
        $(this).parent().find('.box.active').find('img').filter(':last').css('display', 'none') */
        $(this).parent().find('.box.active').find('img').removeAttr('style')
        $(this).parent().find('.box.active').find('p').removeAttr('style')
        $(this).parent().find('.box').removeClass('active')
        $(this).find('.box').addClass('active')
        $(this).find('.box p').css('color','#fff')
        $(this).find('.box img:first').css('display','none')
        $(this).find('.box img').filter(':last').css('display', 'block')
        e.preventDefault();
        settings.filter.clase = ''
        settings.filter.especialidad = ''
        

        let credencial = $(this).data('credencial')
        let plan = $(this).data('plan')
        let especialidad = $(this).data('especialidad')
        let profesional = $(this).data('nombre')
        settings.filter.clase = $(this).data('clase')
        $("#form-search").find(".title").html("<h3>"+$(this).data('title')+"</h3>")
        $(settings.selector.credencial).show()
        $(settings.selector.provincia).show()
        $(settings.selector.localidad).parent().hide()
        $(settings.selector.clase).closest(".filtros").hide()
        if(credencial == "V"){
            $(settings.selector.credencial).show()
            $(settings.selector.credencial).parent().show()
            $(settings.selector.credencial).parent().parent().show()
        }else{
            $(settings.selector.credencial).parent().parent().hide()
            $(settings.selector.credencial).parent().hide()
            $(settings.selector.credencial).hide()
        }
        if(plan == "V"){   
            $(settings.selector.plan).parent().parent().show()
            $(settings.selector.plan).show()
        }else{
            $(settings.selector.plan).parent().parent().hide()
            $(settings.selector.plan).hide()
        }
        if(especialidad == "V"){
            _self.especialidades
            $(settings.selector.especialidad).closest(".filtros").show()
        }else{
            $(settings.selector.especialidad).closest(".filtros").hide()
        }
        if(profesional == "V"){
            $(settings.selector.profesional).parent().show()
            $(settings.selector.profesional).show()
        }else{
            $(settings.selector.profesional).parent().hide()
            $(settings.selector.profesional).hide()
        }

       
      
       _init();
       
        }
      
    })
    
     $(settings.selector.clase).on("change", function(){
        $(settings.selector.especialidad).parent().show();
    }); 
   
    $(settings.selector.provincia).on("change", _self.localidades);
    $(settings.selector.centros_provincias).on("change", _self.centros_localidades);
    $(settings.selector.clase).on("change", _self.especialidades);
   // $(settings.selector.credencial).on("change", _self.planes);
    $(settings.selector.cercania).keyup(_self.direccion);
    $(settings.selector.direccion_llegar).keyup(_self.direccion_llegar);
    $(settings.selector.button_mapa_llegar).on("click", _self.mapa_llegar);
    $(settings.selector.button_compartir).on("click", _self.compartir);
    $(settings.selector.button_buscar_cartilla).on("click", _self.buscar_cartilla);
    $(settings.selector.button_buscar_centros).on("click", _self.buscar_centros);
    $(settings.containers.items_resultados_cartillas + "," + settings.containers.items_resultados_centros + "," + settings.containers.items_resultados_filiales)
            .on("click", ".btn-mapa-center", function(){
                var latitud = $(this).data("latitud");
                var longitud = $(this).data("longitud");
                var titulo = $(this).data("titulo");
                google_maps.set_center($(this).data("latitud"), $(this).data("longitud"));
                google_maps.set_zoom(20);
                //scroll_to_element(settings.containers.mapa, -150);
                var targetElement = document.getElementById($(settings.containers.mapa).attr("id"));

                if (targetElement && targetElement.children.length > 0) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }                              

                var param = {
                    titulo: titulo,
                    latitud: latitud,
                    longitud: longitud
                };
                _self.definir_mapa_seleccion(param);
                return false;
    });
    /*_init();*/
}
function getRandomColor() {
    // Genera un color hexadecimal aleatorio
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function saveRouteToHistory(origen, destino, metodo) {
  
    const history = JSON.parse(localStorage.getItem('routeHistory')) || [];
    const randomColor = getRandomColor();  
  
    history.push({ 
        origen, 
        destino, 
        metodo, 
        date: new Date(),
        style:  { color: randomColor, label: `Ruta desde ${origen} a ${destino}` } 
    });
    localStorage.setItem('routeHistory', JSON.stringify(history));
}



var cartilla = null;

$(document).ready(function(){

    $('#close-popup').click(function() {
        $('#popup').fadeOut();
    });

    $(window).click(function(event) {
        if ($(event.target).is('#popup')) {
            $('#popup').fadeOut();
        }
    });
    var options = {
        selector: {
            credencial: "select#cartilla_credenciales",
            clase: "select#cartilla_clase",
            especialidad: "select#cartilla_especialidad",
            provincia: "select#cartilla_provincias",
            localidad: "select#cartilla_localidades",
            plan: "select#planes",
            localidad_nombre: "[name='cartilla[localidad_nombre]']",
            tipo_busqueda: "input[name='cartilla[tipo_busqueda]']",
            cercania: "input#cartilla_cercanias",
            direccion_llegar: "input#direccion_llegar",
            cartilla_llegar_latitud: "input#cartilla_llegar_latitud",
            cartilla_llegar_longitud: "input#cartilla_llegar_longitud",
            cercania_latitud: "input#cartilla_cercania_latitud",
            cercania_longitud: "input#cartilla_cercania_longitud",
            profesional: "input#cartilla_profesional",
            centros_provincias: "select#centros_provincias",
            centros_localidad: "select#centros_localidad",
            button_buscar_cartilla: '#buscar_cartilla_prestadores',
            button_buscar_centros: '#buscar_centros_atencion',
            button_mapa_llegar: '#mostrar_mapa_llegar',
            button_compartir: '#mostrar_compartir',
            prestador_llegar: '#prestador_llegar',
            transporte_llegar: '#transporte_llegar',
            planes: '#planes'
        },
        containers: {
            resultados_crecanias: ".contenedor-resultados-busqueda-cercania",
            resultados_cercanias_llegar: ".container-resultados-cercania-llegar",
            cartilla: '.contenedor-resultados-cartilla',
            mas_resultados: '.container-mas-resultados',
            titulo_busqueda: '#titulo_resultados_busqueda',
            buscando: '#container_search',
            buscando_centros: '#container_search_centros',
            resultados_prestadores: '#container_results',
            resultados_centros: '#container_results_centros',
            empty_results: '#container_find_empty',
            empty_results_centros: '#container_find_empty_centros',
            items_resultados_cartillas: '#contenedor_resultados_busqueda',
            items_resultados_centros: '#contenedor_resultados_busqueda_centros',
            items_resultados_filiales: '#contenedor_resultados_busqueda_filiales',
            mapa: '#r-mapa',
            paginaActual: 1
        }
    };
    cartilla = new _cartilla(options);
    
    /* $("#cartilla_especialidad").autocomplete({
        source: function(request, response) {
                $.ajax({
                    url: "xhr/cartilla.php",
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        accion: 'especialidades',
                        clase: $("#cartilla_clase").val(),
                        selector: true
                    },
                    success: function(_json){
                        
                        
                        
                        //$(element).find("option").remove();
                        if (_json.success && _json.msg && _json.msg.especialidades){   
                            var resultadosFiltrados = $.grep(_json.msg.especialidades, function(item) {
                                return item.toLowerCase().indexOf(request.term.toLowerCase()) !== -1;
                            });
                            response(resultadosFiltrados);
                                            
                        
                        } else {
                            _graph_sin_resultados(element);
                        }
                    },
                    error: function(){
                        _graph_sin_resultados(element);
                    }
                })
        }
    }) */
});