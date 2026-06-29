// 交互演示（说明性 / illustrative）：一个“波动率预测”玩具。
// 真算，但用确定性序列（无随机数，刷新一致）：
//   · 潜在波动率 latent：平滑、会聚集、带两段“财报/危机”尖峰后均值回归 —— 模拟真实波动的惯性。
//   · 观测日波动 obs = latent + 确定性高频“噪声”（不可交易掉的估计噪声）。
//   预测目标 = 当天 obs。两个预测器：
//     (1) 天真法 naive：直接用“昨天的观测”当今天预测（随机游走）。
//     (2) 略聪明的 EWMA/AR(1) 预测：对观测做指数平滑，过滤噪声、抓住持久水平。
//   画 actual(obs) vs naive vs EWMA，并给 RMSE —— EWMA 比 naive“小而真”地更好。
//   λ 滑块让你看到平滑强度的取舍（太大反而滞后变差）。诚实标注：这是教学示意，非真实模型。
import { lineChart } from "./_chart.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const N = 80;     // 交易日
  const FROM = 6;   // 评估从第 6 天起（让预测器先“热身”）

  // 潜在波动率：平滑 + 聚集 + 两段尖峰后均值回归（确定性）
  function latentSeries() {
    const lat = []; let v = 18;
    for (let t = 0; t < N; t++) {
      let mean = 19 + 7 * Math.sin(t / 16);
      if (t >= 20 && t < 34) mean += 17 * Math.exp(-(t - 20) / 5);  // 财报式尖峰
      if (t >= 55 && t < 72) mean += 22 * Math.exp(-(t - 55) / 6);  // 危机式聚集
      v = 0.80 * v + 0.20 * mean;                                   // 平滑、持久
      lat.push(v);
    }
    return lat;
  }
  // 确定性“噪声”：几条无公约数的正弦叠加，看着像随机、但完全可复现
  const noise = (t) => 3.4 * Math.sin(t * 2.39996) + 2.1 * Math.sin(t * 5.7 + 1.3) + 1.7 * Math.cos(t * 9.13 + 0.4);

  const latent = latentSeries();
  const obs = latent.map((v, t) => Math.max(6, v + noise(t)));   // 观测到的日波动（含噪声）

  // 预测器
  const naive = obs.map((_, t) => (t > 0 ? obs[t - 1] : obs[0]));  // 昨天的观测
  function ewma(lam) {
    const f = [obs[0]];
    for (let t = 1; t < N; t++) f.push(lam * f[t - 1] + (1 - lam) * obs[t - 1]);
    return f;
  }
  function rmse(pred) {
    let s = 0, n = 0;
    for (let t = FROM; t < N; t++) { const e = obs[t] - pred[t]; s += e * e; n++; }
    return Math.sqrt(s / n);
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🔮 ${T("波动率预测玩具：天真法 vs 略聪明的 EWMA", "Vol-forecast toy: naïve vs a slightly smarter EWMA")}
        <span class="pill gold" style="margin-left:8px">${T("示意 / 教学", "illustrative")}</span>
      </div>

      <div class="demo-block">
        <label class="demo-label">${T("EWMA 平滑系数 λ", "EWMA smoothing λ")} = <b id="mv-lam-v">0.60</b>
          &nbsp;<span class="demo-meta" style="display:inline">${T("（λ 越大越平滑、反应越慢）", "(higher λ = smoother but laggier)")}</span></label>
        <input class="demo-slider" id="mv-lam" type="range" min="0.30" max="0.92" step="0.02" value="0.60"/>
      </div>

      <div class="chart" id="mv-chart"></div>

      <div class="stat-row" style="margin-top:12px">
        <div class="stat"><div class="k">${T("天真法 RMSE", "Naïve RMSE")}</div><div class="v" id="mv-rn">–</div></div>
        <div class="stat"><div class="k">${T("EWMA RMSE", "EWMA RMSE")}</div><div class="v acc" id="mv-re">–</div></div>
        <div class="stat"><div class="k">${T("误差改善", "Error reduction")}</div><div class="v" id="mv-imp">–</div></div>
        <div class="stat"><div class="k">${T("当前 EWMA 预测", "Latest EWMA pred")}</div><div class="v" id="mv-last">–</div></div>
      </div>

      <p class="demo-meta" id="mv-note"></p>

      <p class="demo-tip" id="mv-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  function draw(lam) {
    const fe = ewma(lam);
    // lineChart 接受 f(x)：x 当作天数索引，取最近整数点
    const ix = (x) => Math.max(0, Math.min(N - 1, Math.round(x)));
    const res = lineChart({
      fns: [
        { f: (x) => obs[ix(x)], cls: "line3", label: "actual" },   // 实际观测：红
        { f: (x) => naive[ix(x)], cls: "line2", label: "naive" },  // 天真：金
        { f: (x) => fe[ix(x)], cls: "line", label: "ewma" },       // EWMA：青
      ],
      lo: 0, hi: N - 1, samples: N - 1,
      xlabel: T("交易日 →", "trading day →"),
      forceZero: false,
    });
    $("#mv-chart").innerHTML = res.svg +
      `<div class="payoff-legend">
        <span><i style="width:14px;height:3px;border-radius:2px;background:var(--red)"></i> ${T("实际波动(含噪声)", "actual vol (noisy)")}</span>
        <span><i style="width:14px;height:3px;border-radius:2px;background:var(--gold)"></i> ${T("天真法(=昨天)", "naïve (=yesterday)")}</span>
        <span><i style="width:14px;height:3px;border-radius:2px;background:var(--accent)"></i> ${T("EWMA 预测", "EWMA forecast")}</span>
      </div>`;

    const rn = rmse(naive), re = rmse(fe);
    const imp = (1 - re / rn) * 100;
    $("#mv-rn").textContent = rn.toFixed(2);
    $("#mv-re").textContent = re.toFixed(2);
    $("#mv-imp").textContent = (imp >= 0 ? "−" : "+") + Math.abs(imp).toFixed(0) + "%";
    $("#mv-imp").className = "v " + (imp > 0 ? "pos" : "neg");
    $("#mv-last").textContent = fe[N - 1].toFixed(1) + "%";

    $("#mv-note").innerHTML = T(
      `预测目标＝当天“实际波动”。天真法直接抄昨天（随机游走），被噪声晃得团团转；EWMA 把过去观测<b>指数平滑</b>，过滤掉不可交易的估计噪声、抓住<b>持久的波动水平</b>，于是误差更小。`,
      `Target = today's actual vol. The naïve forecast just copies yesterday (a random walk) and gets whipsawed by noise; EWMA <b>exponentially smooths</b> past observations, filtering the un-tradeable estimation noise and locking onto the <b>persistent level</b> — hence smaller error.`
    );

    let verdict;
    if (imp > 5) {
      verdict = T(
        `当前 λ=${lam.toFixed(2)}：EWMA 把 RMSE 从 ${rn.toFixed(2)} 压到 <b>${re.toFixed(2)}</b>（改善约 <b>${imp.toFixed(0)}%</b>）——这正是波动率预测“<b>小而真</b>”的边际：不惊艳，但稳定为正。把这个预测和当前 IV 一比，就是卖方/买方的量化信号（阶段 8.2）。`,
        `At λ=${lam.toFixed(2)}, EWMA cuts RMSE from ${rn.toFixed(2)} to <b>${re.toFixed(2)}</b> (≈<b>${imp.toFixed(0)}%</b> better) — the <b>small-but-real</b> edge of vol forecasting: unglamorous, reliably positive. Compare this forecast to current IV and you get a quantified seller/buyer signal (Stage 8.2).`
      );
    } else {
      verdict = T(
        `λ=${lam.toFixed(2)} 太大了：平滑过度，预测<b>滞后</b>于尖峰，改善缩水到 ${imp.toFixed(0)}%。这说明边际很脆——<b>选错超参数就被吃光</b>。真实建模里，λ（或更复杂模型的参数）必须靠<b>前向滚动样本外</b>来定，不能拍脑袋（阶段 9.6）。`,
        `λ=${lam.toFixed(2)} is too high: over-smoothing makes the forecast <b>lag</b> the spikes, shrinking the gain to ${imp.toFixed(0)}%. The edge is fragile — <b>a bad hyper-parameter erases it</b>. In real modeling, λ (or a richer model's params) must be set by <b>walk-forward out-of-sample</b>, never by guesswork (Stage 9.6).`
      );
    }
    $("#mv-tip").innerHTML = verdict;
  }

  $("#mv-lam").addEventListener("input", (e) => {
    const lam = +e.target.value;
    $("#mv-lam-v").textContent = lam.toFixed(2);
    draw(lam);
  });
  draw(0.60);
}
