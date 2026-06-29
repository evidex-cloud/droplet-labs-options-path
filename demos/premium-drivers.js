// 交互演示：决定权利金的六个因素
// 六个滑块（S/K/天数/IV/r/q）+ 看涨/看跌切换，用 bsPrice 实时算权利金，
// 拆成内在价值 + 时间价值，并用两条对比柱展示"波动率是主角"——把 IV 拉到两端看价格如何被它主导。
import { bsPrice } from "./_bs.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🎛️ ${T("拧动六个旋钮，看权利金怎么变", "Turn the six dials, watch the premium move")}</div>

      <div class="demo-row" style="margin-bottom:6px">
        <span class="demo-label" style="margin:0">${T("期权类型", "Option type")}</span>
        <div class="demo-seg" id="pd-seg">
          <button data-t="call" class="on">${T("看涨 Call", "Call")}</button>
          <button data-t="put">${T("看跌 Put", "Put")}</button>
        </div>
      </div>

      <div class="demo-grid-3">
        <div class="demo-block"><label class="demo-label">${T("标的价 S", "Spot S")} = <b id="pd-s-v">100</b></label><input class="demo-slider" id="pd-s" type="range" min="60" max="140" step="1" value="100"/></div>
        <div class="demo-block"><label class="demo-label">${T("行权价 K", "Strike K")} = <b id="pd-k-v">100</b></label><input class="demo-slider" id="pd-k" type="range" min="60" max="140" step="1" value="100"/></div>
        <div class="demo-block"><label class="demo-label">${T("到期天数", "Days to expiry")} = <b id="pd-d-v">90</b></label><input class="demo-slider" id="pd-d" type="range" min="1" max="365" step="1" value="90"/></div>
        <div class="demo-block"><label class="demo-label">${T("波动率 σ (IV)", "Volatility σ (IV)")} = <b id="pd-iv-v">25</b>%</label><input class="demo-slider" id="pd-iv" type="range" min="5" max="80" step="1" value="25"/></div>
        <div class="demo-block"><label class="demo-label">${T("无风险利率 r", "Risk-free r")} = <b id="pd-r-v">4.0</b>%</label><input class="demo-slider" id="pd-r" type="range" min="0" max="8" step="0.5" value="4"/></div>
        <div class="demo-block"><label class="demo-label">${T("股息率 q", "Dividend q")} = <b id="pd-q-v">0.0</b>%</label><input class="demo-slider" id="pd-q" type="range" min="0" max="5" step="0.5" value="0"/></div>
      </div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("权利金 (每张 ×100)", "Premium (×100)")}</div><div class="v acc" id="pd-prem">–</div></div>
        <div class="stat"><div class="k">${T("内在价值", "Intrinsic")}</div><div class="v" id="pd-intr">–</div></div>
        <div class="stat"><div class="k">${T("时间价值", "Time value")}</div><div class="v" id="pd-time">–</div></div>
      </div>

      <div class="demo-block" style="margin-top:18px">
        <label class="demo-label">${T("波动率是主角：同一张期权，σ 在两端时的价格", "Volatility is the star: same option, premium at low vs high σ")}</label>
        <div class="bar2"><div class="lab">σ = 10%</div><div class="track"><div class="fill" id="pd-blo" style="background:var(--accent-line)"></div></div><div class="val" id="pd-vlo">–</div></div>
        <div class="bar2"><div class="lab">σ = <b id="pd-bnow-l">25</b>%</div><div class="track"><div class="fill" id="pd-bnow" style="background:var(--accent)"></div></div><div class="val" id="pd-vnow">–</div></div>
        <div class="bar2"><div class="lab">σ = 80%</div><div class="track"><div class="fill" id="pd-bhi" style="background:var(--gold)"></div></div><div class="val" id="pd-vhi">–</div></div>
      </div>

      <p class="demo-tip">${T("六个旋钮里，<b>波动率 σ 是真正的主角</b>：把它从 10% 拉到 80%，权利金能涨好几倍，而 S、K、T 一动不动。注意利率 r↑ 让看涨变贵、看跌变便宜；股息 q↑ 正相反。买一张平值期权时，内在价值为 0——你付的几乎全是时间价值。", "Of the six dials, <b>volatility σ is the real star</b>: drag it from 10% to 80% and the premium multiplies — with S, K, T untouched. Note r↑ makes calls dearer and puts cheaper; q↑ does the opposite. Buy an at-the-money option and intrinsic is 0 — you pay almost pure time value.")}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  const els = {
    s: $("#pd-s"), k: $("#pd-k"), d: $("#pd-d"), iv: $("#pd-iv"), r: $("#pd-r"), q: $("#pd-q"),
  };
  let type = "call";

  const money = (v) => (v >= 0 ? "$" : "−$") + Math.abs(v).toFixed(0);

  function paint() {
    const S = +els.s.value, K = +els.k.value, days = +els.d.value;
    const iv = +els.iv.value / 100, r = +els.r.value / 100, q = +els.q.value / 100;
    const Tt = days / 365;

    $("#pd-s-v").textContent = S;
    $("#pd-k-v").textContent = K;
    $("#pd-d-v").textContent = days;
    $("#pd-iv-v").textContent = (iv * 100).toFixed(0);
    $("#pd-r-v").textContent = (r * 100).toFixed(1);
    $("#pd-q-v").textContent = (q * 100).toFixed(1);
    $("#pd-bnow-l").textContent = (iv * 100).toFixed(0);

    const o = { S, K, T: Tt, r, sigma: iv, q, type };
    const prem = bsPrice(o);
    const intrinsic = type === "put" ? Math.max(K - S, 0) : Math.max(S - K, 0);
    const timeVal = Math.max(prem - intrinsic, 0);

    $("#pd-prem").textContent = money(prem * MULT);
    $("#pd-intr").textContent = money(intrinsic * MULT);
    $("#pd-time").textContent = money(timeVal * MULT);

    // 波动率对比柱：固定其余、只换 σ
    const pLo = bsPrice({ ...o, sigma: 0.10 });
    const pNow = prem;
    const pHi = bsPrice({ ...o, sigma: 0.80 });
    const scale = Math.max(pHi, pNow, pLo, 1e-6);
    $("#pd-blo").style.width = (pLo / scale * 100).toFixed(1) + "%";
    $("#pd-bnow").style.width = (pNow / scale * 100).toFixed(1) + "%";
    $("#pd-bhi").style.width = (pHi / scale * 100).toFixed(1) + "%";
    $("#pd-vlo").textContent = money(pLo * MULT);
    $("#pd-vnow").textContent = money(pNow * MULT);
    $("#pd-vhi").textContent = money(pHi * MULT);
  }

  $("#pd-seg").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    type = b.dataset.t;
    [...$("#pd-seg").children].forEach((c) => c.classList.toggle("on", c === b));
    paint();
  });
  Object.values(els).forEach((el) => el.addEventListener("input", paint));
  paint();
}
