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

深度学习笔记位于 `dox/研究/2.深度学习/`，共 11 篇，按《动手学深度学习》的顺序覆盖预备知识、线性网络、MLP、训练技巧、模块化、CNN、RNN、注意力、优化、分布式和推理加速。每篇包含至少 5 张图解、公式、算例及实践建议；现代扩展附原论文或官方资料，核对日期为 2026-09-21。

具身笔记位于 `dox/研究/5.具身/`，共 10 篇正式文章，涵盖模型路线、数据、仿真与强化学习，每篇至少 5 张说明图；`模板.md` 提供五类图解的写作示范，不加入阅读列表。配图分别保存在 `dox/研究/imgs/2.深度学习/` 和 `dox/研究/imgs/5.具身/`，正文沿用 `![说明](/图片名.png)`，由研究页按当前分类转换为实际地址。

本轮新增 55 张深度学习图解与 36 张具身图解，均使用内置 image_gen 生成，并对数学关系、箭头和标签进行审校。各图片目录的 `illustrations-prompts.json` 保存提示词与修订记录。图示用于解释概念，不是实测曲线或官方逐层架构；具体模型结论以正文附近的论文和官方资料链接为准。

新增或重命名文章后，同步更新 `dox/研究/index.json`，否则页面仍会请求旧文件名。正文、图片、清单和前端修改需要一起提交。研究页对长文图片采用懒加载，并保留点击放大；快速切换文章时只显示最后一次选择的结果。

本项目使用静态 HTML 和浏览器端 Markdown 渲染。仓库根目录的 `.nojekyll` 文件必须一并提交，确保 GitHub Pages 原样发布 Markdown 文件。

例如 `dox/研究/5.具身/1.π系列.md` 开头包含 Typora 的 YAML front matter（`---` 包围的元数据）。如果启用默认 Jekyll 构建，这类文件会被转换为 HTML，研究页请求原始 `.md` 路径时便可能返回 404。本地 Python 静态服务器不做这种转换，所以本地能正常显示。

当前 `/home/pages/research.html` 地址对应仓库根目录发布：在仓库 **Settings → Pages** 中使用 **Deploy from a branch**，选择站点所在分支及 **/(root)**。提交 `.nojekyll` 后，等待 Pages 部署成功，再用 `Ctrl+F5` 刷新研究页。可直接访问 `/home/dox/研究/5.具身/1.π系列.md`，确认返回的是 Markdown 原文。

如果改为自定义 GitHub Actions 部署，应直接上传静态文件（包括 Markdown），不要运行 Jekyll 转换；如果更换发布目录，则需将 `.nojekyll` 放在实际发布源的根目录。
