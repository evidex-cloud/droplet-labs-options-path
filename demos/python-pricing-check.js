// Inline demo for lesson python-pricing: the lesson's unit tests, run against a correct implementation
// and against four realistic bugs. Shows which test catches which bug (and which bugs slip through).
import * as O from "./_opt.js";
import { seg, onSeg, esc } from "./_viz.js";

const N = O.normCdf, n = O.normPdf;
// A family of Black-Scholes implementations: bug = "none" | "days" | "nodisc" | "putsign" | "vega"
function makeImpl(bug) {
  const tt = (T) => (bug === "days" ? T * 365 : T);
  const price = (S, K, T0, r, s, kind) => {
    const T = tt(T0), sq = Math.sqrt(T);
    const d1 = (Math.log(S / K) + (r + 0.5 * s * s) * T) / (s * sq), d2 = d1 - s * sq;
    const df = bug === "nodisc" ? 1 : Math.exp(-r * T);
    if (kind === "call") return S * N(d1) - K * df * N(d2);
    return bug === "putsign" ? K * df * N(d2) - S * N(d1) : K * df * N(-d2) - S * N(-d1);
  };
  const greeks = (S, K, T0, r, s) => {
    const T = tt(T0), sq = Math.sqrt(T);
    const d1 = (Math.log(S / K) + (r + 0.5 * s * s) * T) / (s * sq);
    return { delta: N(d1), vega: (S * n(d1) * sq) / (bug === "vega" ? 1 : 100) };
  };
  const iv = (p, S, K, T, r, kind) => {
    let a = 1e-6, b = 5, fa = price(S, K, T, r, a, kind) - p, fb = price(S, K, T, r, b, kind) - p;
    if (!(fa * fb < 0)) return NaN; // brentq would raise ValueError: no sign change
    for (let i = 0; i < 200; i++) { const m = 0.5 * (a + b), fm = price(S, K, T, r, m, kind) - p; if (fa * fm <= 0) { b = m; fb = fm; } else { a = m; fa = fm; } }
    return 0.5 * (a + b);
  };
  return { price, greeks, iv };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let bug = "none";
  const BUGS = [
    ["none", T("正确实现", "Correct")],
    ["days", T("T 用了天数", "T in days")],
    ["nodisc", T("K 忘了贴现", "K not discounted")],
    ["putsign", T("看跌公式漏了负号", "Put sign slip")],
    ["vega", T("Vega 没除以 100", "Vega not ÷100")],
  ];
  const DESC = {
    none: T("与课文中的 pricing.py 相同。", "Identical to the lesson's pricing.py."),
    days: T("整个代码库（包括测试）都用天数表示 T：一个月写 30、一年写 365，而公式要的是年。", "The whole code base, tests included, gives T in days — 30 for a month, 365 for a year — while the formula expects years."),
    nodisc: T("写成了 S·N(d1) − K·N(d2)：行权价没乘 e^(−rT)。", "Written as S·N(d1) − K·N(d2): the strike is missing e^(−rT)."),
    putsign: T("看跌写成了 K·e^(−rT)·N(d2) − S·N(d1)：两个负号都丢了。", "Put written as K·e^(−rT)·N(d2) − S·N(d1): both minus signs lost."),
    vega: T("Vega 返回每 1.00 波动率，而不是每 1 个波动率点。", "Vega returned per 1.00 of volatility instead of per vol point."),
  };
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("单元测试：哪个测试抓住哪个 bug？", "Unit tests: which test catches which bug?")}</div>
    <div class="demo-row">${seg("pyc-bug", BUGS, "none")}</div>
    <p class="demo-meta" id="pyc-desc"></p>
    <div id="pyc-out"></div>
    <p class="demo-tip">${T("看什么：“T 用了天数”只被教科书测试抓住——平价、Delta 对比、IV 往返全都通过，因为代码和它自己完全一致。“Vega 没除以 100”只有 Vega 测试能发现。", "What to notice: “T in days” is caught only by the textbook test — parity, the delta bump and the IV round trip all pass, because the code agrees perfectly with itself. “Vega not ÷100” is caught only by the vega test.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const run = () => {
    const I = makeImpl(bug);
    const Tm = 30 / 365, res = [];
    const c = I.price(100, 100, 1, 0.05, 0.2, "call"), p = I.price(100, 100, 1, 0.05, 0.2, "put");
    res.push(["test_textbook_values", Math.abs(c - 10.4506) < 1e-4 && Math.abs(p - 5.5735) < 1e-4, `call ${c.toFixed(4)}, put ${p.toFixed(4)} (${T("应为", "want")} 10.4506, 5.5735)`]);
    const c2 = I.price(100, 105, Tm, 0.04, 0.2, "call"), p2 = I.price(100, 105, Tm, 0.04, 0.2, "put");
    const Tref = bug === "days" ? Tm * 365 : Tm; // the test file itself uses the same (day-based) T
    const gap = c2 - p2 - (100 - 105 * Math.exp(-0.04 * Tref));
    res.push(["test_put_call_parity", Math.abs(gap) < 1e-10, `C − P − (S − Ke^(−rT)) = ${gap.toExponential(2)}`]);
    const h = 0.01, bump = (I.price(100 + h, 100, Tm, 0.04, 0.2, "call") - I.price(100 - h, 100, Tm, 0.04, 0.2, "call")) / (2 * h);
    const dA = I.greeks(100, 100, Tm, 0.04, 0.2).delta;
    res.push(["test_delta_matches_a_bump", Math.abs(dA - bump) < 1e-6, `${T("解析", "analytic")} ${dA.toFixed(6)} vs bump ${bump.toFixed(6)}`]);
    const pr = I.price(100, 95, Tm, 0.04, 0.27, "put"), iv = I.iv(pr, 100, 95, Tm, 0.04, "put");
    res.push(["test_iv_round_trip", isFinite(iv) && Math.abs(iv - 0.27) < 1e-8, isFinite(iv) ? `0.27 → ${pr.toFixed(4)} → ${iv.toFixed(8)}` : "ValueError: f(a) and f(b) must have different signs"]);
    const vb = (I.price(100, 100, Tm, 0.04, 0.201, "call") - I.price(100, 100, Tm, 0.04, 0.199, "call")) / 0.002 / 100;
    const vA = I.greeks(100, 100, Tm, 0.04, 0.2).vega;
    res.push(["test_vega_matches_a_bump", Math.abs(vA - vb) < 1e-5, `${T("解析", "analytic")} ${vA.toFixed(5)} vs bump ${vb.toFixed(5)} ${T("（每个波动率点）", "(per vol point)")}`]);
    const passed = res.filter((x) => x[1]).length;
    $("#pyc-desc").textContent = DESC[bug];
    $("#pyc-out").innerHTML = `<pre class="demo-out" style="white-space:pre-wrap">$ pytest test_pricing.py -q\n${res.map(([name, ok, info]) => `<span style="color:${ok ? "var(--green)" : "var(--red)"}">${ok ? "PASSED" : "FAILED"}</span> ${esc(name)}  <span style="color:var(--muted)">${esc(info)}</span>`).join("\n")}\n<b>${passed} passed, ${res.length - passed} failed</b></pre>`;
  };
  onSeg(root, "pyc-bug", (k) => { bug = k; run(); });
  run();
}
