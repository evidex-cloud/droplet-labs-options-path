// Inline demo for lesson put-call-parity: portfolio A (call + bill paying K) and portfolio B (put + share)
// have the same value at expiry, leg by leg, for every final price.
import { lineChart, seg, onSeg, slider, bindSliders, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const K = 100;
  let view = "both";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("两堆积木，同一个形状", "Two piles of Lego, one shape")}</div>
    ${slider("pcp-st", T("XYZ 到期价 S<sub>T</sub>", "XYZ at expiry S<sub>T</sub>"), 40, 160, 1, 120)}
    ${seg("pcp-view", [["both", T("两个组合", "Both portfolios")], ["A", T("A：看涨 + 国库券", "A: call + bill")], ["B", T("B：看跌 + 股票", "B: put + share")]], view)}
    <div class="demo-math" id="pcp-f"></div>
    <div id="pcp-chart"></div>
    <p class="demo-tip">${T("看什么：不管把到期价拖到哪里，A 和 B 的总价值那两条粗线始终重合；单独看每一条腿，它们长得完全不一样。", "What to notice: wherever you drag the expiry price, the two thick total lines stay on top of each other, even though the individual legs look nothing alike.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  let st = 120;
  const draw = () => {
    const call = Math.max(st - K, 0), put = Math.max(K - st, 0);
    $("#pcp-f").innerHTML = tex(String.raw`\underbrace{\max(S_T - 100,0)}_{\text{${T("看涨", "call")}}\;=\;${call.toFixed(0)}} + \underbrace{100}_{\text{${T("国库券", "bill")}}} = ${(call + K).toFixed(0)} \;=\; \underbrace{\max(100 - S_T,0)}_{\text{${T("看跌", "put")}}\;=\;${put.toFixed(0)}} + \underbrace{S_T}_{\text{${T("股票", "share")}}\;=\;${st.toFixed(0)}}`, true);
    const s = [];
    if (view !== "B") s.push(
      { f: (x) => Math.max(x - K, 0), cls: 0, dashed: true, label: T("看涨", "call") },
      { f: () => K, cls: 5, dashed: true, label: T("国库券（到期付 100）", "bill (pays 100)") },
      { f: (x) => Math.max(x - K, 0) + K, cls: 0, label: T("A 合计", "A total") });
    if (view !== "A") s.push(
      { f: (x) => Math.max(K - x, 0), cls: 1, dashed: true, label: T("看跌", "put") },
      { f: (x) => x, cls: 4, dashed: true, label: T("股票", "share") },
      { f: (x) => Math.max(K - x, 0) + x, cls: 1, label: T("B 合计", "B total") });
    $("#pcp-chart").innerHTML = lineChart({
      xmin: 40, xmax: 160, ymin: 0, ymax: 170, xlabel: T("到期时的 XYZ 价格", "XYZ price at expiry"), ylabel: T("到期价值", "Value at expiry"),
      series: s, markers: [{ x: K, label: "K = 100" }],
      points: [{ x: st, y: Math.max(st, K), cls: view === "B" ? 1 : 0, label: "A = B = " + Math.max(st, K).toFixed(0) }],
    });
  };
  bindSliders(root, { "pcp-st": (x) => "$" + x }, (v) => { st = v["pcp-st"]; draw(); });
  onSeg(root, "pcp-view", (v) => { view = v; draw(); });
}
