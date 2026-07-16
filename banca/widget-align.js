(function () {
  var COMPACT_HEIGHT = 112;
  var MAX_HEIGHT = 480;

  function getSheet(widget) {
    if (!widget.shadowRoot) return null;
    return (
      widget.shadowRoot.querySelector('div[class*="rounded-sheet"]') ||
      widget.shadowRoot.querySelector('div.sheet')
    );
  }

  function alignWidgetOnce(widget) {
    if (!widget.shadowRoot || widget.dataset.aligned === 'true') return false;

    var overlay = widget.shadowRoot.querySelector('div[class*="overlay"]');
    if (!overlay) return false;

    overlay.style.setProperty('justify-content', 'center', 'important');
    overlay.style.setProperty('align-items', 'center', 'important');
    overlay.style.setProperty('inset', '0', 'important');
    overlay.style.setProperty('width', '100%', 'important');
    overlay.style.setProperty('height', '100%', 'important');

    var sheet = getSheet(widget);
    if (sheet) {
      sheet.style.setProperty('margin-left', 'auto', 'important');
      sheet.style.setProperty('margin-right', 'auto', 'important');
    }

    widget.dataset.aligned = 'true';
    return true;
  }

  function measureCompactHeight(widget) {
    var sheet = getSheet(widget);
    if (!sheet) return COMPACT_HEIGHT;

    var measured = Math.ceil(sheet.getBoundingClientRect().height) + 12;
    return Math.min(Math.max(measured, 96), 140);
  }

  function measureActiveHeight(widget) {
    if (!widget.shadowRoot) return COMPACT_HEIGHT;

    var embed = widget.closest('.widget-embed');
    var sheet = getSheet(widget);
    if (!embed || !sheet) return COMPACT_HEIGHT;

    var previousEmbedHeight = embed.style.height;
    var previousWidgetHeight = widget.style.height;

    embed.style.height = MAX_HEIGHT + 'px';
    widget.style.setProperty('height', MAX_HEIGHT + 'px', 'important');
    widget.style.setProperty('min-height', MAX_HEIGHT + 'px', 'important');

    var measured = Math.max(
      COMPACT_HEIGHT,
      Math.ceil(sheet.getBoundingClientRect().height) + 32,
      sheet.scrollHeight + 24
    );
    measured = Math.min(measured, MAX_HEIGHT);

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

  function isActive(widget) {
    return widget.dataset.conversationActive === 'true';
  }

  function setCompact(widget) {
    widget.dataset.conversationActive = 'false';
    setHeight(widget, measureCompactHeight(widget));
  }

  function syncActiveHeight(widget) {
    setHeight(widget, measureActiveHeight(widget));
  }

  function watchSheetSize(widget) {
    if (widget.dataset.resizeObserved === 'true') return;

    var tries = 0;
    var timer = window.setInterval(function () {
      tries += 1;
      if (!getSheet(widget)) {
        if (tries > 50) window.clearInterval(timer);
        return;
      }

      window.clearInterval(timer);
      widget.dataset.resizeObserved = 'true';

      if (typeof ResizeObserver === 'function') {
        var resizeTimer = null;
        new ResizeObserver(function () {
          if (!isActive(widget)) return;
          if (resizeTimer) window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(function () {
            syncActiveHeight(widget);
          }, 120);
        }).observe(getSheet(widget));
      }

      setCompact(widget);
    }, 200);
  }

  function scheduleActiveSync(widget) {
    window.setTimeout(function () { syncActiveHeight(widget); }, 120);
    window.setTimeout(function () { syncActiveHeight(widget); }, 500);
    window.setTimeout(function () { syncActiveHeight(widget); }, 1200);
  }

  function bind(widget) {
    if (!widget || widget.dataset.alignBound === 'true') return;
    widget.dataset.alignBound = 'true';

    var readyTimer = window.setInterval(function () {
      if (!alignWidgetOnce(widget)) return;
      window.clearInterval(readyTimer);
      setCompact(widget);
      watchSheetSize(widget);
    }, 200);

    widget.addEventListener('conversationStarted', function () {
      widget.dataset.conversationActive = 'true';
      scheduleActiveSync(widget);
    });

    widget.addEventListener('conversationEnded', function () {
      window.setTimeout(function () {
        setCompact(widget);
      }, 300);
    });

    widget.addEventListener('click', function () {
      widget.dataset.conversationActive = 'true';
      scheduleActiveSync(widget);
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
