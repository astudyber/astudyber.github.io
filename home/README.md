# astudyber.github.io

## 1 主页

### 个人信息

- 姓名：程惠泽
- QQ：1993253962
- 邮箱：hzcheng@chd.edu.cn
- GitHub：https://github.com/astudyber
- 博客：https://blog.csdn.net/m0_57354496

### 编程语言

`C++`、`Python`、`HTML`、`CSS`、`JavaScript` 等。

### 曾用过的技术栈

`Vibe Coding`、`VS Code`、`Pycharm`、`Jupyter Notebook`、`SPSS`、`StataSE`、`Blender`、`PyQt`、`Transformers`、`PyTorch`、`JAX`、`Pandas`、`NumPy`、`Linux`、`Git`、`SQL`、`Android Studio`、`Unity 3D`、`FinalShell`、`MobaXterm`、`Typora`、`Markdown`、`爬虫`、`微信开发者工具` 等。

### 研究领域

`人工智能`、`机器学习`、`深度学习`、`强化学习`、`计算机视觉（CV）`、`多智能体（Agents）`、`多模态大模型（VLM）`、`具身模型（VLA）`、`生成模型（AIGC）`、`语音模型（ASR/TTS）` 等。

### 学历

> 待补充

## 2 实习

> 待补充

## 3 论文

> 待补充

## 4 研究

> 待补充

## 5 编程

> 待补充

## 6 获奖

> 待补充

## 页面说明

页面默认采用淡黄色 Solarized Light 风格，夜间主题沿用深色科技风；保留少量星球与表情图标作为辅助风格。页面提供全屏粒子、鼠标光点与低频流星效果，并支持主题切换；动效会遵循系统的 `prefers-reduced-motion` 设置。

## 目录结构

- `home/index.html`：六个展示页的入口
- `home/pages/`：主页、实习、论文、研究、编程、获奖六个独立页面
- `home/assets/`：公共样式与交互脚本

## 研究页 Markdown

`home/pages/research.html` 是纯静态页面。研究笔记放在 `home/dox/研究/`；浏览器加载研究页时会自动发现 Markdown，并通过 `fetch` 读取文件，在前端渲染标题、列表、引用、代码块、链接等常用语法。

新增、修改或删除笔记时：

1. 直接操作 `home/dox/研究/` 下的 `.md` 文件；
2. 本地 HTTP 预览时刷新页面即可；
3. GitHub Pages 部署时提交并推送后刷新页面即可。

本地 HTTP 静态服务器通过目录索引自动发现文件；部署到 GitHub Pages 后通过 GitHub Contents API 自动发现文件。`index.json` 仅作为 API 或目录索引不可用时的兼容回退，不再需要手工维护。GitHub Pages 不提供服务端写入能力，因此网页本身不能直接修改本地文件。直接双击 HTML 的 `file://` 预览可能被浏览器拦截，请使用本地 HTTP 静态服务器或 GitHub Pages 访问。
