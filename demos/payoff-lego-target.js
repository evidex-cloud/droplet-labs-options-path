// Inline demo for lesson payoff-lego: build the target shape. The target is an expiry payoff (no premiums);
// the reader adds bricks (calls, puts, shares) until the shapes match up to a constant (a constant is just cash).
import * as O from "./_opt.js";
import { lineChart, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const Tm = 30 / 365, r = O.XYZ.r, sigma = O.XYZ.sigma;
  const px = (K, type) => Math.round(O.bsPrice({ S: 100, K, T: Tm, r, sigma, type }) * 100) / 100;
  const C = (K, S) => Math.max(S - K, 0), P = (K, S) => Math.max(K - S, 0);
  const TARGETS = [
    { name: T("跨式：V 形，底在 100", "Straddle: a V with its point at 100"), f: (S) => C(100, S) + P(100, S), hint: T("两端斜率 −1 和 +1，只在 100 拐弯。", "End slopes −1 and +1, one kink at 100.") },
    { name: T("牛市价差：100 到 105 之间上升", "Bull spread: rising between 100 and 105"), f: (S) => C(100, S) - C(105, S), hint: T("斜率 0 → +1 → 0。", "Slopes 0 → +1 → 0.") },
    { name: T("领口：股票被夹在 95 和 105 之间", "Collar: shares boxed between 95 and 105"), f: (S) => S + P(95, S) - C(105, S), hint: T("从股票出发（斜率 +1），在 95 以下拉平、105 以上压平。", "Start from the shares (slope +1), flatten below 95 and above 105.") },
    { name: T("蝶式：95–100–105 的帐篷", "Butterfly: a tent on 95–100–105"), f: (S) => C(95, S) - 2 * C(100, S) + C(105, S), hint: T("斜率变化 +1、−2、+1。", "Slope changes +1, −2, +1.") },
    { name: T("合成做空：斜率处处为 −1", "Synthetic short: slope −1 everywhere"), f: (S) => 100 - S, hint: T("不用股票也行：一张看涨、一张看跌，同一行权价。", "No shares needed: one call and one put at the same strike.") },
  ];
  const BRICKS = [];
  for (const K of [95, 100, 105]) for (const type of ["call", "put"]) for (const side of ["long", "short"]) BRICKS.push({ type, side, K });
  BRICKS.push({ type: "stock", side: "long" }, { type: "stock", side: "short" });
  const bName = (b) => (b.side === "long" ? T("买 ", "+ ") : T("卖 ", "− ")) + (b.type === "stock" ? T("股票", "share") : `${b.K} ${b.type === "call" ? T("看涨", "call") : T("看跌", "put")}`);
  let ti = 0, built = [];
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("照着目标搭形状", "Build the target shape")}</div>
    <div class="demo-row"><div class="demo-meta" id="plt-name"></div></div>
    <div class="demo-btns" id="plt-bricks">${BRICKS.map((b, i) => `<button class="demo-btn" data-brick="${i}">${bName(b)}</button>`).join("")}</div>
    <div class="demo-btns"><button class="demo-btn" id="plt-undo">${T("撤销一步", "Undo")}</button><button class="demo-btn" id="plt-clear">${T("清空", "Clear")}</button><button class="demo-btn" id="plt-next">${T("下一个目标 →", "Next target →")}</button><button class="demo-btn" id="plt-hint">${T("提示", "Hint")}</button></div>
    <div id="plt-out"></div>
    <div id="plt-chart"></div>
    <p class="demo-tip">${T("规则：灰色虚线是目标的到期价值（不含权利金）。整体差一个常数也算对——常数只是一笔现金。先数目标在每个行权价处斜率变了多少，再去点积木。", "Rules: the gray dashed line is the target's expiry payoff (premiums left out). Matching up to a constant counts, because a constant is just cash. Count how much the target's slope changes at each strike before you click.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const payoff = (S) => built.reduce((a, b) => a + (b.side === "long" ? 1 : -1) * (b.type === "stock" ? S : b.type === "call" ? C(b.K, S) : P(b.K, S)), 0);
  const draw = (hint) => {
    const tg = TARGETS[ti];
    $("#plt-name").innerHTML = T("目标 ", "Target ") + `${ti + 1}/${TARGETS.length}: <b>${tg.name}</b>`;
    const xs = O.range(80, 120, 80), diff = xs.map((x) => payoff(x) - tg.f(x));
    const spread = Math.max(...diff) - Math.min(...diff), ok = built.length > 0 && spread < 1e-9, cash = -diff[0];
    const net = built.reduce((a, b) => a + (b.type === "stock" ? (b.side === "long" ? 100 : -100) : (b.side === "long" ? 1 : -1) * px(b.K, b.type)), 0);
    const list = built.length ? built.map(bName).join(T("，", ", ")) : T("（还没有积木）", "(no bricks yet)");
    $("#plt-out").innerHTML = `<div class="demo-log ${ok ? "ok" : built.length ? "warn" : ""}">${ok
      ? T("对上了！", "Match! ") + (Math.abs(cash) > 1e-9 ? T(`形状一致，只差一笔现金 ${cash.toFixed(0)}。`, `Same shape, off only by ${cash.toFixed(0)} in cash.`) : T("形状完全一致。", "The shapes are identical."))
      : T("还没对上：", "Not yet: ") + T(`两条线的差在 ${spread.toFixed(1)} 的范围内变化。`, `the gap between the lines still varies by ${spread.toFixed(1)}.`)}${hint ? " " + T("提示：", "Hint: ") + tg.hint : ""}</div>`
      + stats([[T("你的积木", "Your bricks"), String(built.length), "acc"], [T("今天的净成本/股", "Net cost today / share"), (net < 0 ? "−" : "") + "$" + Math.abs(net).toFixed(2)]])
      + `<div class="demo-meta">${list}</div>`
      + (ok && built.some((b) => b.type !== "stock") ? `<div class="demo-math">${tex(String.raw`\text{${en ? "payoff" : "到期价值"}}(S_T) = \sum_i n_i\,\pi_i(S_T)`, true)}</div>` : "");
    $("#plt-chart").innerHTML = lineChart({
      xmin: 80, xmax: 120, H: 230, xlabel: T("到期时的 XYZ 价格", "XYZ price at expiry"), ylabel: T("到期价值", "Payoff"),
      series: [
        { f: tg.f, cls: 5, dashed: true, label: T("目标", "Target") },
        ...(built.length ? [{ f: payoff, cls: 0, label: T("你搭的", "Yours") }] : []),
      ],
      markers: [{ x: 95, label: "95" }, { x: 100, label: "100" }, { x: 105, label: "105" }],
    });
  };
  $("#plt-bricks").addEventListener("click", (e) => { const b = e.target.closest("[data-brick]"); if (!b || built.length >= 10) return; built.push(BRICKS[+b.dataset.brick]); draw(); });
  $("#plt-undo").addEventListener("click", () => { built.pop(); draw(); });
  $("#plt-clear").addEventListener("click", () => { built = []; draw(); });
  $("#plt-next").addEventListener("click", () => { ti = (ti + 1) % TARGETS.length; built = []; draw(); });
  $("#plt-hint").addEventListener("click", () => draw(true));
  draw();
}
