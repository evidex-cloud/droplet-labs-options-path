// 交互演示：用 Δ 股标的 + 借款复制一张看涨，复制成本 = 公平价
// 一步世界：S0=100 → Su 或 Sd。给定看涨 K，算 Δ=(Cu−Cd)/(Su−Sd)、借款 B、组合造价，
// 并逐一核对组合在涨/跌两种结局下都精确命中期权回报。可调 Su/Sd/K/r。真算。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;
  const S0 = 100;

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🧩 ${T("复制定价：Δ 股标的 + 借款 = 一张看涨", "Replication: Δ shares + a loan = one call")}</div>
      <p class="demo-meta">${T("一步世界：今天标的 S₀ = 100，一步后只会涨到 Sᵤ 或跌到 S_d。", "One-step world: today S₀ = 100; in one step it can only rise to Sᵤ or fall to S_d.")}</p>

      <div class="demo-grid-3">
        <div class="demo-block"><label class="demo-label">${T("上涨到 Sᵤ", "Up to Sᵤ")} = <b id="rp-su-v">120</b></label><input class="demo-slider" id="rp-su" type="range" min="105" max="160" step="1" value="120"/></div>
        <div class="demo-block"><label class="demo-label">${T("下跌到 S_d", "Down to S_d")} = <b id="rp-sd-v">90</b></label><input class="demo-slider" id="rp-sd" type="range" min="50" max="99" step="1" value="90"/></div>
        <div class="demo-block"><label class="demo-label">${T("行权价 K", "Strike K")} = <b id="rp-k-v">105</b></label><input class="demo-slider" id="rp-k" type="range" min="80" max="140" step="1" value="105"/></div>
      </div>
      <div class="demo-block"><label class="demo-label">${T("一步的利率 r（年化，一步=1 年）", "One-step rate r (annual, step = 1 yr)")} = <b id="rp-r-v">0.0</b>%</label><input class="demo-slider" id="rp-r" type="range" min="0" max="8" step="0.5" value="0"/></div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("对冲比率 Δ", "Hedge ratio Δ")}</div><div class="v acc" id="rp-delta">–</div></div>
        <div class="stat"><div class="k">${T("借款 B (负=借入)", "Loan B (neg=borrow)")}</div><div class="v" id="rp-bond">–</div></div>
        <div class="stat"><div class="k">${T("复制成本 = 公平价", "Replication cost = fair value")}</div><div class="v acc" id="rp-fair">–</div></div>
      </div>

      <div class="cmp" style="margin-top:14px">
        <div class="cmp-cell">
          <h5>${T("结局 A：涨到 Sᵤ", "Outcome A: up to Sᵤ")}</h5>
          <div class="scn-meta" id="rp-up"></div>
        </div>
        <div class="cmp-cell">
          <h5>${T("结局 B：跌到 S_d", "Outcome B: down to S_d")}</h5>
          <div class="scn-meta" id="rp-dn"></div>
        </div>
      </div>
      <p class="demo-meta" id="rp-verdict"></p>

      <p class="demo-tip">${T("复制组合 = 买 <b>Δ 股</b>标的 + <b>借款 B</b>。注意它在<b>涨、跌两种结局下都精确等于期权回报</b>(每行 ✓)。既然回报永远相同，由无套利，看涨的公平价就等于<b>今天搭这个组合的成本</b> Δ·S₀ + B——和你心里那个“涨的概率”毫无关系。", "The replicating portfolio = buy <b>Δ shares</b> + a <b>loan B</b>. It matches the option's payoff <b>in BOTH outcomes</b> (✓ each row). Since the payoffs always match, no-arbitrage forces the call's fair value to equal <b>today's cost</b> of that portfolio, Δ·S₀ + B — with nothing to do with your guess of the up-probability.")}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  const els = { su: $("#rp-su"), sd: $("#rp-sd"), k: $("#rp-k"), r: $("#rp-r") };
  const m = (v) => (v >= 0 ? "$" : "−$") + Math.abs(v).toFixed(2);

  function paint() {
    let Su = +els.su.value, Sd = +els.sd.value;
    const K = +els.k.value, r = +els.r.value / 100;
    if (Sd >= Su) Sd = Su - 1; // 保护：保证 Su>Sd
    const dt = 1;

    $("#rp-su-v").textContent = Su;
    $("#rp-sd-v").textContent = Sd;
    $("#rp-k-v").textContent = K;
    $("#rp-r-v").textContent = (r * 100).toFixed(1);

    const Cu = Math.max(Su - K, 0);
    const Cd = Math.max(Sd - K, 0);
    const delta = (Cu - Cd) / (Su - Sd);
    // 复制：delta*Su + B*e^{r·dt} = Cu  → 今天借款 B = (Cu − delta*Su)·e^{−r·dt}
    const B = (Cu - delta * Su) * Math.exp(-r * dt);
    const cost = delta * S0 + B;

    // 组合到期价值（借款到期需还 B·e^{r·dt}）
    const grow = Math.exp(r * dt);
    const portUp = delta * Su + B * grow;
    const portDn = delta * Sd + B * grow;

    $("#rp-delta").textContent = delta.toFixed(3);
    $("#rp-bond").textContent = m(B);
    $("#rp-fair").textContent = m(cost) + (cost >= 0 ? ` (×100 = $${(cost * MULT).toFixed(0)})` : "");

    const okU = Math.abs(portUp - Cu) < 1e-6, okD = Math.abs(portDn - Cd) < 1e-6;
    const tick = (ok) => ok ? `<span class="pill ok">✓ ${T("吻合", "match")}</span>` : `<span class="pill bad">✗</span>`;

    $("#rp-up").innerHTML =
      `${T("看涨回报", "Call payoff")} max(${Su}−${K},0) = <b>${Cu.toFixed(2)}</b><br>` +
      `${T("组合：", "Portfolio:")} ${delta.toFixed(3)}×${Su} ${B >= 0 ? "+" : "−"} ${Math.abs(B * grow).toFixed(2)} = <b>${portUp.toFixed(2)}</b> ${tick(okU)}`;
    $("#rp-dn").innerHTML =
      `${T("看涨回报", "Call payoff")} max(${Sd}−${K},0) = <b>${Cd.toFixed(2)}</b><br>` +
      `${T("组合：", "Portfolio:")} ${delta.toFixed(3)}×${Sd} ${B >= 0 ? "+" : "−"} ${Math.abs(B * grow).toFixed(2)} = <b>${portDn.toFixed(2)}</b> ${tick(okD)}`;

    // 与风险中性价交叉验证（应一致）
    const u = Su / S0, d = Sd / S0;
    const p = (Math.exp(r * dt) - d) / (u - d);
    const rn = Math.exp(-r * dt) * (p * Cu + (1 - p) * Cd);
    $("#rp-verdict").innerHTML =
      `<span class="pill acc">${T("公平价", "Fair value")} = ${m(cost)}</span> ` +
      `${T("交叉验证 · 风险中性概率", "Cross-check · risk-neutral p")} p = ${p.toFixed(3)} → ${T("价", "price")} = ${m(rn)} ` +
      (Math.abs(rn - cost) < 1e-6 ? `<span class="pill ok">${T("一致 ✓", "agree ✓")}</span>` : "");
  }
  Object.values(els).forEach((el) => el.addEventListener("input", paint));
  paint();
}
