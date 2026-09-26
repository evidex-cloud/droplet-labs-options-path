// Inline demo for lesson llm-signals: a dictionary ("bag of words") scorer for pre-earnings headlines.
// Type or pick a headline; uncertainty words count +1, calm words −1. Shows exactly what such a scorer sees — and misses.
import { tex } from "./_viz.js";

const LEX = {
  up: ["withdraw", "withdrawn", "withdraws", "probe", "investigation", "delay", "delays", "delayed", "departs", "resigns", "restate", "restates", "warns", "warning", "uncertain", "uncertainty", "volatile", "lawsuit", "recall", "downgrade", "撤回", "调查", "延迟", "离职", "辞职", "预警", "重述", "不确定", "波动", "诉讼", "召回", "下调"],
  calm: ["reaffirms", "reaffirm", "steady", "stable", "on track", "in line", "buyback", "confirms", "raises", "record", "重申", "平稳", "稳定", "按计划", "符合预期", "回购", "上调", "创纪录"],
};

export function scoreText(text) {
  const lower = text.toLowerCase(), hits = [];
  for (const [kind, words] of Object.entries(LEX)) for (const w of words) {
    let i = lower.indexOf(w);
    while (i >= 0) {
      const before = i === 0 ? " " : lower[i - 1], after = lower[i + w.length] || " ";
      const ascii = /[a-z]/.test(w[0]);
      if (!ascii || (!/[a-z]/.test(before) && !/[a-z]/.test(after))) hits.push({ i, len: w.length, kind });
      i = lower.indexOf(w, i + w.length);
    }
  }
  hits.sort((a, b) => a.i - b.i);
  const kept = [];
  for (const h of hits) if (!kept.length || h.i >= kept[kept.length - 1].i + kept[kept.length - 1].len) kept.push(h);
  const s = kept.reduce((a, h) => a + (h.kind === "up" ? 1 : -1), 0);
  return { s, hits: kept };
}

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const examples = en
    ? [["XYZ reaffirms guidance, orders steady ahead of results", "calm"], ["XYZ CFO departs; regulator opens probe into revenue timing", "uncertain"], ["XYZ says outlook is not uncertain and demand is not volatile", "negation trap"], ["XYZ beats on record demand but warns supply delay could last", "mixed"]]
    : [["XYZ 重申业绩指引，财报前订单平稳", "平静"], ["XYZ 首席财务官离职，监管机构就收入确认展开调查", "不确定"], ["XYZ 称前景并非不确定，需求也不存在波动", "否定句陷阱"], ["XYZ 需求创纪录，但预警供应延迟可能持续", "好坏参半"]];
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("词典打分器：它看到了什么，又漏掉了什么", "A dictionary scorer: what it sees, and what it misses")}</div>
    <div class="demo-btns">${examples.map(([, lab], i) => `<button class="demo-btn" data-ex="${i}">${lab}</button>`).join("")}</div>
    <input class="demo-inp" id="lss-in" type="text" value="${examples[1][0]}" aria-label="${T("输入标题", "Type a headline")}">
    <div class="demo-out" id="lss-out"></div>
    <div class="demo-math" id="lss-f"></div>
    <p class="demo-tip">${T("看什么：红色词算 +1（不确定），绿色词算 −1（平静）。试试“否定句陷阱”：词典把“并非不确定”也算成 +1——它只数词，不懂句子。语言模型能读懂否定，但也带来新的风险（本课下文）。", "What to notice: red words count +1 (uncertainty), green words −1 (calm). Try the “negation trap”: the dictionary counts “not uncertain” as +1 — it counts words, it does not read sentences. A language model can read the negation, but brings new risks of its own (see below).")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const draw = () => {
    const text = $("#lss-in").value, { s, hits } = scoreText(text);
    let html = "", p = 0;
    for (const h of hits) { html += esc(text.slice(p, h.i)) + `<mark style="background:var(${h.kind === "up" ? "--red-soft" : "--green-soft"})">${esc(text.slice(h.i, h.i + h.len))}</mark>`; p = h.i + h.len; }
    html += esc(text.slice(p));
    const nu = hits.filter((h) => h.kind === "up").length, nc = hits.length - nu;
    $("#lss-out").innerHTML = html || T("（空）", "(empty)");
    $("#lss-f").innerHTML = tex(String.raw`s = \underbrace{${nu}}_{\text{${T("不确定词", "uncertainty words")}}} - \underbrace{${nc}}_{\text{${T("平静词", "calm words")}}} = ${s} \quad\Rightarrow\quad \text{${s >= 1 ? T("信号：预计波动偏大", "signal: expect a bigger move") : s <= -1 ? T("信号：预计波动偏小", "signal: expect a smaller move") : T("无信号", "no signal")}}`, true);
  };
  $("#lss-in").addEventListener("input", draw);
  root.querySelectorAll("[data-ex]").forEach((b) => b.addEventListener("click", () => { $("#lss-in").value = examples[+b.dataset.ex][0]; draw(); }));
  draw();
}
