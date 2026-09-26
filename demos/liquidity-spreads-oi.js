// Inline demo for lesson liquidity-spreads: an open-interest ledger. Each button is one trade between a buyer and a
// seller who are each either opening or closing; watch volume and open interest.
import { seg, onSeg, stats } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  let oi = 0, vol = 0, day = 1, qty = 10, longs = 0, shorts = 0;
  const log = [];
  const cases = [
    ["oo", T("买方开仓 + 卖方开仓", "Buyer opens + seller opens")],
    ["oc", T("买方开仓 + 卖方平仓", "Buyer opens + seller closes")],
    ["co", T("买方平仓 + 卖方开仓", "Buyer closes + seller opens")],
    ["cc", T("买方平仓 + 卖方平仓", "Buyer closes + seller closes")],
  ];
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("未平仓量账本：一笔交易会不会改变 OI？", "The open-interest ledger: does this trade change OI?")}</div>
    <div class="demo-row"><span class="demo-label">${T("每笔张数", "Contracts per trade")}</span>${seg("lso-q", [["1", "1"], ["10", "10"], ["50", "50"]], "10")}</div>
    <div class="demo-btns">${cases.map(([k, l]) => `<button type="button" class="demo-btn" data-case="${k}">${l}</button>`).join("")}</div>
    <div class="demo-btns"><button type="button" class="demo-btn" data-act="day">${T("进入下一个交易日", "Next trading day")}</button><button type="button" class="demo-btn" data-act="reset">${T("重来", "Reset")}</button></div>
    <div id="lso-stats"></div>
    <div class="demo-log" id="lso-log"></div>
    <p class="demo-tip">${T("看什么：成交量每笔都涨；未平仓量只在“双方都开仓”时增加、“双方都平仓”时减少；换手（一方开、一方平）只是把合约从一个人转给另一个人。",
      "What to notice: volume rises with every trade; open interest rises only when both sides open and falls only when both close; a hand-over (one opens, one closes) just moves the contract from one person to another.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const render = () => {
    $("#lso-stats").innerHTML = stats([
      [T("交易日", "Day"), String(day)],
      [T("今日成交量", "Volume today"), vol.toLocaleString("en-US"), "acc"],
      [T("未平仓量（实时）", "Open interest (live)"), oi.toLocaleString("en-US")],
      [T("多头 = 空头", "Longs = shorts"), `${longs} = ${shorts}`],
    ]);
    $("#lso-log").innerHTML = log.slice(-6).map((l) => `<span class="${l[0]}">${l[1]}</span>`).join("") || `<span>${T("点上面的按钮，做第一笔交易。", "Press a button above to make the first trade.")}</span>`;
  };
  const trade = (k) => {
    const buyerCloses = k[0] === "c", sellerCloses = k[1] === "c";
    // a buyer who closes must be an existing short; a seller who closes must be an existing long
    if ((buyerCloses && shorts < qty) || (sellerCloses && longs < qty)) {
      log.push(["bad", T(`没法成交：要平仓，得先有至少 ${qty} 张对应的${buyerCloses && shorts < qty ? "空头" : "多头"}头寸。`, `Can't trade: to close, someone must already hold at least ${qty} ${buyerCloses && shorts < qty ? "short" : "long"} contracts.`)]);
      return render();
    }
    vol += qty;
    const before = oi;
    if (!buyerCloses) longs += qty; else shorts -= qty;
    if (!sellerCloses) shorts += qty; else longs -= qty;
    oi = longs;
    const d = oi - before;
    const what = d > 0 ? T("新合约被创造", "new contracts created") : d < 0 ? T("合约被注销", "contracts extinguished") : T("合约换了主人", "contracts changed hands");
    log.push([d > 0 ? "ok" : d < 0 ? "bad" : "warn", `${cases.find((c) => c[0] === k)[1]} × ${qty}: ${T("成交量", "volume")} +${qty}, OI ${d > 0 ? "+" + d : d < 0 ? "−" + -d : "±0"} (${what})`]);
    render();
  };
  root.querySelectorAll("[data-case]").forEach((b) => b.addEventListener("click", () => trade(b.dataset.case)));
  root.querySelectorAll("[data-act]").forEach((b) => b.addEventListener("click", () => {
    if (b.dataset.act === "day") { day++; vol = 0; log.push(["", T(`第 ${day} 天开盘：成交量归零，OI 保留为 ${oi}（这就是期权链上公布的数）。`, `Day ${day} opens: volume resets to zero, OI carries over at ${oi} (the number the chain now shows).`)]); }
    else { oi = 0; vol = 0; day = 1; longs = 0; shorts = 0; log.length = 0; }
    render();
  }));
  onSeg(root, "lso-q", (v) => { qty = +v; });
  render();
}
