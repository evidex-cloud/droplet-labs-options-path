// Inline demo for lesson welcome: click one of the course's four ideas → its one-line version, a first taste
// computed with the engine on XYZ, and the stages that build it.
import * as O from "./_opt.js";
import { seg, onSeg, tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const STAGES = {
    0: T("为什么需要期权", "Why options exist"), 1: T("期权的解剖", "Anatomy of an option"), 2: T("损益图", "Payoff diagrams"),
    4: T("无套利", "No-arbitrage"), 5: T("二叉树到 Black-Scholes", "Trees to Black-Scholes"), 6: T("波动率", "Volatility"),
    7: T("希腊字母", "The Greeks"), 8: T("方向与收入策略", "Directional & income strategies"), 9: T("波动率与时间策略", "Volatility & time strategies"),
    10: T("管理一本期权账", "Running an options book"), 11: T("市场结构", "Market structure"), 12: T("期货与永续", "Futures & perpetuals"),
    13: T("量化定价", "Quantitative pricing"), 14: T("量化交易与研究", "Quant trading & research"),
  };
  const x = { S: 100, T: 30 / 365, r: 0.04, sigma: 0.2 };
  const c100 = O.bsPrice({ ...x, K: 100, type: "call" }), p100 = O.bsPrice({ ...x, K: 100, type: "put" });
  const g100 = O.greeks({ ...x, K: 100, type: "call" }), atm0 = 0.4 * 100 * 0.2 * Math.sqrt(30 / 365);
  const pv = 100 * Math.exp(-0.04 * 30 / 365);
  const IDEAS = {
    1: {
      name: T("① 形状", "① Shape"),
      one: T("期权是一种“形状”：亏损有底，收益敞开。所有策略都是形状相加。", "An option is a shape: the loss has a floor, the upside stays open. Every strategy is shapes added together."),
      taste: T("小凯买 95 看跌后，无论 XYZ 跌多深，最坏结果都停在：", "With the 95 put, however far XYZ falls, Kai's worst case stops at:"),
      f: String.raw`\Pi_{\min} = 100 \times (95 - 100 - 0.51) = -\$551`,
      stages: [0, 1, 2, 8, 9], wish: T("对应愿望：保护、押大波动", "Serves the wishes: protect, bet on a big move"),
    },
    2: {
      name: T("② 无套利", "② No-arbitrage"),
      one: T("能用股票和现金复制出来的东西，价格必须等于复制成本。", "Anything you can build from stock and cash must cost what building it costs."),
      taste: T("30 天期、行权价 100 的看涨与看跌之差，被“股票减去行权价现值”钉死：", "The 30-day 100 call minus the 100 put is pinned to stock minus the present value of the strike:"),
      f: String.raw`${c100.toFixed(2)} - ${p100.toFixed(2)} = ${(c100 - p100).toFixed(2)} = 100 - ${pv.toFixed(2)}`,
      stages: [4, 5, 13], wish: T("回答：一张期权为什么值这个价", "Answers: why an option costs what it costs"),
    },
    3: {
      name: T("③ 波动率", "③ Volatility"),
      one: T("期权真正交易的是“会动多少”：隐含波动率是报价，实现波动率是账单。", "Options really trade how much a price will move: implied vol is the quote, realized vol is the bill."),
      taste: T("平值期权的价格几乎与波动率成正比（30 天、σ = 20%、利率为 0 时）：", "An at-the-money price is almost proportional to volatility (30 days, σ = 20%, zero rates):"),
      f: String.raw`C \approx 0.4\,S\sigma\sqrt{T} = 0.4 \times 100 \times 0.20 \times \sqrt{30/365} \approx ${atm0.toFixed(2)}`,
      stages: [6, 9, 10, 14], wish: T("回答：押大波动时，你到底在买什么", "Answers: what you are really buying when you bet on a big move"),
    },
    4: {
      name: T("④ 风险", "④ Risk"),
      one: T("希腊字母把风险拆成可测量的几块；谁持有风险、怎样对冲、杠杆何时反噬，决定能否活下来。", "The Greeks split risk into measurable parts; who holds it, how it is hedged and when leverage bites decide survival."),
      taste: T("什么都不变，只过一天，一张 30 天平值看涨期权会损失：", "If nothing moves and one day passes, one 30-day at-the-money call contract loses:"),
      f: String.raw`\Theta \times 100 = ${g100.theta.toFixed(4)} \times 100 \approx -\$${Math.abs(g100.theta * 100).toFixed(2)}\ \text{${T("每天", "per day")}}`,
      stages: [7, 10, 11, 12], wish: T("对应愿望：收租（卖方承担的正是这些风险）", "Serves the wish: earn income (the seller carries exactly these risks)"),
    },
  };
  let cur = "1";
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("点一个观念：它是什么、先尝一口、在哪几个阶段展开", "Pick an idea: what it says, a first taste, and where the course builds it")}</div>
    <div class="demo-row">${seg("wi-idea", Object.entries(IDEAS).map(([k, v]) => [k, v.name]), cur)}</div>
    <div id="wi-out"></div>
    <p class="demo-tip">${T("看什么：每个观念都先用 XYZ 的一个具体数字出场，再在几个阶段里逐步展开；阶段 16 的毕业项目会把四个观念同时用上。", "What to notice: each idea first appears as one concrete XYZ number, then grows over several stages; the Stage 16 capstone uses all four at once.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const draw = () => {
    const d = IDEAS[cur];
    $("#wi-out").innerHTML = `<div class="demo-block">
        <p><b>${d.name}</b> — ${d.one}</p>
        <p class="demo-label">${d.taste}</p>
        <div class="demo-math">${tex(d.f, true)}</div>
        <p class="demo-label">${T("在这些阶段展开：", "Built in these stages:")}</p>
        <div class="demo-btns">${d.stages.map((n) => `<span class="tag hl">${T("阶段", "Stage")} ${n} · ${STAGES[n]}</span>`).join(" ")}</div>
        <p class="demo-meta">${d.wish}</p>
      </div>`;
  };
  onSeg(root, "wi-idea", (v) => { cur = v; draw(); });
  draw();
}
