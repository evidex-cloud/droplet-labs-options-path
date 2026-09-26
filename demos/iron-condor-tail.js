// Inline demo for lesson iron-condor: the same short-vol idea with and without wings when returns have gaps.
// Diffusion at a chosen vol plus a monthly chance of a downward gap; prices fixed at 20% implied.
import * as O from "./_opt.js";
import { lineChart, slider, bindSliders, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("肥尾测试：铁鹰 vs 卖出宽跨", "Fat-tail test: iron condor vs short strangle")}</div>
    <div class="demo-grid-3">
      ${slider("ict-sd", T("平日波动率", "Everyday vol"), 5, 30, 1, 15)}
      ${slider("ict-p", T("本月跳空概率", "Chance of a gap this month"), 0, 30, 1, 10)}
      ${slider("ict-j", T("跳空幅度", "Gap size"), -30, -3, 1, -12)}
    </div>
    <div class="demo-math" id="ict-f"></div>
    <div class="cmp" id="ict-cmp"></div>
    <div id="ict-chart"></div>
    <p class="demo-tip">${T("看什么：把跳空概率设为 0，宽跨式赚得比铁鹰多；再加上跳空，两者的“总波动率”可能不变，但宽跨式的最差 1% 一下子掉到铁鹰的两三倍。曲线左端就是尾部。", "What to notice: with no gaps the strangle earns more than the condor; add gaps and the total vol may barely change, yet the strangle's worst 1% drops to two or three times the condor's. The left end of the curves is the tail.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const r = 0.04, Tm = 30 / 365, S0 = 100;
  const px = (K, type) => O.bsPrice({ S: S0, K, T: Tm, r, sigma: 0.2, type });
  const SS = [{ type: "put", side: "short", K: 95, premium: px(95, "put") }, { type: "call", side: "short", K: 105, premium: px(105, "call") }];
  const IC = [...SS, { type: "put", side: "long", K: 90, premium: px(90, "put") }, { type: "call", side: "long", K: 110, premium: px(110, "call") }];
  const N = 20000;
  bindSliders(root, { "ict-sd": (x) => x + "%", "ict-p": (x) => x + "%", "ict-j": (x) => "−" + Math.abs(x) + "%" }, (v) => {
    const sd = v["ict-sd"] / 100, pj = v["ict-p"] / 100, J = v["ict-j"] / 100;
    const R = O.rng(23), a = [], b = [];
    for (let i = 0; i < N; i++) {
      let x = (r - sd * sd / 2) * Tm + sd * Math.sqrt(Tm) * R.normal();
      if (R() < pj) x += Math.log(1 + J);
      const ST = S0 * Math.exp(x);
      a.push(O.netPL(IC, ST) * 100); b.push(O.netPL(SS, ST) * 100);
    }
    const eff = Math.sqrt(sd * sd + (pj * (1 - pj) * Math.log(1 + J) ** 2) / Tm);
    $("#ict-f").innerHTML = tex(String.raw`\begin{gathered}\sigma_{\text{total}} \approx \sqrt{\sigma^2 + \frac{p(1-p)\,\ln(1+J)^2}{T}} \\ = \sqrt{${sd.toFixed(2)}^2 + \frac{${pj.toFixed(2)} \times ${(1 - pj).toFixed(2)} \times (${Math.log(1 + J).toFixed(3)})^2}{30/365}} \\ \approx ${(eff * 100).toFixed(1)}\%\quad (\sigma_{\text{imp}} = 20\%)\end{gathered}`, true);
    const summ = (arr) => {
      const s = [...arr].sort((x, y) => x - y), n = s.length, m = s.reduce((x, y) => x + y, 0) / n;
      const wins = s.filter((x) => x > 0);
      return { s, m, win: wins.length / n, p1: s[Math.floor(n * 0.01)], worst: s[0] };
    };
    const A = summ(a), B = summ(b);
    const money = (x) => (x < 0 ? "−$" : "+$") + Math.abs(x).toFixed(0);
    const cell = (title, X, hl) => `<div class="cmp-cell${hl ? " hl" : ""}"><h5>${title}</h5>
      <div class="kv"><span class="k">${T("胜率", "Win rate")}</span> <span class="v">${(X.win * 100).toFixed(0)}%</span></div>
      <div class="kv"><span class="k">${T("平均损益", "Average P&L")}</span> <span class="v hl">${money(X.m)}</span></div>
      <div class="kv"><span class="k">${T("最差 1%", "Worst 1%")}</span> <span class="v">${money(X.p1)}</span></div>
      <div class="kv"><span class="k">${T("最差一次", "Single worst")}</span> <span class="v">${money(X.worst)}</span></div></div>`;
    $("#ict-cmp").innerHTML = cell(T("铁鹰 95/105，翅膀 90/110（收 $102）", "Iron condor 95/105, wings 90/110 ($102 credit)"), A, true) + cell(T("卖出宽跨 95/105（收 $122）", "Short strangle 95/105 ($122 credit)"), B, false);
    const q = (s) => Array.from({ length: 101 }, (_, i) => [i, s[Math.min(s.length - 1, Math.floor((i / 100) * (s.length - 1)))]]);
    $("#ict-chart").innerHTML = lineChart({
      series: [{ points: q(A.s), cls: 0, label: T("铁鹰", "Iron condor") }, { points: q(B.s), cls: 2, label: T("卖出宽跨", "Short strangle") }],
      xmin: 0, xmax: 100, xlabel: T("结局排序（百分位，从最差到最好）", "Outcomes ranked (percentile, worst to best)"), ylabel: T("每组损益（美元）", "P&L per set ($)"), H: 240,
    });
  });
}
