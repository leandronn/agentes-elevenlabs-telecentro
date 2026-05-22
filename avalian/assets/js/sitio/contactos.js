

/* global BASE_URL, validar, recatcha_token */

function _contactos(options){
    
    var settings = $.extend({
            selector: {
                tipo_consulta: '',
                nombre: '',
                apellido: '',
                provincia: '',
                localidad: '',
                tipo_documento: '',
                numero_documento: '',
                codigo_prestador: '',
                email: '',
                prefijo_telefono: '',
                numero_telefono: '',
                mensaje: '',
                plan: '',
                conocio: '',
                localidad_suggestions: '',
                tipo_c_afi: '',
            },
            controls: {
                enviar: ''
            },
            containers: {
                formulario: ".display-on-load"
            },
            xhr: {
                cartilla: BASE_URL + 'xhr/cartilla.php',
                contactos: BASE_URL + 'xhr/contactos.php',
                action: 'formulario_contactos'
            }
        }, options);
        
    var _self = this;
    
    function _graph_sin_resultados(element){
        $(element).find("option").remove();
        $(element).append('<option value="">Sin Resultados</option>');
    }
    
    function _graph_recuperando(element){
        $(element).find("option").remove();
        //$(element).append('<option value="" selected="" disabled="">(recuperando...)</option>');
    }

    $("#documento_tipo").on("change", function(){
        if($(this).val() == "CUIT"){
            $(this).closest(".show-asociarme").find("#documento_numero").attr("maxlength", "11");
            $("#documento_numero").closest("div").find(':first').html("Nro de Cuit");
        }else{
            $("#documento_numero").closest("div").find(':first').html("Nro de Documento");
            $(this).closest(".show-asociarme").find("#documento_numero").attr("maxlength", "8");
        }
    })

    $(document).ready(function(){
            $("#documento_numero").on('paste', function(e){
                e.preventDefault();
            })
        
            $("#documento_numero").on('copy', function(e){
                e.preventDefault();
            })

            $("#prefijo").on('copy', function(e){
                e.preventDefault();
            })
            $("#prefijo").on('paste', function(e){
                e.preventDefault();
            })
            $("#telefono").on('copy', function(e){
                e.preventDefault(); 
            })
            $("#telefono").on('paste', function(e){
                e.preventDefault();
            }) 

            $('#documento_numero').on('input', function() {
                let texto = $(this).val();
                texto = texto.replace(/-/g, '');
                texto = texto.substring(0, 11);
                $(this).val(texto);
            });
            $('#telefono').on('input', function() {
                let texto = $(this).val();
                texto = texto.replace(/-/g, '');
                texto = texto.substring(0, 11);
                $(this).val(texto);
            });
            $('#prefijo').on('input', function() {
                let texto = $(this).val();
                texto = texto.replace(/-/g, '');
                texto = texto.substring(0, 11);
                $(this).val(texto);
            });
      })
    
    function tipo_change(){
        $(".hidde-action").hide();
        switch ($(settings.selector.tipo_consulta).val()) {
            case "SOY_ASOCIADO":
                $(".show-asociarme").hide();
                $(".show-socio").show();
                $(".show-prestador").hide();
                $("#documento_tipo").attr('disabled',false);
                $("#documento_tipo").find("option").removeAttr('selected');
               // $("#documento_tipo option[value='CUIT'").attr("selected",false);
                $("#documento_tipo option[value='DNI'").attr("selected",true);
                $("#documento_numero").closest("div").find(':first').html("Nro de Documento");
                $("#documento_numero").attr("maxlength", "8");
                
                
                break;
                
            case "QUIERO_ASOCIARME":
                $(".show-asociarme").show();
                $(".show-prestador").hide();
                $(".show-soy-asociado").show();
                $("#documento_tipo").attr('disabled',false);
                $("#documento_tipo").find("option").removeAttr('selected');
                //$("#documento_tipo option[value='CUIT'").attr("selected",false);
                $("#documento_tipo option[value='DNI'").attr("selected",true);
                $("#documento_numero").closest("div").find(':first').html("Nro de Documento");
                $("#documento_numero").attr("maxlength", "8");
                break;
            case "QUIERO_SER_PRESTADOR":
                $(".show-asociarme").show();
                $(".show-prestador").hide();
                $(".show-soy-asociado").hide();
                $("#documento_tipo").val("CUIT");
                $(settings.selector.tipo_documento).val("CUIT")
                $("#documento_tipo").find("option").removeAttr('selected');
               // $("#documento_numero").closest("div").find(':first').html("Nro de Documento");
                $("#documento_tipo").attr('disabled',true);
                $("#documento_tipo option[value='CUIT'").attr("selected",true);
                $("#documento_numero").closest("div").find(':first').html("Nro de Cuit");
                $("#documento_numero").attr("maxlength", "11");
                $("#dni").find("label").html(" ");
                break;
            case "SOY_PRESTADOR":
                $(".show-asociarme").hide();
                $(".show-socio").show();
                $(".show-prestador").show();
                $("#documento_tipo").val("CUIT");
                $(settings.selector.tipo_documento).val("CUIT");
                $("#documento_tipo").find("option").removeAttr('selected');
                $("#documento_tipo").attr('disabled',true);
                $("#documento_tipo option[value='CUIT'").attr("selected",true);
                $("#documento_numero").closest("div").find(':first').html("Nro de Cuit");
                $("#documento_numero").attr("maxlength", "11");
                $("#dni").find("label").html(" ");
                
            default:
                break;
        }
    }
    
    function _init(){
    
        tipo_change();
        $.ajax({
            url: settings.xhr.contactos,
            type: 'POST',
            dataType: 'json',
            data: {
                accion: "provincias"
            },
            success: function(_json){
                
                if (_json.success && _json.msg && _json.msg.provincias){
                    $.each(_json.msg.provincias, function(){
                        var _html = '<option value="' + this.codigo + '">' + this.nombre + '</option>';
                        $(settings.selector.provincia).append(_html);
                        $(settings.selector.centros_provincias).append(_html);
                    });
                    $(settings.containers.formulario).removeClass("d-none");
                }
            },
            error: function(){
                console.log("Error");
            }
        });

        $.ajax({
            url: settings.xhr.contactos,
            type: 'POST',
            dataType: 'json',
            data: {
                accion: "relaciones_laborales"
            },
            success: function(_json){
                if (_json.success && _json.msg && _json.msg.relaciones){
                    $.each(_json.msg.relaciones, function(){
                        var _html = '<option value="' + this.relacion + '">' + this.relacion + '</option>';
                        $('.tipo_c_afi').append(_html);
                    });
                }
            },
            error: function(){}
        });
    }
    
    this.localidades = function(){
        var element = $(settings.selector.localidad);
        var provincia = $(settings.selector.provincia).val();

        if (provincia != '') {
            var suggestionsContainer = $("#localidad_suggestions");
            _graph_recuperando(suggestionsContainer);

            $.ajax({
                url: settings.xhr.contactos,
                type: 'POST',
                dataType: 'json',
                data: {
                    accion: 'localidades',
                    provincia: provincia
                },
                beforeSend: function() {
                    $('#localidad_label').text('(recuperando...)');
                    $('#localidad').prop('disabled', true);
                    $("#localidad_suggestions").empty();
                },
                success: function(_json) {
                    suggestionsContainer.empty(); 
                    if (_json.success && _json.msg && _json.msg.localidades) {
                        localidadesData = _json.msg.localidades; 
            
                        $(settings.selector.localidad).prop('disabled', false);
                        $('#localidad_label').text('Escribí tu localidad');
            
                        var filterLocalidad = function(query) {
                            var filtered = localidadesData.filter(function(localidad) {
                                return localidad.nombre.toLowerCase().includes(query.toLowerCase());
                            });
                            return filtered.slice(0, 5); 
                        };
            
                        $(settings.selector.localidad).on('input', function() {
                            var query = $(this).val();
                            var filteredLocalidades = filterLocalidad(query);
                            suggestionsContainer.empty(); 
            
                            if (filteredLocalidades.length > 0) {
                                $.each(filteredLocalidades, function(index, localidad) {
                                    suggestionsContainer.append('<div class="suggestion-item" data-id="' + localidad.id + '">' + localidad.nombre + '</div>');
                                });
                            } else {
                                suggestionsContainer.append('<div class="suggestion-item">No se encontraron localidades</div>');
                            }
                        });
            
                        $(document).on('click', '.suggestion-item', function() {
                            var localidadNombre = $(this).text(); 
                            var localidadId = $(this).data('id'); 
                            $(settings.selector.localidad).val(localidadNombre);
                            $('#localidad_id').val(localidadId);
                            suggestionsContainer.empty();
                        });
                    } else {
                        _graph_sin_resultados(suggestionsContainer); 
                    }
                },
                error: function() {
                    _graph_sin_resultados(suggestionsContainer); 
                }
            });
        }
    };
    
    this.enviar = function(){
        //$(settings.controls.enviar).prop("disabled", true);
        $("#contacto_enviar").attr('disabled',true);

        var tipo_consulta = $.trim($(settings.selector.tipo_consulta).val());
        var nombre = $.trim($(settings.selector.nombre).val());
        var apellido = $.trim($(settings.selector.apellido).val());
        var provincia = $.trim($(settings.selector.provincia).val());
        var localidad = $.trim($(settings.selector.localidad).val());
        var tipo_documento = $.trim($(settings.selector.tipo_documento).val());
        var numero_documento = $.trim($(settings.selector.numero_documento).val().replace("-", ""));
        var codigo_prestador = $.trim($(settings.selector.codigo_prestador).val());
        var email = $.trim($(settings.selector.email).val());
        var prefijo = $.trim($(settings.selector.prefijo_telefono).val().replace("-", ""));
        var telefono = $.trim($(settings.selector.numero_telefono).val().replace("-", ""));
        var mensaje = $.trim($(settings.selector.mensaje).val());
        var plan = $(settings.selector.plan).val();
        var tipo_c_afi = $(settings.selector.tipo_c_afi).val();
        var conocio = $(settings.selector.conocio).val();
        var titulo = $.trim($('#titulo').val());
        var especialidad = $.trim($('#especialidad').val()); 
        var matricula = $.trim($('#matricula').val()); 
        var sociedades_asociaciones = $('input[name="sociedades_asociaciones[]"]:checked').map(function() { return this.value; }).get(); 
        var otras_prepagas = $('input[name="otras-prepagas[]"]:checked').map(function() { return this.value; }).get();
        var institucion_pacientes_cud = $('input[name="pacientes-CUD[]"]:checked').map(function() { return this.value; }).get();
        var campo_oculto = $.trim($('#oculto').val());
        var recaptcha_key = '6Leoc8wZAAAAALcwB-y8bOOnFJdAGxGZHTqIpxDr';

        var errors = new Array();

        /* if(numero_documento != ''){
             if(numero_documento.length > 8){
                errors.push("Su <b>Documento</b> es demasiado largo");
            }
        } */
     
        if (tipo_consulta == ""){
            errors.push("Seleccione un <b>Típo de consulta</b> de la lista");
        }
        if (nombre == ""){
            errors.push("El <b>Nombre</b> es obligatorio");
        }
        if (apellido == ""){
            errors.push("El <b>Apellido</b> no puede ser vacío");
        }
        if (provincia == ""){
            errors.push("Seleccione su <b>Provincia</b>");
        }
        if (localidad == ""){
            errors.push("<b>Localidad</b> es requerido");
        }
        if (tipo_consulta == 'QUIERO_ASOCIARME' || tipo_consulta == 'SOY_ASOCIADO'){
            if (tipo_documento == ""){
                errors.push("Debe seleccionar un <b>Tipo de Documento</b> válido");
            }
            if (numero_documento == ""){
                errors.push("El <b>Número de Documento</b> es obligatorio");
            }else if(numero_documento.length != 11 && tipo_documento == 'CUIT' ){
                errors.push("El <b>Número de Cuit</b> no es correcto, corrobore y vuelva a intentar");
                }else if(numero_documento.length != 8 && tipo_documento == 'DNI' ){
                    errors.push("El <b>Número de Documento</b> no es correcto, corrobore y vuelva a intentar");
                    }
        }   
        if (tipo_consulta == 'QUIERO_ASOCIARME'){
            if (plan == ''){
                errors.push("Selecciones el <b>Plan</b> de su interés");
            }
            if (conocio == ''){
                errors.push("Indique <b>Como nos conoció</b>");
            }

            if (tipo_c_afi == '') {
                errors.push('Seleccione <b>relación laboral</b>');
            }
        }
        if (tipo_consulta == 'SOY_PRESTADOR'){
            if (numero_documento == "" && codigo_prestador == ""){
                errors.push("Debe completar <b>Codigo de prestador</b> o <b>CUIT</b>");
            }
            if(numero_documento.length != 11 && tipo_documento == 'CUIT' ){
                errors.push("El <b>Número de Cuit</b> no es correcto, corrobore y vuelva a intentar");
                }
        }
        if (tipo_consulta == 'QUIERO_SER_PRESTADOR'){
            if (numero_documento == ""){
                errors.push("El <b>CUIT</b> es obligatorio");
            }else if(numero_documento.length != 11 && tipo_documento == 'CUIT' ){
                errors.push("El <b>Número de Cuit</b> no es correcto, corrobore y vuelva a intentar");
            }
            if (titulo == "") {
                errors.push("El <b>Título</b> es obligatorio");
            }
            if (especialidad == "") {
                errors.push("La <b>Especialidad</b> es obligatoria");
            }
            if (matricula == "") {
                errors.push("La <b>Matrícula</b> es obligatoria");
            }
            if (sociedades_asociaciones.length == 0) {
                errors.push("Debe seleccionar al menos una opción en <b>Sociedades y/o Asociaciones</b>");
            }
            if (otras_prepagas.length == 0) {
                errors.push("Debe seleccionar al menos una opción en <b>Atención en otras prepagas</b>");
            }
            if (institucion_pacientes_cud.length == 0) {
                errors.push("Debe seleccionar al menos una opción en <b> Institución especializada en pacientes con CUD</b>");
            }
        }
        if (email == "" || !validar.email(email)){
            errors.push("Ingrese un <b>Email</b> válido");
        }
        if (prefijo == ""){
            errors.push("Complete su <b>Código de Área</b> telefónico");
        }else if(prefijo.length > 4){
        errors.push("El <b>prefijo</b> es demasiado largo, corrobore y vuelva a intentar");
        }
        if (telefono == ""){
            errors.push("Indique su <b>Número de celular</b>");
        }else  if(telefono.length > 10){
            errors.push("Su <b>Número de celular</b> es demasiado largo, corrobore y vuelva a intentar");
        }

        var totalLength = (prefijo + telefono).length;

        if (totalLength > 10 || totalLength < 10) {
            errors.push("Complete el Código de Area sin el 0 y el número sin el 15. El total entre <b>Código de Área</b> y <b>Número de celular</b> deben ser 10 números.");
        } 
        if (mensaje == ""){
            errors.push("Complete el <b>Mensaje</b> para el contacto");
        }
        
        if (errors.length > 0) {
            gritter(errors.join("<br>"));
            $("#contacto_enviar").attr('disabled',false);
            return;
        }

        if (campo_oculto) {
            $("#contacto_enviar").attr('disabled',false);
            return;
        }
        
        grecaptcha.ready(function() {
            grecaptcha.execute(recaptcha_key, { action: 'homepage' })
                .then(function(token) {
                    var contacto_rrss = $("[name=contacto_rrss]").length > 0 ? $("[name=contacto_rrss]").val() : '';
                    if (tipo_consulta == 'QUIERO_SER_PRESTADOR'){
                        mensaje = 
                             mensaje + '<br>' +
                            'Título: ' + titulo + '<br>' +
                            'Especialidad: ' + especialidad + '<br>' +
                            'Matrícula: ' + matricula + '<br>' +
                            'Pertenece a sociedades y/o asociaciones: ' + (sociedades_asociaciones.join(', ') || 'Ninguna') + '<br>' +
                            'Atención en otras prepagas: ' + (otras_prepagas.join(', ') || 'Ninguna') + '<br>' +
                            'Institución especializada en pacientes con CUD: ' + (institucion_pacientes_cud.join(', ') || 'Ninguna') + '<br>'
                    }
                    var data = {
                        accion: settings.xhr.action,
                        contacto: {
                            recaptcha: token,
                            tipo: tipo_consulta,
                            nombre: nombre,
                            apellido: apellido,
                            email: email,
                            mensaje: mensaje,
                            plan: plan,
                            conocio: conocio,
                            contacto_rrss: contacto_rrss,
                            tipo_c_afi: tipo_c_afi,
                            localidad: {
                                provincia: $(settings.selector.provincia).find("option:selected").html(),
                                localidad: $(settings.selector.localidad).val(),
                                localidad_id: $('#localidad_id').val()
                            },
                            documento: {
                                tipo: tipo_documento,
                                numero: numero_documento
                            },
                            prestador: codigo_prestador,
                            telefono: {
                                prefijo: prefijo,
                                numero: telefono
                            }
                        }
                    };
                    $.ajax({
                        url: settings.xhr.contactos,
                        type: 'POST',
                        dataType: 'json',
                        data: data,
                        success: function(_json){
                            if (_json.success){
                                // gritter("Tu consulta se ha registrado correctamente</br>Nos comunicaremos a la brevedad", "success");
                                $('#form_contacto_datos').hide();
                                 window.location.href = tipo_consulta == 'QUIERO_SER_PRESTADOR' ? 'gracias.html?tipo=prestador' : 'gracias.html';
                            } else if (_json.msg){
                                if (_json.msg.discarded === true) {
                                    window.location = tipo_consulta == 'QUIERO_SER_PRESTADOR' ? 'gracias.html?nlead&tipo=prestador' : 'gracias.html?nlead';
                                    return;
                                }  
                                var mensajes = [];
                                if (Array.isArray(_json.msg)) {
                                    mensajes = _json.msg;
                                } else if (typeof _json.msg === 'object') {
                                    if (_json.msg.errors) {
                                        Object.values(_json.msg.errors).forEach(function(entry) {
                                            if (Array.isArray(entry)) {
                                                entry.forEach(function(m) { mensajes.push(m); });
                                            } else {
                                                mensajes.push(entry);
                                            }
                                        });
                                    }                           
                                } else {
                                    mensajes = [_json.msg.toString()];
                                }
                        
                                var serverErrors = mensajes.join("<br>");
                                gritter(serverErrors);
                                $("#contacto_enviar").attr('disabled',false);
                            } else {
                                gritter("En estos momentos no podemos procesar su solicitud<br>Vuelva a intentar más tarde");
                                //$(settings.controls.enviar).prop("disabled", false);
                                $("#contacto_enviar").attr('disabled',false);
                                // reset_recaptcha();
                            }
                        },
                        error: function(){
                            gritter("En estos momentos no podemos procesar su solicitud<br>Vuelva a intentar más tarde");
                            //$(settings.controls.enviar).prop("disabled", false);
                            $("#contacto_enviar").attr('disabled',false);
                            // reset_recaptcha();
                        }
                    });
                })
                .catch(function() {
                    gritter("No se pudo generar el token de captcha.");
                    $("#contacto_enviar").attr('disabled',false);
                });
        })
    };
        
    $(settings.controls.enviar).on("click", _self.enviar);
    $(settings.selector.provincia).on("change", _self.localidades);
    $(settings.selector.tipo_consulta).on("change", tipo_change);
    _init();
}

