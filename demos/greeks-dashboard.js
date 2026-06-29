// 交互演示：希腊字母仪表盘 —— 一张期权，五块表实时刷新。
// 滑块 S / K / 天数 / IV + 看涨/看跌切换；展示理论价 + 全部 5 个希腊字母（按符号着色）。
// 真算：用 _bs.js 的 greeks()。口径：vega/每1% · theta/每天 · rho/每1%。
import { greeks } from "./_bs.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">📊 ${T("希腊字母仪表盘：一张期权的五块“表针”", "The Greeks Dashboard: five gauges on one option")}</div>

      <div class="demo-row" style="margin-bottom:6px">
        <div class="demo-seg" id="gd-type">
          <button data-t="call" class="on">${T("看涨 Call", "Call")}</button>
          <button data-t="put">${T("看跌 Put", "Put")}</button>
        </div>
      </div>

      <div class="demo-grid">
        <div class="demo-block"><label class="demo-label">${T("标的价 S", "Spot S")} = <b id="gd-s-v">100</b></label><input class="demo-slider" id="gd-s" type="range" min="60" max="140" step="1" value="100"/></div>
        <div class="demo-block"><label class="demo-label">${T("行权价 K", "Strike K")} = <b id="gd-k-v">100</b></label><input class="demo-slider" id="gd-k" type="range" min="60" max="140" step="1" value="100"/></div>
        <div class="demo-block"><label class="demo-label">${T("到期天数", "Days to expiry")} = <b id="gd-d-v">90</b></label><input class="demo-slider" id="gd-d" type="range" min="1" max="365" step="1" value="90"/></div>
        <div class="demo-block"><label class="demo-label">${T("隐含波动率 IV", "Implied vol")} = <b id="gd-iv-v">20</b>%</label><input class="demo-slider" id="gd-iv" type="range" min="5" max="120" step="1" value="20"/></div>
      </div>

      <div class="detail" style="text-align:center;margin-top:12px">
        <div class="dk">${T("期权理论价（每股）", "Option value (per share)")}</div>
        <div style="font-size:30px;font-weight:800;color:var(--accent-ink);font-variant-numeric:tabular-nums;line-height:1.2" id="gd-price">–</div>
        <div class="dk" id="gd-contract">${T("一张合约 (×100) ≈ –", "Per contract (×100) ≈ –")}</div>
      </div>

      <div class="stat-row" style="margin-top:14px">
        <div class="stat"><div class="k">Delta (Δ)</div><div class="v acc" id="gd-delta">–</div></div>
        <div class="stat"><div class="k">Gamma (Γ)</div><div class="v pos" id="gd-gamma">–</div></div>
        <div class="stat"><div class="k">${T("Theta /天", "Theta /day")}</div><div class="v neg" id="gd-theta">–</div></div>
        <div class="stat"><div class="k">Vega /1%</div><div class="v pos" id="gd-vega">–</div></div>
        <div class="stat"><div class="k">Rho /1%</div><div class="v" id="gd-rho">–</div></div>
      </div>

      <div class="demo-meta" id="gd-meta" style="margin-top:10px"></div>
      <p class="demo-tip" id="gd-tip"></p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  const els = { s: $("#gd-s"), k: $("#gd-k"), d: $("#gd-d"), iv: $("#gd-iv") };
  let type = "call";
  const money = (v) => "$" + v.toFixed(2);

  function paint() {
    const S = +els.s.value, K = +els.k.value, days = +els.d.value, sigma = +els.iv.value / 100;
    const Tyr = days / 365, r = 0.04;

    $("#gd-s-v").textContent = S;
    $("#gd-k-v").textContent = K;
    $("#gd-d-v").textContent = days;
    $("#gd-iv-v").textContent = (sigma * 100).toFixed(0);

    const g = greeks({ S, K, T: Tyr, r, sigma, type });
    $("#gd-price").textContent = money(g.price);
    $("#gd-contract").textContent = T("一张合约 (×100) ≈ ", "Per contract (×100) ≈ ") + "$" + (g.price * 100).toFixed(0);

    $("#gd-delta").textContent = (g.delta >= 0 ? "+" : "") + g.delta.toFixed(3);
    $("#gd-gamma").textContent = g.gamma.toFixed(4);
    $("#gd-theta").textContent = g.theta.toFixed(3);
    $("#gd-vega").textContent = "+" + g.vega.toFixed(3);
    $("#gd-rho").textContent = (g.rho >= 0 ? "+" : "") + g.rho.toFixed(3);
    $("#gd-delta").className = "v acc";
    $("#gd-rho").className = "v " + (g.rho >= 0 ? "pos" : "neg");

    // “一张合约”口径的金额希腊字母（×100），帮助建立量级直觉
    $("#gd-meta").innerHTML = T(
      `按<b>一张合约 (×100)</b>：Delta ≈ 等效 <b>${(g.delta * 100).toFixed(0)}</b> 股；每天 Theta ≈ <b>$${(g.theta * 100).toFixed(1)}</b>；IV 每 +1% → <b>$${(g.vega * 100).toFixed(1)}</b>。`,
      `Per <b>contract (×100)</b>: Delta ≈ <b>${(g.delta * 100).toFixed(0)}</b> equivalent shares; daily Theta ≈ <b>$${(g.theta * 100).toFixed(1)}</b>; each +1% IV → <b>$${(g.vega * 100).toFixed(1)}</b>.`
    );

    const moneyness = S > K * 1.03 ? T("实值", "ITM") : S < K * 0.97 ? T("虚值", "OTM") : T("平值", "ATM");
    $("#gd-tip").innerHTML = T(
      `当前为<b>${moneyness}</b>${type === "call" ? T("看涨", "call") : T("看跌", "put")}。你买这张期权，天生持有 <b>+Gamma、+Vega、−Theta</b>（每天付时间租金换凸性与波动率敞口）。试试：把<b>天数</b>拖到个位数 → 看 Gamma 飙升（阶段 5.3）；把 <b>IV</b> 拉高 → 看涨看跌都变贵（Vega>0，阶段 5.5）；把<b>天数</b>拖到很大 → 看 Rho 变显著（LEAPS，阶段 5.6）。`,
      `Now <b>${moneyness}</b> ${type}. Buying this option, you are born with <b>+Gamma, +Vega, −Theta</b> (paying daily time-rent for convexity and vol exposure). Try: drag <b>days</b> to single digits → Gamma spikes (Stage 5.3); raise <b>IV</b> → both calls and puts get pricier (Vega>0, Stage 5.5); drag <b>days</b> high → Rho grows (LEAPS, Stage 5.6).`
    );
  }

  $("#gd-type").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    type = b.dataset.t;
    [...$("#gd-type").children].forEach((c) => c.classList.toggle("on", c === b));
    paint();
  });
  Object.values(els).forEach((el) => el.addEventListener("input", paint));
  paint();
}
