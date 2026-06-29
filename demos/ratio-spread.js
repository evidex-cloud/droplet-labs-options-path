// demos/ratio-spread.js —— 比率价差 / 反向价差 损益演示
// 分段切换 比率价差(买1卖2，裸露无限风险) / 反向价差(卖1买2，凸性无限收益)。
// payoffSVG 用带 qty 的腿画损益：一边是裸露下行尾巴，一边是敞开上行尾巴。
// stat-row 用 extremes() 判断右尾是否无界 → 显示“理论无限”。全部真算（netPL 引擎）。
import { payoffSVG, payoffBlock, netPL } from "./_payoff.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;
  const LO = 70, HI = 150, SPOT = 100;

  let mode = "ratio"; // 'ratio'(买1卖2) | 'back'(卖1买2)
  // 看涨：低行权价 K1=100，高行权价 K2=110
  const K1 = 100, K2 = 110, p1 = 6, p2 = 2.5;

  function buildLegs() {
    if (mode === "ratio") {
      // 比率价差：买 1 张 K1 + 卖 2 张 K2
      return [
        { type: "call", side: "long", strike: K1, premium: p1, qty: 1 },
        { type: "call", side: "short", strike: K2, premium: p2, qty: 2 },
      ];
    }
    // 反向价差：卖 1 张 K1 + 买 2 张 K2
    return [
      { type: "call", side: "short", strike: K1, premium: p1, qty: 1 },
      { type: "call", side: "long", strike: K2, premium: p2, qty: 2 },
    ];
  }

  // 估计极值 + 右端渐近斜率（判断无界方向）；左端股价地板为 0。
  function extremes(legs) {
    const lo = 0, hi = 400, n = 1600;
    let mn = Infinity, mx = -Infinity;
    for (let i = 0; i <= n; i++) {
      const S = lo + (hi - lo) * (i / n), y = netPL(legs, S);
      if (y < mn) mn = y; if (y > mx) mx = y;
    }
    let slopeR = 0;
    for (const l of legs) {
      const sgn = l.side === "short" ? -1 : 1;
      const q = l.qty == null ? 1 : l.qty;
      if (l.type === "call") slopeR += sgn * q; // 看涨右端斜率 ±q
    }
    return { mn, mx, profitUnbounded: slopeR > 1e-9, lossUnbounded: slopeR < -1e-9 };
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">⚖️ ${T("比率价差 / 反向价差 · 一对镜像", "Ratio spread / Backspread · a mirror pair")}</div>

      <div class="demo-row" style="margin-bottom:10px">
        <div class="demo-seg" id="rs-seg">
          <button data-m="ratio" class="on">${T("比率价差 (买1卖2)", "Ratio (buy1 sell2)")}</button>
          <button data-m="back">${T("反向价差 (卖1买2)", "Backspread (sell1 buy2)")}</button>
        </div>
        <span class="pill" id="rs-tag"></span>
      </div>

      <div class="legs" id="rs-legs"></div>

      <div id="rs-chart"></div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("最大盈利", "Max profit")}</div><div class="v pos" id="rs-mp">–</div></div>
        <div class="stat"><div class="k">${T("最大亏损", "Max loss")}</div><div class="v neg" id="rs-ml">–</div></div>
        <div class="stat"><div class="k">${T("关键点(K2)", "Key point (K2)")}</div><div class="v acc" id="rs-key">–</div></div>
        <div class="stat"><div class="k">${T("上盈亏平衡", "Upper BE")}</div><div class="v acc" id="rs-be">–</div></div>
        <div class="stat"><div class="k">${T("净现金流", "Net cash")}</div><div class="v" id="rs-net">–</div></div>
      </div>

      <p class="demo-tip" id="rs-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  function legRow(leg) {
    const buy = leg.side === "long";
    const sideTxt = buy ? T("买入", "BUY") : T("卖出", "SELL");
    const sideCls = buy ? "side-buy" : "side-sell";
    return `<div class="leg">
      <span class="${sideCls}">${sideTxt}</span>
      <span class="leg-pill call">CALL</span>
      <span class="leg-tag">K=${leg.strike}　${T("权利金", "prem")} ${leg.premium.toFixed(1)}　×${leg.qty}</span>
    </div>`;
  }

  function paint() {
    const legs = buildLegs();
    $("#rs-legs").innerHTML = legs.map(legRow).join("");

    const res = payoffSVG({ legs, lo: LO, hi: HI, spot: SPOT, spotLabel: T("现价", "spot"), uid: "rs" });
    $("#rs-chart").innerHTML = payoffBlock(res, [
      ["var(--green-soft)", T("盈利", "Profit")],
      ["var(--red-soft)", T("亏损", "Loss")],
      ["var(--gold)", T("行权价", "Strike")],
    ]);

    const ext = extremes(legs);
    // 净现金流（每股）：+ 为收、− 为付
    const netPS = legs.reduce((a, l) => a + (l.side === "short" ? 1 : -1) * l.premium * l.qty, 0);
    // K2 处的损益（比率=峰顶 / 反向=谷底）
    const keyPS = netPL(legs, K2);
    // 上方盈亏平衡 = K2 ± |keyPS|（比率在上方下穿 0；反向在上方上穿 0）
    const upperBE = K2 + Math.abs(keyPS);

    $("#rs-mp").textContent = ext.profitUnbounded ? T("理论无限", "∞") : "+$" + (ext.mx * MULT).toFixed(0);
    $("#rs-ml").textContent = ext.lossUnbounded ? T("理论无限", "∞") : (ext.mn >= 0 ? "$0" : "−$" + Math.abs(ext.mn * MULT).toFixed(0));
    $("#rs-key").textContent = (keyPS >= 0 ? "+$" : "−$") + Math.abs(keyPS * MULT).toFixed(0) + " @" + K2;
    $("#rs-be").textContent = upperBE.toFixed(1);
    const netCell = $("#rs-net");
    netCell.textContent = (netPS >= 0 ? T("+收 $", "+$") : T("−付 $", "−$")) + Math.abs(netPS * MULT).toFixed(0);
    netCell.className = "v " + (netPS >= 0 ? "pos" : "neg");

    if (mode === "ratio") {
      $("#rs-tag").className = "pill bad";
      $("#rs-tag").textContent = T("裸露 · 上行无限风险", "naked · ∞ upside risk");
      $("#rs-tip").innerHTML = T(
        `<b>比率价差</b>（买1@${K1} + 卖2@${K2}）。甜蜜点在卖出行权价 <b>${K2}</b>：吃满最大盈利 <b>+$${(keyPS * MULT).toFixed(0)}</b>。但高价位净剩 <b>1 张裸卖看涨</b>——过上方盈亏平衡 <b>${upperBE.toFixed(1)}</b> 后亏损<b>理论无限</b>（看右侧不断下滑的尾巴）。它押“温和涨到 ${K2} 附近、绝不暴涨”，必须对裸腿设止损/对冲。`,
        `<b>Ratio spread</b> (buy1@${K1} + sell2@${K2}). Sweet spot at the short strike <b>${K2}</b>: max profit <b>+$${(keyPS * MULT).toFixed(0)}</b>. But at high prices one <b>naked short call</b> remains — beyond the upper breakeven <b>${upperBE.toFixed(1)}</b> the loss is <b>theoretically unlimited</b> (see the falling right tail). It bets on a mild rise toward ${K2} with no blow-off; the naked leg needs a stop/hedge.`
      );
    } else {
      $("#rs-tag").className = "pill ok";
      $("#rs-tag").textContent = T("凸性 · 上行无限收益", "convex · ∞ upside reward");
      $("#rs-tip").innerHTML = T(
        `<b>反向价差</b>（卖1@${K1} + 买2@${K2}）。下方/不动时保住净收入 <b>+$${(netPS * MULT).toFixed(0)}</b>；最痛在“死亡谷”谷底 <b>${K2}</b>：亏 <b>−$${Math.abs(keyPS * MULT).toFixed(0)}</b>（有限）。涨过 <b>${upperBE.toFixed(1)}</b> 后两张多头看涨的<b>凸性</b>释放，收益<b>理论无限</b>（看右侧陡升的尾巴）。它押“要么没事、要么巨动”，最怕温和地停在 ${K2}。`,
        `<b>Backspread</b> (sell1@${K1} + buy2@${K2}). Below / flat you keep the net credit <b>+$${(netPS * MULT).toFixed(0)}</b>; worst is the "valley of death" floor at <b>${K2}</b>: lose <b>−$${Math.abs(keyPS * MULT).toFixed(0)}</b> (finite). Past <b>${upperBE.toFixed(1)}</b> the two long calls' <b>convexity</b> kicks in and reward is <b>theoretically unlimited</b> (see the steep right tail). It bets "nothing or a huge move," and hates stalling at ${K2}.`
      );
    }
  }

  $("#rs-seg").querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => {
      mode = b.dataset.m;
      $("#rs-seg").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
      paint();
    });
  });

  paint();
}
