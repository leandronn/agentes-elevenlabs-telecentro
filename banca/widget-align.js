(function () {
  var COMPACT_HEIGHT = 176;
  var ACTIVE_HEIGHT = 380;

  function alignWidgetOnce(widget) {
    if (!widget.shadowRoot || widget.dataset.aligned === 'true') return false;

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

    widget.dataset.aligned = 'true';
    return true;
  }

  function setHeight(widget, height) {
    var embed = widget.closest('.widget-embed');
    if (!embed) return;

    var key = String(height);
    if (widget.dataset.currentHeight === key) return;

    widget.dataset.currentHeight = key;
    embed.style.height = key + 'px';
    widget.style.setProperty('height', key + 'px', 'important');
    widget.style.setProperty('min-height', key + 'px', 'important');
  }

  function waitForWidgetReady(widget, callback) {
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (alignWidgetOnce(widget)) {
        clearInterval(timer);
        setHeight(widget, COMPACT_HEIGHT);
        callback();
        return;
      }
      if (tries > 50) clearInterval(timer);
    }, 200);
  }

  function bind(widget) {
    if (!widget || widget.dataset.alignBound === 'true') return;
    widget.dataset.alignBound = 'true';

    waitForWidgetReady(widget, function () {});

    widget.addEventListener('conversationStarted', function () {
      window.setTimeout(function () {
        setHeight(widget, ACTIVE_HEIGHT);
      }, 500);
    });

    widget.addEventListener('conversationEnded', function () {
      setHeight(widget, COMPACT_HEIGHT);
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
})();
