// Inline demo for lesson four-positions: the buyer's and the seller's P&L at expiry always add up to zero.
import * as O from "./_opt.js";
import { lineChart, seg, onSeg, slider, bindSliders, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const K = 100;
  const prem = { call: 2.45, put: 2.12 }; // XYZ 30-day 100 strike (σ 20%, r 4%), rounded to cents
  let type = "call";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("买方 + 卖方 = 0（到期时，每一个价位）", "Buyer + seller = 0 (at expiry, at every price)")}</div>
    <div class="demo-row">${seg("fpm-type", [["call", T("100 看涨（2.45）", "100 call (2.45)")], ["put", T("100 看跌（2.12）", "100 put (2.12)")]], type)}</div>
    ${slider("fpm-st", T("到期时 XYZ 的价格", "XYZ price at expiry"), 70, 130, 0.5, 108)}
    <div id="fpm-bars"></div>
    <div class="demo-math" id="fpm-f"></div>
    <div id="fpm-chart"></div>
    <p class="demo-tip">${T("看什么：无论滑到哪里，两根柱子一样长、方向相反。期权本身不创造也不消灭钱，只是把钱从一方挪到另一方（再各自付一点手续费和买卖价差）。", "What to notice: wherever you slide, the two bars are equally long and point opposite ways. The option creates no money and destroys none; it only moves money from one side to the other (each side also pays fees and the bid-ask spread).")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = (v) => {
    const ST = v["fpm-st"], p = prem[type];
    const leg = { type, side: "long", K, premium: p };
    const buyer = O.legPL(leg, ST) * 100, seller = -buyer;
    const max = 3000; // the largest |P&L| per contract on the 70–130 slider is about $2,790
    const bar = (label, val) => {
      const w = Math.min(Math.abs(val) / max, 1) * 50;
      const col = val >= 0 ? "var(--green)" : "var(--red)";
      return `<div class="bar2"><span class="lab">${label}</span><span class="track" style="position:relative"><span style="position:absolute;top:0;bottom:0;left:50%;width:1.5px;background:var(--ink)"></span><span class="fill" style="position:absolute;top:0;bottom:0;${val >= 0 ? "left:50%" : "right:50%"};width:${w}%;background:${col}"></span></span><span class="val">${val < 0 ? "−$" : "+$"}${Math.abs(val).toFixed(0)}</span></div>`;
    };
    $("#fpm-bars").innerHTML = bar(T("买方", "Buyer"), buyer) + bar(T("卖方", "Seller"), seller);
    const pay = type === "call" ? String.raw`\max(${ST.toFixed(2)} - 100,\,0)` : String.raw`\max(100 - ${ST.toFixed(2)},\,0)`;
    $("#fpm-f").innerHTML = tex(String.raw`\underbrace{\big(${pay} - ${p.toFixed(2)}\big)}_{\text{${T("买方", "buyer")}}} + \underbrace{\big(${p.toFixed(2)} - ${pay}\big)}_{\text{${T("卖方", "seller")}}} = 0`, true);
    $("#fpm-chart").innerHTML = lineChart({
      xmin: 70, xmax: 130, xlabel: T("到期时 XYZ 的价格（美元）", "XYZ price at expiry ($)"), ylabel: T("每张盈亏（美元）", "P&L per contract ($)"),
      series: [
        { f: (x) => O.legPL(leg, x) * 100, cls: 3, label: T("买方", "Buyer") },
        { f: (x) => -O.legPL(leg, x) * 100, cls: 2, label: T("卖方", "Seller") },
        { f: () => 0, cls: 5, dashed: true, label: T("两者相加", "Sum of both") },
      ],
      markers: [{ x: K, label: "K = 100" }],
      points: [{ x: ST, y: buyer, cls: 3 }, { x: ST, y: seller, cls: 2 }],
    });
  };
  const run = bindSliders(root, { "fpm-st": (x) => "$" + x.toFixed(2) }, draw);
  onSeg(root, "fpm-type", (v) => { type = v; run(); });
}
