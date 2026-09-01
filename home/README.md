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
