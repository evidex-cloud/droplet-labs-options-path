// demos/synthetics.js —— 合成头寸 损益演示（证明 合成 = 真实标的）
// 分段切换 合成多头(买看涨+卖看跌) / 合成空头(卖看涨+买看跌)，同行权价 K=100。
// 自定义 SVG 叠两条线：合成组合 P&L（青）与等价正股 P&L（金虚线）——完全重合，证平价。
// stat-row 给 关键数；点出由看跌看涨平价保证。全部真算（netPL 引擎）。
import { netPL } from "./_payoff.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;
  const K = 100, prem = 5; // 平值、看涨=看跌权利金（无套利成本 → 完全重合）
  const LO = 75, HI = 125, SPOT = 100;

  let mode = "long"; // 'long' | 'short'

  function synLegs() {
    if (mode === "long") {
      // 合成多头：买看涨 + 卖看跌
      return [
        { type: "call", side: "long", strike: K, premium: prem, qty: 1 },
        { type: "put", side: "short", strike: K, premium: prem, qty: 1 },
      ];
    }
    // 合成空头：卖看涨 + 买看跌
    return [
      { type: "call", side: "short", strike: K, premium: prem, qty: 1 },
      { type: "put", side: "long", strike: K, premium: prem, qty: 1 },
    ];
  }
  function stockLeg() {
    // 等价正股：多头买入价 = K（因为权利金相等、无净成本）；空头同理
    return mode === "long"
      ? [{ type: "stock", side: "long", entry: K, qty: 1 }]
      : [{ type: "stock", side: "short", entry: K, qty: 1 }];
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🧬 ${T("合成头寸 · 用平价拼出标的", "Synthetic positions · building stock from parity")}</div>

      <div class="demo-row" style="margin-bottom:10px">
        <div class="demo-seg" id="sy-seg">
          <button data-m="long" class="on">${T("合成多头", "Synthetic long")}</button>
          <button data-m="short">${T("合成空头", "Synthetic short")}</button>
        </div>
        <span class="pill acc" id="sy-eq">${T("合成 = 真实", "synthetic = real")}</span>
      </div>

      <div class="legs" id="sy-legs"></div>

      <div class="chart" id="sy-chart"></div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("等价头寸", "Equivalent")}</div><div class="v acc" id="sy-equiv">–</div></div>
        <div class="stat"><div class="k">${T("最大盈利", "Max profit")}</div><div class="v pos" id="sy-mp">–</div></div>
        <div class="stat"><div class="k">${T("最大亏损", "Max loss")}</div><div class="v neg" id="sy-ml">–</div></div>
        <div class="stat"><div class="k">${T("两线最大偏差", "Max gap")}</div><div class="v" id="sy-gap">–</div></div>
      </div>

      <p class="demo-tip" id="sy-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  function legRow(leg) {
    const buy = leg.side === "long";
    const sideTxt = buy ? T("买入", "BUY") : T("卖出", "SELL");
    const sideCls = buy ? "side-buy" : "side-sell";
    const pill = leg.type === "call" ? "call" : "put";
    const pillTxt = leg.type === "call" ? "CALL" : "PUT";
    return `<div class="leg">
      <span class="${sideCls}">${sideTxt}</span>
      <span class="leg-pill ${pill}">${pillTxt}</span>
      <span class="leg-tag">K=${leg.strike}　${T("权利金", "prem")} ${leg.premium.toFixed(1)}</span>
    </div>`;
  }

  // 叠两条线：合成（青实线）与正股（金虚线）
  function drawOverlay(syn, stk) {
    const W = 580, H = 300;
    const mL = 48, mR = 16, mT = 18, mB = 34;
    const plotL = mL, plotR = W - mR, plotT = mT, plotB = H - mB;
    const N = 160;

    const xs = [], y1 = [], y2 = [];
    for (let i = 0; i <= N; i++) {
      const S = LO + (HI - LO) * (i / N);
      xs.push(S); y1.push(netPL(syn, S)); y2.push(netPL(stk, S));
    }
    let ymin = Math.min(...y1, ...y2), ymax = Math.max(...y1, ...y2);
    const pad = (ymax - ymin) * 0.16; ymin -= pad; ymax += pad;
    if (ymin > 0) ymin = -pad; if (ymax < 0) ymax = pad;

    const xMap = (x) => plotL + (x - LO) / (HI - LO) * (plotR - plotL);
    const yMap = (y) => plotB - (y - ymin) / (ymax - ymin) * (plotB - plotT);
    const zeroY = yMap(0);

    const pts1 = xs.map((x, i) => `${xMap(x).toFixed(1)},${yMap(y1[i]).toFixed(1)}`).join(" ");
    const pts2 = xs.map((x, i) => `${xMap(x).toFixed(1)},${yMap(y2[i]).toFixed(1)}`).join(" ");

    let grid = "", xlab = "";
    for (let i = 0; i <= 6; i++) {
      const x = LO + (HI - LO) * (i / 6), px = xMap(x);
      grid += `<line class="grid" x1="${px.toFixed(1)}" y1="${plotT}" x2="${px.toFixed(1)}" y2="${plotB}"/>`;
      xlab += `<text class="lbl-axis" x="${px.toFixed(1)}" y="${plotB + 16}" text-anchor="middle">${x.toFixed(0)}</text>`;
    }
    const kx = xMap(K);
    const strikeMark = `<line x1="${kx.toFixed(1)}" y1="${plotT}" x2="${kx.toFixed(1)}" y2="${plotB}" style="stroke:var(--gold);stroke-width:1.5;stroke-dasharray:2 3"/>`
      + `<text class="lbl-axis" x="${kx.toFixed(1)}" y="${plotT + 10}" text-anchor="middle" style="fill:var(--gold)">K=100</text>`;
    let ylab = "";
    for (const yv of [ymax - pad * 0.3, 0, ymin + pad * 0.3]) {
      ylab += `<text class="lbl-axis" x="${plotL - 6}" y="${(yMap(yv) + 3).toFixed(1)}" text-anchor="end">${(yv * MULT).toFixed(0)}</text>`;
    }

    // 正股线用金色(line2)较粗在底层，合成线用青色(line)在上层 → 重合时青线压在金线上，
    // 但金线更宽，两侧会露出金边，直观显示“两条线在一起”。
    const svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img">
      ${grid}
      <line class="axis" x1="${plotL}" y1="${plotT}" x2="${plotL}" y2="${plotB}"/>
      <line class="zero" x1="${plotL}" y1="${zeroY.toFixed(1)}" x2="${plotR}" y2="${zeroY.toFixed(1)}"/>
      ${strikeMark}
      <polyline points="${pts2}" style="fill:none;stroke:var(--gold);stroke-width:6;stroke-linejoin:round;opacity:.55"/>
      <polyline points="${pts1}" style="fill:none;stroke:var(--accent);stroke-width:2.5;stroke-linejoin:round"/>
      ${ylab}${xlab}
    </svg>`;

    // 最大偏差
    let gap = 0; for (let i = 0; i <= N; i++) gap = Math.max(gap, Math.abs(y1[i] - y2[i]));
    return { svg, gap };
  }

  function paint() {
    const syn = synLegs(), stk = stockLeg();
    $("#sy-legs").innerHTML = syn.map(legRow).join("");

    const drawn = drawOverlay(syn, stk);
    $("#sy-chart").innerHTML = drawn.svg
      + `<div class="payoff-legend">`
      + `<span><i style="width:14px;height:3px;border-radius:2px;background:var(--accent)"></i>${T("合成组合 (看涨±看跌)", "synthetic (call ± put)")}</span>`
      + `<span><i style="width:14px;height:6px;border-radius:2px;background:var(--gold);opacity:.6"></i>${T("等价正股", "equivalent stock")}</span>`
      + `<span><i style="background:var(--gold)"></i>${T("行权价", "strike")}</span>`
      + `</div>`;

    // 关键数（合成多头：上涨无限赚、下跌一路亏；合成空头反之）
    const equiv = mode === "long" ? T("做多 100 股", "long 100 sh") : T("做空 100 股", "short 100 sh");
    $("#sy-equiv").textContent = equiv;
    if (mode === "long") {
      $("#sy-mp").textContent = T("理论无限", "∞");
      $("#sy-ml").textContent = "−$" + (K * MULT).toFixed(0); // 跌到 0
    } else {
      $("#sy-mp").textContent = "+$" + (K * MULT).toFixed(0); // 标的到 0
      $("#sy-ml").textContent = T("理论无限", "∞");
    }
    $("#sy-gap").textContent = "$" + (drawn.gap * MULT).toFixed(0);

    $("#sy-tip").innerHTML = mode === "long"
      ? T(
          `<b>合成多头 = 买看涨 + 卖看跌（同 K=100）</b>。青线（合成）与金线（正股）<b>完全重合，偏差 $${(drawn.gap * MULT).toFixed(0)}</b>——这由<b>看跌看涨平价</b>保证（S = 看涨 − 看跌）。风险也和正股一样：上涨无限赚、下跌一路亏（卖出的看跌让你在下方被指派接货），要占保证金。`,
          `<b>Synthetic long = long call + short put (same K=100)</b>. The teal line (synthetic) and gold line (stock) <b>coincide exactly, gap $${(drawn.gap * MULT).toFixed(0)}</b> — guaranteed by <b>put-call parity</b> (S = call − put). Risk matches the stock too: unlimited up, all the way down (the short put gets you assigned below), and it ties up margin.`
        )
      : T(
          `<b>合成空头 = 卖看涨 + 买看跌（同 K=100）</b>。两条线再次<b>完全重合，偏差 $${(drawn.gap * MULT).toFixed(0)}</b>，复制了做空标的：下跌赚、上涨一路亏（卖出的看涨在上方无限亏）。当难以借券做空时，合成空头是常用替代——同样由平价关系保证等价。`,
          `<b>Synthetic short = short call + long put (same K=100)</b>. The two lines again <b>coincide exactly, gap $${(drawn.gap * MULT).toFixed(0)}</b>, replicating a short: gain on the way down, lose all the way up (the short call is unlimited above). When shorting stock is hard, a synthetic short is the go-to substitute — equivalence guaranteed by parity.`
        );
  }

  $("#sy-seg").querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => {
      mode = b.dataset.m;
      $("#sy-seg").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
      paint();
    });
  });

  paint();
}
