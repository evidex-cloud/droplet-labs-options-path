// 交互演示：蒙特卡洛定价 —— 模拟 N 条风险中性 GBM 路径，贴现回报取均值 = MC 价，看它收敛到 BS。
// N 滑块 100–5000；画 ~30 条样本路径（class "path-mc"）；标准误差带 ±2·SE；对比 BS 真值。
// 用确定性 PRNG（mulberry32 + Box–Muller，按 seed 复现），所以同一 N 每次渲染一致、随 N 增大收敛。真算。
import { bsPrice } from "./_bs.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // 基准参数（与课文一致）：S0=K=100, T=1, r=5%, σ=20% 看涨, BS=10.45
  const S0 = 100, K = 100, Tt = 1, r = 0.05, sigma = 0.2;
  const BS = bsPrice({ S: S0, K, T: Tt, r, sigma, type: "call" });

  // 确定性随机数（mulberry32）
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function makeGauss(rng) {
    let spare = null;
    return function () {
      if (spare !== null) { const v = spare; spare = null; return v; }
      let u = 0, v = 0;
      while (u === 0) u = rng();
      while (v === 0) v = rng();
      const mag = Math.sqrt(-2 * Math.log(u));
      spare = mag * Math.sin(2 * Math.PI * v);
      return mag * Math.cos(2 * Math.PI * v);
    };
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🎲 ${T("蒙特卡洛定价：抽样逼近，向 Black-Scholes 收敛", "Monte Carlo pricing: sampling converges to Black-Scholes")}</div>

      <div class="demo-row" style="margin-bottom:4px">
        <div class="demo-seg" id="mc-seg">
          <button data-a="0" class="on">${T("普通抽样", "Plain")}</button>
          <button data-a="1">${T("对偶变量(方差缩减)", "Antithetic (var. reduction)")}</button>
        </div>
        <button class="demo-btn" id="mc-reseed">${T("换一组随机数", "Re-seed")}</button>
      </div>

      <div class="demo-block">
        <label class="demo-label">${T("模拟路径数 N", "Number of paths N")} = <b id="mc-n-v">1000</b></label>
        <input class="demo-slider" id="mc-n" type="range" min="100" max="5000" step="100" value="1000"/>
      </div>

      <div class="chart" id="mc-chart"></div>

      <div class="stat-row" style="margin-top:12px">
        <div class="stat"><div class="k">${T("MC 价", "MC price")}</div><div class="v acc" id="mc-price">–</div></div>
        <div class="stat"><div class="k">${T("BS 真值", "BS truth")}</div><div class="v" id="mc-bs">–</div></div>
        <div class="stat"><div class="k">${T("标准误差 ±2·SE", "Std. error ±2·SE")}</div><div class="v" id="mc-se">–</div></div>
        <div class="stat"><div class="k">${T("MC − BS 误差", "MC − BS error")}</div><div class="v" id="mc-err">–</div></div>
      </div>

      <p class="demo-meta" id="mc-conv"></p>

      <p class="demo-tip">${T(
        "每条细线是一条风险中性 GBM 路径 S_T = S₀·exp((r−σ²/2)T + σ√T·Z)。MC 价 = 所有路径<b>贴现回报的平均</b>；灰色带是 95% 区间(±2·SE)。把 N 从 100 拖到 5000：价格<b>稳稳收敛到 BS=10.45</b>，误差带按 ~1/√N 收窄(N×4，带宽减半)。切到<b>对偶变量</b>，同样路径数下误差带明显更窄——这就是方差缩减。",
        "Each thin line is one risk-neutral GBM path S_T = S₀·exp((r−σ²/2)T + σ√T·Z). The MC price is the <b>average discounted payoff</b>; the grey band is the 95% interval (±2·SE). Drag N from 100 to 5000: the price <b>converges to BS=10.45</b>, the band narrowing as ~1/√N (×4 paths halves it). Switch to <b>antithetic</b> and the band shrinks for the same path count — variance reduction."
      )}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  let anti = false, seed = 12345;
  const m = (v) => "$" + v.toFixed(2);

  // 跑一遍蒙特卡洛：返回 {price, se, samplePaths:[[..steps S]], terminalPrice}
  function runMC(N) {
    const steps = 30;               // 画图用的步数（路径折线）
    const dt = Tt / steps;
    const drift = (r - sigma * sigma / 2) * dt;
    const vol = sigma * Math.sqrt(dt);
    const disc = Math.exp(-r * Tt);
    const rng = mulberry32(seed);
    const gauss = makeGauss(rng);

    let sum = 0, sum2 = 0, count = 0;
    const sampleN = Math.min(30, N);     // 最多画 30 条
    const paths = [];

    // 决定哪些 i 要被记录成样本路径（均匀取 sampleN 条）
    const recordEvery = Math.max(1, Math.floor(N / sampleN));

    let made = 0;
    for (let i = 0; i < N; i++) {
      const record = paths.length < sampleN && i % recordEvery === 0;
      // 路径 A（+Z 序列）
      const zs = [];
      let sA = S0;
      const pathA = record ? [S0] : null;
      for (let t = 0; t < steps; t++) {
        const z = gauss();
        zs.push(z);
        sA *= Math.exp(drift + vol * z);
        if (pathA) pathA.push(sA);
      }
      const payA = Math.max(sA - K, 0) * disc;

      if (anti) {
        // 路径 B 用 −Z，与 A 配成对，取回报平均（方差缩减）
        let sB = S0;
        for (let t = 0; t < steps; t++) sB *= Math.exp(drift - vol * zs[t]);
        const payB = Math.max(sB - K, 0) * disc;
        const avg = (payA + payB) / 2;
        sum += avg; sum2 += avg * avg; count++;
      } else {
        sum += payA; sum2 += payA * payA; count++;
      }
      if (pathA) paths.push(pathA);
      made++;
    }

    const mean = sum / count;
    const variance = Math.max(0, sum2 / count - mean * mean);
    const se = Math.sqrt(variance / count);
    return { price: mean, se, paths, steps };
  }

  // 自绘 SVG：左半区画样本路径(price-time)，并叠加 MC 价水平线 + ±2SE 带 + BS 线
  function drawChart(res, N) {
    const W = 560, H = 280;
    const mL = 46, mR = 14, mT = 16, mB = 28;
    const plotL = mL, plotR = W - mR, plotT = mT, plotB = H - mB;
    const steps = res.steps;

    // y 轴：股价范围，覆盖路径与 K
    let ymin = Infinity, ymax = -Infinity;
    for (const p of res.paths) for (const v of p) { if (v < ymin) ymin = v; if (v > ymax) ymax = v; }
    if (!isFinite(ymin)) { ymin = 60; ymax = 160; }
    ymin = Math.min(ymin, K) * 0.96; ymax = Math.max(ymax, K) * 1.02;

    const xMap = (t) => plotL + (t / steps) * (plotR - plotL);
    const yMap = (y) => plotB - (y - ymin) / (ymax - ymin) * (plotB - plotT);

    // 网格 x（时间）
    let grid = "";
    for (let i = 0; i <= 4; i++) {
      const px = plotL + (plotR - plotL) * (i / 4);
      grid += `<line class="grid" x1="${px.toFixed(1)}" y1="${plotT}" x2="${px.toFixed(1)}" y2="${plotB}"/>`;
    }
    // 行权价 K 水平线
    const kY = yMap(K);
    const kLine = `<line class="zero" x1="${plotL}" y1="${kY.toFixed(1)}" x2="${plotR}" y2="${kY.toFixed(1)}"/>`
      + `<text class="lbl-axis" x="${plotR - 2}" y="${(kY - 4).toFixed(1)}" text-anchor="end" style="fill:var(--gold)">K=${K}</text>`;

    // 样本路径
    const lines = res.paths.map((p) => {
      const pts = p.map((y, t) => `${xMap(t).toFixed(1)},${yMap(y).toFixed(1)}`).join(" ");
      return `<polyline class="path-mc" points="${pts}"/>`;
    }).join("");

    // y 轴标签
    let ylab = "";
    for (const yv of [ymax, (ymin + ymax) / 2, ymin]) {
      ylab += `<text class="lbl-axis" x="${plotL - 6}" y="${(yMap(yv) + 3).toFixed(1)}" text-anchor="end">${yv.toFixed(0)}</text>`;
    }
    const startDot = `<circle cx="${xMap(0).toFixed(1)}" cy="${yMap(S0).toFixed(1)}" r="3" fill="var(--accent)"/>`
      + `<text class="lbl-axis" x="${(plotL + 4).toFixed(1)}" y="${(yMap(S0) - 6).toFixed(1)}">S₀=${S0}</text>`;
    const xname = `<text class="lbl-axis" x="${((plotL + plotR) / 2).toFixed(1)}" y="${H - 2}" text-anchor="middle">${T("时间 0 → 到期 T", "time 0 → expiry T")}</text>`;

    $("#mc-chart").innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">
      ${grid}${kLine}
      <line class="axis" x1="${plotL}" y1="${plotT}" x2="${plotL}" y2="${plotB}"/>
      <line class="axis" x1="${plotL}" y1="${plotB}" x2="${plotR}" y2="${plotB}"/>
      ${lines}${startDot}${ylab}${xname}
    </svg>`;
  }

  // 收敛阶梯：固定 seed 下，N=200/1000/5000 的 MC 价
  function convergenceRow() {
    const savedAnti = anti;
    const ladder = [200, 1000, 5000].map((nn) => {
      const r2 = runMC(nn);
      return `N=${nn} → ${m(r2.price)}`;
    });
    anti = savedAnti;
    return ladder.join(",  ");
  }

  function paint() {
    const N = +$("#mc-n").value;
    $("#mc-n-v").textContent = N;
    const res = runMC(N);

    drawChart(res, N);

    $("#mc-price").textContent = m(res.price);
    $("#mc-bs").textContent = m(BS);
    $("#mc-se").textContent = "±" + (2 * res.se).toFixed(2);
    const err = res.price - BS;
    $("#mc-err").textContent = (err >= 0 ? "+" : "") + err.toFixed(2);
    $("#mc-err").className = "v " + (Math.abs(err) <= 2 * res.se ? "pos" : "neg");

    $("#mc-conv").innerHTML =
      `${T("收敛阶梯", "Convergence ladder")} (${anti ? T("对偶", "antithetic") : T("普通", "plain")}): ` +
      convergenceRow() + `  <span class="pill acc">Black-Scholes = ${m(BS)}</span>`;
  }

  $("#mc-seg").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    anti = b.dataset.a === "1";
    [...$("#mc-seg").children].forEach((c) => c.classList.toggle("on", c === b));
    paint();
  });
  $("#mc-reseed").addEventListener("click", () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; paint(); });
  $("#mc-n").addEventListener("input", paint);
  paint();
}
