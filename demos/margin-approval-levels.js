// Inline demo for lesson margin-approval: a typical (broker-specific) approval ladder. Pick your approval level,
// then click a strategy to see whether it is allowed, what covers its worst case and which account it needs.
import { seg, onSeg } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let level = 2, pick = "csp";
  const S = [
    { id: "cc", lvl: 1, acct: T("现金或保证金", "cash or margin"), name: T("备兑看涨（持有 100 股）", "Covered call (own 100 shares)"), cover: T("你持有的股票负责交付", "the shares you own cover delivery"), worst: T("股票下跌的风险（与只持股相比少了权利金那部分）", "the stock's downside, reduced by the premium") },
    { id: "pp", lvl: 1, acct: T("现金或保证金", "cash or margin"), name: T("保护性看跌（持股 + 买看跌）", "Protective put (shares + long put)"), cover: T("付清的权利金", "the premium, paid in full"), worst: T("股价到行权价的距离 + 权利金", "distance to the strike plus the premium") },
    { id: "long", lvl: 2, acct: T("现金或保证金", "cash or margin"), name: T("买入看涨或看跌", "Buy a call or put"), cover: T("付清的权利金", "the premium, paid in full"), worst: T("权利金（小凯的 95 看跌：51 美元）", "the premium (Kai's 95 put: $51)") },
    { id: "csp", lvl: 2, acct: T("现金或保证金", "cash or margin"), name: T("现金担保看跌", "Cash-secured put"), cover: T("预留的行权价现金 K × 100（95 看跌：9,500 美元）", "strike cash K × 100 set aside (95 put: $9,500)"), worst: T("K × 100 减权利金（9,449 美元）", "K × 100 minus the premium ($9,449)") },
    { id: "spread", lvl: 3, acct: T("通常要保证金账户", "usually margin"), name: T("价差（垂直、鹰式、蝶式）", "Spreads (verticals, condors, butterflies)"), cover: T("行权价宽度 × 100（95/90：500 美元）", "strike width × 100 (95/90: $500)"), worst: T("宽度 − 收入（95/90：455 美元）", "width minus the credit (95/90: $455)") },
    { id: "nput", lvl: 4, acct: T("保证金", "margin"), name: T("裸卖看跌", "Naked (uncovered) put"), cover: T("按公式的押金（95 看跌：约 1,551 美元），随行情变化", "a formula deposit (95 put: about $1,551) that moves with the market"), worst: T("K × 100 减权利金——押金不是上限", "K × 100 minus the premium — the deposit is not a cap") },
    { id: "ncall", lvl: 4, acct: T("保证金", "margin"), name: T("裸卖看涨", "Naked (uncovered) call"), cover: T("按公式的押金（105 看涨：约 1,571 美元），随行情变化", "a formula deposit (105 call: about $1,571) that moves with the market"), worst: T("理论上无限", "unlimited in theory") },
  ];
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("权限阶梯：你的等级能做什么？", "The approval ladder: what can your level do?")}</div>
    <div class="demo-row"><span class="demo-label">${T("你的权限等级（常见四级，各券商不同）", "Your approval level (a common four-step scheme; brokers differ)")}</span>${seg("ml-l", [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"]], String(level))}</div>
    <div class="legs" id="ml-list"></div>
    <div class="detail" id="ml-d"></div>
    <p class="demo-tip">${T("看什么：每往上一级，新增的策略最坏情况就更大，所以审批更严。等级编号是券商自己定的；FINRA 只要求按活动类型审批。",
      "What to notice: each step up adds strategies with larger worst cases, so approval gets stricter. The numbering is each broker's own; FINRA only requires approval by type of activity.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const render = () => {
    $("#ml-list").innerHTML = S.map((s) => `<button type="button" class="leg demo-btn${s.id === pick ? " on" : ""}" data-id="${s.id}" style="justify-content:space-between;text-align:left;width:100%">
      <span>${T("第", "Level ")}${s.lvl}${T(" 级", "")} · ${s.name}</span><span class="tag ${s.lvl <= level ? "ok" : "bad"}">${s.lvl <= level ? T("允许", "allowed") : T("需要更高等级", "needs a higher level")}</span></button>`).join("");
    const s = S.find((x) => x.id === pick);
    $("#ml-d").innerHTML = `<div class="kv">
      <span class="k">${T("策略", "Strategy")}</span><span class="v hl">${s.name}</span>
      <span class="k">${T("常见等级", "Typical level")}</span><span class="v">${s.lvl}${s.lvl <= level ? T("（你的等级允许）", " (your level allows it)") : T("（你的等级不够）", " (above your level)")}</span>
      <span class="k">${T("账户类型", "Account")}</span><span class="v">${s.acct}</span>
      <span class="k">${T("什么在兜底", "What covers the risk")}</span><span class="v">${s.cover}</span>
      <span class="k">${T("最坏情况", "Worst case")}</span><span class="v">${s.worst}</span></div>`;
    root.querySelectorAll("[data-id]").forEach((b) => b.addEventListener("click", () => { pick = b.dataset.id; render(); }));
  };
  onSeg(root, "ml-l", (v) => { level = +v; render(); });
  render();
}