$(document).ready(function(){
    jQuery($("#email")).keyup(function(tecla)
    
    {
        if ($("#email").val().indexOf(".") === -1 || $("#email").val().indexOf("@") === -1) 
     {
        $("#email").parent().find(".msj").css("display", "block");
     }else{
        $("#email").parent().find(".msj").css("display", "none");
     }
      

    });
    jQuery($("#telefono")).keyup(function(tecla)

   {
    if($("#telefono").val().length == 2){
        console.log($("#teledono").val());
        if($("#telefono").val() == 15){
            gritter("No debe contener 15");
        }
    }
    
 

   });

    var options = {
        selector: {
            tipo_consulta: '[name="contacto[tipo]"]',
            nombre: '[name="contacto[nombre]"]',
            apellido: '[name="contacto[apellido]"]',
            provincia: '[name="contacto[provincia]"]',
            localidad: '[name="contacto[localidad]"]',
            tipo_documento: '[name="contacto[documento][tipo]"]',
            numero_documento: '[name="contacto[documento][numero]"]',
            codigo_prestador: '[name="contacto[prestador]"]',
            email: '[name="contacto[email]"]',
            prefijo_telefono: '[name="contacto[telefono][area]"]',
            numero_telefono: '[name="contacto[telefono][numero]"]',
            mensaje: '[name="contacto[mensaje]"]',
            plan: '[name="contacto[plan]"]',
            conocio: '[name="contacto[conocio]"]',
            tipo_c_afi: '[name="contacto[tipo_c_afi]"]',
        },
        controls: {
            enviar: '#contacto_enviar'
        },
        containers: {
            formulario: ".display-on-load"
        }
    };
    contacto = new _contactos(options);
});
