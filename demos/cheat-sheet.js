// Main demo for lesson cheat-sheet: a searchable formula reference (every card typeset, with the XYZ example and a link
// to its lesson) plus five live mini-calculators that compute with the course engine.
import * as O from "./_opt.js";
import { seg, onSeg, slider, bindSliders, stats, tex, esc } from "./_viz.js";
import { COURSE } from "../content/manifest.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  // lesson lookup for link chips: id → "stage.index title"
  const LES = new Map();
  COURSE.stages.forEach((s) => s.lessons.forEach((l, i) => LES.set(l.id, { num: `${s.n}.${i + 1}`, title: en ? l.titleEn : l.title })));
  const link = (id) => { const h = LES.get(id); return h ? `<a class="xref" href="#lesson/${id}"><span class="xref-num">${h.num}</span>${esc(h.title)}</a>` : ""; };

  // [category, zh title, en title, formula, XYZ example, lesson id, extra search words]

  const cards = [
    ["pay", "看涨到期盈亏", "Long call P&L", String.raw`\Pi = \max(S_T - K, 0) - c`, String.raw`K = 100,\ c = 2.45:\ \text{BE} = 102.45`, "call-option", "call payoff breakeven 看涨"],
    ["pay", "看跌到期盈亏", "Long put P&L", String.raw`\Pi = \max(K - S_T, 0) - p`, String.raw`K = 95,\ p = 0.51:\ \text{BE} = 94.49`, "put-option", "put payoff 看跌"],
    ["pay", "积木相加", "Payoffs add", String.raw`\Pi(S_T) = \sum_i n_i\,\pi_i(S_T)`, String.raw`\text{collar at } 90:\ -10 + 0.71 + 4.49 = -4.80`, "payoff-lego", "lego sum 积木"],
    ["pay", "备兑看涨", "Covered call", String.raw`\Pi_{\max} = (K - S_0) + c,\quad \text{BE} = S_0 - c`, String.raw`105\text{ call}:\ 5.71,\ 99.29`, "covered-call", "income 收租"],
    ["pay", "保护性看跌地板", "Protective put floor", String.raw`\Pi_{\min} = K - S_0 - p`, String.raw`95\text{ put}:\ 95 - 100 - 0.51 = -5.51`, "protective-put-collar", "insurance collar 保险 领口"],
    ["pay", "牛市看涨价差", "Bull call spread", String.raw`\Pi_{\max} = (K_2 - K_1) - D,\quad \text{BE} = K_1 + D`, String.raw`100/105:\ D = 1.74,\ 3.26,\ 101.74`, "vertical-spreads", "vertical debit 垂直 借记"],
    ["pay", "跨式盈亏平衡", "Straddle breakevens", String.raw`\text{BE} = K \pm (c + p)`, String.raw`4.57:\ 95.43 / 104.57`, "straddle-strangle", "straddle strangle vol 跨式"],
    ["pay", "铁鹰", "Iron condor", String.raw`\text{max loss} = W - \text{credit}`, String.raw`90/95/105/110:\ 5 - 1.02 = 3.98`, "iron-condor", "condor range 铁鹰"],
    ["pay", "蝶式", "Butterfly", String.raw`C(K_1) - 2C(K_2) + C(K_3)`, String.raw`95/100/105:\ 1.63,\ \max 3.37`, "butterfly", "fly 蝶式"],
    ["pay", "收入年化", "Annualized income", String.raw`(1 + R)^{365/d} - 1`, String.raw`(1.0071)^{365/30} - 1 = 8.99\%`, "breakeven-returns", "yield annualize 年化"],
    ["arb", "看跌看涨平价", "Put-call parity", String.raw`C - P = Se^{-qT} - Ke^{-rT}`, String.raw`2.45 - 2.12 = 0.33 = 100 - 99.67`, "put-call-parity", "parity synthetic 平价"],
    ["arb", "看涨价格边界", "Call bounds", String.raw`\max(Se^{-qT} - Ke^{-rT}, 0) \le C \le Se^{-qT}`, String.raw`0.33 \le 2.45 \le 100`, "arbitrage-bounds", "bounds arbitrage 边界 套利"],
    ["arb", "远期价", "Forward price", String.raw`F = S e^{(r - q)T}`, String.raw`100\,e^{0.04 \times 30/365} = 100.33`, "forwards-carry", "carry forward 远期 持有成本"],
    ["arb", "箱式价差", "Box spread", String.raw`(K_2 - K_1)\,e^{-rT}`, String.raw`5\,e^{-0.04 \times 30/365} = 4.98`, "synthetics-boxes", "box loan 箱式"],
    ["arb", "一步对冲比率", "One-step hedge ratio", String.raw`\Delta = \frac{V_u - V_d}{S_u - S_d}`, String.raw`\frac{20 - 0}{120 - 80} = 0.5`, "binomial-one-step", "binomial tree replicate 二叉树"],
    ["arb", "风险中性概率", "Risk-neutral probability", String.raw`q = \frac{e^{r\Delta t} - d}{u - d}`, String.raw`r = 0:\ \frac{1 - 0.8}{1.2 - 0.8} = 0.5`, "binomial-one-step", "risk neutral 风险中性"],
    ["arb", "风险中性定价", "Risk-neutral pricing", String.raw`V_0 = e^{-rT}\,\E^{\Q}[V_T]`, String.raw`\mu \text{ never appears}`, "risk-neutral", "expectation measure 测度"],
    ["bs", "Black-Scholes 看涨", "Black-Scholes call", String.raw`C = S\,\N(d_1) - Ke^{-rT}\N(d_2)`, String.raw`1\text{y}:\ 61.79 - 51.87 = 9.93`, "black-scholes", "bs formula price 定价"],
    ["bs", "d1 与 d2", "d1 and d2", String.raw`d_{1,2} = \frac{\ln(S/K) + (r \pm \tfrac12\sigma^2)T}{\sigma\sqrt{T}}`, String.raw`1\text{y}:\ d_1 = 0.30,\ d_2 = 0.10`, "black-scholes", "d1 d2 z-score"],
    ["bs", "Delta", "Delta", String.raw`\Delta = \N(d_1)`, String.raw`30\text{d}\ 100\text{ call}:\ 0.534`, "delta", "hedge ratio 对冲比率"],
    ["bs", "Gamma", "Gamma", String.raw`\Gamma = \frac{\varphi(d_1)}{S\sigma\sqrt{T}}`, String.raw`0.069\ (1\text{d}: 0.381)`, "gamma", "convexity 凸性"],
    ["bs", "Theta", "Theta", String.raw`\Theta = -\frac{S\varphi(d_1)\sigma}{2\sqrt{T}} - rKe^{-rT}\N(d_2)`, String.raw`\div 365:\ -0.044 \text{ per day}`, "theta", "decay time 时间衰减"],
    ["bs", "Vega", "Vega", String.raw`\nu = S\varphi(d_1)\sqrt{T}`, String.raw`0.114 \text{ per vol point}`, "vega", "vol sensitivity 波动率"],
    ["bs", "Rho", "Rho", String.raw`\rho = KTe^{-rT}\N(d_2)`, String.raw`1\text{y}:\ 0.519 \text{ per } 1\%`, "rho-carry", "rates 利率"],
    ["bs", "泰勒展开", "Taylor P&L", String.raw`\dd V \approx \Delta\,\dd S + \tfrac12\Gamma\,\dd S^2 + \Theta\,\dd t + \nu\,\dd\sigma`, String.raw`\text{P\&L attribution}`, "greeks-map", "attribution taylor 归因"],
    ["bs", "对冲后的盈亏", "Hedged P&L", String.raw`\tfrac12\Gamma S^2(\RV^2 - \IV^2)\,\dd t`, String.raw`25\%\text{ vs }20\%:\ +0.021/\text{day}`, "delta-hedging", "gamma scalping 剥头皮"],
    ["bs", "平值法则", "ATM rule", String.raw`C \approx 0.4\,S\sigma\sqrt{T}`, String.raw`0.4 \times 100 \times 0.2 \times 0.287 = 2.29`, "black-scholes", "rule of thumb 平值"],
    ["vol", "1σ 波幅", "1σ move", String.raw`S\sigma\sqrt{T}`, String.raw`100 \times 0.2 \times \sqrt{30/365} = 5.73`, "random-walk", "expected move sqrt 波幅"],
    ["vol", "跨式 ≈ 隐含波幅", "Straddle ≈ implied move", String.raw`\approx 0.8\,S\sigma\sqrt{T}`, String.raw`0.8 \times 5.73 = 4.57`, "implied-vol", "implied move straddle 隐含"],
    ["vol", "16 法则", "Rule of 16", String.raw`\sigma_{\text{daily}} \approx \sigma / 16`, String.raw`\text{VIX } 16 \to 1\% \text{ a day}`, "vix", "vix daily 日波动"],
    ["vol", "历史波动率", "Realized vol", String.raw`\hat\sigma = \sqrt{\tfrac{252}{n-1}\sum (r_i - \bar r)^2}`, String.raw`\text{annualized daily log returns}`, "realized-vol", "historical rv 历史"],
    ["vol", "远期波动率", "Forward vol", String.raw`\sigma_{\text{fwd}}^2 = \frac{\sigma_2^2 T_2 - \sigma_1^2 T_1}{T_2 - T_1}`, String.raw`20\%, 22\% \to 23.8\%`, "term-structure", "term structure event 期限结构"],
    ["vol", "事件波动率", "Event vol", String.raw`\sigma_{\text{event}}^2 = \sigma_{30}^2 T_{30} - \sigma_{\text{base}}^2 (T_{30} - \tfrac{1}{365})`, String.raw`25\%, 20\% \to 4.4\%`, "earnings-events", "earnings 财报"],
    ["vol", "偏斜指标", "Skew measures", String.raw`RR_{25} = \sigma_{25C} - \sigma_{25P}`, String.raw`RR < 0:\ \text{equity skew}`, "smile-skew", "smile risk reversal 微笑 偏斜"],
    ["vol", "价格里的密度", "Density from prices", String.raw`f_{\Q}(K) = e^{rT}\,\partial^2 C / \partial K^2`, String.raw`\text{fly} \approx \text{probability}`, "risk-neutral-density", "breeden litzenberger 密度"],
    ["vol", "方差风险溢价", "Variance risk premium", String.raw`\text{VRP} = \IV^2 - \E[\RV^2]`, String.raw`\approx 3\text{–}4 \text{ vol points (index)}`, "variance-risk-premium", "vrp 溢价"],
    ["perp", "强平价", "Liquidation price", String.raw`P_{\text{liq}} \approx P_0\left(1 - \tfrac{1}{L} + m\right)`, String.raw`100{,}000 \times 0.905 = 90{,}500`, "margin-liquidation", "liquidation leverage 强平 杠杆"],
    ["perp", "资金费率", "Funding rate", String.raw`F = P + \operatorname{clamp}(I - P, \pm 0.05\%)`, String.raw`I = 0.01\%/8\text{h}`, "funding-rate", "funding perp 资金费"],
    ["perp", "资金费年化", "Funding APR", String.raw`\text{APR} = f \times n \times 365`, String.raw`0.01\% \times 3 \times 365 = 10.95\%`, "funding-rate", "apr 年化"],
    ["perp", "期货公平价与基差", "Futures fair value & basis", String.raw`F = Se^{(r-q)T},\quad \tfrac{1}{T}\ln(F/S)`, String.raw`100.33,\ 4.0\%`, "futures-basis", "basis contango 基差"],
    ["perp", "反向合约盈亏", "Inverse P&L", String.raw`N\left(\tfrac{1}{P_0} - \tfrac{1}{P_1}\right)`, String.raw`100\text{k} \to 110\text{k}:\ +0.0909\text{ BTC}`, "what-is-perp", "inverse coin 币本位"],
    ["risk", "凯利比例", "Kelly fraction", String.raw`f^* = p - \frac{1-p}{b}`, String.raw`0.55 - 0.45 = 10\%`, "position-sizing", "kelly sizing 凯利"],
    ["risk", "按压力定张数", "Contracts by stress", String.raw`n = \lfloor \text{budget} / \text{stress loss} \rfloor`, String.raw`\lfloor 400/185 \rfloor = 2`, "capstone", "size budget 仓位 预算"],
    ["risk", "期望值", "Expectancy", String.raw`E = p\,\bar W - (1-p)\,\bar L`, String.raw`0.4 \times 300 - 0.6 \times 150 = 30`, "trading-psychology", "journal expectancy 期望"],
    ["risk", "回撤回本", "Drawdown recovery", String.raw`\frac{1}{1-d} - 1`, String.raw`-50\% \to +100\%`, "position-sizing", "drawdown 回撤"],
    ["risk", "Delta-Gamma 盈亏", "Delta-gamma P&L", String.raw`\Delta\Pi \approx \Delta\,\dd S + \tfrac12\Gamma\,\dd S^2`, String.raw`\text{scenario grids go further}`, "portfolio-risk", "stress scenario 压力"],
    ["risk", "价差成本", "Spread cost", String.raw`(\text{ask} - \text{bid}) / \text{mid}`, String.raw`0.04 / 2.45 = 1.6\%`, "liquidity-spreads", "bid ask liquidity 流动性"],
    ["risk", "除息前提前行权", "Early exercise before a dividend", String.raw`D > P + K(1 - e^{-r\tau})`, String.raw`0.50 > 0.035`, "common-traps", "dividend assignment 股息 指派"],
    ["risk", "蒙特卡洛误差", "Monte Carlo error", String.raw`\text{SE} = s / \sqrt{N}`, String.raw`4\times N \to \tfrac12 \text{ error}`, "monte-carlo", "simulation 模拟"],
  ];
  const cats = [["all", T("全部", "All")], ["pay", T("① 损益", "① Payoffs")], ["arb", T("② 无套利", "② No-arbitrage")], ["bs", T("③ BS 与希腊", "③ BS & Greeks")], ["vol", T("④ 波动率", "④ Volatility")], ["perp", T("⑤ 永续", "⑤ Perps")], ["risk", T("⑥ 风险", "⑥ Risk")]];
  const calcs = [["bs", T("BS 与希腊字母", "BS & Greeks")], ["move", T("波幅与波动率", "Moves & vol")], ["strat", T("策略盈亏平衡", "Strategy breakevens")], ["perp", T("永续", "Perps")], ["size", T("仓位", "Sizing")]];
  let cat = "all", calc = "bs", q = "";

  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("公式速查：搜索 + 小计算器", "Formula finder: search + mini-calculators")}</div>
    <input class="demo-inp" id="cs-q" type="search" placeholder="${T("搜索：parity、强平、vega、跨式……", "Search: parity, liquidation, vega, straddle…")}" aria-label="${T("搜索公式", "Search formulas")}">
    <div class="demo-row" style="margin-top:8px">${seg("cs-cat", cats, cat)}</div>
    <div class="demo-meta" id="cs-count"></div>
    <div id="cs-cards" style="max-height:520px;overflow:auto"></div>
    <div class="demo-label" style="margin-top:14px">${T("小计算器", "Mini-calculators")}</div>
    <div class="demo-row">${seg("cs-calc", calcs, calc)}</div>
    <div id="cs-calc"></div>
    <p class="demo-tip">${T("试试：搜索“parity”或“强平”；再打开“BS 与希腊字母”，输入 S = K = 100、365 天、σ 20%、r 5%，应当看到教科书的 10.45。每张卡片的链接都会带你回到那一课。", "Try this: search “parity” or “liquidation”; then open “BS & Greeks” and enter S = K = 100, 365 days, σ 20%, r 5% — you should see the textbook 10.45. Every card's link takes you back to its lesson.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);

  function drawCards() {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const hits = cards.filter((c) => {
      if (cat !== "all" && c[0] !== cat) return false;
      if (!words.length) return true;
      const hay = [c[1], c[2], c[5], c[6], (LES.get(c[5]) || {}).title || ""].join(" ").toLowerCase();
      return words.every((w) => hay.includes(w));
    });
    $("#cs-count").textContent = T(`${hits.length} 条公式`, `${hits.length} formula${hits.length === 1 ? "" : "s"}`);
    $("#cs-cards").innerHTML = hits.length ? hits.map((c) => `<div class="scn" style="padding:12px 14px">
        <div class="demo-label" style="margin:0 0 6px"><b>${esc(en ? c[2] : c[1])}</b> ${link(c[5])}</div>
        <div class="demo-math" style="margin:4px 0">${tex(c[3], true)}</div>
        <div class="demo-out-sm">${T("XYZ 例子：", "XYZ example: ")}${tex(c[4])}</div></div>`).join("")
      : `<div class="demo-out-sm">${T("没有匹配的公式——换个词试试，比如 delta、平价、funding。", "No match — try another word, such as delta, parity or funding.")}</div>`;
  }

  // ---------------- calculators ----------------
  const money = (x, d = 2) => O.fmtUsd(x, d);
  function drawCalc() {
    const box = $("#cs-calc");
    if (calc === "bs") {
      let type = "call";
      box.innerHTML = `<div class="demo-row">${seg("cs-bs-type", [["call", T("看涨", "Call")], ["put", T("看跌", "Put")]], type)}</div><div class="demo-grid">
        ${slider("cs-s", "S", 50, 150, 0.5, 100)}${slider("cs-k", "K", 50, 150, 0.5, 100)}${slider("cs-d", T("天数", "Days"), 1, 730, 1, 30)}
        ${slider("cs-v", "σ", 5, 120, 1, 20)}${slider("cs-r", "r", 0, 10, 0.25, 4)}</div><div class="demo-math" id="cs-bs-f"></div><div id="cs-bs-s"></div>`;
      const run = bindSliders(box, { "cs-s": (x) => "$" + x, "cs-k": (x) => "$" + x, "cs-d": (x) => x, "cs-v": (x) => x + "%", "cs-r": (x) => x + "%" }, (v) => {
        const o = { S: v["cs-s"], K: v["cs-k"], T: v["cs-d"] / 365, r: v["cs-r"] / 100, sigma: v["cs-v"] / 100, type };
        const g = O.greeks(o);
        box.querySelector("#cs-bs-f").innerHTML = tex(String.raw`d_1 = ${g.d1.toFixed(3)},\ d_2 = ${g.d2.toFixed(3)}`, true) + tex(String.raw`${type === "call" ? "C" : "P"} = ${g.price.toFixed(2)}\ (\times 100 = \$${(g.price * 100).toFixed(0)})`, true);
        box.querySelector("#cs-bs-s").innerHTML = stats([["Δ", g.delta.toFixed(3)], ["Γ", g.gamma.toFixed(4)], [T("Θ/天", "Θ/day"), g.theta.toFixed(3)], [T("ν/点", "ν/pt"), g.vega.toFixed(3)], [T("ρ/1%", "ρ/1%"), g.rho.toFixed(3)], [T("风险中性 P(实值)", "RN P(ITM)"), (g.probITM * 100).toFixed(1) + "%"]]);
      });
      onSeg(box, "cs-bs-type", (t) => { type = t; run(); });
    } else if (calc === "move") {
      box.innerHTML = `<div class="demo-grid">${slider("cs-ms", "S", 10, 500, 1, 100)}${slider("cs-mv", "σ", 5, 150, 1, 20)}${slider("cs-md", T("天数", "Days"), 1, 365, 1, 30)}
        ${slider("cs-v1", T("近月 IV", "Near IV"), 5, 100, 0.5, 20)}${slider("cs-t1", T("近月天数", "Near days"), 1, 180, 1, 30)}${slider("cs-v2", T("远月 IV", "Far IV"), 5, 100, 0.5, 22)}${slider("cs-t2", T("远月天数", "Far days"), 2, 365, 1, 60)}</div>
        <div class="demo-math" id="cs-m-f"></div><div id="cs-m-s"></div>`;
      bindSliders(box, { "cs-ms": (x) => "$" + x, "cs-mv": (x) => x + "%", "cs-md": (x) => x, "cs-v1": (x) => x + "%", "cs-t1": (x) => x, "cs-v2": (x) => x + "%", "cs-t2": (x) => x }, (v) => {
        const S = v["cs-ms"], s = v["cs-mv"] / 100, Ty = v["cs-md"] / 365, mv = O.expectedMove(S, s, Ty), st = O.straddleApprox(S, s, Ty);
        const t1 = Math.min(v["cs-t1"], v["cs-t2"] - 1), t2 = v["cs-t2"], w = ((v["cs-v2"] / 100) ** 2 * t2 - (v["cs-v1"] / 100) ** 2 * t1) / (t2 - t1);
        const fwdTex = w > 0 ? (Math.sqrt(w) * 100).toFixed(2) + String.raw`\%` : String.raw`\text{` + T("无（日历套利）", "none (calendar arbitrage)") + "}";
        box.querySelector("#cs-m-f").innerHTML = tex(String.raw`S\sigma\sqrt{T} = ${S} \times ${s.toFixed(2)} \times \sqrt{${v["cs-md"]}/365} = ${mv.toFixed(2)}`, true) + tex(String.raw`\sigma_{\text{fwd}} = \sqrt{\frac{\sigma_2^2 T_2 - \sigma_1^2 T_1}{T_2 - T_1}} = ${fwdTex}`, true);
        box.querySelector("#cs-m-s").innerHTML = stats([[T("1σ 波幅", "1σ move"), money(mv)], [T("跨式 ≈ 0.8 × 1σ", "Straddle ≈ 0.8 × 1σ"), money(st)], [T("日 1σ（365）", "Daily 1σ (365)"), money(S * s / Math.sqrt(365))], [T("日 1σ（252）", "Daily 1σ (252)"), (s / Math.sqrt(252) * 100).toFixed(2) + "%"], [T("16 法则", "Rule of 16"), (s * 100 / 16).toFixed(2) + "%"]]);
      });
    } else if (calc === "strat") {
      let st = "spread";
      box.innerHTML = `<div class="demo-row">${seg("cs-st", [["call", T("看涨", "Call")], ["put", T("看跌", "Put")], ["spread", T("牛市看涨价差", "Bull call spread")], ["straddle", T("跨式", "Straddle")], ["condor", T("铁鹰", "Iron condor")], ["fly", T("蝶式", "Butterfly")]], st)}</div>
        <div class="demo-grid">${slider("cs-sk", T("中心行权价 K", "Center strike K"), 80, 120, 1, 100)}${slider("cs-sw", T("宽度", "Width"), 1, 15, 1, 5)}${slider("cs-sv", "σ", 5, 80, 1, 20)}${slider("cs-sd", T("天数", "Days"), 1, 120, 1, 30)}</div>
        <div class="demo-math" id="cs-st-f"></div><div id="cs-st-s"></div>`;
      const run = bindSliders(box, { "cs-sk": (x) => "$" + x, "cs-sw": (x) => "$" + x, "cs-sv": (x) => x + "%", "cs-sd": (x) => x }, (v) => {
        const K = v["cs-sk"], W = v["cs-sw"], sg = v["cs-sv"] / 100, Ty = v["cs-sd"] / 365;
        const L = (type, side, k) => ({ type, side, K: k, premium: O.bsPrice({ S: 100, K: k, T: Ty, r: 0.04, sigma: sg, type }) });
        const legs = st === "call" ? [L("call", "long", K)] : st === "put" ? [L("put", "long", K)] : st === "spread" ? [L("call", "long", K), L("call", "short", K + W)]
          : st === "straddle" ? [L("call", "long", K), L("put", "long", K)] : st === "condor" ? [L("put", "long", K - 2 * W), L("put", "short", K - W), L("call", "short", K + W), L("call", "long", K + 2 * W)]
          : [L("call", "long", K - W), { ...L("call", "short", K), qty: 2 }, L("call", "long", K + W)];
        const net = legs.reduce((a, l) => a + (l.side === "long" ? 1 : -1) * (l.qty || 1) * l.premium, 0);
        const ps = O.payoffStats(legs, 0.01, 300);
        box.querySelector("#cs-st-f").innerHTML = tex(String.raw`\text{${net >= 0 ? T("净付", "net debit") : T("净收", "net credit")}} = ${Math.abs(net).toFixed(2)}\quad (S = 100,\ r = 4\%)`, true);
        const f = (x) => (isFinite(x) ? money(x * 100, 0) : T("无上限", "unlimited"));
        box.querySelector("#cs-st-s").innerHTML = stats([[T("最大盈利/张", "Max profit/contract"), f(ps.maxProfit), "pos"], [T("最大亏损/张", "Max loss/contract"), f(ps.maxLoss), "neg"], [T("盈亏平衡", "Breakevens"), ps.breakevens.map((b) => b.toFixed(2)).join(" / ") || "–"]]);
      });
      onSeg(box, "cs-st", (x) => { st = x; run(); });
    } else if (calc === "perp") {
      box.innerHTML = `<div class="demo-grid">${slider("cs-pe", T("开仓价", "Entry"), 1000, 200000, 1000, 100000)}${slider("cs-pl", T("杠杆", "Leverage"), 1, 50, 1, 10)}${slider("cs-pm", T("维持保证金率", "Maintenance rate"), 0.1, 5, 0.1, 0.5)}
        ${slider("cs-pf", T("资金费率 / 8 小时", "Funding / 8h"), -0.05, 0.1, 0.005, 0.01)}${slider("cs-pn", T("名义金额", "Notional"), 1000, 100000, 1000, 10000)}${slider("cs-pd", T("持有天数", "Days held"), 1, 365, 1, 30)}</div>
        <div class="demo-math" id="cs-p-f"></div><div id="cs-p-s"></div>`;
      bindSliders(box, { "cs-pe": (x) => "$" + (+x).toLocaleString("en-US"), "cs-pl": (x) => x + "×", "cs-pm": (x) => x + "%", "cs-pf": (x) => (+x).toFixed(3) + "%", "cs-pn": (x) => "$" + (+x).toLocaleString("en-US"), "cs-pd": (x) => x }, (v) => {
        const P0 = v["cs-pe"], L = v["cs-pl"], m = v["cs-pm"] / 100, f = v["cs-pf"] / 100, N = v["cs-pn"], d = v["cs-pd"];
        const lL = O.liqPrice(P0, L, m, "long"), lS = O.liqPrice(P0, L, m, "short"), apr = O.fundingAPR(f, 3), cost = N * f * 3 * d;
        box.querySelector("#cs-p-f").innerHTML = tex(String.raw`P_{\text{liq}} = ${P0.toLocaleString("en-US").replace(/,/g, "{,}")}\left(1 - \tfrac{1}{${L}} + ${m.toFixed(3)}\right) = ${Math.round(lL).toLocaleString("en-US").replace(/,/g, "{,}")}`, true);
        box.querySelector("#cs-p-s").innerHTML = stats([[T("多头强平价", "Long liquidation"), money(lL, 0), "neg"], [T("空头强平价", "Short liquidation"), money(lS, 0)], [T("离强平的距离", "Distance to liquidation"), ((1 - lL / P0) * 100).toFixed(2) + "%"], [T("资金费年化", "Funding APR"), (apr * 100).toFixed(2) + "%"], [T("多头资金费成本", "Funding cost (long)"), money(cost, 2), cost > 0 ? "neg" : "pos"]]);
      });
    } else {
      box.innerHTML = `<div class="demo-grid">${slider("cs-kp", T("胜率 p", "Win probability p"), 0.05, 0.95, 0.01, 0.55)}${slider("cs-kb", T("盈亏比 b", "Payoff ratio b"), 0.2, 10, 0.1, 1)}${slider("cs-bu", T("风险预算", "Risk budget"), 50, 5000, 50, 400)}${slider("cs-sl", T("每张压力亏损", "Stress loss per contract"), 10, 2000, 5, 185)}${slider("cs-dd", T("回撤", "Drawdown"), 1, 90, 1, 50)}</div>
        <div class="demo-math" id="cs-k-f"></div><div id="cs-k-s"></div>`;
      bindSliders(box, { "cs-kp": (x) => (+x).toFixed(2), "cs-kb": (x) => (+x).toFixed(1), "cs-bu": (x) => "$" + x, "cs-sl": (x) => "$" + x, "cs-dd": (x) => "−" + x + "%" }, (v) => {
        const p = v["cs-kp"], b = v["cs-kb"], f = O.kellyFraction(p, b), n = Math.floor(v["cs-bu"] / v["cs-sl"]), d = v["cs-dd"] / 100;
        box.querySelector("#cs-k-f").innerHTML = tex(String.raw`f^* = ${p.toFixed(2)} - \frac{${(1 - p).toFixed(2)}}{${b.toFixed(1)}} = ${(f * 100).toFixed(1)}\%`, true) + tex(String.raw`n = \left\lfloor \frac{${v["cs-bu"]}}{${v["cs-sl"]}} \right\rfloor = ${n}`, true);
        box.querySelector("#cs-k-s").innerHTML = stats([[T("完整凯利", "Full Kelly"), f > 0 ? (f * 100).toFixed(1) + "%" : T("不下注", "no bet"), f > 0 ? "acc" : "neg"], [T("半凯利", "Half Kelly"), f > 0 ? (f * 50).toFixed(1) + "%" : "–"], [T("每次下注期望", "Edge per bet"), ((p * b - (1 - p)) * 100).toFixed(1) + "%"], [T("张数", "Contracts"), String(n)], [T("回本需要", "Needed to recover"), "+" + ((1 / (1 - d) - 1) * 100).toFixed(1) + "%"]]);
      });
    }
  }

  $("#cs-q").addEventListener("input", (e) => { q = e.target.value || ""; drawCards(); });
  onSeg(root, "cs-cat", (c) => { cat = c; drawCards(); });
  onSeg(root, "cs-calc", (c) => { calc = c; drawCalc(); });
  drawCards();
  drawCalc();
}
