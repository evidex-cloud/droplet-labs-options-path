// 交互演示（说明性 / illustrative，Almgren-Chriss 风格）：在 N=10 个时间片内卖出 10 万股。
// 三种执行节奏：一次性砸盘 / 匀速 TWAP / 自适应（随风险厌恶 λ 前置加速）。
// 成本两部分（真算、确定性）：
//   市场冲击成本 = Σ η·qᵢ²   （凸：单片卖得越多，冲击越不成比例地大 → 砸盘最惨）
//   时机风险     = λ·√(Σ (σ·P)²·剩余库存²)  （卖得越慢，剩余越久暴露在价格漂移下 → TWAP 拖尾风险大）
// 关键现象：砸盘=冲击爆炸、时机风险=0；TWAP=冲击小但时机风险高；自适应在两者间取最优，总成本最低。
// λ 滑块调风险厌恶：越厌恶风险，自适应越前置加速（更像砸盘那一端）。这正是 RL 学的“看状态调节奏”。
// 诚实标注：真正的 RL 在含订单簿/非线性冲击的环境里“学”这条曲线；这里用解析的 AC 形状示意同一权衡。

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const X = 100000, N = 10, P0 = 50, eta = 9e-6, sigma = 0.015;

  // 评估一条卖出计划 q[i]（各片卖出股数，和为 X）
  function evalSchedule(q, lam) {
    let impact = 0;
    for (let i = 0; i < q.length; i++) impact += eta * q[i] * q[i];
    let rem = X, varSum = 0;
    for (let i = 0; i < q.length; i++) { rem -= q[i]; varSum += (sigma * P0) * (sigma * P0) * rem * rem; }
    const timingStd = Math.sqrt(varSum);
    return { impact, timingStd, risk: lam * timingStd, total: impact + lam * timingStd };
  }
  const blast = () => { const q = new Array(N).fill(0); q[0] = X; return q; };
  const twap = () => new Array(N).fill(X / N);
  // 自适应：指数前置（κ 随风险厌恶 λ 增大 → 越早卖完、越省时机风险，逼近 AC 最优形状）
  function adaptive(lam) {
    const kappa = Math.max(0.2, Math.min(1.4, 0.15 + 0.55 * lam));
    const w = []; for (let i = 0; i < N; i++) w.push(Math.exp(-kappa * i));
    const s = w.reduce((a, b) => a + b, 0);
    return w.map((x) => X * x / s);
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🏭 ${T("最优执行：卖出 10 万股 —— 砸盘 vs TWAP vs 自适应", "Optimal execution: sell 100k shares — blast vs TWAP vs adaptive")}
        <span class="pill gold" style="margin-left:8px">${T("示意 / 教学", "illustrative")}</span>
      </div>

      <div class="demo-row">
        <div class="demo-seg" id="ex-seg">
          <button data-s="blast" class="on">${T("一次性砸盘", "Blast all at once")}</button>
          <button data-s="twap">${T("匀速 TWAP", "Even TWAP")}</button>
          <button data-s="adapt">${T("自适应", "Adaptive")}</button>
        </div>
      </div>

      <div class="demo-block">
        <label class="demo-label">${T("风险厌恶 λ（越大越怕价格漂移、越想早点卖完）", "Risk aversion λ (higher = more afraid of price drift, sell sooner)")} = <b id="ex-lam-v">0.80</b></label>
        <input class="demo-slider" id="ex-lam" type="range" min="0.2" max="1.5" step="0.05" value="0.8"/>
      </div>

      <div class="demo-meta" style="margin-bottom:4px">${T("每个时间片卖出多少（卖出计划）：", "Shares sold each time slice (the schedule):")}</div>
      <div id="ex-bars"></div>

      <div class="stat-row" style="margin-top:14px">
        <div class="stat"><div class="k">${T("市场冲击成本", "Market-impact cost")}</div><div class="v" id="ex-imp">–</div></div>
        <div class="stat"><div class="k">${T("时机风险(惩罚)", "Timing risk (penalty)")}</div><div class="v" id="ex-risk">–</div></div>
        <div class="stat"><div class="k">${T("总执行成本", "Total exec cost")}</div><div class="v acc" id="ex-tot">–</div></div>
        <div class="stat"><div class="k">${T("相对最优", "vs best")}</div><div class="v" id="ex-rel">–</div></div>
      </div>

      <p class="demo-tip" id="ex-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const k$ = (v) => "$" + Math.round(v).toLocaleString("en-US");
  let strat = "blast";

  function schedFor(s, lam) {
    return s === "blast" ? blast() : s === "twap" ? twap() : adaptive(lam);
  }

  // 卖出计划条形图（每片一根，高度 = 该片卖出量）
  function bars(q) {
    const maxq = Math.max(...q);
    const W = 560, H = 150, mL = 8, mR = 8, mB = 22, mT = 8;
    const plotL = mL, plotR = W - mR, plotB = H - mB, plotT = mT;
    const bw = (plotR - plotL) / N * 0.7, gap = (plotR - plotL) / N;
    let rects = "";
    for (let i = 0; i < N; i++) {
      const h = maxq > 0 ? (q[i] / maxq) * (plotB - plotT) : 0;
      const x = plotL + i * gap + (gap - bw) / 2;
      const y = plotB - h;
      const pct = (q[i] / X * 100);
      rects += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(0, h).toFixed(1)}" rx="2" fill="var(--accent)" opacity="${q[i] > 0 ? 0.9 : 0.15}"/>`;
      if (pct >= 4) rects += `<text x="${(x + bw / 2).toFixed(1)}" y="${(y - 3).toFixed(1)}" text-anchor="middle" class="lbl-axis" style="font-size:10px">${pct.toFixed(0)}%</text>`;
      rects += `<text x="${(x + bw / 2).toFixed(1)}" y="${(plotB + 14).toFixed(1)}" text-anchor="middle" class="lbl-axis" style="font-size:10px">t${i + 1}</text>`;
    }
    return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">
      <line class="axis" x1="${plotL}" y1="${plotB}" x2="${plotR}" y2="${plotB}"/>${rects}
    </svg></div>`;
  }

  function paint() {
    const lam = +$("#ex-lam").value;
    $("#ex-lam-v").textContent = lam.toFixed(2);

    const q = schedFor(strat, lam);
    $("#ex-bars").innerHTML = bars(q);
    const res = evalSchedule(q, lam);

    // 三种策略当前 λ 下的总成本，找最优供对比
    const all = {
      blast: evalSchedule(blast(), lam).total,
      twap: evalSchedule(twap(), lam).total,
      adapt: evalSchedule(adaptive(lam), lam).total,
    };
    const best = Math.min(all.blast, all.twap, all.adapt);

    $("#ex-imp").textContent = k$(res.impact);
    $("#ex-risk").textContent = k$(res.risk);
    $("#ex-tot").textContent = k$(res.total);
    const rel = res.total - best;
    $("#ex-rel").textContent = rel < 1 ? T("最优 ✓", "best ✓") : "+" + k$(rel);
    $("#ex-rel").className = "v " + (rel < 1 ? "pos" : "neg");

    let tip;
    if (strat === "blast") {
      tip = T(
        `<b>一次性砸盘</b>：t1 把全部 10 万股市价抛出。<b>时机风险＝0</b>（瞬间清仓，没有夜长梦多），但你<b>把价格砸穿了</b>——市场冲击成本爆炸到 <b>${k$(res.total)}</b>，是最贵的一档。这是“冲击 vs 时机”权衡的一个极端角点。试试 TWAP 看另一个极端。`,
        `<b>Blast</b>: dump all 100k shares at t1. <b>Timing risk = 0</b> (instant, no overnight exposure), but you <b>crater your own price</b> — market impact explodes to <b>${k$(res.total)}</b>, the most expensive choice. This is one extreme corner of the impact-vs-timing trade-off. Try TWAP for the other extreme.`
      );
    } else if (strat === "twap") {
      tip = T(
        `<b>匀速 TWAP</b>：每片各卖 1 万股。冲击成本很低（${k$(res.impact)}，分摊开了），<b>但拖得久</b>——大量库存长时间暴露在价格漂移下，<b>时机风险高达 ${k$(res.risk)}</b>，总成本 <b>${k$(res.total)}</b>。简单稳健，却不是最优。看<b>自适应</b>怎么两头兼顾。`,
        `<b>Even TWAP</b>: sell 10k each slice. Impact is low (${k$(res.impact)}, spread out), <b>but it drags</b> — lots of inventory exposed to price drift for a long time, so <b>timing risk is ${k$(res.risk)}</b>, total <b>${k$(res.total)}</b>. Simple and robust, but not optimal. See how <b>Adaptive</b> balances both.`
      );
    } else {
      const front = (q[0] / X * 100).toFixed(0);
      tip = T(
        `<b>自适应</b>（当前 λ=${lam.toFixed(2)}）：<b>前快后慢</b>——先卖掉约 ${front}% 削减库存暴露，再放慢减小冲击。在“冲击(${k$(res.impact)}) vs 时机风险(${k$(res.risk)})”间取最优，总成本 <b>${k$(res.total)}</b>，<b>同时低于砸盘和 TWAP</b>。把 λ 调大（更怕漂移）→ 它<b>更前置</b>（逼近砸盘端）；调小 → 更匀（逼近 TWAP）。<b>这正是强化学习要学的：从“状态(库存/剩余时间/市况)”到“动作(本片卖多少)”的自适应策略</b>（阶段 10.6）。`,
        `<b>Adaptive</b> (λ=${lam.toFixed(2)}): <b>front-loaded</b> — sell ~${front}% early to cut inventory exposure, then slow down to limit impact. It optimizes the impact(${k$(res.impact)})-vs-timing(${k$(res.risk)}) trade-off, total <b>${k$(res.total)}</b>, <b>beating both blast and TWAP</b>. Raise λ (more drift-averse) → it front-loads <b>harder</b> (toward blast); lower λ → flatter (toward TWAP). <b>This is exactly what RL learns: a state(inventory/time/market)→action(slice size) policy</b> (Stage 10.6).`
      );
    }
    $("#ex-tip").innerHTML = tip;
  }

  $("#ex-seg").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    strat = b.dataset.s;
    [...$("#ex-seg").children].forEach((c) => c.classList.toggle("on", c === b));
    paint();
  });
  $("#ex-lam").addEventListener("input", paint);
  paint();
}
