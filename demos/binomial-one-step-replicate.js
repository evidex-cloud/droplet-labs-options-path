// Inline demo for lesson binomial-one-step: build the replicating portfolio by hand.
// Choose shares and a bank position; match the call's payoff (20 up, 0 down) in both states.
import { seg, onSeg, slider, bindSliders, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let r = 0;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("亲手复制一张看涨期权", "Copy a call by hand")}</div>
    <p class="demo-meta">${T("世界：XYZ 今天 100，一年后 120 或 80；目标：行权价 100 的看涨期权，上涨付 20、下跌付 0。", "World: XYZ is 100 today, 120 or 80 in a year. Target: the 100-strike call, paying 20 up and 0 down.")}</p>
    <div class="demo-row">${seg("bor-rate", [["0", T("利率 0", "Rate 0%")], ["0.04", T("利率 4%", "Rate 4%")]], "0")}
      <div class="demo-btns" style="margin:0"><button class="demo-btn" data-ans="1">${T("给我答案", "Show me the answer")}</button></div></div>
    <div class="demo-grid">
      ${slider("bor-sh", T("持有股数 Δ（每份期权）", "Shares held Δ (per option)"), 0, 1, 0.05, 0.25)}
      ${slider("bor-cash", T("到期时银行账户（负 = 要还的借款）", "Bank balance at expiry (negative = loan to repay)"), -80, 40, 1, 0)}
    </div>
    <div id="bor-bars"></div>
    <div class="demo-math" id="bor-f"></div>
    <div id="bor-msg"></div>
    <p class="demo-tip">${T("提示：先只调股数，让“上涨减下跌”的差等于 20；再调现金，把两行一起平移到位。切到 4% 利率：股数不变，但同一笔借款今天借得更少，期权就更贵。", "Hint: first set the shares so that the up-minus-down gap is 20; then move the cash to shift both rows into place. Switch to 4%: the shares stay the same, but the same loan costs less today, so the call is dearer.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const bar = (label, val, target) => {
    const w = (x) => Math.max(0, Math.min(100, ((x + 40) / 80) * 100));
    return `<div class="bar2"><span class="lab" style="width:140px">${label}</span><span class="track" style="position:relative"><span class="fill" style="display:block;width:${w(val)}%;background:var(--orange)"></span><span style="position:absolute;top:-3px;bottom:-3px;left:${w(target)}%;width:3px;background:var(--green)"></span></span><span class="val">${val.toFixed(2)} / ${target}</span></div>`;
  };
  const draw = (v) => {
    const sh = v["bor-sh"], cashT = v["bor-cash"], g = Math.exp(r);
    const up = sh * 120 + cashT, dn = sh * 80 + cashT, today = sh * 100 + cashT / g;
    $("#bor-bars").innerHTML =
      bar(T("上涨（S = 120）", "Up (S = 120)"), up, 20) + bar(T("下跌（S = 80）", "Down (S = 80)"), dn, 0) +
      `<p class="demo-meta">${T("蓝条 = 你的组合到期价值；绿线 = 看涨期权的回报。", "Blue bar = your portfolio at expiry; green tick = what the call pays.")}</p>`;
    const sgn = (x) => (x < 0 ? "-" : "+");
    const pv = r === 0 ? `${Math.abs(cashT)}` : String.raw`${Math.abs(cashT)}\,e^{-0.04}`;
    $("#bor-f").innerHTML =
      tex(String.raw`\text{${T("上涨", "up")}}: ${sh.toFixed(2)} \times 120 ${sgn(cashT)} ${Math.abs(cashT)} = ${up.toFixed(2)}`, true) +
      tex(String.raw`\text{${T("下跌", "down")}}: ${sh.toFixed(2)} \times 80 ${sgn(cashT)} ${Math.abs(cashT)} = ${dn.toFixed(2)}`, true) +
      tex(String.raw`\text{${T("今天的成本", "cost today")}} = ${sh.toFixed(2)} \times 100 ${sgn(cashT)} ${pv} = ${today.toFixed(2)}`, true);
    const ok = Math.abs(up - 20) < 0.01 && Math.abs(dn) < 0.01;
    $("#bor-msg").innerHTML = ok
      ? `<div class="demo-log ok"><div>${T("完全复制！两种状态都与期权一致，所以期权今天只能值 ", "Perfect copy! Both states match the call, so today the call must be worth ")}<b>$${today.toFixed(2)}</b>${T("。", ".")}</div></div>`
      : `<div class="demo-log warn">${T("还差一点：上涨差 ", "Not yet: up state off by ")}${(up - 20).toFixed(2)}${T("，下跌差 ", ", down state off by ")}${dn.toFixed(2)}${T("。", ".")}</div>`;
  };
  const run = bindSliders(root, { "bor-sh": (x) => x.toFixed(2), "bor-cash": (x) => (x < 0 ? "−$" : "$") + Math.abs(x) }, draw);
  onSeg(root, "bor-rate", (x) => { r = +x; run(); });
  root.querySelector("[data-ans]").addEventListener("click", () => { $("#bor-sh").value = 0.5; $("#bor-cash").value = -40; run(); });
}
