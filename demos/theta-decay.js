// 交互演示：时间衰减曲线 —— 期权 VALUE vs 剩余天数（x 从 90 → 0，左侧=到期）。
// 两条线：平值 ATM（line/青，加速塌陷）对比虚值 OTM（line2/金，缓慢失血）。
// 用 bsPrice across T；滑块调 IV。真算：bsPrice()。
import { bsPrice, greeks } from "./_bs.js";
import { lineChart, chartBlock } from "./_chart.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const Katm = 100, Kotm = 110, S = 100, r = 0.04, maxDays = 90;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🧊 ${T("时间衰减曲线：期权价值如何随到期临近“融化”", "Time-decay curve: how option value melts toward expiry")}</div>

      <div class="demo-block">
        <label class="demo-label">${T("隐含波动率 IV", "Implied vol")} = <b id="td-iv-v">20</b>%</label>
        <input class="demo-slider" id="td-iv" type="range" min="10" max="80" step="1" value="20"/>
      </div>

      <div id="td-chart"></div>

      <div class="stat-row" style="margin-top:12px">
        <div class="stat"><div class="k">${T("平值价值 · 90天", "ATM value · 90d")}</div><div class="v acc" id="td-a90">–</div></div>
        <div class="stat"><div class="k">${T("平值价值 · 7天", "ATM value · 7d")}</div><div class="v" id="td-a7">–</div></div>
        <div class="stat"><div class="k">${T("平值 Theta · 7天", "ATM Theta · 7d")}</div><div class="v neg" id="td-t7">–</div></div>
      </div>

      <p class="demo-tip" id="td-tip"></p>
    </div>`;

  const $ = (id) => root.querySelector(id);

  function paint() {
    const sigma = +$("#td-iv").value / 100;
    $("#td-iv-v").textContent = (sigma * 100).toFixed(0);

    // x = 剩余天数（lo=0.2 防止 T=0 退化；hi=90）。左侧靠近到期。
    const valATM = (days) => bsPrice({ S, K: Katm, T: Math.max(days, 0.2) / 365, r, sigma, type: "call" });
    const valOTM = (days) => bsPrice({ S, K: Kotm, T: Math.max(days, 0.2) / 365, r, sigma, type: "call" });

    const res = lineChart({
      fns: [
        { f: valATM, cls: "line" },   // 平值（青）
        { f: valOTM, cls: "line2" },  // 虚值（金）
      ],
      lo: 0.2, hi: maxDays,
      xlabel: T("剩余天数（← 越靠左越接近到期）", "Days remaining (← closer to expiry on the left)"),
      forceZero: true,
    });
    $("#td-chart").innerHTML = chartBlock(res, [
      ["var(--accent)", T("平值看涨 K=100（加速塌陷）", "ATM call K=100 (accelerating decay)")],
      ["var(--gold)", T("虚值看涨 K=110（缓慢失血）", "OTM call K=110 (slow bleed)")],
    ]);

    const a90 = valATM(90), a7 = valATM(7);
    const t7 = greeks({ S, K: Katm, T: 7 / 365, r, sigma, type: "call" }).theta;
    $("#td-a90").textContent = "$" + a90.toFixed(2);
    $("#td-a7").textContent = "$" + a7.toFixed(2);
    $("#td-t7").textContent = t7.toFixed(3);

    $("#td-tip").innerHTML = T(
      `注意<b>青线（平值）</b>右段平缓、左段（临近到期）<b>陡然塌陷</b>——时间价值按约 √T 加速融化。这里平值从 90 天的 $${a90.toFixed(2)} 跌到 7 天的 $${a7.toFixed(2)}，且越往后跌得越快（7 天时 Theta 已达 ${t7.toFixed(3)}/天）。<b>金线（虚值 K=110）</b>则一路缓慢失血、早早趋零——买虚值彩票多数是“每天慢慢输”，不是最后一天才输。把 IV 拉高 → 整条曲线抬升（Vega>0，阶段 5.5）。`,
      `The <b>cyan line (ATM)</b> is gentle on the right but <b>collapses</b> on the left (near expiry) — time value melts faster as √T shrinks. Here ATM falls from $${a90.toFixed(2)} (90d) to $${a7.toFixed(2)} (7d), accelerating (Theta is ${t7.toFixed(3)}/day at 7d). The <b>gold line (OTM K=110)</b> bleeds slowly to ~zero — an OTM lottery mostly loses a little every day, not only at the end. Raise IV → the whole curve lifts (Vega>0, Stage 5.5).`
    );
  }

  $("#td-iv").addEventListener("input", paint);
  paint();
}
