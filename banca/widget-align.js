(function () {
  function alignWidget(widget) {
    if (!widget || !widget.shadowRoot) return false;

    var overlay = widget.shadowRoot.querySelector('div[class*="overlay"]');
    if (!overlay) return false;

    overlay.style.setProperty('justify-content', 'center', 'important');
    overlay.style.setProperty('align-items', 'center', 'important');
    overlay.style.setProperty('inset', '0', 'important');
    overlay.style.setProperty('width', '100%', 'important');
    overlay.style.setProperty('height', '100%', 'important');

    var sheet = widget.shadowRoot.querySelector('div[class*="rounded-sheet"]');
    if (sheet) {
      sheet.style.setProperty('margin-left', 'auto', 'important');
      sheet.style.setProperty('margin-right', 'auto', 'important');
    }

    return true;
  }

  function bind(widget) {
    if (!widget || widget.dataset.alignBound === 'true') return;
    widget.dataset.alignBound = 'true';

    var run = function () {
      alignWidget(widget);
    };

    run();

    new MutationObserver(run).observe(widget, {
      childList: true,
      subtree: true,
      attributes: true
    });
  }

  function init() {
    document.querySelectorAll('.widget-embed elevenlabs-convai').forEach(bind);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('load', init);

  var tries = 0;
  var timer = setInterval(function () {
    init();
    tries += 1;
    if (tries > 50) clearInterval(timer);
  }, 200);
})();
