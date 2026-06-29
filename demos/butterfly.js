// demos/butterfly.js —— 长看涨蝶式 损益演示
// 买 K1 + 卖 2×K2(中心) + 买 K3，等距翼宽可调；payoffSVG 画“帐篷”、标两个BE；
// stat-row 给 最大盈利(在中心)/最大亏损(=净付出)/两个BE/净成本。全部真算（netPL 引擎）。
import { payoffSVG, payoffBlock, netPL } from "./_payoff.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;
  const SPOT = 100, CENTER = 100;

  // 中心固定 K2=100；翼宽 w 可调；权利金按一个简单的“离中心越近越贵”近似给出，
  // 但为保证教学数字干净，这里用固定的、与课文一致的报价表（buy95@7, sell100@4, buy105@2 → 翼宽5）。
  // 翼宽变化时按比例近似缩放权利金，保证净付出始终为正的小额借记。
  let w = 5;

  // 由翼宽生成三条腿的权利金（近似：中心ATM最贵，两翼递减；保持净借记>0）
  function premiums(width) {
    // 经验近似：ATM call ≈ 4 + 0.18*width；每偏离 width 元，价值下降一档
    const k2 = 4 + 0.18 * width;          // 中心(卖2)
    const k1 = k2 + 0.62 * width;          // 低行权价(买，更实值更贵)
    const k3 = Math.max(0.3, k2 - 0.42 * width); // 高行权价(买，更虚更便宜)
    return { k1, k2, k3 };
  }

  function buildLegs() {
    const K1 = CENTER - w, K2 = CENTER, K3 = CENTER + w;
    const p = premiums(w);
    return [
      { type: "call", side: "long", strike: K1, premium: p.k1, qty: 1 },
      { type: "call", side: "short", strike: K2, premium: p.k2, qty: 2 },
      { type: "call", side: "long", strike: K3, premium: p.k3, qty: 1 },
    ];
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">⛺ ${T("长看涨蝶式 · 押“钉在中间”", "Long call butterfly · betting it pins the middle")}</div>

      <div class="demo-block">
        <div class="demo-label">${T("翼宽 w（行权价 = 100−w / 100 / 100+w）", "Wing width w (strikes = 100−w / 100 / 100+w)")} <b id="bf-wv">${w}</b></div>
        <input class="demo-slider" id="bf-w" type="range" min="2" max="20" step="1" value="${w}"/>
      </div>

      <div class="legs" id="bf-legs"></div>

      <div id="bf-chart"></div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("最大盈利", "Max profit")}</div><div class="v pos" id="bf-mp">–</div></div>
        <div class="stat"><div class="k">${T("最大亏损", "Max loss")}</div><div class="v neg" id="bf-ml">–</div></div>
        <div class="stat"><div class="k">${T("下盈亏平衡", "Lower BE")}</div><div class="v acc" id="bf-be1">–</div></div>
        <div class="stat"><div class="k">${T("上盈亏平衡", "Upper BE")}</div><div class="v acc" id="bf-be2">–</div></div>
        <div class="stat"><div class="k">${T("净成本", "Net debit")}</div><div class="v" id="bf-cost">–</div></div>
      </div>

      <p class="demo-tip" id="bf-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  function legRow(leg) {
    const buy = leg.side === "long";
    const sideTxt = buy ? T("买入", "BUY") : T("卖出", "SELL");
    const sideCls = buy ? "side-buy" : "side-sell";
    return `<div class="leg">
      <span class="${sideCls}">${sideTxt}</span>
      <span class="leg-pill call">CALL</span>
      <span class="leg-tag">K=${leg.strike}　${T("权利金", "prem")} ${leg.premium.toFixed(2)}　×${leg.qty}</span>
    </div>`;
  }

  function paint() {
    const legs = buildLegs();
    const LO = Math.max(40, CENTER - w * 3.2), HI = CENTER + w * 3.2;

    $("#bf-legs").innerHTML = legs.map(legRow).join("");

    const res = payoffSVG({ legs, lo: LO, hi: HI, spot: SPOT, spotLabel: T("现价", "spot"), uid: "bf" });
    $("#bf-chart").innerHTML = payoffBlock(res, [
      ["var(--green-soft)", T("盈利", "Profit")],
      ["var(--red-soft)", T("亏损", "Loss")],
      ["var(--gold)", T("行权价", "Strike")],
    ]);

    // 净付出（每股）：买的两翼 − 卖的中间2张
    const netCostPS = legs.reduce((a, l) => a + (l.side === "long" ? 1 : -1) * l.premium * l.qty, 0);
    // 真算峰值（中心 K2=100）与底（两翼外）
    const peakPS = netPL(legs, CENTER);     // 最大盈利/股
    const floorPS = netPL(legs, CENTER - w * 3); // 远离中心 → 最大亏损/股（= −净付出）

    const bes = res.breakevens;
    $("#bf-mp").textContent = "+$" + (peakPS * MULT).toFixed(0);
    $("#bf-ml").textContent = "−$" + Math.abs(floorPS * MULT).toFixed(0);
    $("#bf-be1").textContent = bes.length ? bes[0].toFixed(2) : "—";
    $("#bf-be2").textContent = bes.length > 1 ? bes[1].toFixed(2) : "—";
    $("#bf-cost").textContent = "−$" + (netCostPS * MULT).toFixed(0);

    // 理论核对：最大盈利 = 翼宽 − 净付出；BE = 100 ± 最大盈利
    const theoMax = w - netCostPS;
    $("#bf-tip").innerHTML = T(
      `最大盈利 <b>$${(peakPS * MULT).toFixed(0)}</b> 只在到期价正好等于中心 <b>100</b> 时取得（= 翼宽 ${w} − 净付出 ${netCostPS.toFixed(2)} = ${theoMax.toFixed(2)}/股）。落在两翼外只亏净付出 $${Math.abs(netCostPS * MULT).toFixed(0)}；两个盈亏平衡 = 100 ± 最大盈利/股 = <b>${(100 - theoMax).toFixed(1)} / ${(100 + theoMax).toFixed(1)}</b>。拖动翼宽：翼越宽，帐篷越高但成本/风险也越大。它 <b>−Vega</b>（押静止、盼 IV 回落）。`,
      `Max profit <b>$${(peakPS * MULT).toFixed(0)}</b> is reached only when expiry price lands exactly on the center <b>100</b> (= wing width ${w} − net debit ${netCostPS.toFixed(2)} = ${theoMax.toFixed(2)}/sh). Outside the wings you lose just the net debit $${Math.abs(netCostPS * MULT).toFixed(0)}; the two breakevens = 100 ± max-profit/sh = <b>${(100 - theoMax).toFixed(1)} / ${(100 + theoMax).toFixed(1)}</b>. Drag the wing: wider wings raise the tent but cost/risk grow too. It is <b>−Vega</b> (bets on stillness, wants IV to fall).`
    );
  }

  $("#bf-w").addEventListener("input", (e) => { w = +e.target.value; $("#bf-wv").textContent = w; paint(); });

  paint();
}
