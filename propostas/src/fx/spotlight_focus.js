function fxSpotlight(rootEl, opts) {
  opts = Object.assign({ steps: null, shape: 'rect', pad: 14, radius: 16, ring: null, dim: 0.72, soft: 40, delay: 380, interval: 0, followSize: [340, 230], caption: null, onStep: null, auto: true, slide: null }, opts || {});
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)'), M = 3200, E = M + opts.soft, raf = 0, t0 = 0, tmr = 0, capT = 0, mo = null, was = false;
  var cur = { x: 0, y: 0, w: 0, h: 0 }, tgt = { x: 0, y: 0, w: 0, h: 0 }, idx = -1, following = false, lit = null;
  if (getComputedStyle(rootEl).position === 'static') rootEl.style.position = 'relative';
  var ov = document.createElement('div'), hole = document.createElement('div');
  ov.className = 'fx-sp-ov fx-sp-off'; hole.className = 'fx-sp-hole'; ov.setAttribute('aria-hidden', 'true'); ov.appendChild(hole); rootEl.appendChild(ov);
  [['dim', Math.min(opts.dim, 0.8)], ['soft', opts.soft + 'px'], ['radius', opts.radius + 'px'], ['m', M + 'px']].forEach(function (v) { ov.style.setProperty('--fx-sp-' + v[0], v[1]); });
  function list() {
    if (opts.steps) return opts.steps.map(function (s) { return typeof s === 'string' ? rootEl.querySelector(s) : s; }).filter(Boolean);
    return Array.prototype.slice.call(rootEl.querySelectorAll('[data-fx-step]')).sort(function (a, b) { return (+a.getAttribute('data-fx-step') || 0) - (+b.getAttribute('data-fx-step') || 0); });
  }
  /* caixa em px lógicos do rootEl: a cadeia offset* ignora o transform:scale do #stage */
  function box(el) { var x = 0, y = 0, e = el; while (e && e !== rootEl) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; if (e && e !== rootEl) { x += e.clientLeft; y += e.clientTop; } } return { x: x, y: y, w: el.offsetWidth, h: el.offsetHeight }; }
  function full() { var m = opts.soft * 2; return { x: -m, y: -m, w: rootEl.clientWidth + m * 2, h: rootEl.clientHeight + m * 2 }; }
  /* o furo é uma única sombra inset (sem emenda): caixa = área visível + E, spread = M, blur = soft */
  function tick() {
    var k = RM.matches ? 1 : 0.13, moving = false, s = hole.style;
    for (var p in tgt) { var d = tgt[p] - cur[p]; if (Math.abs(d) > 0.4) { cur[p] += d * k; moving = true; } else cur[p] = tgt[p]; }
    s.left = (cur.x - E).toFixed(1) + 'px'; s.top = (cur.y - E).toFixed(1) + 'px'; s.width = (cur.w + 2 * E).toFixed(1) + 'px'; s.height = (cur.h + 2 * E).toFixed(1) + 'px';
    raf = moving ? requestAnimationFrame(tick) : 0;
  }
  function aim(r, shape, ring) {
    for (var p in tgt) tgt[p] = r[p];
    hole.classList.toggle('fx-sp-rect', shape === 'rect');
    ov.classList.toggle('fx-sp-ring', ring != null ? !!ring : shape === 'rect');
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function caption(el) {
    var c = opts.caption, txt = el.getAttribute('data-fx-caption'); if (!c || txt == null) return;
    clearTimeout(capT); c.classList.add('fx-sp-swap');
    capT = setTimeout(function () { c.textContent = txt; c.classList.remove('fx-sp-swap'); }, RM.matches ? 0 : 220);
  }
  function show(el, o) {
    o = o || {}; var L = list();
    if (typeof el === 'number') el = L[Math.max(0, Math.min(el, L.length - 1))]; else if (typeof el === 'string') el = rootEl.querySelector(el);
    if (!el) return false;
    ov.classList.remove('fx-sp-off'); if (lit) lit.classList.remove('fx-sp-lit'); lit = null;
    var shape = o.shape || (el.getAttribute && el.getAttribute('data-fx-shape')) || opts.shape;
    if (!el.nodeType) { aim(el, shape, o.ring); return true; } /* retângulo lógico {x,y,w,h} */
    var b = box(el), pad = o.pad != null ? o.pad : opts.pad, w = b.w + pad * 2, h = b.h + pad * 2;
    if (shape !== 'rect') { w *= 1.42; h *= 1.42; if (shape === 'circle') w = h = Math.max(w, h); }
    lit = el; el.classList.add('fx-sp-lit');
    if (L.indexOf(el) >= 0) idx = L.indexOf(el);
    aim({ x: b.x + b.w / 2 - w / 2, y: b.y + b.h / 2 - h / 2, w: w, h: h }, shape, o.ring);
    caption(el); if (opts.onStep) opts.onStep(idx, el);
    return true;
  }
  function onMove(ev) {
    if (!following) return;
    var r = rootEl.getBoundingClientRect(), k = r.width / rootEl.offsetWidth || 1, s = opts.followSize; /* k = escala do #stage (= rect.width/1600 quando rootEl é o slide) */
    var x = (ev.clientX - r.left) / k - rootEl.clientLeft, y = (ev.clientY - r.top) / k - rootEl.clientTop;
    ov.classList.remove('fx-sp-off'); aim({ x: x - s[0] / 2, y: y - s[1] / 2, w: s[0], h: s[1] }, 'ellipse', false);
  }
  function onLeave() { if (following && idx >= 0) show(idx); }
  rootEl.addEventListener('pointermove', onMove); rootEl.addEventListener('pointerleave', onLeave);
  function manual() { clearInterval(tmr); tmr = 0; following = false; }
  function play() {
    stop(); following = false; idx = -1;
    var f = full(); for (var p in f) cur[p] = tgt[p] = f[p]; tick();
    ov.classList.remove('fx-sp-off');
    t0 = setTimeout(function () {
      show(0);
      if (opts.interval > 0 && !RM.matches) tmr = setInterval(function () { var n = list().length; if (n) show((idx + 1) % n); }, opts.interval);
    }, RM.matches ? 0 : opts.delay);
  }
  function stop() { cancelAnimationFrame(raf); raf = 0; clearTimeout(t0); clearTimeout(capT); clearInterval(tmr); tmr = 0; }
  function clear() { manual(); if (lit) lit.classList.remove('fx-sp-lit'); lit = null; aim(full(), opts.shape, false); ov.classList.add('fx-sp-off'); }
  var sec = opts.slide || rootEl.closest('section, .slide');
  function sync() { var p = sec.classList.contains('play'); if (p && !was) play(); else if (!p && was) stop(); was = p; }
  if (opts.auto && sec) { mo = new MutationObserver(sync); mo.observe(sec, { attributes: true, attributeFilter: ['class'] }); sync(); }
  return {
    play: play, stop: stop, clear: clear,
    focus: function (el, o) { manual(); return show(el, o); },
    next: function () { manual(); return idx < list().length - 1 ? show(idx + 1) : false; },
    prev: function () { manual(); return idx > 0 ? show(idx - 1) : false; },
    follow: function (on) { manual(); following = on !== false; if (!following && idx >= 0) show(idx); },
    destroy: function () { stop(); if (mo) mo.disconnect(); rootEl.removeEventListener('pointermove', onMove); rootEl.removeEventListener('pointerleave', onLeave); if (lit) lit.classList.remove('fx-sp-lit'); ov.remove(); }
  };
}