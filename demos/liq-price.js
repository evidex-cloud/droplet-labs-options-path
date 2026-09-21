// 杠杆 vs 强平距离；逐仓/全仓切换（全仓用文案说明会牵连其他仓）
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">⚠️ ${T("强平价 · 杠杆把缓冲吃掉", "Liq price · leverage eats the buffer")}</div>
      <div class="demo-seg" id="lq-side">
        <button data-k="long" class="on">${T("多头", "Long")}</button>
        <button data-k="short">${T("空头", "Short")}</button>
      </div>
      <div class="demo-seg" id="lq-mode" style="margin-left:8px">
        <button data-k="iso" class="on">${T("逐仓", "Isolated")}</button>
        <button data-k="cross">${T("全仓", "Cross")}</button>
      </div>
      <div class="demo-grid-3" style="margin-top:12px">
        <div class="demo-block"><label class="demo-label">${T("入场价（教学）", "Entry (teaching)")} = <b id="lq-e">100</b></label><input class="demo-slider" id="lq-es" type="range" min="50" max="150" step="1" value="100"/></div>
        <div class="demo-block"><label class="demo-label">${T("杠杆", "Leverage")} = <b id="lq-l">10</b>×</label><input class="demo-slider" id="lq-ls" type="range" min="2" max="50" step="1" value="10"/></div>
        <div class="demo-block"><label class="demo-label">${T("维持保证金 MMR", "MMR")} = <b id="lq-m">0.5%</b></label><input class="demo-slider" id="lq-ms" type="range" min="0.4" max="2.5" step="0.1" value="0.5"/></div>
      </div>
      <div class="stat-row">
        <div class="stat"><div class="k">${T("初始保证金 IM≈1/L", "IM ≈ 1/L")}</div><div class="v" id="lq-im">–</div></div>
        <div class="stat"><div class="k">${T("教学强平价", "Teaching liq")}</div><div class="v acc" id="lq-p">–</div></div>
        <div class="stat"><div class="k">${T("距入场", "Distance")}</div><div class="v" id="lq-d">–</div></div>
      </div>
      <p class="demo-tip" id="lq-tip"></p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  let side = "long", mode = "iso";

  function paint() {
    const E = +$("#lq-es").value, L = +$("#lq-ls").value, mmr = +$("#lq-ms").value / 100;
    $("#lq-e").textContent = E;
    $("#lq-l").textContent = L;
    $("#lq-m").textContent = $("#lq-ms").value + "%";
    const im = 1 / L;
    const liq = side === "long" ? E * (1 - im + mmr) : E * (1 + im - mmr);
    const dist = Math.abs(liq - E) / E * 100;
    $("#lq-im").textContent = (im * 100).toFixed(2) + "%";
    $("#lq-p").textContent = liq.toFixed(2);
    $("#lq-d").textContent = dist.toFixed(2) + "%";
    const iso = mode === "iso";
    $("#lq-tip").innerHTML = T(
      "USDT 线性合约、无额外保证金的教学式：多头 <b>P_liq ≈ E(1−1/L+MMR)</b>，空头 <b>E(1+1/L−MMR)</b>。名义通常是 1 币或 USDT 面值，不要拿美股期权 ×100 去乘。逐仓：爆了只炸这一仓；<b>全仓会拿账户里其他仓位的权益去填</b>" +
        (iso ? "（当前：逐仓）。" : "（当前：全仓——一根插针可能拖垮不相关的仓）。"),
      "Teaching USDT-m, no extra margin: long <b>P_liq ≈ E(1−1/L+MMR)</b>, short <b>E(1+1/L−MMR)</b>. Notional is usually 1 coin or a USDT face — do not blindly ×100 like equity options. Isolated: only this position dies; <b>cross can drain equity from other positions</b>" +
        (iso ? " (now: isolated)." : " (now: cross — one wick can sink unrelated books).")
    );
  }

  function bind(id, setter) {
    $(id).addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      setter(b.dataset.k);
      $(id).querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
      paint();
    });
  }
  bind("#lq-side", (k) => { side = k; });
  bind("#lq-mode", (k) => { mode = k; });
  ["lq-es", "lq-ls", "lq-ms"].forEach((id) => $(`#${id}`).addEventListener("input", paint));
  paint();
}
