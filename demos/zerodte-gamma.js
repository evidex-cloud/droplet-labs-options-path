// 教学演示：距到期剩余小时 vs ATM Gamma。不是 Cboe 实时链。
import { greeks } from "./_bs.js";
import { lineChart, chartBlock } from "./_chart.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const S = 5500, K = 5500, r = 0.04, sigma = 0.16;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">⏱ ${T("0DTE 的 Gamma：把“剩余小时”拖到收盘", "0DTE Gamma: drag remaining hours toward the close")}</div>

      <div class="demo-block">
        <label class="demo-label">${T("距到期剩余小时", "Hours to expiry")} = <b id="zd-h-v">6.5</b></label>
        <input class="demo-slider" id="zd-h" type="range" min="0.5" max="24" step="0.5" value="6.5"/>
      </div>

      <div id="zd-chart"></div>

      <div class="stat-row" style="margin-top:12px">
        <div class="stat"><div class="k">ATM Gamma</div><div class="v acc" id="zd-g">–</div></div>
        <div class="stat"><div class="k">ATM Theta / ${T("天", "day")}</div><div class="v neg" id="zd-t">–</div></div>
        <div class="stat"><div class="k">T (${T("年", "years")})</div><div class="v" id="zd-T">–</div></div>
      </div>

      <p class="demo-tip" id="zd-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  function gAtHours(h) {
    const Tyear = Math.max(h, 0.25) / (365 * 24);
    return greeks({ S, K, T: Tyear, r, sigma, type: "call" });
  }

  function paint() {
    const hours = +$("#zd-h").value;
    $("#zd-h-v").textContent = hours.toFixed(1);

    const res = lineChart({
      fns: [
        { f: (h) => gAtHours(h).gamma, cls: "line" },
        { f: (h) => Math.abs(gAtHours(h).theta) * 0.02, cls: "line2" },
      ],
      lo: 0.5, hi: 24,
      xlabel: T("剩余小时（← 越靠左越接近收盘）", "Hours remaining (← closer to the close on the left)"),
      markerX: hours,
      markerLabel: hours.toFixed(1) + "h",
      forceZero: true,
    });
    $("#zd-chart").innerHTML = chartBlock(res, [
      ["var(--accent)", "ATM Gamma"],
      ["var(--gold)", T("｜Theta｜×0.02（只为同图对照，不是真实单位）", "|Theta|×0.02 (same plot only — not a real unit)")],
    ]);

    const g = gAtHours(hours);
    $("#zd-g").textContent = g.gamma.toFixed(4);
    $("#zd-t").textContent = g.theta.toFixed(2);
    $("#zd-T").textContent = (hours / (365 * 24)).toExponential(2);

    $("#zd-tip").innerHTML = T(
      `这是<b>教学曲线</b>：S=K=5500、σ=16%、欧式看涨，用共享 BS 引擎真算。<b>不是 Cboe 实时链</b>。ATM Gamma 随 √T 变小而爆炸——6.5 小时（一个常规交易时段）已经很陡，拖到 1 小时更陡。金线只是把｜Theta｜缩小画在同一张图上，提醒你：Gamma 炸的同时<b>时间也在按小时抽走</b>。定义好风险的价差仍然要付点差、Theta 和跳空（阶段 2.6、11.6）。`,
      `This is a <b>teaching curve</b>: S=K=5500, σ=16%, European call, live-computed by the shared BS engine. <b>Not a live Cboe chain.</b> ATM Gamma explodes as √T shrinks — already steep at 6.5 hours (a regular session), steeper at 1 hour. The gold line only rescales |Theta| onto the same plot: as Gamma blows up, <b>time is also billing you by the hour</b>. A defined-risk spread still pays spread, Theta, and gap risk (Stages 2.6, 11.6).`
    );
  }

  $("#zd-h").addEventListener("input", paint);
  paint();
}
