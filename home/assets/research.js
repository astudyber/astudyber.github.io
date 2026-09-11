(function () {
  const categoryTabs = document.getElementById('researchCategories');
  const notes = document.getElementById('researchNotes');
  const content = document.getElementById('markdownContent');
  if (!categoryTabs || !notes || !content) return;

  const manifestUrl = '../dox/研究/index.json';
  const documentsBaseUrl = new URL('../dox/研究/', window.location.href);

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[character]));
  }

  function inlineMarkdown(value) {
    let html = escapeHtml(value);
    const mathSegments = [];
    html = html.replace(/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\])/g, (segment) => {
      const token = `@@MATH_SEGMENT_${mathSegments.length}@@`;
      mathSegments.push(segment);
      return token;
    });
    html = html
      .replace(/\\_/g, '_')
      .replace(/!\[([^\]]*)\]\(((?:https?:\/\/|\.\.?\/)[^)]+)\)/g, '<img src="$2" alt="$1">')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/__([^_]+)__/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
    mathSegments.forEach((segment, index) => {
      html = html.replace(`@@MATH_SEGMENT_${index}@@`, segment);
    });
    return html.replace(/&lt;font\s+color=(?:'|&quot;|&#39;)?(#[0-9a-f]{3,8})(?:'|&quot;|&#39;)?&gt;([\s\S]*?)&lt;\/font&gt;/gi, '<font color="$1">$2</font>');
  }

  function splitTableRow(line) {
    let value = line.trim();
    if (value.startsWith('|')) value = value.slice(1);
    if (value.endsWith('|') && !value.endsWith('\\|')) value = value.slice(0, -1);
    const cells = [];
    let cell = '';
    let escaped = false;
    for (const character of value) {
      if (character === '|' && !escaped) {
        cells.push(cell.trim());
        cell = '';
      } else {
        cell += character;
      }
      escaped = character === '\\' && !escaped;
      if (character !== '\\') escaped = false;
    }
    cells.push(cell.trim());
    return cells.map((item) => item.replace(/\\\|/g, '|'));
  }

  function isTableSeparator(line) {
    const cells = splitTableRow(line);
    return cells.length > 1 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
  }

  function tableAlignment(cell) {
    const left = cell.startsWith(':');
    const right = cell.endsWith(':');
    return left && right ? 'center' : (right ? 'right' : (left ? 'left' : ''));
  }

  function headingId(text, usedIds) {
    const plain = text.replace(/[`*_~]/g, '').trim().toLowerCase();
    const base = plain.replace(/[^\w\u4e00-\u9fff -]/g, '').replace(/\s+/g, '-') || 'section';
    let id = base;
    let suffix = 2;
    while (usedIds.has(id)) id = `${base}-${suffix++}`;
    usedIds.add(id);
    return id;
  }

  function renderMarkdown(markdown) {
    const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
    const output = [];
    const headings = [];
    const headingIds = new Map();
    const usedIds = new Set();
    let code = false;
    let language = '';
    let codeLines = [];
    let list = null;
    let items = [];
    let quote = [];

    lines.forEach((line, index) => {
      const heading = line.match(/^\s*(#{1,4})\s+(.+?)\s*#*$/);
      if (heading) {
        const id = headingId(heading[2], usedIds);
        headingIds.set(index, id);
        headings.push({ level: heading[1].length, text: heading[2], id });
      }
    });

    const closeList = () => {
      if (list) output.push(`<${list}>${items.join('')}</${list}>`);
      list = null;
      items = [];
    };
    const closeQuote = () => {
      if (quote.length) output.push(`<blockquote>${quote.map((item) => `<p>${inlineMarkdown(item)}</p>`).join('')}</blockquote>`);
      quote = [];
    };
    const renderToc = () => {
      if (!headings.length) return '<nav class="markdown-toc" aria-label="目录"><strong>目录</strong></nav>';
      const hierarchy = [];
      const tocHeadings = headings.map((item) => {
        while (hierarchy.length && item.level <= hierarchy[hierarchy.length - 1]) hierarchy.pop();
        const entry = { ...item, depth: hierarchy.length + 1 };
        hierarchy.push(item.level);
        return entry;
      });
      let currentDepth = 0;
      let links = '';
      tocHeadings.forEach((item, index) => {
        if (index === 0) {
          links += '<ol class="markdown-toc__list">';
          currentDepth = item.depth;
        } else if (item.depth > currentDepth) {
          links += '<ol class="markdown-toc__list">';
          currentDepth = item.depth;
        } else {
          while (item.depth < currentDepth) {
            links += '</li></ol>';
            currentDepth -= 1;
          }
          links += '</li>';
        }
        links += `<li class="markdown-toc__level-${item.level}"><a href="#${escapeHtml(item.id)}">${inlineMarkdown(item.text)}</a>`;
      });
      while (currentDepth > 0) {
        links += '</li></ol>';
        currentDepth -= 1;
      }
      return `<nav class="markdown-toc" aria-label="目录"><strong>目录</strong>${links}</nav>`;
    };
    const renderTable = (headerLine, separatorLine, bodyLines) => {
      const headers = splitTableRow(headerLine);
      const separators = splitTableRow(separatorLine);
      const headerCells = headers.map((cell, index) => {
        const align = tableAlignment(separators[index] || '');
        return `<th${align ? ` style="text-align:${align}"` : ''}>${inlineMarkdown(cell)}</th>`;
      }).join('');
      const rows = bodyLines.map((line) => {
        const cells = splitTableRow(line);
        return `<tr>${headers.map((_, index) => {
          const align = tableAlignment(separators[index] || '');
          return `<td${align ? ` style="text-align:${align}"` : ''}>${inlineMarkdown(cells[index] || '')}</td>`;
        }).join('')}</tr>`;
      }).join('');
      return `<div class="markdown-table-wrap"><table><thead><tr>${headerCells}</tr></thead>${rows ? `<tbody>${rows}</tbody>` : ''}</table></div>`;
    };

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      if (code) {
        if (/^\s*```/.test(line)) {
          output.push(`<pre><code class="language-${escapeHtml(language)}">${escapeHtml(codeLines.join('\n'))}</code></pre>`);
          code = false;
          codeLines = [];
          language = '';
        } else {
          codeLines.push(line);
        }
        continue;
      }

      const fence = line.match(/^\s*```\s*([\w-]*)\s*$/);
      if (fence) {
        closeList();
        closeQuote();
        code = true;
        language = fence[1] || 'text';
        continue;
      }
      if (!line.trim()) {
        closeList();
        closeQuote();
        continue;
      }

      if (/^\s*\[TOC\]\s*$/i.test(line)) {
        closeList();
        closeQuote();
        output.push(renderToc());
        continue;
      }

      if (index + 1 < lines.length && isTableSeparator(lines[index + 1]) && splitTableRow(line).length > 1) {
        closeList();
        closeQuote();
        const body = [];
        let cursor = index + 2;
        while (cursor < lines.length && lines[cursor].trim() && lines[cursor].includes('|')) {
          body.push(lines[cursor]);
          cursor += 1;
        }
        output.push(renderTable(line, lines[index + 1], body));
        index = cursor - 1;
        continue;
      }

      const heading = line.match(/^\s*(#{1,4})\s+(.+?)\s*#*$/);
      if (heading) {
        closeList();
        closeQuote();
        output.push(`<h${heading[1].length} id="${escapeHtml(headingIds.get(index))}">${inlineMarkdown(heading[2])}</h${heading[1].length}>`);
        continue;
      }
      const quoteLine = line.match(/^\s*>\s?(.*)$/);
      if (quoteLine) {
        closeList();
        quote.push(quoteLine[1]);
        continue;
      }
      const item = line.match(/^\s*[-*+]\s+(.+)$/) || line.match(/^\s*\d+[.)]\s+(.+)$/);
      if (item) {
        closeQuote();
        const type = /^\s*\d/.test(line) ? 'ol' : 'ul';
        if (list && list !== type) closeList();
        list = type;
        items.push(`<li>${inlineMarkdown(item[1])}</li>`);
        continue;
      }
      closeList();
      closeQuote();
      output.push(`<p>${inlineMarkdown(line)}</p>`);
    }

    if (code) output.push(`<pre><code class="language-${escapeHtml(language)}">${escapeHtml(codeLines.join('\n'))}</code></pre>`);
    closeList();
    closeQuote();
    return output.join('');
  }

  function typesetMath() {
    let attempts = 0;
    const run = () => {
      if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
        if (typeof window.MathJax.typesetClear === 'function') window.MathJax.typesetClear([content]);
        window.MathJax.typesetPromise([content]).catch(() => {});
        return;
      }
      if (attempts < 40) {
        attempts += 1;
        window.setTimeout(run, 100);
      }
    };
    run();
  }

  function fileUrl(file) {
    return new URL(file.split('/').map((segment) => encodeURIComponent(segment)).join('/'), documentsBaseUrl).href;
  }

  function titleFromFile(file) {
    return file.replace(/\.md$/i, '').replace(/^\d+[-_ ]*/, '').replace(/[-_]+/g, ' ');
  }

  function refreshIcons() {
    if (window.Astudyber) window.Astudyber.refreshIcons();
  }

  function selectNote(button, file) {
    notes.querySelectorAll('.research-note').forEach((item) => item.classList.toggle('active', item === button));
    content.innerHTML = '<div class="markdown-placeholder"><i data-lucide="loader-circle"></i><p>正在加载 Markdown…</p></div>';
    refreshIcons();
    fetch(fileUrl(file), { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        return response.text();
      })
      .then((markdown) => {
        content.innerHTML = renderMarkdown(markdown);
        typesetMath();
        window.scrollTo({ top: content.getBoundingClientRect().top + window.scrollY - 25, behavior: 'smooth' });
      })
      .catch(() => {
        content.innerHTML = '<div class="markdown-placeholder"><i data-lucide="triangle-alert"></i><p>暂时无法读取这篇 Markdown，请确认文件已部署。</p></div>';
        refreshIcons();
      });
  }

  function renderNotes(category, selectFirst) {
    notes.innerHTML = '';
    category.files.forEach((entry, index) => {
      const file = typeof entry === 'string' ? entry : entry.file;
      const title = typeof entry === 'string' ? titleFromFile(file) : (entry.title || titleFromFile(file));
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'research-note';
      button.innerHTML = `<span class="research-note__index">${String(index + 1).padStart(2, '0')}</span><span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(file)}</small></span>`;
      button.addEventListener('click', () => selectNote(button, file));
      notes.appendChild(button);
      if (selectFirst && index === 0) selectNote(button, file);
    });
  }

  function renderCategories(categories) {
    const icons = ['brain-circuit', 'scan-face', 'orbit', 'sparkles'];
    categoryTabs.innerHTML = '';
    categories.forEach((category, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `research-category-tab category-tone-${index + 1}`;
      button.innerHTML = `<i data-lucide="${icons[index] || 'layers-3'}"></i><span>${escapeHtml(category.title)}</span>`;
      button.setAttribute('role', 'tab');
      button.addEventListener('click', () => {
        categoryTabs.querySelectorAll('button').forEach((item) => item.classList.toggle('active', item === button));
        renderNotes(category, true);
        refreshIcons();
      });
      categoryTabs.appendChild(button);
      if (index === 0) {
        button.classList.add('active');
        renderNotes(category, true);
      }
    });
    refreshIcons();
  }

  fetch(manifestUrl, { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then((manifest) => renderCategories(manifest.categories || [{ id: 'all', title: '全部', files: manifest.files || [] }]))
    .catch(() => {
      notes.innerHTML = '<p class="research-status is-error">未找到研究分类清单，请确认 index.json 已部署。</p>';
    });
})();
