// 交互演示：策略回测。.term Python 骨架 + 玩具权益曲线（lineChart）：
// 每月备兑看涨 vs 买入持有。含成本/不含成本切换显示“成本haircut”。.stat-row CAGR/最大回撤/胜率。
// 真算：确定性的月度标的收益序列，逐周期跑备兑看涨 P&L 循环（被削顶 + 收权利金 − 成本）。
import { lineChart } from "./_chart.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const MONTHS = 60;                 // 5 年
  const OTM = 0.03;                  // 卖 ~3% 虚值看涨
  const PREMIUM = 0.014;            // 每月权利金 ≈ 标的的 1.4%（与 ~30d/22%IV 的 103 看涨一致）
  const COST = 0.0025;              // 每周期成本haircut（价差+滑点+佣金，占标的）
  let withCost = true;

  // 确定性月度标的收益序列（含上涨、盘整、一次回撤），可复现
  function monthlyReturns() {
    const r = [];
    for (let m = 0; m < MONTHS; m++) {
      // 趋势 0.7%/月 + 正弦波动 + 第 30-33 月一段回撤
      let x = 0.007 + 0.03 * Math.sin(m * 0.7) + 0.015 * Math.sin(m * 1.9 + 1);
      if (m >= 30 && m <= 33) x -= 0.06;     // 模拟一次急跌
      r.push(x);
    }
    return r;
  }

  // 跑两条权益曲线：备兑看涨 vs 买入持有。返回 {cc, bh, ccWins, cycles}
  function run(applyCost) {
    const rets = monthlyReturns();
    const cc = [10000], bh = [10000];
    let ccWins = 0;
    for (let m = 0; m < MONTHS; m++) {
      const ret = rets[m];                       // 本月标的收益
      // 买入持有：直接跟随标的
      bh.push(bh[bh.length - 1] * (1 + ret));
      // 备兑看涨：股票收益被 +OTM 削顶（涨过行权价就只拿到 OTM），再加权利金，减成本
      const cappedRet = Math.min(ret, OTM);
      let ccRet = cappedRet + PREMIUM;
      if (applyCost) ccRet -= COST;
      cc.push(cc[cc.length - 1] * (1 + ccRet));
      if (ccRet > 0) ccWins++;
    }
    return { cc, bh, ccWins, cycles: MONTHS };
  }

  function metrics(curve) {
    const years = MONTHS / 12;
    const cagr = Math.pow(curve[curve.length - 1] / curve[0], 1 / years) - 1;
    let peak = curve[0], maxDD = 0;
    for (const v of curve) { if (v > peak) peak = v; const dd = (peak - v) / peak; if (dd > maxDD) maxDD = dd; }
    return { cagr, maxDD, final: curve[curve.length - 1] };
  }

  // —— .term Python 骨架 ——
  function codeBlock() {
    const L = [
      '<span class="com"># 每月备兑看涨回测骨架（逐周期 P&L 循环）—— 阶段 11.4</span>',
      '<span class="kw">import</span> numpy <span class="kw">as</span> np',
      '<span class="kw">from</span> pricing <span class="kw">import</span> bs_price   <span class="com"># 阶段 11.3 写的定价函数</span>',
      '',
      '<span class="kw">def</span> <span class="cmd">backtest_covered_call</span>(prices, iv=<span class="num">0.22</span>, r=<span class="num">0.04</span>,',
      '                          dte=<span class="num">30</span>, otm=<span class="num">0.03</span>, cost=<span class="num">0.0025</span>):',
      '    equity = [<span class="num">10_000.0</span>]',
      '    shares = equity[<span class="num">0</span>] / prices[<span class="num">0</span>]',
      '    wins = cycles = <span class="num">0</span>',
      '    <span class="kw">for</span> i <span class="kw">in</span> <span class="cmd">range</span>(<span class="cmd">len</span>(prices) - <span class="num">1</span>):',
      '        S0, S1 = prices[i], prices[i+<span class="num">1</span>]        <span class="com"># 本月起点 / 到期价</span>',
      '        K = <span class="cmd">round</span>(S0 * (<span class="num">1</span> + otm))           <span class="com"># 略虚值行权价</span>',
      '        prem = bs_price(S0, K, dte/<span class="num">365</span>, r, iv, <span class="num">"call"</span>)',
      '        prem -= cost * S0                       <span class="com"># 扣价差/滑点/佣金</span>',
      '        stock_pl = <span class="cmd">min</span>(S1, K) - S0             <span class="com"># 股票被削顶在 K</span>',
      '        pnl = (stock_pl + prem) * shares',
      '        equity.append(equity[-<span class="num">1</span>] + pnl)',
      '        wins += pnl &gt; <span class="num">0</span>; cycles += <span class="num">1</span>',
      '    <span class="kw">return</span> np.array(equity), wins / cycles    <span class="com"># 权益曲线, 胜率</span>',
    ];
    return `<div class="term">${L.join("\n")}</div>`;
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">📈 ${T("回测：每月备兑看涨 vs 买入持有（含成本 / 不含成本）", "Backtest: monthly covered call vs buy-and-hold (with / without costs)")}</div>

      ${codeBlock()}

      <div class="demo-row" style="margin:12px 0 4px">
        <label class="demo-switch"><input type="checkbox" id="sb-cost" checked/> ${T("含成本（价差+滑点+佣金）", "Include costs (spread+slippage+commission)")}</label>
        <span class="dk" id="sb-costnote"></span>
      </div>

      <div class="chart" id="sb-chart"></div>

      <div class="stat-row" style="margin-top:12px">
        <div class="stat"><div class="k">${T("备兑看涨 CAGR", "Covered-call CAGR")}</div><div class="v acc" id="sb-cc-cagr">–</div></div>
        <div class="stat"><div class="k">${T("买入持有 CAGR", "Buy-hold CAGR")}</div><div class="v" id="sb-bh-cagr">–</div></div>
        <div class="stat"><div class="k">${T("备兑最大回撤", "CC max drawdown")}</div><div class="v" id="sb-cc-dd">–</div></div>
        <div class="stat"><div class="k">${T("备兑胜率", "CC win-rate")}</div><div class="v" id="sb-cc-wr">–</div></div>
      </div>

      <p class="demo-tip">${T(
        "玩具回测（确定性数据，仅供演示）。备兑看涨靠权利金在<b>盘整与小跌</b>时跑赢、在<b>大涨</b>时被削顶而落后；那段急跌里权利金只是<b>薄薄一层缓冲</b>，回撤照样不小。关键体会：<b>勾掉“含成本”，曲线会明显抬高</b>——那条更漂亮的线正是不诚实回测的样子（阶段 9.6、11.4）。",
        "A toy backtest (deterministic data, illustration only). The covered call wins via premium in <b>flat/small-down</b> months and lags when <b>capped in a big rally</b>; in the sharp drop, premium is only a <b>thin cushion</b> and drawdown is still real. Key takeaway: <b>untick 'include costs' and the curve jumps up</b> — that prettier line is exactly what a dishonest backtest looks like (Stages 9.6, 11.4)."
      )}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  function paint() {
    const { cc, bh, ccWins, cycles } = run(withCost);
    const mCC = metrics(cc), mBH = metrics(bh);

    // 画两条曲线（按月索引）
    const res = lineChart({
      fns: [
        { f: (x) => cc[Math.round(x)], cls: "line", label: "CC" },
        { f: (x) => bh[Math.round(x)], cls: "line2", label: "B&H" },
      ],
      lo: 0, hi: MONTHS, samples: MONTHS,
      xlabel: T("月", "month"), forceZero: false,
    });
    $("#sb-chart").innerHTML = res.svg + `
      <div class="payoff-legend">
        <span><i style="width:14px;height:3px;border-radius:2px;background:var(--accent)"></i> ${T("备兑看涨", "Covered call")}</span>
        <span><i style="width:14px;height:3px;border-radius:2px;background:var(--gold)"></i> ${T("买入持有", "Buy & hold")}</span>
      </div>`;

    $("#sb-cc-cagr").textContent = (mCC.cagr * 100).toFixed(1) + "%";
    $("#sb-cc-cagr").className = "v " + (mCC.cagr > 0 ? "acc" : "neg");
    $("#sb-bh-cagr").textContent = (mBH.cagr * 100).toFixed(1) + "%";
    $("#sb-cc-dd").textContent = (mCC.maxDD * 100).toFixed(0) + "%";
    $("#sb-cc-dd").className = "v " + (mCC.maxDD > 0.2 ? "neg" : "");
    $("#sb-cc-wr").textContent = Math.round(ccWins / cycles * 100) + "%";

    $("#sb-costnote").innerHTML = withCost
      ? T(`已扣每周期 ${(COST * 100).toFixed(2)}% 成本`, `−${(COST * 100).toFixed(2)}%/cycle deducted`)
      : T("⚠ 未扣任何成本（纸面）", "⚠ no costs (paper)");
  }

  $("#sb-cost").addEventListener("change", (e) => { withCost = e.target.checked; paint(); });
  paint();
}
