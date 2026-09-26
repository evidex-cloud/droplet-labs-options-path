// Inline demo for lesson broker-platform: tick what you plan to trade → the permissions, account type,
// features and warnings that follow. A decision tree turned into a checklist; no broker is named.
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const ITEMS = [
    { k: "cc", zh: "备兑看涨（已持股）", en: "Covered calls (own the shares)", tier: 1 },
    { k: "long", zh: "买入看涨/看跌", en: "Buy calls or puts", tier: 2 },
    { k: "csp", zh: "现金担保看跌", en: "Cash-secured puts", tier: 2 },
    { k: "spread", zh: "价差、铁鹰、蝶式", en: "Spreads, condors, butterflies", tier: 3 },
    { k: "naked", zh: "裸卖期权", en: "Naked short options", tier: 4 },
    { k: "index", zh: "指数期权 / 0DTE", en: "Index options / 0DTE", tier: 0 },
    { k: "crypto", zh: "加密期权", en: "Crypto options", tier: 0 },
    { k: "api", zh: "用代码研究/下单", en: "Research or trade from code", tier: 0 },
  ];
  const on = new Set(["cc", "long"]);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("从交易倒推券商要求", "From the trade back to the broker requirements")}</div>
    <div class="demo-label">${T("点选你打算做的事：", "Tick what you plan to do:")}</div>
    <div class="demo-btns" id="bpk-btns">${ITEMS.map((it) => `<button type="button" class="demo-btn" data-k="${it.k}">${T(it.zh, it.en)}</button>`).join("")}</div>
    <div id="bpk-out"></div>
    <p class="demo-tip">${T("看什么：只勾“备兑看涨 + 买入期权”（小凯的情况），要求最少；加上“裸卖”，层级、账户与风控要求一起跳升。层级的名称与编号由各券商自定。", "What to notice: with only covered calls and long options (Kai's case) the requirements are minimal; add naked selling and the tier, account and risk tools all jump. Tier names and numbers are each broker's own.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const TIER = [
    T("无特殊期权层级", "no special options tier"),
    T("最低层级：备兑开仓、保护性买入", "lowest tier: covered writing, protective buying"),
    T("买入期权（常含现金担保看跌）", "buying options (often incl. cash-secured puts)"),
    T("价差层级（有限风险多腿）", "spread tier (defined-risk multi-leg)"),
    T("最高层级：无保护（裸）卖出", "highest tier: uncovered (naked) writing"),
  ];
  const draw = () => {
    root.querySelectorAll("#bpk-btns button").forEach((b) => b.classList.toggle("on", on.has(b.dataset.k)));
    const tier = Math.max(0, ...ITEMS.filter((i) => on.has(i.k)).map((i) => i.tier));
    const margin = on.has("spread") || on.has("naked");
    const feats = [];
    feats.push(T("清晰的期权链（IV、Delta、未平仓量）", "a clean chain (IV, delta, open interest)"), T("限价单与价格提醒", "limit orders and price alerts"));
    if (on.has("long") || on.has("csp") || on.has("cc")) feats.push(T("到期前的风险图（不只看到期形状）", "a risk graph before expiry, not only the expiry shape"));
    if (on.has("spread")) feats.push(T("多腿组合单，按净价下限价", "multi-leg tickets at a net limit price"), T("按合约计的低成本", "low cost per contract"));
    if (on.has("naked")) feats.push(T("压力测试与组合希腊字母", "stress tests and aggregated Greeks"), T("保证金变化提醒", "margin-change alerts"));
    if (on.has("index")) feats.push(T("券商是否上市 SPX/XSP 等指数期权与每日到期", "the broker lists SPX/XSP-type index options and daily expiries"));
    if (on.has("crypto")) feats.push(T("所在地区可用的场所；币本位还是美元保证金", "a venue available in your jurisdiction; coin- or dollar-margined"));
    if (on.has("api")) feats.push(T("行情与下单 API、模拟交易沙盒、限频与文档", "data and order API, a paper sandbox, rate limits and docs"));
    const warns = [];
    if (on.has("naked")) warns.push(T("裸卖的亏损可能远超权利金；券商可随时提高保证金。", "Naked losses can far exceed the premium; brokers may raise margin at any time."));
    if (on.has("naked")) warns.push(T("组合保证金另有门槛：常见约 10 万–12.5 万美元以上（截至 2026 年 9 月）。", "Portfolio margin has its own minimums: commonly about $100,000–125,000+ (as of September 2026)."));
    if (margin) warns.push(T("保证金账户的日内交易规则在 2026 年 6 月 4 日起改为日内保证金标准；券商最迟可到 2027 年 10 月 20 日才切换。", "Margin-account day-trading rules moved to intraday margin standards from June 4, 2026; brokers may switch as late as October 20, 2027."));
    if (on.has("crypto")) warns.push(T("场所本身的风险（停机、清算规则、司法辖区）是产品的一部分。", "Venue risk (outages, liquidation rules, jurisdiction) is part of the product."));
    if (on.has("index")) warns.push(T("0DTE 的 Gamma 极大：一小时内盈亏可以翻转。", "0DTE gamma is huge: P&L can flip within an hour."));
    const acct = margin ? T("保证金账户（多数券商做价差都要求）", "margin account (most brokers require it for spreads)") : T("现金账户通常就够", "a cash account is usually enough");
    $("#bpk-out").innerHTML = `<div class="kv"><span class="k">${T("需要的权限", "Permission needed")}</span><span class="v hl">${TIER[tier]}</span></div>
      <div class="kv"><span class="k">${T("账户类型", "Account type")}</span><span class="v">${acct}</span></div>
      <div class="demo-label">${T("必备功能", "Must-have features")}</div>
      <div>${feats.map((f) => `<span class="tag ok">${f}</span>`).join(" ")}</div>
      ${warns.length ? `<div class="demo-label">${T("注意", "Watch out")}</div>` + warns.map((w) => `<div class="demo-log warn">${w}</div>`).join("") : `<div class="demo-log ok">${T("风险最低的一组：最坏情况事先已知。", "The lowest-risk set: the worst case is known in advance.")}</div>`}`;
  };
  root.querySelectorAll("#bpk-btns button").forEach((b) => b.addEventListener("click", () => { const k = b.dataset.k; if (on.has(k)) on.delete(k); else on.add(k); draw(); }));
  draw();
}
