// 交互演示：读懂期权链（T 字形报价表）
// 现价 100，9 个行权价（84..116 步长 4），切换到期(30/60/120天) 与 IV 档位。
// 每行用 Black-Scholes 真算看涨/看跌的 bid/ask 与 IV；高亮 ATM 行、给实值格染色；
// 点击某行 → .detail 显示该看涨/看跌的理论价与 Delta。
import { bsPrice, greeks } from "./_bs.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;
  const SPOT = 100, r = 0.04;
  const STRIKES = [84, 88, 92, 96, 100, 104, 108, 112, 116];

  // 状态：到期天数 + IV 档位
  let days = 60;
  let ivRegime = 0.30; // 中
  // 简单的价差模型：越虚值/越冷门价差越宽（按 |moneyness| 放大），半价差 = 价格的一个比例 + 底
  function quote(K, type) {
    const Tyr = days / 365;
    const g = greeks({ S: SPOT, K, T: Tyr, r, sigma: ivRegime, type });
    const price = g.price;
    // 半价差：基础 1.5% 价格 + 随虚值程度增大 + 一个最小绝对底
    const otmAmt = type === "call" ? Math.max(K - SPOT, 0) : Math.max(SPOT - K, 0);
    const half = Math.max(0.03, price * 0.018 + otmAmt * 0.004);
    const bid = Math.max(0.01, price - half);
    const ask = price + half;
    // 模拟成交量/未平仓量：越贴近平值越大
    const dist = Math.abs(K - SPOT);
    const oi = Math.round(9000 * Math.exp(-(dist * dist) / 320) + 30);
    const vol = Math.round(oi * (0.10 + 0.18 * Math.exp(-(dist * dist) / 200)));
    return { price, bid, ask, last: price, delta: g.delta, oi, vol };
  }

  const f2 = (x) => x.toFixed(2);
  const fInt = (x) => x.toLocaleString("en-US");

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">⛓️ ${T("期权链 · T 字形报价表", "Option Chain · T-shaped quote board")}</div>
      <div class="demo-row">
        <div>
          <div class="demo-label" style="margin-bottom:6px">${T("到期", "Expiry")}</div>
          <div class="demo-seg" id="oc-exp">
            <button data-d="30">30${T("天", "d")}</button>
            <button data-d="60" class="on">60${T("天", "d")}</button>
            <button data-d="120">120${T("天", "d")}</button>
          </div>
        </div>
        <div>
          <div class="demo-label" style="margin-bottom:6px">${T("波动率档位 (IV)", "IV regime")}</div>
          <div class="demo-seg" id="oc-iv">
            <button data-iv="0.18">${T("低 18%", "Low 18%")}</button>
            <button data-iv="0.30" class="on">${T("中 30%", "Mid 30%")}</button>
            <button data-iv="0.50">${T("高 50%", "High 50%")}</button>
          </div>
        </div>
      </div>
      <div style="overflow-x:auto">
        <table class="ochain" id="oc-tbl">
          <caption>${T("现价 100 · 中间一列为行权价 · 左=看涨 右=看跌 · 高亮行=平值(ATM) · 绿色=实值 · 点任意一行看详情",
            "Spot 100 · strikes down the middle · calls left / puts right · highlighted row = ATM · green = ITM · click a row for detail")}</caption>
          <thead>
            <tr>
              <th colspan="5" style="color:var(--green)">${T("看涨 CALLS", "CALLS")}</th>
              <th>${T("行权价", "Strike")}</th>
              <th colspan="5" style="color:var(--red)">${T("看跌 PUTS", "PUTS")}</th>
            </tr>
            <tr>
              <th>IV</th><th>OI</th><th>${T("量", "Vol")}</th><th>Bid</th><th>Ask</th>
              <th>K</th>
              <th>Bid</th><th>Ask</th><th>${T("量", "Vol")}</th><th>OI</th><th>IV</th>
            </tr>
          </thead>
          <tbody id="oc-body"></tbody>
        </table>
      </div>
      <div id="oc-detail"></div>
      <p class="demo-tip">${T("拨到期 → 看权利金随时间“长高”；拨 IV → 整列一起变贵或变便宜。注意 bid/ask 之间的差就是你的隐性成本，越贴近平值越窄。买入按 ask、卖出按 bid，金额都要 ×100。",
        "Switch expiry → premiums grow with time; switch IV → the whole column gets pricier/cheaper. The bid–ask gap is your hidden cost, tightest near ATM. Buy at ask, sell at bid, and ×100 for the contract.")}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);

  function atmStrike() {
    let best = STRIKES[0], bd = Infinity;
    for (const k of STRIKES) { const d = Math.abs(k - SPOT); if (d < bd) { bd = d; best = k; } }
    return best;
  }

  function render() {
    const atm = atmStrike();
    let rows = "";
    for (const K of STRIKES) {
      const c = quote(K, "call");
      const p = quote(K, "put");
      const callITM = K < SPOT; // 看涨实值：行权价低于现价
      const putITM = K > SPOT;  // 看跌实值：行权价高于现价
      const isATM = K === atm;
      const callCls = callITM ? "itm" : "otm";
      const putCls = putITM ? "itm" : "otm";
      rows += `<tr class="${isATM ? "atm" : ""}" data-k="${K}">
        <td class="${callCls}">${(ivRegime * 100).toFixed(0)}%</td>
        <td class="${callCls}">${fInt(c.oi)}</td>
        <td class="${callCls}">${fInt(c.vol)}</td>
        <td class="${callCls}">${f2(c.bid)}</td>
        <td class="${callCls}">${f2(c.ask)}</td>
        <td class="strike-col">${K}</td>
        <td class="${putCls}">${f2(p.bid)}</td>
        <td class="${putCls}">${f2(p.ask)}</td>
        <td class="${putCls}">${fInt(p.vol)}</td>
        <td class="${putCls}">${fInt(p.oi)}</td>
        <td class="${putCls}">${(ivRegime * 100).toFixed(0)}%</td>
      </tr>`;
    }
    $("#oc-body").innerHTML = rows;
    $("#oc-body").querySelectorAll("tr").forEach((tr) => {
      tr.addEventListener("click", () => showDetail(+tr.dataset.k));
    });
  }

  function showDetail(K) {
    const c = quote(K, "call"), p = quote(K, "put");
    const callMid = (c.bid + c.ask) / 2, putMid = (p.bid + p.ask) / 2;
    const callSpread = (c.ask - c.bid) * MULT, putSpread = (p.ask - p.bid) * MULT;
    const mny = K < SPOT ? T("看涨实值 / 看跌虚值", "call ITM / put OTM")
      : K > SPOT ? T("看涨虚值 / 看跌实值", "call OTM / put ITM")
      : T("平值 ATM", "at-the-money");
    $("#oc-detail").innerHTML = `
      <div class="detail">
        <div style="font-weight:600;margin-bottom:8px">${T("行权价", "Strike")} ${K}　<span class="pill acc">${mny}</span>　<span class="dk">${T("到期", "expiry")} ${days}${T("天", "d")} · IV ${(ivRegime * 100).toFixed(0)}%</span></div>
        <div class="cmp">
          <div class="cmp-cell">
            <h5 style="color:var(--green)">${T("看涨 Call", "Call")}</h5>
            <div>${T("理论价", "Theo")} <span class="num">${f2(c.price)}</span>　${T("每张", "/ctr")} <span class="num">$${(c.price * MULT).toFixed(0)}</span></div>
            <div>${T("中间价", "Mid")} <span class="num">${f2(callMid)}</span>　Delta <span class="num">${c.delta.toFixed(3)}</span></div>
            <div class="dk">${T("买卖价差成本", "spread cost")} <span class="num">$${callSpread.toFixed(0)}</span> = (${f2(c.ask)}−${f2(c.bid)})×100</div>
          </div>
          <div class="cmp-cell">
            <h5 style="color:var(--red)">${T("看跌 Put", "Put")}</h5>
            <div>${T("理论价", "Theo")} <span class="num">${f2(p.price)}</span>　${T("每张", "/ctr")} <span class="num">$${(p.price * MULT).toFixed(0)}</span></div>
            <div>${T("中间价", "Mid")} <span class="num">${f2(putMid)}</span>　Delta <span class="num">${p.delta.toFixed(3)}</span></div>
            <div class="dk">${T("买卖价差成本", "spread cost")} <span class="num">$${putSpread.toFixed(0)}</span> = (${f2(p.ask)}−${f2(p.bid)})×100</div>
          </div>
        </div>
      </div>`;
  }

  // 分段切换
  $("#oc-exp").querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => {
      $("#oc-exp").querySelectorAll("button").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      days = +b.dataset.d;
      render(); $("#oc-detail").innerHTML = "";
    });
  });
  $("#oc-iv").querySelectorAll("button").forEach((b) => {
    b.addEventListener("click", () => {
      $("#oc-iv").querySelectorAll("button").forEach((x) => x.classList.remove("on"));
      b.classList.add("on");
      ivRegime = +b.dataset.iv;
      render(); $("#oc-detail").innerHTML = "";
    });
  });

  render();
  showDetail(atmStrike());
}
