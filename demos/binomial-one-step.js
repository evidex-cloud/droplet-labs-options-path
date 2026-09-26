// Main demo for lesson binomial-one-step: a one-step world with sliders for u, d, r, K and the REAL up-probability p.
// The replication price ignores p; a "naive" expected-payoff price does not. A dealer quote shows the arbitrage trade.
import * as O from "./_opt.js";
import { seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let type = "call";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("一步二叉树：复制出来的价格", "One-step tree: the price you can copy")}</div>
    <div class="demo-row">${seg("bos-type", [["call", T("看涨", "Call")], ["put", T("看跌", "Put")]], type)}
      <div class="demo-btns" style="margin:0"><button class="demo-btn" data-preset="base">${T("小凯的 120/80 世界", "Kai's 120/80 world")}</button><button class="demo-btn" data-preset="wide">${T("更动荡：130/70", "More volatile: 130/70")}</button></div></div>
    <div class="demo-grid">
      ${slider("bos-u", T("上涨倍数 u", "Up factor u"), 1.02, 1.6, 0.01, 1.2)}
      ${slider("bos-d", T("下跌倍数 d", "Down factor d"), 0.5, 0.98, 0.01, 0.8)}
      ${slider("bos-r", T("利率 r（1 年）", "Rate r (1 year)"), 0, 10, 0.25, 4)}
      ${slider("bos-k", T("行权价 K", "Strike K"), 60, 140, 1, 100)}
      ${slider("bos-p", T("真实上涨概率 p", "Real up-probability p"), 1, 99, 1, 50)}
      ${slider("bos-quote", T("交易商报价", "Dealer's quote"), 0, 40, 0.05, 13.45)}
    </div>
    <div id="bos-tree"></div>
    <div class="demo-math" id="bos-f"></div>
    <div id="bos-stats"></div>
    <div id="bos-arb"></div>
    <p class="demo-tip">${T("试试：把真实概率 p 从 1% 拉到 99%，复制价格一动不动，只有“天真价格”跟着跑；再把 u、d 拉开，价格才真正变贵。报价偏离复制价格时，上面的方框会给出锁定利润的那笔交易。", "Try this: drag the real probability p from 1% to 99%. The replication price never moves; only the naive price does. Now spread u and d apart and the price really rises. When the quote differs from the copy's cost, the box above spells out the trade that locks in the gap.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const S = 100, Tm = 1;
  const money = (x) => (x < 0 ? "−$" : "$") + Math.abs(x).toFixed(2);

  function tree(o, K) {
    const node = (x, y, cls, l1, l2) => `<rect x="${x - 68}" y="${y - 28}" width="136" height="56" rx="8" class="${cls}"/><text x="${x}" y="${y - 6}" text-anchor="middle" class="fx-t-b">${l1}</text><text x="${x}" y="${y + 16}" text-anchor="middle" class="fx-t">${l2}</text>`;
    const nm = type === "call" ? T("看涨", "call") : T("看跌", "put");
    // compact 390-wide tree so its labels stay readable on a phone
    return `<div class="chart" style="max-width:460px;margin:10px auto 0"><svg viewBox="0 0 390 210" role="img" aria-label="${T("一步二叉树", "One-step tree")}">
      <line x1="142" y1="97" x2="230" y2="52" class="fx-line"/><line x1="142" y1="113" x2="230" y2="158" class="fx-line"/>
      ${node(72, 105, "fx-box", "S = 100", `${nm} = ${o.price.toFixed(2)}`)}
      ${node(300, 42, "fx-ok", `S = ${o.Su.toFixed(2)}`, `${nm} ${T("付", "pays")} ${o.Vu.toFixed(2)}`)}
      ${node(300, 168, "fx-bad", `S = ${o.Sd.toFixed(2)}`, `${nm} ${T("付", "pays")} ${o.Vd.toFixed(2)}`)}
      <text x="200" y="109" text-anchor="middle" class="fx-t-sm">${T("1 年", "1 year")}</text>
      <text x="176" y="64" text-anchor="middle" class="fx-t-sm">q = ${o.q.toFixed(3)}</text>
      <text x="176" y="156" text-anchor="middle" class="fx-t-sm">1 − q = ${(1 - o.q).toFixed(3)}</text>
      <text x="72" y="152" text-anchor="middle" class="fx-t-sm">K = ${K}</text>
    </svg></div>`;
  }

  const draw = (v) => {
    const u = v["bos-u"], d = v["bos-d"], r = v["bos-r"] / 100, K = v["bos-k"], p = v["bos-p"] / 100, quote = v["bos-quote"];
    const g = Math.exp(r * Tm);
    if (!(d < g && g < u)) {
      $("#bos-tree").innerHTML = "";
      $("#bos-f").innerHTML = tex(String.raw`d = ${d.toFixed(2)},\quad e^{rT} = ${g.toFixed(4)},\quad u = ${u.toFixed(2)}`, true);
      $("#bos-stats").innerHTML = "";
      $("#bos-arb").innerHTML = `<div class="demo-warn">${T("这里 " + tex(String.raw`e^{rT}`) + " 不在 d 和 u 之间：银行存款在两种状态下都跑赢（或都跑输）股票，股票本身就有套利。q 不再是 0 到 1 之间的数，模型失效。把 u 调高或把 d 调低。", "Here the bank account beats (or loses to) the stock in both states, so the stock itself is an arbitrage. q is no longer between 0 and 1 and the model breaks. Raise u or lower d.")}</div>`;
      return;
    }
    const o = O.oneStep({ S, K, u, d, r, T: Tm, type });
    const naive = Math.exp(-r * Tm) * (p * o.Vu + (1 - p) * o.Vd);
    const expStock = p * o.Su + (1 - p) * o.Sd;
    $("#bos-tree").innerHTML = tree(o, K);
    $("#bos-f").innerHTML =
      tex(String.raw`\Delta = \frac{V_u - V_d}{uS - dS} = \frac{${o.Vu.toFixed(2)} - ${o.Vd.toFixed(2)}}{${o.Su.toFixed(2)} - ${o.Sd.toFixed(2)}} = ${o.delta.toFixed(3)},\qquad B = e^{-rT}(V_u - \Delta\,uS) = ${o.bond.toFixed(2)}`, true) +
      tex(String.raw`V_0 = \Delta S + B = ${(o.delta * S).toFixed(2)} ${o.bond < 0 ? "-" : "+"} ${Math.abs(o.bond).toFixed(2)} = ${o.price.toFixed(2)}`, true) +
      tex(String.raw`V_0 = e^{-rT}\big[q\,V_u + (1-q)\,V_d\big],\qquad q = \frac{e^{rT} - d}{u - d} = ${o.q.toFixed(3)}`, true);
    $("#bos-stats").innerHTML = stats([
      [T("复制价格（公平价）", "Replication price (fair)"), money(o.price), "acc"],
      [T("对冲比率 Δ", "Hedge ratio Δ"), o.delta.toFixed(3)],
      [T("现金 B（负 = 借款）", "Cash B (negative = loan)"), money(o.bond)],
      [T("风险中性权重 q", "Risk-neutral weight q"), o.q.toFixed(3)],
      [T("天真价格：按 p 求期望再贴现", "Naive price: p-weighted, discounted"), money(naive), Math.abs(naive - o.price) < 0.005 ? "pos" : "neg"],
      [T("按 p 算的股票平均终值", "Stock's average end value under p"), money(expStock)],
    ]);
    const gap = quote - o.price;
    const sh = Math.abs(o.delta).toFixed(3), cash = Math.abs(o.bond).toFixed(2);
    let msg;
    if (Math.abs(gap) < 0.005) msg = `<div class="demo-log ok">${T("报价等于复制成本：没有免费午餐。", "The quote equals the copy's cost: no free lunch.")}</div>`;
    else if (gap > 0) {
      const copy = (o.delta >= 0 ? T(`买入 ${sh} 股`, `buy ${sh} shares`) : T(`卖空 ${sh} 股`, `short ${sh} shares`)) + T("，", ", ") + (o.bond <= 0 ? T(`借入 $${cash}`, `borrow $${cash}`) : T(`借出 $${cash}`, `lend $${cash}`));
      msg = `<div class="demo-log bad"><div>${T("报价偏贵。", "The quote is too rich.")} ${T("卖出期权收 ", "Sell the option for ")}${money(quote)}${T("，同时搭复制品：", ", and build the copy: ")}${copy}${T("（净成本 ", " (net cost ")}${money(o.price)}${T("）。今天锁定 ", "). Locked in today: ")}<b>${money(gap)}</b>${T("，一年后复制品正好付清你欠的钱。", "; in a year the copy pays exactly what you owe.")}</div></div>`;
    } else {
      const rev = (o.delta >= 0 ? T(`卖空 ${sh} 股`, `short ${sh} shares`) : T(`买入 ${sh} 股`, `buy ${sh} shares`)) + T("，", ", ") + (o.bond <= 0 ? T(`借出 $${cash}`, `lend $${cash}`) : T(`借入 $${cash}`, `borrow $${cash}`));
      msg = `<div class="demo-log bad"><div>${T("报价偏便宜。", "The quote is too cheap.")} ${T("以 ", "Buy the option at ")}${money(quote)}${T(" 买入期权，同时反向做复制品：", " and do the copy in reverse: ")}${rev}${T("。今天锁定 ", ". Locked in today: ")}<b>${money(-gap)}</b>${T("。", ".")}</div></div>`;
    }
    $("#bos-arb").innerHTML = msg;
  };
  const spec = { "bos-u": (x) => x.toFixed(2), "bos-d": (x) => x.toFixed(2), "bos-r": (x) => x + "%", "bos-k": (x) => "$" + x, "bos-p": (x) => x + "%", "bos-quote": (x) => "$" + x.toFixed(2) };
  const run = bindSliders(root, spec, draw);
  onSeg(root, "bos-type", (v) => { type = v; run(); });
  const set = (vals) => { for (const [id, x] of Object.entries(vals)) $("#" + id).value = x; run(); };
  root.querySelectorAll("[data-preset]").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.preset === "wide") set({ "bos-u": 1.3, "bos-d": 0.7, "bos-r": 4, "bos-k": 100 });
    else set({ "bos-u": 1.2, "bos-d": 0.8, "bos-r": 4, "bos-k": 100, "bos-p": 50, "bos-quote": 13.45 });
  }));
}
