# astudyber.github.io 🌌

个人主页与静态前端展示项目。项目采用 HTML、CSS 和原生 JavaScript 构建，可直接部署到 GitHub Pages，无需后端服务。

## 🌐 在线访问

| 页面 | 地址 | 说明 |
| --- | --- | --- |
| 🧑‍💻 个人主页 | [astudyber.github.io/home](https://astudyber.github.io/home/) | 个人信息、实习、论文、研究、编程与获奖经历 |
| 🧪 动态 Demo 展示 | [astudyber.github.io/demo](https://astudyber.github.io/demo/) | 可爱风动态星球、粒子星空与交互动画 |

> 如果项目部署在自定义域名或其他仓库路径下，只需将上方链接中的域名和路径替换为实际地址即可。

## 📁 项目结构

```text
.
├── home/                    # 个人主页
│   ├── index.html           # 主页入口
│   ├── pages/               # 主页、实习、论文、研究、编程、获奖页面
│   ├── assets/              # 公共样式与交互脚本
│   └── dox/研究/             # 研究页使用的 Markdown 文档
├── demo/                    # 其他静态前端展示页的扩展目录
│   ├── index.html           # 示例入口
│   └── README.md            # 扩展说明
└── README.md               # 项目总说明
```

## ✨ 当前能力

- 🎨 支持白天 Solarized Light 淡黄色主题与夜间主题切换。
- 📄 研究页可以读取 `home/dox/研究/` 中的 Markdown 文件，并在浏览器中渲染标题、列表、引用、代码块和链接等内容。
- 🧩 每个页面均为独立静态 HTML，便于维护、部署和扩展。
- 🚀 可将新的静态页面放入 `demo/`，或按功能新建与 `home/`、`demo/` 并列的目录。
- 🌠 `demo/index.html` 提供一个纯静态动态展示样例：包含粒子星空、渐变极光、轨道动画、实时钟表和按钮交互。

## 📝 更新研究 Markdown

1. 在 `home/dox/研究/` 新建、修改或删除 `.md` 文件；
2. 刷新研究页即可查看变化；部署到 GitHub Pages 时提交并推送即可。

研究页会自动发现 Markdown：本地 HTTP 静态服务器使用目录索引，GitHub Pages 使用 GitHub Contents API。`index.json` 仍保留为离线回退清单，但不再是新增或删除文件的必填登记步骤。GitHub Pages 是静态托管服务，网页可以读取已经部署的文件，但不能直接把修改写回本地 Markdown。也就是说：编辑仓库文件 → 提交部署 → 前端展示更新。

## 🧱 新增静态展示页

推荐将每个独立作品放在单独目录中，例如：

```text
demo/
├── project-a/
│   └── index.html
└── project-b/
    └── index.html
```

完成部署后，可通过以下形式访问：

```text
https://astudyber.github.io/demo/project-a/
https://astudyber.github.io/demo/project-b/
```

当前 Demo 使用原生 CSS 动画与 Canvas 粒子效果，不依赖图片、框架或第三方 CDN。每个展示页应尽量保持自包含，资源使用相对路径，并避免依赖本地绝对路径。这样可以保证本地预览、GitHub Pages 部署和后续迁移的一致性。

## 🛠️ 本地预览

由于浏览器会限制 `file://` 页面读取 Markdown，建议在项目根目录启动本地静态服务器：

```bash
python -m http.server 8000
```

然后访问：<http://localhost:8000/home/> 或 <http://localhost:8000/demo/>。

## 📌 维护建议

- 保持目录职责清晰：个人资料放入 `home/`，实验性或独立作品放入 `demo/`。
- 新增页面时同步补充 README，说明用途、入口和依赖。
- 尽量使用语义化 HTML、可访问的交互控件和响应式布局。
- 提交前检查资源路径、移动端布局以及浅色/深色主题表现。

---

Built with curiosity and care · `astudyber.github.io` 💫
