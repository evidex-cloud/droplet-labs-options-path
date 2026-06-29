// 交互演示：波动率期限结构（IV vs 天数，几条行权价线）+ 曲面的文字/网格表示。
// .demo-seg [正常 contango / 恐慌 backwardation] 翻转期限结构斜率。合成真实感数字。
import { lineChart, chartBlock } from "./_chart.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const expiries = [30, 60, 90, 180, 365];        // 天数
  const strikes = [90, 100, 110];                  // 行权价（ATM=100）
  // ATM 期限结构（年化 IV %）：contango 上斜、backwardation 下斜
  const atmTerm = {
    contango: { 30: 18, 60: 19, 90: 20, 180: 21, 365: 22 },
    backwardation: { 30: 45, 60: 38, 90: 33, 180: 28, 365: 25 },
  };
  // 偏斜：低行权(90)IV 高于 ATM，高行权(110)低于 ATM；近月偏斜更陡。
  // IV(K,days) = ATM(days) + 偏斜调整（低行权→更高 IV）。
  function surfaceIV(mode, K, days) {
    const atm = atmTerm[mode][days];
    const steep = 7 * Math.sqrt(30 / days);      // 近月偏斜陡、远月平
    const m = (K - 100) / 10;                    // -1, 0, +1
    return atm - steep * m;                      // 低行权(m<0)→更高 IV
  }

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🗺️ ${T("波动率期限结构与曲面：IV 随到期、行权价怎样变", "Term structure & surface: how IV varies by expiry and strike")}</div>

      <div class="demo-seg" id="su-seg" style="margin-bottom:10px">
        <button data-m="contango" class="on">${T("正常 (contango)", "Normal (contango)")}</button>
        <button data-m="backwardation">${T("恐慌 (backwardation)", "Panic (backwardation)")}</button>
      </div>

      <p class="demo-meta" id="su-desc"></p>

      <div id="su-chart"></div>

      <div class="section-h" style="font-size:15px;margin-top:20px">🔲 ${T("波动率曲面 σ(K, T)（行权价 × 到期）", "Vol surface σ(K, T) (strike × expiry)")}</div>
      <p class="demo-meta">${T(
        "每个格子 = 该“行权价 × 到期”那张期权的隐含波动率。横看是<b>偏斜</b>（阶段 4.3），纵看是<b>期限结构</b>。颜色越深 = IV 越高。",
        "Each cell = that strike × expiry option's implied vol. Read across for the <b>skew</b> (Stage 4.3), down for the <b>term structure</b>. Darker = higher IV."
      )}</p>
      <div style="overflow-x:auto"><table class="ochain" id="su-grid"></table></div>

      <p class="demo-tip" id="su-tip"></p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  let mode = "contango";

  function paint() {
    // 期限结构折线：三条行权价线（IV vs 天数）
    const lineCls = { 90: "line3", 100: "line", 110: "line2" };
    const fns = strikes.map((K) => ({
      f: (days) => surfaceIV(mode, K, days),
      cls: lineCls[K],
      label: "K=" + K,
    }));
    const res = lineChart({
      fns,
      lo: 30, hi: 365,
      xlabel: T("到期天数", "Days to expiry"),
      forceZero: false,
    });
    $("#su-chart").innerHTML = chartBlock(res, [
      ["var(--red)", T("K=90（低行权/看跌侧）", "K=90 (low strike / put side)")],
      ["var(--accent)", T("K=100（平值 ATM）", "K=100 (ATM)")],
      ["var(--gold)", T("K=110（高行权/看涨侧）", "K=110 (high strike / call side)")],
    ]);

    // 描述
    if (mode === "contango") {
      $("#su-desc").innerHTML = T(
        "<b>正常市场（contango）</b>：近月 IV 低、远月 IV 高，期限结构<b>上斜</b>。眼前平静，但越往远看不确定性累积越多。这是常态。",
        "<b>Normal market (contango)</b>: near-term IV low, far-term high, the term structure <b>slopes up</b>. Calm now, but uncertainty piles up further out. This is the norm."
      );
    } else {
      $("#su-desc").innerHTML = T(
        "<b>恐慌市场（backwardation）</b>：近月 IV 飙到远月之上，期限结构<b>倒挂下斜</b>。眼前正炸雷，市场对即刻波动的恐惧压倒长期（且预期会均值回归）。",
        "<b>Panic market (backwardation)</b>: near-term IV spikes above far-term, the curve <b>inverts/slopes down</b>. A storm is breaking now; immediate-vol fear dominates (and is expected to mean-revert)."
      );
    }

    // 曲面网格
    let head = `<caption>${T("行 = 行权价，列 = 到期；数值为年化 IV (%)", "Rows = strike, cols = expiry; values are annualized IV (%)")}</caption><tr><th>${T("行权价 \\ 到期", "Strike \\ Expiry")}</th>`;
    for (const d of expiries) head += `<th>${d}d</th>`;
    head += `</tr>`;
    let body = "";
    // 找最大 IV 做着色基准
    let maxIV = 0, minIV = 999;
    for (const K of [110, 100, 90]) for (const d of expiries) { const v = surfaceIV(mode, K, d); if (v > maxIV) maxIV = v; if (v < minIV) minIV = v; }
    for (const K of [110, 100, 90]) { // 高行权在上，低行权在下，贴近“地形”直觉
      body += `<tr><td class="strike-col">${K}${K === 100 ? " (ATM)" : ""}</td>`;
      for (const d of expiries) {
        const v = surfaceIV(mode, K, d);
        const t = (v - minIV) / (maxIV - minIV + 1e-9); // 0~1
        const alpha = (0.06 + t * 0.30).toFixed(2);
        body += `<td style="background:rgba(13,148,136,${alpha})">${v.toFixed(0)}</td>`;
      }
      body += `</tr>`;
    }
    $("#su-grid").innerHTML = head + body;

    const frontATM = surfaceIV(mode, 100, 30), yearATM = surfaceIV(mode, 100, 365);
    $("#su-tip").innerHTML = T(
      `看 K=100（ATM）这一行的<b>期限结构</b>：${mode === "contango" ? `近月 ${frontATM.toFixed(0)}% < 远月 ${yearATM.toFixed(0)}%（上斜）` : `近月 ${frontATM.toFixed(0)}% ≫ 远月 ${yearATM.toFixed(0)}%（倒挂）`}。再横看每一列的<b>偏斜</b>：低行权（K=90）高于 ATM、高行权（K=110）低于 ATM。两个方向合起来，整张表就是<b>曲面</b>。能复刻这张活地图的是随机波动率模型（阶段 9.3），而非只有一个常数 σ 的 Black-Scholes。`,
      `Look at the K=100 (ATM) row's <b>term structure</b>: ${mode === "contango" ? `front ${frontATM.toFixed(0)}% < far ${yearATM.toFixed(0)}% (upward)` : `front ${frontATM.toFixed(0)}% ≫ far ${yearATM.toFixed(0)}% (inverted)`}. Now read each column across for the <b>skew</b>: the low strike (K=90) sits above ATM, the high strike (K=110) below. Both directions together make the whole table a <b>surface</b>. Reproducing this living map takes a stochastic-vol model (Stage 9.3), not single-constant-σ Black-Scholes.`
    );
  }

  $("#su-seg").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    mode = b.dataset.m;
    [...$("#su-seg").children].forEach((c) => c.classList.toggle("on", c === b));
    paint();
  });
  paint();
}
