# 期权之路 · 课程编写指南（Authoring Guide）

写课的人（人或 AI 子代理）先读这份，再照着 `content/lessons/stage1-call.js`（黄金范例）填空。
**内容与代码分离**：你只写「课文对象」和「演示 mount 函数」，绝不改 `app.js` / `styles.css` / `manifest.js` 的内核逻辑。

## 1. 一节课 = 一个默认导出的对象

文件放在 `content/lessons/stageX-<id>.js`，结构如下（字段顺序照范例）：

```js
export default {
  id: "call-option",            // 与 manifest 里的 id 完全一致
  stage: 1, order: 1,
  title: "看涨期权 Call：买入的权利",
  difficulty: 1,                // 1 基础 / 2 进阶 / 3 高级，与 manifest 一致
  prereqs: ["call-put-rights"], // 前置课 id（会渲染成可点链接）；可为 []
  oneLiner: "一句话点睛，可含 **加粗** 与 `代码`。",
  intuition: `直觉解释……结尾用一段「**这一节，我们把……拆成 N 块：**」+ 一组 - 列表当“主干地图”。`,
  mechanics: `深入原理，用 ### 小标题拆 3~6 个分支；可用 $$ 公式块。`,
  demo: "call-payoff",          // 对应 demos/call-payoff.js；没有演示就删掉本行
  analogy: `一个贴近生活的类比（房子订金、保险、租金……）。`,
  misconceptions: ["**“误解原文。”** —— 纠正……", "……"],  // 3~5 条
  quiz: [{ q: "题干（可含数字计算）", options: ["A","B","C","D"], answer: 2, explain: "**解析**……" }], // 3~4 题
  further: [{ label: "来源名（中文说明）", url: "https://…" }],  // 2~4 条权威外链
};
```

## 2. 正文支持的极简 Markdown

`**加粗**`（正文里会自动荧光高亮）· `` `代码` `` · `[文字](https链接)` · `- 列表` · `> 引用` · `### 小标题` · 空行分段 ·
`$$ 公式`（以 `$$` 开头的块＝公式框，块内每行用换行；公式里别用 `**`）。

## 3. 知识卡片与超链接（自动，无需手动写）

- **术语小卡片**：`content/glossary.js` 里的词，在每节**首次出现**时自动加虚线下划线 + 悬浮释义。
  → 你只要在正文**自然地用上这些术语**（看涨期权、权利金、行权价、隐含波动率、Delta、Theta……）即可，渲染器会处理。
  → 若用到术语表里没有的重要新词，可在 `glossary.js` 追加一条（中英各 terms+def，def 内用弯引号 “ ”）。
- **课程交叉引用**：在正文写「阶段 X.Y」（如 `阶段 5.2`）会自动变成跳转链接。**多用它把知识串成网**，
  X=阶段号、Y=该阶段第几节（见 manifest 顺序）。也可写「回扣 X.Y」。

## 4. 写作风格（务必遵守）

- **既专业有深度，又用大白话和例子讲清**。每个抽象概念都配一个具体数字例子（带单位、带 ×100 合约乘数）。
- 直觉版要让**零基础**也能懂；深入原理可上公式与术语，但每个公式都要先说“它在算什么”。
- 多用 **加粗** 标出关键结论；列表化、口语化；避免空话套话。
- 涉及金额记得**合约乘数 ×100**（美股个股期权）。涉及卖方要点明**风险/保证金**。
- 适度、自然地穿插**量化与 AI**视角（尤其原理层之后）：如“这个量后面会用蒙特卡洛估计”“做市商靠它做 Delta 对冲”。
- 适当提示风险，但不喧宾夺主；**不构成投资建议**。

## 5. 演示 = `demos/<name>.js`，默认导出 `mount(root, lang)`

- 双语：`const en = lang === "en";` 然后所有可见文案都 `en ? "English" : "中文"`。
- 只用 `styles.css` 里已有的类（`.demo`、`.demo-block`、`.demo-slider`、`.demo-seg`、`.stat-row/.stat`、
  `.demo-btn`、`.bar2`、`.cmp`、`.scn`、`.ochain`、`.legs/.leg`、`.term`、`.chart`、`.payoff` 等）。需要新类就加到 styles.css 末尾，别改旧类。
- **损益图**：`import { payoffSVG, payoffBlock, netPL, legPL } from "./_payoff.js";`
  - `payoffSVG({legs, lo, hi, spot, spotLabel, uid})` → `{svg, breakevens, ymin, ymax}`；`payoffBlock(res, legend)` 包成带图例的卡片。
  - leg：`{type:'call'|'put'|'stock', side:'long'|'short', strike, premium, qty, entry}`（每股口径，展示金额再 ×100）。
- **定价/希腊字母**：`import { bsPrice, greeks, impliedVol, normCDF } from "./_bs.js";`
  - `greeks({S,K,T,r,sigma,type,q})` → `{price,delta,gamma,theta,vega,rho}`（vega/% · theta/天 · rho/%）。
- **通用曲线图**（希腊字母曲线、波动率微笑、时间衰减、蒙特卡洛路径等）：优先用共享引擎
  `import { lineChart, chartBlock } from "./_chart.js";`
  - `lineChart({fns:[{f, cls, label}], lo, hi, xlabel, markerX, markerLabel, forceZero})` → `{svg, ymin, ymax}`；
    `f(x)` 返回 y；`cls`：`'line'`(青)/`'line2'`(金)/`'line3'`(红)。`chartBlock(res, [[color,label],…])` 加图例。
  - 例：`lineChart({fns:[{f:(S)=>greeks({S,K:100,T:0.25,r:0.04,sigma:0.2,type:'call'}).delta, cls:'line'}], lo:60, hi:140, markerX:100})`
  - 需要更特别的图（如蒙特卡洛多路径）再自己拼 `<svg>`，类名同上。
- 演示要**真算**、可交互（滑块/按钮/分段切换），并给一句 `.demo-tip` 点出“看什么”。
- 共享引擎文件名以 `_` 开头（`_payoff.js`、`_bs.js`），不会被当作课程演示直接加载。

## 6. 缓存（开发时）

改了 `lessons/` 或 `demos/` 后，把 `app.js` 里的 `const V` +1；改 `app.js`/`styles.css` 后把 `index.html` 的 `?v=N` +1；
改 `manifest.js`/`glossary.js` 后把 `app.js` 顶部对应 `?v=` 和 `index.html` 的 `app.js?v=` 一起 +1。

## 7. 质量自检

- [ ] 七个区块齐全（直觉、原理、演示、类比、误解、自测、延伸），且与范例深度相当。
- [ ] 至少 2~3 个「阶段 X.Y」交叉引用；自然用上若干术语表词。
- [ ] 演示能跑、真算、双语、用既有 CSS 类，且有 `.demo-tip`。
- [ ] 数字例子正确（含 ×100、盈亏平衡、最大盈亏）。
- [ ] quiz 的 `answer` 索引对得上正确选项，`explain` 给出算式/理由。
