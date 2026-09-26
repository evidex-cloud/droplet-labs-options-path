// Inline demo for lesson execution-tca: implementation shortfall, split into delay, execution, opportunity cost and fees.
// Example: Kai decides to buy 20 XYZ 30-day 100 calls when the mid is 2.45.
import { slider, bindSliders, stats, tex } from "./_viz.js";

export function shortfall({ decision = 2.45, arrival = 2.48, fill = 2.53, filled = 15, target = 20, end = 2.6, fee = 0.65 }) {
  const m = 100;
  const delay = filled * (arrival - decision) * m;
  const exec = filled * (fill - arrival) * m;
  const opp = (target - filled) * (end - decision) * m;
  const fees = filled * fee;
  const total = delay + exec + opp + fees;
  return { delay, exec, opp, fees, total, paper: target * decision * m };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("执行缺口：纸面组合与真实组合差在哪", "Implementation shortfall: where the paper and the real portfolio part ways")}</div>
    <p class="demo-meta">${T("小凯决定买入 20 张 XYZ 30 天 100 看涨，决策时中间价 2.45；手续费按每张 0.65 美元示意。", "Kai decides to buy 20 XYZ 30-day 100 calls when the mid is 2.45; fees are an illustrative $0.65 per contract.")}</p>
    <div class="demo-grid">
      ${slider("tis-a", T("下单到达时的中间价", "Mid when the order arrives"), 2.4, 2.6, 0.01, 2.48)}
      ${slider("tis-p", T("成交均价", "Average fill price"), 2.4, 2.7, 0.01, 2.53)}
      ${slider("tis-q", T("成交张数（共 20 张）", "Contracts filled (of 20)"), 0, 20, 1, 15)}
      ${slider("tis-e", T("收尾时的中间价", "Mid at the end"), 2.3, 2.8, 0.01, 2.6)}
    </div>
    <div class="demo-math" id="tis-f"></div>
    <div id="tis-bars"></div>
    <div id="tis-stats"></div>
    <p class="demo-tip">${T("看什么：把成交张数拉到 20，机会成本归零；把到达价拉回 2.45，延迟成本消失。四块加起来就是“纸面收益 − 真实收益”。价格往下走时，没成交的部分反而是负成本——执行缺口衡量的是结果，不只是运气好坏。", "What to notice: fill all 20 and the opportunity cost vanishes; set the arrival mid back to 2.45 and the delay cost disappears. The four pieces add up to 'paper return minus real return'. If the price falls, the unfilled part becomes a negative cost — shortfall measures outcomes, luck included.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  bindSliders(root, { "tis-a": (x) => "$" + x.toFixed(2), "tis-p": (x) => "$" + x.toFixed(2), "tis-q": String, "tis-e": (x) => "$" + x.toFixed(2) }, (v) => {
    const s = shortfall({ arrival: v["tis-a"], fill: v["tis-p"], filled: v["tis-q"], end: v["tis-e"] });
    const f = (x) => (x < 0 ? "-" : "") + String.raw`\$` + Math.abs(x).toFixed(2);
    $("#tis-f").innerHTML = tex(String.raw`\text{IS} = \underbrace{${f(s.delay)}}_{\text{${T("延迟", "delay")}}} + \underbrace{${f(s.exec)}}_{\text{${T("执行", "execution")}}} + \underbrace{${f(s.opp)}}_{\text{${T("机会", "opportunity")}}} + \underbrace{${f(s.fees)}}_{\text{${T("手续费", "fees")}}}`, true) + tex(String.raw`\text{IS} = ${f(s.total)}`, true);
    const max = Math.max(1, ...[s.delay, s.exec, s.opp, s.fees].map(Math.abs));
    const bar = (label, val) => `<div class="bar2"><span class="lab" style="width:150px">${label}</span><span class="track"><span class="fill" style="display:block;width:${(Math.abs(val) / max) * 100}%;background:${val >= 0 ? "var(--red)" : "var(--green)"}"></span></span><span class="val">${val < 0 ? "−" : ""}$${Math.abs(val).toFixed(2)}</span></div>`;
    $("#tis-bars").innerHTML = bar(T("延迟成本", "Delay"), s.delay) + bar(T("执行成本", "Execution"), s.exec) + bar(T("机会成本", "Opportunity"), s.opp) + bar(T("手续费", "Fees"), s.fees);
    $("#tis-stats").innerHTML = stats([
      [T("纸面组合的成本", "Paper portfolio cost"), "$" + s.paper.toFixed(0)],
      [T("执行缺口合计", "Total shortfall"), (s.total < 0 ? "−$" : "$") + Math.abs(s.total).toFixed(2), s.total > 0 ? "neg" : "pos"],
      [T("占纸面金额", "As % of paper"), ((s.total / s.paper) * 100).toFixed(2) + "%", "acc"],
    ]);
  });
}
