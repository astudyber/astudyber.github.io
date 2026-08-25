(function () {
  const notes = document.getElementById('researchNotes');
  const content = document.getElementById('markdownContent');
  if (!notes || !content) return;

  const manifestUrl = '../dox/研究/index.json';

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  }

  function inlineMarkdown(value) {
    let html = escapeHtml(value);
    html = html.replace(/!\[([^\]]*)\]\(((?:https?:\/\/|\.?\/)[^)]+)\)/g, '<img src="$2" alt="$1">');
    html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
    return html;
  }

  function renderMarkdown(markdown) {
    const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
    const output = [];
    let inCode = false;
    let codeLanguage = '';
    let codeLines = [];
    let listType = null;
    let listItems = [];
    let quoteLines = [];

    function closeList() {
      if (!listType) return;
      output.push(`<${listType}>${listItems.join('')}</${listType}>`);
      listType = null;
      listItems = [];
    }
    function closeQuote() {
      if (!quoteLines.length) return;
      output.push(`<blockquote>${quoteLines.map((line) => `<p>${inlineMarkdown(line)}</p>`).join('')}</blockquote>`);
      quoteLines = [];
    }

    lines.forEach((line) => {
      if (inCode) {
        if (/^\s*```/.test(line)) {
          output.push(`<pre><code class="language-${escapeHtml(codeLanguage)}">${escapeHtml(codeLines.join('\n'))}</code></pre>`);
          inCode = false;
          codeLanguage = '';
          codeLines = [];
        } else codeLines.push(line);
        return;
      }
      const fence = line.match(/^\s*```\s*([\w-]*)\s*$/);
      if (fence) { closeList(); closeQuote(); inCode = true; codeLanguage = fence[1] || 'text'; return; }
      if (/^\s*$/.test(line)) { closeList(); closeQuote(); return; }
      const heading = line.match(/^\s*(#{1,4})\s+(.+?)\s*#*$/);
      if (heading) { closeList(); closeQuote(); output.push(`<h${heading[1].length}>${inlineMarkdown(heading[2])}</h${heading[1].length}>`); return; }
      const quote = line.match(/^\s*>\s?(.*)$/);
      if (quote) { closeList(); quoteLines.push(quote[1]); return; }
      const unordered = line.match(/^\s*[-*+]\s+(.+)$/);
      const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
      if (unordered || ordered) {
        closeQuote();
        const nextType = unordered ? 'ul' : 'ol';
        if (listType && listType !== nextType) closeList();
        listType = nextType;
        listItems.push(`<li>${inlineMarkdown((unordered || ordered)[1])}</li>`);
        return;
      }
      closeList(); closeQuote();
      output.push(`<p>${inlineMarkdown(line)}</p>`);
    });
    if (inCode) output.push(`<pre><code class="language-${escapeHtml(codeLanguage)}">${escapeHtml(codeLines.join('\n'))}</code></pre>`);
    closeList(); closeQuote();
    return output.join('');
  }

  function setStatus(message, isError) {
    notes.innerHTML = `<p class="research-status${isError ? ' is-error' : ''}">${escapeHtml(message)}</p>`;
  }

  function selectNote(button, file) {
    notes.querySelectorAll('.research-note').forEach((item) => item.classList.toggle('active', item === button));
    content.innerHTML = '<div class="markdown-placeholder"><i data-lucide="loader-circle"></i><p>正在加载 Markdown…</p></div>';
    if (window.Astudyber) window.Astudyber.refreshIcons();
    fetch(`../dox/研究/${encodeURIComponent(file)}`)
      .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.text(); })
      .then((markdown) => {
        content.innerHTML = renderMarkdown(markdown);
        content.scrollTop = 0;
      })
      .catch(() => {
        content.innerHTML = '<div class="markdown-placeholder"><i data-lucide="triangle-alert"></i><p>暂时无法读取这篇 Markdown，请确认文件路径和本地 HTTP 服务。</p></div>';
        if (window.Astudyber) window.Astudyber.refreshIcons();
      });
  }

  fetch(manifestUrl)
    .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then((manifest) => {
      const files = Array.isArray(manifest) ? manifest : manifest.files;
      if (!Array.isArray(files) || !files.length) throw new Error('empty manifest');
      notes.innerHTML = '';
      files.forEach((entry, index) => {
        const file = typeof entry === 'string' ? entry : entry.file;
        const title = typeof entry === 'string' ? entry.replace(/\.md$/i, '') : (entry.title || file.replace(/\.md$/i, ''));
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'research-note';
        button.innerHTML = `<span class="research-note__index">${String(index + 1).padStart(2, '0')}</span><span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(file)}</small></span>`;
        button.addEventListener('click', () => selectNote(button, file));
        notes.appendChild(button);
        if (index === 0) selectNote(button, file);
      });
    })
    .catch(() => setStatus('未找到 Markdown 目录，请检查 home/dox/研究/index.json。', true));
})();
