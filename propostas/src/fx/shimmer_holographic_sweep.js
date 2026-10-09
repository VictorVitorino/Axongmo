function fxShimmerSweep(rootEl, opts) {
  opts = opts || {};
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var sel = opts.selector || '.fx-sh-text,.fx-sh-card';
  var delay = opts.delay == null ? 500 : opts.delay, stagger = opts.stagger == null ? 200 : opts.stagger, every = opts.every || 0;
  var els = Array.prototype.slice.call(rootEl.querySelectorAll(sel)), timer = 0, api;
  if (rootEl.matches && rootEl.matches(sel)) els.unshift(rootEl);
  function sweep(el, d) { /* reinicia a animação CSS: remove a classe, força reflow, recoloca */
    if (reduced || !el) return;
    el.style.setProperty('--fx-sh-delay', (d || 0) + 'ms');
    el.classList.remove('fx-sh--go'); void el.offsetWidth; el.classList.add('fx-sh--go');
  }
  function runAll(first) { els.forEach(function (el, i) { sweep(el, (first === true ? delay : 0) + i * stagger); }); }
  function onEnter(ev) { sweep(ev.currentTarget, 0); }
  function stop() {
    if (timer) clearInterval(timer); timer = 0;
    els.forEach(function (el) { el.classList.remove('fx-sh--go'); el.removeEventListener('pointerenter', onEnter); });
    return api;
  }
  function play() {
    stop(); if (reduced) return api;
    runAll(true);
    if (every) timer = setInterval(runAll, Math.max(every, 2500));
    if (opts.hover !== false) els.forEach(function (el) { if (el.classList.contains('fx-sh-card')) el.addEventListener('pointerenter', onEnter); });
    return api;
  }
  api = { play: play, stop: stop, sweep: function (target) { sweep(typeof target === 'number' ? els[target] : target, 0); return api; } };
  return api;
}