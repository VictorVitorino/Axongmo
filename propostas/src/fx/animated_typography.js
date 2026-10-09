function fxTypography(rootEl, opts) {
  opts = Object.assign({ selector: '[data-fx-type]', delay: 150, gap: 140, countDur: 1200, countStagger: 160, locale: 'pt-BR' }, opts || {});
  var STEP = { word: 70, letter: 16, line: 260 }, raf = 0, t0 = 0, ai = 0, acts = [], anims = [], A = Array.prototype;
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function outQuart(t) { return 1 - Math.pow(1 - t, 4); } function outBack(t) { var c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
  function mk(cls, txt) { var s = document.createElement('span'); s.className = cls; if (txt != null) s.textContent = txt; return s; }
  /* quebra o texto em unidades preservando <em>, <b data-fx-num>, <span data-fx-hl> e contadores */
  function split(node, mode, out, hl) {
    A.slice.call(node.childNodes).forEach(function (n) {
      if (n.nodeType === 3) { var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(part));
          if (mode !== 'letter') { var s = mk('fx-ty-u', part); frag.appendChild(s); return out.push({ el: s, hl: hl }); }
          var w = mk('fx-ty-w'); frag.appendChild(w);
          Array.from(part).forEach(function (ch) { var c = mk('fx-ty-u', ch); w.appendChild(c); out.push({ el: c, hl: hl }); });
        });
        node.replaceChild(frag, n);
      } else if (n.nodeType === 1) {
        if (n.hasAttribute('data-fx-num') || n.hasAttribute('data-fx-count')) { var num = n.hasAttribute('data-fx-num'); n.classList.add(num ? 'fx-ty-num' : 'fx-ty-u'); out.push({ el: n, num: num, hl: hl }); }
        else { var h = hl; if (n.hasAttribute('data-fx-hl')) { n.classList.add('fx-ty-hl'); h = n; } split(n, mode, out, h); }
      }
    });
  }
  var targets = A.map.call(rootEl.querySelectorAll(opts.selector), function (el) {
    var mode = STEP[el.dataset.fxType] ? el.dataset.fxType : 'word';
    if (!el._fxTy) { el._fxTy = []; split(el, mode, el._fxTy, null); }
    el.classList.add('fx-ty', 'fx-ty-' + mode);
    return { el: el, mode: mode, units: el._fxTy, step: +el.dataset.fxStep || STEP[mode] };
  });
  var counters = A.map.call(rootEl.querySelectorAll('[data-fx-count]'), function (el) {
    var ds = el.dataset, d = +(ds.fxDecimals || 0);
    return { el: el, to: parseFloat(ds.fxCount) || 0, pre: ds.fxPrefix || '', suf: ds.fxSuffix || '', dur: +ds.fxDur || opts.countDur,
      nf: new Intl.NumberFormat(opts.locale, { minimumFractionDigits: d, maximumFractionDigits: d }) };
  });
  function txt(c, v) { return c.pre + c.nf.format(v) + c.suf; }
  function land(el, p) { /* número-chave pousa com overshoot (escala 1,4 -> 1) */
    var e = outBack(p), end = p >= 1, s = el.style; s.opacity = String(Math.min(1, p * 4));
    s.translate = end ? '' : '0 ' + (-0.5 + 0.5 * e).toFixed(3) + 'em'; s.scale = end ? '' : (1.4 - 0.4 * e).toFixed(3);
  }
  function each(fn) { targets.forEach(function (t) { t.units.forEach(fn); }); } function cls(c, on) { targets.forEach(function (t) { t.el.classList.toggle(c, on); }); }
  function hls(on) { A.forEach.call(rootEl.querySelectorAll('.fx-ty-hl'), function (h) { h.classList.toggle('is-under', on); }); }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; } /* cancela o rAF; o estado visual fica onde parou */
  function show() { stop(); each(function (u) { u.el.classList.add('is-in'); if (u.num) land(u.el, 1); }); hls(true); counters.forEach(function (c) { c.el.textContent = txt(c, c.to); }); }
  function reset() {
    stop(); cls('fx-ty-instant', true);
    each(function (u) { u.el.classList.remove('is-in'); if (u.num) land(u.el, 0); }); hls(false);
    counters.forEach(function (c) { c.el.style.minWidth = ''; c.el.textContent = txt(c, c.to); c.el.style.minWidth = c.el.offsetWidth + 'px'; c.el.textContent = txt(c, 0); });
    void rootEl.offsetWidth; cls('fx-ty-instant', false);
  }
  function build() { /* agenda em ordem de leitura; no modo 'line' agrupa palavras pela linha visual */
    var at = opts.delay, hlEnd = new Map(), unitAt = new Map(), k = 0; acts = []; anims = []; ai = 0;
    cls('fx-ty-instant', true); cls('fx-ty-measure', true);
    targets.forEach(function (t, ti) {
      at = t.el.dataset.fxDelay != null ? +t.el.dataset.fxDelay : at + (ti ? opts.gap : 0);
      var top = null, lh = 0, line = t.mode === 'line';
      t.units.forEach(function (u) {
        var r = line ? u.el.getBoundingClientRect() : null;
        if (line && top === null) { top = r.top; lh = r.height; } else if (line && r.top > top + lh * 0.6) { at += t.step; top = r.top; lh = r.height; }
        unitAt.set(u.el, at);
        if (u.num) anims.push({ t: at, d: 620, f: land.bind(null, u.el) });
        else acts.push({ t: at, f: function () { u.el.classList.add('is-in'); } });
        if (u.hl) hlEnd.set(u.hl, Math.max(hlEnd.get(u.hl) || 0, at));
        if (!line) at += t.step;
      });
      if (line) at += t.step;
    });
    cls('fx-ty-measure', false); void rootEl.offsetWidth; cls('fx-ty-instant', false);
    hlEnd.forEach(function (t, h) { acts.push({ t: t + 380, f: function () { h.classList.add('is-under'); } }); });
    counters.forEach(function (c) {
      var s = c.el.dataset.fxDelay != null ? +c.el.dataset.fxDelay : unitAt.has(c.el) ? unitAt.get(c.el) : at + 120 + opts.countStagger * k++;
      anims.push({ t: s, d: c.dur, f: function (p) { c.el.textContent = txt(c, p >= 1 ? c.to : c.to * outQuart(p)); } });
    });
    acts.sort(function (a, b) { return a.t - b.t; });
  }
  function tick(now) {
    if (!t0) t0 = now; var t = now - t0, live = false;
    while (ai < acts.length && acts[ai].t <= t) acts[ai++].f();
    anims.forEach(function (a) {
      if (a.done) return; if (t < a.t) { live = true; return; }
      var p = Math.min(1, (t - a.t) / a.d); a.f(p); if (p < 1) live = true; else a.done = true;
    });
    raf = live || ai < acts.length ? requestAnimationFrame(tick) : 0;
  }
  function play() { if (mq.matches) return show(); reset(); build(); t0 = 0; raf = requestAnimationFrame(tick); }
  return { play: play, stop: stop, reset: reset, show: show };
}