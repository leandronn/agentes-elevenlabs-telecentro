
function validar(){
    
    /**
    * Valida que string email tenga un formato correcto
    * 
    * @param {string} email
    * @returns {Boolean}
    */
    this.email = function(email) {
        email = email.toLowerCase();
        re=/^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,3})$/;
        if (!re.exec(email)){
            return false;
        } else {
            return true;
        }
    };
    
    /**
    * Valida que el ingreso actual de un campo sea solo numeros y backspace [onkeypress='return validar.ingresar_numeros(event)']
    * 
    * @param {event} e
    * @returns {Boolean}
    */
    this.ingresar_numeros = function(e){
        var tecla = (document.querySelectorAll("*")) ? e.keyCode : e.which;
       
        
        if (tecla == 8 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 9 ){
            return true;
        }
        if(e.keyCode == 69 || e.key == "E" || e.key == "+" || e.key == "-" || e.keyCode == 45 || e.keyCode == 43){
            return false;
        }
        var patron =/[0-9]/;
        var tecla_final = String.fromCharCode(tecla);
        return patron.test(tecla_final);
    };
    
    /**
    * Verifica que el ingreso solo sean numeros o letras desde la "a" a "z" y desde "A" a "Z"
    * Esta function puede utilizarse, por ejemplo, para la validacion de numeros de pasaportes
    * 
    * @param {type} e
    * @returns {undefined}
    */
    this.ingresar_letras_numeros = function(e){
        return validar.ingresar_numeros(e) || validar.ingresar_letras(e);
    };

    /**
    * Permite el ingreso solo de caracteres de la "a" a "z" y desde "A" a "Z"
    * 
    * @param {type} e
    * @returns {Boolean}
    */
    this.ingresar_letras = function(e){
        var tecla = (document.all) ? e.keyCode : e.which;
        if (tecla == 8 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 46 || e.keyCode == 9){
            return true;
        }
        var patron = /^[a-zA-Z]/;
        var tecla_final = String.fromCharCode(tecla);
        return patron.test(tecla_final);
    };
    
    
    /**
    * Valida que el ingreso actual de un campo sea solo para el ingreso de nombres propios [onkeypress='return validar.ingresar_caracteres(event)']
    * 
    * @param {event} e
    * @returns {Boolean}
    */
    this.ingresar_caracteres_nombre = function(e){    
        var tecla = (document.all) ? e.keyCode : e.which;
        if (tecla == 8 || tecla == 32 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 46 || e.keyCode == 9){
            return true;
        }
        var patron = /^[a-zA-Zá-úÁ-Úà-ùÀ-Ùâ-ûÂ-ÛñÑÇç]/;
        var tecla_final = String.fromCharCode(tecla);
        return patron.test(tecla_final);
    };
    
    /**
    * Valida que el ingreso actual de un campo sean caracteres permitidos en campo email (letras, numeros, @, punto, guion medio y guion bajo) [onkeypress='return validar.ingresar_caracteres(event)']
    * 
    * @param {event} e
    * @returns {Boolean}
    */
    this.ingresar_email = function(e){
        var tecla = (document.all) ? e.keyCode : e.which;
        if (tecla == 8 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 46 || e.keyCode == 9){
            return true;
        }
        var patron = /^[0-9a-zA-Z-.@_]/;
        var tecla_final = String.fromCharCode(tecla);
        return patron.test(tecla_final);
    };

    /**
     * Valida que el ingreso actual del campo sea con paracteres permitidos en un campo numero de teléfono (numero, +, - y espacios)
     * 
     * @param {event} e
     * @returns {Boolean}
     */
    this.ingresar_telefono = function(e){
        var tecla = (document.all) ? e.keyCode : e.which;
        if (tecla == 8 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 46 || e.keyCode == 9){
            return true;
        }
        var patron = /^[0-9-@+ \-]/;
        var tecla_final = String.fromCharCode(tecla);
        return patron.test(tecla_final);
    };


    /**
    * Valida que una fecha sea real (equivalente a su homónima en PHP)
    * 
    * @param {Integer} month       Mes de la fecha
    * @param {Integer} day         Día de la fecha
    * @param {Integer} year        Año de la fecha
    * @returns {Boolean}
    */
    this.checkdate = function(month, day, year){
        if (month != undefined && day != undefined && year != undefined){
            month = parseInt(month);
            day = parseInt(day);
            year = parseInt(year);
            var fecha = new Date(year, month - 1, day);
            return !fecha || fecha.getFullYear() == year && fecha.getMonth() == month -1 && fecha.getDate() == day;
        } else {
            return false;
        }
    };

    /**
    * Valida la combinacion de tipo y numero de documento con sus caracteres
    * 
    * @param {string} tipo
    * @param {string} numero
    * @returns {Boolean}
    */
    this.documento = function(tipo, numero){
        numero = $.trim(numero);
        return (
                (tipo == 'DNI' && numero.length >= 6 &&  numero.length <= 8)
                || (tipo == 'PPTE' && numero.length >= 6 &&  numero.length <= 15)
            );    
    };
    
    /**
    * Valida un password ( al menos 8 caracteres con un numero, una letra mayusculas y una en minuculas)
    * 
    * @param {String} password
    * @returns {Boolean}
    */
    this.password = function(password){
        return password.length > 7 && password.search(/[0-9]/) != -1 &&  password.search(/[A-Z]/) != -1 && password.search(/[a-z]/) != -1;
    };
    
    /**
     * Valida que el ingreso actual de un campo sea solo numeros, backspace y punto [onkeypress='return validar.ingresar_float(event)']
     * 
     * @param {event} e
     * @returns {Boolean}
     */
    this.ingresar_float = function(e){
        var tecla = (document.all) ? e.keyCode : e.which;        
        var especiales = [8, 37, 39, 46, 9];
        if(e.shiftKey || e.altKey){
            return false;
        }
        for(var i in especiales) {
            if(tecla == especiales[i]) {
                return true;
            }
        }
        var patron = /[0-9-.]/;
        var tecla_final = String.fromCharCode(tecla);
        return patron.test(tecla_final);
    };
};

var validar = new validar();
