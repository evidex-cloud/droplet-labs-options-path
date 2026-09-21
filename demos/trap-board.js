// 陷阱清单：点选从“不安全”翻到“更稳”
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const items = [
    { u: T("永续能拿一辈子，没有风险", "Perps have no risk because they never expire"), s: T("没有到期 ≠ 没有损耗。正费率会像租金一样抽走多头；杠杆还会让你先被强平。", "No expiry ≠ no cost. Positive funding rents the long; leverage can liquidate you first.") },
    { u: T("屏幕上的资金费 APR 就是锁定收益", "The funding APR on screen is locked yield"), s: T("那是把当期快照年化。费率会变号、会夹断。实付只看结算次数 × 当期费率 × 名义。", "That annualizes one snapshot. The rate can flip and clamp. Cash is settlements × print × notional.") },
    { u: T("Hyperliquid 已经取代 Binance", "Hyperliquid replaced Binance"), s: T("Q1 2026 CoinGlass：Binance 衍生品约 $4.9T；HL 约 $492.7B。HL 是真竞争者，不是王座易主。", "Q1 2026 CoinGlass: Binance derivatives ~$4.9T; HL ~$492.7B. A real competitor, not a coronation.") },
    { u: T("ADL 只打穿仓那个人", "ADL only hits the bankrupt account"), s: T("穿仓者已经没钱了。ADL 减的是对手方向上还盈利的账户，好让交易所两边重新匹配。", "The bankrupt account is already empty. ADL cuts profitable opposite accounts so the book can rematch.") },
    { u: T("标记价 = 最新成交", "Mark = last"), s: T("last 会插针。强平和未实现盈亏通常看标记价；指数价是现货篮子。三者必须分开。", "Last can wick. Liq and uPnL usually use mark; index is a spot basket. Keep the three apart.") },
    { u: T("HIP-3 股票型永续 = 持有股票", "HIP-3 equity-like perps = owning the stock"), s: T("那是价格线性敞口，没有股东权、可能没有真实借券，早期数据不确定。当娱乐地图看社交强平更危险。", "It is linear price exposure: no shareholder rights, maybe no real borrow. Early prints are uncertain. Social liq maps as entertainment are worse.") },
    { u: T("隐藏杠杆：10× 再叠期权式想象", "Hidden leverage: 10× plus option-style thinking"), s: T("永续已经是保证金线性产品。再拿权利金思维去“加仓到回本”，爆仓会比 Theta 更快。", "A perp is already a margined linear product. Averaging down like an option premium will hit liq faster than Theta.") },
    { u: T("DEX 永续 = 无对手方风险", "DEX perps = no counterparty risk"), s: T("订单簿上没有单一交易所老板，仍有预言机、标记价、验证者、桥。FTX 教的是风控引擎也会死。", "No single exchange boss on the book; you still have oracles, mark, validators, bridges. FTX taught that risk engines die too.") },
  ];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">☑️ ${T("陷阱板 · 点选翻到更稳的说法", "Trap board · tap to flip to a safer line")}</div>
      <div id="tb-list"></div>
      <div class="stat-row">
        <div class="stat"><div class="k">${T("已翻成更稳", "Flipped safer")}</div><div class="v pos" id="tb-n">0 / ${items.length}</div></div>
      </div>
      <p class="demo-tip">${T("八条都是本阶段会反复打的坑。翻完并不等于你会交易——只是把口头禅换成可检验的句子。", "These eight are the stage’s recurring holes. Flipping them does not make you a trader — it replaces slogans with testable sentences.")}</p>
    </div>`;

  const $ = (id) => root.querySelector(id);
  const on = items.map(() => false);
  const list = $("#tb-list");

  function paint() {
    list.innerHTML = items.map((it, i) => `
      <div class="scn" data-i="${i}" style="cursor:pointer;margin-top:8px;border-color:${on[i] ? "var(--green)" : "var(--line)"}">
        <div class="scn-q">${on[i] ? "✓ " + it.s : "✗ " + it.u}</div>
        <div class="scn-meta">${on[i] ? T("已换成更稳表述", "Safer phrasing") : T("点击翻转", "Click to flip")}</div>
      </div>`).join("");
    $("#tb-n").textContent = on.filter(Boolean).length + " / " + items.length;
  }
  list.addEventListener("click", (e) => {
    const n = e.target.closest("[data-i]");
    if (!n) return;
    on[+n.dataset.i] = !on[+n.dataset.i];
    paint();
  });
  paint();
}
