// 交互演示：领口策略 · 股票 + 买看跌 + 卖看涨
// legs = 多头股票(entry) + 多头看跌(Kp) + 空头看涨(Kc)。
// payoffSVG 画两端封口的保护带；stat-row 给 地板(最大亏损)/天花板(最大盈利)/净成本/盈亏平衡。
// 滑块拖 Kp、Kc，直观看到 [地板, 天花板] 这条带子如何随之伸缩，以及净成本何时≈0（零成本领口）。
import { payoffSVG, payoffBlock, netPL } from "./_payoff.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;
  const ENTRY = 100;

  // 用简化的“距离定价”近似权利金，让滑块移动时净成本会变化（仅教学示意，非 BS 精确值）：
  // 平值≈4，越虚越便宜、越实越贵，线性近似并设下限。
  const putPrem = (Kp) => Math.max(0.5, 4 - (ENTRY - Kp) * 0.45);   // Kp 越低（越虚）越便宜
  const callPrem = (Kc) => Math.max(0.5, 4 - (Kc - ENTRY) * 0.45);  // Kc 越高（越虚）越便宜

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🔗 ${T("领口 · 股票 + 买看跌 + 卖看涨", "Collar · Stock + Long Put + Short Call")}</div>

      <div class="demo-grid">
        <div class="demo-block"><label class="demo-label">${T("看跌行权价 Kp（地板）", "Put strike Kp (floor)")} = <b id="cl-kpv">95</b></label><input class="demo-slider" id="cl-kp" type="range" min="85" max="99" step="1" value="95"/></div>
        <div class="demo-block"><label class="demo-label">${T("看涨行权价 Kc（天花板）", "Call strike Kc (cap)")} = <b id="cl-kcv">110</b></label><input class="demo-slider" id="cl-kc" type="range" min="101" max="120" step="1" value="110"/></div>
      </div>

      <div class="legs" id="cl-legs"></div>
      <div id="cl-chart"></div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("最大亏损(地板)", "Max loss (floor)")}</div><div class="v neg" id="cl-ml">–</div></div>
        <div class="stat"><div class="k">${T("最大盈利(天花板)", "Max profit (cap)")}</div><div class="v pos" id="cl-mp">–</div></div>
        <div class="stat"><div class="k">${T("净成本", "Net cost")}</div><div class="v" id="cl-net">–</div></div>
        <div class="stat"><div class="k">${T("盈亏平衡", "Breakeven")}</div><div class="v acc" id="cl-be">–</div></div>
      </div>

      <p class="demo-tip" id="cl-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const kpSl = $("#cl-kp"), kcSl = $("#cl-kc");

  function paint() {
    const Kp = +kpSl.value, Kc = +kcSl.value;
    const pPrem = putPrem(Kp), cPrem = callPrem(Kc);
    $("#cl-kpv").textContent = Kp;
    $("#cl-kcv").textContent = Kc;

    const legs = [
      { type: "stock", side: "long", entry: ENTRY, qty: 1 },
      { type: "put", side: "long", strike: Kp, premium: pPrem, qty: 1 },
      { type: "call", side: "short", strike: Kc, premium: cPrem, qty: 1 },
    ];

    const sideBuy = T("买入", "BUY"), sideSell = T("卖出", "SELL");
    $("#cl-legs").innerHTML =
      `<div class="leg"><span class="side-buy">${sideBuy}</span><span class="leg-pill call">${T("股票", "STOCK")}</span><span class="leg-tag">100 ${T("股 @ ", "sh @ ")}${ENTRY}</span></div>` +
      `<div class="leg"><span class="side-buy">${sideBuy}</span><span class="leg-pill put">PUT</span><span class="leg-tag">K=${Kp}　${T("保费", "prem")} ${pPrem.toFixed(1)}</span></div>` +
      `<div class="leg"><span class="side-sell">${sideSell}</span><span class="leg-pill call">CALL</span><span class="leg-tag">K=${Kc}　${T("权利金", "prem")} ${cPrem.toFixed(1)}</span></div>`;

    const res = payoffSVG({ legs, lo: 60, hi: 140, spot: ENTRY, spotLabel: T("现价", "spot"), uid: "cl" });
    $("#cl-chart").innerHTML = payoffBlock(res, [
      ["var(--green-soft)", T("盈利", "Profit")],
      ["var(--red-soft)", T("亏损", "Loss")],
      ["var(--gold)", T("行权价", "Strike")],
    ]);

    const netCost = pPrem - cPrem;                    // >0 借记(净付)，<0 贷记(净收)
    const maxLoss = (ENTRY - Kp + netCost) * MULT;    // 地板
    const maxProfit = (Kc - ENTRY - netCost) * MULT;  // 天花板
    const be = ENTRY + netCost;

    $("#cl-ml").textContent = "−$" + Math.abs(maxLoss).toFixed(0);
    $("#cl-mp").textContent = "+$" + maxProfit.toFixed(0);
    const netCell = $("#cl-net");
    const isCredit = netCost < -1e-9, isZero = Math.abs(netCost) < 0.05;
    netCell.textContent = isZero
      ? T("≈ $0（零成本）", "≈ $0 (zero-cost)")
      : (isCredit ? T("+收 $", "+$") : T("−付 $", "−$")) + Math.abs(netCost * MULT).toFixed(0);
    netCell.className = "v " + (isZero ? "acc" : isCredit ? "pos" : "neg");
    $("#cl-be").textContent = be.toFixed(1);

    $("#cl-tip").textContent = T(
      `领口把损益夹进保护带 [${Kp}, ${Kc}]：地板 = 最多亏 (${ENTRY}−${Kp}+净成本)×100 = $${Math.abs(maxLoss).toFixed(0)}；天花板 = 最多赚 (${Kc}−${ENTRY}−净成本)×100 = $${maxProfit.toFixed(0)}。卖看涨收的 ${cPrem.toFixed(1)} 在替买看跌的 ${pPrem.toFixed(1)} 出钱——把 Kc 拖到约 ${Math.round(ENTRY + (ENTRY - Kp))}，两笔权利金大致抵消，就成了近乎“零成本领口”。`,
      `The collar pens P&L into the band [${Kp}, ${Kc}]: floor = lose at most (${ENTRY}−${Kp}+net)×100 = $${Math.abs(maxLoss).toFixed(0)}; cap = gain at most (${Kc}−${ENTRY}−net)×100 = $${maxProfit.toFixed(0)}. The ${cPrem.toFixed(1)} from the short call helps pay the ${pPrem.toFixed(1)} put — drag Kc near ${Math.round(ENTRY + (ENTRY - Kp))} so the premiums roughly cancel for a near "zero-cost collar".`
    );
  }

  [kpSl, kcSl].forEach((el) => el.addEventListener("input", paint));
  paint();
}
