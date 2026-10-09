function fxGlowLightSweep(root, opts) {
  opts = opts || {};
  var interval = opts.interval || 5000, delay = opts.delay != null ? opts.delay : 1400;
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var card = root.querySelector('.fx-glow-card') || root, band = root.querySelector('.fx-glow-sweep');
  var enter = !reduced && opts.entrance !== false, cast = [root].concat(Array.prototype.slice.call(opts.secondary || []));
  var timer = 0, raf = 0, last = null, playing = false, offs = [], waits = [];
  if (opts.color === 'steel') root.classList.add('fx-glow--steel');
  if (enter) cast.forEach(function (el) { el.classList.add('fx-glow-from'); }); /* evita "flash" antes do play */
  function sweep() {
    if (!band) return;
    card.classList.remove('fx-glow-sweeping');
    void band.offsetWidth; /* reflow: reinicia a animação CSS da faixa */
    card.classList.add('fx-glow-sweeping');
  }
  function schedule(ms) {
    clearTimeout(timer);
    if (playing && !reduced && opts.auto !== false) timer = setTimeout(function () { sweep(); schedule(interval); }, ms);
  }
  function sweepNow() { sweep(); schedule(interval); }
  function on(el, ev, fn) { el.addEventListener(ev, fn); offs.push(function () { el.removeEventListener(ev, fn); }); }
  function paint() { /* reflexo segue o cursor em % do retângulo real: imune ao transform:scale do #stage */
    raf = 0;
    var r = card.getBoundingClientRect();
    if (!last || !r.width || !r.height) return;
    card.style.setProperty('--mx', ((last.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    card.style.setProperty('--my', ((last.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  }
  function stop() {
    playing = false; clearTimeout(timer); waits.forEach(clearTimeout); waits = [];
    if (raf) cancelAnimationFrame(raf);
    raf = 0; last = null;
    offs.forEach(function (off) { off(); }); offs = [];
    root.classList.remove('fx-glow-on', 'fx-glow-hover'); card.classList.remove('fx-glow-sweeping');
  }
  function play() {
    stop(); playing = true; root.classList.add('fx-glow-on');
    on(card, 'pointerenter', function () { root.classList.add('fx-glow-hover'); if (!reduced) sweepNow(); });
    on(card, 'pointerleave', function () { root.classList.remove('fx-glow-hover'); });
    on(card, 'pointermove', function (e) { last = e; if (!raf) raf = requestAnimationFrame(paint); });
    if (band) on(band, 'animationend', function () { card.classList.remove('fx-glow-sweeping'); });
    if (opts.click) on(card, 'click', function (e) { e.stopPropagation(); sweepNow(); });
    if (enter) cast.forEach(function (el, i) { /* tile principal pousa; secundários chegam em cascata */
      el.classList.remove('fx-glow-in'); el.classList.add('fx-glow-from'); void el.offsetWidth;
      waits.push(setTimeout(function () { el.classList.add('fx-glow-in'); }, i ? 160 + (i - 1) * 90 : 0));
    });
    schedule(delay);
  }
  return { play: play, stop: stop, sweep: sweepNow };
}