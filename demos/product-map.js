// Main demo for lesson product-map: a feature matcher. Answer a few practical questions; each product family is
// checked against them. It shows which features match — it does not recommend a trade.
import { seg, onSeg, stats } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const ans = { und: "index", del: "any", early: "any", size: "any", hours: "any", tax: "any" };
  // Facts as of September 2026 (see lesson): exercise, settlement, size, hours, US tax category
  const P = [
    { id: "stock", name: T("个股期权（如 XYZ）", "Stock options (e.g. XYZ)"), und: "stock", del: "shares", early: true, size: "small", sizeTxt: T("XYZ：约 1 万美元", "XYZ: about $10,000"), hours: "us", hoursTxt: T("美国常规时段（约 20 个品种有盘前盘后）", "US regular hours (about 20 names add pre/post sessions)"), tax: false, note: T("美式，交割 100 股", "American, delivers 100 shares") },
    { id: "spy", name: T("SPY 期权（标普 500 ETF）", "SPY options (S&P 500 ETF)"), und: "index", del: "shares", early: true, size: "mid", sizeTxt: T("约 7.7 万美元", "about $77,000"), hours: "us", hoursTxt: T("美国常规时段", "US regular hours"), tax: false, note: T("美式，交割 100 份 ETF；任何价位一分钱报价", "American, delivers 100 ETF shares; penny quotes at all prices") },
    { id: "xsp", name: T("XSP 期权（迷你 SPX）", "XSP options (Mini-SPX)"), und: "index", del: "cash", early: false, size: "mid", sizeTxt: T("约 7.7 万美元", "about $77,000"), hours: "us", hoursTxt: T("美国交易时段（延长时段以 Cboe 为准）", "US hours (check Cboe for extended sessions)"), tax: true, note: T("欧式，现金结算，SPX 的 1/10", "European, cash-settled, 1/10 of SPX") },
    { id: "spx", name: T("SPX 期权", "SPX options"), und: "index", del: "cash", early: false, size: "large", sizeTxt: T("约 77.4 万美元", "about $774,000"), hours: "ext", hoursTxt: T("工作日几乎 24 小时（GTH）", "nearly 24 hours on weekdays (GTH)"), tax: true, note: T("欧式，现金结算；月度上午结算，SPXW 下午结算；每天都有到期", "European, cash; monthlies AM-settled, SPXW PM-settled; expiries every weekday") },
    { id: "vix", name: T("VIX 期权", "VIX options"), und: "vol", del: "cash", early: false, size: "small", sizeTxt: T("VIX × 100（2026 年 8 月底 VIX 约 14.9）", "VIX × 100 (VIX about 14.9 at end-Aug 2026)"), hours: "ext", hoursTxt: T("工作日几乎 24 小时（GTH）", "nearly 24 hours on weekdays (GTH)"), tax: true, note: T("欧式，现金结算，定价参照 VIX 期货", "European, cash-settled, priced off VIX futures") },
    { id: "ibit", name: T("IBIT 期权（比特币 ETF）", "IBIT options (bitcoin ETF)"), und: "btc", del: "shares", early: true, size: "small", sizeTxt: T("100 份 ETF 份额", "100 ETF shares"), hours: "us", hoursTxt: T("美国交易时段", "US hours"), tax: false, note: T("美式，交割 ETF 份额而非比特币；OCC 清算", "American, delivers ETF shares, not bitcoin; OCC-cleared") },
    { id: "cme", name: T("CME 比特币期权", "CME bitcoin options"), und: "btc", del: "futures", early: null, size: "large", sizeTxt: T("标的期货 5 BTC（示意 BTC 10 万美元 → 50 万美元）", "5 BTC futures (illustrative BTC $100,000 → $500,000)"), hours: "247", hoursTxt: T("2026 年 5 月 29 日起全天候", "24/7 since May 29, 2026"), tax: null, note: T("行权成期货头寸；CME 清算", "exercise into futures; CME-cleared") },
    { id: "deribit", name: T("Deribit 比特币期权", "Deribit bitcoin options"), und: "btc", del: "cash", early: false, size: "any", sizeTxt: T("以币计价", "coin-denominated"), hours: "247", hoursTxt: T("全天候", "24/7"), tax: null, note: T("欧式，常以币结算；Coinbase 旗下；不在 OCC 体系内", "European, often settled in the coin; owned by Coinbase; outside the OCC") },
  ];
  const Q = [
    ["und", T("你想表达的看法是关于……", "Your view is about…"), [["stock", T("一家公司", "one company")], ["index", T("整个美国股市", "the whole US market")], ["vol", T("波动率本身", "volatility itself")], ["btc", T("比特币", "bitcoin")]]],
    ["del", T("行权时你希望……", "At exercise you want…"), [["any", T("无所谓", "no preference")], ["shares", T("交割股票/份额", "shares delivered")], ["cash", T("只结算现金", "cash only")]]],
    ["early", T("提前指派", "Early assignment"), [["any", T("可以接受", "acceptable")], ["avoid", T("要避免", "must avoid")]]],
    ["size", T("每张合约的敞口", "Exposure per contract"), [["any", T("无所谓", "any")], ["small", T("小（≤ 2 万美元）", "small (≤ $20k)")], ["mid", T("中（5–10 万美元）", "mid ($50–100k)")], ["large", T("大（≥ 50 万美元）", "large (≥ $500k)")]]],
    ["hours", T("交易时间", "Trading hours"), [["any", T("美国常规时段即可", "US hours are fine")], ["ext", T("需要夜盘", "need overnight")], ["247", T("需要周末", "need weekends")]]],
    ["tax", T("美国第 1256 条处理", "US Section 1256 treatment"), [["any", T("不在意 / 不适用", "don't care / n.a.")], ["want", T("在意（请咨询税务专业人士）", "matters (ask a tax professional)")]]],
  ];
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("产品匹配器：哪些合约的特征符合你的需求？", "Product matcher: which contracts have the features you need?")}</div>
    ${Q.map(([k, label, opts]) => `<div class="demo-row"><span class="demo-label">${label}</span>${seg("pm-" + k, opts, ans[k])}</div>`).join("")}
    <div id="pm-stats"></div>
    <div id="pm-out"></div>
    <p class="demo-tip">${T("试试：选“整个美国股市 + 要避免提前指派 + 中等大小”，只剩 XSP；把大小改成“大”，SPX 出现；选“比特币 + 需要周末”，只剩 Deribit 和 CME。这里比较的是产品特征（截至 2026 年 9 月），不是交易建议。",
      "Try this: “the whole US market + must avoid early assignment + mid size” leaves only XSP; change size to “large” and SPX appears; “bitcoin + need weekends” leaves Deribit and CME. This compares product features (as of September 2026); it is not a trade recommendation.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const checks = (p) => {
    const c = [];
    c.push([T("标的", "Underlying"), p.und === ans.und]);
    if (ans.del !== "any") c.push([T("交割", "Delivery"), p.del === ans.del]);
    if (ans.early === "avoid") c.push([T("无提前指派", "No early assignment"), p.early === false]);
    if (ans.size !== "any") c.push([T("大小", "Size"), p.size === ans.size || p.size === "any"]);
    if (ans.hours !== "any") c.push([T("时间", "Hours"), ans.hours === "ext" ? p.hours === "ext" || p.hours === "247" : p.hours === "247"]);
    if (ans.tax === "want") c.push([T("第 1256 条", "Sec. 1256"), p.tax === true]);
    return c;
  };
  const delTxt = { shares: T("股票/份额", "shares"), cash: T("现金", "cash"), futures: T("期货头寸", "futures position") };
  const render = () => {
    const rows = P.map((p) => { const c = checks(p); return { p, c, ok: c.every((x) => x[1]), score: c.filter((x) => x[1]).length / c.length }; })
      .sort((a, b) => b.ok - a.ok || b.score - a.score);
    const full = rows.filter((x) => x.ok).length;
    $("#pm-stats").innerHTML = stats([[T("全部符合的产品", "Products matching every answer"), String(full), full ? "pos" : "neg"], [T("检查的条件数", "Conditions checked"), String(rows[0].c.length)]]);
    // one card per product (a card list reads well at 360 px, where a five-column table does not)
    const card = ({ p, c, ok }) => `<div style="border:1px solid ${ok ? "var(--orange)" : "var(--line)"};background:${ok ? "var(--orange-soft)" : "var(--surface)"};border-radius:12px;padding:10px 12px;margin:8px 0">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap"><b>${p.name}</b><span>${ok ? `<span class="tag ok">${T("全部符合", "all match")}</span>` : c.filter((x) => !x[1]).map((x) => `<span class="tag bad">✗ ${x[0]}</span>`).join(" ")}</span></div>
      <div class="demo-meta" style="margin:4px 0 6px">${p.note}</div>
      <div class="kv"><span class="k">${T("交割", "Settles into")}</span><span class="v">${delTxt[p.del]}</span>
      <span class="k">${T("每张大小", "Size per contract")}</span><span class="v">${p.sizeTxt}</span>
      <span class="k">${T("交易时间", "Hours")}</span><span class="v">${p.hoursTxt}</span></div></div>`;
    $("#pm-out").innerHTML = rows.map(card).join("");
  };
  for (const [k] of Q) onSeg(root, "pm-" + k, (v) => { ans[k] = v; render(); });
  render();
}
