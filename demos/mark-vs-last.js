// 插针：last 击穿强平线、mark 未击穿。切换“按 last / 按 mark 强平”。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🕯️ ${T("插针 vs 标记价 · 谁触发强平", "Wick vs mark · who triggers liq")}</div>
      <div class="demo-grid-3">
        <div class="demo-block"><label class="demo-label">${T("指数/标记（平稳）", "Index/mark (calm)")} = <b id="mk-m">100.0</b></label><input class="demo-slider" id="mk-ms" type="range" min="96" max="104" step="0.1" value="100"/></div>
        <div class="demo-block"><label class="demo-label">${T("last 插针最低", "Last wick low")} = <b id="mk-w">94.5</b></label><input class="demo-slider" id="mk-ws" type="range" min="88" max="102" step="0.1" value="94.5"/></div>
        <div class="demo-block"><label class="demo-label">${T("维持保证金 MMR", "Maint. margin MMR")} = <b id="mk-mm">0.5%</b></label><input class="demo-slider" id="mk-mms" type="range" min="0.4" max="2" step="0.1" value="0.5"/></div>
      </div>
      <div class="demo-seg" id="mk-seg">
        <button data-k="last">${T("按 last 强平（猎杀）", "Liq on last (hunt)")}</button>
        <button data-k="mark" class="on">${T("按 mark 强平（常见）", "Liq on mark (typical)")}</button>
      </div>
      <div class="stat-row">
        <div class="stat"><div class="k">${T("入场 / 杠杆", "Entry / lev")}</div><div class="v">100 · 20×</div></div>
        <div class="stat"><div class="k">${T("教学强平价", "Teaching liq")}</div><div class="v acc" id="mk-liq">–</div></div>
        <div class="stat"><div class="k">${T("结果", "Outcome")}</div><div class="v" id="mk-out">–</div></div>
      </div>
      <div class="scn" id="mk-scn"></div>
      <p class="demo-tip">${T("教学公式（USDT 线性多头、无额外保证金）：<b>P_liq ≈ entry × (1 − 1/L + MMR)</b>。20×、MMR=0.5% → 约 95.5。last 可以瞬间插到更低；若引擎拿 last 当强平依据，账本会被猎。真实交易所多用 <b>标记价</b> 算未实现盈亏与强平。", "Teaching formula (USDT-m long, no extra margin): <b>P_liq ≈ entry × (1 − 1/L + MMR)</b>. At 20× and MMR=0.5% ≈ 95.5. Last can wick lower in a flash; if the engine liquidates on last, books get hunted. Live venues typically use <b>mark</b> for uPnL and liquidation.")}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  let mode = "mark";
  const ENTRY = 100, L = 20;

  function paint() {
    const mark = +$("#mk-ms").value, wick = +$("#mk-ws").value, mmr = +$("#mk-mms").value / 100;
    $("#mk-m").textContent = mark.toFixed(1);
    $("#mk-w").textContent = wick.toFixed(1);
    $("#mk-mm").textContent = ($("#mk-mms").value) + "%";
    const liq = ENTRY * (1 - 1 / L + mmr);
    $("#mk-liq").textContent = liq.toFixed(2);
    const px = mode === "last" ? wick : mark;
    const hit = px <= liq;
    const cell = $("#mk-out");
    cell.textContent = hit ? T("被强平", "Liquidated") : T("扛住", "Survives");
    cell.className = "v " + (hit ? "neg" : "pos");
    $("#mk-scn").innerHTML = `<div class="scn-q">${
      mode === "last"
        ? T("引擎看 last。插针最低 " + wick.toFixed(1) + " vs 强平线 " + liq.toFixed(2) + "。", "Engine watches last. Wick low " + wick.toFixed(1) + " vs liq " + liq.toFixed(2) + ".")
        : T("引擎看 mark。标记 " + mark.toFixed(1) + " vs 强平线 " + liq.toFixed(2) + "。last 插针被忽略。", "Engine watches mark. Mark " + mark.toFixed(1) + " vs liq " + liq.toFixed(2) + ". The last-price wick is ignored.")
    }</div><div class="scn-meta">${
      hit
        ? T("触发强平。若这是 last 而 mark 仍在线上，就是“被猎”的典型形态。", "Liquidation fires. If this is last while mark is still above the line, that is the classic hunt.")
        : T("未触发。这正是标记价存在的理由：保护仓位不被单笔薄成交打穿。", "No trigger. That is why mark exists: so a thin print cannot nuke the book.")
    }</div>`;
  }

  $("#mk-seg").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    mode = b.dataset.k;
    $("#mk-seg").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    paint();
  });
  ["mk-ms", "mk-ws", "mk-mms"].forEach((id) => $(`#${id}`).addEventListener("input", paint));
  paint();
}
