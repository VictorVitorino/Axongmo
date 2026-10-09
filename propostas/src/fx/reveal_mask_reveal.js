function fxMaskReveal(rootEl, opts) {
  opts = Object.assign({ mask: 'inset', stagger: 140, delay: 160, duration: 0, selector: '[data-fx-reveal]', once: false, onDone: null }, opts || {});
  var DUR = { inset: 650, circle: 800, polygon: 720 }, raf = 0, t0 = 0, played = false, done = [];
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var blocks = Array.prototype.slice.call(rootEl.querySelectorAll(opts.selector)).map(function (el, i) {
    return {
      el: el, o: el.dataset.fxOrder != null ? +el.dataset.fxOrder : i, m: el.dataset.fxMask || opts.mask,
      bleed: +(el.dataset.fxBleed || 0), y: el.dataset.fxDir === 'y',
      zoom: el.hasAttribute('data-fx-zoom') ? (el.querySelector('img,svg,canvas,video') || el.firstElementChild) : null
    };
  }).sort(function (a, b) { return a.o - b.o; });
  function outCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function clip(k, e) {
    var el = k.el;
    if (k.m === 'circle') return 'circle(' + (e * 142).toFixed(2) + '% at ' + (el.dataset.fxOrigin || '50% 50%') + ')';
    if (k.m === 'polygon') { var a = e * 200; return 'polygon(0 0,' + a.toFixed(2) + '% 0,' + (a - 100).toFixed(2) + '% 100%,0 100%)'; }
    var b = (e * k.bleed).toFixed(1) + 'px', c = 'calc(' + ((1 - e) * 100).toFixed(2) + '% - ' + b + ')', n = '-' + b;
    var r = el.dataset.fxRound ? ' round ' + el.dataset.fxRound : '';
    return k.y ? 'inset(' + c + ' ' + n + ' ' + n + ' ' + n + r + ')' : 'inset(' + n + ' ' + c + ' ' + n + ' ' + n + r + ')';
  }
  function set(k, e) {
    var s = k.el.style, f = 1 - e;
    if (e >= 1) {
      s.clipPath = ''; s.webkitClipPath = ''; s.translate = ''; s.scale = '';
      k.el.classList.add('is-revealed');
    } else {
      var c = clip(k, e); s.clipPath = c; s.webkitClipPath = c; k.el.classList.remove('is-revealed');
      if (k.m === 'circle') s.scale = (1.04 - 0.04 * e).toFixed(4);
      else if (k.m === 'polygon') s.translate = (f * -8).toFixed(2) + 'px ' + (f * 6).toFixed(2) + 'px';
      else s.translate = k.y ? '0 ' + (f * 14).toFixed(2) + 'px' : (f * -10).toFixed(2) + 'px 0';
    }
    if (k.zoom) k.zoom.style.scale = e >= 1 ? '' : (1.12 - 0.12 * e).toFixed(4);
    s.setProperty('--fx-rv-e', e.toFixed(4));
    s.setProperty('--fx-rv-o', e >= 1 || e <= 0 ? '0' : Math.sin(Math.PI * e).toFixed(3));
  }
  function tick(now) {
    if (!t0) t0 = now;
    var t = now - t0, pending = false;
    blocks.forEach(function (k, i) {
      if (done[i]) return;
      var p = (t - opts.delay - i * opts.stagger) / (opts.duration || DUR[k.m] || 700);
      if (p >= 1) { set(k, 1); done[i] = true; } else { pending = true; if (p > 0) set(k, outCubic(p)); }
    });
    if (pending) raf = requestAnimationFrame(tick);
    else { raf = 0; if (opts.onDone) opts.onDone(); }
  }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }
  function reset() { stop(); done = []; blocks.forEach(function (k) { set(k, 0); }); }
  function show() { stop(); blocks.forEach(function (k, i) { set(k, 1); done[i] = true; }); }
  function play() {
    if (mq.matches || (opts.once && played)) return show();
    played = true; reset(); t0 = 0; raf = requestAnimationFrame(tick);
  }
  rootEl.classList.add('fx-rv');
  if (!mq.matches) rootEl.classList.add('fx-rv-armed');
  return { play: play, stop: stop, reset: reset, show: show };
}