// 交互演示：做市商 Gamma 如何撬动市场。
// 分段切 [做市商多 Gamma / 做市商空 Gamma]；价格冲击滑块（−5%~+5%）。
// 展示做市商的对冲响应（买/卖股票）如何 抑制（多 Gamma）或 放大（空 Gamma）这个冲击——
// 一个简单的反馈示意：初始冲击 → 对冲流 → 最终落点（含箭头/数值）。绑到 Gamma 挤压。
// 真算：用 ½·Γ·(ΔS)² 量级 + 反馈系数把“对冲量 → 二次价格推动”可视化。

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  // 做市商总 Gamma 敞口（GEX）的抽象量级：每 1% 价格变动需对冲的股票名义额（百万美元/%）。
  const GEX = 50; // |对冲量| ≈ GEX × |ΔS%|（百万美元），示意规模
  const FEEDBACK = 0.6; // 对冲流回推价格的传导系数（示意）

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🔁 ${T("做市商 Gamma：减震器还是放大器？", "Dealer Gamma: shock absorber or amplifier?")}</div>

      <div class="demo-row">
        <div class="demo-seg" id="dg-pos">
          <button data-g="long" class="on">${T("做市商多 Gamma", "Dealer LONG Gamma")}</button>
          <button data-g="short">${T("做市商空 Gamma", "Dealer SHORT Gamma")}</button>
        </div>
      </div>

      <div class="demo-block">
        <label class="demo-label">${T("初始价格冲击", "Initial price shock")} = <b id="dg-shock-v">+2.0</b>%</label>
        <input class="demo-slider" id="dg-shock" type="range" min="-5" max="5" step="0.5" value="2"/>
      </div>

      <div id="dg-flow" class="detail" style="margin-top:6px"></div>

      <div class="stat-row" style="margin-top:14px">
        <div class="stat"><div class="k">${T("初始冲击", "Initial shock")}</div><div class="v" id="dg-init">–</div></div>
        <div class="stat"><div class="k">${T("做市商对冲", "Dealer hedge")}</div><div class="v acc" id="dg-hedge">–</div></div>
        <div class="stat"><div class="k">${T("最终价格变动", "Final move")}</div><div class="v" id="dg-final">–</div></div>
        <div class="stat"><div class="k">${T("放大/抑制", "Amplify/Damp")}</div><div class="v" id="dg-ratio">–</div></div>
      </div>

      <p class="demo-tip" id="dg-tip"></p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  let pos = "long";

  function paint() {
    const shock = +$("#dg-shock").value;     // 初始冲击 %
    $("#dg-shock-v").textContent = (shock >= 0 ? "+" : "") + shock.toFixed(1);

    // 做市商对冲量（百万美元）：随价格涨需要的方向。
    // 多 Gamma：价涨→卖股(−)，价跌→买股(+)，逆势 → 抑制。
    // 空 Gamma：价涨→买股(+)，价跌→卖股(−)，顺势 → 放大。
    const sign = pos === "long" ? -1 : +1;          // 对冲交易方向相对价格冲击
    const hedgeNotional = sign * GEX * shock;        // 正=买股、负=卖股（百万美元）
    // 对冲流回推价格：买股推涨、卖股推跌
    const secondaryMove = (hedgeNotional / GEX) * FEEDBACK; // 归一化回价格 %
    const finalMove = shock + secondaryMove;
    const ratio = shock !== 0 ? finalMove / shock : 1;

    const buying = hedgeNotional > 0;
    const arrow = (v) => (v > 0 ? "▲" : v < 0 ? "▼" : "•");
    const col = (v) => (v > 0 ? "var(--green)" : v < 0 ? "var(--red)" : "var(--muted)");

    // 反馈链示意
    $("#dg-flow").innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:14px;line-height:1.5">
        <span><span class="dk">${T("①初始冲击", "① Shock")}</span><br><b style="color:${col(shock)}">${arrow(shock)} ${(shock >= 0 ? "+" : "") + shock.toFixed(1)}%</b></span>
        <span style="color:var(--muted);font-size:18px">→</span>
        <span><span class="dk">${T("②做市商对冲", "② Dealer hedges")}</span><br><b style="color:var(--accent-ink)">${buying ? T("买入", "BUY") : T("卖出", "SELL")} ${T("约", "~")}$${Math.abs(hedgeNotional).toFixed(0)}M ${T("股票", "stock")}</b></span>
        <span style="color:var(--muted);font-size:18px">→</span>
        <span><span class="dk">${T("③二次推动", "③ Pushes price")}</span><br><b style="color:${col(secondaryMove)}">${arrow(secondaryMove)} ${(secondaryMove >= 0 ? "+" : "") + secondaryMove.toFixed(1)}%</b></span>
        <span style="color:var(--muted);font-size:18px">→</span>
        <span><span class="dk">${T("④最终", "④ Final")}</span><br><b style="color:${col(finalMove)}">${arrow(finalMove)} ${(finalMove >= 0 ? "+" : "") + finalMove.toFixed(1)}%</b></span>
      </div>`;

    $("#dg-init").textContent = (shock >= 0 ? "+" : "") + shock.toFixed(1) + "%";
    $("#dg-init").className = "v";
    $("#dg-hedge").textContent = (buying ? "+" : "−") + "$" + Math.abs(hedgeNotional).toFixed(0) + "M";
    $("#dg-final").textContent = (finalMove >= 0 ? "+" : "") + finalMove.toFixed(1) + "%";
    $("#dg-final").className = "v " + (finalMove > 0 ? "pos" : finalMove < 0 ? "neg" : "");
    $("#dg-ratio").textContent = Math.abs(ratio).toFixed(2) + "×";
    $("#dg-ratio").className = "v " + (pos === "long" ? "acc" : "neg");

    let msg;
    if (shock === 0) {
      msg = T(
        `先把<b>价格冲击</b>拖离 0，再对比两种做市商 Gamma 头寸下，市场被<b>抑制</b>还是被<b>放大</b>。`,
        `Move the <b>price shock</b> off 0, then compare how the market is <b>damped</b> vs <b>amplified</b> under the two dealer Gamma positions.`
      );
    } else if (pos === "long") {
      msg = T(
        `<b>做市商多 Gamma = 减震器</b>。初始 ${(shock >= 0 ? "+" : "") + shock.toFixed(1)}% 的冲击，迫使做市商<b>${buying ? "买入" : "卖出"}</b>股票做<b>逆势</b>对冲（涨了卖、跌了买），把价格往回拉，最终只剩 <b>${(finalMove >= 0 ? "+" : "") + finalMove.toFixed(1)}%</b>（${Math.abs(ratio).toFixed(2)}× 原冲击）。结果：<b>波动被压制、市场倾向均值回归</b>，临近到期还会把价格“钉”在大行权价附近（阶段 8.5）。`,
        `<b>Dealer long Gamma = shock absorber</b>. The initial ${(shock >= 0 ? "+" : "") + shock.toFixed(1)}% shock forces dealers to <b>${buying ? "buy" : "sell"}</b> stock as a <b>counter-trend</b> hedge (sell rallies, buy dips), pulling price back to just <b>${(finalMove >= 0 ? "+" : "") + finalMove.toFixed(1)}%</b> (${Math.abs(ratio).toFixed(2)}× the shock). Result: <b>volatility is suppressed, the market mean-reverts</b>, and price pins near big strikes into expiry (Stage 8.5).`
      );
    } else {
      msg = T(
        `<b>做市商空 Gamma = 放大器</b>。初始 ${(shock >= 0 ? "+" : "") + shock.toFixed(1)}% 的冲击，迫使做市商<b>${buying ? "追买" : "割卖"}</b>股票做<b>顺势</b>对冲（涨了买、跌了卖），把价格推得更远，放大到 <b>${(finalMove >= 0 ? "+" : "") + finalMove.toFixed(1)}%</b>（${Math.abs(ratio).toFixed(2)}× 原冲击）。结果：<b>波动被放大、趋势自我强化</b>——下跌方向就是<b>加速崩盘</b>，上涨方向就是 <b>Gamma 挤压</b>（2021 meme 股，散户疯买看涨逼做市商不断追买）（阶段 8.5）。`,
        `<b>Dealer short Gamma = amplifier</b>. The initial ${(shock >= 0 ? "+" : "") + shock.toFixed(1)}% shock forces dealers to <b>${buying ? "chase-buy" : "dump"}</b> stock as a <b>trend-following</b> hedge (buy rallies, sell dips), pushing price further to <b>${(finalMove >= 0 ? "+" : "") + finalMove.toFixed(1)}%</b> (${Math.abs(ratio).toFixed(2)}× the shock). Result: <b>volatility is amplified, trends self-reinforce</b> — downward it's an <b>accelerating crash</b>, upward it's a <b>gamma squeeze</b> (2021 meme stocks: call-buying forces dealers to keep chasing) (Stage 8.5).`
      );
    }
    $("#dg-tip").innerHTML = msg;
  }

  $("#dg-pos").addEventListener("click", (e) => {
    const btn = e.target.closest("button"); if (!btn) return;
    pos = btn.dataset.g;
    [...$("#dg-pos").children].forEach((c) => c.classList.toggle("on", c === btn));
    paint();
  });
  $("#dg-shock").addEventListener("input", paint);
  paint();
}
