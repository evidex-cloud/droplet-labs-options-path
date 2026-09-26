// Main demo for lesson four-positions: long/short call, long/short put on XYZ (30 days, K chosen, BS premiums).
// Shows the expiry P&L, max gain / max loss, breakeven, and what the other side of the trade earns.
import * as O from "./_opt.js";
import { payoffChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100, Tm = 30 / 365;
  const prem = (type, K) => Math.round(O.bsPrice({ S: S0, K, T: Tm, r: 0.04, sigma: 0.2, type }) * 100) / 100;
  let pos = "lc", K = 100;
  const P = {
    lc: { type: "call", side: "long", zh: "买入看涨（多头看涨）", en: "Long call" },
    sc: { type: "call", side: "short", zh: "卖出看涨（空头看涨）", en: "Short call" },
    lp: { type: "put", side: "long", zh: "买入看跌（多头看跌）", en: "Long put" },
    sp: { type: "put", side: "short", zh: "卖出看跌（空头看跌）", en: "Short put" },
  };
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("四个基本头寸：选一个，看它在哪里赢、在哪里输", "The four basic positions: pick one, see where it wins and where it loses")}</div>
    <div class="demo-row">${seg("fp-pos", Object.entries(P).map(([k, x]) => [k, en ? x.en : x.zh]), pos)}</div>
    <div class="demo-row"><span class="demo-label">${T("行权价 K", "Strike K")}</span>${seg("fp-k", [[95, "95"], [100, "100"], [105, "105"]], K)}</div>
    ${slider("fp-st", T("到期时 XYZ 的价格", "XYZ price at expiry"), 60, 140, 0.5, 110)}
    <div class="demo-math" id="fp-f"></div>
    <div id="fp-stats"></div>
    <div id="fp-chart"></div>
    <div class="detail" id="fp-note"></div>
    <p class="demo-tip">${T("试试：在“买入看涨”和“卖出看涨”之间来回切换——图形上下翻转，盈亏数字只差一个负号。然后看“卖出看涨”的最大亏损：没有上限。", "Try this: flip between long call and short call — the picture turns upside down and every number just changes sign. Then look at the short call's maximum loss: there is no cap.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const usd = (x) => (x === Infinity || x === -Infinity ? T("无上限", "unlimited") : (x < 0 ? "−$" : "$") + Math.abs(x).toLocaleString("en-US", { maximumFractionDigits: 0 }));
  const draw = (v) => {
    const ST = v["fp-st"], x = P[pos], prm = prem(x.type, K), sgn = x.side === "long" ? 1 : -1;
    const leg = { type: x.type, side: x.side, K, premium: prm };
    const pl = O.legPL(leg, ST);
    const pay = x.type === "call" ? String.raw`\max(S_T - K,\,0)` : String.raw`\max(K - S_T,\,0)`;
    const payNum = x.type === "call" ? String.raw`\max(${ST.toFixed(2)} - ${K},\,0)` : String.raw`\max(${K} - ${ST.toFixed(2)},\,0)`;
    const sym = x.type === "call" ? "c" : "p";
    $("#fp-f").innerHTML = tex(sgn > 0
      ? String.raw`\Pi = ${pay} - ${sym} = ${payNum} - ${prm.toFixed(2)} = ${pl.toFixed(2)}`
      : String.raw`\Pi = ${sym} - ${pay} = ${prm.toFixed(2)} - ${payNum} = ${pl.toFixed(2)}`, true);
    const st = O.payoffStats([leg], 0, 400);
    const be = x.type === "call" ? K + prm : K - prm;
    $("#fp-stats").innerHTML = stats([
      [sgn > 0 ? T("付出权利金", "Premium paid") : T("收到权利金", "Premium received"), usd(prm * 100), "acc"],
      [T("最大收益（每张）", "Max gain (per contract)"), usd(st.maxProfit * 100), "pos"],
      [T("最大亏损（每张）", "Max loss (per contract)"), usd(st.maxLoss * 100), "neg"],
      [T("盈亏平衡点", "Breakeven"), "$" + be.toFixed(2)],
      [T("此价位你的盈亏", "Your P&L here"), usd(pl * 100), pl >= 0 ? "pos" : "neg"],
      [T("对手方的盈亏", "Other side's P&L"), usd(-pl * 100), -pl >= 0 ? "pos" : "neg"],
    ]);
    $("#fp-chart").innerHTML = payoffChart({
      legs: [leg], lo: 60, hi: 140, spot: ST, mult: 100,
      xlabel: T("到期时 XYZ 的价格（美元）", "XYZ price at expiry ($)"), ylabel: T("每张合约盈亏（美元）", "P&L per contract ($)"),
      labels: { expiry: en ? x.en : x.zh, spot: T("到期价", "at expiry"), be: T("平衡", "BE") },
      extra: [{ f: (s) => -O.legPL(leg, s) * 100, cls: 5, dashed: true, label: T("对手方（镜像）", "The other side (mirror)") }],
    }).html;
    const notes = {
      lc: T("看多，押大涨。亏损封顶在权利金，涨得越多赚得越多。时间在跟你作对。", "Bullish, betting on a big rise. Loss capped at the premium; the higher XYZ goes, the more you make. Time works against you."),
      sc: T("收了权利金，承担“被要求按 K 卖出”的义务。XYZ 不涨，权利金归你；XYZ 大涨，亏损没有上限。没有持股的“裸卖”需要券商的高级别权限和保证金。", "You collect the premium and take on the obligation to sell at K. If XYZ stays put you keep it; if XYZ soars, the loss has no ceiling. Selling “naked” (without the shares) needs a high approval level and margin."),
      lp: T("看空或买保险，押大跌。亏损封顶在权利金；最大收益也有上限：股价最低只能跌到 0。", "Bearish or insurance, betting on a big fall. Loss capped at the premium; the gain is capped too, because the price can only fall to 0."),
      sp: T(`收了权利金，承担“被要求按 K 买入”的义务。相当于同意以 ${(K - prm).toFixed(2)} 美元（K − p）买入 XYZ。最坏情况 XYZ 跌到 0，亏 ${usd((K - prm) * 100)}。`, `You collect the premium and take on the obligation to buy at K — in effect agreeing to buy XYZ at $${(K - prm).toFixed(2)} (K − p). Worst case XYZ goes to 0 and you lose ${usd((K - prm) * 100)}.`),
    };
    $("#fp-note").innerHTML = notes[pos];
  };
  const run = bindSliders(root, { "fp-st": (x) => "$" + x.toFixed(2) }, draw);
  onSeg(root, "fp-pos", (v) => { pos = v; run(); });
  onSeg(root, "fp-k", (v) => { K = +v; run(); });
}
