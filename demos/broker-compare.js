// 交互演示：三种券商原型横向对比（全功能券商 / 折扣券商 / API优先）。
// 用 .ochain 表，行 = 选型维度（审批层级/佣金/平台分析/API/纸上交易/适合谁）。
// 点击任一行，下方 .detail 解释这一维度的权衡。不推荐任何真实券商，只讲原型取舍。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // 三个原型（列）
  const cols = [
    { key: "full", zh: "全功能券商", en: "Full-service" },
    { key: "disc", zh: "折扣券商", en: "Discount" },
    { key: "api", zh: "API 优先", en: "API-first" },
  ];

  // 维度（行）。每格给一个简短标签 + 一个“评级”用于上色（good/mid/lite）。
  const rows = [
    {
      id: "tier",
      zh: "期权审批层级", en: "Approval tiers",
      cells: {
        full: { zh: "全层级，升级顺畅", en: "All levels, easy upgrade", lvl: "good" },
        disc: { zh: "通常全层级", en: "Usually all levels", lvl: "good" },
        api:  { zh: "全层级（偏专业）", en: "All levels (pro)", lvl: "good" },
      },
      detailZh: "审批层级决定你能做哪些策略：Level 1 备兑/保护、L2 买多头/担保看跌、L3 价差、L4 裸卖。<b>选券商第一件事就是确认你想做的策略对应需要哪一级</b>。三类原型通常都能给到高层级，差别更多在升级审核与门槛。",
      detailEn: "Tiers gate which strategies you may run: L1 covered/protective, L2 long/CSP, L3 spreads, L4 naked. <b>The first thing to confirm is which tier your intended strategy needs.</b> All three archetypes typically reach high tiers; they differ in approval friction.",
    },
    {
      id: "fee",
      zh: "佣金 / 费用", en: "Commissions / fees",
      cells: {
        full: { zh: "偏高（含服务）", en: "Higher (bundled service)", lvl: "mid" },
        disc: { zh: "低 / 近零", en: "Low / near-zero", lvl: "good" },
        api:  { zh: "低，按量计", en: "Low, per-contract", lvl: "good" },
      },
      detailZh: "真实成本 = <b>佣金 + 规费 + 价差/滑点</b>。全功能券商佣金偏高但附带研究与人工服务；折扣券商主打低佣甚至零佣，适合成本敏感者；API 优先通常按张数计费、对高频友好。<b>别只看佣金那一栏</b>——执行质量差会被滑点吃回去（阶段 10.6）。",
      detailEn: "True cost = <b>commission + fees + spread/slippage</b>. Full-service charges more but bundles research/human help; discount competes on low/zero commission; API-first bills per-contract and suits high frequency. <b>Don't read only the commission line</b> — poor execution leaks back via slippage (Stage 10.6).",
    },
    {
      id: "tools",
      zh: "平台 / 分析工具", en: "Platform / analytics",
      cells: {
        full: { zh: "最丰富（链/希腊/损益图/曲面）", en: "Richest (chain/Greeks/payoff/surface)", lvl: "good" },
        disc: { zh: "够用，偏轻量", en: "Adequate, lighter", lvl: "mid" },
        api:  { zh: "自带少，靠你写", en: "Sparse UI, you build it", lvl: "lite" },
      },
      detailZh: "策略越复杂越需要工具厚度：期权链、组合<b>净希腊字母</b>（阶段 5.1）、<b>损益图</b>、多腿组合单、风控视图。全功能券商一应俱全甚至给波动率曲面；折扣 App 多为基础链 + 简单下单；API 优先界面薄，分析<b>靠你用 Python 自己搭</b>（阶段 11.3）。",
      detailEn: "Complex strategies need tool depth: the chain, portfolio <b>net Greeks</b> (Stage 5.1), <b>payoff diagrams</b>, multi-leg combo orders, risk views. Full-service has it all (even a vol surface); discount apps give a basic chain + simple tickets; API-first is thin on UI — you <b>build analytics yourself in Python</b> (Stage 11.3).",
    },
    {
      id: "api",
      zh: "API 接口", en: "API access",
      cells: {
        full: { zh: "部分提供", en: "Sometimes", lvl: "mid" },
        disc: { zh: "多数没有/有限", en: "Often none/limited", lvl: "lite" },
        api:  { zh: "核心卖点：数据+下单+沙盒", en: "Core: data+orders+sandbox", lvl: "good" },
      },
      detailZh: "想用 Python 拉数据、跑回测、自动下单（阶段 11.4、11.5），<b>API 几乎是决定性的</b>：行情/历史数据、下单（限价/组合单）、纸上交易沙盒、合理限频与好文档。API 优先券商以此为核心；折扣 App 多半没有或很有限。",
      detailEn: "To pull data, backtest, and auto-trade in Python (Stages 11.4, 11.5), <b>an API is near-decisive</b>: market/historical data, order placement (limit/combo), a paper sandbox, sane rate limits, good docs. API-first brokers are built around this; discount apps often lack it.",
    },
    {
      id: "paper",
      zh: "纸上交易", en: "Paper trading",
      cells: {
        full: { zh: "完善，实时数据", en: "Full, real-time", lvl: "good" },
        disc: { zh: "有，或较基础", en: "Yes, sometimes basic", lvl: "mid" },
        api:  { zh: "有 API 沙盒", en: "API sandbox", lvl: "good" },
      },
      detailZh: "纸上交易 = 虚拟钱 + 真实行情，免费跑通整套下单流程（阶段 11.2）、验证理解。<b>新手最该用、却最常忽视</b>。看一眼：数据实时还是延迟？能不能测多腿与 API？好的模拟环境让你把学费交在虚拟账户里。",
      detailEn: "Paper trading = virtual money + real quotes — rehearse the full order flow (Stage 11.2) for free and validate your understanding. <b>Most useful for beginners, most often skipped.</b> Check: real-time or delayed? Can it test multi-leg and the API? A good sandbox lets you pay tuition in fake money.",
    },
    {
      id: "who",
      zh: "适合谁", en: "Best for",
      cells: {
        full: { zh: "想要研究+服务的交易/对冲者", en: "Traders/hedgers wanting research+service", lvl: "good" },
        disc: { zh: "成本敏感的自助交易者", en: "Cost-sensitive DIY traders", lvl: "good" },
        api:  { zh: "做量化/自动化的开发者", en: "Quant/automation developers", lvl: "good" },
      },
      detailZh: "<b>没有“最好的券商”，只有“最合你打法的券商”</b>。要人工服务与最全工具→全功能；只想低成本自助下单→折扣；要程序化数据与自动交易→API 优先。先用审批层级筛掉做不了你策略的，再用这几把尺子按你是持有者/交易者/量化打分。",
      detailEn: "<b>There is no 'best broker', only the one that fits your playbook.</b> Want service + the fullest tools → full-service; just want cheap DIY tickets → discount; need programmatic data + automation → API-first. Filter first by approval tier, then score by these rows as a holder / trader / quant.",
    },
  ];

  const lvlCls = { good: "itm", mid: "", lite: "otm" };       // 借用 .ochain 的着色类
  const lvlDot = { good: "●", mid: "◐", lite: "○" };

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🏦 ${T("券商原型对比：按你的打法挑，而不是只比便宜", "Broker archetypes: pick by your playbook, not just price")}</div>
      <div class="demo-meta" style="margin-bottom:10px">${T("点击任意一行 → 看这个维度的权衡。（● 强 · ◐ 中 · ○ 轻）",
        "Click any row → see that dimension's trade-off. (● strong · ◐ medium · ○ light)")}</div>

      <table class="ochain" id="bc-table">
        <thead>
          <tr>
            <th style="text-align:left">${T("维度", "Dimension")}</th>
            ${cols.map((c) => `<th>${en ? c.en : c.zh}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map((r, i) => `
            <tr data-i="${i}" style="cursor:pointer">
              <td class="strike-col" style="text-align:left">${en ? r.en : r.zh}</td>
              ${cols.map((c) => {
                const cell = r.cells[c.key];
                return `<td class="${lvlCls[cell.lvl]}"><span style="opacity:.7">${lvlDot[cell.lvl]}</span> ${en ? cell.en : cell.zh}</td>`;
              }).join("")}
            </tr>`).join("")}
        </tbody>
      </table>

      <div id="bc-detail"></div>

      <p class="demo-tip">${T(
        "三类只是<b>原型</b>，不是具体推荐——现实中很多券商是混合体。关键是把每一维度对照<b>你自己</b>（持有者/交易者/量化）去权衡：先用<b>审批层级</b>筛掉做不了你策略的，再看佣金、工具、API、纸上交易（阶段 11.1）。",
        "These three are <b>archetypes</b>, not specific recommendations — real brokers are often hybrids. Weigh each dimension against <b>yourself</b> (holder/trader/quant): filter first by <b>approval tier</b>, then commissions, tools, API, paper trading (Stage 11.1)."
      )}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  let active = 0;

  function renderDetail() {
    const r = rows[active];
    $("#bc-detail").innerHTML = `
      <div class="detail">
        <div style="margin-bottom:6px"><span class="pill acc">${en ? r.en : r.zh}</span></div>
        <div>${en ? r.detailEn : r.detailZh}</div>
        <div class="demo-row" style="margin-top:10px;gap:14px">
          ${cols.map((c) => {
            const cell = r.cells[c.key];
            const color = cell.lvl === "good" ? "var(--green)" : cell.lvl === "lite" ? "var(--muted)" : "var(--accent-ink)";
            return `<span class="dk"><b style="color:${color}">${lvlDot[cell.lvl]} ${en ? c.en : c.zh}</b>: ${en ? cell.en : cell.zh}</span>`;
          }).join("")}
        </div>
      </div>`;
    $("#bc-table").querySelectorAll("tr[data-i]").forEach((tr) => {
      tr.style.background = +tr.dataset.i === active ? "var(--accent-soft)" : "";
    });
  }

  $("#bc-table").addEventListener("click", (e) => {
    const tr = e.target.closest("tr[data-i]"); if (!tr) return;
    active = +tr.dataset.i;
    renderDetail();
  });

  renderDetail();
}
