// 交互演示：买入看涨的损益图
// 拖动行权价 / 权利金 / 到期价，实时看那条标志性的"钩形"曲线、盈亏平衡点与最大亏损。
import { payoffSVG, payoffBlock, netPL } from "./_payoff.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">📈 ${T("买入看涨 · 拖动看损益", "Long Call · Drag to reshape the payoff")}</div>
      <div class="demo-grid-3">
        <div class="demo-block"><label class="demo-label">${T("行权价 K", "Strike K")} = <b id="cp-k">105</b></label><input class="demo-slider" id="cp-ks" type="range" min="80" max="120" step="1" value="105"/></div>
        <div class="demo-block"><label class="demo-label">${T("权利金 c", "Premium c")} = <b id="cp-c">5.0</b></label><input class="demo-slider" id="cp-cs" type="range" min="1" max="15" step="0.5" value="5"/></div>
        <div class="demo-block"><label class="demo-label">${T("到期价 S", "Price at expiry S")} = <b id="cp-s">115</b></label><input class="demo-slider" id="cp-ss" type="range" min="70" max="140" step="1" value="115"/></div>
      </div>
      <div id="cp-chart"></div>
      <div class="stat-row">
        <div class="stat"><div class="k">${T("最大亏损", "Max loss")}</div><div class="v neg" id="cp-ml">–</div></div>
        <div class="stat"><div class="k">${T("盈亏平衡", "Breakeven")}</div><div class="v acc" id="cp-be">–</div></div>
        <div class="stat"><div class="k">${T("到期盈亏(每张)", "P&L at S (per contract)")}</div><div class="v" id="cp-pl">–</div></div>
      </div>
      <p class="demo-tip">${T("绿色=盈利、红色=亏损。注意：左边是一条封顶的“地板”（最多亏权利金），越过行权价后才 45° 上扬——但要涨过 <b>盈亏平衡点 = 行权价 + 权利金</b> 才真回本。", "Green = profit, red = loss. The left side is a capped floor (you can only lose the premium); past the strike it rises 45°, but you only truly profit beyond <b>breakeven = strike + premium</b>.")}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  const ks = $("#cp-ks"), cs = $("#cp-cs"), ss = $("#cp-ss");

  function paint() {
    const K = +ks.value, c = +cs.value, S = +ss.value;
    $("#cp-k").textContent = K;
    $("#cp-c").textContent = c.toFixed(1);
    $("#cp-s").textContent = S;
    const legs = [{ type: "call", side: "long", strike: K, premium: c, qty: 1 }];
    const res = payoffSVG({ legs, lo: 70, hi: 140, spot: S, spotLabel: T("到期价", "S"), uid: "cp" });
    $("#cp-chart").innerHTML = payoffBlock(res, [
      ["var(--green-soft)", T("盈利", "Profit")],
      ["var(--red-soft)", T("亏损", "Loss")],
    ]);
    $("#cp-ml").textContent = "−$" + (c * MULT).toFixed(0);
    $("#cp-be").textContent = (K + c).toFixed(1);
    const pl = netPL(legs, S) * MULT;
    const cell = $("#cp-pl");
    cell.textContent = (pl >= 0 ? "+$" : "−$") + Math.abs(pl).toFixed(0);
    cell.className = "v " + (pl >= 0 ? "pos" : "neg");
  }
  [ks, cs, ss].forEach((el) => el.addEventListener("input", paint));
  paint();
}
