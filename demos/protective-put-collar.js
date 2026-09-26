// Main demo for lesson protective-put-collar: insure 100 XYZ shares with a put, then (optionally) pay for it by selling a
// call — the collar. Includes a put-skew slider (extra implied vol on the put) and a zero-cost solver for the call strike.
import * as O from "./_opt.js";
import { payoffChart, seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100, r = 0.04;
  let mode = "collar", v = {};
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("给 100 股买保险：保护性看跌与领口", "Insuring 100 shares: protective put and collar")}</div>
    <div class="demo-row">${seg("ppc-m", [["stock", T("只持股", "Shares only")], ["put", T("+ 买看跌", "+ Long put")], ["collar", T("+ 买看跌 + 卖看涨（领口）", "+ Long put + short call (collar)")]], mode)}</div>
    <div class="demo-grid">
      ${slider("ppc-kp", T("买入看跌的行权价", "Put strike (bought)"), 85, 100, 1, 95)}
      ${slider("ppc-kc", T("卖出看涨的行权价", "Call strike (sold)"), 100, 120, 0.5, 105)}
      ${slider("ppc-d", T("到期天数", "Days to expiry"), 7, 180, 1, 30)}
      ${slider("ppc-v", T("隐含波动率 σ（看涨）", "Implied vol σ (call)"), 10, 50, 1, 20)}
      ${slider("ppc-sk", T("偏斜：看跌多出的波动率点", "Skew: extra vol points on the put"), 0, 10, 1, 0)}
      ${slider("ppc-e", T("已经过去的时间（到期前的曲线）", "Time already passed (before-expiry curve)"), 0, 100, 5, 0)}
    </div>
    <div class="demo-btns"><button type="button" class="demo-btn" id="ppc-zero">${T("求零成本看涨行权价", "Solve the zero-cost call strike")}</button><span class="demo-meta" id="ppc-zmsg"></span></div>
    <div id="ppc-chart"></div>
    <div class="demo-math" id="ppc-f"></div>
    <div id="ppc-stats"></div>
    <div id="ppc-greeks"></div>
    <div id="ppc-table"></div>
    <p class="demo-tip">${T("试试：先在“+ 买看跌”下看地板；再切到领口，按“求零成本”。然后把偏斜拉到 6 个点——看跌变贵，零成本领口的天花板被迫往下移。这就是真实市场里零成本领口比教科书上“更紧”的原因。", "Try this: look at the floor under “+ Long put”; then switch to the collar and press “Solve the zero-cost call strike.” Now push the skew to 6 points — the put gets dearer and the zero-cost ceiling is forced lower. That is why real-market zero-cost collars are tighter than textbook ones.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const zeroK = (p, Tm, sigma) => { let lo = S0, hi = 200; if (O.bsCall(S0, lo, Tm, r, sigma) < p) return lo; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (O.bsCall(S0, m, Tm, r, sigma) > p) lo = m; else hi = m; } return (lo + hi) / 2; };
  function draw() {
    const Kp = v["ppc-kp"], Kc = v["ppc-kc"], days = v["ppc-d"], Tm = days / 365, sc = v["ppc-v"] / 100, sp = sc + v["ppc-sk"] / 100;
    const p = O.bsPut(S0, Kp, Tm, r, sp), c = O.bsCall(S0, Kc, Tm, r, sc);
    const legs = [{ type: "stock", side: "long", entry: S0 }];
    if (mode !== "stock") legs.push({ type: "put", side: "long", K: Kp, premium: p, T: Tm, sigma: sp });
    if (mode === "collar") legs.push({ type: "call", side: "short", K: Kc, premium: c, T: Tm, sigma: sc });
    const elDays = Math.round((v["ppc-e"] / 100) * days);
    $("#ppc-chart").innerHTML = payoffChart({
      legs, lo: 70, hi: 130, spot: S0, mult: 100, today: elDays < days && mode !== "stock" ? { elapsed: elDays / 365, sigma: sc, r } : null,
      xlabel: T("XYZ 价格", "XYZ price"), ylabel: T("盈亏（100 股，美元）", "P&L on 100 shares ($)"),
      labels: { expiry: T("到期时", "At expiry"), today: T(`第 ${elDays} 天`, `Day ${elDays}`), spot: T("现价", "spot"), be: T("平衡", "BE") },
      extra: mode === "stock" ? [] : [{ f: (x) => (x - S0) * 100, cls: 5, dashed: true, label: T("只持股", "Shares only") }],
    }).html;
    const net = mode === "stock" ? 0 : mode === "put" ? p : p - c;
    const floor = mode === "stock" ? -S0 : Kp - S0 - net;
    const cap = mode === "collar" ? Kc - S0 - net : Infinity;
    const f = mode === "stock" ? String.raw`\Pi = S_T - 100` : mode === "put"
      ? String.raw`\text{${T("地板", "floor")}} = K_p - S_0 - p = ${Kp} - 100 - ${p.toFixed(2)} = ${floor.toFixed(2)}`
      : String.raw`\begin{gathered}p - c = ${p.toFixed(2)} - ${c.toFixed(2)} = ${net.toFixed(2)} \\ \text{${T("地板", "floor")}} = K_p - S_0 - (p - c) = ${floor.toFixed(2)} \\ \text{${T("天花板", "cap")}} = K_c - S_0 - (p - c) = ${cap.toFixed(2)}\end{gathered}`;
    $("#ppc-f").innerHTML = tex(f, true);
    $("#ppc-stats").innerHTML = stats([
      [T("保险净成本（1 份）", "Net insurance cost (1 unit)"), mode === "stock" ? "$0" : (net >= 0 ? "−$" : "+$") + Math.abs(net * 100).toFixed(0), net > 0 ? "neg" : "pos"],
      [T("最大亏损", "Max loss"), (floor < 0 ? "−$" : "$") + Math.abs(floor * 100).toFixed(0), "neg"],
      [T("最大盈利", "Max gain"), isFinite(cap) ? "$" + (cap * 100).toFixed(0) : T("不封顶", "uncapped"), "pos"],
      [T("上方盈亏平衡", "Upside breakeven"), "$" + (S0 + net).toFixed(2), "acc"],
    ]);
    const g = O.positionGreeks(legs, S0, { elapsed: 0, sigma: sc, r });
    $("#ppc-greeks").innerHTML = stats([
      ["Δ", (g.delta * 100).toFixed(0) + T(" 股", " sh")],
      ["Γ", (g.gamma >= 0 ? "+" : "−") + Math.abs(g.gamma * 100).toFixed(2), g.gamma >= 0 ? "pos" : "neg"],
      [T("Θ（每天）", "Θ per day"), (g.theta >= 0 ? "+$" : "−$") + Math.abs(g.theta * 100).toFixed(2), g.theta >= 0 ? "pos" : "neg"],
      [T("ν（每波动率点）", "ν per vol pt"), (g.vega >= 0 ? "+$" : "−$") + Math.abs(g.vega * 100).toFixed(2), g.vega >= 0 ? "pos" : "neg"],
    ]);
    const cols = [[T("只持股", "Shares"), (x) => x - S0], [T("+ 看跌", "+ Put"), (x) => x - S0 + Math.max(Kp - x, 0) - p], [T("领口", "Collar"), (x) => x - S0 + Math.max(Kp - x, 0) - p - Math.max(x - Kc, 0) + c]];
    const money = (x) => (x >= 0 ? "+" : "−") + "$" + Math.abs(x * 100).toFixed(0);
    $("#ppc-table").innerHTML = `<table><tr><th>${T("到期股价", "Price at expiry")}</th>${cols.map(([h]) => `<th>${h}</th>`).join("")}</tr>` +
      [70, 80, 90, 95, 100, 105, 110, 120].map((x) => `<tr${x === 100 ? ' class="hl"' : ""}><td>${x}</td>${cols.map(([, fn]) => `<td style="color:${fn(x) >= 0 ? "var(--green)" : "var(--red)"}">${money(fn(x))}</td>`).join("")}</tr>`).join("") + `</table>`;
  }
  const run = bindSliders(root, { "ppc-kp": (x) => "$" + x, "ppc-kc": (x) => "$" + x, "ppc-d": (x) => x + T(" 天", " days"), "ppc-v": (x) => x + "%", "ppc-sk": (x) => "+" + x, "ppc-e": (x) => x + "%" }, (vals) => { v = vals; draw(); });
  onSeg(root, "ppc-m", (m) => { mode = m; draw(); });
  $("#ppc-zero").addEventListener("click", () => {
    const Tm = v["ppc-d"] / 365, sc = v["ppc-v"] / 100, sp = sc + v["ppc-sk"] / 100;
    const p = O.bsPut(S0, v["ppc-kp"], Tm, r, sp), K = zeroK(p, Tm, sc);
    $("#ppc-kc").value = Math.min(120, Math.round(K * 2) / 2);
    $("#ppc-zmsg").textContent = T(`零成本看涨行权价 ≈ ${K.toFixed(2)}（滑块取最近的 0.5）`, `Zero-cost call strike ≈ ${K.toFixed(2)} (slider set to the nearest 0.5)`);
    mode = "collar";
    root.querySelectorAll('[data-seg="ppc-m"] button').forEach((b) => b.classList.toggle("on", b.dataset.v === "collar"));
    run();
  });
}
