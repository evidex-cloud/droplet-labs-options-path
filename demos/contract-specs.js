// Main demo for lesson contract-specs: build an OCC/OSI option symbol from its parts, and parse one back.
// Also prices the chosen contract with Black-Scholes (XYZ: S 100, σ 20%, r 4%) and shows the ×100 arithmetic.
import * as O from "./_opt.js";
import { seg, onSeg, slider, bindSliders, stats, tex, esc } from "./_viz.js";

const TODAY = Date.UTC(2026, 8, 16); // lesson date: Wednesday 16 Sep 2026, 30 days before the October monthly
const DAY = 86400000;
// Fridays from 18 Sep 2026 for ~16 weeks, flagging the third Friday of each month as the standard monthly
function expiries() {
  const out = [];
  const HOLIDAYS = new Set([Date.UTC(2026, 11, 25), Date.UTC(2027, 0, 1)]); // exchange holidays on a Friday: expiry moves to Thursday
  for (let f = Date.UTC(2026, 8, 18); f <= Date.UTC(2027, 0, 29); f += 7 * DAY) {
    const hol = HOLIDAYS.has(f), t = hol ? f - DAY : f;
    const d = new Date(t), fd = new Date(f).getUTCDate();
    out.push({ t, y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), monthly: fd >= 15 && fd <= 21, hol });
  }
  return out;
}
const p2 = (x) => String(x).padStart(2, "0");

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const EXP = expiries();
  let type = "C", ei = EXP.findIndex((e) => e.m === 10 && e.d === 16);
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("期权代码生成器 / 解析器（OCC 格式）", "Option symbol builder / parser (OCC format)")}</div>
    <div class="demo-block">
      <div class="demo-label">${T("① 组装一张合约", "① Build a contract")}</div>
      <div class="demo-row">
        <label class="demo-label" for="cs-root">${T("标的代码", "Root")}</label><input class="demo-inp mono" id="cs-root" value="XYZ" maxlength="6" size="7">
        ${seg("cs-type", [["C", T("看涨 C", "Call C")], ["P", T("看跌 P", "Put P")]], type)}
      </div>
      <div class="demo-row"><label class="demo-label" for="cs-exp">${T("到期日", "Expiry")}</label><select class="demo-sel" id="cs-exp">${EXP.map((e, i) => `<option value="${i}"${i === ei ? " selected" : ""}>${e.y}-${p2(e.m)}-${p2(e.d)} · ${e.monthly ? T("月度（第三个周五）", "monthly (3rd Friday)") : T("周度", "weekly")}${e.hol ? T("，周五休市提前到周四", ", Friday holiday so Thursday") : ""}</option>`).join("")}</select></div>
      <div class="demo-grid">
        ${slider("cs-k", T("行权价 K", "Strike K"), 80, 120, 2.5, 105)}
        ${slider("cs-n", T("合约张数", "Contracts"), 1, 10, 1, 1)}
      </div>
      <div class="demo-out" id="cs-sym" aria-live="polite"></div>
      <div class="demo-math" id="cs-f"></div>
      <div id="cs-stats"></div>
    </div>
    <div class="demo-block">
      <div class="demo-label">${T("② 解析一个代码（可以自己输入）", "② Parse a symbol (type your own)")}</div>
      <input class="demo-inp mono" id="cs-in" value="XYZ   261120P00095000" style="width:100%;max-width:340px">
      <div id="cs-parse"></div>
    </div>
    <p class="demo-tip">${T("试试：把行权价拉到 97.5，看最后 8 位怎么变成 00097500（行权价 × 1000，补零到 8 位）。再把到期日换成不同的周五——只有每月第三个周五是标准月度到期日。", "Try this: set the strike to 97.5 and watch the last eight digits become 00097500 (strike × 1000, zero-padded to 8). Then switch expiries — only the third Friday of each month is the standard monthly.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const colour = (txt, cls) => `<span class="tag ${cls}" style="font-family:var(--mono);font-size:.95rem;white-space:pre">${esc(txt)}</span>`;
  const draw = (v) => {
    const K = v["cs-k"], n = v["cs-n"], e = EXP[ei];
    const rootSym = ($("#cs-root").value || "XYZ").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6) || "XYZ";
    const ymd = `${String(e.y).slice(2)}${p2(e.m)}${p2(e.d)}`, strike = String(Math.round(K * 1000)).padStart(8, "0");
    const sym = rootSym.padEnd(6, " ") + ymd + type + strike;
    $("#cs-sym").innerHTML = `${colour(rootSym.padEnd(6, " "), "hl")}${colour(ymd, "")}${colour(type, "ok")}${colour(strike, "bad")}
      <div class="demo-out-sm">${T("标的（补空格到 6 位）", "root (padded to 6)")} · ${T("到期 YYMMDD", "expiry YYMMDD")} · C/P · ${T("行权价 × 1000（8 位）", "strike × 1000 (8 digits)")}</div>
      <div class="demo-out-sm">${T("完整代码（21 个字符）：", "Full symbol (21 characters): ")}<code>${esc(sym)}</code></div>`;
    const days = Math.round((e.t - TODAY) / DAY), Tm = days / 365; // calendar days, course convention T = days/365
    const px = Math.round(O.bsPrice({ S: 100, K, T: Tm, r: 0.04, sigma: 0.2, type: type === "C" ? "call" : "put" }) * 100) / 100;
    const cost = px * 100 * n, notional = 100 * 100 * n;
    $("#cs-f").innerHTML = tex(String.raw`\text{${T("成本", "cost")}} = ${px.toFixed(2)} \times 100 \times ${n} = \$${cost.toLocaleString("en-US", { maximumFractionDigits: 0 }).replace(/,/g, "{,}")}`, true)
      + tex(String.raw`\text{${T("名义价值", "notional")}} = S \times 100 \times ${n} = 100 \times 100 \times ${n} = \$${notional.toLocaleString("en-US").replace(/,/g, "{,}")}`, true);
    $("#cs-stats").innerHTML = stats([
      [T("离到期天数（自 2026-09-16）", "Days to expiry (from 2026-09-16)"), String(days)],
      [T("理论权利金（每股）", "Model premium per share"), "$" + px.toFixed(2)],
      [T("每张合约的价格", "Price per contract"), "$" + (px * 100).toFixed(0), "acc"],
      [T("权利金占名义价值", "Premium as % of notional"), ((cost / notional) * 100).toFixed(2) + "%"],
    ]);
  };
  const run = bindSliders(root, { "cs-k": (x) => "$" + x.toFixed(1), "cs-n": (x) => String(x) }, draw);
  onSeg(root, "cs-type", (v) => { type = v; run(); });
  $("#cs-exp").addEventListener("change", () => { ei = +$("#cs-exp").value || 0; run(); });
  $("#cs-root").addEventListener("input", run);
  const parse = () => {
    const raw = ($("#cs-in").value || "").toUpperCase();
    const m = raw.match(/^([A-Z0-9]{1,6})\s*(\d{2})(\d{2})(\d{2})([CP])(\d{8})$/);
    if (!m) {
      $("#cs-parse").innerHTML = `<div class="demo-log"><span class="bad">${T("看不懂这个代码。格式是：标的（1–6 位）+ 空格补齐 + YYMMDD + C 或 P + 8 位数字。", "Can't read that. Format: root (1–6 chars) + padding + YYMMDD + C or P + 8 digits.")}</span></div>`;
      return;
    }
    const [, r, yy, mm, dd, cp, k8] = m, K = +k8 / 1000;
    const mo = +mm, d = +dd, valid = mo >= 1 && mo <= 12 && d >= 1 && d <= 31;
    const wd = valid ? new Date(Date.UTC(2000 + +yy, mo - 1, d)).getUTCDay() : -1;
    const third = wd === 5 && d >= 15 && d <= 21;
    $("#cs-parse").innerHTML = `<div class="kv" style="margin-top:10px">
      <span class="k">${T("标的", "Underlying")}</span><span class="v hl">${esc(r)}</span>
      <span class="k">${T("到期日", "Expiry")}</span><span class="v">20${yy}-${mm}-${dd}${valid ? (wd === 5 ? (third ? T("（周五，第三个周五 = 标准月度）", " (Friday, third Friday = standard monthly)") : T("（周五，周度到期）", " (Friday, a weekly)")) : T("（不是周五：可能是周一/周三等短期到期，或节假日调整）", " (not a Friday: a Monday/Wednesday short-dated expiry, or a holiday shift)")) : T("（日期无效）", " (invalid date)")}</span>
      <span class="k">${T("类型", "Type")}</span><span class="v">${cp === "C" ? T("看涨（买入的权利）", "call (right to buy)") : T("看跌（卖出的权利）", "put (right to sell)")}</span>
      <span class="k">${T("行权价", "Strike")}</span><span class="v">${k8} ÷ 1000 = $${K.toFixed(3)}</span>
    </div>`;
  };
  $("#cs-in").addEventListener("input", parse);
  parse();
}
