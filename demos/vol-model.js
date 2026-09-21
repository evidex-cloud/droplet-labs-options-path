// 交互演示：波动率聚集。用一个 GARCH 式递推（σ²_t=ω+α·r²+β·σ²）生成收益率序列，看“风暴扎堆”。
// 与“常数波动率”并排对比。.demo-seg [常数波动率 / GARCH聚集]。
// 关键：冲击 z_t 用确定性序列（按序号的正弦组合，非 Math.random），所以每次渲染一致、可复现。真算递推。
import { lineChart, chartBlock } from "./_chart.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const Ndays = 250;           // 一年交易日
  // GARCH(1,1) 参数（年化波动 ~20% 量级，日频）
  const longVarDaily = Math.pow(0.20 / Math.sqrt(252), 2); // 日方差长期均值
  const alpha = 0.10, beta = 0.86;
  const omega = longVarDaily * (1 - alpha - beta);

  // 确定性“冲击”序列 z_t：多正弦叠加 + 偶发大冲击，制造可复现的随机感
  function shock(t) {
    const a = Math.sin(t * 0.7) + Math.sin(t * 1.93 + 1.1) + Math.sin(t * 0.37 + 2.3)
      + 0.6 * Math.sin(t * 5.1 + 0.5);
    // 偶发尖峰（确定性）：在若干固定日子放大
    const spike = (t % 67 === 30 ? -3.0 : 0) + (t % 91 === 12 ? 2.6 : 0) + (t % 113 === 70 ? -2.2 : 0);
    return a * 0.62 + spike;
  }

  // 生成两条收益率序列：常数波动率 / GARCH 聚集
  function buildSeries() {
    const constVolDaily = Math.sqrt(longVarDaily); // 常数：等于长期日波动
    const rConst = [], rGarch = [], volGarch = [];
    let v = longVarDaily;                            // GARCH 当前日方差
    for (let t = 0; t < Ndays; t++) {
      const z = shock(t);
      // 常数波动率：r_t = constVol · z
      rConst.push(constVolDaily * z * 100);         // 百分比
      // GARCH：先用当前 v 生成收益，再更新 v
      const rt = Math.sqrt(v) * z;
      rGarch.push(rt * 100);
      volGarch.push(Math.sqrt(v) * Math.sqrt(252) * 100); // 年化波动 %
      v = omega + alpha * rt * rt + beta * v;        // 递推：今天的冲击平方喂给明天
    }
    return { rConst, rGarch, volGarch, constVolAnn: constVolDaily * Math.sqrt(252) * 100 };
  }

  const data = buildSeries();

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🌪️ ${T("波动率聚集：常数波动率 vs GARCH（风暴会扎堆）", "Volatility clustering: constant vol vs GARCH (storms cluster)")}</div>

      <div class="demo-seg" id="vm-seg" style="margin-bottom:10px">
        <button data-m="const" class="on">${T("常数波动率(BS 假设)", "Constant vol (BS)")}</button>
        <button data-m="garch">${T("GARCH 聚集(现实)", "GARCH clustering (real)")}</button>
        <button data-m="vol">${T("GARCH 的波动率轨迹", "GARCH vol path")}</button>
      </div>

      <div class="chart" id="vm-chart"></div>

      <div class="stat-row" style="margin-top:12px">
        <div class="stat"><div class="k">${T("年化波动率", "Annualized vol")}</div><div class="v acc" id="vm-vol">–</div></div>
        <div class="stat"><div class="k">${T("最大单日波动", "Largest daily move")}</div><div class="v" id="vm-max">–</div></div>
        <div class="stat"><div class="k">${T("α + β（聚集持续性）", "α + β (persistence)")}</div><div class="v" id="vm-ab">–</div></div>
      </div>

      <p class="demo-meta" id="vm-note"></p>

      <p class="demo-tip">${T(
        "两条用的是<b>同一串冲击 z_t</b>。常数波动率(BS 假设)下振幅均匀；GARCH 让大波动<b>扎堆</b>。这是<b>已实现波动的聚集演示</b>，<b>不是交易屏，也不暗示 Heston 是屏幕中间价</b>——台上标记今天的微笑常用 SVI/SABR（阶段 9.3 第⑥块）。",
        "Both use the <b>same shock series z_t</b>. Constant vol is uniform; GARCH lets big moves <b>cluster</b>. This is a <b>realized-vol clustering demo</b> — <b>not a trading screen, and it does not imply Heston is the screen mid</b>. Desks often mark today's smile with SVI/SABR (Stage 9.3 piece ⑥)."
      )}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  let mode = "const";

  function paint() {
    let series, color, legend, ann, maxMove, note;
    if (mode === "vol") {
      series = data.volGarch;
      color = "var(--gold)";
      legend = T("GARCH 年化波动率 (%)", "GARCH annualized vol (%)");
      const arr = data.volGarch;
      ann = arr.reduce((a, b) => a + b, 0) / arr.length;
      maxMove = Math.max(...arr);
      note = T(
        `这是 GARCH 的<b>波动率轨迹</b>本身：一次大冲击后波动<b>跳高</b>，再沿 α+β=${(alpha + beta).toFixed(2)} 的速度<b>缓缓回落</b>到长期 20% 附近——既不是常数，也不会无限发散，而是带均值回归的“天气”。波动率本身可交易、可预测，这正是 GARCH 的用武之地(预测已实现波动，阶段 4.2)。`,
        `This is GARCH's <b>volatility path</b> itself: after a big shock vol <b>jumps</b>, then <b>decays</b> back toward the long-run ~20% at rate α+β=${(alpha + beta).toFixed(2)} — neither constant nor exploding, but mean-reverting 'weather'. Volatility is itself tradable and forecastable — exactly what GARCH is for (forecasting realized vol, Stage 4.2).`
      );
    } else {
      const isGarch = mode === "garch";
      series = isGarch ? data.rGarch : data.rConst;
      color = isGarch ? "var(--accent)" : "var(--muted)";
      legend = T("日收益率 (%)", "Daily return (%)");
      // 年化波动率 = 日收益标准差 × √252
      const sd = Math.sqrt(series.reduce((a, b) => a + b * b, 0) / series.length);
      ann = sd * Math.sqrt(252);
      maxMove = Math.max(...series.map(Math.abs));
      note = isGarch
        ? T(
          `GARCH 序列：注意第 ~30、~120、~190 天附近的<b>风暴扎堆</b>——大涨大跌挤在一起，中间夹着长长的平静期。这种<b>波动聚集</b>是真实市场的铁律，常数波动率完全抓不住。整段的年化波动和常数版接近，但<b>分布天差地别</b>(肥尾、聚集)。`,
          `GARCH series: note the <b>storm clusters</b> near days ~30, ~120, ~190 — big moves bunch together with long calm stretches between. This <b>volatility clustering</b> is a law of real markets that constant vol misses entirely. The overall annualized vol is similar to the constant case, but the <b>distribution is utterly different</b> (fat tails, clustering).`
        )
        : T(
          `常数波动率(BS 假设)：每天的振幅<b>大致均匀</b>，没有平静期也没有风暴——这正是 Black-Scholes 把 σ 当常数的世界。它好算，但和真实收益率<b>对不上</b>(切到 GARCH 看差别)。`,
          `Constant vol (BS assumption): the amplitude is <b>roughly uniform</b> every day — no calm spells, no storms — the world where Black-Scholes treats σ as constant. Tidy to compute, but it <b>doesn't match</b> real returns (switch to GARCH to see).`
        );
    }

    const res = lineChart({
      fns: [{ f: (x) => series[Math.max(0, Math.min(series.length - 1, Math.round(x)))], cls: mode === "garch" ? "line" : mode === "vol" ? "line2" : "line3" }],
      lo: 0, hi: series.length - 1,
      xlabel: T("交易日", "trading day"),
      forceZero: mode !== "vol",
      samples: series.length - 1,
    });
    $("#vm-chart").innerHTML = chartBlock(res, [[color, legend]]);

    $("#vm-vol").textContent = ann.toFixed(1) + "%";
    $("#vm-max").textContent = (mode === "vol" ? "" : "±") + maxMove.toFixed(1) + "%";
    $("#vm-ab").textContent = (alpha + beta).toFixed(2);
    $("#vm-note").innerHTML = note;
  }

  $("#vm-seg").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    mode = b.dataset.m;
    [...$("#vm-seg").children].forEach((c) => c.classList.toggle("on", c === b));
    paint();
  });
  paint();
}
