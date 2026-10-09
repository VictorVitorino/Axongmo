function fxDataHighlight(root, opts) {
  if (root._fxDh) return root._fxDh;
  opts = Object.assign({ insights: [], first: 0, delay: 700, cycle: 0, hover: true, click: true, controls: null, start: 'zero' }, opts);
  const RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const items = Array.from(root.querySelectorAll('[data-fx-item]')), ctl = opts.controls || root;
  items.forEach((el, i) => el.style.setProperty('--i', i));
  root.insertAdjacentHTML('beforeend', '<svg class="fx-dh__ov" aria-hidden="true"><path class="fx-dh__br"/><path class="fx-dh__ld"/></svg><div class="fx-dh__callout" role="status"><b></b><span></span></div>');
  const br = root.querySelector('.fx-dh__br'), ld = root.querySelector('.fx-dh__ld'), co = root.querySelector('.fx-dh__callout'), goal = root.querySelector('.fx-dh__goal');
  let cur = null, hv = -1, k = -1, iv = 0, timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  /* caixa em px de layout relativa ao root: offset* ignora o transform:scale do #stage e o scaleY de entrada das barras */
  const box = el => { let x = 0, y = 0, e = el; while (e && e !== root) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; } return { x, y, w: el.offsetWidth, h: el.offsetHeight }; };
  const mark = el => el.querySelector('.fx-dh__bar') || el;
  const draw = (p, d) => {
    p.setAttribute('d', d); const L = p.getTotalLength();
    p.style.transition = 'none'; p.style.strokeDasharray = L; p.style.strokeDashoffset = RM ? 0 : L; p.style.opacity = 1;
    if (!RM) { p.getBoundingClientRect(); p.style.transition = 'stroke-dashoffset .4s cubic-bezier(.22,.61,.36,1) .05s'; p.style.strokeDashoffset = 0; }
  };
  const paint = () => items.forEach((el, i) => {
    const hi = cur ? cur.hi.indexOf(i) > -1 : i === hv;
    el.classList.toggle('is-hi', hi); el.classList.toggle('is-hover', i === hv);
    el.classList.toggle('is-dim', (!!cur || hv > -1) && !hi);
    el.classList.toggle('is-ghost', !!cur && cur.ghost === i);
  });
  /* aceita índice, lista de índices ou {hi, title, body, target, ghost}; título/corpo podem vir de data-title/data-body */
  const norm = (f, info) => {
    if (f == null || f === false) return null;
    if (typeof f === 'object' && !Array.isArray(f)) return Object.assign({}, f, { hi: [].concat(f.hi == null ? [] : f.hi) });
    const hi = [].concat(f), one = hi.length === 1 ? items[hi[0]] : null, d = one ? one.dataset : {};
    return Object.assign({ hi, title: d.title, body: d.body, ghost: one && one.querySelector('.fx-dh__ghost') ? hi[0] : null }, info);
  };
  const apply = (f, info, kk) => {
    cur = norm(f, info); k = kk == null ? -1 : kk; paint();
    root.classList.toggle('is-focus', !!cur);
    if (goal) goal.classList.toggle('is-on', !!(cur && cur.target));
    ctl.querySelectorAll('[data-fx-insight]').forEach(b => b.classList.toggle('is-on', +b.dataset.fxInsight === k));
    co.classList.remove('is-on'); br.style.opacity = ld.style.opacity = 0;
    const bs = cur && cur.title ? cur.hi.filter(i => items[i]).map(i => box(mark(items[i]))) : [];
    if (!bs.length) return;
    co.style.left = '0px'; co.style.right = 'auto'; co.firstChild.textContent = cur.title; co.lastChild.textContent = cur.body || '';
    const x0 = Math.min(...bs.map(b => b.x)), x1 = Math.max(...bs.map(b => b.x + b.w)), mid = (x0 + x1) / 2;
    const W = root.offsetWidth, cw = co.offsetWidth, ch = co.offsetHeight, right = mid < W / 2, cx = right ? W - cw : 0;
    const yb = Math.max(ch + 24, Math.min(...bs.map(b => b.y)) - 42);
    if (right) { co.style.left = 'auto'; co.style.right = '0px'; } /* ancorar pela direita mantém a largura medida */
    draw(br, `M${x0} ${yb + 8}V${yb}H${x1}V${yb + 8}`);
    draw(ld, mid > cx && mid < cx + cw ? `M${mid} ${ch}V${yb - 3}` : `M${right ? cx : cx + cw} ${ch / 2}H${mid}V${yb - 3}`);
    later(() => co.classList.add('is-on'), RM ? 0 : 30);
  };
  const insight = n => { if (opts.insights[n]) apply(opts.insights[n], null, n); };
  const halt = () => { clearInterval(iv); iv = 0; };
  const stop = () => { timers.forEach(clearTimeout); timers = []; halt(); };
  const play = () => {
    stop(); root.classList.add('is-reset'); apply(null); root.classList.remove('is-in');
    void root.offsetWidth; root.classList.remove('is-reset'); root.classList.add('is-in');
    if (!opts.insights.length) return;
    later(() => {
      insight(opts.first);
      if (opts.cycle > 0 && !RM) iv = setInterval(() => insight((k + 1) % opts.insights.length), opts.cycle);
    }, RM ? 0 : opts.delay);
  };
  items.forEach((el, i) => {
    if (opts.hover) {
      el.addEventListener('pointerenter', () => { hv = i; paint(); });
      el.addEventListener('pointerleave', () => { hv = -1; paint(); });
    }
    if (opts.click) el.addEventListener('click', e => { e.stopPropagation(); halt(); apply(cur && k < 0 && cur.hi.length === 1 && cur.hi[0] === i ? null : i); });
  });
  ctl.querySelectorAll('[data-fx-insight]').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); halt(); insight(+b.dataset.fxInsight); }));
  if (opts.start === 'final' || RM) root.classList.add('is-in');
  return (root._fxDh = { play, stop, insight, setFocus: (f, info) => { halt(); apply(f, info); }, clear: () => { halt(); apply(null); } });
}