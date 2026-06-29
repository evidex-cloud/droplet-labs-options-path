// 交互演示：看跌看涨平价探索器
// 滑块 S/K/T/r/IV，用 bsPrice 同时算看涨与看跌，并排显示平价两边 LHS=C−P 与 RHS=S−K·e^(−rT)，
// 它们恒等。再用"人为错价"滑块推偏看涨报价，立刻显示由此打开的无风险套利利润。
import { bsPrice } from "./_bs.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">⚖️ ${T("看跌看涨平价：C − P = S − K·e^(−rT)", "Put-Call Parity: C − P = S − K·e^(−rT)")}</div>

      <div class="demo-grid-3">
        <div class="demo-block"><label class="demo-label">${T("标的价 S", "Spot S")} = <b id="pe-s-v">100</b></label><input class="demo-slider" id="pe-s" type="range" min="70" max="130" step="1" value="100"/></div>
        <div class="demo-block"><label class="demo-label">${T("行权价 K", "Strike K")} = <b id="pe-k-v">100</b></label><input class="demo-slider" id="pe-k" type="range" min="70" max="130" step="1" value="100"/></div>
        <div class="demo-block"><label class="demo-label">${T("到期天数", "Days")} = <b id="pe-d-v">182</b></label><input class="demo-slider" id="pe-d" type="range" min="7" max="365" step="1" value="182"/></div>
        <div class="demo-block"><label class="demo-label">${T("利率 r", "Rate r")} = <b id="pe-r-v">4.0</b>%</label><input class="demo-slider" id="pe-r" type="range" min="0" max="8" step="0.5" value="4"/></div>
        <div class="demo-block"><label class="demo-label">${T("波动率 σ", "Vol σ")} = <b id="pe-iv-v">25</b>%</label><input class="demo-slider" id="pe-iv" type="range" min="5" max="80" step="1" value="25"/></div>
      </div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("看涨 C", "Call C")}</div><div class="v acc" id="pe-c">–</div></div>
        <div class="stat"><div class="k">${T("看跌 P", "Put P")}</div><div class="v acc" id="pe-p">–</div></div>
      </div>

      <div class="cmp" style="margin-top:14px">
        <div class="cmp-cell"><h5>${T("左边 LHS = C − P", "LHS = C − P")}</h5><div class="v acc" id="pe-lhs" style="font-size:22px;font-weight:700;font-variant-numeric:tabular-nums">–</div></div>
        <div class="cmp-cell"><h5>${T("右边 RHS = S − K·e^(−rT)", "RHS = S − K·e^(−rT)")}</h5><div class="v acc" id="pe-rhs" style="font-size:22px;font-weight:700;font-variant-numeric:tabular-nums">–</div></div>
      </div>
      <p class="demo-meta" id="pe-match"></p>

      <div class="demo-block" style="margin-top:8px;border-top:1px solid var(--line-soft);padding-top:14px">
        <label class="demo-label">${T("人为给看涨报价加一个“错价”（破坏平价，制造套利）", "Nudge the call's market quote off fair value (break parity to create arbitrage)")} : <b id="pe-mis-v">+0.0</b></label>
        <input class="demo-slider" id="pe-mis" type="range" min="-3" max="3" step="0.1" value="0"/>
      </div>
      <div id="pe-arb"></div>

      <p class="demo-tip">${T("无论你怎么拖 S、K、T、r、σ，<b>左边永远等于右边</b>——这就是平价的“守恒律”。一旦看涨报价偏离公平价(用下面的错价滑块)，<b>C − P 就不再等于 S − K·e^(−rT)</b>，缺口 ×100 就是套利者能无风险搬走的利润。", "However you drag S, K, T, r, σ, <b>LHS always equals RHS</b> — that's the conservation law. The moment the call's quote drifts off fair value (slider below), <b>C − P no longer equals S − K·e^(−rT)</b>, and the gap ×100 is the risk-free profit an arbitrageur pockets.")}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  const els = { s: $("#pe-s"), k: $("#pe-k"), d: $("#pe-d"), r: $("#pe-r"), iv: $("#pe-iv"), mis: $("#pe-mis") };
  const sign = (v) => (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(2);

  function paint() {
    const S = +els.s.value, K = +els.k.value, days = +els.d.value;
    const r = +els.r.value / 100, iv = +els.iv.value / 100, mis = +els.mis.value;
    const Tt = days / 365;

    $("#pe-s-v").textContent = S;
    $("#pe-k-v").textContent = K;
    $("#pe-d-v").textContent = days;
    $("#pe-r-v").textContent = (r * 100).toFixed(1);
    $("#pe-iv-v").textContent = (iv * 100).toFixed(0);
    $("#pe-mis-v").textContent = (mis >= 0 ? "+" : "") + mis.toFixed(1);

    const base = { S, K, T: Tt, r, sigma: iv, q: 0 };
    const Cfair = bsPrice({ ...base, type: "call" });
    const P = bsPrice({ ...base, type: "put" });
    const C = Cfair + mis; // 人为错价只动看涨报价

    $("#pe-c").textContent = C.toFixed(2);
    $("#pe-p").textContent = P.toFixed(2);

    const lhs = C - P;
    const rhs = S - K * Math.exp(-r * Tt);
    $("#pe-lhs").textContent = sign(lhs);
    $("#pe-rhs").textContent = sign(rhs);

    const gap = lhs - rhs; // 正=看涨太贵
    if (Math.abs(gap) < 0.005) {
      $("#pe-match").innerHTML = `<span class="pill ok">${T("平价成立 ✓", "Parity holds ✓")}</span> ${T("两边相等，无套利机会。", "Both sides equal — no arbitrage.")}`;
    } else {
      $("#pe-match").innerHTML = `<span class="pill bad">${T("平价被破坏", "Parity broken")}</span> ${T("缺口", "Gap")} = ${sign(gap)} / ${T("股", "sh")}`;
    }

    // 套利说明
    if (Math.abs(gap) < 0.005) {
      $("#pe-arb").innerHTML = "";
    } else {
      const profit = Math.abs(gap) * MULT;
      const tooExpensive = gap > 0; // 看涨相对太贵 → 卖看涨侧组合
      const legs = tooExpensive
        ? T("卖看涨、买看跌、买标的、借入 K·e^(−rT) 的现金", "sell the call, buy the put, buy the stock, borrow K·e^(−rT)")
        : T("买看涨、卖看跌、卖空标的、把 K·e^(−rT) 存为债券", "buy the call, sell the put, short the stock, lend K·e^(−rT)");
      $("#pe-arb").innerHTML = `<div class="scn">
        <div class="scn-q">${tooExpensive
          ? T("看涨相对<b>太贵</b>（C − P 高于公平的 S − K·e^(−rT)）", "The call is relatively <b>too expensive</b> (C − P exceeds the fair S − K·e^(−rT))")
          : T("看涨相对<b>太便宜</b>（C − P 低于公平的 S − K·e^(−rT)）", "The call is relatively <b>too cheap</b> (C − P is below the fair S − K·e^(−rT))")}</div>
        <div class="scn-meta">${T("套利操作（转换/逆转换）：", "Arbitrage (conversion / reversal):")} <b>${legs}</b>。<br>${T("到期两侧回报恰好抵消，今天净锁定利润", "At expiry the two sides cancel; you lock in today")} ≈ <b class="pill ok">$${profit.toFixed(0)}</b> / ${T("每组合（零风险）", "per combo (risk-free)")}。</div>
      </div>`;
    }
  }
  Object.values(els).forEach((el) => el.addEventListener("input", paint));
  paint();
}
