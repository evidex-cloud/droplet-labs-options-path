// 交互演示：一张期权合约的解剖
// 把合约串 "AAPL 2026-09-18 C 150 @ 3.20" 的每一段做成可点 chip，点击展开 .detail 解释。
// 可切换 Call/Put、拖动行权价与权利金，实时重算 每张成本 与 盈亏平衡。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;

  let type = "C";          // C | P
  let strike = 150;
  let prem = 3.20;
  const UNDER = "AAPL", EXP = "2026-09-18";

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🔍 ${T("合约解剖 · 点每一段看含义", "Contract Anatomy · Click each part")}</div>

      <div class="demo-row">
        <div class="demo-seg" id="ca-type">
          <button data-v="C" class="on">${T("看涨 C", "Call C")}</button>
          <button data-v="P">${T("看跌 P", "Put P")}</button>
        </div>
      </div>

      <div class="demo-block" style="margin-top:14px">
        <div class="demo-btns" id="ca-chips" style="font-family:var(--mono);font-size:15px"></div>
      </div>

      <div id="ca-detail"></div>

      <div class="demo-grid" style="margin-top:14px">
        <div class="demo-block"><label class="demo-label">${T("行权价", "Strike")} = <b id="ca-kl">150</b></label><input class="demo-slider" id="ca-ks" type="range" min="100" max="200" step="5" value="150"/></div>
        <div class="demo-block"><label class="demo-label">${T("权利金(报价)", "Premium (quote)")} = <b id="ca-pl">3.20</b></label><input class="demo-slider" id="ca-ps" type="range" min="0.5" max="12" step="0.1" value="3.2"/></div>
      </div>

      <div class="stat-row">
        <div class="stat"><div class="k">${T("每张成本", "Cost / contract")}</div><div class="v acc" id="ca-cost">–</div></div>
        <div class="stat"><div class="k">${T("合约乘数", "Multiplier")}</div><div class="v">×100</div></div>
        <div class="stat"><div class="k">${T("盈亏平衡", "Breakeven")}</div><div class="v" id="ca-be">–</div></div>
      </div>

      <p class="demo-tip">${T("点上面任意一段，看它代表什么。关键一条：报价是<b>每股</b>价，<b>每张成本 = 报价 × 100</b>——别把账算小 100 倍。盈亏平衡：看涨 = 行权价 + 权利金，看跌 = 行权价 − 权利金。", "Click any part above to see what it means. The key: the quote is <b>per share</b>, so <b>cost per contract = quote × 100</b> — don't undercount by 100×. Breakeven: call = strike + premium, put = strike − premium.")}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);

  // 每段的解释
  function detailFor(part) {
    const occ = `${UNDER}${EXP.slice(2).replace(/-/g, "")}${type}${String(Math.round(strike * 1000)).padStart(8, "0")}`;
    const map = {
      under: [T("标的", "Underlying"), T(`这张期权写在 <b>${UNDER}</b> 上——它的价值随 ${UNDER} 股价波动。`, `The option is written on <b>${UNDER}</b> — its value moves with ${UNDER}'s share price.`)],
      exp: [T("到期日", "Expiration"), T(`权利在 <b>${EXP}</b>（周五收盘后）失效。过期未行权即归零；离到期越近，时间价值流失越快。`, `The right expires on <b>${EXP}</b> (after Friday's close). Unexercised, it goes to zero; time value bleeds faster as expiry nears.`)],
      type: [T("类型", "Type"), type === "C"
        ? T("<b>C = 看涨（Call）</b>：按行权价<b>买入</b>标的的权利。", "<b>C = Call</b>: the right to <b>buy</b> the underlying at the strike.")
        : T("<b>P = 看跌（Put）</b>：按行权价<b>卖出</b>标的的权利。", "<b>P = Put</b>: the right to <b>sell</b> the underlying at the strike.")],
      strike: [T("行权价", "Strike"), T(`约定的${type === "C" ? "买入" : "卖出"}价 <b>${strike}</b>。它是判断实值/虚值的基准线。`, `The agreed ${type === "C" ? "buy" : "sell"} price <b>${strike}</b>. It's the reference line for in/out-of-the-money.`)],
      prem: [T("权利金", "Premium"), T(`报价 <b>${prem.toFixed(2)}</b> 是<b>每股</b>价。实际你看到的是 bid/ask 两个价，这里取中间价（阶段 2.5 细讲）。`, `The quote <b>${prem.toFixed(2)}</b> is <b>per share</b>. In reality you see a bid and ask; this is the mid (see 阶段 2.5).`)],
      mult: [T("合约乘数 = 100", "Multiplier = 100"), T(`一张合约 = <b>100 股</b>。所以<b>每张成本 = ${prem.toFixed(2)} × 100 = $${(prem * MULT).toFixed(0)}</b>，不是 ${prem.toFixed(2)} 元。`, `One contract = <b>100 shares</b>. So <b>cost = ${prem.toFixed(2)} × 100 = $${(prem * MULT).toFixed(0)}</b>, not ${prem.toFixed(2)}.`)],
      occ: [T("期权代码（OCC）", "Option symbol (OCC)"), T(`券商用紧凑代码标识这张合约：<br><span class="num">${occ}</span><br>= 标的 + 到期(YYMMDD) + ${type} + 行权价×1000(补零)。`, `Brokers identify it with a compact symbol:<br><span class="num">${occ}</span><br>= underlying + expiry(YYMMDD) + ${type} + strike×1000 (zero-padded).`)],
    };
    return map[part];
  }

  let active = "mult";   // 默认高亮“合约乘数”，呼应教学重点

  function renderChips() {
    const chips = [
      ["under", UNDER],
      ["exp", EXP],
      ["type", type],
      ["strike", String(strike)],
      ["prem", "@ " + prem.toFixed(2)],
      ["mult", "×100"],
      ["occ", T("代码", "symbol")],
    ];
    $("#ca-chips").innerHTML = chips
      .map(([k, label]) => `<button class="demo-btn ${k === active ? "primary" : ""}" data-p="${k}">${label}</button>`)
      .join("");
    const d = detailFor(active);
    $("#ca-detail").innerHTML = `<div class="detail"><div class="dk">${d[0]}</div><div style="margin-top:5px">${d[1]}</div></div>`;
  }

  function renderStats() {
    $("#ca-kl").textContent = strike;
    $("#ca-pl").textContent = prem.toFixed(2);
    $("#ca-cost").textContent = "$" + (prem * MULT).toFixed(0);
    const be = type === "C" ? strike + prem : strike - prem;
    $("#ca-be").textContent = be.toFixed(2);
  }

  $("#ca-chips").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    active = b.dataset.p;
    renderChips();
  });
  $("#ca-type").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    type = b.dataset.v;
    $("#ca-type").querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    renderChips(); renderStats();
  });
  $("#ca-ks").addEventListener("input", (e) => { strike = +e.target.value; renderChips(); renderStats(); });
  $("#ca-ps").addEventListener("input", (e) => { prem = +e.target.value; renderChips(); renderStats(); });

  renderChips();
  renderStats();
}
