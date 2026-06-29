// 交互演示：买入看跌的损益图
// 拖动行权价 / 权利金 / 到期价，实时看那条"反向钩形"曲线、盈亏平衡点与最大亏损。
import { payoffSVG, payoffBlock, netPL } from "./_payoff.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">📉 ${T("买入看跌 · 拖动看损益", "Long Put · Drag to reshape the payoff")}</div>
      <div class="demo-grid-3">
        <div class="demo-block"><label class="demo-label">${T("行权价 K", "Strike K")} = <b id="pp-k">95</b></label><input class="demo-slider" id="pp-ks" type="range" min="80" max="120" step="1" value="95"/></div>
        <div class="demo-block"><label class="demo-label">${T("权利金 p", "Premium p")} = <b id="pp-p">4.0</b></label><input class="demo-slider" id="pp-ps" type="range" min="1" max="15" step="0.5" value="4"/></div>
        <div class="demo-block"><label class="demo-label">${T("到期价 S", "Price at expiry S")} = <b id="pp-s">80</b></label><input class="demo-slider" id="pp-ss" type="range" min="60" max="130" step="1" value="80"/></div>
      </div>
      <div id="pp-chart"></div>
      <div class="stat-row">
        <div class="stat"><div class="k">${T("最大亏损", "Max loss")}</div><div class="v neg" id="pp-ml">–</div></div>
        <div class="stat"><div class="k">${T("盈亏平衡", "Breakeven")}</div><div class="v acc" id="pp-be">–</div></div>
        <div class="stat"><div class="k">${T("到期盈亏(每张)", "P&L at S (per contract)")}</div><div class="v" id="pp-pl">–</div></div>
      </div>
      <p class="demo-tip">${T("看跌是看涨的<b>镜像</b>：盈利发生在<b>左侧（标的下方）</b>，45° 下行段是利润，过行权价后压成一条封顶的“地板”。要跌破 <b>盈亏平衡点 = 行权价 − 权利金</b> 才真回本；最大盈利在标的跌到 0 时（被“归零”地板挡住）。", "A put mirrors a call: profit appears on the <b>left (downside)</b>. The 45° down-leg is profit, flattening into a capped floor past the strike. You only truly profit below <b>breakeven = strike − premium</b>; max gain occurs if the underlying hits 0.")}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  const ks = $("#pp-ks"), ps = $("#pp-ps"), ss = $("#pp-ss");

  function paint() {
    const K = +ks.value, p = +ps.value, S = +ss.value;
    $("#pp-k").textContent = K;
    $("#pp-p").textContent = p.toFixed(1);
    $("#pp-s").textContent = S;
    const legs = [{ type: "put", side: "long", strike: K, premium: p, qty: 1 }];
    const res = payoffSVG({ legs, lo: 60, hi: 130, spot: S, spotLabel: T("到期价", "S"), uid: "pp" });
    $("#pp-chart").innerHTML = payoffBlock(res, [
      ["var(--green-soft)", T("盈利", "Profit")],
      ["var(--red-soft)", T("亏损", "Loss")],
    ]);
    $("#pp-ml").textContent = "−$" + (p * MULT).toFixed(0);
    $("#pp-be").textContent = (K - p).toFixed(1);
    const pl = netPL(legs, S) * MULT;
    const cell = $("#pp-pl");
    cell.textContent = (pl >= 0 ? "+$" : "−$") + Math.abs(pl).toFixed(0);
    cell.className = "v " + (pl >= 0 ? "pos" : "neg");
  }
  [ks, ps, ss].forEach((el) => el.addEventListener("input", paint));
  paint();
}
