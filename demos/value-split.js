// 交互演示：权利金 = 内在价值 + 时间价值
// 用 Black-Scholes 真算权利金，拆成 内在价值 = max(S−K,0)/max(K−S,0) 与 时间价值 = 权利金 − 内在。
// 滑块：S(70–130, K=100 固定)、到期天数(1–180)、IV(10–60%)。分段切 看涨/看跌。
// 把天数拖到 1，时间价值≈0：到期只剩内在价值。
import { bsPrice } from "./_bs.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const K = 100, R = 0.04;     // 行权价固定、无风险利率

  let type = "call";
  let S = 105, days = 90, iv = 30;   // iv 以百分数存

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🧊 ${T("拆解权利金 · 内在价值 + 时间价值", "Split the Premium · Intrinsic + Time")} <span style="color:var(--muted);font-weight:400">(K=100)</span></div>

      <div class="demo-row">
        <div class="demo-seg" id="vs-type">
          <button data-v="call" class="on">${T("看涨 Call", "Call")}</button>
          <button data-v="put">${T("看跌 Put", "Put")}</button>
        </div>
      </div>

      <div class="demo-grid-3" style="margin-top:12px">
        <div class="demo-block"><label class="demo-label">${T("现价 S", "Spot S")} = <b id="vs-sl">105</b></label><input class="demo-slider" id="vs-ss" type="range" min="70" max="130" step="1" value="105"/></div>
        <div class="demo-block"><label class="demo-label">${T("到期天数", "Days to expiry")} = <b id="vs-dl">90</b></label><input class="demo-slider" id="vs-ds" type="range" min="1" max="180" step="1" value="90"/></div>
        <div class="demo-block"><label class="demo-label">${T("隐含波动率 IV", "Implied vol IV")} = <b id="vs-il">30</b>%</label><input class="demo-slider" id="vs-is" type="range" min="10" max="60" step="1" value="30"/></div>
      </div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("权利金(BS)", "Premium (BS)")}</div><div class="v acc" id="vs-prem">–</div></div>
        <div class="stat"><div class="k">${T("内在价值", "Intrinsic")}</div><div class="v" id="vs-intr">–</div></div>
        <div class="stat"><div class="k">${T("时间价值", "Time value")}</div><div class="v" id="vs-time">–</div></div>
      </div>

      <div style="margin-top:14px">
        <div class="bar2"><span class="lab">${T("每股构成", "Per share")}</span>
          <span class="track" style="display:flex">
            <span class="fill" id="vs-bi" style="background:var(--accent);border-radius:6px 0 0 6px"></span>
            <span class="fill" id="vs-bt" style="background:var(--gold);border-radius:0 6px 6px 0"></span>
          </span>
          <span class="val" id="vs-tot">–</span>
        </div>
        <div class="payoff-legend">
          <span><i style="background:var(--accent)"></i>${T("内在价值", "Intrinsic")}</span>
          <span><i style="background:var(--gold)"></i>${T("时间价值", "Time value")}</span>
        </div>
      </div>

      <p class="demo-tip" id="vs-tip"></p>
    </div>`;

  const $ = (id) => root.querySelector(id);

  function paint() {
    $("#vs-sl").textContent = S;
    $("#vs-dl").textContent = days;
    $("#vs-il").textContent = iv;

    const Tyr = days / 365;
    const prem = bsPrice({ S, K, T: Tyr, r: R, sigma: iv / 100, type });
    const intrinsic = type === "put" ? Math.max(K - S, 0) : Math.max(S - K, 0);
    const time = Math.max(prem - intrinsic, 0);   // 数值上钳到非负

    $("#vs-prem").textContent = "$" + prem.toFixed(2);
    $("#vs-intr").textContent = "$" + intrinsic.toFixed(2);
    $("#vs-time").textContent = "$" + time.toFixed(2);
    $("#vs-tot").textContent = "$" + prem.toFixed(2);

    const tot = Math.max(prem, 0.01);
    $("#vs-bi").style.width = (intrinsic / tot * 100).toFixed(1) + "%";
    $("#vs-bt").style.width = (time / tot * 100).toFixed(1) + "%";

    // 提示：天数很小时点出时间价值→0
    let tip;
    if (days <= 3) tip = T(
      `只剩 <b>${days}</b> 天到期：时间价值已几乎榨干（≈$${time.toFixed(2)}），权利金塌回<b>内在价值</b>。到期那一刻时间价值精确归零——这就是 Theta（阶段 5.4）。`,
      `Only <b>${days}</b> day(s) left: time value is nearly squeezed out (≈$${time.toFixed(2)}), the premium collapsing to <b>intrinsic value</b>. At expiry it hits exactly zero — that's Theta (阶段 5.4).`
    );
    else if (intrinsic === 0) tip = T(
      `当前<b>虚值</b>（内在价值=0），权利金 <b>$${prem.toFixed(2)}</b> <b>全部是时间价值</b>。把天数拖小、或把 IV 调低，看它怎么融化（阶段 1.6）。`,
      `Currently <b>OTM</b> (intrinsic=0): the entire $${prem.toFixed(2)} premium is <b>time value</b>. Drag days down or IV lower to watch it melt (阶段 1.6).`
    );
    else tip = T(
      `权利金 = 内在 <b>$${intrinsic.toFixed(2)}</b> + 时间 <b>$${time.toFixed(2)}</b>。<b>调高 IV</b> 时间价值变厚、<b>缩短天数</b>它融化——这正是波动率与 Theta 在拉扯的那块（阶段 4.1、5.4）。`,
      `Premium = intrinsic <b>$${intrinsic.toFixed(2)}</b> + time <b>$${time.toFixed(2)}</b>. Raise IV and time value swells; shorten days and it melts — the tug-of-war of volatility and Theta (阶段 4.1, 5.4).`
    );
    $("#vs-tip").innerHTML = tip;
  }

  $("#vs-type").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    type = b.dataset.v;
    $("#vs-type").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    paint();
  });
  $("#vs-ss").addEventListener("input", (e) => { S = +e.target.value; paint(); });
  $("#vs-ds").addEventListener("input", (e) => { days = +e.target.value; paint(); });
  $("#vs-is").addEventListener("input", (e) => { iv = +e.target.value; paint(); });

  paint();
}
