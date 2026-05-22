/* global AJAX_URL, encodeURIComponent */

$(document).ajaxComplete(function(event, jqXHR, ajaxSettings, thrownError ){
    if( jqXHR.responseText && jqXHR.responseText.indexOf('LoginForm') != -1){
        gritter(
            'la sesión expiró, vuelva a iniciar sesión, será redireccionado a el login en 3 segundos',
            'error',
            event.currentTarget.title);
        let error_timeout = setTimeout(function(){
            window.location.href = BASE_URL+'ventas/';
            clearTimeout(error_timeout);
        }, 3000);
    }
});

var _IS_MOBILE = '';

/**
 * Indica si se está visualizando modo mobile (hidden-xs y hidden-sm están ocultos)
 * 
 * @returns {Boolean}
 */
function is_mobile(){
    if (_IS_MOBILE === ''){
        var div = $("<div>").addClass("hidden-xs").addClass("hidden-sm");
        $("body").append(div);
        var resp = !($(div).is(":visible"));
        $(div).remove();
        _IS_MOBILE = resp;
    }
    return _IS_MOBILE;
}

/**
 * Muestra / oculta los filtros de busqueda
 * 
 * @@param {boolean} efecto_slide 
 * @returns {undefined}
 */
function hide_filters(efecto_slide){
    if ($("#filtros, #filtros_paquetes").find(".detalles-filtros-busqueda").is(":visible")){
        if (efecto_slide){
            $("#filtros, #filtros_paquetes").find(".detalles-filtros-busqueda").slideUp();
        } else {
            $("#filtros, #filtros_paquetes").find(".detalles-filtros-busqueda").hide();
        }
    } else {
        if (efecto_slide){
            $("#filtros, #filtros_paquetes").find(".detalles-filtros-busqueda").slideDown();
        } else {
            $("#filtros, #filtros_paquetes").find(".detalles-filtros-busqueda").show();
        }
    }
}

function fecha_comun(fecha_en_mysql, ver_hora){
    var fecha = fecha_en_mysql.trim();
    if (fecha != ''){
        let temp = fecha.split(" ");
        let hora = temp[1] !== undefined && ver_hora ? " "+temp[1] : '';
        temp = temp[0].split("-");
        let anio = str_pad(temp[0], 4, "0", 'STR_PAD_LEFT');
        let mes = str_pad(temp[1], 2, "0", 'STR_PAD_LEFT');
        let dia = str_pad(temp[2], 2, "0"+ 'STR_PAD_LEFT');
        fecha = dia+"/"+mes+"/"+anio+" "+hora;
    }
    return fecha;
}

/**
 * agrega el string pad_string en la posicion definida por pad_type a la cadena input hasta completar su tamaño en pad_length caracteres
 * 
 * @param {string} input        El string original
 * @param {integer} pad_length  La cantidad de caracteres que tendrá el string de retorno
 * @param {string} pad_string   El string utilizado para completar
 * @param {string} pad_type     El tipo de pad a utilizar [STR_PAD_LEFT, STR_PAD_RIGHT, STR_PAD_BOTH - por defecto STR_PAD_RIGHT]
 * @returns {string}
 */
str_pad = function(input, pad_length, pad_string, pad_type){
      var half = '',
    pad_to_go;
    var str_pad_repeater = function(s, len) {
        var collect = '';
        while (collect.length < len) {
            collect += s;
        }
        collect = collect.substr(0, len);
            return collect;
    };
    input += '';
    pad_string = pad_string !== undefined ? pad_string : ' ';
    if (pad_type !== 'STR_PAD_LEFT' && pad_type !== 'STR_PAD_RIGHT' && pad_type !== 'STR_PAD_BOTH'){
        pad_type = 'STR_PAD_RIGHT';
    }
    if ((pad_to_go = pad_length - input.length) > 0) {
        if (pad_type === 'STR_PAD_LEFT') {
            input = str_pad_repeater(pad_string, pad_to_go) + input;
        } else if (pad_type === 'STR_PAD_RIGHT') {
            input = input + str_pad_repeater(pad_string, pad_to_go);
        } else if (pad_type === 'STR_PAD_BOTH') {
            half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
            input = half + input + half;
            input = input.substr(0, pad_length);
        }
    }
    return input;
};

/**
 * Formate un numero de forma analoga a la function PHP number_format
 * 
 * @param {float} number                Numero a formatear
 * @param {integer} decimals            Cantidad de decimales utilizados en el redondeo
 * @param {string} dec_point            Separador decimal (default ".")
 * @param {string} thousands_sep        Separador de miles (default ",")
 * @returns {string}
 */
function number_format(number, decimals, dec_point, thousands_sep){
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
        var k = Math.pow(10, prec);
        return '' + (Math.round(n * k) / k).toFixed(prec);
    };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}



/**
 * Idem de la funcion de PHP utf8_decode
 * 
 * @param {String} str_data
 * @returns {String}
 */
