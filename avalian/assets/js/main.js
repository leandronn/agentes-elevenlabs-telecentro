/* global validar, BASE_URL, recaptcha_key, grecaptcha */

$(document).ready(function () {

  
    var myCarous = document.querySelector('#carouselExampleFade')
    var carousel = new bootstrap.Carousel(myCarous, {
    interval: 2000,
    touch: false,
    keyboard: false,
    wrap: false,
    pause: false
    })

  //Function to animate slider captions
  (function ($) {
    function doAnimations(elems) {
      var animEndEv = "webkitAnimationEnd animationend";

      elems.each(function () {
        var $this = $(this),
          $animationType = $this.data("animation");
        $this.addClass($animationType).one(animEndEv, function () {
          $this.removeClass($animationType);
        });
      });
    }

    var $myCarousel = $("#carousel-example-generic"),
      $firstAnimatingElems = $myCarousel
        .find(".item:first")
        .find("[data-animation ^= 'animated']");

    doAnimations($firstAnimatingElems);

    $myCarousel.on("slide.bs.carousel", function (e) {
      var $animatingElems = $(e.relatedTarget).find(
        "[data-animation ^= 'animated']"
      );
      doAnimations($animatingElems);
    });

    $("#sliderHome").carousel({
      interval: 50000,
    });
  })(jQuery);

  $("main.novedades-ampliada .container")
    .find("p")
    .css({ "margin-left": 0, "margin-right": 0 });
});
$('.sliderNovedades').owlCarousel({
    stagePadding: 120,
    dots: false,
    loop: false,
    nav: true,
    margin: 0,
    responsive: {
        0: {
            items: 1,
            stagePadding: 50,
            loop: false,
        },
        700: {
            items: 2,
            stagePadding: 80,
            loop: false,
        },
        1100: {
            items: 3,
            loop: true
        }
    }
})

//menu
$("#nav-icon").click(function () {
  $(this).toggleClass("open");
});

$("#navbarDropdown").click(function () {
  $("#navbarDropdown").toggleClass("home_menu active");
});
$(".dropdown-item").click(function () {
  $("#navbarDropdown").removeClass("home_menu active");
});
//form label effect
(function ($) {
  $(".form-control").focus(function () {
    $(this).parent().addClass("filled");
  }),
    $("input, textarea, select").focusout(function () {
      (tmpval = $(this).val()),
        "" == tmpval && $(this).parent().removeClass("filled");
    });
})(jQuery);

//form:modulo2
(function ($) {
  $(document).ready(function () {
    $(".toggleButton").click(function () {
      $("#container_results").css("display", "none")
      if ($(".localidad").is(":checked")) {
        $("#cercania").removeClass("active");
        $("#localidad").addClass("active");
      } else if ($(".cercania").is(":checked")) {
        $("#localidad").removeClass("active");
        $("#cercania").addClass("active");
      }
    });

    //reload gif

    $(".a-tab.centros").click(function () {
      var src = $(".centros-img").data("src-img");
      $(".centros-img").attr("src", src + "?a=" + Math.random());
    });
    $(".a-tab.cartilla").click(function () {
      var src = $(".cartilla-img").data("src-img");
      $(".cartilla-img").attr("src", src + "?a=" + Math.random());
    });
    $(".a-tab.planes").click(function () {
      var src = $(".planes-img").data("src-img");
      $(".planes-img").attr("src", src + "?a=" + Math.random());
    });
  });

  $(window).on("load resize", function () {
    windowWidth = $(document).width();
    if (windowWidth > 991) {
      $("#centros.collapse").collapse("show");
      $(".inner-centros #cartilla.collapse").collapse("show");
      $("#cartilla").on("hidden.bs.collapse", function (e) {
        $("#cartilla.collapse").collapse("show");
      });
      $("#centros").on("hidden.bs.collapse", function (e) {
        $("#centros.collapse").collapse("show");
      });
      $("#planes").on("hidden.bs.collapse", function (e) {
        $("#planes.collapse").collapse("show");
      });
    }
  });
})(jQuery);

//planes

(function ($) {
  $(document).ready(function () {
    $(".collapse-planes").on("shown.bs.collapse", function () {
      var result = $(".inner-planes")
        .find(".plan[aria-expanded='true']")
        .next();
      $("html, body").animate({ scrollTop: $(result).offset().top - 50 }, 500);
    });
  });
})(jQuery);

//contacto
(function ($) {
  $("#socio").addClass("d-block");
  $("#area").on("change", function () {
    var areaSeleccionada = "#" + this.value;
    $(".formContacto").removeClass("d-block");
    $("form").find(areaSeleccionada).addClass("d-block");
  });
})(jQuery);

//validate form
(function ($) {
  $("#btn_suscripcion_news").on("click", function () {
    $("#btn_suscripcion_news").prop("disabled", true);
    var email = $("#suscribite").val();
    if (validar.email(email)) {
      $.ajax({
        url: BASE_URL + "xhr/contactos.php",
        type: "POST",
        dataType: "json",
        data: {
          accion: "register_news_letter",
          email: email,
        },
        success: function (_json) {
          if (_json.success) {
            $("#suscribite").val("");
            gritter(
              "Gracias por suscribirte a nuestro News Letter.<br>En breve recibirás toda la información de tu interés",
              "success"
            );
          } else if (_json.msg) {
            gritter(_json.msg.join("<br>"));
            $("#btn_suscripcion_news").prop("disabled", false);
          } else {
            gritter(
              "En estos momentos no es posible procesar su solicitud.<br>Vuelava a intentar más tarde"
            );
            $("#btn_suscripcion_news").prop("disabled", false);
          }
        },
        error: function () {
          gritter(
            "En estos momentos no es posible procesar su solicitud.<br>Vuelava a intentar más tarde"
          );
          $("#btn_suscripcion_news").prop("disabled", false);
        },
      });
    } else {
      gritter("El <b>Email</b> ingresado no es válido");
      $("#btn_suscripcion_news").prop("disabled", false);
    }
  });
})(jQuery);

function reset_recaptcha() {
  if (recatcha_token != null) {
    grecaptcha
      .execute(recaptcha_key, { action: "homepage" })
      .then(function (token) {
        recatcha_token = token;
      });
  }
}
