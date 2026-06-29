// 交互演示：尾部对冲。
// 组合 = 多头股票（$10,000）± 一撮深度虚值看跌（成本滑块，年化 % of 组合）。
// 一个崩盘幅度滑块（0 到 −50%）；展示无对冲 vs 尾部对冲的组合价值。
// 深度虚值看跌的凸性赔付在深跌时爆发，平静时则是年度拖累。.stat-row。
// 真算：看跌到期内在价值 + 按成本反推“买了多少保护名义额”。

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const PORT = 10000;       // 股票组合规模
  const S0 = 100;           // 名义现价
  const KPUT = 70;          // 深度虚值看跌行权价（现价的 70%，30% OTM）

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🦢 ${T("尾部对冲：深度虚值看跌的“巨灾险”", "Tail hedge: a catastrophe policy from deep-OTM puts")}</div>

      <div class="demo-block">
        <label class="demo-label">${T("尾部对冲年成本（占组合）", "Annual tail-hedge cost (% of portfolio)")} = <b id="th-cost-v">1.0</b>%</label>
        <input class="demo-slider" id="th-cost" type="range" min="0" max="3" step="0.25" value="1.0"/>
      </div>
      <div class="demo-block">
        <label class="demo-label">${T("市场行情（崩盘幅度）", "Market move (crash magnitude)")} = <b id="th-move-v">−30</b>%</label>
        <input class="demo-slider" id="th-move" type="range" min="-50" max="10" step="1" value="-30"/>
      </div>

      <div class="cmp">
        <div class="cmp-cell">
          <h5>${T("无对冲（纯多头股票）", "Unhedged (stock only)")}</h5>
          <div style="font-size:22px;font-weight:700" id="th-unh-v">–</div>
          <div class="demo-meta" id="th-unh-m"></div>
        </div>
        <div class="cmp-cell">
          <h5>${T("尾部对冲（股票 + 深虚看跌）", "Tail-hedged (stock + deep-OTM puts)")}</h5>
          <div style="font-size:22px;font-weight:700" id="th-hed-v">–</div>
          <div class="demo-meta" id="th-hed-m"></div>
        </div>
      </div>

      <div class="stat-row" style="margin-top:14px">
        <div class="stat"><div class="k">${T("看跌赔付", "Put payout")}</div><div class="v acc" id="th-payout">–</div></div>
        <div class="stat"><div class="k">${T("对冲后净 vs 无对冲", "Hedged − unhedged")}</div><div class="v" id="th-diff">–</div></div>
        <div class="stat"><div class="k">${T("对冲杠杆（赔付/成本）", "Convexity (payout ÷ cost)")}</div><div class="v" id="th-lev">–</div></div>
      </div>

      <p class="demo-tip" id="th-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const money = (v) => (v < 0 ? "−$" : "$") + Math.abs(Math.round(v)).toLocaleString("en-US");

  function paint() {
    const costPct = +$("#th-cost").value / 100;
    const movePct = +$("#th-move").value / 100;
    $("#th-cost-v").textContent = (+$("#th-cost").value).toFixed(2);
    $("#th-move-v").textContent = (movePct >= 0 ? "+" : "−") + Math.abs(+$("#th-move").value);

    const cost = PORT * costPct;          // 花在尾部对冲上的钱
    const Sfin = S0 * (1 + movePct);      // 崩盘后名义价

    // 用 cost 买深度虚值看跌：单张看跌的“事前价格”取一个低值（深虚 70 行权 1 年期 ≈ $0.15/股 = $15/张，见课内引擎）。
    // 名义保护额 = cost / 单价 × 行权价×100，简化为：买入的“份数” n = cost / putPrice。
    const putPrice = 0.15;                // 每股事前权利金（与 lesson 引擎实算一致：BS K=70,S=100,1yr,σ=20%,r=4% ≈ 0.145）
    const contractCost = putPrice * 100;  // 每张 $15
    const nContracts = cost / contractCost;             // 可买张数（可为小数，表“一撮”）
    const putIntrinsic = Math.max(KPUT - Sfin, 0);      // 每股到期内在价值
    const payout = putIntrinsic * 100 * nContracts;     // 看跌总赔付

    // 股票组合崩盘后价值
    const stockVal = PORT * (1 + movePct);
    const unhedged = stockVal;
    // 尾部对冲：股票 + 看跌赔付 − 已花成本
    const hedged = stockVal + payout - cost;

    $("#th-unh-v").textContent = money(unhedged);
    $("#th-unh-v").style.color = unhedged >= PORT ? "var(--green)" : "var(--red)";
    $("#th-unh-m").innerHTML = T(
      `${money(PORT)} 全押股票，崩盘 ${(movePct * 100).toFixed(0)}% → 直接亏 <b>${money(stockVal - PORT)}</b>，没有任何缓冲。`,
      `${money(PORT)} all in stock; a ${(movePct * 100).toFixed(0)}% crash loses <b>${money(stockVal - PORT)}</b> with no cushion.`
    );

    $("#th-hed-v").textContent = money(hedged);
    $("#th-hed-v").style.color = hedged >= PORT ? "var(--green)" : "var(--red)";
    $("#th-hed-m").innerHTML = T(
      `花 ${money(cost)}/年买深虚 ${KPUT} 看跌；崩盘赔付 <b style="color:var(--accent-ink)">${money(payout)}</b>，净值 <b>${money(hedged)}</b>。`,
      `Spend ${money(cost)}/yr on deep-OTM ${KPUT} puts; crash pays <b style="color:var(--accent-ink)">${money(payout)}</b>, value <b>${money(hedged)}</b>.`
    );

    const diff = hedged - unhedged;
    $("#th-payout").textContent = money(payout);
    $("#th-diff").textContent = (diff >= 0 ? "+" : "") + money(diff);
    $("#th-diff").className = "v " + (diff >= 0 ? "pos" : "neg");
    const lev = cost > 0 ? payout / cost : 0;
    $("#th-lev").textContent = cost > 0 ? lev.toFixed(1) + "×" : "—";
    $("#th-lev").className = "v " + (lev >= 1 ? "pos" : "");

    let msg;
    if (costPct === 0) {
      msg = T(
        `<b>没买保险</b>：成本拖累为 0，平静时不损失分毫——但崩盘时你<b>裸奔</b>，亏掉 ${money(stockVal - PORT)}。把<b>成本</b>拖到 1%，再把<b>崩盘</b>拖到 −40% 看看保险怎么爆发。`,
        `<b>No insurance</b>: zero cost drag, lose nothing in calm — but in a crash you're <b>naked</b>, down ${money(stockVal - PORT)}. Slide <b>cost</b> to 1% and <b>crash</b> to −40% to see the hedge explode.`
      );
    } else if (payout <= 0) {
      msg = T(
        `<b>平静、小跌、乃至中等回调</b>（未跌破深虚行权价 ${KPUT}）：看跌仍几乎归零、还没赔付，对冲组合比无对冲<b>少了 ${money(-diff)}</b>——这就是每年要交的<b>成本拖累（保险费）</b>，牛市里年复一年地拖累你，难熬，也是多数人中途“退保”的原因。但请继续把<b>崩盘</b>滑块往左拖，跌破 ${KPUT} 看保险怎么爆发……`,
        `<b>Calm, dips, even a moderate drawdown</b> (not yet through the deep-OTM strike ${KPUT}): the put is still near-worthless and hasn't paid, so the hedged book is <b>${money(-diff)} behind</b> — the annual <b>cost drag (insurance premium)</b>, a year-after-year bleed that makes most people "cancel the policy". Keep dragging the <b>crash</b> slider past ${KPUT} to see it erupt…`
      );
    } else {
      msg = T(
        `<b>崩盘 ${(movePct * 100).toFixed(0)}%</b>：股价砸穿 ${KPUT}，深虚看跌从废纸变成深度实值，<b>凸性爆发</b>——花 ${money(cost)} 撬动 <b>${money(payout)}</b> 赔付（<b>${lev.toFixed(1)}× 杠杆</b>），对冲组合比无对冲<b>多扛住 ${money(diff)}</b>。跌得越狠、杠杆越大——这正是“成本拖累 vs 凸性爆发”的交换（Taleb/Universa 式，阶段 8.4）。`,
        `<b>Crash ${(movePct * 100).toFixed(0)}%</b>: spot smashes through ${KPUT}, the deep-OTM put goes from junk to deep ITM — <b>convexity erupts</b>: ${money(cost)} buys <b>${money(payout)}</b> of payout (<b>${lev.toFixed(1)}× </b>), leaving the hedged book <b>${money(diff)} better off</b>. The deeper the crash, the bigger the multiple — the cost-drag-vs-convexity trade (Taleb/Universa, Stage 8.4).`
      );
    }
    $("#th-tip").innerHTML = msg;
  }

  $("#th-cost").addEventListener("input", paint);
  $("#th-move").addEventListener("input", paint);
  paint();
}
