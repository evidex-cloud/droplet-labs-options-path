// 交互演示：模拟下单票（order ticket）
// 选 看涨/看跌 · 买/卖 · 开/平；给定 bid/ask；限价滑块在其间；
// 计算成交可能性、总成本/贷记(×100)、买卖价差成本；卖出时给保证金/担保估计。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;

  // 固定一个报价场景（看涨/看跌各一套），现价 100、行权价 100
  const SPOT = 100, STRIKE = 100;
  const QUOTE = {
    call: { bid: 3.10, ask: 3.30 },
    put: { bid: 3.00, ask: 3.20 },
  };

  let type = "call";   // call | put
  let side = "buy";    // buy | sell
  let oc = "open";     // open | close
  let limit = 3.20;    // 限价

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🧾 ${T("模拟下单票 · 限价怎么挂", "Mock Order Ticket · how to set a limit")}</div>

      <div class="cmp" style="grid-template-columns:1fr 1fr 1fr">
        <div>
          <div class="demo-label">${T("合约", "Contract")}</div>
          <div class="demo-seg" id="ot-type">
            <button data-t="call" class="on">${T("看涨", "Call")}</button>
            <button data-t="put">${T("看跌", "Put")}</button>
          </div>
        </div>
        <div>
          <div class="demo-label">${T("方向", "Side")}</div>
          <div class="demo-seg" id="ot-side">
            <button data-s="buy" class="on">${T("买", "Buy")}</button>
            <button data-s="sell">${T("卖", "Sell")}</button>
          </div>
        </div>
        <div>
          <div class="demo-label">${T("意图", "Intent")}</div>
          <div class="demo-seg" id="ot-oc">
            <button data-o="open" class="on">${T("开仓", "Open")}</button>
            <button data-o="close">${T("平仓", "Close")}</button>
          </div>
        </div>
      </div>

      <div class="demo-block" style="margin-top:14px">
        <div class="demo-row" style="margin-bottom:4px">
          <span class="dk" style="color:var(--red)">Bid <b id="ot-bid">3.10</b></span>
          <span class="dk" style="color:var(--muted)">${T("中间价", "Mid")} <b id="ot-mid">3.20</b></span>
          <span class="dk" style="color:var(--green)">Ask <b id="ot-ask">3.30</b></span>
        </div>
        <label class="demo-label">${T("限价 Limit", "Limit price")} = <b id="ot-lim">3.20</b></label>
        <input class="demo-slider" id="ot-lims" type="range" min="2.80" max="3.60" step="0.01" value="3.20"/>
      </div>

      <div id="ot-result"></div>

      <p class="demo-tip">${T("买入：限价 ≥ ask 立刻成交、挂中间价常能省半个价差；卖出反之。价差成本 = (ask−bid)×100。卖出开仓要看保证金：现金担保看跌≈K×100、备兑看涨用持股担保、裸卖风险最大。",
        "Buying: limit ≥ ask fills instantly, mid often saves half the spread; selling is the mirror. Spread cost = (ask−bid)×100. Selling-to-open needs margin: cash-secured put ≈ K×100, covered call uses your shares, naked is riskiest.")}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const lims = $("#ot-lims");

  function fillLikelihood(q) {
    // 买方：limit>=ask 立刻；limit==mid 中等偏好；<bid 很低
    // 卖方：limit<=bid 立刻；limit==mid 中等；>ask 很低
    const { bid, ask } = q;
    const mid = (bid + ask) / 2;
    if (side === "buy") {
      if (limit >= ask - 1e-9) return { p: T("立刻成交", "Instant"), cls: "ok", note: T("吃掉卖单(付满 ask)", "lifts the offer (pays full ask)") };
      if (limit >= mid - 1e-9) return { p: T("较可能", "Likely"), cls: "acc", note: T("挂在中间价附近，常能省半个价差", "near mid — often saves half the spread") };
      if (limit > bid + 1e-9) return { p: T("偏低", "Low"), cls: "acc", note: T("低于中间价，要等卖方让价", "below mid — wait for sellers to come down") };
      return { p: T("几乎不成交", "Unlikely"), cls: "bad", note: T("≤ bid，等于在排队接最差价", "at/below bid — back of the queue") };
    } else {
      if (limit <= bid + 1e-9) return { p: T("立刻成交", "Instant"), cls: "ok", note: T("砸向买单(收到 bid)", "hits the bid (receives bid)") };
      if (limit <= mid + 1e-9) return { p: T("较可能", "Likely"), cls: "acc", note: T("挂在中间价附近，常能多收半个价差", "near mid — often gains half the spread") };
      if (limit < ask - 1e-9) return { p: T("偏低", "Low"), cls: "acc", note: T("高于中间价，要等买方抬价", "above mid — wait for buyers to come up") };
      return { p: T("几乎不成交", "Unlikely"), cls: "bad", note: T("≥ ask，要价太高", "at/above ask — asking too much") };
    }
  }

  function marginEstimate(q) {
    // 仅卖出开仓时显示
    const prem = limit; // 假设以限价成交
    if (type === "put") {
      const collateral = STRIKE * MULT;
      const net = collateral - prem * MULT;
      return T(
        `现金担保看跌：冻结 ≈ K×100 = ${STRIKE}×100 = <span class="num">$${collateral.toFixed(0)}</span>（减权利金后净占用 ≈ <span class="num">$${net.toFixed(0)}</span>）。被指派则按 ${STRIKE} 接 100 股。`,
        `Cash-secured put: locks ≈ K×100 = ${STRIKE}×100 = <span class="num">$${collateral.toFixed(0)}</span> (net ≈ <span class="num">$${net.toFixed(0)}</span> after premium). If assigned, buy 100 shares at ${STRIKE}.`
      );
    }
    // call 卖出
    return T(
      `卖看涨：若<b>备兑</b>(已持 100 股)，股票即担保、不额外占现金，但放弃 ${STRIKE} 以上涨幅；若<b>裸卖</b>，理论亏损无限，券商按规则冻结浮动保证金，散户多受限。`,
      `Selling a call: if <b>covered</b> (own 100 shares), the stock is collateral — no extra cash, but you cap upside above ${STRIKE}; if <b>naked</b>, loss is theoretically unlimited and brokers lock a variable margin (often restricted for retail).`
    );
  }

  function paint() {
    const q = QUOTE[type];
    const mid = (q.bid + q.ask) / 2;
    $("#ot-bid").textContent = q.bid.toFixed(2);
    $("#ot-ask").textContent = q.ask.toFixed(2);
    $("#ot-mid").textContent = mid.toFixed(2);

    // 调整 limit 滑块范围到当前报价附近
    lims.min = (q.bid - 0.30).toFixed(2);
    lims.max = (q.ask + 0.30).toFixed(2);
    limit = +(+lims.value).toFixed(2);
    $("#ot-lim").textContent = limit.toFixed(2);

    const fl = fillLikelihood(q);
    const spreadCost = (q.ask - q.bid) * MULT;

    // 成交金额（按限价成交估计；买=付出、卖=收取）
    const cashEach = limit * MULT;
    const isBuy = side === "buy";
    const cashTxt = isBuy
      ? `${T("总成本(付出)", "Total cost (debit)")}：<span class="num">−$${cashEach.toFixed(0)}</span>`
      : `${T("总贷记(收取)", "Total credit")}：<span class="num">+$${cashEach.toFixed(0)}</span>`;

    // 指令名称
    const cmd = (isBuy ? T("买入", "Buy") : T("卖出", "Sell")) + (oc === "open" ? T("开仓", " to Open") : T("平仓", " to Close"));
    const cmdEn = (isBuy ? "Buy" : "Sell") + (oc === "open" ? " to Open" : " to Close");

    // 卖出开仓 → 保证金块
    const showMargin = side === "sell" && oc === "open";
    const marginBlock = showMargin
      ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--line-soft)"><span class="dk">${T("保证金 / 担保", "Margin / collateral")}：</span>${marginEstimate(q)}</div>`
      : "";

    $("#ot-result").innerHTML = `
      <div class="detail">
        <div style="margin-bottom:6px">
          <span class="pill acc">${en ? cmdEn : cmd}</span>
          <span class="leg-pill ${type === "call" ? "call" : "put"}" style="margin-left:6px">${type === "call" ? "CALL" : "PUT"}</span>
          <span class="leg-tag" style="margin-left:6px">K=${STRIKE} · ${T("现价", "spot")} ${SPOT}</span>
        </div>
        <div class="demo-row" style="margin:2px 0">
          <span>${T("成交可能性", "Fill likelihood")}：<span class="pill ${fl.cls}">${fl.p}</span></span>
          <span class="dk">${fl.note}</span>
        </div>
        <div style="margin-top:6px">${cashTxt}　@ ${limit.toFixed(2)} × 100</div>
        <div class="dk" style="margin-top:4px">${T("买卖价差成本", "Spread cost")} = (ask−bid)×100 = (${q.ask.toFixed(2)}−${q.bid.toFixed(2)})×100 = <span class="num">$${spreadCost.toFixed(0)}</span>　${T("(进出一次的隐性成本)", "(hidden round-trip cost)")}</div>
        ${marginBlock}
      </div>`;
  }

  // 分段切换
  function seg(id, attr, set) {
    $(id).querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () => {
        $(id).querySelectorAll("button").forEach((x) => x.classList.remove("on"));
        b.classList.add("on");
        set(b.dataset[attr]);
        // 切到新合约时，把 limit 重置到中间价
        if (id === "#ot-type") {
          const q = QUOTE[type];
          lims.value = ((q.bid + q.ask) / 2).toFixed(2);
        }
        paint();
      });
    });
  }
  seg("#ot-type", "t", (v) => (type = v));
  seg("#ot-side", "s", (v) => (side = v));
  seg("#ot-oc", "o", (v) => (oc = v));
  lims.addEventListener("input", paint);

  paint();
}
