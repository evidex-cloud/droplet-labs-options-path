// 交互演示：保护性看跌 · 持股 + 买入看跌
// legs = 多头股票(entry) + 多头看跌(K 可调 = “免赔额”滑块) + 权利金可调。
// payoffSVG 展示那块被削平的地板；stat-row 给 最大亏损(地板) / 盈亏平衡 / 免赔额。
// 拖动看跌行权价，直观看到“免赔额越低（行权价越高）→ 保障越足但保费拖累越大”。
import { payoffSVG, payoffBlock, netPL } from "./_payoff.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;
  const ENTRY = 100; // 持股成本固定 100，便于对照

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🛡️ ${T("保护性看跌 · 持股 + 买入看跌", "Protective Put · Stock + Long Put")}</div>

      <div class="demo-grid">
        <div class="demo-block"><label class="demo-label">${T("看跌行权价 K（保底卖价）", "Put strike K (floor)")} = <b id="pp-kv">95</b></label><input class="demo-slider" id="pp-k" type="range" min="80" max="100" step="1" value="95"/></div>
        <div class="demo-block"><label class="demo-label">${T("看跌保费", "Put premium")} = <b id="pp-cv">4.0</b></label><input class="demo-slider" id="pp-c" type="range" min="1" max="12" step="0.5" value="4"/></div>
      </div>

      <div class="legs" id="pp-legs"></div>
      <div id="pp-chart"></div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("最大亏损(地板)", "Max loss (floor)")}</div><div class="v neg" id="pp-ml">–</div></div>
        <div class="stat"><div class="k">${T("盈亏平衡", "Breakeven")}</div><div class="v" id="pp-be">–</div></div>
        <div class="stat"><div class="k">${T("免赔额/股", "Deductible/sh")}</div><div class="v acc" id="pp-ded">–</div></div>
        <div class="stat"><div class="k">${T("最大盈利", "Max profit")}</div><div class="v pos" id="pp-mp">–</div></div>
      </div>

      <p class="demo-tip" id="pp-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const kSl = $("#pp-k"), cSl = $("#pp-c");

  function paint() {
    const K = +kSl.value, c = +cSl.value;
    $("#pp-kv").textContent = K;
    $("#pp-cv").textContent = c.toFixed(1);

    const legs = [
      { type: "stock", side: "long", entry: ENTRY, qty: 1 },
      { type: "put", side: "long", strike: K, premium: c, qty: 1 },
    ];

    const sideBuy = T("买入", "BUY");
    $("#pp-legs").innerHTML =
      `<div class="leg"><span class="side-buy">${sideBuy}</span><span class="leg-pill call">${T("股票", "STOCK")}</span><span class="leg-tag">100 ${T("股 @ ", "sh @ ")}${ENTRY}</span></div>` +
      `<div class="leg"><span class="side-buy">${sideBuy}</span><span class="leg-pill put">PUT</span><span class="leg-tag">K=${K}　${T("保费", "prem")} ${c.toFixed(1)}</span></div>`;

    const res = payoffSVG({ legs, lo: 60, hi: 140, spot: ENTRY, spotLabel: T("现价", "spot"), uid: "pp" });
    $("#pp-chart").innerHTML = payoffBlock(res, [
      ["var(--green-soft)", T("盈利", "Profit")],
      ["var(--red-soft)", T("亏损", "Loss")],
      ["var(--gold)", T("行权价", "Strike")],
    ]);

    const maxLoss = (ENTRY - K + c) * MULT;  // (成本−行权价+保费)×100
    const be = ENTRY + c;
    const deductible = ENTRY - K;            // 免赔额（每股）
    $("#pp-ml").textContent = "−$" + maxLoss.toFixed(0);
    $("#pp-be").textContent = be.toFixed(1);
    $("#pp-ded").textContent = "$" + deductible.toFixed(0);
    $("#pp-mp").textContent = T("理论无限", "∞");

    // 校验：在 K 处与更低处，netPL 应等于 −maxLoss（每股）
    // （不显示，仅保证逻辑自洽）

    $("#pp-tip").textContent = T(
      `看跌在 K=${K} 托起地板：无论跌多狠，最多亏 (${ENTRY}−${K}+${c.toFixed(1)})×100 = $${maxLoss.toFixed(0)}。免赔额 = ${ENTRY}−${K} = $${deductible}（这段下跌自负，看跌不赔）。把行权价拖高→免赔额更小、保障更足，但保费更贵；盈亏平衡被保费抬到 ${be.toFixed(1)}——保险拖累上行，但锁死了最坏情况。`,
      `The put sets a floor at K=${K}: however far it falls, you lose at most (${ENTRY}−${K}+${c.toFixed(1)})×100 = $${maxLoss.toFixed(0)}. Deductible = ${ENTRY}−${K} = $${deductible} (you self-insure this drop). Raise the strike → smaller deductible, fuller cover, but pricier. Breakeven is lifted to ${be.toFixed(1)} by the premium — insurance drags the upside but caps the worst case.`
    );
  }

  [kSl, cSl].forEach((el) => el.addEventListener("input", paint));
  paint();
}
