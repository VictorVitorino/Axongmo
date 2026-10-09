function fxMotionGraphics(root, opts) {
  opts = opts || {};
  var speed = opts.speed || 1, raf = 0, t0 = 0, total = 0, tracks = [], idx = {};
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var E = { linear: function (x) { return x; }, cubic: function (x) { return 1 - Math.pow(1 - x, 3); },
    quint: function (x) { return 1 - Math.pow(1 - x, 5); }, expo: function (x) { return x >= 1 ? 1 : 1 - Math.pow(2, -10 * x); },
    back: function (x) { var c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); } };
  /* tipo: [início ms, duração ms, easing, passo do stagger] — ordem do guia: forma → linha → título → dado */
  var PLAN = {
    draw: [0, 650, 'cubic', 250], pop: [220, 560, 'back', 140], line: [400, 550, 'expo', 150],
    clip: [450, 380, 'cubic', 120], word: [560, 550, 'quint', 70], fade: [1000, 450, 'cubic', 140],
    count: [1200, 1000, 'expo', 220], bar: [1300, 950, 'expo', 220]
  };
  function grow(el, e) { el.style.transform = (el.dataset.axis === 'y' ? 'scaleY(' : 'scaleX(') + e.toFixed(3) + ')'; }
  var APPLY = {
    line: grow, bar: grow,
    draw: function (el, e) { el.style.strokeDasharray = el._len; el.style.strokeDashoffset = (el._len * (1 - e)).toFixed(3); },
    pop: function (el, e) {
      var r = el.dataset.rot != null ? +el.dataset.rot : 45;
      el.style.opacity = Math.min(1, e * 2).toFixed(3);
      el.style.transform = 'rotate(' + (r * (1 - e)).toFixed(1) + 'deg) scale(' + Math.max(0, e).toFixed(3) + ')';
    },
    clip: function (el, e) { el.style.clipPath = 'inset(-10% ' + (100 - 100 * e).toFixed(1) + '% -10% 0)'; },
    word: function (el, e) { el.style.transform = 'translateY(' + (110 - 110 * e).toFixed(1) + '%)'; },
    fade: function (el, e) { el.style.opacity = e.toFixed(3); el.style.transform = 'translateY(' + (14 - 14 * e).toFixed(1) + 'px)'; },
    count: function (el, e) {
      var d = +(el.dataset.decimals || 0);
      el.textContent = (el.dataset.prefix || '') + (el._v * e).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }) + (el.dataset.suffix || '');
    }
  };
  function wrap(node) {
    var s = document.createElement('span'), i = document.createElement('i');
    s.className = 'fx-mg-w'; i.setAttribute('data-mg', 'word'); i.appendChild(node); s.appendChild(i); return s;
  }
  function split(el) { /* título → palavras em máscara; <em>/<strong> viram uma palavra, <br> é mantido */
    var frag = document.createDocumentFragment();
    Array.prototype.slice.call(el.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        n.nodeValue.split(/(\s+)/).forEach(function (w) {
          if (w) frag.appendChild(/^\s+$/.test(w) ? document.createTextNode(' ') : wrap(document.createTextNode(w)));
        });
      } else if (n.nodeType === 1) frag.appendChild(n.nodeName === 'BR' ? n : wrap(n));
    });
    el.textContent = ''; el.appendChild(frag); el.setAttribute('data-mg-split', 'done');
  }
  function pathLen(el) { try { var l = el.getTotalLength(); if (l > 0) return l; } catch (x) {} el.setAttribute('pathLength', '1'); return 1; }
  Array.prototype.forEach.call(root.querySelectorAll('[data-mg-split]:not([data-mg-split="done"])'), split);
  Array.prototype.forEach.call(root.querySelectorAll('[data-mg]'), function (el) {
    var type = el.dataset.mg, p = PLAN[type], auto = el.dataset.at == null, i = 0;
    if (!p) return;
    if (auto) i = idx[type] = idx[type] == null ? 0 : idx[type] + 1;
    var from = auto ? p[0] + i * p[3] : +el.dataset.at, to = from + (el.dataset.dur != null ? +el.dataset.dur : p[1]);
    if (type === 'draw') el._len = pathLen(el);
    if (type === 'count') el._v = parseFloat(el.dataset.value) || 0;
    tracks.push({ el: el, from: from, to: to, ease: E[el.dataset.ease] || E[p[2]], fn: APPLY[type] });
    total = Math.max(total, to);
  });
  function render(t) { /* idempotente: o estado depende só de t, então pausa/salto nunca dessincronizam */
    for (var k = 0; k < tracks.length; k++) {
      var tr = tracks[k], x = (t - tr.from) / ((tr.to - tr.from) || 1);
      tr.fn(tr.el, tr.ease(x < 0 ? 0 : x > 1 ? 1 : x));
    }
    root.classList.toggle('fx-mg-done', t >= total - 300);
  }
  function finish() {
    raf = 0; render(total);
    if (!reduced) {
      tracks.forEach(function (tr) { if (tr.el.getAttribute('data-mg-loop') === 'flow') tr.el.style.strokeDasharray = tr.el.style.strokeDashoffset = ''; });
      root.classList.add('fx-mg-live');
    }
    if (typeof opts.onDone === 'function') opts.onDone();
  }
  function tick(now) {
    var t = (now - t0) * speed;
    if (t >= total) { finish(); return; }
    render(t); raf = requestAnimationFrame(tick);
  }
  function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; root.classList.remove('fx-mg-on', 'fx-mg-live'); }
  function seek(ms) {
    stop(); root.classList.remove('fx-mg-done'); root.classList.add('fx-mg-on');
    if (reduced || ms >= total) { finish(); return; }
    render(ms); t0 = performance.now() - ms / speed; raf = requestAnimationFrame(tick);
  }
  render(reduced ? total : 0);
  return { play: function () { seek(0); }, stop: stop, seek: seek, duration: total };
}