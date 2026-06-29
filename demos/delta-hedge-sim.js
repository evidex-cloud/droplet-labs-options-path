// 交互演示：Delta 对冲 + Gamma 剥头皮 / 失血。
// 模拟一个【卖出 ATM 看涨】并用股票动态对冲的做市商，沿一条价格路径走 ~20 步。
// 每步用 greeks() 重算 Delta、再平衡持股、累计对冲现金流；展示对冲 P&L vs 收到的权利金 vs 净额。
// 三条预设路径：上行趋势 / 来回震荡 / 崩盘。说明：空 Gamma 在大行情亏（追涨杀跌），
// 而其翻面（多 Gamma）在震荡里赚（高抛低吸）。真算：_bs.js。
import { greeks } from "./_bs.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const K = 100, r = 0.04, sigma = 0.2, T0 = 30 / 365, STEPS = 20;

  // 三条确定性路径（每步收盘价），均始于 100。共 STEPS+1 个点。
  // chop = 温和震荡（实际波动 ~7% < 隐含 20%）→ 卖方(空Gamma)靠 Theta 净赚；
  // trend/crash = 大行情 → 空 Gamma 追涨杀跌净亏，多 Gamma 买方爆赚。
  const paths = {
    chop: [100,100.5,99.8,100.4,99.9,100.3,100.1,100.5,99.9,100.4,100.0,100.5,99.8,100.3,100.1,100.4,99.9,100.3,100.1,100.2,100.0],
    trend: [100,100.6,101.3,101.9,102.6,103.2,103.9,104.5,105.2,105.8,106.5,107.1,107.8,108.4,109.1,109.7,110.4,111.0,111.7,112.3,113.0],
    crash: [100,99,98,99,97,95,96,92,88,90,85,80,82,76,72,74,70,68,71,67,66],
  };

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">⚖️ ${T("Delta 对冲沙盘：卖出 ATM 看涨，动态对冲", "Delta-hedge sandbox: short an ATM call, hedge dynamically")}</div>

      <div class="demo-row">
        <div class="demo-seg" id="dh-path">
          <button data-p="chop" class="on">${T("来回震荡", "Chop")}</button>
          <button data-p="trend">${T("上行趋势", "Up-trend")}</button>
          <button data-p="crash">${T("崩盘", "Crash")}</button>
        </div>
      </div>

      <div id="dh-chart"></div>

      <div class="stat-row" style="margin-top:14px">
        <div class="stat"><div class="k">${T("收到权利金", "Premium collected")}</div><div class="v acc" id="dh-prem">–</div></div>
        <div class="stat"><div class="k">${T("对冲 P&L", "Hedge P&L")}</div><div class="v" id="dh-hedge">–</div></div>
        <div class="stat"><div class="k">${T("期权到期负债", "Option payout owed")}</div><div class="v" id="dh-owed">–</div></div>
        <div class="stat"><div class="k">${T("净 P&L（做市商）", "Net P&L (dealer)")}</div><div class="v" id="dh-net">–</div></div>
      </div>

      <div class="cmp" style="margin-top:14px">
        <div class="cmp-cell">
          <h5>${T("做市商 = 空 Gamma（卖方）", "Dealer = short Gamma (seller)")}</h5>
          <div id="dh-short-sum" style="font-size:14px;line-height:1.7"></div>
        </div>
        <div class="cmp-cell">
          <h5>${T("对手盘 = 多 Gamma（买方）", "Counterparty = long Gamma (buyer)")}</h5>
          <div id="dh-long-sum" style="font-size:14px;line-height:1.7"></div>
        </div>
      </div>

      <p class="demo-tip" id="dh-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const money = (v) => (v < 0 ? "−$" : "$") + Math.abs(v).toFixed(0);

  let pathKey = "chop";

  // 模拟：卖出 1 张 ATM 看涨（每股口径 ×100），每步重算 Delta 并把持股调到 +Delta_call*100（对冲空头）。
  // 累计对冲现金流（买股付钱、卖股收钱），到期用最终持股清算 + 期权赔付。
  function simulate(path) {
    const mult = 100;
    const dtStep = T0 / STEPS;
    const prem = greeks({ S: path[0], K, T: T0, r, sigma, type: "call" }).price * mult; // 卖方收到

    let shares = 0;       // 当前持股
    let hedgeCash = 0;    // 对冲账户现金（买股为负、卖股为正）
    const deltaSeries = [];

    for (let i = 0; i < path.length; i++) {
      const S = path[i];
      const tau = Math.max(1e-6, T0 - i * dtStep);
      const dCall = greeks({ S, K, T: tau, r, sigma, type: "call" }).delta;
      deltaSeries.push(dCall);
      // 做市商空头看涨净 Delta = −dCall*mult；为中性需持股 = +dCall*mult
      const targetShares = dCall * mult;
      const tradeShares = targetShares - shares;     // >0 买入、<0 卖出
      hedgeCash -= tradeShares * S;                  // 买股付现金
      shares = targetShares;
    }

    const Sfin = path[path.length - 1];
    // 到期清算持股
    hedgeCash += shares * Sfin;
    // 期权到期赔付（卖方负债）：max(Sfin−K,0)*mult
    const owed = Math.max(Sfin - K, 0) * mult;

    const hedgePL = hedgeCash;            // 对冲账户净现金流（含建仓→清算）
    const netShort = prem + hedgePL - owed;
    return { prem, hedgePL, owed, netShort, deltaSeries };
  }

  // 简易折线图：价格路径 + 行权价线。手拼 SVG（类名同 .chart）。
  function pathChart(path) {
    const W = 560, H = 200, mL = 44, mR = 14, mT = 14, mB = 26;
    const plotL = mL, plotR = W - mR, plotT = mT, plotB = H - mB;
    const lo = Math.min(...path, K) - 2, hi = Math.max(...path, K) + 2;
    const xMap = (i) => plotL + (i / (path.length - 1)) * (plotR - plotL);
    const yMap = (v) => plotB - (v - lo) / (hi - lo) * (plotB - plotT);
    const pts = path.map((v, i) => `${xMap(i).toFixed(1)},${yMap(v).toFixed(1)}`).join(" ");
    const kY = yMap(K);
    let grid = "";
    for (let i = 0; i <= 4; i++) {
      const yy = plotT + (i / 4) * (plotB - plotT);
      grid += `<line class="grid" x1="${plotL}" y1="${yy.toFixed(1)}" x2="${plotR}" y2="${yy.toFixed(1)}"/>`;
    }
    const yl = [hi, (hi + lo) / 2, lo].map((v) =>
      `<text class="lbl-axis" x="${plotL - 6}" y="${(yMap(v) + 3).toFixed(1)}" text-anchor="end">${v.toFixed(0)}</text>`).join("");
    return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">
      ${grid}
      <line class="axis" x1="${plotL}" y1="${plotT}" x2="${plotL}" y2="${plotB}"/>
      <line class="axis" x1="${plotL}" y1="${plotB}" x2="${plotR}" y2="${plotB}"/>
      <line class="marker" x1="${plotL}" y1="${kY.toFixed(1)}" x2="${plotR}" y2="${kY.toFixed(1)}"/>
      <text class="lbl-axis" x="${plotR}" y="${(kY - 4).toFixed(1)}" text-anchor="end" style="fill:var(--gold)">K=${K}</text>
      <polyline class="line" points="${pts}"/>
      ${yl}
    </svg><div class="payoff-legend"><span><i style="width:14px;height:3px;border-radius:2px;background:var(--accent)"></i> ${T("标的价格路径", "Underlying price path")}</span><span><i style="width:14px;height:3px;border-radius:2px;background:var(--gold)"></i> ${T("行权价", "Strike")}</span></div></div>`;
  }

  function paint() {
    const path = paths[pathKey];
    const r2 = simulate(path);
    $("#dh-chart").innerHTML = pathChart(path);

    $("#dh-prem").textContent = money(r2.prem);
    $("#dh-hedge").textContent = money(r2.hedgePL);
    $("#dh-hedge").className = "v " + (r2.hedgePL >= 0 ? "pos" : "neg");
    $("#dh-owed").textContent = money(-r2.owed);
    $("#dh-owed").className = "v neg";
    $("#dh-net").textContent = money(r2.netShort);
    $("#dh-net").className = "v " + (r2.netShort >= 0 ? "pos" : "neg");

    // 买方（多 Gamma）是卖方的镜像：净 P&L = −netShort（零和，忽略交易成本）
    const netLong = -r2.netShort;

    $("#dh-short-sum").innerHTML = T(
      `收 <b>${money(r2.prem)}</b> 权利金（Theta 租金），对冲 ${r2.hedgePL >= 0 ? "赚" : "亏"} <b>${money(r2.hedgePL)}</b>。<br>净额 <b style="color:${r2.netShort >= 0 ? "var(--green)" : "var(--red)"}">${money(r2.netShort)}</b>。`,
      `Collects <b>${money(r2.prem)}</b> premium (Theta rent); hedging ${r2.hedgePL >= 0 ? "gains" : "loses"} <b>${money(r2.hedgePL)}</b>.<br>Net <b style="color:${r2.netShort >= 0 ? "var(--green)" : "var(--red)"}">${money(r2.netShort)}</b>.`
    );
    $("#dh-long-sum").innerHTML = T(
      `付 <b>${money(r2.prem)}</b> 权利金（Theta 成本），在波动里高抛低吸剥头皮。<br>净额 <b style="color:${netLong >= 0 ? "var(--green)" : "var(--red)"}">${money(netLong)}</b>（与卖方零和镜像）。`,
      `Pays <b>${money(r2.prem)}</b> premium (Theta cost), gamma-scalps the swings (buy low, sell high).<br>Net <b style="color:${netLong >= 0 ? "var(--green)" : "var(--red)"}">${money(netLong)}</b> (zero-sum mirror of the dealer).`
    );

    let msg;
    if (pathKey === "chop") {
      msg = T(
        `<b>温和震荡</b>（实际波动远低于隐含的 20%）：标的只在行权价附近小幅来回，<b>空 Gamma 的做市商</b>只被轻微“高买低卖”（对冲 ${money(r2.hedgePL)}），收的权利金（Theta 租金）<b>稳稳覆盖</b>，净赚 <b>${money(r2.netShort)}</b>。镜像的<b>多 Gamma 买方</b>剥头皮收益盖不过付出的权利金，净亏 <b>${money(netLong)}</b>。<b>实际波动 &lt; 隐含波动 → 卖方赢</b>（阶段 8.2、8.3）。`,
        `<b>Gentle chop</b> (realized vol well below the implied 20%): spot only drifts near the strike, so the <b>short-Gamma dealer</b> is barely whipsawed (hedge ${money(r2.hedgePL)}) and the premium (Theta rent) <b>comfortably covers it</b>, net <b>${money(r2.netShort)}</b>. The mirror <b>long-Gamma buyer</b> can't scalp enough to pay for the premium, net <b>${money(netLong)}</b>. <b>Realized &lt; implied → the seller wins</b> (Stages 8.2, 8.3).`
      );
    } else if (pathKey === "trend") {
      msg = T(
        `<b>上行趋势</b>：标的稳步上涨，做市商被迫<b>一路追买</b>（高位买股对冲）。注意这条<b>平缓</b>的趋势里，对冲收益（${money(r2.hedgePL)}）几乎抵消了期权到期负债（${money(-r2.owed)}），净仅 <b>${money(r2.netShort)}</b>——勉强打平。空 Gamma 真正的噩梦不是平缓单边，而是<b>剧烈跳动</b>，把崩盘那条路径切过来看。`,
        `<b>Up-trend</b>: spot rises steadily, forcing the dealer to <b>chase by buying higher</b>. In this <b>mild</b> trend the hedge gain (${money(r2.hedgePL)}) nearly offsets the option payout owed (${money(-r2.owed)}), net just <b>${money(r2.netShort)}</b> — roughly flat. Short Gamma's real nightmare isn't a gentle drift but a <b>violent move</b> — switch to the Crash path.`
      );
    } else {
      msg = T(
        `<b>崩盘</b>：标的暴跌，看涨变废、做市商<b>一路割卖</b>对冲，<b>空 Gamma 在大行情里大亏</b>：对冲 ${money(r2.hedgePL)}，净 <b>${money(r2.netShort)}</b>。注意——这正是“收着 Theta 小钱、被一次大行情碾过”的负 Gamma 真身（阶段 5.3、8.3）。镜像的多 Gamma 买方则在崩盘里爆赚 <b>${money(netLong)}</b>。`,
        `<b>Crash</b>: spot plunges, the call dies, and the dealer <b>sells lower and lower</b> to hedge — <b>short Gamma bleeds badly in big moves</b>: hedge ${money(r2.hedgePL)}, net <b>${money(r2.netShort)}</b>. This is negative Gamma in the flesh: collecting small Theta, then crushed by one big move (Stages 5.3, 8.3). The mirror long-Gamma buyer reaps <b>${money(netLong)}</b>.`
      );
    }
    $("#dh-tip").innerHTML = msg;
  }

  $("#dh-path").addEventListener("click", (e) => {
    const btn = e.target.closest("button"); if (!btn) return;
    pathKey = btn.dataset.p;
    [...$("#dh-path").children].forEach((c) => c.classList.toggle("on", c === btn));
    paint();
  });
  paint();
}
