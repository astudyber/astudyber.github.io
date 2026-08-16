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

  if (localStorage.getItem('astudyber-theme') === 'night') setTheme('night');
  else setTheme('day');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.body.dataset.theme === 'night' ? 'day' : 'night';
      setTheme(nextTheme);
      showToast(nextTheme === 'night' ? '晚安，星光主题已开启' : '早安，阳光主题回来啦');
    });
  }

  updateDate();
  refreshIcons();
  window.Astudyber = { refreshIcons, showToast };
})();
