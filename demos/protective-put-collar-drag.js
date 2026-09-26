// Inline demo for lesson protective-put-collar: the yearly cost ("drag") of keeping a put in place permanently,
// by strike (% of spot) and by how often you roll (monthly, quarterly, yearly). Priced with Black-Scholes.
import * as O from "./_opt.js";
import { barChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S = 100, r = 0.04, TEN = [[30, T("每月", "monthly")], [91, T("每季度", "quarterly")], [365, T("每年", "yearly")]];
  let ten = 30, v = {};
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("永久保险的账单：一年要付多少保费", "The bill for permanent insurance: premium paid per year")}</div>
    <div class="demo-grid">
      ${slider("ppd-k", T("看跌行权价（现价的 %）", "Put strike (% of spot)"), 80, 100, 1, 95)}
      ${slider("ppd-v", T("隐含波动率 σ", "Implied vol σ"), 10, 50, 1, 20)}
    </div>
    <div class="demo-row">${seg("ppd-t", TEN.map(([d, l]) => [String(d), T("展期：", "Roll: ") + l]), "30")}</div>
    <div class="demo-math" id="ppd-f"></div>
    <div id="ppd-stats"></div>
    <div id="ppd-bars"></div>
    <p class="demo-tip">${T("看什么：同样是 95% 的行权价，每月展期一年约付 6.2%，买一张一年期只要约 4.0%——但每月展期的“免赔额”每个月都重新从 5% 算起，保护更紧。再把隐含波动率拉到 30%：保费几乎按比例上涨，而这通常正是你最想买保险的时候。", "What to notice: with the same 95% strike, rolling monthly costs about 6.2% a year while one 1-year put costs about 4.0% — but the monthly roll resets its 5% deductible every month, so it protects more tightly. Push implied vol to 30%: the premium rises almost in proportion, and that is usually exactly when you most want insurance.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  function draw() {
    const k = v["ppd-k"] / 100, sigma = v["ppd-v"] / 100;
    const cost = (d) => O.bsPut(S, S * k, d / 365, r, sigma) * (365 / d) / S;
    const p = O.bsPut(S, S * k, ten / 365, r, sigma), yr = cost(ten);
    $("#ppd-f").innerHTML = tex(String.raw`\text{${T("年化保费", "yearly drag")}} \approx \frac{365}{d}\cdot\frac{P}{S} = \frac{365}{${ten}} \times \frac{${p.toFixed(2)}}{100} = ${(yr * 100).toFixed(2)}\%`, true);
    $("#ppd-stats").innerHTML = stats([
      [T("每次展期的保费", "Premium per roll"), "$" + (p * 100).toFixed(0) + T("（每 100 股）", " per 100 sh")],
      [T("一年的保费", "Premium per year"), (yr * 100).toFixed(2) + "%", "neg"],
      [T("十年累计拖累（复利）", "10-year drag, compounded"), ((1 - Math.pow(1 - yr, 10)) * 100).toFixed(0) + "%", "neg"],
      [T("每次的免赔额", "Deductible each time"), ((1 - k) * 100).toFixed(0) + "%"],
    ]);
    $("#ppd-bars").innerHTML = barChart({
      bars: TEN.map(([d, l]) => ({ label: l, value: cost(d) * 100, cls: d === ten ? 0 : 1 })),
      yfmt: (x) => x.toFixed(1) + "%", ymin: 0, xlabel: T("同一行权价、不同展期频率的年化保费", "Yearly premium at the same strike, by roll frequency"),
    });
  }
  bindSliders(root, { "ppd-k": (x) => x + "%", "ppd-v": (x) => x + "%" }, (vals) => { v = vals; draw(); });
  onSeg(root, "ppd-t", (d) => { ten = +d; draw(); });
}
