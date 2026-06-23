(function(){
  const current = document.body.dataset.page;
  document.querySelectorAll('[data-nav]').forEach(a => {
    if(a.dataset.nav === current) a.classList.add('active');
  });
  document.querySelectorAll('form[data-demo-form]').forEach(form => {
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      const note = this.querySelector('.disabled-note') || document.createElement('div');
      note.className = 'disabled-note';
      note.textContent = 'Demo estática: la búsqueda no consulta datos reales.';
      if(!this.contains(note)) this.appendChild(note);
    });
  });
})();
