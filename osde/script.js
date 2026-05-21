// Menú móvil
function toggleMenu(){
  var nav=document.querySelector('.navigation-primary');
  if(nav) nav.classList.toggle('open');
}

// Slider del hero (home)
(function(){
  var slides=[].slice.call(document.querySelectorAll('.slide'));
  var dots=[].slice.call(document.querySelectorAll('.slider-dots button'));
  if(!slides.length) return;
  var i=0,timer=null;
  function show(n){
    i=(n+slides.length)%slides.length;
    slides.forEach(function(s,k){s.classList.toggle('active',k===i);});
    dots.forEach(function(d,k){d.classList.toggle('active',k===i);});
  }
  window.slideNext=function(){show(i+1);reset();};
  window.slidePrev=function(){show(i-1);reset();};
  window.slideGo=function(n){show(n);reset();};
  function reset(){clearInterval(timer);timer=setInterval(function(){show(i+1);},5500);}
  show(0);reset();
})();
