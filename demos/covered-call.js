// 交互演示：备兑开仓 · 持股 + 卖出看涨
// legs = 多头股票(entry 可调) + 空头看涨(K 可调, 权利金 c 可调)。
// payoffSVG 画 60~140 的台阶形损益；stat-row 给 权利金收入 / 最大盈利 / 盈亏平衡；
// 拖动看涨行权价，直观看到“上行封顶 vs 多收租”的权衡。
import { payoffSVG, payoffBlock, netPL } from "./_payoff.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🏠 ${T("备兑开仓 · 持股 + 卖出看涨", "Covered Call · Stock + Short Call")}</div>

      <div class="demo-grid-3">
        <div class="demo-block"><label class="demo-label">${T("持股成本", "Stock cost")} = <b id="cc-ev">100</b></label><input class="demo-slider" id="cc-e" type="range" min="80" max="120" step="1" value="100"/></div>
        <div class="demo-block"><label class="demo-label">${T("卖出看涨行权价 K", "Short call strike K")} = <b id="cc-kv">105</b></label><input class="demo-slider" id="cc-k" type="range" min="95" max="135" step="1" value="105"/></div>
        <div class="demo-block"><label class="demo-label">${T("收到的权利金", "Premium received")} = <b id="cc-cv">3.0</b></label><input class="demo-slider" id="cc-c" type="range" min="0.5" max="10" step="0.5" value="3"/></div>
      </div>

      <div class="legs" id="cc-legs"></div>
      <div id="cc-chart"></div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("权利金收入", "Premium income")}</div><div class="v acc" id="cc-inc">–</div></div>
        <div class="stat"><div class="k">${T("最大盈利", "Max profit")}</div><div class="v pos" id="cc-mp">–</div></div>
        <div class="stat"><div class="k">${T("盈亏平衡", "Breakeven")}</div><div class="v" id="cc-be">–</div></div>
        <div class="stat"><div class="k">${T("到期盈亏(每张)", "P&L at expiry")}</div><div class="v" id="cc-pl">–</div></div>
      </div>

      <p class="demo-tip" id="cc-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const eSl = $("#cc-e"), kSl = $("#cc-k"), cSl = $("#cc-c");

  function legRow(side, pill, pillCls, tag) {
    const sideCls = side === "BUY" ? "side-buy" : "side-sell";
    const sideTxt = side === "BUY" ? T("买入", "BUY") : T("卖出", "SELL");
    return `<div class="leg"><span class="${sideCls}">${sideTxt}</span><span class="leg-pill ${pillCls}">${pill}</span><span class="leg-tag">${tag}</span></div>`;
  }

  function paint() {
    const entry = +eSl.value, K = +kSl.value, c = +cSl.value;
    $("#cc-ev").textContent = entry;
    $("#cc-kv").textContent = K;
    $("#cc-cv").textContent = c.toFixed(1);

    const legs = [
      { type: "stock", side: "long", entry, qty: 1 },
      { type: "call", side: "short", strike: K, premium: c, qty: 1 },
    ];

    $("#cc-legs").innerHTML =
      legRow("BUY", T("股票", "STOCK"), "call", `${100} ${T("股 @ ", "sh @ ")}${entry}`) +
      legRow("SELL", "CALL", "put", `K=${K}　${T("权利金", "prem")} ${c.toFixed(1)}`);

    // 注意：股票 STOCK pill 复用 .call 配色仅为视觉；不影响计算
    const res = payoffSVG({ legs, lo: 60, hi: 140, spot: entry, spotLabel: T("现价", "spot"), uid: "cc" });
    $("#cc-chart").innerHTML = payoffBlock(res, [
      ["var(--green-soft)", T("盈利", "Profit")],
      ["var(--red-soft)", T("亏损", "Loss")],
      ["var(--gold)", T("行权价", "Strike")],
    ]);

    const income = c * MULT;
    const maxProfit = (K - entry + c) * MULT; // (行权价−成本+权利金)×100
    const be = entry - c;
    $("#cc-inc").textContent = "+$" + income.toFixed(0);
    $("#cc-mp").textContent = "+$" + maxProfit.toFixed(0);
    $("#cc-be").textContent = be.toFixed(1);

    // 到期盈亏取“现价处”作为参考点（=权利金收入，因为未涨过行权价时股票不赚不亏）
    const plAtSpot = netPL(legs, entry) * MULT;
    const plCell = $("#cc-pl");
    plCell.textContent = (plAtSpot >= 0 ? "+$" : "−$") + Math.abs(plAtSpot).toFixed(0);
    plCell.className = "v " + (plAtSpot >= 0 ? "pos" : "neg");

    $("#cc-tip").textContent = T(
      `卖出的看涨在 K=${K} 把上行削成天花板：最大盈利 = (${K}−${entry}+${c.toFixed(1)})×100 = $${maxProfit.toFixed(0)}，封顶。把行权价拖高→多留上涨但权利金更薄；拖低→收租更猛但更快踏空。盈亏平衡 = 成本−权利金 = ${be.toFixed(1)}，权利金只摊低这一点成本，挡不住大跌。`,
      `The short call caps the upside at K=${K}: max profit = (${K}−${entry}+${c.toFixed(1)})×100 = $${maxProfit.toFixed(0)}. Drag the strike up → keep more upside but thinner premium; down → richer income but capped sooner. Breakeven = cost−premium = ${be.toFixed(1)}; the premium only softens cost a bit — it won't stop a big drop.`
    );
  }

  [eSl, kSl, cSl].forEach((el) => el.addEventListener("input", paint));
  paint();
}
