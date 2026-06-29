// 交互演示：回测陷阱。一个“好得离谱”的初始回测(CAGR≈40%)，勾选各项陷阱修正逐刀砍回现实。
// 复选框：[含买卖价差 / 含滑点 / 剔除幸存者偏差 / 加入交易成本]。画 inflated vs honest 权益曲线。.stat-row。
// 真算：每个修正按固定“年化拖累”削减毛收益，复利出新的权益曲线与 CAGR/回撤。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const YEARS = 10;
  const grossCAGR = 0.40;          // 未修正的“纸面”年化
  // 每项陷阱修正的“年化收益拖累”(乘法因子)：(1+gross) 上扣减
  const haircuts = {
    spread:  { drag: 0.14, label: T("含买卖价差", "Bid-ask spread"),
      note: T("期权价差常宽到价格的 10–20%，你买在 ask、卖在 bid。假设成交在中间价＝每笔白送半个价差，频繁交易吃掉最大一块。",
               "Option spreads run 10–20% of price; you buy at ask, sell at bid. Mid-price fills hand you back half a spread each trade — the single biggest leak for active strategies.") },
    slippage:{ drag: 0.07, label: T("含滑点", "Slippage"),
      note: T("市价单实际成交价比意图价更差(冲击+延迟)。冷门期权一单就打穿盘口。",
               "Market orders fill worse than intended (impact + latency); a thin option gets run over by a single order.") },
    surv:    { drag: 0.10, label: T("剔除幸存者偏差", "Remove survivorship bias"),
      note: T("只测活到今天的标的，排除了爆雷/退市/归零的输家，收益被系统性高估。纳入已消失标的后回吐一截。",
               "Testing only names that survived excludes blow-ups and delistings, inflating returns. Adding the dead names gives a chunk back.") },
    cost:    { drag: 0.06, label: T("加入交易成本", "Transaction costs"),
      note: T("佣金、交易所费、保证金的资金成本，逐笔累加也不容忽视。",
               "Commissions, exchange fees, and the cost of carrying margin add up trade by trade.") },
  };

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">📉 ${T("回测陷阱：把“好得离谱”一刀刀砍回现实", "Backtest pitfalls: haircutting a too-good result back to reality")}</div>

      <div class="demo-row" style="margin-bottom:4px">
        <label class="demo-check"><input type="checkbox" id="bp-spread"/> ${haircuts.spread.label}</label>
        <label class="demo-check"><input type="checkbox" id="bp-slippage"/> ${haircuts.slippage.label}</label>
        <label class="demo-check"><input type="checkbox" id="bp-surv"/> ${haircuts.surv.label}</label>
        <label class="demo-check"><input type="checkbox" id="bp-cost"/> ${haircuts.cost.label}</label>
      </div>
      <div class="demo-btns" style="margin:8px 0">
        <button class="demo-btn" id="bp-none">${T("全不勾(纸面)", "None (paper)")}</button>
        <button class="demo-btn primary" id="bp-all">${T("全勾(诚实)", "All (honest)")}</button>
      </div>

      <div class="chart" id="bp-chart"></div>

      <div class="stat-row" style="margin-top:12px">
        <div class="stat"><div class="k">${T("纸面 CAGR", "Paper CAGR")}</div><div class="v" id="bp-gross">–</div></div>
        <div class="stat"><div class="k">${T("修正后 CAGR", "Adjusted CAGR")}</div><div class="v acc" id="bp-net">–</div></div>
        <div class="stat"><div class="k">${T("10 年终值(起 $10k)", "10-yr final ($10k start)")}</div><div class="v" id="bp-final">–</div></div>
        <div class="stat"><div class="k">${T("最大回撤", "Max drawdown")}</div><div class="v" id="bp-dd">–</div></div>
      </div>

      <p class="demo-meta" id="bp-note"></p>

      <p class="demo-tip">${T(
        "灰线是<b>纸面</b>回测(40% 年化、几乎不回撤)——这是各种陷阱叠出的海市蜃楼。每勾选一项修正，就关掉一层“美颜”，青线<b>应声塌回</b>。四项全勾后，惊艳的曲线往往变成温和正收益、甚至亏损。正确心态：<b>默认回测在骗你</b>，逐项证伪后还站得住，才考虑实盘(阶段 11.4)。注意：制度变迁(牛/熊/危机)是更深的坑，这里未单独建模。",
        "The grey line is the <b>paper</b> backtest (40% CAGR, almost no drawdown) — a mirage built from stacked pitfalls. Each box you tick turns off one layer of 'beauty filter' and the teal line <b>collapses</b>. With all four on, the stunning curve usually becomes a modest gain or a loss. Right mindset: <b>assume the backtest is lying</b>; only after falsifying it item by item should you consider going live (Stage 11.4). Note: regime change (bull/bear/crisis) is a deeper trap, not modeled separately here."
      )}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const boxes = { spread: $("#bp-spread"), slippage: $("#bp-slippage"), surv: $("#bp-surv"), cost: $("#bp-cost") };

  // 修正后的年化：从 (1+grossCAGR) 上按乘法扣减每项 drag
  function adjustedCAGR() {
    let factor = 1 + grossCAGR;
    for (const k in boxes) if (boxes[k].checked) factor *= (1 - haircuts[k].drag);
    return factor - 1;
  }

  // 生成权益曲线：确定性“锯齿”收益(围绕年化的月度波动)，复利。返回 {pts, finalVal, maxDD}
  function equityCurve(annual) {
    const months = YEARS * 12;
    const monthly = Math.pow(1 + annual, 1 / 12) - 1;
    // 确定性月度扰动(正弦组合)，纸面版波动小、修正版同样的形状，便于对比
    const pts = []; let val = 10000, peak = 10000, maxDD = 0;
    for (let mth = 0; mth <= months; mth++) {
      if (mth > 0) {
        const wiggle = 0.025 * (Math.sin(mth * 0.9) + 0.5 * Math.sin(mth * 2.3 + 1));
        val *= (1 + monthly + wiggle - 0.0); // 围绕趋势的确定性波动
      }
      if (val > peak) peak = val;
      const dd = (peak - val) / peak; if (dd > maxDD) maxDD = dd;
      pts.push(val);
    }
    return { pts, finalVal: pts[pts.length - 1], maxDD };
  }

  function drawChart(gross, net) {
    const months = YEARS * 12;
    const W = 560, H = 280, mL = 52, mR = 14, mT = 16, mB = 28;
    const plotL = mL, plotR = W - mR, plotT = mT, plotB = H - mB;
    const all = gross.pts.concat(net.pts);
    let ymin = Math.min(...all), ymax = Math.max(...all);
    ymin = Math.min(ymin, 10000) * 0.95; ymax = ymax * 1.03;
    const xMap = (mth) => plotL + (mth / months) * (plotR - plotL);
    const yMap = (v) => plotB - (v - ymin) / (ymax - ymin) * (plotB - plotT);

    let grid = "";
    for (let i = 0; i <= YEARS; i += 2) {
      const px = xMap(i * 12);
      grid += `<line class="grid" x1="${px.toFixed(1)}" y1="${plotT}" x2="${px.toFixed(1)}" y2="${plotB}"/>`;
      grid += `<text class="lbl-axis" x="${px.toFixed(1)}" y="${(plotB + 16).toFixed(1)}" text-anchor="middle">${i}y</text>`;
    }
    // 起始本金线
    const baseY = yMap(10000);
    const baseLine = `<line class="zero" x1="${plotL}" y1="${baseY.toFixed(1)}" x2="${plotR}" y2="${baseY.toFixed(1)}"/>`;
    const line = (pts, cls) => `<polyline class="${cls}" points="${pts.map((v, i) => `${xMap(i).toFixed(1)},${yMap(v).toFixed(1)}`).join(" ")}"/>`;
    let ylab = "";
    for (const yv of [ymax, (ymin + ymax) / 2, ymin]) {
      const k = yv >= 1000 ? "$" + (yv / 1000).toFixed(0) + "k" : "$" + yv.toFixed(0);
      ylab += `<text class="lbl-axis" x="${(plotL - 6).toFixed(1)}" y="${(yMap(yv) + 3).toFixed(1)}" text-anchor="end">${k}</text>`;
    }
    $("#bp-chart").innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">
      ${grid}${baseLine}
      <line class="axis" x1="${plotL}" y1="${plotT}" x2="${plotL}" y2="${plotB}"/>
      <line class="axis" x1="${plotL}" y1="${plotB}" x2="${plotR}" y2="${plotB}"/>
      ${line(gross.pts, "line3")}${line(net.pts, "line")}${ylab}
    </svg>
    <div class="payoff-legend">
      <span><i style="width:14px;height:3px;border-radius:2px;background:var(--red)"></i> ${T("纸面回测(未修正)", "Paper (uncorrected)")}</span>
      <span><i style="width:14px;height:3px;border-radius:2px;background:var(--accent)"></i> ${T("修正后(诚实)", "Adjusted (honest)")}</span>
    </div>`;
  }

  function paint() {
    const net = adjustedCAGR();
    const grossCurve = equityCurve(grossCAGR);
    const netCurve = equityCurve(net);
    drawChart(grossCurve, netCurve);

    $("#bp-gross").textContent = (grossCAGR * 100).toFixed(0) + "%";
    $("#bp-net").textContent = (net * 100).toFixed(1) + "%";
    $("#bp-net").className = "v " + (net > 0.08 ? "pos" : net > 0 ? "acc" : "neg");
    $("#bp-final").textContent = "$" + Math.round(netCurve.finalVal).toLocaleString("en-US");
    $("#bp-dd").textContent = (netCurve.maxDD * 100).toFixed(0) + "%";
    $("#bp-dd").className = "v " + (netCurve.maxDD > 0.2 ? "neg" : "");

    // 说明：列出已勾选的修正
    const on = Object.keys(boxes).filter((k) => boxes[k].checked);
    if (on.length === 0) {
      $("#bp-note").innerHTML = T(
        `<b>纸面回测</b>：年化 40%、几乎不回撤、$10k → $${Math.round(grossCurve.finalVal).toLocaleString("en-US")}。美得不真实——因为还没扣任何现实成本。逐项勾选上面的修正，看它如何塌方。`,
        `<b>Paper backtest</b>: 40% CAGR, almost no drawdown, $10k → $${Math.round(grossCurve.finalVal).toLocaleString("en-US")}. Too pretty to be true — no real costs deducted yet. Tick the corrections above and watch it cave in.`
      );
    } else {
      const items = on.map((k) => `<b>${haircuts[k].label}</b>(−${(haircuts[k].drag * 100).toFixed(0)}%)：${haircuts[k].note}`).join("<br>");
      const verdict = net <= 0
        ? T("——四项现实成本叠加后，这个“圣杯”已变成<b>亏损</b>。", "— stacked with real costs, the 'holy grail' is now a <b>loss</b>.")
        : net < 0.12
          ? T("——扣掉现实成本后，惊艳的 40% 缩水成<b>平庸甚至难敌指数</b>的真实收益。", "— after real costs the dazzling 40% shrinks to a <b>mediocre</b>, maybe sub-index, real return.")
          : "";
      $("#bp-note").innerHTML = items + verdict;
    }
  }

  Object.values(boxes).forEach((b) => b.addEventListener("change", paint));
  $("#bp-none").addEventListener("click", () => { Object.values(boxes).forEach((b) => (b.checked = false)); paint(); });
  $("#bp-all").addEventListener("click", () => { Object.values(boxes).forEach((b) => (b.checked = true)); paint(); });
  paint();
}
