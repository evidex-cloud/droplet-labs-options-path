// 交互演示：完整 Black-Scholes 定价器（本章的核心工具）
// 滑块 S / K / 天数 / IV / r / 股息 q + 看涨/看跌切换。用 _bs.js 的 greeks() 真算。
// 价格突出显示，下方一行 .stat 列出全部 5 个希腊字母（delta/gamma/theta/vega/rho）。
import { greeks, normCDF } from "./_bs.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🧮 ${T("Black-Scholes 定价器：五个输入 → 理论价 + 五个希腊字母", "Black-Scholes Calculator: five inputs → price + the five Greeks")}</div>

      <div class="demo-row" style="margin-bottom:6px">
        <div class="demo-seg" id="bs-type">
          <button data-t="call" class="on">${T("看涨 Call", "Call")}</button>
          <button data-t="put">${T("看跌 Put", "Put")}</button>
        </div>
      </div>

      <div class="demo-grid-3">
        <div class="demo-block"><label class="demo-label">${T("标的价 S", "Spot S")} = <b id="bs-s-v">100</b></label><input class="demo-slider" id="bs-s" type="range" min="40" max="160" step="1" value="100"/></div>
        <div class="demo-block"><label class="demo-label">${T("行权价 K", "Strike K")} = <b id="bs-k-v">100</b></label><input class="demo-slider" id="bs-k" type="range" min="40" max="160" step="1" value="100"/></div>
        <div class="demo-block"><label class="demo-label">${T("到期天数", "Days to expiry")} = <b id="bs-d-v">365</b></label><input class="demo-slider" id="bs-d" type="range" min="1" max="730" step="1" value="365"/></div>
        <div class="demo-block"><label class="demo-label">${T("隐含波动率 IV", "Implied vol")} = <b id="bs-iv-v">20</b>%</label><input class="demo-slider" id="bs-iv" type="range" min="1" max="120" step="1" value="20"/></div>
        <div class="demo-block"><label class="demo-label">${T("无风险利率 r", "Rate r")} = <b id="bs-r-v">5.0</b>%</label><input class="demo-slider" id="bs-r" type="range" min="0" max="10" step="0.1" value="5"/></div>
        <div class="demo-block"><label class="demo-label">${T("股息率 q", "Dividend q")} = <b id="bs-q-v">0.0</b>%</label><input class="demo-slider" id="bs-q" type="range" min="0" max="8" step="0.1" value="0"/></div>
      </div>

      <div class="detail" style="text-align:center;margin-top:14px">
        <div class="dk">${T("期权理论价（每股）", "Option theoretical value (per share)")}</div>
        <div style="font-size:34px;font-weight:800;color:var(--accent-ink);font-variant-numeric:tabular-nums;line-height:1.2" id="bs-price">–</div>
        <div class="dk" id="bs-contract">${T("一张合约 (×100) ≈ –", "Per contract (×100) ≈ –")}</div>
        <div class="demo-meta" id="bs-decomp"></div>
      </div>

      <div class="stat-row" style="margin-top:14px">
        <div class="stat"><div class="k">Delta (Δ)</div><div class="v acc" id="bs-delta">–</div></div>
        <div class="stat"><div class="k">Gamma (Γ)</div><div class="v" id="bs-gamma">–</div></div>
        <div class="stat"><div class="k">${T("Theta /天", "Theta /day")}</div><div class="v neg" id="bs-theta">–</div></div>
        <div class="stat"><div class="k">${T("Vega /1%", "Vega /1%")}</div><div class="v" id="bs-vega">–</div></div>
        <div class="stat"><div class="k">${T("Rho /1%", "Rho /1%")}</div><div class="v" id="bs-rho">–</div></div>
      </div>

      <p class="demo-tip" id="bs-tip"></p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  const els = { s: $("#bs-s"), k: $("#bs-k"), d: $("#bs-d"), iv: $("#bs-iv"), r: $("#bs-r"), q: $("#bs-q") };
  let type = "call";
  const money = (v) => "$" + v.toFixed(2);

  function paint() {
    const S = +els.s.value, K = +els.k.value, days = +els.d.value;
    const sigma = +els.iv.value / 100, r = +els.r.value / 100, q = +els.q.value / 100;
    const Tyr = days / 365;

    $("#bs-s-v").textContent = S;
    $("#bs-k-v").textContent = K;
    $("#bs-d-v").textContent = days;
    $("#bs-iv-v").textContent = (sigma * 100).toFixed(0);
    $("#bs-r-v").textContent = (r * 100).toFixed(1);
    $("#bs-q-v").textContent = (q * 100).toFixed(1);

    const g = greeks({ S, K, T: Tyr, r, sigma, type, q });
    $("#bs-price").textContent = money(g.price);
    $("#bs-contract").textContent = T("一张合约 (×100) ≈ ", "Per contract (×100) ≈ ") + "$" + (g.price * 100).toFixed(0);

    // 内在价值 / 时间价值分解（回扣阶段 1.6）
    const intrinsic = type === "put" ? Math.max(K - S, 0) : Math.max(S - K, 0);
    const timeVal = Math.max(g.price - intrinsic, 0);
    $("#bs-decomp").innerHTML =
      T("内在价值 ", "Intrinsic ") + `<b>${money(intrinsic)}</b>` +
      T(" + 时间价值 ", " + Time value ") + `<b>${money(timeVal)}</b>`;

    $("#bs-delta").textContent = g.delta.toFixed(3);
    $("#bs-gamma").textContent = g.gamma.toFixed(4);
    $("#bs-theta").textContent = g.theta.toFixed(3);
    $("#bs-vega").textContent = g.vega.toFixed(3);
    $("#bs-rho").textContent = g.rho.toFixed(3);

    // Theta 几乎总为负（买方时间衰减）；Vega 永远正；据此着色
    $("#bs-vega").className = "v pos";
    $("#bs-rho").className = "v " + (g.rho >= 0 ? "pos" : "neg");
    $("#bs-delta").className = "v acc";

    // d1/d2/N(d2)：把公式“看得见”
    const s = sigma * Math.sqrt(Tyr);
    const d1 = (Math.log(S / K) + (r - q + sigma * sigma / 2) * Tyr) / s;
    const d2 = d1 - s;
    const nd2 = normCDF(type === "put" ? -d2 : d2);
    $("#bs-tip").innerHTML = T(
      `价格 = 内在价值 + 时间价值；价格随 <b>IV</b>↑而升（Vega>0），随<b>天数</b>↓而被 Theta 蚀去（时间衰减）。当前 d1=${d1.toFixed(2)}、d2=${d2.toFixed(2)}，N(d2)≈<b>${(nd2 * 100).toFixed(0)}%</b> ≈ 风险中性下到期实值的概率。试试把 IV 拉到 80%——看涨看跌都会变贵，因为不确定性对期权买方有利。`,
      `Price = intrinsic + time value; it rises with <b>IV</b> (Vega>0) and is eroded as <b>days</b> fall (Theta decay). Now d1=${d1.toFixed(2)}, d2=${d2.toFixed(2)}, N(d2)≈<b>${(nd2 * 100).toFixed(0)}%</b> ≈ risk-neutral probability of finishing ITM. Push IV to 80% — both call and put get pricier, because uncertainty helps the option buyer.`
    );
  }

  $("#bs-type").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    type = b.dataset.t;
    [...$("#bs-type").children].forEach((c) => c.classList.toggle("on", c === b));
    paint();
  });
  Object.values(els).forEach((el) => el.addEventListener("input", paint));
  paint();
}
