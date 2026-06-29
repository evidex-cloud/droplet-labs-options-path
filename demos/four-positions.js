// 交互演示：四个基本头寸的 2×2
// 点选 买入看涨 / 卖出看涨 / 买入看跌 / 卖出看跌，渲染对应的单腿损益图、
// 一句话观点，以及 最大盈利 / 最大亏损 / 权利金方向 三个徽标。K=100, c=5。
import { payoffSVG, payoffBlock } from "./_payoff.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;
  const K = 100, C = 5;          // 统一行权价/权利金（每股）
  const LO = 60, HI = 140;

  // 四个头寸的配置。inf 标记“理论无限”
  const POS = {
    lc: {
      label: T("买入看涨", "Long Call"), type: "call", side: "long",
      view: T("看涨 ↑：赌标的涨过 105", "Bullish ↑: bet it rises past 105"),
      maxProfit: [T("理论无限", "∞ (uncapped)"), "pos"],
      maxLoss: ["−$" + (C * MULT).toFixed(0), "neg"],
      prem: ["−$" + (C * MULT).toFixed(0), "neg", T("付出权利金", "Pay premium")],
    },
    sc: {
      label: T("卖出看涨", "Short Call"), type: "call", side: "short",
      view: T("看不涨 ↓→：赌标的别大涨", "Not-up ↓→: bet it won't rally"),
      maxProfit: ["+$" + (C * MULT).toFixed(0), "pos"],
      maxLoss: [T("理论无限", "∞ (uncapped)"), "neg"],
      prem: ["+$" + (C * MULT).toFixed(0), "pos", T("收取权利金", "Collect premium")],
    },
    lp: {
      label: T("买入看跌", "Long Put"), type: "put", side: "long",
      view: T("看跌 ↓：赌标的跌破 95（或买保险）", "Bearish ↓: bet it falls below 95 (or insure)"),
      maxProfit: ["+$" + ((K - C) * MULT).toFixed(0), "pos"],
      maxLoss: ["−$" + (C * MULT).toFixed(0), "neg"],
      prem: ["−$" + (C * MULT).toFixed(0), "neg", T("付出权利金", "Pay premium")],
    },
    sp: {
      label: T("卖出看跌", "Short Put"), type: "put", side: "short",
      view: T("看不跌 ↑→：赌别大跌（承诺接货）", "Not-down ↑→: bet it won't drop (agree to buy)"),
      maxProfit: ["+$" + (C * MULT).toFixed(0), "pos"],
      maxLoss: ["−$" + ((K - C) * MULT).toFixed(0), "neg"],
      prem: ["+$" + (C * MULT).toFixed(0), "pos", T("收取权利金", "Collect premium")],
    },
  };

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🧩 ${T("四个基本头寸 · 点选看损益", "The Four Positions · Click to inspect")} <span style="color:var(--muted);font-weight:400">(K=100, ${T("权利金", "premium")}=5)</span></div>
      <div class="demo-grid" id="fp-grid">
        <button class="demo-btn sel" data-k="lc">${POS.lc.label}</button>
        <button class="demo-btn" data-k="sc">${POS.sc.label}</button>
        <button class="demo-btn" data-k="lp">${POS.lp.label}</button>
        <button class="demo-btn" data-k="sp">${POS.sp.label}</button>
      </div>

      <div class="scn" id="fp-view" style="margin-top:12px"></div>
      <div id="fp-chart" style="margin-top:12px"></div>
      <div class="stat-row" id="fp-stats"></div>
      <p class="demo-tip" id="fp-tip"></p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  const grid = $("#fp-grid");

  function render(key) {
    const p = POS[key];

    $("#fp-view").innerHTML = `<div class="scn-q">${T("你的观点", "Your view")}：<b>${p.view}</b></div>`;

    const legs = [{ type: p.type, side: p.side, strike: K, premium: C, qty: 1 }];
    const res = payoffSVG({ legs, lo: LO, hi: HI, spot: 100, spotLabel: T("现价", "Spot"), uid: "fp-" + key });
    $("#fp-chart").innerHTML = payoffBlock(res, [
      ["var(--green-soft)", T("盈利", "Profit")],
      ["var(--red-soft)", T("亏损", "Loss")],
    ]);

    $("#fp-stats").innerHTML = `
      <div class="stat"><div class="k">${T("最大盈利", "Max profit")}</div><div class="v ${p.maxProfit[1]}">${p.maxProfit[0]}</div></div>
      <div class="stat"><div class="k">${T("最大亏损", "Max loss")}</div><div class="v ${p.maxLoss[1]}">${p.maxLoss[0]}</div></div>
      <div class="stat"><div class="k">${p.prem[2]}</div><div class="v ${p.prem[1]}">${p.prem[0]}</div></div>`;

    // 镜像提示：买/卖对照
    const isLong = p.side === "long";
    const isCall = p.type === "call";
    $("#fp-tip").innerHTML = isLong
      ? T("<b>买方</b>：付权利金、握权利，<b>亏损封顶在权利金</b>，收益方向敞开。切到对应的“卖出”看：损益图正好<b>上下翻转</b>。", "<b>Buyer</b>: pays premium, holds the right — <b>loss capped at the premium</b>, gain open. Flip to the matching short and the payoff <b>mirrors vertically</b>.")
      : (isCall
        ? T("<b>卖出看涨</b>是唯一<b>真正无限风险</b>的一格：标的上不封顶，你却得按 100 交货。收益封顶在权利金，需交保证金。", "<b>Short call</b> is the only truly <b>unlimited-risk</b> corner: the underlying is uncapped but you must deliver at 100. Gain is capped at the premium; margin required.")
        : T("<b>卖出看跌</b> = 承诺“跌破 95 就按 100 接货”，先收权利金。最大亏损有限（标的归零时），相当于<b>折价买入的承诺</b>。", "<b>Short put</b> = agreeing to buy at 100 if it falls below 95, collecting premium upfront. Loss is finite (at zero) — effectively a <b>commitment to buy at a discount</b>."));
  }

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    grid.querySelectorAll("button").forEach((b) => b.classList.toggle("sel", b === btn));
    render(btn.dataset.k);
  });

  render("lc");
}
