(function () {
  var MIN_HEIGHT = 176;
  var MAX_HEIGHT = 520;

  function alignWidget(widget) {
    if (!widget || !widget.shadowRoot) return false;

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

  function measureWidgetHeight(widget, embed) {
    var overlay = widget.shadowRoot.querySelector('div[class*="overlay"]');
    if (!overlay) return MIN_HEIGHT;

    var previousEmbedHeight = embed.style.height;
    var previousWidgetHeight = widget.style.height;

    embed.style.height = MAX_HEIGHT + 'px';
    widget.style.setProperty('height', MAX_HEIGHT + 'px', 'important');
    widget.style.setProperty('min-height', MAX_HEIGHT + 'px', 'important');

    var measured = MIN_HEIGHT;
    var nodes = [overlay].concat(Array.from(overlay.querySelectorAll('div, button')));

    nodes.forEach(function (node) {
      var rect = node.getBoundingClientRect();
      if (rect.height < 8) return;
      measured = Math.max(measured, Math.ceil(rect.bottom - overlay.getBoundingClientRect().top) + 20);
      measured = Math.max(measured, node.scrollHeight + 20);
    });

    measured = Math.max(measured, Math.ceil(overlay.scrollHeight + 20));
    measured = Math.min(Math.max(measured, MIN_HEIGHT), MAX_HEIGHT);

    embed.style.height = previousEmbedHeight;
    widget.style.height = previousWidgetHeight;

    return measured;
  }

  function resizeWidget(widget) {
    var embed = widget.closest('.widget-embed');
    if (!embed || !widget.shadowRoot) return false;

    var height = measureWidgetHeight(widget, embed);

    embed.style.height = height + 'px';
    widget.style.setProperty('height', height + 'px', 'important');
    widget.style.setProperty('min-height', height + 'px', 'important');

    return true;
  }

  function syncWidget(widget) {
    if (!alignWidget(widget)) return false;
    return resizeWidget(widget);
  }

  function observeShadow(widget, run) {
    if (!widget.shadowRoot || widget.dataset.shadowObserved === 'true') return;
    widget.dataset.shadowObserved = 'true';

    new MutationObserver(run).observe(widget.shadowRoot, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true
    });
  }

  function bind(widget) {
    if (!widget) return;

    var run = function () {
      if (!widget.shadowRoot) return;
      observeShadow(widget, run);
      syncWidget(widget);
    };

    run();

    if (widget.dataset.alignBound === 'true') return;
    widget.dataset.alignBound = 'true';

    new MutationObserver(run).observe(widget, {
      childList: true,
      subtree: true,
      attributes: true
    });

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
  window.addEventListener('resize', init);

  var tries = 0;
  var timer = setInterval(function () {
    init();
    tries += 1;
    if (tries > 80) clearInterval(timer);
  }, 250);
})();
