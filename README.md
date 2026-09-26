# Droplet Labs · 期权之路 · Options Path

> 🔗 **在线体验 / Live**：<https://evidex-cloud.github.io/droplet-labs-options-path/>

一门**中英双语、从零到专家**的期权课程：期权在做什么、为什么值这个价、怎样用它们表达观点和管理风险——以及 0DTE、加密期权、永续合约与 AI 的今天。
A bilingual (Chinese / English) options course from zero to expert: what options do, why they cost what they cost, how to express a view and manage the risk — and today's world of 0DTE, crypto options, perpetuals and AI.

> ⚠️ **仅供教育，不构成投资建议。** 期权与永续都是高风险工具。所有数字与演示均为教学用途；当前市场数据带日期与来源。
> Education only — nothing here is investment advice.

## v3 · 2026 年 9 月全面重写 / Full renewal (September 2026)

v3 是一次从头到尾的重写，不是修订：

- **17 个阶段、99 节课，五个层级**：入门（看懂期权）→ 原理（定价、波动率与希腊字母）→ 策略（策略与风险管理）→ 市场（市场结构、期货与永续）→ 精通（量化、AI 与实战）。每个阶段以“它回答什么问题”开头。
- **一条主线，四个观念**：① 形状（凸性）② 无套利（复制）③ 波动率 ④ 风险（希腊字母与杠杆）。每节课开头的“我们走到哪了”说明它落在哪个观念上、接着哪一课；结尾的“下一课”说明为什么要往下走。
- **贯穿全课的例子**：小凯（Kai）持有 100 股虚构股票 XYZ（100 美元、隐含波动率 20%、利率 4%），全课的标准数字都由同一个经过测试的引擎算出，前后一致。
- **真正的公式**：所有公式用 KaTeX 排版（本地 vendored，离线可用），每个公式后面都有逐项说明和代入真实数字的算例。
- **可视化与交互**：226 张手绘 SVG 图示、207 个交互演示——每节课都有图示、一个主演示和 1–2 个嵌在正文里的小演示；演示全部在浏览器里真算（Black-Scholes 与全部希腊字母、隐含波动率、二叉树、蒙特卡洛、有限差分、Heston/SABR/SVI、VIX 式方差、对冲模拟、资金费与强平……）。
- **新增的前沿与缺失主题**：价格边界、远期与箱式价差、随机游走与 √T、期权价格里的概率分布（Breeden–Litzenberger）、事件波动率与曲面、二阶希腊、离散度与系统化波动率策略、期权数据管线、波动率预测（GARCH/HAR/ML）、交易成本分析、粗糙波动率与无套利曲面、深度对冲、神经网络定价、强化学习做市、LLM 信号、带护栏的 AI 智能体、基差交易、毕业项目。
- **界面**：采用 Droplet Labs 品牌设计语言（与新金融之路一致）：纸色背景、Outfit 字体、黑色悬浮导航、三栏课程页（目录抽屉 / 正文 / 本页目录）、术语悬浮卡、手机适配。

## 本地运行 / Run locally

```bash
python -m http.server 8780
```

然后打开 <http://localhost:8780/>（Windows 可双击 `launch.bat`）。不要直接双击 `index.html`——课程内容按需加载，需要本地服务器。`?lang=en` / `?lang=zh` 可直接指定语言。

## 目录结构 / Layout

```
index.html · app.js · styles.css · math.js     外壳、渲染器（Markdown + KaTeX）、设计系统、公式排版
content/manifest.js                           课程地图（由 tools/curriculum.mjs 生成）
content/glossary.js                           术语卡（由 tools/merge_glossary.mjs 生成）
content/lessons/zh/<id>.md, en/<id>.md        99 节课 × 2 种语言（格式见 AUTHORING.md）
demos/_opt.js                                 共享期权引擎（纯函数，已测试）
demos/_viz.js                                 图表、损益图与控件
demos/<id>.js, <id>-<suffix>.js               每节课的主演示与嵌入式演示
vendor/katex/                                 KaTeX 0.16（本地）
tools/                                        校验与生成工具
```

## 写课与校验 / Authoring & checks

写课前先读 **`AUTHORING.md`**（主线、贯穿例子与标准数字、Markdown 格式、公式与图示规范、演示 API、每节课的蓝图）。

```bash
node tools/test_opt.mjs          # 引擎自测（与 Hull/Haug 教材值、平价、收敛、有限差分希腊字母核对）
node tools/check.mjs [ids…]      # 结构、链接、长度、图示、每个公式（KaTeX）、“$ 只表示钱”规则、演示契约
node tools/smoke.mjs [demos…]    # 在无头 DOM 里挂载每个演示（中英双语）并点击所有控件（需要 linkedom）
node tools/curriculum.mjs        # 由课程结构重新生成 content/manifest.js
node tools/merge_glossary.mjs    # 合并 content/glossary-proposals/*.json 到术语表
```

改了课文或演示后，把 `app.js` 里的 `const V` 加 1；改了 `app.js`/`styles.css` 后把 `index.html` 里的 `?v=` 加 1。

## 发布 / Publishing

纯静态站点，全部相对路径；GitHub Pages 从 `main` 根目录直接部署。**`.nojekyll` 不能删**（`demos/_opt.js`、`_viz.js` 以下划线开头）。`_research/` 与 `content/glossary-proposals/` 不发布（见 `.gitignore`）。

---

Developed by **Droplet Labs** · <https://dropletlabs.xyz/>
