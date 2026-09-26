// Inline demo for lesson mark-index-last: how mean, median and a filtered mean react to broken spot venues.
import { seg, onSeg, slider, bindSliders, stats, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const GOOD = [100020, 99980, 100050, 100000, 100010];
  let broken = 1;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("指数配方：一家坏交易所能把指数拖多远？", "Index recipes: how far can a broken venue drag the index?")}</div>
    <div class="demo-row"><span class="demo-label" style="margin:0">${T("出故障的交易所数量", "Number of broken venues")}</span>${seg("mil-n", [["1", "1"], ["2", "2"], ["3", "3"]], "1")}</div>
    ${slider("mil-bad", T("故障交易所的报价", "Price quoted by the broken venue(s)"), 80000, 120000, 500, 93000)}
    <div id="mil-venues" class="demo-meta"></div>
    <div id="mil-bars"></div>
    <div class="demo-math" id="mil-f"></div>
    <div id="mil-stats"></div>
    <p class="demo-tip">${T("看什么：只坏一家时，中位数和过滤平均几乎不动，简单平均却被拖走。把故障交易所调到 3 家（超过一半）：中位数也被“绑架”了——稳健的配方防的是少数坏报价，不是多数。", "What to notice: with one broken venue the median and the filtered mean barely move while the plain mean is dragged away. Set three broken venues (a majority): now the median is captured too. These recipes protect against a minority of bad quotes, not a majority.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const fmt0 = (x) => Math.round(x).toLocaleString("en-US");
  const tn = (x) => Math.round(x).toLocaleString("en-US").replace(/,/g, "{,}");
  const run = bindSliders(root, { "mil-bad": (x) => "$" + fmt0(x) }, (v) => {
    const bad = v["mil-bad"];
    const px = GOOD.map((p, i) => (i >= GOOD.length - broken ? bad : p));
    const mean = px.reduce((a, b) => a + b, 0) / px.length;
    const sorted = [...px].sort((a, b) => a - b), median = sorted[2];
    const valid = px.filter((p) => Math.abs(p / median - 1) <= 0.01);
    const trimmed = valid.reduce((a, b) => a + b, 0) / valid.length;
    $("#mil-venues").innerHTML = px.map((p, i) => `<span class="tag${i >= GOOD.length - broken ? " bad" : ""}">${"ABCDE"[i]} ${fmt0(p)}</span>`).join(" ");
    const bar = (label, val, color) => {
      const dev = val / 100000 - 1, w = Math.min(100, Math.abs(dev) * 100 * 8);
      return `<div class="bar2"><span class="lab" style="width:130px">${label}</span><span class="track"><span class="fill" style="display:block;width:${w}%;background:${color}"></span></span><span class="val">${fmt0(val)}</span></div>`;
    };
    $("#mil-bars").innerHTML = `<p class="demo-meta">${T("柱长 = 偏离真实现货 100,000 的程度（每格放大 8 倍）", "Bar length = distance from the true spot price of 100,000 (magnified 8×)")}</p>` +
      bar(T("简单平均", "Plain mean"), mean, "var(--red)") +
      bar(T("中位数", "Median"), median, "var(--orange)") +
      bar(T("过滤后平均（±1%）", "Filtered mean (±1%)"), trimmed, "var(--green)");
    $("#mil-f").innerHTML = tex(String.raw`\bar P = \tfrac{1}{5}\textstyle\sum_i P_i = ${tn(mean)},\qquad \operatorname{median}(P_1,\dots,P_5) = ${tn(median)},\qquad \bar P_{\pm 1\%} = ${tn(trimmed)}\ (${valid.length}\ \text{${T("家有效", "valid")}})`, true);
    $("#mil-stats").innerHTML = stats([
      [T("简单平均的误差", "Error of the mean"), (mean - 100000 >= 0 ? "+" : "−") + fmt0(Math.abs(mean - 100000)), Math.abs(mean - 100000) > 200 ? "neg" : "pos"],
      [T("中位数的误差", "Error of the median"), (median - 100000 >= 0 ? "+" : "−") + fmt0(Math.abs(median - 100000)), Math.abs(median - 100000) > 200 ? "neg" : "pos"],
      [T("过滤平均的误差", "Error of the filtered mean"), (trimmed - 100000 >= 0 ? "+" : "−") + fmt0(Math.abs(trimmed - 100000)), Math.abs(trimmed - 100000) > 200 ? "neg" : "pos"],
    ]);
  });
  onSeg(root, "mil-n", (n) => { broken = +n; run(); });
}
