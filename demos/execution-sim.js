// 交互演示：多腿价差的成交成本（牛市看涨价差：买 K=100 看涨 / 卖 K=105 看涨）。
// 显示每条腿的 bid/ask/mid，比较三种净借记：
//   理论中价(两腿 mid 之差) / 立即穿价(买吃 ask、卖砸 bid，最贵) / 耐心限价(在 mid 与穿价间成交，靠价格改善)。
// “耐心”滑块控制你挂限价的激进程度：越靠 mid → 价格越好但成交概率越低；越靠穿价 → 越易成交但越贵。
// 关键：穿价 vs 中价的差 = 两腿半价差之和（真算、可验证）。.stat-row 三种成本 + 滑点。绑定 TCA。

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // 两条腿报价（每股）。牛市看涨价差。
  const legs = [
    { zh: "买入 K=100 看涨", en: "BUY  K=100 call", side: "buy", bid: 3.30, ask: 3.55 },
    { zh: "卖出 K=105 看涨", en: "SELL K=105 call", side: "sell", bid: 1.45, ask: 1.65 },
  ];
  const mid = (l) => (l.bid + l.ask) / 2;
  const mult = 100;

  const netMid = mid(legs[0]) - mid(legs[1]);          // 理论净借记（中价）
  const netCross = legs[0].ask - legs[1].bid;          // 立即穿价（最贵）
  const spreadGap = netCross - netMid;                 // = 两腿半价差之和

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🎯 ${T("成交成本沙盘：牛市看涨价差 —— 穿价 vs 耐心限价 vs 中价", "Fill-cost sandbox: bull call spread — cross vs patient limit vs mid")}</div>

      <div class="demo-meta" style="margin-bottom:8px">${T("两条腿的盘口（每股；× 100 = 每张）：", "The two legs' quotes (per share; × 100 = per contract):")}</div>
      <div id="es-legs"></div>

      <div class="demo-block" style="margin-top:14px">
        <label class="demo-label">${T("挂单耐心（左＝贴 mid 报价、更省但更难成交；右＝越靠穿价、易成交但更贵）", "Order patience (left = price near mid, cheaper but harder to fill; right = toward crossing, easy but pricey)")} = <b id="es-pat-v">75%</b> ${T("耐心", "patient")}</label>
        <input class="demo-slider" id="es-pat" type="range" min="0" max="100" step="5" value="75"/>
      </div>

      <div class="stat-row" style="margin-top:8px">
        <div class="stat"><div class="k">${T("理论中价(净借记)", "Theoretical mid (net debit)")}</div><div class="v" id="es-mid">–</div></div>
        <div class="stat"><div class="k">${T("耐心限价成交", "Patient-limit fill")}</div><div class="v acc" id="es-pat-c">–</div></div>
        <div class="stat"><div class="k">${T("立即穿价成交", "Immediate cross fill")}</div><div class="v" id="es-cross">–</div></div>
      </div>
      <div class="stat-row" style="margin-top:8px">
        <div class="stat"><div class="k">${T("耐心限价 滑点", "Patient slippage")}</div><div class="v" id="es-slip-p">–</div></div>
        <div class="stat"><div class="k">${T("立即穿价 滑点", "Cross slippage")}</div><div class="v neg" id="es-slip-c">–</div></div>
        <div class="stat"><div class="k">${T("成交概率(示意)", "Fill prob (illustrative)")}</div><div class="v" id="es-fill">–</div></div>
      </div>

      <p class="demo-tip" id="es-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const m2 = (v) => v.toFixed(2);
  const money = (v) => (v < 0 ? "−$" : "$") + Math.abs(v).toFixed(0);

  function legCard(l) {
    const spread = l.ask - l.bid;
    const tag = l.side === "buy"
      ? `<span class="pill acc">${T("买腿→吃 ask", "buy → lifts ask")}</span>`
      : `<span class="pill gold">${T("卖腿→砸 bid", "sell → hits bid")}</span>`;
    return `<div class="bar2" style="margin:7px 0;align-items:center">
      <div class="lab" style="width:140px;font-size:13px;color:var(--ink);font-family:var(--mono)">${en ? l.en : l.zh}</div>
      <div style="flex:1;display:flex;align-items:center;gap:10px;font-size:13px">
        <span style="color:var(--red)">bid ${m2(l.bid)}</span>
        <span style="color:var(--muted)">| mid <b>${m2(mid(l))}</b> |</span>
        <span style="color:var(--green)">ask ${m2(l.ask)}</span>
        <span class="demo-meta" style="display:inline">${T("价差", "spread")} ${m2(spread)}</span>
        ${tag}
      </div>
    </div>`;
  }

  function paint() {
    const pat = +$("#es-pat").value / 100; // 1 = 最耐心(贴 mid)，0 = 直接穿价
    $("#es-pat-v").textContent = (pat * 100).toFixed(0) + "%";

    // 耐心限价成交价：在 mid 与 穿价 之间。pat=1 → 接近 mid（仍留一点点改善余量），pat=0 → 穿价。
    // 实际成交 = mid + (1-pat)^1.2 * spreadGap  （越不耐心，越贴近穿价）
    const frac = Math.pow(1 - pat, 1.2);
    const netPatient = netMid + frac * spreadGap;

    $("#es-mid").textContent = money(netMid * mult);
    $("#es-pat-c").textContent = money(netPatient * mult);
    $("#es-cross").textContent = money(netCross * mult);

    const slipP = (netPatient - netMid) * mult;
    const slipC = spreadGap * mult;
    $("#es-slip-p").textContent = "+" + money(slipP);
    $("#es-slip-p").className = "v " + (slipP > slipC * 0.5 ? "neg" : "pos");
    $("#es-slip-c").textContent = "+" + money(slipC);

    // 成交概率（示意）：越耐心(越贴 mid) 越低
    const fillProb = Math.round((20 + 75 * frac) ); // pat=1→~20%, pat=0→~95%
    $("#es-fill").textContent = fillProb + "%";
    $("#es-fill").className = "v " + (fillProb >= 60 ? "pos" : "");

    const saved = slipC - slipP; // 相对穿价省下
    $("#es-tip").innerHTML = T(
      `<b>验证一下</b>：立即穿价的净借记 ${money(netCross * mult)} 比理论中价 ${money(netMid * mult)} 贵 <b>${money(slipC)}</b>/张——这恰好等于<b>两条腿半价差之和</b>(${m2((legs[0].ask - legs[0].bid) / 2)} + ${m2((legs[1].ask - legs[1].bid) / 2)} = ${m2(spreadGap)})。<br>当前耐心 ${(pat * 100).toFixed(0)}%：限价成交约 ${money(netPatient * mult)}，滑点仅 <b>+${money(slipP)}</b>，比穿价<b>省下约 ${money(saved)}/张</b>，但成交概率降到 ~${fillProb}%。<br><b>这就是执行的核心权衡：用确定性换更好的价格。</b> 散户最该养成的纪律——<b>多腿务必用“整体价差限价单”按净价成交</b>（要么全成要么不成，避开腿风险），从 mid 附近报起、别无脑市价穿价。事后用 <b>TCA</b>（以中价/到达价为基准）统计你的平均滑点，持续堵漏。`,
      `<b>Check it</b>: the immediate-cross net debit ${money(netCross * mult)} is <b>${money(slipC)}</b>/contract worse than the theoretical mid ${money(netMid * mult)} — exactly the <b>sum of the two legs' half-spreads</b> (${m2((legs[0].ask - legs[0].bid) / 2)} + ${m2((legs[1].ask - legs[1].bid) / 2)} = ${m2(spreadGap)}).<br>At ${(pat * 100).toFixed(0)}% patience: the limit fills near ${money(netPatient * mult)}, slippage only <b>+${money(slipP)}</b>, <b>saving ~${money(saved)}/contract</b> vs crossing — but fill probability drops to ~${fillProb}%.<br><b>This is execution's core trade-off: certainty for a better price.</b> The retail discipline: <b>always use a single “spread/combo limit order” on the net price</b> (all-or-none, avoiding leg risk), start quoting near mid, and never blindly cross with a market order. Then use <b>TCA</b> (vs mid/arrival) to track your average slippage and keep plugging the leak.`
    );
  }

  $("#es-legs").innerHTML = legs.map(legCard).join("");
  $("#es-pat").addEventListener("input", paint);
  paint();
}
