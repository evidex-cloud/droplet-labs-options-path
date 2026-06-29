// 交互演示：Gamma vs 标的价 S，展示“平值最高 + 临近到期爆炸”。
// 两条线：固定 90 天基准（line2/金）对比可调“近到期”天数（line/青）。
// 滑块拖小近到期天数 → 看平值 Gamma 尖峰急剧拔高。真算：greeks()。
import { greeks } from "./_bs.js";
import { lineChart, chartBlock } from "./_chart.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const K = 100, lo = 70, hi = 130, r = 0.04, sigma = 0.2;
  const baseDays = 90;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">⛰️ ${T("Gamma 曲线：平值最高，临近到期“爆炸”", "Gamma curve: peaks ATM, explodes near expiry")}</div>

      <div class="demo-block">
        <label class="demo-label">${T("近到期那条线的天数", "Near-expiry line: days")} = <b id="gc-d-v">7</b> ${T("（拖小看尖峰拔高）", "(drag down → spike grows)")}</label>
        <input class="demo-slider" id="gc-d" type="range" min="1" max="90" step="1" value="7"/>
      </div>

      <div id="gc-chart"></div>

      <div class="stat-row" style="margin-top:12px">
        <div class="stat"><div class="k">${T("平值 Gamma · 90天", "ATM Gamma · 90d")}</div><div class="v" id="gc-base">–</div></div>
        <div class="stat"><div class="k">${T("平值 Gamma · 近到期", "ATM Gamma · near")}</div><div class="v acc" id="gc-near">–</div></div>
        <div class="stat"><div class="k">${T("尖峰放大倍数", "Spike multiple")}</div><div class="v pos" id="gc-mult">–</div></div>
      </div>

      <p class="demo-tip" id="gc-tip"></p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  const gammaAt = (S, days) => greeks({ S, K, T: days / 365, r, sigma, type: "call" }).gamma;

  function paint() {
    const days = +$("#gc-d").value;
    $("#gc-d-v").textContent = days;

    const res = lineChart({
      fns: [
        { f: (S) => gammaAt(S, days), cls: "line" },      // 近到期（青）
        { f: (S) => gammaAt(S, baseDays), cls: "line2" }, // 90 天基准（金）
      ],
      lo, hi,
      xlabel: T("标的价 S（行权价 K=100）", "Spot S (strike K=100)"),
      markerX: K,
      markerLabel: "K=100",
      forceZero: true,
    });
    $("#gc-chart").innerHTML = chartBlock(res, [
      ["var(--accent)", T(`Gamma · ${days} 天（近到期）`, `Gamma · ${days}d (near expiry)`)],
      ["var(--gold)", T("Gamma · 90 天（基准）", "Gamma · 90d (baseline)")],
    ]);

    const base = gammaAt(100, baseDays), near = gammaAt(100, days);
    $("#gc-base").textContent = base.toFixed(4);
    $("#gc-near").textContent = near.toFixed(4);
    $("#gc-mult").textContent = (near / base).toFixed(1) + "×";

    $("#gc-tip").innerHTML = T(
      `两条线都在 <b>K=100（平值）</b>处最高、向两侧衰减——Gamma 集中在现价附近。把近到期天数拖到 <b>1~2 天</b>：平值 Gamma 从 90 天的 ${base.toFixed(3)} 飙到 <b>${near.toFixed(3)}</b>（约 <b>${(near / base).toFixed(1)}×</b>）。这就是“Gamma 临近到期爆炸”：Delta 曲线趋向阶跃，标的一点点动就让 Delta 剧烈翻转——买方的爆发机会、卖方的钉住噩梦（阶段 5.3 / 8.5）。`,
      `Both lines peak at <b>K=100 (ATM)</b> and decay outward — Gamma concentrates near spot. Drag near-expiry to <b>1–2 days</b>: ATM Gamma jumps from ${base.toFixed(3)} (90d) to <b>${near.toFixed(3)}</b> (~<b>${(near / base).toFixed(1)}×</b>). That is the near-expiry Gamma explosion: the Delta curve approaches a step, so tiny spot moves flip Delta violently — a buyer's burst, a seller's pin-risk nightmare (Stage 5.3 / 8.5).`
    );
  }

  $("#gc-d").addEventListener("input", paint);
  paint();
}
