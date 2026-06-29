// 交互演示：垂直价差 · 四种组合
// 分段切换 牛市看涨借记 / 熊市看跌借记 / 牛市看跌贷记 / 熊市看涨贷记。
// 两腿 payoffSVG 画台阶形；stat-row 给 最大盈利 / 最大亏损 / 盈亏平衡 / 借记或贷记。
// 数字全部用 netPL 在宽区间采样核对，与引擎一致。
import { payoffSVG, payoffBlock, netPL } from "./_payoff.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;

  // 四种价差（每股口径，对称行权价 100/110 或 100/90，靠近实值的腿权利金 6.5、远腿 2.5 → 净 4）
  const NEAR = 6.5, FAR = 2.5; // 靠近实值腿权利金 / 较虚腿权利金 → 净 4
  const SPREADS = {
    bullcall: {
      name: T("牛市看涨借记", "Bull Call (debit)"),
      flow: "debit",
      legs: [
        { type: "call", side: "long", strike: 100, premium: NEAR, qty: 1 },
        { type: "call", side: "short", strike: 110, premium: FAR, qty: 1 },
      ],
      note: T("买100看涨、卖110看涨。看涨方向，付费押上涨。", "Buy 100 call, sell 110 call. Bullish, pay to bet on a rise."),
    },
    bearput: {
      name: T("熊市看跌借记", "Bear Put (debit)"),
      flow: "debit",
      legs: [
        { type: "put", side: "long", strike: 100, premium: NEAR, qty: 1 },
        { type: "put", side: "short", strike: 90, premium: FAR, qty: 1 },
      ],
      note: T("买100看跌、卖90看跌。看跌方向，付费押下跌。", "Buy 100 put, sell 90 put. Bearish, pay to bet on a fall."),
    },
    bullput: {
      name: T("牛市看跌贷记", "Bull Put (credit)"),
      flow: "credit",
      legs: [
        { type: "put", side: "short", strike: 100, premium: NEAR, qty: 1 },
        { type: "put", side: "long", strike: 90, premium: FAR, qty: 1 },
      ],
      note: T("卖100看跌、买90看跌。看涨方向，收费赌“不跌破”。", "Sell 100 put, buy 90 put. Bullish, collect to bet it won't break down."),
    },
    bearcall: {
      name: T("熊市看涨贷记", "Bear Call (credit)"),
      flow: "credit",
      legs: [
        { type: "call", side: "short", strike: 100, premium: NEAR, qty: 1 },
        { type: "call", side: "long", strike: 110, premium: FAR, qty: 1 },
      ],
      note: T("卖100看涨、买110看涨。看跌方向，收费赌“不涨过”。", "Sell 100 call, buy 110 call. Bearish, collect to bet it won't rise through."),
    },
  };

  let key = "bullcall";

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">📐 ${T("垂直价差 · 四种组合", "Vertical Spreads · Four Variants")}</div>

      <div class="demo-seg" id="vs-seg" style="margin-bottom:14px;flex-wrap:wrap">
        ${Object.entries(SPREADS).map(([k, v]) => `<button data-k="${k}" class="${k === key ? "on" : ""}">${v.name}</button>`).join("")}
      </div>

      <div class="legs" id="vs-legs"></div>
      <div id="vs-chart"></div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("最大盈利", "Max profit")}</div><div class="v pos" id="vs-mp">–</div></div>
        <div class="stat"><div class="k">${T("最大亏损", "Max loss")}</div><div class="v neg" id="vs-ml">–</div></div>
        <div class="stat"><div class="k">${T("盈亏平衡", "Breakeven")}</div><div class="v acc" id="vs-be">–</div></div>
        <div class="stat"><div class="k">${T("净权利金", "Net premium")}</div><div class="v" id="vs-net">–</div></div>
      </div>

      <p class="demo-tip" id="vs-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  // 在 [0,400] 宽区间采样 netPL 估计极值；垂直价差两端皆有界
  function extremes(legs) {
    let mn = Infinity, mx = -Infinity;
    for (let i = 0; i <= 1600; i++) {
      const S = (400) * (i / 1600);
      const y = netPL(legs, S);
      if (y < mn) mn = y;
      if (y > mx) mx = y;
    }
    return { mn, mx };
  }

  function legRow(leg) {
    const buy = leg.side === "long";
    const sideCls = buy ? "side-buy" : "side-sell";
    const sideTxt = buy ? T("买入", "BUY") : T("卖出", "SELL");
    const pillCls = leg.type === "call" ? "call" : "put";
    const pillTxt = leg.type === "call" ? "CALL" : "PUT";
    return `<div class="leg"><span class="${sideCls}">${sideTxt}</span><span class="leg-pill ${pillCls}">${pillTxt}</span><span class="leg-tag">K=${leg.strike}　${T("权利金", "prem")} ${leg.premium.toFixed(1)}</span></div>`;
  }

  function paint() {
    const sp = SPREADS[key];
    const legs = sp.legs;

    $("#vs-legs").innerHTML = legs.map(legRow).join("");

    // 价差曲线集中在 80~130 区间观察
    const res = payoffSVG({ legs, lo: 80, hi: 130, spot: 100, spotLabel: T("现价", "spot"), uid: "vs" });
    const bes = res.breakevens;
    $("#vs-chart").innerHTML = payoffBlock(res, [
      ["var(--green-soft)", T("盈利", "Profit")],
      ["var(--red-soft)", T("亏损", "Loss")],
      ["var(--gold)", T("行权价", "Strike")],
    ]);

    const { mn, mx } = extremes(legs);
    $("#vs-mp").textContent = "+$" + (mx * MULT).toFixed(0);
    $("#vs-ml").textContent = "−$" + Math.abs(mn * MULT).toFixed(0);
    $("#vs-be").textContent = bes.length ? bes.map((b) => b.toFixed(1)).join(" / ") : "—";

    // 净权利金：long 付出(-)、short 收入(+)
    let net = 0;
    for (const l of legs) net += (l.side === "long" ? -1 : 1) * l.premium;
    const netAmt = net * MULT;
    const netCell = $("#vs-net");
    netCell.textContent = (net >= 0 ? T("+收 $", "+$") : T("−付 $", "−$")) + Math.abs(netAmt).toFixed(0)
      + (sp.flow === "credit" ? T("（贷记）", " (credit)") : T("（借记）", " (debit)"));
    netCell.className = "v " + (net >= 0 ? "pos" : "neg");

    const width = 10; // 行权价宽度
    const D = Math.abs(net); // 净权利金绝对值（=4）
    const detail = sp.flow === "debit"
      ? T(`借记价差：最大亏损 = 净付出 = $${(D * MULT).toFixed(0)}；最大盈利 = (宽度−净付出)×100 = (${width}−${D})×100 = $${((width - D) * MULT).toFixed(0)}。方向看对才赚。`,
          `Debit spread: max loss = net debit = $${(D * MULT).toFixed(0)}; max profit = (width−debit)×100 = (${width}−${D})×100 = $${((width - D) * MULT).toFixed(0)}. You profit if the direction is right.`)
      : T(`贷记价差：最大盈利 = 净收入 = $${(D * MULT).toFixed(0)}；最大亏损 = (宽度−净收入)×100 = (${width}−${D})×100 = $${((width - D) * MULT).toFixed(0)}。坏方向不来就赢（高胜率、坏赔率）。`,
          `Credit spread: max profit = net credit = $${(D * MULT).toFixed(0)}; max loss = (width−credit)×100 = (${width}−${D})×100 = $${((width - D) * MULT).toFixed(0)}. You win if the bad move doesn't happen (high win rate, poor odds).`);

    $("#vs-tip").textContent = sp.note + " " + detail
      + T(" 注意：最大盈利 + 最大亏损 = 价差宽度 ×100 = $1000，两头各切一块。",
          " Note: max profit + max loss = width ×100 = $1000 — the pie split from both ends.");
  }

  $("#vs-seg").querySelectorAll("button").forEach((b) =>
    b.addEventListener("click", () => {
      key = b.dataset.k;
      $("#vs-seg").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
      paint();
    }));
  paint();
}
