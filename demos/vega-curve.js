// 交互演示：Vega 的两张脸。.demo-seg 切换：
//  (A) 期权 PRICE vs IV（近似线性上升）—— 直观看“IV 涨，价格涨”，并对比 30d vs 180d 斜率（=Vega）。
//  (B) Vega vs 标的价 S —— 钟形，平值最高；对比 30d vs 180d 看“长期权 Vega 更大”。
// 真算：bsPrice() / greeks()。两条线 line(青,180d) + line2(金,30d)。
import { bsPrice, greeks } from "./_bs.js";
import { lineChart, chartBlock } from "./_chart.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const K = 100, r = 0.04;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🌪️ ${T("Vega：你其实在交易波动率", "Vega: you're really trading volatility")}</div>

      <div class="demo-seg" id="vc-mode" style="margin-bottom:10px">
        <button data-m="price" class="on">${T("价格 vs IV", "Price vs IV")}</button>
        <button data-m="vega">${T("Vega vs 标的价", "Vega vs Spot")}</button>
      </div>

      <div id="vc-chart"></div>

      <div class="stat-row" style="margin-top:12px" id="vc-stats"></div>

      <p class="demo-tip" id="vc-tip"></p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  let mode = "price";

  function paint() {
    if (mode === "price") {
      // x = IV(%), 固定平值 S=K=100；两条线 180d / 30d
      const priceAtIV = (days) => (ivPct) => bsPrice({ S: 100, K, T: days / 365, r, sigma: ivPct / 100, type: "call" });
      const res = lineChart({
        fns: [
          { f: priceAtIV(180), cls: "line" },
          { f: priceAtIV(30), cls: "line2" },
        ],
        lo: 5, hi: 80,
        xlabel: T("隐含波动率 IV (%)（平值 S=K=100）", "Implied vol IV (%) (ATM S=K=100)"),
        forceZero: true,
      });
      $("#vc-chart").innerHTML = chartBlock(res, [
        ["var(--accent)", T("平值看涨价 · 180 天", "ATM call price · 180d")],
        ["var(--gold)", T("平值看涨价 · 30 天", "ATM call price · 30d")],
      ]);

      const v30 = greeks({ S: 100, K, T: 30 / 365, r, sigma: 0.2, type: "call" }).vega;
      const v180 = greeks({ S: 100, K, T: 180 / 365, r, sigma: 0.2, type: "call" }).vega;
      $("#vc-stats").innerHTML = `
        <div class="stat"><div class="k">${T("Vega · 30天 (斜率)", "Vega · 30d (slope)")}</div><div class="v" >${v30.toFixed(3)}</div></div>
        <div class="stat"><div class="k">${T("Vega · 180天 (斜率)", "Vega · 180d (slope)")}</div><div class="v acc">${v180.toFixed(3)}</div></div>
        <div class="stat"><div class="k">${T("长期权倍数", "Long-dated ×")}</div><div class="v pos">${(v180 / v30).toFixed(1)}×</div></div>`;
      $("#vc-tip").innerHTML = T(
        `两条线都<b>随 IV 近似线性上升</b>——这就是“买期权 = 买波动率”：标的一动不动，光 IV 涨，价格就涨。直线的<b>斜率就是 Vega</b>。<b>青线（180 天）比金线（30 天）陡得多</b>：长期权 Vega ≈ ${(v180 / v30).toFixed(1)} 倍（Vega ∝ √T）。反过来想 IV crush：财报后 IV 暴跌，沿曲线左滑，价格大跌——方向对了也可能亏（阶段 5.5）。`,
        `Both lines <b>rise ~linearly with IV</b> — this is "buying an option = buying vol": with spot frozen, price still climbs as IV rises. The <b>slope is Vega</b>. The <b>cyan (180d) line is far steeper</b> than gold (30d): long-dated Vega ≈ ${(v180 / v30).toFixed(1)}× (Vega ∝ √T). Flip it for IV crush: after earnings IV collapses, you slide left and price drops — right direction can still lose (Stage 5.5).`
      );
    } else {
      // x = S, Vega vs 标的；两条线 180d / 30d，固定 IV=20%
      const vegaAt = (days) => (S) => greeks({ S, K, T: days / 365, r, sigma: 0.2, type: "call" }).vega;
      const res = lineChart({
        fns: [
          { f: vegaAt(180), cls: "line" },
          { f: vegaAt(30), cls: "line2" },
        ],
        lo: 70, hi: 130,
        xlabel: T("标的价 S（行权价 K=100, IV=20%）", "Spot S (K=100, IV=20%)"),
        markerX: K,
        markerLabel: "K=100",
        forceZero: true,
      });
      $("#vc-chart").innerHTML = chartBlock(res, [
        ["var(--accent)", T("Vega · 180 天", "Vega · 180d")],
        ["var(--gold)", T("Vega · 30 天", "Vega · 30d")],
      ]);

      const peak30 = vegaAt(30)(100), peak180 = vegaAt(180)(100);
      $("#vc-stats").innerHTML = `
        <div class="stat"><div class="k">${T("平值 Vega · 30天", "ATM Vega · 30d")}</div><div class="v">${peak30.toFixed(3)}</div></div>
        <div class="stat"><div class="k">${T("平值 Vega · 180天", "ATM Vega · 180d")}</div><div class="v acc">${peak180.toFixed(3)}</div></div>
        <div class="stat"><div class="k">${T("虚值 S=120 · 180天", "OTM S=120 · 180d")}</div><div class="v">${vegaAt(180)(120).toFixed(3)}</div></div>`;
      $("#vc-tip").innerHTML = T(
        `两条都是<b>以平值 K=100 为顶的钟形</b>——Vega 在<b>平值最大</b>，深度实值/虚值趋零（命运已定，不在乎 IV 怎么变）。<b>青线（180 天）整体高于金线（30 天）</b>：长期权对波动率敏感得多。这与 Gamma 恰好相反——Gamma 临近到期<b>爆炸</b>、Vega 临近到期<b>塌向 0</b>（阶段 5.3 / 5.5）。`,
        `Both are <b>bell curves peaking at ATM K=100</b> — Vega is <b>largest at the money</b>, dropping to ~0 deep ITM/OTM (fate sealed, indifferent to IV). The <b>cyan (180d) line sits well above gold (30d)</b>: long-dated options are far more vol-sensitive. Opposite to Gamma — Gamma <b>explodes</b> near expiry while Vega <b>collapses</b> (Stage 5.3 / 5.5).`
      );
    }
  }

  $("#vc-mode").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    mode = b.dataset.m;
    [...$("#vc-mode").children].forEach((c) => c.classList.toggle("on", c === b));
    paint();
  });
  paint();
}
