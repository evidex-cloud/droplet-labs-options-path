# Droplet Labs · 期权之路 · Options Path

一个**本地优先、中文为主（双语框架）**的期权学习工具：把期权从零到专家拆成一条主线，让任何零基础的人都能一步步走到「看懂希腊字母、设计组合策略、用 Python 定价回测、在 AI 时代自动化执行」。

与姊妹项目 [聪之路 · Satoshi Path](../satoshi-path) **同一套渲染内核与设计语言**，灵感同源（aipath 的「路线 → 阶段 → 例子 → 选择」体验）。

> ⚠️ **仅供教育，不构成投资建议。** 期权是高风险工具，买方可能损失全部权利金、卖方风险甚至无限。所有数字与演示均为教学简化。

## 特性

- **一条主线，12 个阶段、69 节课**，分 4 个深度层（入门 → 原理 → 策略系统 → 精通），后面的硬核都建立在前面的直觉之上。
- **真能算的演示**：每节配一个浏览器内交互演示，很多是**真算**——真实 Black-Scholes 定价、实时希腊字母曲线、蒙特卡洛模拟、可拖动的损益图、二叉树倒推、隐含波动率反解、Delta 对冲模拟、回测陷阱。
- **固定模板，认知负担最小**：直觉 → 深入原理（可折叠）→ 演示 → 类比 → 常见误解 → 自测 → 延伸阅读。
- **量化 × AI 贯穿全程**：从风险中性定价、波动率建模，到深度对冲、强化学习做市、用 LLM/智能体研究编码执行策略、算法执行与 TCA。
- **知识卡片与交叉引用**：术语自动加悬浮释义小卡片（词库 60+ 条）；正文里「阶段 X.Y」自动变成跳转链接，把知识串成网。
- **难度评级与学习目标**：每节标 ★ 基础 / ★★ 进阶 / ★★★ 高级；选新手 / 交易者 / 对冲者 / 量化后，相关课高亮、无关课弱化。
- **本地优先**：进度只存在你自己浏览器的 `localStorage`，纯本地、不上传。
- **完整中英双语**：右上角随时切换 EN / 中文，**全部 69 节中、英文正文均已就绪**（英文在 `content/lessons/en/`，由专业翻译产出并逐一校验；万一某节英文缺失会优雅回退中文）。
- **纯静态、零依赖、无构建**：原生 HTML/CSS/JS（ES modules），没有后端、没有打包步骤。

## 本地运行

双击 **`launch.bat`**（需已装 Python），它会起本地服务器并打开 `http://localhost:8780/`。

或手动：

```bash
python -m http.server 8780
# 然后浏览器打开 http://localhost:8780/
```

> ⚠️ **请勿直接双击 `index.html`。** 课程内容与演示都是按需 `import` 的，需要一个本地服务器（`http://localhost`）。

## 发布到 GitHub Pages

纯静态站点，全部用**相对路径**，对 GitHub Pages 安全。步骤：

1. 推到一个 GitHub 仓库（如 `your-account/droplet-labs-options-path`）。
2. 仓库 **Settings → Pages → Build and deployment**：Source 选 **Deploy from a branch**，分支选 **`main` / `(root)`**。
3. 稍等片刻，站点上线于 `https://<account>.github.io/<repo>/`。

> ⚠️ **`.nojekyll` 不能删。** 三个共享引擎 `demos/_payoff.js`、`_bs.js`、`_chart.js` 以**下划线开头**；GitHub Pages 默认的 Jekyll 会**忽略下划线开头的文件**，导致几乎所有演示加载失败。仓库根目录的空文件 **`.nojekyll`** 会关闭 Jekyll，确保它们被原样serve。本地运行不受影响。

## 目录结构

```
options-path/
├─ index.html                 外壳（引样式与 app.js，含全站页脚）
├─ styles.css                 设计系统（浅色高级感 · Inter 字体 · 量化青 + 盈亏绿/红）
├─ app.js                     渲染器：路线图 / 课程页 / 自测 / 进度 / 双语 / 难度 / persona
├─ launch.bat                 本地启动
├─ AUTHORING.md               课程编写指南（写课/写演示的人先读这份）
├─ content/
│  ├─ manifest.js             课程地图（12 阶段、配色、目标、难度、persona）—— 路线图只读这个
│  ├─ glossary.js             术语小卡片词库（中英）
│  └─ lessons/
│     ├─ stage*-*.js          69 节中文课
│     └─ en/                  69 节英文课（同名文件，专业翻译完整版）
└─ demos/
   ├─ _payoff.js              共享损益图引擎（legPL/netPL/payoffSVG）
   ├─ _bs.js                  共享 Black-Scholes + 希腊字母引擎
   ├─ _chart.js               共享折线图引擎（lineChart）
   └─ *.js                    69 个交互演示（默认导出 mount(root, lang)）
```

**设计原则：内容与代码分离。** 课文内容才是主体；`app.js` 只是渲染器。加内容不用动核心代码。加一节课的步骤见 **`AUTHORING.md`**。

## 路线图（12 阶段）

| 层 | 阶段 |
|---|---|
| 入门 · 浅 | 0 为什么需要期权 · 1 期权基础概念 · 2 读懂与交易期权 |
| 原理 | 3 期权定价的逻辑 · 4 Black-Scholes 与波动率 · 5 希腊字母 |
| 策略系统 | 6 单腿与价差策略 · 7 组合与波动率策略 · 8 风险管理与做市视角 |
| 精通 · 深 | 9 量化期权 · 10 AI 时代的期权 · 11 动手与实战 |

---

Developed by **Droplet Labs**
