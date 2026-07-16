(function () {
  var MIN_HEIGHT = 176;
  var MAX_HEIGHT = 480;

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

  function measureNeededHeight(widget) {
    if (!widget.shadowRoot) return MIN_HEIGHT;

    var embed = widget.closest('.widget-embed');
    var overlay = widget.shadowRoot.querySelector('div[class*="overlay"]');
    var sheet =
      widget.shadowRoot.querySelector('div[class*="rounded-sheet"]') ||
      widget.shadowRoot.querySelector('div.sheet');

    if (!embed || !overlay) return MIN_HEIGHT;

    var previousEmbedHeight = embed.style.height;
    var previousWidgetHeight = widget.style.height;

    embed.style.height = MAX_HEIGHT + 'px';
    widget.style.setProperty('height', MAX_HEIGHT + 'px', 'important');
    widget.style.setProperty('min-height', MAX_HEIGHT + 'px', 'important');

    var measured = MIN_HEIGHT;

    if (sheet) {
      measured = Math.max(measured, Math.ceil(sheet.getBoundingClientRect().height) + 48);
      measured = Math.max(measured, sheet.scrollHeight + 40);
    }

    measured = Math.max(measured, Math.ceil(overlay.scrollHeight + 24));
    measured = Math.min(Math.max(measured, MIN_HEIGHT), MAX_HEIGHT);

    embed.style.height = previousEmbedHeight;
    widget.style.height = previousWidgetHeight;

    return measured;
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

  function syncHeight(widget) {
    setHeight(widget, measureNeededHeight(widget));
  }

  function watchSheetSize(widget) {
    if (widget.dataset.resizeObserved === 'true') return;

    var tries = 0;
    var timer = window.setInterval(function () {
      tries += 1;
      if (!widget.shadowRoot) {
        if (tries > 50) window.clearInterval(timer);
        return;
      }

      var sheet =
        widget.shadowRoot.querySelector('div[class*="rounded-sheet"]') ||
        widget.shadowRoot.querySelector('div.sheet');

      if (!sheet) {
        if (tries > 50) window.clearInterval(timer);
        return;
      }

      window.clearInterval(timer);
      widget.dataset.resizeObserved = 'true';

      if (typeof ResizeObserver === 'function') {
        var resizeTimer = null;
        new ResizeObserver(function () {
          if (resizeTimer) window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(function () {
            syncHeight(widget);
          }, 120);
        }).observe(sheet);
      }

      syncHeight(widget);
    }, 200);
  }

  function scheduleSync(widget) {
    window.setTimeout(function () { syncHeight(widget); }, 120);
    window.setTimeout(function () { syncHeight(widget); }, 500);
    window.setTimeout(function () { syncHeight(widget); }, 1200);
  }

  function bind(widget) {
    if (!widget || widget.dataset.alignBound === 'true') return;
    widget.dataset.alignBound = 'true';

    var readyTimer = window.setInterval(function () {
      if (!alignWidgetOnce(widget)) return;
      window.clearInterval(readyTimer);
      setHeight(widget, MIN_HEIGHT);
      watchSheetSize(widget);
    }, 200);

    widget.addEventListener('conversationStarted', function () {
      scheduleSync(widget);
    });

    widget.addEventListener('conversationEnded', function () {
      window.setTimeout(function () {
        syncHeight(widget);
      }, 300);
    });

    widget.addEventListener('click', function () {
      scheduleSync(widget);
    }, true);
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
