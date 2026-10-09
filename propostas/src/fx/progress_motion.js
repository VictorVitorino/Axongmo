function fxProgress(root, opts) {
  if (root._fxPm) return root._fxPm;
  opts = Object.assign({ delay: 160, stagger: 130, dur: 1100, ringDur: 1500, tlDur: 1400, locale: 'pt-BR', levels: null, start: 'zero', onDone: null }, opts);
  const RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const outExpo = t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)), outCubic = t => 1 - Math.pow(1 - t, 3);
  const $ = (el, s) => el.querySelector(s), $$ = (el, s) => Array.from(el.querySelectorAll(s));
  const num = (el, k, d) => { const n = parseFloat(el.dataset[k]); return isNaN(n) ? d : n; };
  const decs = el => (el.dataset.dec != null ? +el.dataset.dec : ((el.dataset.value || '').split('.')[1] || '').length);
  const fmt = (v, d) => v.toLocaleString(opts.locale, { minimumFractionDigits: d, maximumFractionDigits: d });
  const counter = (el, mx) => { const o = $(el, '[data-num]'), d = decs(el), suf = (o && o.dataset.suffix) || ''; return f => { if (o) o.textContent = fmt(f * mx, d) + suf; }; };
  const rows = $$(root, '.fx-pm__row'), jobs = [];
  const mean = rows.length ? rows.reduce((a, r) => a + num(r, 'value', 0), 0) / rows.length : 0;
  /* anel: stroke-dashoffset + contador + nível; marcador de meta fixo desde o 1º frame */
  $$(root, '.fx-pm__ring').forEach((el, i) => {
    const arc = $(el, '.fx-pm__arc'), tick = $(el, '.fx-pm__tick'), prev = $(el, '.fx-pm__prevarc'), lvl = $(el, '[data-level]');
    const mx = num(el, 'max', 100), v = el.dataset.value === 'auto' ? mean : num(el, 'value', 0), meta = num(el, 'meta', NaN), pv = num(el, 'prev', NaN);
    const C = 2 * Math.PI * arc.r.baseVal.value, show = counter(el, mx);
    arc.style.strokeDasharray = C;
    if (prev) { if (isNaN(pv)) prev.remove(); else { prev.style.strokeDasharray = C; prev.style.strokeDashoffset = C * (1 - pv / mx); } }
    if (tick) { if (isNaN(meta)) tick.remove(); else tick.setAttribute('transform', 'rotate(' + (meta / mx) * 360 + ' ' + arc.cx.baseVal.value + ' ' + arc.cy.baseVal.value + ')'); }
    jobs.push({ el, delay: opts.delay + 100 + i * opts.stagger, dur: opts.ringDur, ease: outCubic, to: v / mx,
      set: f => {
        arc.style.strokeDashoffset = C * (1 - f); arc.style.visibility = f > 0.004 ? 'visible' : 'hidden'; show(f);
        if (lvl && opts.levels) lvl.textContent = opts.levels[Math.min(opts.levels.length - 1, Math.floor(f * opts.levels.length + 1e-9))];
      },
      fin: () => el.classList.toggle('is-met', v >= meta) });
  });
  /* barras: crescem do zero até a nota real (outExpo, escalonadas); meta e ciclo anterior ficam fixos */
  rows.forEach((el, i) => {
    const fill = $(el, '.fx-pm__fill'), mm = $(el, '.fx-pm__meta'), pm = $(el, '.fx-pm__prev'), ml = $(el, '[data-meta-lbl]'), dl = $(el, '[data-delta]');
    const mx = num(el, 'max', 100), v = num(el, 'value', 0), meta = num(el, 'meta', NaN), pv = num(el, 'prev', NaN), d = decs(el), show = counter(el, mx);
    if (mm) { if (isNaN(meta)) mm.remove(); else mm.style.left = (meta / mx) * 100 + '%'; }
    if (pm) { if (isNaN(pv)) pm.remove(); else pm.style.left = (pv / mx) * 100 + '%'; }
    if (ml && !isNaN(meta)) ml.textContent = (ml.dataset.prefix || 'meta ') + fmt(meta, d);
    if (dl && !isNaN(pv)) dl.textContent = (v >= pv ? '▲ +' : '▼ −') + fmt(Math.abs(v - pv), d) + ' ' + (dl.dataset.label || 'vs ciclo anterior');
    jobs.push({ el, delay: opts.delay + i * opts.stagger, dur: opts.dur, ease: outExpo, to: v / mx,
      set: f => { fill.style.width = f * 100 + '%'; show(f); }, fin: () => el.classList.toggle('is-met', v >= meta) });
  });
  /* timeline: preenchimento + marcos que acendem quando o progresso passa; o último alcançado ganha glow */
  $$(root, '.fx-pm__tl').forEach(el => {
    const fill = $(el, '.fx-pm__tlfill'), steps = $$(el, '.fx-pm__step'), ats = steps.map(s => num(s, 'at', 0)), show = counter(el, 100);
    steps.forEach((s, i) => s.style.setProperty('--at', ats[i]));
    jobs.push({ el, delay: opts.delay, dur: opts.tlDur, ease: outCubic, to: num(el, 'value', 0) / 100,
      set: f => { fill.style.width = f * 100 + '%'; show(f); steps.forEach((s, i) => s.classList.toggle('is-on', f * 100 >= ats[i] - 0.01)); },
      fin: () => { const on = steps.filter(s => s.classList.contains('is-on')); if (on.length) on[on.length - 1].classList.add('is-now'); } });
  });
  let raf = 0, t0 = 0;
  const end = j => { j.done = 1; j.set(j.to); j.el.classList.add('is-in', 'is-done'); if (j.fin) j.fin(); };
  const reset = () => { $$(root, '.is-now').forEach(s => s.classList.remove('is-now')); jobs.forEach(j => { j.done = 0; j.el.classList.remove('is-in', 'is-done', 'is-met'); j.set(0); }); };
  const frame = now => {
    let live = false;
    jobs.forEach(j => {
      if (j.done) return;
      const e = now - t0 - j.delay;
      if (e > -140) j.el.classList.add('is-in');
      if (e >= j.dur) end(j); else { live = true; j.set(j.ease(Math.max(0, e / j.dur)) * j.to); }
    });
    raf = live ? requestAnimationFrame(frame) : 0;
    if (!live && opts.onDone) opts.onDone(root);
  };
  const stop = () => { if (raf) cancelAnimationFrame(raf); raf = 0; };
  const finish = () => { stop(); jobs.forEach(j => { if (!j.done) end(j); }); };
  const play = () => {
    stop(); root.classList.add('is-reset'); reset(); void root.offsetWidth; root.classList.remove('is-reset');
    if (RM) return finish();
    t0 = performance.now(); raf = requestAnimationFrame(frame);
  };
  if (opts.start === 'final' || RM) finish(); else reset();
  return (root._fxPm = { play, stop, finish, reset });
}