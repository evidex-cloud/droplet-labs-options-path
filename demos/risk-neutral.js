// 交互演示：风险中性定价 —— 真实涨概率不影响期权价
// 一步世界 S0=100→{Su,Sd}，看涨 K。让用户拖"真实上涨概率"，眼看：
// 期权公平价(用风险中性 p 或等价复制成本)纹丝不动，而"真实世界期望回报"随之大变。
// 把"真实概率决定你赚多少、风险中性概率决定期权值多少"钉进直觉。真算。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const S0 = 100;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🎭 ${T("风险中性：把“真实涨概率”拖来拖去，期权价为何不动", "Risk-neutral: drag the REAL up-probability — why the price won't budge")}</div>
      <p class="demo-meta">${T("一步世界：S₀ = 100，一步后涨到 Sᵤ 或跌到 S_d。看涨行权价 K。", "One-step world: S₀ = 100; up to Sᵤ or down to S_d. Call strike K.")}</p>

      <div class="demo-grid-3">
        <div class="demo-block"><label class="demo-label">Sᵤ = <b id="rn-su-v">120</b></label><input class="demo-slider" id="rn-su" type="range" min="105" max="160" step="1" value="120"/></div>
        <div class="demo-block"><label class="demo-label">S_d = <b id="rn-sd-v">90</b></label><input class="demo-slider" id="rn-sd" type="range" min="50" max="99" step="1" value="90"/></div>
        <div class="demo-block"><label class="demo-label">K = <b id="rn-k-v">105</b></label><input class="demo-slider" id="rn-k" type="range" min="80" max="140" step="1" value="105"/></div>
      </div>
      <div class="demo-block"><label class="demo-label">${T("利率 r (一步=1 年)", "Rate r (step = 1 yr)")} = <b id="rn-r-v">5.0</b>%</label><input class="demo-slider" id="rn-r" type="range" min="0" max="8" step="0.5" value="5"/></div>

      <div class="demo-block" style="border-top:1px solid var(--line-soft);padding-top:14px">
        <label class="demo-label">🎚️ ${T("你认为的<b>真实</b>上涨概率", "Your <b>real-world</b> up-probability")} = <b id="rn-rp-v">70</b>%</label>
        <input class="demo-slider" id="rn-rp" type="range" min="5" max="95" step="1" value="70"/>
      </div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("风险中性概率 p", "Risk-neutral p")}</div><div class="v" id="rn-p">–</div></div>
        <div class="stat"><div class="k">${T("真实世界 E[回报] (未贴现)", "Real-world E[payoff] (undisc.)")}</div><div class="v" id="rn-real">–</div></div>
        <div class="stat"><div class="k">${T("期权公平价", "Option fair value")}</div><div class="v acc" id="rn-fair">–</div></div>
      </div>

      <div class="bar2" style="margin-top:14px"><div class="lab">${T("真实期望回报", "Real E[payoff]")}</div><div class="track"><div class="fill" id="rn-breal" style="background:var(--gold)"></div></div><div class="val" id="rn-vreal">–</div></div>
      <div class="bar2"><div class="lab">${T("公平价(固定)", "Fair value (fixed)")}</div><div class="track"><div class="fill" id="rn-bfair" style="background:var(--accent)"></div></div><div class="val" id="rn-vfair">–</div></div>

      <p class="demo-meta" id="rn-msg"></p>

      <p class="demo-tip">${T("拖动“真实上涨概率”：金条(<b>你期望赚多少</b>)随它大幅起伏，但青条(<b>期权值多少</b>)<b>纹丝不动</b>。因为公平价 = 复制成本，只认 Sᵤ/S_d/K/r，与真实概率无关。真实概率高，只让你<b>期望中占便宜</b>(你的优势)，不该让你为期权多付一分钱——这正是风险中性最反直觉的一课。", "Drag the real up-probability: the gold bar (<b>what you expect to earn</b>) swings widely, but the teal bar (<b>what the option is worth</b>) <b>does not move</b>. Fair value = replication cost, set only by Sᵤ/S_d/K/r, independent of the real probability. A high real probability merely makes you <b>expect to profit</b> (your edge) — it shouldn't make you pay a cent more for the option. That's the most counter-intuitive lesson of risk-neutral pricing.")}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  const els = { su: $("#rn-su"), sd: $("#rn-sd"), k: $("#rn-k"), r: $("#rn-r"), rp: $("#rn-rp") };
  const m = (v) => "$" + v.toFixed(2);

  function paint() {
    let Su = +els.su.value, Sd = +els.sd.value;
    const K = +els.k.value, r = +els.r.value / 100, realP = +els.rp.value / 100;
    if (Sd >= Su) Sd = Su - 1;
    const dt = 1;

    $("#rn-su-v").textContent = Su;
    $("#rn-sd-v").textContent = Sd;
    $("#rn-k-v").textContent = K;
    $("#rn-r-v").textContent = (r * 100).toFixed(1);
    $("#rn-rp-v").textContent = (realP * 100).toFixed(0);

    const Cu = Math.max(Su - K, 0), Cd = Math.max(Sd - K, 0);
    const u = Su / S0, d = Sd / S0;
    const p = (Math.exp(r * dt) - d) / (u - d);              // 风险中性概率
    const fair = Math.exp(-r * dt) * (p * Cu + (1 - p) * Cd); // 公平价(=复制成本)
    const realE = realP * Cu + (1 - realP) * Cd;             // 真实世界期望回报(未贴现)

    $("#rn-p").textContent = p.toFixed(3);
    $("#rn-real").textContent = m(realE);
    $("#rn-fair").textContent = m(fair);

    const scale = Math.max(Cu, 1e-6); // 用最大可能回报作满刻度
    $("#rn-breal").style.width = (realE / scale * 100).toFixed(1) + "%";
    $("#rn-bfair").style.width = (fair / scale * 100).toFixed(1) + "%";
    $("#rn-vreal").textContent = m(realE);
    $("#rn-vfair").textContent = m(fair);

    const edge = realE - fair; // 正=你的真实期望高于成本=有优势
    $("#rn-msg").innerHTML = edge > 0.005
      ? `<span class="pill ok">${T("你有优势", "You have an edge")}</span> ${T("真实期望回报", "Real E[payoff]")} ${m(realE)} > ${T("公平价", "fair value")} ${m(fair)}。${T("以公平价买入、若判断正确，长期期望为正——但这优势属于你，不抬高期权价。", "Buy at fair value and, if you're right, you expect to profit — but that edge is yours, it doesn't raise the option's price.")}`
      : edge < -0.005
        ? `<span class="pill bad">${T("无优势", "No edge")}</span> ${T("真实期望回报", "Real E[payoff]")} ${m(realE)} < ${T("公平价", "fair value")} ${m(fair)}。${T("即便如此，公平价依旧是这个数——它由复制成本决定。", "Even so, the fair value is still this number — set by replication cost.")}`
        : `<span class="pill acc">${T("恰好持平", "Break-even")}</span> ${T("此时真实期望≈公平价。", "Here real expectation ≈ fair value.")}`;
  }
  Object.values(els).forEach((el) => el.addEventListener("input", paint));
  paint();
}