function utf8_decode(str_data){
    var tmp_arr = [], i = 0, ac = 0, c1 = 0, c2 = 0, c3 = 0, c4 = 0; str_data += '';
    while (i < str_data.length) {
        c1 = str_data.charCodeAt(i);
        if (c1 <= 191) {
            tmp_arr[ac++] = String.fromCharCode(c1);
            i++;
        } else if (c1 <= 223) {
            c2 = str_data.charCodeAt(i + 1);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
            i += 2;
        } else if (c1 <= 239) {
            c2 = str_data.charCodeAt(i + 1);
            c3 = str_data.charCodeAt(i + 2);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        } else {
            c2 = str_data.charCodeAt(i + 1);
            c3 = str_data.charCodeAt(i + 2);
            c4 = str_data.charCodeAt(i + 3);
            c1 = ((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);
            c1 -= 0x10000;
            tmp_arr[ac++] = String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF));
            tmp_arr[ac++] = String.fromCharCode(0xDC00 | (c1 & 0x3FF));
            i += 4;
        }
    }
    return tmp_arr.join('');
}

/**
 * Devuelve la cadena str con la primer letra de cada palabra en mayúsculas
 * 
 * @param {string} str
 * @returns {string}
 */
ucwords = function(str){
    return ((str + '').toLowerCase())
        .replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function($1) {
            return $1.toUpperCase();
        });
};

/**
 * Devuelve la cadena str con su primer letra en mayúscula
 * 
 * @param {string} str
 * @returns {string}
 */
ucfirst = function(str){
    str += '';
    str = str.toLowerCase();
    var f = str.charAt(0)
        .toUpperCase();
    return f + str.substr(1);
};

/**
 * Scroll de la página hasta la posicion del elemento indicado en element
 * 
 * @param {document element} element        Elemento al cual se quiere llegar con el scroll
 * @param {integer} offset                  valor de desplazamiento desde el elemento (puede ser negativo o positivo y se 
 *                                          indica si se quiere desplazar aun más el scroll, por ejemplo para dejar 200px de margen al 
 *                                          border superior del navegador indicar -200)
 * @returns {undefined}
 */
function scroll_to_element(element, offset){
    if (offset == undefined){
        offset = 0;
    }
    $('html, body').animate({
        scrollTop: $(element).offset().top + offset
    }, 500);
}



// valida si una funcion existe
// return true/false
function is_function(func){
    return typeof window[func] !== 'undefined' && $.isFunction(window[func]);
}

/**
 * Realiza un alert Gritter
 * 
 * @param {string} texto                El texto a mostrar en el alerta
 * @param {string} tipo                 tipo de alerta (success, error, info, warning, default) (error es el valor por defecto)
 * @param {string} titulo               El titulo del alerta (vacio por defecto)
 * @returns {unresolved}
 */
function gritter(texto, tipo, titulo){
    $(".gritter-container").remove();
    if (titulo == undefined){
        titulo = '';
    }    
    if (tipo == undefined){
        tipo = 'error';
    }    
    $.extend($.gritter.options, {
        class_name: 'gritter-' + tipo,
        position: 'bottom-center',
        fade_in_speed: 500,
        fade_out_speed: 400,
        time: 5000,
        _tpl_close: '<span class="gritter-close">x</span>'
    });

    return $.gritter.add({
        title: titulo,
        text: texto,
        sticky: false
    });
}

/**
* Codifica una url
*
* @param {String} str  La url a codificar
* @returns {String}
*/
function urlencode(str) {
   str = (str + '').toString();
   return encodeURIComponent(str)
       .replace(/!/g, '%21')
       .replace(/'/g, '%27')
       .replace(/\(/g, '%28')
       .
   replace(/\)/g, '%29')
       .replace(/\*/g, '%2A')
       .replace(/%20/g, '+');
}

function loading(show){
    if(show){
        $('.loading').show();
        return false;
    }
    $('.loading').hide();
}

function actualizarSesion(flag){
    //multiplicamos por 1000 la fecha unix
    let expiracion = new Date(parseFloat($('#tiempoSesion').data('time'))*1000);
    if(flag){
        expiracion.setMinutes(expiracion.getMinutes() + expiracion.getTimezoneOffset());
    }
    let hours  = expiracion.getHours();
    hours = hours < 10 ? '0'+hours : hours;
    let minutes= expiracion.getMinutes();
    minutes = minutes < 10 ? '0'+minutes : minutes;
    let seconds= expiracion.getSeconds();
    seconds = seconds < 10 ? '0'+seconds : seconds;
    if(hours === "00" && minutes === "00" && seconds === "00"){
        let currLocation = document.location.href;
        currLocation = currLocation.substr(0, currLocation.indexOf('/ventas'));
        document.location.href = currLocation+'/ventas';
    }
    $('#tiempoSesion').data('time', expiracion.getTime()/1000 - 1);
    $('#tiempoSesion').text('TIEMPO DE SESION: '+hours+':'+minutes+':'+seconds);
}

$(document).ready(function(){
    if($('#tiempoSesion').length > 0){
        actualizarSesion(true);
        setInterval('actualizarSesion()', 1000);
    }
});

