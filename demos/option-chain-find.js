// Inline demo for lesson option-chain: three reading tasks on a compact XYZ chain with $1 strikes —
// find the 25-delta put, read the implied move from the ATM straddle, and check parity on any row.
import * as O from "./_opt.js";
import { seg, onSeg, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S = 100, r = 0.04, sigma = 0.2;
  const STRIKES = Array.from({ length: 17 }, (_, i) => 92 + i);
  let task = "delta", days = 30, picked = null;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("读表小任务：在期权链上找答案", "Chain drills: find the answer on the board")}</div>
    <div class="demo-row">${seg("ocf-task", [["delta", T("找 25 Delta 看跌", "Find the 25-delta put")], ["move", T("读隐含波动幅度", "Read the implied move")], ["parity", T("核对平价", "Check parity")]], task)}
      ${seg("ocf-days", [["7", T("7 天", "7 d")], ["30", T("30 天", "30 d")], ["60", T("60 天", "60 d")]], "30")}</div>
    <p class="demo-meta" id="ocf-q"></p>
    <div id="ocf-tab"></div>
    <div class="demo-log" id="ocf-log"></div>
    <p class="demo-tip">${T("看什么：25 Delta 看跌离现价有多远，取决于到期时间——7 天时它就在现价下方一点点，60 天时远得多；隐含波动幅度大约随 √T 增长。",
      "What to notice: how far below the price the 25-delta put sits depends on time — at 7 days it hugs the price, at 60 days it is much further out; the implied move grows roughly like √T.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const prompts = {
    delta: T("任务：点出 Delta 最接近 −0.25 的看跌期权的行权价。", "Task: click the strike whose put delta is closest to −0.25."),
    move: T("任务：点出平值行权价，读出平值跨式隐含的波动幅度。", "Task: click the at-the-money strike and read the move implied by the straddle."),
    parity: T("任务：点任意一行，核对 ", "Task: click any row and check whether ") + tex(String.raw`C - P = S - Ke^{-rT}`) + T(" 是否成立。", " holds."),
  };
  const draw = () => {
    const Tm = days / 365;
    $("#ocf-q").innerHTML = prompts[task];
    let h = `<table><thead><tr><th>${T("看涨中间价", "Call mid")}</th><th>${T("看涨 Δ", "Call Δ")}</th><th style="text-align:center">K</th><th>${T("看跌中间价", "Put mid")}</th><th>${T("看跌 Δ", "Put Δ")}</th></tr></thead><tbody>`;
    for (const K of STRIKES) {
      const c = O.greeks({ S, K, T: Tm, r, sigma, type: "call" }), p = O.greeks({ S, K, T: Tm, r, sigma, type: "put" });
      h += `<tr class="${K === picked ? "hl" : ""}"><td>${c.price.toFixed(2)}</td><td>${c.delta.toFixed(2)}</td><td style="text-align:center"><button type="button" class="demo-btn" data-k="${K}" style="min-height:28px;padding:3px 10px">${K}</button></td><td>${p.price.toFixed(2)}</td><td>${p.delta.toFixed(2).replace("-", "−")}</td></tr>`;
    }
    $("#ocf-tab").innerHTML = h + "</tbody></table>";
    root.querySelectorAll("[data-k]").forEach((b) => b.addEventListener("click", () => { picked = +b.dataset.k; answer(); draw(); }));
  };
  const answer = () => {
    const Tm = days / 365, K = picked;
    const c = O.greeks({ S, K, T: Tm, r, sigma, type: "call" }), p = O.greeks({ S, K, T: Tm, r, sigma, type: "put" });
    let out = "";
    if (task === "delta") {
      const best = STRIKES.reduce((a, b) => (Math.abs(O.greeks({ S, K: b, T: Tm, r, sigma, type: "put" }).delta + 0.25) < Math.abs(O.greeks({ S, K: a, T: Tm, r, sigma, type: "put" }).delta + 0.25) ? b : a));
      const ok = K === best;
      out = `<span class="${ok ? "ok" : "bad"}">${ok ? T("对了！", "Correct!") : T("还不是。", "Not quite.")} ${T(`${K} 看跌的 Delta 是 ${p.delta.toFixed(3).replace("-", "−")}；最接近 −0.25 的是 ${best}。`, `The ${K} put has delta ${p.delta.toFixed(3).replace("-", "−")}; the closest to −0.25 is ${best}.`)}</span>
        <span>${T(`${days} 天时，25 Delta 看跌在现价下方约 ${(100 - best)} 美元。`, `At ${days} days the 25-delta put sits about $${100 - best} below the price.`)}</span>`;
    } else if (task === "move") {
      const ok = K === 100, st = c.price + p.price, em = O.expectedMove(S, sigma, Tm);
      out = ok
        ? `<span class="ok">${T("对了：平值是 100。", "Correct: the ATM strike is 100.")}</span>${tex(String.raw`C + P = ${c.price.toFixed(2)} + ${p.price.toFixed(2)} = ${st.toFixed(2)} \;\Rightarrow\; \pm ${((st / S) * 100).toFixed(1)}\% \qquad 0.8\,S\sigma\sqrt{T} = ${(0.8 * em).toFixed(2)}`, true)}`
        : `<span class="bad">${T(`${K} 不是平值；平值行权价是最接近现价 100 的那一行。`, `${K} is not at the money; the ATM strike is the row closest to the price of 100.`)}</span>`;
    } else {
      const pv = K * Math.exp(-r * Tm);
      out = `<span class="ok">${T(`行权价 ${K}：`, `Strike ${K}:`)}</span>${tex(String.raw`C - P = ${c.price.toFixed(2)} - ${p.price.toFixed(2)} = ${(c.price - p.price).toFixed(2)}, \qquad S - Ke^{-rT} = 100 - ${pv.toFixed(2)} = ${(S - pv).toFixed(2)}`, true)}`;
    }
    $("#ocf-log").innerHTML = out;
  };
  const hint = () => { $("#ocf-log").innerHTML = T("点表格中间一列的行权价来作答。", "Click a strike in the middle column to answer."); };
  onSeg(root, "ocf-task", (v) => { task = v; picked = null; hint(); draw(); });
  onSeg(root, "ocf-days", (v) => { days = +v; if (picked != null) answer(); draw(); });
  hint();
  draw();
}
