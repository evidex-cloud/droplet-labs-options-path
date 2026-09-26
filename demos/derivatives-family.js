// Inline demo for lesson derivatives: match each description to the family member it describes, then reveal the
// full comparison table.
import { tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const P = {
    fwd: T("远期", "Forward"), fut: T("期货", "Futures"), swap: T("互换", "Swap"), opt: T("期权", "Option"), perp: T("永续合约", "Perpetual"),
  };
  const Q = [
    { a: "opt", q: T("买方先付一笔钱，换来一个“可以不履行”的权利。", "The buyer pays up front for a right they may choose not to use."),
      why: T("只有期权把权利和义务分开：买方付权利金、握有选择；卖方收钱、承担义务。", "Only an option splits right from obligation: the buyer pays a premium and holds the choice; the seller takes the money and the obligation.") },
    { a: "fwd", q: T("农夫和面包师私下签字：半年后按 100 美元/吨交割 1,000 吨小麦，条款随便谈。", "A farmer and a baker sign privately: 1,000 tonnes of wheat at $100 a tonne in six months, terms negotiated freely."),
      why: T("私下、定制、到期一次性交割——这是远期。它的弱点是对手方可能违约。", "Private, custom, settled once at the end — a forward. Its weak spot is that the other side may default.") },
    { a: "fut", q: T("在交易所买卖的标准化合约，每天按收盘价结算盈亏，亏了要补保证金。", "A standardised exchange contract whose gains and losses are settled every day; losers top up margin."),
      why: T("标准化 + 交易所 + 每日盯市——这是期货。清算所站在中间，违约风险大大降低。", "Standardised, exchange-traded, marked to market daily — futures. The clearing house in the middle shrinks default risk.") },
    { a: "swap", q: T("公司每季度付固定利率、收浮动利率，连续五年。", "A company pays a fixed rate and receives a floating rate every quarter for five years."),
      why: T("定期交换两串现金流——这是互换，可以看成一串远期绑在一起。", "Regularly exchanging two streams of payments — a swap, which is really a string of forwards tied together.") },
    { a: "perp", q: T("没有到期日；多空双方定期互付“资金费”，让价格贴住现货。", "No expiry date; longs and shorts pay each other a periodic funding fee that keeps the price close to spot."),
      why: T("永续合约是 2016 年由 BitMEX 推出的加密世界发明，靠资金费代替到期交割。", "The perpetual, launched by BitMEX in 2016, is crypto's invention: funding payments replace expiry.") },
    { a: "opt", q: T("最多只会亏掉一开始付出的那笔钱，但上涨空间不封顶。", "The most you can lose is what you paid at the start, yet the upside is open."),
      why: T("这正是买入期权的形状：亏损有底，收益敞开——第 ① 个观念。", "That is the shape of a bought option: a floor under the loss, open upside — Idea ①.") },
  ];
  const ROWS = [
    [T("双方都有义务", "Both sides obligated"), ["✓", "✓", "✓", T("✗ 只有卖方", "✗ seller only"), "✓"]],
    [T("开始时有人付钱", "Money changes hands at the start"), [T("通常不", "usually no"), T("只交保证金", "margin only"), T("通常不", "usually no"), T("✓ 权利金", "✓ premium"), T("只交保证金", "margin only")]],
    [T("交易所、标准化", "Exchange-traded, standardised"), [T("✗ 私下", "✗ private"), "✓", T("多为场外", "mostly OTC"), T("✓（上市期权）", "✓ (listed)"), T("✓ 加密交易所", "✓ crypto venues")]],
    [T("每日结算盈亏", "Gains and losses settled daily"), ["✗", "✓", T("按期", "periodic"), T("买方不用", "not for the buyer"), T("✓ 持续", "✓ continuous")]],
    [T("到期日", "Expiry date"), ["✓", "✓", "✓", "✓", T("✗ 永不到期", "✗ none")]],
    [T("损益形状", "P&L shape"), [T("直线", "straight"), T("直线", "straight"), T("直线", "straight"), T("折线（凸）", "kinked (convex)"), T("直线", "straight")]],
  ];
  let i = 0, score = 0, answered = false;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("认亲游戏：这句话说的是家族里的哪一位？", "Family match: which member does this describe?")}</div>
    <div class="scn"><div class="scn-meta" id="df-meta"></div><div class="scn-q" id="df-q"></div></div>
    <div class="demo-btns" id="df-btns">${Object.entries(P).map(([k, v]) => `<button type="button" class="demo-btn" data-p="${k}">${v}</button>`).join("")}</div>
    <div class="demo-log" id="df-log" hidden></div>
    <div class="demo-btns"><button type="button" class="demo-btn" id="df-next">${T("下一题 →", "Next →")}</button><button type="button" class="demo-btn" id="df-table-btn">${T("显示完整对照表", "Show the full table")}</button></div>
    <div id="df-table" hidden></div>
    <div class="demo-math">${tex(String.raw`\text{${T("线性：", "linear: ")}}\ \Pi = S_T - F \qquad \text{${T("凸：", "convex: ")}}\ \Pi = \max(S_T - K,\,0) - c`, true)}</div>
    <p class="demo-tip">${T("看什么：五位成员里四位是“双方都有义务”的直线；只有期权把义务留给卖方、把选择交给买方，于是它的损益线在行权价处折弯。", "What to notice: four of the five members are two-sided obligations with straight-line P&L; only the option leaves the obligation with the seller and the choice with the buyer, so its P&L bends at the strike.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const show = () => {
    const q = Q[i];
    answered = false;
    $("#df-meta").textContent = T(`第 ${i + 1} / ${Q.length} 题 · 得分 ${score}`, `Question ${i + 1} of ${Q.length} · score ${score}`);
    $("#df-q").textContent = q.q;
    $("#df-log").hidden = true;
    root.querySelectorAll("[data-p]").forEach((b) => { b.classList.remove("on"); b.disabled = false; });
  };
  root.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => {
    if (answered) return;
    answered = true;
    const q = Q[i], ok = b.dataset.p === q.a;
    if (ok) score++;
    b.classList.add("on");
    const log = $("#df-log");
    log.hidden = false;
    log.innerHTML = `<span class="${ok ? "ok" : "bad"}"><b>${ok ? T("对。", "Right.") : T(`不对，答案是“${P[q.a]}”。`, `Not quite — it's the ${P[q.a].toLowerCase()}.`)}</b></span><span>${q.why}</span>`;
    $("#df-meta").textContent = T(`第 ${i + 1} / ${Q.length} 题 · 得分 ${score}`, `Question ${i + 1} of ${Q.length} · score ${score}`);
  }));
  $("#df-next").addEventListener("click", () => { i = (i + 1) % Q.length; if (i === 0) score = 0; show(); });
  $("#df-table-btn").addEventListener("click", () => {
    const t = $("#df-table");
    t.hidden = !t.hidden;
    t.innerHTML = `<table><thead><tr><th></th>${Object.values(P).map((p) => `<th>${p}</th>`).join("")}</tr></thead><tbody>${ROWS.map(([k, cells]) => `<tr><td>${k}</td>${cells.map((c, j) => `<td${j === 3 ? ' class="hl"' : ""}>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  });
  show();
}
