// 交互演示：两种基本权利浏览器 —— 看涨/看跌 × 买方/卖方
// 两个分段切换：类型（Call/Put）与立场（买方=权利 / 卖方=义务）。
// 实时给出“权利/义务”的一句话、谁付/收权利金、方向观点，并画出单腿到期损益。
import { payoffSVG, payoffBlock } from "./_payoff.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;
  const SPOT = 100;
  const STRIKE = 100;   // 平值，便于对照
  const PREM = 5;       // 权利金（每股）

  let type = "call";    // call | put
  let side = "long";    // long(买方/权利) | short(卖方/义务)

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🧭 ${T("权利浏览器 · 看涨/看跌 × 买方/卖方", "Rights Explorer · Call/Put × Buyer/Seller")}</div>

      <div class="demo-row">
        <div class="demo-seg" id="re-type">
          <button data-v="call" class="on">${T("看涨 Call", "Call")}</button>
          <button data-v="put">${T("看跌 Put", "Put")}</button>
        </div>
        <div class="demo-seg" id="re-side">
          <button data-v="long" class="on">${T("买方（权利）", "Buyer (right)")}</button>
          <button data-v="short">${T("卖方（义务）", "Seller (obligation)")}</button>
        </div>
      </div>

      <div class="scn" id="re-sentence" style="margin-top:12px"></div>

      <div class="stat-row" id="re-stats" style="margin-top:12px"></div>

      <div id="re-chart" style="margin-top:12px"></div>

      <p class="demo-tip" id="re-tip"></p>
    </div>`;

  const $ = (id) => root.querySelector(id);

  function render() {
    const isCall = type === "call";
    const isLong = side === "long";

    // 一句话：权利 vs 义务
    let sentence;
    if (isCall && isLong) sentence = T(
      "你<b>有权（非义务）</b>以行权价 100 <b>买入</b>标的。看对涨势就行权、看错就放弃，<b>最多损失权利金</b>。",
      "You have the <b>right (not obligation)</b> to <b>buy</b> the underlying at strike 100. Exercise if it pays, walk away if not — <b>max loss is the premium</b>."
    );
    else if (isCall && !isLong) sentence = T(
      "你<b>有义务</b>在买方行权时以 100 <b>卖出</b>标的（哪怕市价已飙到天上）。<b>先收权利金，风险敞开</b>，需交保证金。",
      "You are <b>obligated</b> to <b>sell</b> at 100 if the buyer exercises (even if the market has soared). You <b>collect premium, risk is open</b>, margin required."
    );
    else if (!isCall && isLong) sentence = T(
      "你<b>有权（非义务）</b>以行权价 100 <b>卖出</b>标的。可纯赌下跌，也可给持仓买保险，<b>最多损失权利金</b>。",
      "You have the <b>right (not obligation)</b> to <b>sell</b> the underlying at strike 100. Bet on a drop, or insure a holding — <b>max loss is the premium</b>."
    );
    else sentence = T(
      "你<b>有义务</b>在买方行权时以 100 <b>买入（接货）</b>标的（哪怕已跌得很惨）。<b>先收权利金，风险敞开</b>，需交保证金。",
      "You are <b>obligated</b> to <b>buy</b> (take delivery) at 100 if the buyer exercises (even after a deep drop). You <b>collect premium, risk is open</b>, margin required."
    );
    $("#re-sentence").innerHTML = `<div class="scn-q">${sentence}</div>`;

    // 关键徽标：权利金方向 / 方向观点 / 最大亏损
    const premLine = isLong
      ? ["−$" + (PREM * MULT).toFixed(0), "neg", T("付出权利金", "Pay premium")]
      : ["+$" + (PREM * MULT).toFixed(0), "pos", T("收取权利金", "Collect premium")];

    // 方向观点（站在该立场希望标的怎么走）
    let view;
    if (isCall && isLong) view = T("看涨 ↑", "Bullish ↑");
    else if (isCall && !isLong) view = T("看不涨 ↓→", "Not-up ↓→");
    else if (!isCall && isLong) view = T("看跌 ↓", "Bearish ↓");
    else view = T("看不跌 ↑→", "Not-down ↑→");

    // 最大亏损
    const maxLoss = isLong
      ? "−$" + (PREM * MULT).toFixed(0)
      : (isCall ? T("理论无限", "∞ (uncapped)") : "−$" + ((STRIKE - PREM) * MULT).toFixed(0));

    $("#re-stats").innerHTML = `
      <div class="stat"><div class="k">${premLine[2]}</div><div class="v ${premLine[1]}">${premLine[0]}</div></div>
      <div class="stat"><div class="k">${T("方向观点", "View")}</div><div class="v acc">${view}</div></div>
      <div class="stat"><div class="k">${T("最大亏损", "Max loss")}</div><div class="v neg">${maxLoss}</div></div>`;

    // 单腿损益图
    const legs = [{ type, side, strike: STRIKE, premium: PREM, qty: 1 }];
    const res = payoffSVG({
      legs, lo: 60, hi: 140, spot: SPOT,
      spotLabel: T("现价", "Spot"), uid: "re",
    });
    $("#re-chart").innerHTML = payoffBlock(res, [
      ["var(--green-soft)", T("盈利", "Profit")],
      ["var(--red-soft)", T("亏损", "Loss")],
    ]);

    $("#re-tip").innerHTML = isLong
      ? T("切到“卖方”看：损益图会<b>上下翻转</b>——买方与卖方的盈亏严格互为镜像。买方握权利、亏损封顶；卖方背义务、收益封顶。", "Flip to “Seller”: the payoff <b>mirrors vertically</b> — buyer and seller P&L are exact mirror images. Buyer holds the right (loss capped); seller the obligation (gain capped).")
      : T("注意卖方的损益是<b>买方的镜像</b>：收益封顶在权利金，风险却敞开（裸卖看涨理论上无限）。这就是为什么卖方要交保证金。", "Note the seller's payoff <b>mirrors the buyer's</b>: gain capped at the premium, risk open (naked call is theoretically unlimited). That's why sellers post margin.");
  }

  $("#re-type").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    type = b.dataset.v;
    $("#re-type").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    render();
  });
  $("#re-side").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    side = b.dataset.v;
    $("#re-side").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    render();
  });

  render();
}
