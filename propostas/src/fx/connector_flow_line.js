function fxConnector(rootEl, opts) {
  opts = Object.assign({ edges: null, delay: 250, stagger: 260, dur: 650, dots: 1, speed: 120, curve: 0.5, dim: true, arrows: true, hover: true, auto: true, slide: null }, opts || {});
  var NS = 'http://www.w3.org/2000/svg', RM = window.matchMedia('(prefers-reduced-motion: reduce)');
  var uid = 'fxcf' + Math.random().toString(36).slice(2, 8), raf = 0, last = 0, timers = [], E = [], pinned = null, mo = null, was = false;
  var edges = opts.edges || JSON.parse(rootEl.getAttribute('data-fx-edges') || '[]');
  if (getComputedStyle(rootEl).position === 'static') rootEl.style.position = 'relative';
  rootEl.classList.add('fx-cf'); rootEl.classList.toggle('fx-cf-dim', opts.dim && !RM.matches);
  var svg = mk('svg', { 'class': 'fx-cf-svg', 'aria-hidden': 'true' }); rootEl.insertBefore(svg, rootEl.firstChild);
  function mk(tag, a, parent) { var el = document.createElementNS(NS, tag); for (var k in a) el.setAttribute(k, a[k]); if (parent) parent.appendChild(el); return el; }
  function nodes() { return Array.prototype.slice.call(rootEl.querySelectorAll('[data-fx-node]')); }
  function node(id) { return rootEl.querySelector('[data-fx-node="' + id + '"]'); }
  /* caixa em px lógicos do rootEl: a cadeia offset* ignora o transform:scale do #stage e transforms de entrada (Reveal etc.) */
  function box(el) { var x = 0, y = 0, e = el; while (e && e !== rootEl) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; if (e && e !== rootEl) { x += e.clientLeft; y += e.clientTop; } } return { x: x, y: y, w: el.offsetWidth, h: el.offsetHeight }; }
  function pt(x, y) { return x.toFixed(1) + ' ' + y.toFixed(1); }
  function pathFor(a, b) {
    var ax = a.x + a.w / 2, ay = a.y + a.h / 2, bx = b.x + b.w / 2, by = b.y + b.h / 2, s, p1, p2, c;
    if (Math.abs(bx - ax) >= Math.abs(by - ay)) { s = bx > ax ? 1 : -1; p1 = ax + s * a.w / 2; p2 = bx - s * b.w / 2; c = (p2 - p1) * opts.curve; return 'M' + pt(p1, ay) + ' C' + pt(p1 + c, ay) + ',' + pt(p2 - c, by) + ',' + pt(p2, by); }
    s = by > ay ? 1 : -1; p1 = ay + s * a.h / 2; p2 = by - s * b.h / 2; c = (p2 - p1) * opts.curve;
    return 'M' + pt(ax, p1) + ' C' + pt(ax, p1 + c) + ',' + pt(bx, p2 - c) + ',' + pt(bx, p2);
  }
  function build() {
    svg.innerHTML = ''; E = [];
    svg.setAttribute('width', rootEl.clientWidth); svg.setAttribute('height', rootEl.clientHeight);
    var defs = mk('defs', {}, svg), gE = mk('g', {}, svg);
    ['', 'h'].forEach(function (s) { mk('path', { d: 'M0 0L10 5 0 10z', 'class': 'fx-cf-arr' + s }, mk('marker', { id: uid + s, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 5, markerHeight: 5, orient: 'auto' }, defs)); });
    edges.forEach(function (ed) {
      var A = node(ed[0]), B = node(ed[1]); if (!A || !B) return;
      var d = pathFor(box(A), box(B)), g = mk('g', { 'class': 'fx-cf-e' }, gE), base = mk('path', { d: d, 'class': 'fx-cf-base' }, g), dots = [];
      mk('path', { d: d, 'class': 'fx-cf-flow' }, g);
      for (var k = 0; k < opts.dots; k++) dots.push({ el: mk('circle', { r: 5, 'class': 'fx-cf-dot', visibility: 'hidden' }, g), u: (k + 0.5) / opts.dots });
      E.push({ a: ed[0], b: ed[1], A: A, B: B, g: g, base: base, len: base.getTotalLength(), dots: dots, t: ed[2], live: false });
    });
  }
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function mark(e) { if (opts.arrows && e.live) e.base.setAttribute('marker-end', 'url(#' + uid + (e.g.classList.contains('fx-cf-hot') ? 'h' : '') + ')'); }
  function arrive(e) { e.live = true; e.g.classList.add('fx-cf-drawn'); e.A.classList.add('fx-cf-on'); e.B.classList.add('fx-cf-on'); mark(e); }
  function play() {
    stop(); build(); pinned = null; setHot(null);
    var rm = RM.matches, end = 0;
    rootEl.classList.toggle('fx-cf-dim', opts.dim && !rm);
    nodes().forEach(function (n) { n.classList.remove('fx-cf-on'); });
    E.forEach(function (e, i) {
      var L = e.len.toFixed(1), t0 = e.t != null ? e.t : opts.delay + i * opts.stagger;
      e.base.style.strokeDasharray = L; e.base.style.strokeDashoffset = rm ? '0' : L;
      if (rm) return arrive(e);
      end = Math.max(end, t0 + opts.dur);
      later(function () { e.A.classList.add('fx-cf-on'); e.base.getBoundingClientRect(); e.base.style.transition = 'stroke-dashoffset ' + opts.dur + 'ms cubic-bezier(.22,.61,.36,1)'; e.base.style.strokeDashoffset = '0'; }, t0);
      later(function () { arrive(e); }, t0 + opts.dur);
    });
    later(function () { nodes().forEach(function (n) { n.classList.add('fx-cf-on'); }); }, rm ? 0 : end + 150);
    raf = requestAnimationFrame(tick);
  }
  function tick(t) {
    var rm = RM.matches, dt = last ? Math.min(t - last, 50) : 16; last = t;
    E.forEach(function (e) {
      if (!e.live) return;
      var sp = (e.g.classList.contains('fx-cf-hot') ? 1.8 : 1) * opts.speed / e.len;
      e.dots.forEach(function (d) {
        if (!rm) d.u = (d.u + dt / 1000 * sp) % 1;
        var p = e.base.getPointAtLength(d.u * e.len), c = d.el;
        c.setAttribute('cx', p.x.toFixed(1)); c.setAttribute('cy', p.y.toFixed(1)); c.setAttribute('visibility', 'visible'); c.setAttribute('opacity', Math.min(1, Math.sin(d.u * Math.PI) * 4).toFixed(2));
      });
    });
    raf = rm ? 0 : requestAnimationFrame(tick);
  }
  function setHot(id) {
    rootEl.classList.toggle('fx-cf-focus', !!id);
    E.forEach(function (e) { e.g.classList.toggle('fx-cf-hot', !!id && (e.a === id || e.b === id)); mark(e); });
    nodes().forEach(function (n) {
      var k = n.getAttribute('data-fx-node'); n.classList.toggle('fx-cf-hot', k === id);
      n.classList.toggle('fx-cf-near', !!id && k !== id && E.some(function (e) { return (e.a === id && e.b === k) || (e.b === id && e.a === k); }));
    });
  }
  function idOf(ev) { var n = ev.target.closest ? ev.target.closest('[data-fx-node]') : null; return n && rootEl.contains(n) ? n.getAttribute('data-fx-node') : null; }
  function onOver(ev) { if (!pinned) setHot(idOf(ev)); }
  function onLeave() { if (!pinned) setHot(null); }
  function onClick(ev) { var id = idOf(ev); if (id) ev.stopPropagation(); pinned = id && pinned !== id ? id : null; setHot(pinned); }
  if (opts.hover) { rootEl.addEventListener('pointerover', onOver); rootEl.addEventListener('pointerleave', onLeave); rootEl.addEventListener('click', onClick); }
  function stop() { cancelAnimationFrame(raf); raf = 0; last = 0; timers.forEach(clearTimeout); timers = []; }
  var sec = opts.slide || rootEl.closest('section, .slide');
  function sync() { var p = sec.classList.contains('play'); if (p && !was) play(); else if (!p && was) stop(); was = p; }
  if (opts.auto && sec) { mo = new MutationObserver(sync); mo.observe(sec, { attributes: true, attributeFilter: ['class'] }); sync(); }
  return {
    play: play, stop: stop, highlight: function (id) { pinned = id || null; setHot(pinned); },
    destroy: function () { stop(); if (mo) mo.disconnect(); rootEl.removeEventListener('pointerover', onOver); rootEl.removeEventListener('pointerleave', onLeave); rootEl.removeEventListener('click', onClick); svg.remove(); }
  };
}