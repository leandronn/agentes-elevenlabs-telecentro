/* ============================================================
   Banco Macro - Shell compartido (header + footer + scripts)
   Cada página define <body data-page="home|personas|jubilados|ayuda">
   y deja vacíos los contenedores #site-header y #site-footer.
   Los links externos quedan en "#"; la navegación entre páginas
   locales sí apunta a los .html.
   ============================================================ */
(function () {
  var CDN = "https://d18sfile8nklfm.cloudfront.net"; // solo para imágenes
  var WWW = "https://www.macro.com.ar";               // solo para imágenes

  var NAV = [
    { label: "Inicio", href: "index.html", key: "home" },
    { label: "Personas", href: "personas.html", key: "personas" },
    { label: "Jubilados", href: "jubilados.html", key: "jubilados" },
    { label: "Ayuda", href: "ayuda.html", key: "ayuda" }
  ];

  var page = document.body.getAttribute("data-page") || "home";

  function navLinks(cls) {
    return NAV.map(function (n) {
      var active = n.key === page ? " active" : "";
      return '<a class="' + (cls || "") + active + '" href="' + n.href + '">' + n.label + "</a>";
    }).join("");
  }

  /* ---------- HEADER ---------- */
  var header =
    '<header>' +
      '<div class="mobile-bar">' +
        '<button class="hamb" id="hambBtn" aria-label="menu"><span></span><span></span><span></span></button>' +
        '<a class="logo-min" href="index.html"><img src="' + CDN + '/imagen/macrologoheader2025alternativo/logoheader_macro.svg" alt="Banco Macro"></a>' +
        '<a class="turno-round" href="#"><img src="' + WWW + '/imagen/icono_header_calendario/icon_calendario_header.svg" alt="Turnos"></a>' +
      '</div>' +
      '<div class="mobile-menu" id="mobileMenu">' +
        navLinks("") +
      '</div>' +
      '<div class="top-bar"><div class="container">' +
        '<div class="top-left">' +
          '<a class="logo-min" href="index.html"><img src="' + CDN + '/imagen/macrologoheader2025alternativo/logoheader_macro.svg" alt="Banco Macro"></a>' +
          '<a class="btn-outline" href="#">Para vos</a>' +
          '<a class="btn-outline" href="#">Para tu Negocio</a>' +
        '</div>' +
        '<div class="top-links">' +
          '<span><img src="' + CDN + '/imagen/ico_contactanos/icono_contacto_bm.svg" alt=""><a href="#">Contactanos</a></span>' +
          '<span class="sep">|</span>' +
          '<span><img src="' + CDN + '/imagen/icoubicanos/icono_mapa1_bm.svg" alt=""><a href="#">Cajeros y Sucursales</a></span>' +
          '<span class="sep">|</span>' +
          '<span><img src="' + CDN + '/imagen/icono_header_agenda/icon_turnos.svg" alt=""><a href="#">Turnos Online</a></span>' +
        '</div>' +
        '<div class="bi-wrap">' +
          '<button class="bi-btn"><img src="' + CDN + '/imagen/icono_bi.png" alt="BI"><span>BANCA<br>INTERNET</span></button>' +
          '<div class="bi-menu"><a href="#">Personas</a><hr><a href="#">Empresas</a></div>' +
        '</div>' +
      '</div></div>' +
      '<div class="brand-bar"><div class="container">' +
        '<a class="brand-logo" href="index.html"><img src="' + CDN + '/imagen/macrologoheader2025alternativo/logoheader_macro.svg" alt="Macro siempre cerca tuyo"></a>' +
        '<nav class="main-nav">' + navLinks("") + '</nav>' +
      '</div></div>' +
    '</header>';

  /* ---------- FOOTER ---------- */
  var footer =
    '<footer>' +
      '<div class="foot-social"><div class="container">' +
        '<div class="foot-cajeros"><a href="#"><img src="' + WWW + '/imagen/icoubicanos/icono_mapa1_bm.svg" alt=""><span>Cajeros y sucursales</span></a></div>' +
        '<div class="foot-redes"><ul>' +
          '<li><a href="#"><img src="' + WWW + '/imagen/icon-tiktok.svg" alt="TikTok"></a></li>' +
          '<li><a href="#"><img src="' + WWW + '/imagen/icon-fb.svg" alt="Facebook"></a></li>' +
          '<li><a href="#"><img src="' + WWW + '/imagen/icon-youtube.svg" alt="YouTube"></a></li>' +
          '<li><a href="#"><img src="' + WWW + '/imagen/icon-instagram.svg" alt="Instagram"></a></li>' +
        '</ul></div>' +
      '</div></div>' +
      '<div class="foot-menu"><div class="container"><ul>' +
        '<li><a href="#">Canales de Atención</a></li>' +
        '<li><a href="#">Proveedores del Banco</a></li>' +
        '<li><a href="#"><strong>Libro de quejas online</strong></a></li>' +
        '<li><a href="#"><strong>Botón de Arrepentimiento</strong></a></li>' +
        '<li><a href="#"><strong>Hacé un reclamo en Defensa del Consumidor/a aquí</strong></a></li>' +
      '</ul></div></div>' +
      '<div class="foot-info"><div class="container"><div class="cols">' +
        '<div><h3>INFORMACIÓN AL USUARIO DE SERVICIOS FINANCIEROS</h3><div class="links">' +
          '<a href="#">Atención al usuario de Servicios Financieros</a>' +
          '<a href="#">Comparación de comisiones de otros bancos</a>' +
          '<a href="#">Tasas de plazo fijo en pesos y dólares</a>' +
          '<a href="#">Contratos de adhesión – Ley 24.240</a>' +
          '<a href="#">SEGUROS</a>' +
          '<a href="#">Tasas por financiamiento de Tarjetas de Crédito</a>' +
          '<a href="#">Cuenta Gratuita Universal</a>' +
          '<a href="#">Proconsumer - Seguro de cajero</a>' +
        '</div></div>' +
        '<div><h3>INFORMACIÓN IMPORTANTE</h3><div class="links">' +
          '<a href="#">Mapa del Sitio</a>' +
          '<a href="#">Transparencia</a>' +
          '<a href="#">Comisiones - cargos</a>' +
          '<a href="#">Materiales de exposición obligatoria</a>' +
          '<a href="#">Nuestros Términos y Condiciones</a>' +
          '<a href="#">Política de Privacidad de App Macro</a>' +
          '<a href="#">Comisiones Banca Empresas</a>' +
          '<a href="#">Situación Impositiva</a>' +
        '</div></div>' +
      '</div></div></div>' +
      '<div class="foot-copy"><div class="container"><div>© Copyright 2026 Banco Macro S.A. Todos los derechos reservados - ALyC y AN Integral, registrado bajo el Nro. 27 de la CNV. AC registrado bajo el Nro. 8 de la CNV</div></div></div>' +
    '</footer>';

  /* ---------- INYECTAR ---------- */
  function inject(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }
  inject("site-header", header);
  inject("site-footer", footer);

  /* ---------- MENU MOBILE ---------- */
  var hamb = document.getElementById("hambBtn");
  if (hamb) {
    hamb.addEventListener("click", function () {
      document.getElementById("mobileMenu").classList.toggle("open");
    });
  }

  /* ---------- ACTIVE DEL MENU (al hacer click) ---------- */
  function wireActive(nodeList) {
    var links = Array.prototype.slice.call(nodeList);
    links.forEach(function (a) {
      a.addEventListener("click", function (e) {
        if (a.getAttribute("href") === "#") e.preventDefault();
        links.forEach(function (x) { x.classList.remove("active"); });
        a.classList.add("active");
      });
    });
  }
  // Solo los ítems de navegación (excluye botones "Para vos" / "Para tu Negocio")
  wireActive(document.querySelectorAll(".main-nav a:not(.btn-navy):not(.btn-tonal)"));
  wireActive(document.querySelectorAll("#mobileMenu > a"));

  /* ---------- HERO CAROUSEL (si existe) ---------- */
  var heroTrack = document.getElementById("heroTrack");
  if (heroTrack) {
    var slides = heroTrack.children, total = slides.length, idx = 0, timer;
    var dotsWrap = document.getElementById("heroDots");
    if (dotsWrap) {
      for (var i = 0; i < total; i++) {
        var b = document.createElement("button");
        b.dataset.i = i;
        b.addEventListener("click", function () { go(+this.dataset.i); });
        dotsWrap.appendChild(b);
      }
    }
    var dots = dotsWrap ? dotsWrap.children : [];
    function render() {
      heroTrack.style.transform = "translateX(-" + (idx * 100) + "%)";
      for (var i = 0; i < dots.length; i++) dots[i].classList.toggle("active", i === idx);
    }
    function go(n) { idx = (n + total) % total; render(); reset(); }
    function next() { go(idx + 1); }
    function prev() { go(idx - 1); }
    var hn = document.getElementById("heroNext"), hp = document.getElementById("heroPrev");
    if (hn) hn.addEventListener("click", next);
    if (hp) hp.addEventListener("click", prev);
    function reset() { clearInterval(timer); timer = setInterval(next, 6000); }
    render(); reset();
  }

  /* ---------- ACCESOS CAROUSEL (si existe) ---------- */
  var accTrack = document.getElementById("accTrack");
  if (accTrack) {
    var cards = accTrack.children, pos = 0, atimer;
    function step() { return cards[0].getBoundingClientRect().width + 10; }
    function perView() {
      var vw = accTrack.parentElement.getBoundingClientRect().width;
      return Math.max(1, Math.round(vw / step()));
    }
    function clamp() {
      var max = cards.length - perView();
      if (pos > max) pos = 0;
      if (pos < 0) pos = Math.max(0, max);
    }
    function arender() { accTrack.style.transform = "translateX(-" + (pos * step()) + "px)"; }
    function anext() { pos++; clamp(); arender(); areset(); }
    function aprev() { pos--; clamp(); arender(); areset(); }
    var an = document.getElementById("accNext"), ap = document.getElementById("accPrev");
    if (an) an.addEventListener("click", anext);
    if (ap) ap.addEventListener("click", aprev);
    function areset() { clearInterval(atimer); atimer = setInterval(anext, 2500); }
    window.addEventListener("resize", function () { clamp(); arender(); });
    arender(); areset();
  }
})();
