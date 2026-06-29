// 交互演示：方差风险溢价（VRP）。
// 展示 12 个月的“卖出的 IV” vs “兑现的 RV”柱状对比（多数月 IV>RV，一个月 RV>>IV = 压路机）。
// 每月卖波动率的 P&L ∝ (IV − RV)；累计 P&L、胜率、最差月。让负偏斜变得可感。
// 一个滑块控制“仓位规模”（每点 vol 差对应多少钱），放大压路机的杀伤。真算：逐月聚合。

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const months = en
    ? ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    : ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

  // 隐含波动率（卖出价）与已实现波动率（兑现），年化 %。第 8 个月是“压路机”：RV 暴涨。
  const IV = [18, 17, 19, 16, 20, 18, 17, 19, 16, 18, 17, 21];
  const RV = [12, 14, 11, 13, 15, 10, 12, 55,  9, 11, 13, 14];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🚜 ${T("方差风险溢价：在压路机前捡硬币", "The variance risk premium: picking up pennies before a steamroller")}</div>

      <div class="demo-block">
        <label class="demo-label">${T("每 1 个 vol 点对应的盈亏（仓位规模）", "P&L per 1 vol point (position size)")} = $<b id="vp-mult-v">100</b></label>
        <input class="demo-slider" id="vp-mult" type="range" min="50" max="400" step="10" value="100"/>
      </div>

      <div class="demo-label">${T("每月：卖出的 IV（金）vs 兑现的 RV（青/红）。IV>RV 这个月赚。", "Each month: IV sold (gold) vs RV realized (teal/red). IV>RV ⇒ profit that month.")}</div>
      <div id="vp-bars" style="margin-top:8px"></div>

      <div class="stat-row" style="margin-top:14px">
        <div class="stat"><div class="k">${T("累计 P&L", "Cumulative P&L")}</div><div class="v" id="vp-total">–</div></div>
        <div class="stat"><div class="k">${T("胜率（盈利月）", "Win rate (months)")}</div><div class="v acc" id="vp-win">–</div></div>
        <div class="stat"><div class="k">${T("最差月", "Worst month")}</div><div class="v neg" id="vp-worst">–</div></div>
        <div class="stat"><div class="k">${T("最好月", "Best month")}</div><div class="v pos" id="vp-best">–</div></div>
      </div>

      <p class="demo-tip" id="vp-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const money = (v) => (v < 0 ? "−$" : "$") + Math.abs(Math.round(v)).toLocaleString("en-US");

  function paint() {
    const mult = +$("#vp-mult").value;
    $("#vp-mult-v").textContent = mult;

    let cum = 0, wins = 0, worst = Infinity, best = -Infinity, worstM = 0, bestM = 0;
    const monthly = [];
    for (let i = 0; i < 12; i++) {
      const pnl = (IV[i] - RV[i]) * mult; // 卖波动率：IV>RV 赚
      monthly.push(pnl);
      cum += pnl;
      if (pnl > 0) wins++;
      if (pnl < worst) { worst = pnl; worstM = i; }
      if (pnl > best) { best = pnl; bestM = i; }
    }

    // 柱状：每月一对小柱（IV vs RV），缩放到统一最大值
    const maxVol = Math.max(...IV, ...RV);
    let rows = "";
    for (let i = 0; i < 12; i++) {
      const ivPct = (IV[i] / maxVol) * 100;
      const rvPct = (RV[i] / maxVol) * 100;
      const profit = IV[i] >= RV[i];
      const rvColor = RV[i] > IV[i] ? "var(--red)" : "var(--accent)";
      rows += `<div style="display:flex;align-items:center;gap:8px;margin:5px 0">
        <div style="width:34px;font-size:12px;color:var(--muted);flex:none">${months[i]}</div>
        <div style="flex:1;display:flex;flex-direction:column;gap:2px">
          <div class="track" style="height:11px;background:var(--surface-2);border-radius:5px;overflow:hidden"><div style="height:100%;width:${ivPct}%;background:var(--gold);border-radius:5px"></div></div>
          <div class="track" style="height:11px;background:var(--surface-2);border-radius:5px;overflow:hidden"><div style="height:100%;width:${rvPct}%;background:${rvColor};border-radius:5px"></div></div>
        </div>
        <div style="width:84px;text-align:right;font-size:12px;flex:none;font-variant-numeric:tabular-nums;color:${profit ? "var(--green)" : "var(--red)"}">${money(monthly[i])}</div>
      </div>`;
    }
    $("#vp-bars").innerHTML = rows +
      `<div class="payoff-legend" style="margin-top:8px"><span><i style="background:var(--gold)"></i>${T("IV（卖出）", "IV (sold)")}</span><span><i style="background:var(--accent)"></i>${T("RV（兑现，<IV 赚）", "RV (realized, <IV ⇒ win)")}</span><span><i style="background:var(--red)"></i>${T("RV>IV（压路机月）", "RV>IV (steamroller)")}</span></div>`;

    $("#vp-total").textContent = money(cum);
    $("#vp-total").className = "v " + (cum >= 0 ? "pos" : "neg");
    $("#vp-win").textContent = wins + "/12 (" + Math.round((wins / 12) * 100) + "%)";
    $("#vp-worst").textContent = money(worst);
    $("#vp-best").textContent = money(best);

    // 没有压路机那个月的累计（反事实）
    const cumNoCrash = cum - monthly[7];
    $("#vp-tip").innerHTML = T(
      `卖波动率 12 个月，<b>${wins}/12 个月盈利</b>（胜率 ${Math.round((wins / 12) * 100)}%）——这正是 VRP 的诱惑：高胜率、月月小赚。但看 <b>${months[worstM]}</b>：RV 飙到 ${RV[worstM]}%（IV 只卖了 ${IV[worstM]}%），一个月就亏 <b>${money(worst)}</b>，<b>抹掉了前面好几个月的累积</b>。若没有这一个压路机月，累计本该是 ${money(cumNoCrash)}，可现实只剩 <b>${money(cum)}</b>。这就是<b>负偏斜的肥左尾</b>：赚的是频率，亏的是幅度。把<b>仓位</b>拖大，压路机的杀伤同比放大——这正是 2018 Volmageddon 的剧本（阶段 8.3、8.1）。`,
      `Selling vol for 12 months wins <b>${wins}/12 months</b> (${Math.round((wins / 12) * 100)}% hit rate) — exactly the VRP seduction: high win rate, steady small gains. But look at <b>${months[worstM]}</b>: RV spikes to ${RV[worstM]}% (IV only sold at ${IV[worstM]}%), losing <b>${money(worst)}</b> in one month — <b>wiping out several months of gains</b>. Without that one steamroller month the total would be ${money(cumNoCrash)}, yet reality leaves only <b>${money(cum)}</b>. This is the <b>negatively-skewed fat left tail</b>: you win on frequency, lose on magnitude. Crank up <b>size</b> and the steamroller scales with it — the 2018 Volmageddon script (Stages 8.3, 8.1).`
    );
  }

  $("#vp-mult").addEventListener("input", paint);
  paint();
}
