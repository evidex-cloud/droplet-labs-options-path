// 风险瀑布：保证金 → 保险基金 → ADL →（部分设计）社会化亏损。教学数字。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🌊 ${T("强平瀑布 · 教学数字", "Liq waterfall · teaching numbers")}</div>
      <div class="demo-grid-3">
        <div class="demo-block"><label class="demo-label">${T("穿仓缺口", "Hole after bankrupt")} = <b id="ad-h">800</b></label><input class="demo-slider" id="ad-hs" type="range" min="100" max="3000" step="50" value="800"/></div>
        <div class="demo-block"><label class="demo-label">${T("该仓剩余保证金", "Remaining margin")} = <b id="ad-m">200</b></label><input class="demo-slider" id="ad-ms" type="range" min="0" max="1500" step="50" value="200"/></div>
        <div class="demo-block"><label class="demo-label">${T("保险基金余额", "Insurance fund")} = <b id="ad-i">400</b></label><input class="demo-slider" id="ad-is" type="range" min="0" max="2500" step="50" value="400"/></div>
      </div>
      <div id="ad-bars"></div>
      <div class="stat-row">
        <div class="stat"><div class="k">${T("保证金吃掉", "Eaten by margin")}</div><div class="v" id="ad-s1">–</div></div>
        <div class="stat"><div class="k">${T("保险基金吃掉", "Eaten by IF")}</div><div class="v" id="ad-s2">–</div></div>
        <div class="stat"><div class="k">${T("留给 ADL", "Left for ADL")}</div><div class="v neg" id="ad-s3">–</div></div>
      </div>
      <p class="demo-tip">${T("数字是<b>教学示意</b>，不是某交易所实时保险基金。瀑布：仓位保证金 → 保险基金 → <b>ADL 减对手里盈利仓</b>（不是只打穿仓那个人）→ 有的设计才社会化分摊。FTX（2022-11）是对手方+风控引擎崩了，不是“永续这个机制是假的”。", "Numbers are <b>teaching</b>, not a live insurance-fund print. Waterfall: position margin → insurance fund → <b>ADL of profitable opposite accounts</b> (not only the bankrupt one) → some designs socialize leftover loss. FTX (Nov 2022) was counterparty + risk-engine failure, not “perps are fake.”")}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);

  function bar(label, used, cap, color) {
    const pct = cap <= 0 ? 0 : Math.min(100, (used / Math.max(cap, 1)) * 100);
    return `<div class="bar2" style="margin-top:8px"><div class="lab">${label}</div><div class="track"><div class="fill" style="width:${pct}%;background:${color}"></div></div><div class="val">${used.toFixed(0)}/${cap.toFixed(0)}</div></div>`;
  }

  function paint() {
    const hole = +$("#ad-hs").value, m = +$("#ad-ms").value, ins = +$("#ad-is").value;
    $("#ad-h").textContent = hole;
    $("#ad-m").textContent = m;
    $("#ad-i").textContent = ins;
    const s1 = Math.min(hole, m);
    let rest = hole - s1;
    const s2 = Math.min(rest, ins);
    rest -= s2;
    $("#ad-bars").innerHTML =
      bar(T("① 保证金", "① Margin"), s1, m, "var(--accent)") +
      bar(T("② 保险基金", "② Insurance"), s2, ins, "var(--gold)") +
      bar(T("③ ADL 缺口", "③ ADL hole"), rest, hole, "var(--red)");
    $("#ad-s1").textContent = "$" + s1.toFixed(0);
    $("#ad-s2").textContent = "$" + s2.toFixed(0);
    $("#ad-s3").textContent = rest > 0 ? "$" + rest.toFixed(0) + T(" → 打盈利对手仓", " → hit profitable opposite") : T("0（ADL 不触发）", "0 (no ADL)");
  }
  ["ad-hs", "ad-ms", "ad-is"].forEach((id) => $(`#${id}`).addEventListener("input", paint));
  paint();
}
