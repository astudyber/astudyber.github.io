# 程惠泽个人主页

`home/index.html` 是主页入口，直接展示个人头像、联系方式、教育背景、课程与编程能力、论文成果、VLM/VLA/Agent 研究与实践经历，以及获奖荣誉。

## 目录结构

- `home/index.html`：单页个人信息主页
- `home/assets/avatar.jpg`：个人头像
- `home/assets/pages.css`：公共样式与主页布局
- `home/assets/common.js`：主题切换、日期与动效
- `home/pages/`：研究笔记等辅助页面
- `home/dox/研究/`：研究 Markdown 笔记

主页采用全宽布局，桌面端为侧栏导航，移动端自动切换为横向导航。其他页面中的“主页”链接均返回 `home/index.html`。

## 本地预览

在命令行中进入 `home/` 目录，并指定一个端口启动 Python 静态服务器：

```bash
cd .\home
python -m http.server 8000
```

然后访问 <http://localhost:8000/>。也可以在仓库根目录直接运行：

```bash
python -m http.server 8000 --directory home
```

其中 `8000` 是端口号，可按需替换为其他未占用端口。

## GitHub Pages 部署

本项目使用静态 HTML 和浏览器端 Markdown 渲染。仓库根目录的 `.nojekyll` 文件必须一并提交，确保 GitHub Pages 原样发布 Markdown 文件。

例如 `dox/研究/5.具身/1.π系列.md` 开头包含 Typora 的 YAML front matter（`---` 包围的元数据）。如果启用默认 Jekyll 构建，这类文件会被转换为 HTML，研究页请求原始 `.md` 路径时便可能返回 404。本地 Python 静态服务器不做这种转换，所以本地能正常显示。

当前 `/home/pages/research.html` 地址对应仓库根目录发布：在仓库 **Settings → Pages** 中使用 **Deploy from a branch**，选择站点所在分支及 **/(root)**。提交 `.nojekyll` 后，等待 Pages 部署成功，再用 `Ctrl+F5` 刷新研究页。可直接访问 `/home/dox/研究/5.具身/1.π系列.md`，确认返回的是 Markdown 原文。

如果改为自定义 GitHub Actions 部署，应直接上传静态文件（包括 Markdown），不要运行 Jekyll 转换；如果更换发布目录，则需将 `.nojekyll` 放在实际发布源的根目录。
