// Main demo for lesson margin-approval: what six XYZ positions tie up under the standard (strategy-based) rules,
// compared with a portfolio-margin style stress test (revalue at −15% … +15%, requirement ≈ worst loss). Illustrative only.
import * as O from "./_opt.js";
import { seg, onSeg, slider, bindSliders, stats, tex, barChart } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const r = 0.04;
  let strat = "naked-put";
  const names = [
    ["naked-put", T("裸卖看跌", "Naked put")], ["csp", T("现金担保看跌", "Cash-secured put")], ["put-spread", T("看跌贷方价差", "Put credit spread")],
    ["naked-call", T("裸卖看涨", "Naked call")], ["covered-call", T("备兑看涨", "Covered call")], ["long-put", T("买入看跌", "Long put")],
  ];
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("保证金计算器：标准规则 vs 组合保证金压力测试", "Margin calculator: standard rules vs a portfolio-margin stress test")}</div>
    <div class="demo-row">${seg("mg-s", names, strat)}</div>
    <div class="demo-grid">
      ${slider("mg-S", T("XYZ 价格 S", "XYZ price S"), 80, 120, 0.5, 100)}
      ${slider("mg-k", T("（卖出的）行权价 K", "Strike K (of the sold option)"), 85, 115, 2.5, 95)}
      ${slider("mg-w", T("价差宽度", "Spread width"), 2.5, 10, 2.5, 5)}
      ${slider("mg-d", T("剩余天数", "Days left"), 1, 60, 1, 30)}
      ${slider("mg-v", T("隐含波动率", "Implied volatility"), 10, 60, 1, 20)}
      ${slider("mg-n", T("合约张数", "Contracts"), 1, 10, 1, 1)}
    </div>
    <div class="demo-math" id="mg-f"></div>
    <div id="mg-stats"></div>
    <div class="demo-label" style="margin-top:10px">${T("压力测试：XYZ 从 −15% 到 +15% 时的盈亏（每组合）", "Stress test: P&L if XYZ moves −15% … +15% (whole position)")}</div>
    <div id="mg-bars"></div>
    <p class="demo-tip">${T("试试：选“裸卖看跌”，把 XYZ 从 100 拉到 90，看标准要求怎样从约 1,551 美元涨到两千多；再换成“看跌贷方价差”，要求固定在宽度 × 100。组合保证金这里只是示意（同一波动率、个股 ±15%），真实系统用清算机构的模型。你的券商可能要求更多。",
      "Try this: pick “Naked put” and drag XYZ from 100 to 90 — the standard requirement climbs from about $1,551 to over $2,000; switch to “Put credit spread” and it stays at width × 100. The portfolio-margin figure is illustrative (same volatility, ±15% for a single stock); real systems use the clearing house's model. Your broker may require more.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const usd = (x) => "$" + Math.round(x).toLocaleString("en-US");
  const texUsd = (x) => Math.round(x).toLocaleString("en-US").replace(/,/g, "{,}");
  const draw = (v) => {
    const S = v["mg-S"], K = v["mg-k"], w = v["mg-w"], Tm = v["mg-d"] / 365, sigma = v["mg-v"] / 100, n = v["mg-n"];
    const P = (type, k, s = S) => O.bsPrice({ S: s, K: k, T: Tm, r, sigma, type });
    const legs = []; // for stress test: {type, K, side}
    let req = 0, f = "", maxLoss = 0, premium = 0;
    if (strat === "naked-put") {
      const V = P("put", K), otm = Math.max(S - K, 0), a = 0.2 * S - otm, b = 0.1 * K;
      req = 100 * n * (V + Math.max(a, b)); premium = V * 100 * n; maxLoss = (K - V) * 100 * n;
      f = String.raw`100 \times ${n} \times \big[\,${V.toFixed(2)} + \max(0.20 \times ${S.toFixed(1)} - ${otm.toFixed(2)},\ 0.10 \times ${K})\big] = \$${texUsd(req)}`;
      legs.push({ type: "put", K, side: -1 });
    } else if (strat === "naked-call") {
      const V = P("call", K), otm = Math.max(K - S, 0), a = 0.2 * S - otm, b = 0.1 * S;
      req = 100 * n * (V + Math.max(a, b)); premium = V * 100 * n; maxLoss = Infinity;
      f = String.raw`100 \times ${n} \times \big[\,${V.toFixed(2)} + \max(0.20 \times ${S.toFixed(1)} - ${otm.toFixed(2)},\ 0.10 \times ${S.toFixed(1)})\big] = \$${texUsd(req)}`;
      legs.push({ type: "call", K, side: -1 });
    } else if (strat === "csp") {
      const V = P("put", K); req = K * 100 * n; premium = V * 100 * n; maxLoss = (K - V) * 100 * n;
      f = String.raw`K \times 100 \times n = ${K} \times 100 \times ${n} = \$${texUsd(req)} \quad (\text{${T("扣权利金后", "net of premium")}}\ \$${(req - premium).toFixed(0)})`;
      legs.push({ type: "put", K, side: -1 });
    } else if (strat === "put-spread") {
      const V1 = P("put", K), V2 = P("put", K - w), cr = V1 - V2;
      req = w * 100 * n; premium = cr * 100 * n; maxLoss = (w - cr) * 100 * n;
      f = String.raw`(K_2 - K_1) \times 100 \times n = (${K} - ${K - w}) \times 100 \times ${n} = \$${texUsd(req)}, \quad \text{${T("最大亏损", "max loss")}} = (${w} - ${cr.toFixed(2)}) \times 100 \times ${n} = \$${maxLoss.toFixed(0)}`;
      legs.push({ type: "put", K, side: -1 }, { type: "put", K: K - w, side: 1 });
    } else if (strat === "covered-call") {
      const V = P("call", K); req = 0; premium = V * 100 * n; maxLoss = (S - V) * 100 * n;
      f = String.raw`\text{${T("额外保证金", "extra margin")}} = 0 \quad (\text{${T("持有的", "covered by")}}\ ${100 * n}\ \text{${T("股负责交付", "shares you own")}})`;
      legs.push({ type: "stock", side: 1 }, { type: "call", K, side: -1 });
    } else {
      const V = P("put", K); req = V * 100 * n; premium = -V * 100 * n; maxLoss = V * 100 * n;
      f = String.raw`\text{${T("全额付款", "paid in full")}} = ${V.toFixed(2)} \times 100 \times ${n} = \$${texUsd(req)}`;
      legs.push({ type: "put", K, side: 1 });
    }
    const value = (s) => legs.reduce((a, l) => a + l.side * (l.type === "stock" ? s : P(l.type, l.K, s)), 0) * 100 * n;
    const v0 = value(S), grid = [-0.15, -0.12, -0.09, -0.06, -0.03, 0, 0.03, 0.06, 0.09, 0.12, 0.15];
    const pls = grid.map((m) => value(S * (1 + m)) - v0), worst = Math.max(0, -Math.min(...pls));
    const iw = pls.indexOf(Math.min(...pls));
    $("#mg-f").innerHTML = tex(f, true);
    $("#mg-stats").innerHTML = stats([
      [T("标准规则要求", "Standard requirement"), usd(req), "acc"],
      [T("组合保证金（压力测试，示意）", "Portfolio margin (stress test, illustrative)"), usd(worst)],
      [premium >= 0 ? T("收到的权利金", "Premium received") : T("付出的权利金", "Premium paid"), usd(Math.abs(premium)), premium >= 0 ? "pos" : "neg"],
      [T("到期最大亏损", "Maximum loss at expiry"), isFinite(maxLoss) ? usd(maxLoss) : T("无限", "unlimited"), "neg"],
    ]);
    $("#mg-bars").innerHTML = barChart({ bars: grid.map((m, i) => ({ label: (m > 0 ? "+" : "") + Math.round(m * 100) + "%", value: pls[i], cls: i === iw && pls[i] < 0 ? 2 : pls[i] >= 0 ? 3 : 1 })), yfmt: (x) => (x < 0 ? "−$" : "$") + Math.abs(Math.round(x)).toLocaleString("en-US"), H: 200 });
  };
  const run = bindSliders(root, { "mg-S": (x) => "$" + (+x).toFixed(1), "mg-k": (x) => String(x), "mg-w": (x) => String(x), "mg-d": (x) => x + T(" 天", " days"), "mg-v": (x) => x + "%", "mg-n": (x) => String(x) }, draw);
  onSeg(root, "mg-s", (v) => { strat = v; run(); });
}
