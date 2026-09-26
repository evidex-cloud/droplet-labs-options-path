// Main demo for lesson put-option: pick a put strike, slide the price at expiry, see the decision,
// P&L per share and per contract, the breakeven K − p and the capped maximum gain K − p (price can't go below 0).
import * as O from "./_opt.js";
import { payoffChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100, Tm = 30 / 365, r = 0.04, sigma = 0.2;
  const prem = (K) => Math.round(O.bsPrice({ S: S0, K, T: Tm, r, sigma, type: "put" }) * 100) / 100;
  let K = 100;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("买一张 XYZ 30 天看跌期权：跌得越多，赚得越多——但有上限", "Buy a 30-day XYZ put: the further it falls, the more it pays — up to a limit")}</div>
    <div class="demo-row"><span class="demo-label">${T("行权价 K", "Strike K")}</span>
      ${seg("po-k", [[90, "90"], [95, "95"], [100, "100"], [105, "105"]], K)}</div>
    <div class="demo-grid">
      ${slider("po-st", T("到期时 XYZ 的价格", "XYZ price at expiry"), 0, 130, 0.5, 90)}
      ${slider("po-n", T("买几张合约", "Contracts bought"), 1, 10, 1, 1)}
    </div>
    <div id="po-dec"></div>
    <div class="demo-math" id="po-f"></div>
    <div id="po-stats"></div>
    <div id="po-chart"></div>
    <p class="demo-tip">${T("试试：把到期价一路拉到 0。看跌期权的收益在 0 处封顶，最多赚“行权价 − 权利金”。再比较 95 和 100 两个行权价：95 便宜得多，但股价要先跌过 94.49 才开始赚钱。", "Try this: drag the expiry price all the way to 0. A put's gain tops out there, at “strike − premium”. Then compare the 95 and 100 strikes: the 95 is far cheaper, but XYZ must fall below 94.49 before it earns anything.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const ST = v["po-st"], n = v["po-n"], p = prem(K);
    const payoff = Math.max(K - ST, 0), pl = payoff - p, total = pl * 100 * n;
    const ex = ST < K;
    $("#po-dec").innerHTML = `<div class="detail">${ex
      ? T(`<span class="tag ok">行权</span> XYZ 收在 ${ST.toFixed(2)}，低于行权价 ${K}：按 ${K} 把股票卖出（或按差价结算），每股多拿 ${payoff.toFixed(2)} 美元。${pl < 0 ? "还不够弥补 " + p.toFixed(2) + " 美元的权利金。" : "扣掉权利金后净赚。"}`,
          `<span class="tag ok">Exercise</span> XYZ at ${ST.toFixed(2)} is below the ${K} strike: sell at ${K}, collecting $${payoff.toFixed(2)} a share more than the market pays. ${pl < 0 ? "Not yet enough to cover the $" + p.toFixed(2) + " premium." : "After the premium, a net gain."}`)
      : T(`<span class="tag bad">放弃</span> XYZ 收在 ${ST.toFixed(2)}，不低于行权价 ${K}：在市场上能卖得更贵，这份“按 ${K} 卖出”的权利没用了。损失就是权利金。`,
          `<span class="tag bad">Let it expire</span> XYZ at ${ST.toFixed(2)} is not below the ${K} strike: the market pays at least as much, so the right to sell at ${K} is useless. The loss is the premium.`)}</div>`;
    $("#po-f").innerHTML = tex(String.raw`\Pi = \max(K - S_T,\,0) - p = \max(${K} - ${ST.toFixed(2)},\,0) - ${p.toFixed(2)} = ${pl.toFixed(2)}\ \text{${T("每股", "per share")}}`, true)
      + tex(String.raw`${pl.toFixed(2)} \times 100 \times ${n} = ${total < 0 ? "-" : ""}\$${Math.round(Math.abs(total)).toLocaleString("en-US").replace(/,/g, "{,}")}`, true);
    $("#po-stats").innerHTML = stats([
      [T("权利金（每股）", "Premium per share"), "$" + p.toFixed(2)],
      [T("付出的总权利金", "Total premium paid"), "$" + Math.round(p * 100 * n).toLocaleString("en-US"), "acc"],
      [T("盈亏平衡点 K − p", "Breakeven K − p"), "$" + (K - p).toFixed(2)],
      [T("最大收益（XYZ 跌到 0）", "Max gain (XYZ at 0)"), "$" + ((K - p) * 100 * n).toLocaleString("en-US", { maximumFractionDigits: 0 })],
      [T("这笔交易的盈亏", "Trade P&L"), (total < 0 ? "−$" : "+$") + Math.round(Math.abs(total)).toLocaleString("en-US"), total >= 0 ? "pos" : "neg"],
      [T("权利金回报率", "Return on premium"), ((pl / p) * 100).toFixed(0) + "%", pl >= 0 ? "pos" : "neg"],
    ]);
    $("#po-chart").innerHTML = payoffChart({
      legs: [{ type: "put", side: "long", K, premium: p }], lo: 0, hi: 130, spot: ST, mult: 100 * n,
      xlabel: T("到期时 XYZ 的价格（美元）", "XYZ price at expiry ($)"), ylabel: T("盈亏（美元）", "P&L ($)"),
      labels: { expiry: T("看跌期权到期盈亏", "Put P&L at expiry"), spot: T("到期价", "at expiry"), be: T("平衡", "BE") },
    }).html;
  };
  const run = bindSliders(root, { "po-st": (x) => "$" + x.toFixed(2), "po-n": (x) => x + T(" 张", "") }, draw);
  onSeg(root, "po-k", (v) => { K = +v; run(); });
}
