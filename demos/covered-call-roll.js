// Inline demo for lesson covered-call: day 20 of Kai's 30-day 105 covered call. Where is XYZ? Compare three choices:
// keep the call, roll out (same strike, 40 more days) or roll up and out (110 strike, 40 days). Priced with Black-Scholes.
import * as O from "./_opt.js";
import { slider, bindSliders, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const r = 0.04, sigma = 0.2, c0 = O.bsCall(100, 105, 30 / 365, r, sigma);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("第 20 天：要不要展期？", "Day 20: should Kai roll?")}</div>
    <div class="demo-meta">${T(`小凯在第 0 天以 100 买股、以 ${c0.toFixed(2)} 卖出 30 天 105 看涨。现在过了 20 天，看涨还剩 10 天。`, `On day 0 Kai owned the shares at 100 and sold the 30-day 105 call for ${c0.toFixed(2)}. Twenty days have passed; the call has 10 days left.`)}</div>
    ${slider("ccr-s", T("第 20 天的 XYZ 价格", "XYZ price on day 20"), 95, 115, 0.5, 106)}
    <div class="cmp-3" id="ccr-cards"></div>
    <div class="demo-math" id="ccr-f"></div>
    <p class="demo-tip">${T("看什么：股价越高，买回旧看涨越贵。“同价展期”几乎总能收到净权利金，但天花板没动；“上移并展期”抬高了天花板，却可能要倒贴钱。展期不是免费的：它只是把一个新决定和旧仓位绑在一起。", "What to notice: the higher the stock, the more it costs to buy back the old call. Rolling out at the same strike almost always brings in a net credit but leaves the ceiling where it was; rolling up and out raises the ceiling but may cost money. A roll is never free — it is a new decision bundled with the old position.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  bindSliders(root, { "ccr-s": (x) => "$" + x.toFixed(1) }, (v) => {
    const S = v["ccr-s"];
    const buy = O.bsCall(S, 105, 10 / 365, r, sigma), tv = buy - Math.max(S - 105, 0);
    const out = O.bsCall(S, 105, 40 / 365, r, sigma), upout = O.bsCall(S, 110, 40 / 365, r, sigma);
    const netOut = out - buy, netUp = upout - buy;
    const sgn = (x) => (x >= 0 ? "+$" + (x * 100).toFixed(0) + T("（净收）", " credit") : "−$" + (-x * 100).toFixed(0) + T("（净付）", " debit"));
    const card = (h, lines, hl) => `<div class="cmp-cell${hl ? " hl" : ""}"><h5>${h}</h5><div class="kv">${lines.map(([k, val]) => `<span class="k">${k}</span><span class="v">${val}</span>`).join("")}</div></div>`;
    $("#ccr-cards").innerHTML =
      card(T("A · 不动，等到期", "A · Hold to expiry"), [
        [T("买回价（参考）", "Buy-back (ref.)"), "$" + (buy * 100).toFixed(0)],
        [T("剩余时间价值", "Time value left"), "$" + (tv * 100).toFixed(0)],
        [T("天花板", "Ceiling"), "105"],
        [T("最大盈利（共 30 天）", "Max profit (30 d total)"), "$" + ((5 + c0) * 100).toFixed(0)],
      ]) +
      card(T("B · 同价展期：105，再 40 天", "B · Roll out: 105, 40 more days"), [
        [T("卖出新看涨", "Sell new call"), "$" + (out * 100).toFixed(0)],
        [T("这次展期", "This roll"), sgn(netOut)],
        [T("天花板", "Ceiling"), "105"],
        [T("最大盈利（共 60 天）", "Max profit (60 d total)"), "$" + ((5 + c0 + netOut) * 100).toFixed(0)],
      ], netOut >= 0) +
      card(T("C · 上移展期：110，再 40 天", "C · Roll up and out: 110, 40 days"), [
        [T("卖出新看涨", "Sell new call"), "$" + (upout * 100).toFixed(0)],
        [T("这次展期", "This roll"), sgn(netUp)],
        [T("天花板", "Ceiling"), "110"],
        [T("最大盈利（共 60 天）", "Max profit (60 d total)"), "$" + ((10 + c0 + netUp) * 100).toFixed(0)],
      ], netUp >= 0);
    $("#ccr-f").innerHTML = tex(String.raw`\begin{gathered}\text{${T("展期净额", "net roll")}} = c_{\text{${T("新", "new")}}} - c_{\text{${T("旧（买回）", "old (buy back)")}}} \\ = ${upout.toFixed(2)} - ${buy.toFixed(2)} = ${netUp >= 0 ? "+" : ""}${netUp.toFixed(2)} \quad (110,\ 40\ \text{${T("天", "days")}})\end{gathered}`, true);
  });
}
