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
cd G:\A\github\astudyber.github.io\home
python -m http.server 8000
```

然后访问 <http://localhost:8000/>。也可以在仓库根目录直接运行：

```bash
python -m http.server 8000 --directory home
```

其中 `8000` 是端口号，可按需替换为其他未占用端口。
