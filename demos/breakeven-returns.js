// Main demo for lesson breakeven-returns: a breakeven / max P&L / return calculator for seven common structures.
// Premiums come from Black-Scholes on the course's XYZ (S = 100, r = 4%); strikes, days and IV are adjustable.
import * as O from "./_opt.js";
import { payoffChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100, r = O.XYZ.r;
  const KINDS = [
    ["lc", T("买入看涨", "Long call")], ["lp", T("买入看跌", "Long put")], ["cc", T("备兑看涨", "Covered call")],
    ["csp", T("现金担保看跌", "Cash-secured put")], ["bcs", T("牛市看涨价差", "Bull call spread")],
    ["bps", T("牛市看跌价差（收权利金）", "Bull put spread (credit)")], ["sd", T("买入跨式", "Long straddle")],
  ];
  let kind = "bcs";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("盈亏平衡与收益率计算器", "Breakeven and return calculator")}</div>
    <div class="demo-row">${seg("brc-kind", KINDS, kind)}</div>
    <div class="demo-grid">
      ${slider("brc-k", T("行权价 K（价差为较低的 K₁）", "Strike K (lower strike K₁ for spreads)"), 85, 115, 1, 100)}
      ${slider("brc-w", T("价差宽度 K₂ − K₁", "Spread width K₂ − K₁"), 1, 15, 1, 5)}
      ${slider("brc-d", T("到期天数", "Days to expiry"), 7, 120, 1, 30)}
      ${slider("brc-v", T("隐含波动率 σ", "Implied volatility σ"), 10, 60, 1, 20)}
      ${slider("brc-n", T("合约张数", "Contracts"), 1, 10, 1, 1)}
    </div>
    <div class="demo-meta" id="brc-legs"></div>
    <div class="demo-math" id="brc-f"></div>
    <div id="brc-stats"></div>
    <div id="brc-chart"></div>
    <p class="demo-tip">${T("试试：默认是 100/105 牛市看涨价差。把宽度从 5 拉到 10——最大盈利变大，盈亏平衡点也往上走。再选备兑看涨，看年化收益率在“平盘”和“被行权”两种结局之间差多少，想想它假设了什么。", "Try this: the default is the 100/105 bull call spread. Widen it from 5 to 10: the max profit grows, and so does the breakeven. Then pick the covered call and compare the annualized figures for the flat and called-away outcomes, and ask what each one assumes.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const money = (x, n) => (!isFinite(x) ? T("无上限", "unlimited") : (x < 0 ? "−$" : "$") + Math.abs(x * 100 * n).toLocaleString("en-US", { maximumFractionDigits: 0 }));
  const pct = (x) => (!isFinite(x) ? "—" : (x < 0 ? "−" : "") + Math.abs(x * 100).toFixed(1) + "%");
  const pctR = (x, st) => (!isFinite(st.maxProfit) ? T("无上限", "unlimited") : kind === "cc" || kind === "csp" ? T("不适用（见下一格）", "n/a (see next tile)") : pct(x));

  const draw = (v) => {
    const K = v["brc-k"], W = v["brc-w"], d = v["brc-d"], n = v["brc-n"], sigma = v["brc-v"] / 100, Tm = d / 365;
    const px = (k, type) => Math.round(O.bsPrice({ S: S0, K: k, T: Tm, r, sigma, type }) * 100) / 100;
    const K2 = K + W, c = px(K, "call"), p = px(K, "put"), c2 = px(K2, "call"), pl = px(K - W, "put");
    const stock = { type: "stock", side: "long", entry: S0 };
    let legs, capital, f, income = false, desc;
    switch (kind) {
      case "lc": legs = [{ type: "call", side: "long", K, premium: c }]; capital = c;
        f = String.raw`\text{BE} = K + c = ${K} + ${c.toFixed(2)} = ${(K + c).toFixed(2)}`; desc = T(`买入 ${K} 看涨 @ ${c.toFixed(2)}`, `buy ${K} call @ ${c.toFixed(2)}`); break;
      case "lp": legs = [{ type: "put", side: "long", K, premium: p }]; capital = p;
        f = String.raw`\text{BE} = K - p = ${K} - ${p.toFixed(2)} = ${(K - p).toFixed(2)}`; desc = T(`买入 ${K} 看跌 @ ${p.toFixed(2)}`, `buy ${K} put @ ${p.toFixed(2)}`); break;
      case "cc": legs = [stock, { type: "call", side: "short", K, premium: c }]; capital = S0; income = true;
        f = String.raw`\text{BE} = S_0 - c = 100 - ${c.toFixed(2)} = ${(S0 - c).toFixed(2)},\quad \text{max} = (K - S_0) + c = ${(K - S0 + c).toFixed(2)}`;
        desc = T(`持有 100 股（成本 100）+ 卖出 ${K} 看涨 @ ${c.toFixed(2)}`, `own 100 shares (cost 100) + sell ${K} call @ ${c.toFixed(2)}`); break;
      case "csp": legs = [{ type: "put", side: "short", K, premium: p }]; capital = K; income = true;
        f = String.raw`\text{BE} = K - p = ${K} - ${p.toFixed(2)} = ${(K - p).toFixed(2)},\quad \text{capital} = K = ${K}`;
        desc = T(`卖出 ${K} 看跌 @ ${p.toFixed(2)}，预留现金 ${K * 100} 美元/张`, `sell ${K} put @ ${p.toFixed(2)}, keep $${K * 100} cash per contract`); break;
      case "bcs": { const D = c - c2; legs = [{ type: "call", side: "long", K, premium: c }, { type: "call", side: "short", K: K2, premium: c2 }]; capital = D;
        f = String.raw`D = ${c.toFixed(2)} - ${c2.toFixed(2)} = ${D.toFixed(2)},\quad \text{max} = ${W} - ${D.toFixed(2)} = ${(W - D).toFixed(2)},\quad \text{BE} = K_1 + D = ${(K + D).toFixed(2)}`;
        desc = T(`买入 ${K} 看涨 @ ${c.toFixed(2)}，卖出 ${K2} 看涨 @ ${c2.toFixed(2)}`, `buy ${K} call @ ${c.toFixed(2)}, sell ${K2} call @ ${c2.toFixed(2)}`); break; }
      case "bps": { const Kl = K - W, cr = p - pl; legs = [{ type: "put", side: "short", K, premium: p }, { type: "put", side: "long", K: Kl, premium: pl }]; capital = W - cr; income = true;
        f = String.raw`\text{credit} = ${p.toFixed(2)} - ${pl.toFixed(2)} = ${cr.toFixed(2)},\quad \text{max loss} = ${W} - ${cr.toFixed(2)} = ${(W - cr).toFixed(2)},\quad \text{BE} = ${K} - ${cr.toFixed(2)} = ${(K - cr).toFixed(2)}`;
        desc = T(`卖出 ${K} 看跌 @ ${p.toFixed(2)}，买入 ${Kl} 看跌 @ ${pl.toFixed(2)}（这里 K 是较高的行权价）`, `sell ${K} put @ ${p.toFixed(2)}, buy ${Kl} put @ ${pl.toFixed(2)} (here K is the upper strike)`); break; }
      default: { const D = c + p; legs = [{ type: "call", side: "long", K, premium: c }, { type: "put", side: "long", K, premium: p }]; capital = D;
        f = String.raw`\text{BE} = K \pm (c + p) = ${K} \pm ${D.toFixed(2)} \;\Rightarrow\; ${(K - D).toFixed(2)},\ ${(K + D).toFixed(2)}`;
        desc = T(`买入 ${K} 看涨 @ ${c.toFixed(2)} + 买入 ${K} 看跌 @ ${p.toFixed(2)}`, `buy ${K} call @ ${c.toFixed(2)} + buy ${K} put @ ${p.toFixed(2)}`); }
    }
    const st = O.payoffStats(legs, 0, 400);
    const wf = $("#brc-w").closest(".demo-field"); if (wf) wf.style.opacity = kind === "bcs" || kind === "bps" ? "1" : "0.4";
    const ror = isFinite(st.maxProfit) && st.maxLoss < 0 && kind !== "cc" && kind !== "csp" ? st.maxProfit / -st.maxLoss : NaN;
    const roc = isFinite(st.maxProfit) ? st.maxProfit / capital : NaN;
    const flatPL = O.netPL(legs, S0), flatR = flatPL / capital;
    const ann = (R) => (R > -1 ? Math.pow(1 + R, 365 / d) - 1 : -1);
    $("#brc-legs").textContent = T("腿：", "Legs: ") + desc + T(`（${d} 天，σ ${v["brc-v"]}%，r 4%）`, ` (${d} days, σ ${v["brc-v"]}%, r 4%)`);
    $("#brc-f").innerHTML = tex(f, true);
    const items = [
      [T("盈亏平衡点", "Breakeven(s)"), st.breakevens.length ? st.breakevens.map((b) => b.toFixed(2)).join(" / ") : "—", "acc"],
      [T("最大盈利", "Max profit"), money(st.maxProfit, n), "pos"],
      [T("最大亏损", "Max loss"), money(st.maxLoss, n), "neg"],
      [T("风险收益比 最大盈利÷最大亏损", "Return on risk (max profit ÷ max loss)"), pctR(ror, st)],
      [T("资本收益率（最好情形）", "Return on capital (best case)"), isFinite(st.maxProfit) ? pct(roc) : T("无上限", "unlimited")],
      [T("XYZ 不动时的收益率", "Return if XYZ is unchanged"), pct(flatR), flatR >= 0 ? "pos" : "neg"],
    ];
    if (income) items.push([T("年化：不动时 / 最好情形", "Annualized: unchanged / best"), `${pct(ann(flatR))} / ${pct(ann(roc))}`]);
    $("#brc-stats").innerHTML = stats(items) + `<div class="demo-meta">${T("资本口径：", "Capital used: ")}${
      kind === "cc" ? T("股票成本 100/股", "the share cost, 100 per share") : kind === "csp" ? T("预留的现金 K/股", "the cash set aside, K per share") : kind === "bps" ? T("最大亏损（宽度 − 权利金收入）", "the max loss (width − credit)") : T("付出的权利金", "the premium paid")
    }${income ? T("。年化假设每一期都重复同样结局，见上面的内联演示。", ". Annualizing assumes every period repeats the same outcome; see the inline demo above.") : "."}</div>`;
    const lo = Math.max(1, Math.min(K - W, S0) - 20), hi = Math.max(K2, S0) + 20;
    $("#brc-chart").innerHTML = payoffChart({
      legs, lo, hi, spot: S0, mult: 100 * n,
      xlabel: T("到期时的 XYZ 价格", "XYZ price at expiry"), ylabel: T("盈亏（美元）", "P&L ($)"),
      labels: { expiry: T("到期盈亏", "P&L at expiry"), spot: T("今天 100", "today 100"), be: T("平衡", "BE") },
    }).html;
  };
  const run = bindSliders(root, { "brc-k": (x) => "$" + x, "brc-w": (x) => "$" + x, "brc-d": (x) => x + T(" 天", " days"), "brc-v": (x) => x + "%", "brc-n": (x) => String(x) }, draw);
  const DEFAULT_K = { lc: 100, lp: 100, cc: 105, csp: 95, bcs: 100, bps: 100, sd: 100 };
  onSeg(root, "brc-kind", (k) => { kind = k; $("#brc-k").value = DEFAULT_K[k]; run(); });
}
