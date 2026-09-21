// 资金费：费率 × 间隔 × 天数 × 名义 → 实付；对比“把快照年化”的假 APR
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">💸 ${T("资金费计算器 · 教学数字", "Funding calculator · teaching numbers")}</div>
      <div class="demo-grid-3">
        <div class="demo-block"><label class="demo-label">${T("每期费率（%）", "Rate per interval (%)")} = <b id="fd-r">0.010</b></label><input class="demo-slider" id="fd-rs" type="range" min="-0.05" max="0.05" step="0.001" value="0.01"/></div>
        <div class="demo-block"><label class="demo-label">${T("结算间隔（小时）", "Interval (hours)")} = <b id="fd-h">8</b></label><input class="demo-slider" id="fd-hs" type="range" min="1" max="8" step="1" value="8"/></div>
        <div class="demo-block"><label class="demo-label">${T("持有天数", "Days held")} = <b id="fd-d">7</b></label><input class="demo-slider" id="fd-ds" type="range" min="1" max="30" step="1" value="7"/></div>
      </div>
      <div class="demo-block"><label class="demo-label">${T("教学名义（USDT，非实时币价）", "Teaching notional (USDT, not a live coin price)")} = <b id="fd-n">100000</b></label><input class="demo-slider" id="fd-ns" type="range" min="10000" max="500000" step="10000" value="100000"/></div>
      <div class="stat-row">
        <div class="stat"><div class="k">${T("结算次数", "Settlements")}</div><div class="v" id="fd-nset">–</div></div>
        <div class="stat"><div class="k">${T("多头实付（示意）", "Long pays (schematic)")}</div><div class="v" id="fd-paid">–</div></div>
        <div class="stat"><div class="k">${T("假 APR（把本期年化）", "Fake APR (annualize this print)")}</div><div class="v neg" id="fd-apr">–</div></div>
      </div>
      <div class="cmp">
        <div class="cmp-cell"><h5>${T("8h 场 vs 1h 场", "8h vs 1h venues")}</h5><p id="fd-cmp" style="margin:0;font-size:13.5px;line-height:1.55"></p></div>
        <div class="cmp-cell"><h5>${T("持有期真实成本", "Realized cost over hold")}</h5><p id="fd-real" style="margin:0;font-size:13.5px;line-height:1.55"></p></div>
      </div>
      <p class="demo-tip">${T("正费率 = 多头付给空头。屏幕上的 % <b>不可直接比</b>：Binance USDM 常见 8h（部分市场 4h），Hyperliquid 多为 1h。把某一期 0.01% 乘 3×365 得到的“APR”是快照年化，不是锁定收益。默认 +0.01%/8h × 7 天是课文里的教学例，不是实测。", "Positive funding = longs pay shorts. The on-screen % is <b>not comparable</b> until you normalize: Binance USDM is typically 8h (sometimes 4h); Hyperliquid is usually hourly. Annualizing one 0.01% print × 3 × 365 is a snapshot, not locked yield. Default +0.01%/8h × 7 days is the lesson’s teaching example, not a measurement.")}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);

  function paint() {
    const ratePct = +$("#fd-rs").value;
    const hours = +$("#fd-hs").value;
    const days = +$("#fd-ds").value;
    const notional = +$("#fd-ns").value;
    $("#fd-r").textContent = ratePct.toFixed(3);
    $("#fd-h").textContent = hours;
    $("#fd-d").textContent = days;
    $("#fd-n").textContent = notional.toLocaleString();
    const nset = days * (24 / hours);
    const paid = notional * (ratePct / 100) * nset;
    const fakeApr = (ratePct / 100) * (365 * 24 / hours) * 100;
    const realized = (paid / notional) * 100;
    $("#fd-nset").textContent = nset.toFixed(1);
    const cell = $("#fd-paid");
    cell.textContent = (paid >= 0 ? "+" : "−") + "$" + Math.abs(paid).toFixed(0) + (paid >= 0 ? T("（多头付）", " (longs pay)") : T("（多头收）", " (longs receive)"));
    cell.className = "v " + (paid > 0 ? "neg" : paid < 0 ? "pos" : "");
    $("#fd-apr").textContent = fakeApr.toFixed(1) + "%";
    $("#fd-cmp").textContent = T(
      "同样报 0.01%：8h 场一天结算 3 次，1h 场一天 24 次。不归一化就把两者当“一样贵”，账会差 8 倍。",
      "The same 0.01% print: 3 times/day on an 8h venue, 24 times/day on a 1h venue. Treat them as equal and you are off by 8× until you normalize."
    );
    $("#fd-real").textContent = T(
      "这 " + days + " 天实际资金费约占名义的 " + realized.toFixed(3) + "%。假 APR " + fakeApr.toFixed(1) + "% 假设费率永不改、永不换边——市场不会配合。",
      "Over " + days + " days the funding is about " + realized.toFixed(3) + "% of notional. The fake APR " + fakeApr.toFixed(1) + "% assumes the rate never moves and never flips — markets do not oblige."
    );
  }
  ["fd-rs", "fd-hs", "fd-ds", "fd-ns"].forEach((id) => $(`#${id}`).addEventListener("input", paint));
  paint();
}
