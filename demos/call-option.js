// Main demo for lesson call-option: pick a strike, slide the price at expiry, see the exercise decision
// and the P&L per share and per contract, next to simply owning 100 shares per contract.
import * as O from "./_opt.js";
import { payoffChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100, Tm = 30 / 365, r = 0.04, sigma = 0.2;
  const prem = (K) => Math.round(O.bsPrice({ S: S0, K, T: Tm, r, sigma, type: "call" }) * 100) / 100;
  let K = 100;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("买一张 XYZ 30 天看涨期权：到期那天发生什么", "Buy a 30-day XYZ call: what happens on expiry day")}</div>
    <div class="demo-row"><span class="demo-label">${T("行权价 K", "Strike K")}</span>
      ${seg("co-k", [[95, "95"], [100, "100"], [105, "105"], [110, "110"]], K)}</div>
    <div class="demo-grid">
      ${slider("co-st", T("到期时 XYZ 的价格", "XYZ price at expiry"), 70, 130, 0.5, 110)}
      ${slider("co-n", T("买几张合约", "Contracts bought"), 1, 10, 1, 1)}
    </div>
    <div id="co-dec"></div>
    <div class="demo-math" id="co-f"></div>
    <div id="co-stats"></div>
    <div id="co-chart"></div>
    <p class="demo-tip">${T("试试：把到期价拉到行权价和盈亏平衡点之间（比如 K = 100 时拉到 101）。决定仍是“行权”，但整笔交易还是亏的——行权只是把亏损变小。再换成 110 行权价，看便宜的期权需要多大的涨幅才回本。", "Try this: park the expiry price between the strike and breakeven (for K = 100, try 101). The decision is still “exercise”, yet the trade loses money — exercising only shrinks the loss. Then switch to the 110 strike and see how far a cheap call needs the stock to run.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const ST = v["co-st"], n = v["co-n"], c = prem(K);
    const payoff = Math.max(ST - K, 0), pl = payoff - c, total = pl * 100 * n;
    const ex = ST > K;
    $("#co-dec").innerHTML = `<div class="detail">${ex
      ? T(`<span class="tag ok">行权</span> 到期价 ${ST.toFixed(2)} 高于行权价 ${K}：用 ${K} 买入、市价值 ${ST.toFixed(2)}，每股收回 ${payoff.toFixed(2)} 美元。${pl < 0 ? "但这还不够弥补 " + c.toFixed(2) + " 美元的权利金，所以整笔仍亏。" : "扣掉权利金后是净赚。"}`,
          `<span class="tag ok">Exercise</span> XYZ at ${ST.toFixed(2)} is above the ${K} strike: buy at ${K}, worth ${ST.toFixed(2)}, so each share gives back $${payoff.toFixed(2)}. ${pl < 0 ? "That is not enough to cover the $" + c.toFixed(2) + " premium, so the trade still loses." : "After the premium, the trade is a net gain."}`)
      : T(`<span class="tag bad">放弃</span> 到期价 ${ST.toFixed(2)} 不高于行权价 ${K}：按 ${K} 买一只在市场上只值 ${ST.toFixed(2)} 的股票毫无道理，让权利作废。损失就是权利金，一分不多。`,
          `<span class="tag bad">Let it expire</span> XYZ at ${ST.toFixed(2)} is not above the ${K} strike: paying ${K} for a stock worth ${ST.toFixed(2)} makes no sense, so the right lapses. The loss is the premium — not a cent more.`)}</div>`;
    $("#co-f").innerHTML = tex(String.raw`\Pi = \max(S_T - K,\,0) - c = \max(${ST.toFixed(2)} - ${K},\,0) - ${c.toFixed(2)} = ${pl.toFixed(2)}\ \text{${T("每股", "per share")}}`, true)
      + tex(String.raw`${pl.toFixed(2)} \times 100 \times ${n} = ${total < 0 ? "-" : ""}\$${Math.round(Math.abs(total)).toLocaleString("en-US").replace(/,/g, "{,}")}`, true);
    $("#co-stats").innerHTML = stats([
      [T("权利金（每股）", "Premium per share"), "$" + c.toFixed(2)],
      [T("付出的总权利金", "Total premium paid"), "$" + Math.round(c * 100 * n).toLocaleString("en-US"), "acc"],
      [T("盈亏平衡点 K + c", "Breakeven K + c"), "$" + (K + c).toFixed(2)],
      [T("这笔交易的盈亏", "Trade P&L"), (total < 0 ? "−$" : "+$") + Math.round(Math.abs(total)).toLocaleString("en-US"), total >= 0 ? "pos" : "neg"],
      [T("权利金回报率", "Return on premium"), ((pl / c) * 100).toFixed(0) + "%", pl >= 0 ? "pos" : "neg"],
      [T(`改买 ${100 * n} 股正股`, `${100 * n} shares instead`), ((ST - S0) * 100 * n < 0 ? "−$" : "+$") + Math.abs((ST - S0) * 100 * n).toLocaleString("en-US", { maximumFractionDigits: 0 })],
    ]);
    const pc = payoffChart({
      legs: [{ type: "call", side: "long", K, premium: c }], lo: 70, hi: 130, spot: ST, mult: 100 * n,
      xlabel: T("到期时 XYZ 的价格（美元）", "XYZ price at expiry ($)"), ylabel: T("盈亏（美元）", "P&L ($)"),
      labels: { expiry: T("看涨期权到期盈亏", "Call P&L at expiry"), spot: T("到期价", "at expiry"), be: T("平衡", "BE") },
      extra: [{ f: (x) => (x - S0) * 100 * n, cls: 5, dashed: true, label: T("改买同等数量的正股", "Owning the shares instead") }],
    });
    $("#co-chart").innerHTML = pc.html;
  };
  const run = bindSliders(root, { "co-st": (x) => "$" + x.toFixed(2), "co-n": (x) => x + T(" 张", "") }, draw);
  onSeg(root, "co-k", (v) => { K = +v; run(); });
}
