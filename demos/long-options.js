// Main demo for lesson long-options: turn a view (target price + date) into a choice of strike and expiry.
// Every cell is priced with Black-Scholes (demos/_opt.js); the stock is assumed to travel in a straight line to the target,
// so an option that expires before the target date is settled at the price reached on its expiry day.
import * as O from "./_opt.js";
import { payoffChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100, r = 0.04, EXP = [30, 60, 120, 365];
  let dir = "bull", pick = { k: 1, e: 1 };
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("从观点到合约：行权价 × 到期日", "From a view to a contract: strike × expiry")}</div>
    <div class="demo-row">${seg("lo-dir", [["bull", T("看涨观点 → 买看涨", "Bullish → buy calls")], ["bear", T("看跌观点 → 买看跌", "Bearish → buy puts")]], dir)}</div>
    <div class="demo-grid">
      ${slider("lo-tgt", T("目标价", "Target price"), 80, 120, 1, 110)}
      ${slider("lo-day", T("几天后到达", "Reached after (days)"), 5, 200, 5, 60)}
      ${slider("lo-iv", T("隐含波动率（买入时与到达时相同）", "Implied vol (same at entry and target)"), 10, 60, 1, 20)}
    </div>
    <div class="demo-label">${T("每格 = 按你的观点走完后，一张合约的回报率（点一格看细节）", "Each cell = return on one contract if your view plays out (click a cell for details)")}</div>
    <div id="lo-grid"></div>
    <div id="lo-stock" class="demo-meta"></div>
    <div id="lo-detail"></div>
    <div id="lo-chart"></div>
    <div class="demo-math" id="lo-f"></div>
    <p class="demo-tip">${T("试试：目标 110、60 天——110 行权价的 60 天看涨是 −100%，因为“刚好到目标”对它来说等于没到；把天数改成 30，同一格变成最赚钱的一格。再把到达天数拉到 150，看短期期权怎样在观点兑现之前就过期。", "Try this: target 110 in 60 days — the 60-day 110 call returns −100%, because landing exactly on the target is worth nothing to it; change the days to 30 and the same cell becomes the best one. Then push the days to 150 and watch short-dated options expire before the view comes true.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const strikes = () => (dir === "bull" ? [90, 100, 110] : [110, 100, 90]);
  const type = () => (dir === "bull" ? "call" : "put");
  const name = (i) => [T("实值", "ITM"), T("平值", "ATM"), T("虚值", "OTM")][i];
  let v = {};
  // value of one option (per share) on the evaluation day for a given view
  function outcome(K, days, tgt, dayT, sigma) {
    const o = { S: S0, K, T: days / 365, r, sigma, type: type() };
    const cost = O.bsPrice(o);
    const evalDay = Math.min(days, dayT);
    const Sat = S0 + (tgt - S0) * (evalDay / dayT);
    const val = O.bsPrice({ ...o, S: Sat, T: (days - evalDay) / 365 });
    return { cost, val, Sat, evalDay, ret: val / cost - 1, expiredEarly: days < dayT };
  }
  const pctTxt = (x) => (x >= 0 ? "+" : "−") + Math.abs(x * 100).toFixed(0) + "%";
  function draw() {
    const tgt = v["lo-tgt"], dayT = v["lo-day"], sigma = v["lo-iv"] / 100;
    const ks = strikes();
    let best = { ret: -Infinity };
    const cells = ks.map((K, i) => EXP.map((d, j) => { const x = outcome(K, d, tgt, dayT, sigma); if (x.ret > best.ret) best = { ...x, i, j }; return x; }));
    let h = `<table style="white-space:nowrap"><tr><th>${T("行权价 \\ 到期", "Strike \\ expiry")}</th>${EXP.map((d) => `<th>${d}${T(" 天", " d")}</th>`).join("")}</tr>`;
    ks.forEach((K, i) => {
      h += `<tr${i === pick.k ? ' class="hl"' : ""}><td>${name(i)} ${K}</td>` + EXP.map((d, j) => {
        const x = cells[i][j];
        const col = x.ret >= 0 ? "var(--green)" : "var(--red)";
        const on = i === pick.k && j === pick.e;
        return `<td><button type="button" class="demo-btn${on ? " on" : ""}" data-cell="${i},${j}" style="min-height:30px;padding:4px 8px;${on ? "" : `color:${col}`}">${pctTxt(x.ret)}${x.expiredEarly ? "*" : ""}</button></td>`;
      }).join("") + `</tr>`;
    });
    h += `</table><div class="demo-meta">${T("* 这张期权在目标日之前就到期了：按它到期那天（沿直线走到的）股价结算。", "* this option expires before the target date: it is settled at the price reached (on a straight-line path) on its own expiry day.")} ${T("最好的一格", "Best cell")}: ${name(best.i)} ${ks[best.i]} · ${EXP[best.j]}${T(" 天", " d")} (${pctTxt(best.ret)})</div>`;
    $("#lo-grid").innerHTML = h;
    root.querySelectorAll("[data-cell]").forEach((b) => b.addEventListener("click", () => { const [i, j] = b.dataset.cell.split(",").map(Number); pick = { k: i, e: j }; draw(); }));
    const stockRet = (tgt - S0) / S0 * (dir === "bull" ? 1 : -1);
    $("#lo-stock").innerHTML = T(`对照：${dir === "bull" ? "买入" : "卖空"} 100 股 XYZ（本金约 10,000 美元）在同样的观点下回报 ${pctTxt(stockRet)}。`, `For comparison: ${dir === "bull" ? "buying" : "shorting"} 100 XYZ shares (about $10,000 of capital) under the same view returns ${pctTxt(stockRet)}.`);
    // detail of the picked cell
    const K = ks[pick.k], days = EXP[pick.e], x = cells[pick.k][pick.e];
    const o = { S: S0, K, T: days / 365, r, sigma, type: type() };
    const G = O.greeks(o), omega = G.delta * S0 / G.price;
    const be = type() === "call" ? K + G.price : K - G.price;
    $("#lo-detail").innerHTML = stats([
      [T("成本（1 张）", "Cost (1 contract)"), "$" + (G.price * 100).toFixed(0)],
      [T("到达目标时价值", "Value at the target"), "$" + (x.val * 100).toFixed(0), x.val >= x.cost ? "pos" : "neg"],
      ["Δ", (G.delta < 0 ? "−" : "") + Math.abs(G.delta).toFixed(3)],
      [T("Θ（每天，1 张）", "Θ per day (1 contract)"), "−$" + Math.abs(G.theta * 100).toFixed(2), "neg"],
      [T("ν（每 1 个波动率点）", "ν per vol point"), "$" + (G.vega * 100).toFixed(2)],
      [T("到期盈亏平衡", "Breakeven at expiry"), "$" + be.toFixed(2), "acc"],
    ]);
    const legs = [{ type: type(), side: "long", K, premium: G.price, T: days / 365 }];
    const el = Math.min(dayT, days) / 365;
    const pc = payoffChart({ legs, lo: 70, hi: 130, spot: x.Sat, mult: 100, today: x.expiredEarly ? null : { elapsed: el, sigma, r },
      xlabel: T("XYZ 价格", "XYZ price"), ylabel: T("盈亏（1 张，美元）", "P&L per contract ($)"),
      labels: { expiry: T("到期时", "At expiry"), today: T(`第 ${Math.min(dayT, days)} 天（目标日）`, `Day ${Math.min(dayT, days)} (target date)`), spot: T("到达价", "reached"), be: T("平衡", "BE") } });
    $("#lo-chart").innerHTML = pc.html;
    $("#lo-f").innerHTML = tex(String.raw`\begin{gathered}\text{${T("回报", "return")}} = \frac{${x.val.toFixed(2)} - ${x.cost.toFixed(2)}}{${x.cost.toFixed(2)}} = ${(x.ret * 100).toFixed(0)}\% \\ \Omega = \Delta\frac{S}{V} = ${G.delta.toFixed(3)} \times \frac{100}{${G.price.toFixed(2)}} = ${omega.toFixed(1)}\end{gathered}`, true);
  }
  const run = bindSliders(root, { "lo-tgt": (x) => "$" + x, "lo-day": (x) => x + T(" 天", " days"), "lo-iv": (x) => x + "%" }, (vals) => { v = vals; draw(); });
  onSeg(root, "lo-dir", (d) => { dir = d; $("#lo-tgt").value = d === "bull" ? 110 : 90; run(); });
}
