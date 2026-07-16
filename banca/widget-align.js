(function () {
  var COMPACT_HEIGHT = 176;
  var ACTIVE_HEIGHT = 380;

  function isActiveState(widget) {
    if (!widget.shadowRoot) return false;
    return !!(
      widget.shadowRoot.querySelector('div.sheet.flex') ||
      widget.shadowRoot.querySelector('div[class*="pt-20"]') ||
      widget.shadowRoot.querySelector('button[aria-label="End"]') ||
      widget.shadowRoot.querySelector('button[aria-label="Hang up"]')
    );
  }

  function alignWidget(widget) {
    if (!widget.shadowRoot) return false;

    var overlay = widget.shadowRoot.querySelector('div[class*="overlay"]');
    if (!overlay) return false;

    overlay.style.setProperty('justify-content', 'center', 'important');
    overlay.style.setProperty('align-items', 'center', 'important');
    overlay.style.setProperty('inset', '0', 'important');
    overlay.style.setProperty('width', '100%', 'important');
    overlay.style.setProperty('height', '100%', 'important');

    var sheet =
      widget.shadowRoot.querySelector('div[class*="rounded-sheet"]') ||
      widget.shadowRoot.querySelector('div.sheet');

    if (sheet) {
      sheet.style.setProperty('margin-left', 'auto', 'important');
      sheet.style.setProperty('margin-right', 'auto', 'important');
    }

    return true;
  }

  function resizeWidget(widget) {
    var embed = widget.closest('.widget-embed');
    if (!embed) return false;

    var height = isActiveState(widget) ? ACTIVE_HEIGHT : COMPACT_HEIGHT;

    embed.style.height = height + 'px';
    widget.style.setProperty('height', height + 'px', 'important');
    widget.style.setProperty('min-height', height + 'px', 'important');

    return true;
  }

  function syncWidget(widget) {
    if (!widget.shadowRoot) return;
    alignWidget(widget);
    resizeWidget(widget);
  }

  function bind(widget) {
    if (!widget || widget.dataset.alignBound === 'true') return;
    widget.dataset.alignBound = 'true';

    var scheduled = false;
    var run = function () {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () {
        scheduled = false;
        syncWidget(widget);
      });
    };

    run();

    new MutationObserver(run).observe(widget, {
      childList: true,
      subtree: true
    });

    var shadowTimer = setInterval(function () {
      if (!widget.shadowRoot) return;
      clearInterval(shadowTimer);
      new MutationObserver(run).observe(widget.shadowRoot, {
        childList: true,
        subtree: true
      });
      run();
    }, 100);

    widget.addEventListener('conversationStarted', run);
    widget.addEventListener('conversationEnded', run);
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
    document.querySelectorAll('.widget-embed elevenlabs-convai').forEach(syncWidget);
    tries += 1;
    if (tries > 40) clearInterval(timer);
  }, 250);
})();
