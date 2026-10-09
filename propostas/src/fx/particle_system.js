function fxParticleSystem(rootEl, opts) {
  opts = opts || {};
  var cv = rootEl.querySelector('.fx-ps__cv'), ctx = cv && cv.getContext ? cv.getContext('2d') : null;
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var N = opts.count || 90, LINK = opts.link || 125, CUR = opts.radius || 140, SPEED = opts.speed || 0.32;
  var tgt = opts.pointerTarget || (rootEl.closest && rootEl.closest('section')) || rootEl;
  var W = 1600, H = 900, P = [], raf = 0, last = 0, t0 = 0, cursor = null, api;
  rootEl.classList.add('fx-ps--armed');
  if (!ctx) rootEl.classList.add('fx-ps--static');
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function seed() {
    P = [];
    for (var i = 0; i < N; i++) {
      var hub = i % 11 === 0, ang = rnd(0, 6.2832), s = rnd(0.45, 1) * SPEED, bx = Math.cos(ang) * s, by = Math.sin(ang) * s;
      P.push({ x: rnd(0, W), y: rnd(0, H), bx: bx, by: by, vx: bx, vy: by, r: hub ? rnd(2.8, 3.8) : rnd(1.1, 2.1), hub: hub, ph: ang });
    }
  }
  function fit() { /* palco 1600x900 escalado: tamanho lógico via offsetWidth, nitidez via rect/dpr */
    if (!ctx) return;
    W = rootEl.offsetWidth || 1600; H = rootEl.offsetHeight || 900;
    var r = cv.getBoundingClientRect(), k = r.width ? r.width / W : 1;
    var pr = Math.min(2, Math.max(1, (window.devicePixelRatio || 1) * k));
    cv.width = Math.round(W * pr); cv.height = Math.round(H * pr);
    ctx.setTransform(pr, 0, 0, pr, 0, 0);
  }
  function step(dt) {
    var k = Math.min(dt / 16.7, 3), R2 = CUR * CUR;
    for (var i = 0; i < P.length; i++) {
      var p = P[i];
      if (cursor) {
        var dx = p.x - cursor.x, dy = p.y - cursor.y, d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 1) { var d = Math.sqrt(d2), f = (1 - d / CUR) * 0.5 * k; p.vx += dx / d * f; p.vy += dy / d * f; }
      }
      p.vx += (p.bx - p.vx) * 0.03 * k; p.vy += (p.by - p.vy) * 0.03 * k;
      var sp = p.vx * p.vx + p.vy * p.vy; if (sp > 9) { sp = 3 / Math.sqrt(sp); p.vx *= sp; p.vy *= sp; }
      p.x += p.vx * k; p.y += p.vy * k;
      if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); p.bx = Math.abs(p.bx); } else if (p.x > W) { p.x = W; p.vx = -Math.abs(p.vx); p.bx = -Math.abs(p.bx); }
      if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); p.by = Math.abs(p.by); } else if (p.y > H) { p.y = H; p.vy = -Math.abs(p.vy); p.by = -Math.abs(p.by); }
    }
  }
  function draw(alpha, reach, t) {
    var L = LINK * reach, L2 = L * L, i, j, a, b, dx, dy, d2, o, hub;
    ctx.clearRect(0, 0, W, H); ctx.lineWidth = 1; ctx.globalAlpha = 1;
    for (i = 0; i < P.length; i++) for (a = P[i], j = i + 1; j < P.length; j++) {
      b = P[j]; dx = a.x - b.x; dy = a.y - b.y; d2 = dx * dx + dy * dy;
      if (d2 < L2) {
        hub = a.hub || b.hub; o = ((1 - Math.sqrt(d2) / L) * (hub ? 0.6 : 0.42) * alpha).toFixed(3);
        ctx.strokeStyle = hub ? 'rgba(249,166,74,' + o + ')' : 'rgba(157,187,217,' + o + ')';
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    ctx.globalAlpha = alpha; ctx.shadowColor = 'rgba(247,140,22,.85)';
    for (i = 0; i < P.length; i++) {
      a = P[i]; ctx.fillStyle = a.hub ? '#F78C16' : '#BFD0E1'; ctx.shadowBlur = a.hub ? 14 : 0;
      ctx.beginPath(); ctx.arc(a.x, a.y, a.hub ? a.r * (1 + 0.22 * Math.sin(t / 650 + a.ph)) : a.r, 0, 6.2832); ctx.fill();
    }
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
  }
  function loop(t) { /* entrada: pontos acendem e a rede "se forma" (alcance dos links cresce) em 1,6 s */
    if (!t0) t0 = t;
    var dt = last ? t - last : 16.7, e = Math.max(0, Math.min(1, (t - t0) / 1600)); last = t;
    step(dt); draw(Math.min(1, e * 2), 1 - Math.pow(1 - e, 3), t);
    raf = requestAnimationFrame(loop);
  }
  function move(ev) { /* clientX/Y -> coordenadas lógicas 1600x900 (palco sob transform:scale) */
    var r = cv.getBoundingClientRect(); if (!r.width) return;
    cursor = { x: (ev.clientX - r.left) * W / r.width, y: (ev.clientY - r.top) * H / r.height };
  }
  function leave() { cursor = null; }
  function onResize() { fit(); if (reduced) draw(1, 1, 0); }
  function stop() {
    if (raf) cancelAnimationFrame(raf); raf = 0;
    window.removeEventListener('resize', onResize);
    tgt.removeEventListener('pointermove', move); tgt.removeEventListener('pointerleave', leave);
    return api;
  }
  function play() {
    stop(); cursor = null; last = 0; t0 = 0;
    rootEl.classList.remove('fx-ps--in'); void rootEl.offsetWidth; rootEl.classList.add('fx-ps--in');
    if (!ctx) return api;
    fit(); seed(); window.addEventListener('resize', onResize);
    if (reduced) { draw(1, 1, 0); return api; }
    if (opts.interactive !== false) { tgt.addEventListener('pointermove', move); tgt.addEventListener('pointerleave', leave); }
    raf = requestAnimationFrame(loop); return api;
  }
  api = { play: play, stop: stop };
  return api;
}