(function () {
  const themeToggle = document.getElementById('themeToggle');
  const todayText = document.getElementById('todayText');
  const toast = document.getElementById('toast');
  let toastTimer;

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
  }

  function setTheme(theme) {
    const isNight = theme === 'night';
    document.body.dataset.theme = isNight ? 'night' : '';
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute('content', isNight ? '#070612' : '#fdf6e3');
    if (themeToggle) {
      themeToggle.innerHTML = `<i data-lucide="${isNight ? 'sun-medium' : 'moon-star'}"></i>`;
      themeToggle.setAttribute('aria-label', isNight ? '切换日间主题' : '切换夜间主题');
    }
    localStorage.setItem('astudyber-theme', isNight ? 'night' : 'day');
    refreshIcons();
  }

  function showToast(message) {
    if (!toast) return;
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
  }

  function updateDate() {
    if (!todayText) return;
    todayText.textContent = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' }).format(new Date());
  }

  function startAmbientLayer() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = document.createElement('canvas');
    canvas.id = 'ambient-layer';
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, { position: 'fixed', inset: '0', zIndex: '0', width: '100%', height: '100%', pointerEvents: 'none' });
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    const pointer = { x: -100, y: -100 };
    const particles = [];
    const meteors = [];
    let width = 0;
    let height = 0;

    function resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function seed() {
      particles.length = 0;
      const count = Math.min(95, Math.max(38, Math.round(width / 15)));
      for (let i = 0; i < count; i += 1) particles.push({ x: Math.random() * width, y: Math.random() * height, r: Math.random() * 1.5 + .4, vx: (Math.random() - .5) * .16, vy: (Math.random() - .5) * .16, a: Math.random() * .55 + .15 });
    }

    function addMeteor() {
      if (document.visibilityState !== 'visible') return;
      meteors.push({ x: Math.random() * width * .9 + width * .05, y: -20, length: Math.random() * 75 + 55, speed: Math.random() * 5 + 4, life: 0 });
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const accent = getComputedStyle(document.body).getPropertyValue('--cyan').trim() || '#45d9ff';
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -5) p.x = width + 5; if (p.x > width + 5) p.x = -5;
        if (p.y < -5) p.y = height + 5; if (p.y > height + 5) p.y = -5;
        const distance = Math.hypot(p.x - pointer.x, p.y - pointer.y);
        const glow = distance < 140 ? (1 - distance / 140) * .7 : 0;
        ctx.globalAlpha = p.a + glow;
        ctx.fillStyle = accent;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r + glow * 1.2, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      meteors.forEach((m) => {
        m.x -= m.speed * .72; m.y += m.speed; m.life += 1;
        const fade = Math.max(0, 1 - m.life / 70);
        ctx.globalAlpha = fade;
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x + m.length * .72, m.y - m.length); ctx.stroke();
      });
      ctx.globalAlpha = 1;
      for (let i = meteors.length - 1; i >= 0; i -= 1) if (meteors[i].life > 70 || meteors[i].y > height + 90) meteors.splice(i, 1);
      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); seed(); });
    window.addEventListener('pointermove', (event) => { pointer.x = event.clientX; pointer.y = event.clientY; });
    resize(); seed(); draw();
    setInterval(addMeteor, 6500);
    setTimeout(addMeteor, 2200);
  }

  if (localStorage.getItem('astudyber-theme') === 'night') setTheme('night'); else setTheme('day');
  if (themeToggle) themeToggle.addEventListener('click', () => { const nextTheme = document.body.dataset.theme === 'night' ? 'day' : 'night'; setTheme(nextTheme); showToast(nextTheme === 'night' ? '深空主题已开启' : 'Solarized Light 日间主题已开启'); });
  updateDate();
  refreshIcons();
  startAmbientLayer();
  window.Astudyber = { refreshIcons, showToast };
})();
