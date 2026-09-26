// Main demo for lesson futures-basis: fair futures price from carry, a simulated path where the basis converges,
// and the daily variation-margin cash flows of one long or short contract (with illustrative margin calls).
import * as O from "./_opt.js";
import { lineChart, barChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const PRESETS = {
    xyz: { S: 100, mult: 100, sigma: 0.2, name: T("XYZ（每份 100 股）", "XYZ (100 shares per contract)") },
    btc: { S: 100000, mult: 5, sigma: 0.5, name: T("BTC（演示价，每份 5 BTC）", "BTC (illustrative, 5 BTC per contract)") },
  };
  let asset = "xyz", side = "long", seed = 7;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("期货实验台：持有成本、基差收敛与每日结算", "Futures lab: carry, basis convergence and daily settlement")}</div>
    <div class="demo-row">${seg("fb-asset", [["xyz", "XYZ"], ["btc", T("BTC（演示）", "BTC (illustrative)")]], asset)}
      ${seg("fb-side", [["long", T("做多一份", "Long 1")], ["short", T("做空一份", "Short 1")]], side)}
      <div class="demo-btns" style="margin:0"><button class="demo-btn" data-act="path">${T("换一条价格路径", "New price path")}</button></div></div>
    <div class="demo-grid">
      ${slider("fb-days", T("离到期天数", "Days to expiry"), 10, 180, 1, 90)}
      ${slider("fb-carry", T("净持有成本 r − q（年化）", "Net carry r − q (per year)"), -6, 12, 0.5, 4)}
      ${slider("fb-vol", T("路径波动率（仅用于模拟）", "Path volatility (simulation only)"), 5, 90, 5, 20)}
      ${slider("fb-im", T("初始保证金（占名义价值）", "Initial margin (% of notional)"), 5, 50, 1, 15)}
    </div>
    <div class="demo-math" id="fb-f"></div>
    <div id="fb-stats"></div>
    <div class="demo-label">${T("现货与期货：基差一路收窄到零", "Spot and futures: the basis shrinks to zero")}</div>
    <div id="fb-chart"></div>
    <div class="demo-label">${T("每日变动保证金（绿 = 当晚收到，红 = 当晚付出）", "Daily variation margin (green = received that evening, red = paid)")}</div>
    <div id="fb-vm"></div>
    <div class="demo-math" id="fb-sum"></div>
    <p class="demo-tip">${T("试试：把净持有成本拉到 0，期货和现货会重合；拉到 10%，开局的基差变大，做多者到期要把它还回去。把保证金调到 5%，同一条路径会触发好几次追加保证金——总盈亏不变，但你得一次次掏钱。维持线按初始保证金的 80% 演示。", "Try this: set net carry to 0 and futures sit on spot; push it to 10% and the starting basis grows, which the long hands back by expiry. Drop margin to 5% and the same path triggers several margin calls: the total P&L is unchanged, but you keep having to send cash. The maintenance line is shown at 80% of initial margin, for illustration.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const money = (x, d = 0) => (x < 0 ? "−$" : "$") + Math.abs(x).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const num = (x, d) => x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const tn = (x, d) => (x < 0 ? "-" : "") + num(Math.abs(x), d).replace(/,/g, "{,}");

  const draw = (v) => {
    const P = PRESETS[asset], days = v["fb-days"], b = v["fb-carry"] / 100, sigma = v["fb-vol"] / 100, imPct = v["fb-im"] / 100;
    const d = asset === "btc" ? 0 : 2;
    const Tm = days / 365, S0 = P.S, F0 = O.futuresFair(S0, Tm, b, 0);
    const path = O.gbmPath(O.rng(seed), S0, 0, sigma, Tm, days);
    const fut = path.map((s, i) => O.futuresFair(s, (days - i) / 365, b, 0));
    const sgn = side === "long" ? 1 : -1, m = P.mult;
    const vm = fut.slice(1).map((f, i) => sgn * (f - fut[i]) * m);
    // margin account with top-ups when the balance falls below 80% of initial margin
    const im = imPct * F0 * m, mm = 0.8 * im;
    let bal = im, calls = 0, topped = 0, minBal = im;
    for (const x of vm) { bal += x; minBal = Math.min(minBal, bal); if (bal < mm) { calls++; topped += im - bal; bal = im; } }
    const total = vm.reduce((a, x) => a + x, 0), ST = path[days];
    $("#fb-f").innerHTML = tex(String.raw`F_0 = S\,e^{(r-q)T} = ${tn(S0, d)} \times e^{${b.toFixed(3)} \times ${days}/365} = ${tn(F0, d)},\qquad \text{basis} = F_0 - S = ${tn(F0 - S0, d)}`, true);
    $("#fb-stats").innerHTML = stats([
      [T("期货公平价 F₀", "Fair futures price F₀"), (asset === "btc" ? "$" + num(F0, 0) : "$" + F0.toFixed(2)), "acc"],
      [T("基差 F₀ − S", "Basis F₀ − S"), (asset === "btc" ? num(F0 - S0, 0) : (F0 - S0).toFixed(2))],
      [T("年化基差", "Annualised basis"), (O.annualizedBasis(F0, S0, Tm) * 100).toFixed(2) + "%"],
      [T("每份名义价值", "Notional per contract"), money(F0 * m)],
      [T("初始保证金（演示）", "Initial margin (illustrative)"), money(im)],
      [T("追加保证金次数", "Margin calls"), String(calls), calls ? "neg" : "pos"],
    ]);
    const xs = path.map((_, i) => i);
    $("#fb-chart").innerHTML = lineChart({
      xmin: 0, xmax: days, xlabel: T("已过天数", "Days elapsed"), ylabel: T("价格", "Price"),
      series: [
        { points: xs.map((i) => [i, path[i]]), cls: 5, label: T("现货 S", "Spot S") },
        { points: xs.map((i) => [i, fut[i]]), cls: 0, label: T("期货 F（持有成本定价）", "Future F (priced by carry)") },
      ],
      markers: [{ x: days, label: T("到期", "expiry") }],
    });
    $("#fb-vm").innerHTML = barChart({
      bars: vm.map((x, i) => ({ label: String(i + 1), value: x, cls: x >= 0 ? 3 : 2 })),
      yfmt: (y) => (Math.abs(y) >= 1000 ? (y / 1000).toFixed(0) + "k" : y.toFixed(0)), xlabel: T("第几天", "Day"), H: 200,
    });
    $("#fb-sum").innerHTML = tex(String.raw`\sum_t \text{VM}_t = ${side === "long" ? "" : "-"}(F_T - F_0) \times ${m} = ${side === "long" ? "" : "-"}(${tn(ST, d)} - ${tn(F0, d)}) \times ${m} = ${tn(total, 0)}`, true) +
      tex(String.raw`F_T - F_0 = \underbrace{(S_T - S_0)}_{${tn(ST - S0, d)}} - \underbrace{(F_0 - S_0)}_{${tn(F0 - S0, d)}}`, true) +
      `<p class="demo-meta">${T("账户最低余额", "Lowest account balance")}: ${money(minBal)} · ${T("累计补缴", "Total topped up")}: ${money(topped)} · ${T("维持线", "Maintenance line")}: ${money(mm)}</p>`;
  };
  const spec = { "fb-days": (x) => x + T(" 天", " days"), "fb-carry": (x) => x + "%", "fb-vol": (x) => x + "%", "fb-im": (x) => x + "%" };
  const run = bindSliders(root, spec, draw);
  onSeg(root, "fb-asset", (a) => {
    asset = a;
    $("#fb-vol").value = a === "btc" ? 50 : 20;
    run();
  });
  onSeg(root, "fb-side", (s) => { side = s; run(); });
  $("[data-act=path]").addEventListener("click", () => { seed = (seed * 7 + 13) % 997; run(); });
}
