# 学间 · 雅思日记与学习手记 (IELTS Diary & Study Workbench)

> 面向日常雅思备考与内容创作的沉浸式工作台。先留下真实经历，再整理成型日记与实战专栏。
> **“0报班 0外教 纯靠AI” 的真实自学日常与创作沉淀池。**

[![Deploy](https://img.shields.io/badge/Deploy-Cloudflare_Workers-F38020?logo=cloudflare)](https://ielts-diary.yaemra531.workers.dev)
[![Framework](https://img.shields.io/badge/Framework-Vinext_React19-000000?logo=react)](https://github.com/yaemra531-stack/diary-content-system)
[![CSS](https://img.shields.io/badge/Styling-Tailwind_v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Database](https://img.shields.io/badge/Database-Cloudflare_D1-F38020?logo=sqlite)](https://developers.cloudflare.com/d1/)
[![Status](https://img.shields.io/badge/Status-Active_Production-emerald)](https://ielts-diary.yaemra531.workers.dev)

* **线上生产地址**：[https://ielts-diary.yaemra531.workers.dev](https://ielts-diary.yaemra531.workers.dev)
* **GitHub 仓库**：[https://github.com/yaemra531-stack/diary-content-system](https://github.com/yaemra531-stack/diary-content-system)
* **创作者宇宙总母港**：[https://github.com/yaemra531-stack](https://github.com/yaemra531-stack)

---

## 🌟 核心功能模块

系统包含三大核心创作流模块，从碎片灵感捕获到成型文章输出，形成完整闭环：

### 1. 随手记 (Quick Capture) —— 零心理门槛素材池
- **六大备考板块**：单词、听力、阅读、口语、写作、心得。
- **闪念即时留存**：支持 Markdown 简记与最多 6 张实拍附图或题目截图。
- **断网防丢保护**：未提交输入毫秒级暂存于本机 IndexedDB，支持跨刷新恢复；已提交数据持久化至 Cloudflare D1 与 R2。
- **快捷键秒存**：支持 `⌘ + Enter` / `Ctrl + Enter` 一键保存。

### 2. 写作挑战 (Challenge Studio) —— 沉浸式实战写作工作台
- **30 篇实战选题池**：基于备考真实痛点挖掘的 30 个精选写作选题，解绑按天强制日期的压力，采用自由编号（`Challenge 1 ~ 30`），想写哪个就写哪个。
- **1:1 左右双栏对称画卷**：
  - **第 1 行**：左侧标题自定义编辑 ↔ 右侧实时排版标题展示；
  - **第 2 行**：左侧三档火苗优先级设置 ↔ 右侧内容属性自由切换（`卡点` / `发现` / `随笔`），高度对等对齐；
  - **第 3 行**：左侧 Markdown 纯净输入框 ↔ 右侧 GFM 实时排版渲染容器（双边框、内嵌滚动条、智能估算阅读时长）。
- **写稿防误触与自动暂存**：打字输入、优先级切换或属性调整时，系统毫秒级静默暂存至本地缓存。误触弹窗外空白、误按 `Esc` 甚至断电刷新，再次打开原样恢复，绝不丢稿。
- **心流快捷键**：
  - `⌘ + S` / `Ctrl + S`：原地快速保存并更新挑战进度（弹窗保持打开，打字心流不中断）；
  - `⌘ + Enter` / `Ctrl + Enter`：一键保存并关闭弹窗。
- **灵活排序与筛选**：支持按全量、`🔥🔥🔥 核心`、`🔥🔥 重点`、`🔥 常规` 及待写状态单键过滤，支持按优先级动态排序。

### 3. 日记整理与多维度导出 (Studio & Export)
- **多素材并排整理**：自由挑选单条或多条随手记，与日记编辑画卷左右并排对照。
- **优雅 Markdown 导出**：支持按范围（今日 / 昨日 / 星标 / 自定义日期 / 全量）一键打包素材为干净规范的 Markdown，支持语法高亮预览、剪贴板一键复制与 `.md` 文件直接下载。
- **AI 协同整理友好**：一键生成结构化整理 Prompt，方便直接送入 AI 对话整理成型日记。

---

## 🎨 设计哲学与视觉审美

1. **坚持做减法，拒绝繁琐打卡**：
   - 彻底移除了“打卡条目”、“积分奖励”等制造焦虑的要素；
   - 彻底剔除了生硬的「认知+做法」框式模板，给创作者无限自由的书写画布；
   - 移除了刺眼的高饱和度红绿圆点，改用低饱和、温和典雅的灰阶与暖调。
2. **护眼暖墨夜间模式 (Warm Ink Dark Mode)**：
   - 一键无缝切换温暖低对比度的暖墨纸张暗色，深度适配夜晚与昏暗光线下长期沉浸写作。
3. **像素级对齐与对称感**：
   - 弹窗双栏采用 1:1 标准对等分割，标题栏、属性按钮组与正文排版框完全对称呼应。

---

## 🛠️ 技术栈与架构

| 层次 | 技术选型 | 说明 |
| :--- | :--- | :--- |
| **前端运行时** | React 19 + Vinext | Next.js 兼容的高性能轻量 Vite SSR / Edge 方案 |
| **样式与组件** | Tailwind CSS v4 + Radix UI + Lucide Icons | 最新 Tailwind 现代样式体系，极简无边框设计 |
| **Markdown 引擎**| Marked (GFM 支持) | 毫秒级极速 Markdown 解析与实时排版渲染 |
| **边缘计算** | Cloudflare Workers | 全球边缘无冷启动秒开部署 |
| **数据库** | Cloudflare D1 (SQLite) + Drizzle ORM | 强类型数据建模与低延迟边缘读取 |
| **对象存储** | Cloudflare R2 | 记录配图无损高并发存储 |

---

## 💻 本地运行与维护

### 环境准备
- Node.js >= 22.13.0
- npm / pnpm

### 本地启动
```bash
# 1. 安装依赖
npm install

# 2. 启动本地开发服务
npm run dev

# 3. TypeScript 类型检查
npx tsc --noEmit
```

### 生产构建与部署
```bash
# 1. 生产打包构建
npm run build

# 2. 边缘发布到 Cloudflare Workers
npx -y wrangler deploy --config dist/server/wrangler.json
```

---

## 📜 许可证与创作者生态

本项目作为 **瓦斯 · 创作者宇宙** 的【雅思 × AI】前锋工程开源，采用 MIT License 开源协议。
记录真实发生的事情，用 AI 重塑日常学习与创作流。
