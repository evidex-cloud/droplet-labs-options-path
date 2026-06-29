// 交互演示（说明性 / illustrative deep-hedging idea）：
// 卖出 1 张 ATM 看涨，用股票动态对冲，跑 2500 条确定性 GBM 路径，比较两种对冲策略：
//   (A) 经典 BS Delta 对冲：每步都把持股精确调到 Delta×100（band=0，always rebalance）。
//   (B) 成本感知对冲：设一条“不动带”——净 Delta 缺口在 ±8 股内就不动手，省过路费、容忍小残差。
// 交易成本 k 由滑块控制（单步成本 = k·|Δshares|·S）。展示两者最终“对冲盈亏”的均值/标准差，
// 以及一个风险调整评分 score = mean − 0.5·std。关键现象（真算、可复现）：
//   k=0 时 BS 更优（其假设成立）；k>0 起，成本感知在风险调整下胜出，差距随成本扩大——这正是深度对冲的思想。
// 诚实标注：真正的深度对冲用神经网络“学”这条不动带；这里用一条手写的固定带来示意同一个取舍。

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // 标准正态 CDF + ATM 看涨定价/Delta（自带，避免与 _bs 口径耦合）
  const normCDF = (x) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989422804014327 * Math.exp(-x * x / 2);
    const p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return x >= 0 ? 1 - p : p;
  };
  const K = 100, r = 0, sig = 0.20, Tt = 30 / 365, STEPS = 30, mult = 100, PATHS = 2500;
  const bsCall = (S, K, T, r, sig) => {
    if (T <= 0 || sig <= 0) return Math.max(S - K, 0);
    const s = sig * Math.sqrt(T), d1 = (Math.log(S / K) + (r + sig * sig / 2) * T) / s;
    return S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d1 - s);
  };
  const callDelta = (S, K, T, r, sig) => {
    if (T <= 0 || sig <= 0) return S > K ? 1 : 0;
    const s = sig * Math.sqrt(T);
    return normCDF((Math.log(S / K) + (r + sig * sig / 2) * T) / s);
  };
  // 确定性 PRNG（同 seed → 可复现）
  const mulberry32 = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const gaussGen = (rng) => { let sp = null; return () => { if (sp !== null) { const v = sp; sp = null; return v; } let u = 0, v = 0; while (u === 0) u = rng(); while (v === 0) v = rng(); const m = Math.sqrt(-2 * Math.log(u)); sp = m * Math.sin(2 * Math.PI * v); return m * Math.cos(2 * Math.PI * v); }; };

  const BAND = 8; // 成本感知策略的不动带（股）

  // 跑全部路径，返回某策略的对冲盈亏分布统计。band=0 即 BS（每步必调）。
  function run(k, band) {
    const dt = Tt / STEPS, drift = (r - sig * sig / 2) * dt, vol = sig * Math.sqrt(dt);
    const rng = mulberry32(99991), g = gaussGen(rng);
    const prem = bsCall(K, K, Tt, r, sig) * mult;
    const errs = [];
    let tradeSum = 0;
    for (let p = 0; p < PATHS; p++) {
      let S = K, shares = 0, cash = 0, cost = 0, trades = 0;
      for (let i = 0; i < STEPS; i++) {
        const tau = Math.max(1e-6, Tt - i * dt);
        const target = callDelta(S, K, tau, r, sig) * mult;
        const gap = target - shares;
        if (Math.abs(gap) > band) { cash -= gap * S; cost += k * Math.abs(gap) * S; shares = target; trades++; }
        S = S * Math.exp(drift + vol * g());
      }
      cash += shares * S;
      const owed = Math.max(S - K, 0) * mult;
      errs.push(prem + cash - owed - cost);
      tradeSum += trades;
    }
    const mean = errs.reduce((a, b) => a + b, 0) / errs.length;
    const variance = errs.reduce((a, b) => a + (b - mean) * (b - mean), 0) / errs.length;
    return { mean, std: Math.sqrt(variance), avgTrades: tradeSum / PATHS, prem };
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🧠 ${T("深度对冲的思想：成本感知的“不动带” vs 机械 Delta 对冲", "The deep-hedging idea: a cost-aware no-trade band vs mechanical delta-hedging")}
        <span class="pill gold" style="margin-left:8px">${T("示意 / 教学", "illustrative")}</span>
      </div>

      <div class="demo-block">
        <label class="demo-label">${T("交易成本 k（每笔股票交易额的比例：价差+佣金+滑点）", "Transaction cost k (fraction of each stock trade: spread+commission+slippage)")} = <b id="dh-k-v">0.50%</b></label>
        <input class="demo-slider" id="dh-k" type="range" min="0" max="2" step="0.05" value="0.5"/>
      </div>

      <div class="cmp" style="margin-top:10px">
        <div class="cmp-cell">
          <h5>${T("(A) 经典 BS Delta 对冲（每步精确再平衡）", "(A) Classic BS delta-hedge (rebalance every step)")}</h5>
          <div class="stat-row" style="margin-top:6px">
            <div class="stat"><div class="k">${T("盈亏均值", "Mean P&L")}</div><div class="v" id="dh-bs-mean">–</div></div>
            <div class="stat"><div class="k">${T("盈亏标准差", "Std P&L")}</div><div class="v" id="dh-bs-std">–</div></div>
          </div>
          <div class="demo-meta" id="dh-bs-tr" style="margin-top:6px"></div>
        </div>
        <div class="cmp-cell">
          <h5>${T("(B) 成本感知（缺口 < ±8 股就不动手）", "(B) Cost-aware (don't trade while gap < ±8 sh)")}</h5>
          <div class="stat-row" style="margin-top:6px">
            <div class="stat"><div class="k">${T("盈亏均值", "Mean P&L")}</div><div class="v acc" id="dh-ca-mean">–</div></div>
            <div class="stat"><div class="k">${T("盈亏标准差", "Std P&L")}</div><div class="v" id="dh-ca-std">–</div></div>
          </div>
          <div class="demo-meta" id="dh-ca-tr" style="margin-top:6px"></div>
        </div>
      </div>

      <div class="stat-row" style="margin-top:12px">
        <div class="stat"><div class="k">${T("BS 风险调整分", "BS risk-adj score")}</div><div class="v" id="dh-sbs">–</div></div>
        <div class="stat"><div class="k">${T("成本感知 风险调整分", "Cost-aware score")}</div><div class="v" id="dh-sca">–</div></div>
        <div class="stat"><div class="k">${T("谁更优", "Winner")}</div><div class="v" id="dh-win">–</div></div>
      </div>
      <p class="demo-meta">${T("风险调整分 = 均值 − 0.5×标准差（越高越好，简单的均值-方差权衡）。", "Risk-adjusted score = mean − 0.5×std (higher is better; a simple mean-variance trade-off).")}</p>

      <p class="demo-tip" id="dh-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const money = (v) => (v < 0 ? "−$" : "$") + Math.abs(v).toFixed(0);

  function paint() {
    const k = +$("#dh-k").value / 100;
    $("#dh-k-v").textContent = (k * 100).toFixed(2) + "%";

    const bs = run(k, 0);       // BS：band=0，每步必调
    const ca = run(k, BAND);    // 成本感知：固定不动带

    $("#dh-bs-mean").textContent = money(bs.mean);
    $("#dh-bs-mean").className = "v " + (bs.mean >= 0 ? "pos" : "neg");
    $("#dh-bs-std").textContent = "$" + bs.std.toFixed(0);
    $("#dh-bs-tr").innerHTML = T(`平均 <b>${bs.avgTrades.toFixed(0)}</b> 次再平衡/路径`, `~<b>${bs.avgTrades.toFixed(0)}</b> rebalances/path`);

    $("#dh-ca-mean").textContent = money(ca.mean);
    $("#dh-ca-mean").className = "v " + (ca.mean >= 0 ? "pos" : "neg");
    $("#dh-ca-std").textContent = "$" + ca.std.toFixed(0);
    $("#dh-ca-tr").innerHTML = T(`平均 <b>${ca.avgTrades.toFixed(1)}</b> 次再平衡/路径（省下大量过路费）`, `~<b>${ca.avgTrades.toFixed(1)}</b> rebalances/path (saving fees)`);

    const sBS = bs.mean - 0.5 * bs.std, sCA = ca.mean - 0.5 * ca.std;
    $("#dh-sbs").textContent = money(sBS);
    $("#dh-sca").textContent = money(sCA);
    const caWins = sCA > sBS;
    $("#dh-win").textContent = caWins ? T("成本感知", "Cost-aware") : T("BS Delta", "BS delta");
    $("#dh-win").className = "v " + (caWins ? "acc" : "");

    let tip;
    if (k < 0.0001) {
      tip = T(
        `<b>零交易成本（童话世界）</b>：BS Delta 对冲把残差风险压得最小（标准差最低），<b>它更优</b>——正如 Black-Scholes 假设所预言。此时频繁对冲不要钱，机械 Delta 就是答案。<b>把成本滑块往右拖一点</b>，看童话如何破灭。`,
        `<b>Zero cost (the fairy tale)</b>: BS delta-hedging minimizes residual risk (lowest std), so <b>it wins</b> — exactly as Black-Scholes assumes. With free trading, mechanical delta is optimal. <b>Nudge the cost slider right</b> and watch the fairy tale break.`
      );
    } else {
      const drag = bs.mean - ca.mean; // BS 比 CA 多亏多少（成本拖累）
      tip = T(
        `<b>交易成本 k=${(k * 100).toFixed(2)}%</b>：机械 BS Delta 每条路径硬调 <b>${bs.avgTrades.toFixed(0)}</b> 次，过路费把均值拖到 ${money(bs.mean)}；成本感知只在缺口够大时动手（约 ${ca.avgTrades.toFixed(1)} 次），均值 <b>${money(ca.mean)}</b>，比 BS 少亏约 <b>${money(Math.abs(drag))}</b>。它<b>容忍一点残差风险换来大笔成本节省</b>，在风险调整分上<b>${caWins ? "胜出" : "尚未胜出"}</b>（${money(sCA)} vs ${money(sBS)}）。<br>这正是<b>深度对冲</b>的核心：真实的它用神经网络<b>自己学出</b>这条“不动带”（成本越高带越宽），而非我们手写——但结论一致：<b>有摩擦时，懂得“何时不动手”胜过永远在修正</b>（阶段 8.2、10.3）。`,
        `<b>Cost k=${(k * 100).toFixed(2)}%</b>: mechanical BS delta forces <b>${bs.avgTrades.toFixed(0)}</b> rebalances/path, dragging the mean to ${money(bs.mean)}; the cost-aware rule trades only when the gap is large enough (~${ca.avgTrades.toFixed(1)} times), mean <b>${money(ca.mean)}</b> — about <b>${money(Math.abs(drag))}</b> less loss than BS. It <b>accepts a little residual risk to save a lot of cost</b>, and on the risk-adjusted score it <b>${caWins ? "wins" : "doesn't yet win"}</b> (${money(sCA)} vs ${money(sBS)}).<br>This is the essence of <b>deep hedging</b>: the real method has a neural net <b>learn</b> this no-trade band itself (wider when costs are higher) instead of us hand-coding it — same conclusion: <b>with frictions, knowing when NOT to trade beats always correcting</b> (Stages 8.2, 10.3).`
      );
    }
    $("#dh-tip").innerHTML = tip;
  }

  $("#dh-k").addEventListener("input", paint);
  paint();
}
