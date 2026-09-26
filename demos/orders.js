// Main demo for lesson orders: an order-ticket simulator against a small simulated order book for the XYZ 30-day
// 100 call. Market orders walk the book; limit orders rest and may fill as the quote moves (a simple, labelled model).
import * as O from "./_opt.js";
import { seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const K = 100, r = 0.04, sigma = 0.2, days0 = 30;
  let side = "buy", otype = "limit", S = 100, minute = 0, pos = 0, cash = 0, resting = null;
  const R = O.rng(2026);
  const fills = [], log = [];
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("下单模拟器：XYZ 30 天 100 看涨", "Order-ticket simulator: XYZ 30-day 100 call")}</div>
    <div class="demo-row">${seg("or-side", [["buy", T("买入", "Buy")], ["sell", T("卖出", "Sell")]], side)}
      ${seg("or-type", [["limit", T("限价单", "Limit")], ["market", T("市价单", "Market")]], otype)}</div>
    <div class="demo-grid">
      ${slider("or-qty", T("数量（张）", "Quantity (contracts)"), 1, 80, 1, 10)}
      ${slider("or-px", T("限价（相对中间价）", "Limit price (vs mid)"), -0.10, 0.10, 0.01, 0)}
    </div>
    <div id="or-ticket" class="demo-out-sm"></div>
    <div class="demo-btns"><button type="button" class="demo-btn on" data-act="send">${T("发送订单", "Send order")}</button><button type="button" class="demo-btn" data-act="wait">${T("等 1 分钟", "Wait 1 minute")}</button><button type="button" class="demo-btn" data-act="cancel">${T("撤单", "Cancel")}</button><button type="button" class="demo-btn" data-act="reset">${T("重来", "Reset")}</button></div>
    <div id="or-book"></div>
    <div id="or-stats"></div>
    <div class="demo-math" id="or-f"></div>
    <div class="demo-log" id="or-log"></div>
    <p class="demo-tip">${T("试试：市价买 60 张，看订单怎样一档档“吃”掉卖单，滑点远大于 3 美分；再用限价单挂在中间价，点几次“等 1 分钟”。注意“操作”会根据你的持仓自动变成开仓或平仓。成交模型是简化的示意：流动性好的合约上，中间价的限价单常常在几分钟内成交，但不保证。",
      "Try this: market-buy 60 and watch the order walk up the offers, with slippage far above 3 cents; then rest a limit at the mid and press “Wait 1 minute” a few times. The action switches between open and close from your position. The fill model is a simple illustration: on liquid contracts mid-price limits often fill within minutes, but nothing guarantees it.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const theo = () => O.bsPrice({ S, K, T: (days0 - minute / 1440) / 365, r, sigma, type: "call" });
  const mid = () => Math.round(theo() * 100) / 100;
  // three levels each side around the rounded mid (sizes in contracts)
  const book = () => {
    const m = mid();
    return { asks: [[m + 0.03, 20], [m + 0.05, 20], [m + 0.08, 60]], bids: [[m - 0.03, 20], [m - 0.04, 20], [m - 0.06, 60]] };
  };
  const action = (sd) => (sd === "buy" ? (pos < 0 ? T("买入平仓", "Buy to close") : T("买入开仓", "Buy to open")) : pos > 0 ? T("卖出平仓", "Sell to close") : T("卖出开仓", "Sell to open"));
  const f2 = (x) => x.toFixed(2);
  const exec = (sd, qty, px) => { fills.push({ sd, qty, px }); pos += sd === "buy" ? qty : -qty; cash += (sd === "buy" ? -1 : 1) * px * 100 * qty; };
  let lastSlip = null;
  const walk = (sd, qty, limit) => {
    const b = book(), levels = sd === "buy" ? b.asks : b.bids, m0 = mid();
    let left = qty, cost = 0, got = 0;
    for (const [p, sz] of levels) {
      if (left <= 0) break;
      if (limit != null && (sd === "buy" ? p > limit + 1e-9 : p < limit - 1e-9)) break;
      const q = Math.min(left, sz); exec(sd, q, p); cost += p * q; got += q; left -= q;
    }
    if (got) { const avg = cost / got; lastSlip = { avg, m0, got, usd: (sd === "buy" ? avg - m0 : m0 - avg) * 100 * got }; log.push(["ok", T(`${action(sd)}：成交 ${got} 张，均价 ${avg.toFixed(3)}（发单时中间价 ${f2(m0)}）`, `${action(sd)}: filled ${got} at avg ${avg.toFixed(3)} (mid when sent ${f2(m0)})`)]); }
    return left;
  };
  const ticket = () => {
    const qty = +$("#or-qty").value, off = +$("#or-px").value, m = mid();
    const lp = Math.round((m + off) * 100) / 100;
    $("#or-ticket").innerHTML = `<b>${T("订单", "Ticket")}:</b> ${action(side)} · ${qty} × XYZ 30d 100C · ${otype === "market" ? T("市价单", "market") : T(`限价 ${f2(lp)}`, `limit ${f2(lp)}`)} · ${T("当日有效", "day")}`;
    return { qty, lp };
  };
  const render = () => {
    const b = book(), m = mid();
    const rows = [...b.asks].reverse().map(([p, s]) => `<tr><td>${T("卖", "Ask")}</td><td>${f2(p)}</td><td>${s}</td></tr>`).join("")
      + `<tr class="hl"><td>${T("中间价", "Mid")}</td><td>${f2(m)}</td><td>${T(`XYZ ${S.toFixed(2)}`, `XYZ ${S.toFixed(2)}`)}</td></tr>`
      + b.bids.map(([p, s]) => `<tr><td>${T("买", "Bid")}</td><td>${f2(p)}</td><td>${s}</td></tr>`).join("");
    $("#or-book").innerHTML = `<table><thead><tr><th>${T("订单簿", "Book")}</th><th>${T("价格", "Price")}</th><th>${T("张数", "Size")}</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="demo-meta">${T(`第 ${minute} 分钟 · 挂单中：`, `Minute ${minute} · resting: `)}${resting ? `${resting.sd === "buy" ? T("买", "buy") : T("卖", "sell")} ${resting.qty} @ ${f2(resting.lp)}` : T("无", "none")}</p>`;
    const mtm = pos * m * 100;
    $("#or-stats").innerHTML = stats([
      [T("持仓（张）", "Position (contracts)"), (pos > 0 ? "+" : "") + pos],
      [T("现金流", "Cash flow"), (cash >= 0 ? "+$" : "−$") + Math.abs(cash).toFixed(0), cash >= 0 ? "pos" : "neg"],
      [T("按中间价的盈亏", "P&L at mid"), ((cash + mtm) >= 0 ? "+$" : "−$") + Math.abs(cash + mtm).toFixed(0), cash + mtm >= 0 ? "pos" : "neg"],
    ]);
    $("#or-f").innerHTML = lastSlip ? tex(String.raw`\text{${T("滑点", "slippage")}} = (${lastSlip.avg.toFixed(3)} - ${f2(lastSlip.m0)}) \times 100 \times ${lastSlip.got} = ${lastSlip.usd >= 0 ? "" : "-"}\$${Math.abs(lastSlip.usd).toFixed(0)}`, true) : tex(String.raw`\text{${T("滑点", "slippage")}} = (P_{\text{fill}} - \text{mid}) \times 100 \times n`, true);
    $("#or-log").innerHTML = log.slice(-6).map(([c, t]) => `<span class="${c}">${t}</span>`).join("") || `<span>${T("还没有订单。", "No orders yet.")}</span>`;
    ticket();
  };
  const send = () => {
    const { qty, lp } = ticket();
    if (resting) { log.push(["warn", T("已有挂单：先撤单或等它成交。", "An order is already resting: cancel it or wait.")]); return render(); }
    if (otype === "market") { const left = walk(side, qty, null); if (left > 0) log.push(["warn", T(`订单簿只够 ${qty - left} 张`, `The book only had ${qty - left}`)]); }
    else {
      const left = walk(side, qty, lp);
      if (left > 0) { resting = { sd: side, qty: left, lp }; log.push(["", T(`限价 ${f2(lp)} 挂单 ${left} 张，等待成交。`, `Limit ${f2(lp)}: ${left} contracts resting.`)]); }
    }
    render();
  };
  const wait = () => {
    minute++;
    S = S + 0.06 * R.normal(); // about a typical one-minute move for a 20%-vol $100 stock during the session (illustrative)
    if (resting) {
      const b = book(), m = mid(), best = resting.sd === "buy" ? b.asks[0][0] : b.bids[0][0];
      const marketable = resting.sd === "buy" ? resting.lp >= best - 1e-9 : resting.lp <= best + 1e-9;
      const edge = resting.sd === "buy" ? resting.lp - m : m - resting.lp; // ≥ 0 means at or through the mid
      const pFill = marketable ? 1 : edge >= -1e-9 ? 0.4 : edge >= -0.02 ? 0.1 : 0;
      if (R() < pFill) {
        const px = marketable ? best : resting.lp;
        const m0 = m; exec(resting.sd, resting.qty, px);
        lastSlip = { avg: px, m0, got: resting.qty, usd: (resting.sd === "buy" ? px - m0 : m0 - px) * 100 * resting.qty };
        log.push(["ok", T(`第 ${minute} 分钟：挂单以 ${f2(px)} 成交 ${resting.qty} 张。`, `Minute ${minute}: resting order filled ${resting.qty} at ${f2(px)}.`)]);
        resting = null;
      } else log.push(["", T(`第 ${minute} 分钟：XYZ ${S.toFixed(2)}，挂单未成交。`, `Minute ${minute}: XYZ ${S.toFixed(2)}, still resting.`)]);
    } else log.push(["", T(`第 ${minute} 分钟：XYZ ${S.toFixed(2)}。`, `Minute ${minute}: XYZ ${S.toFixed(2)}.`)]);
    render();
  };
  root.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", () => {
    const a = b.dataset.act;
    if (a === "send") send();
    else if (a === "wait") wait();
    else if (a === "cancel") { if (resting) log.push(["warn", T("已撤单。", "Order canceled.")]); resting = null; render(); }
    else { S = 100; minute = 0; pos = 0; cash = 0; resting = null; fills.length = 0; log.length = 0; lastSlip = null; render(); }
  }));
  bindSliders(root, { "or-qty": (x) => String(x), "or-px": (x) => ((+x >= 0 ? "+" : "") + (+x).toFixed(2)) }, () => render());
  onSeg(root, "or-side", (v) => { side = v; render(); });
  onSeg(root, "or-type", (v) => { otype = v; render(); });
}
