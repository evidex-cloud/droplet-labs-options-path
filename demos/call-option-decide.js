// Inline demo for lesson call-option: decision cards. Kai holds the 30-day XYZ 100 call bought for $2.45.
// For each scenario, choose what to do; the card explains the numbers (computed, not hard-coded).
import * as O from "./_opt.js";
import { tex } from "./_viz.js";

export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const K = 100, c = 2.45;
  // before-expiry card: 10 days left, XYZ at 108 → value of the call from Black-Scholes (σ 20%, r 4%)
  const live = O.bsPrice({ S: 108, K, T: 10 / 365, r: 0.04, sigma: 0.2, type: "call" });
  const cards = [
    { st: 112, good: "ex" }, { st: 96, good: "no" }, { st: 101.2, good: "ex" }, { st: 100, good: "no" }, { st: 108, early: true, good: "sell" },
  ];
  let i = 0, score = 0, answered = false;
  root.innerHTML = `<div class="demo">
    <div class="demo-head">${T("行权还是放弃？五张决策卡", "Exercise or walk away? Five decision cards")}</div>
    <div class="scn"><div class="scn-q" id="cod-q"></div><div class="demo-btns" id="cod-btns"></div><div id="cod-a"></div></div>
    <div class="demo-btns"><button class="demo-btn" id="cod-next" type="button">${T("下一张 →", "Next card →")}</button><span class="demo-meta" id="cod-score"></span></div>
    <p class="demo-tip">${T("看什么：到期时只问一件事——XYZ 高于 100 吗？权利金已经付掉了，不影响这个决定。最后一张卡在到期前：卖掉期权通常比提前行权多拿一点时间价值。", "What to notice: at expiry the only question is “is XYZ above 100?” The premium is already spent and doesn't change the decision. The last card is before expiry: selling the call usually beats exercising early because you keep the leftover time value.")}</p>
  </div>`;
  const $ = (s) => root.querySelector(s);
  const money = (x) => (x < 0 ? "−$" : "+$") + Math.abs(x).toFixed(0);
  const show = () => {
    const cd = cards[i];
    answered = false;
    $("#cod-q").innerHTML = cd.early
      ? T(`<b>卡 ${i + 1}/5 · 离到期还有 10 天。</b>XYZ 现在 108 美元，这张 100 看涨期权在市场上值约 ${live.toFixed(2)} 美元。小凯想了结，怎么做更好？`,
          `<b>Card ${i + 1}/5 · 10 days before expiry.</b> XYZ is at $108 and the 100 call is worth about $${live.toFixed(2)} in the market. Kai wants out. Which is better?`)
      : T(`<b>卡 ${i + 1}/5 · 到期日收盘。</b>XYZ 收在 ${cd.st.toFixed(2)} 美元。小凯手里是一张 100 行权价的看涨期权（当初花了 2.45 美元/股）。`,
          `<b>Card ${i + 1}/5 · Expiry-day close.</b> XYZ closes at $${cd.st.toFixed(2)}. Kai holds one 100-strike call (bought for $2.45 a share).`);
    const opts = cd.early ? [["sell", T("卖出期权平仓", "Sell the call")], ["ex", T("现在行权再卖股票", "Exercise now, sell the shares")]]
      : [["ex", T("行权：按 100 买入", "Exercise: buy at 100")], ["no", T("放弃：让它作废", "Walk away: let it lapse")]];
    $("#cod-btns").innerHTML = opts.map(([v, l]) => `<button class="demo-btn" type="button" data-choice="${v}">${l}</button>`).join("");
    $("#cod-a").innerHTML = "";
    root.querySelectorAll("[data-choice]").forEach((b) => b.addEventListener("click", () => answer(b.dataset.choice)));
    $("#cod-score").textContent = T(`得分 ${score}`, `Score ${score}`);
  };
  const answer = (choice) => {
    const cd = cards[i];
    const ok = choice === cd.good || (cd.st === 100 && !cd.early);
    if (!answered && ok) score++;
    answered = true;
    root.querySelectorAll("[data-choice]").forEach((b) => b.classList.toggle("on", b.dataset.choice === choice));
    let body;
    if (cd.early) {
      const exVal = 108 - K;
      body = T(`卖出能拿到约 ${live.toFixed(2)} 美元，提前行权只能拿到内在价值 ${exVal.toFixed(2)} 美元——剩下的 ${(live - exVal).toFixed(2)} 美元时间价值会被白白扔掉。对不分红的股票，想了结就卖出，而不是提前行权。`,
        `Selling brings about $${live.toFixed(2)}; exercising early captures only the intrinsic value of $${exVal.toFixed(2)} — the remaining $${(live - exVal).toFixed(2)} of time value is thrown away. On a non-dividend stock, close by selling, not by exercising early.`)
        + tex(String.raw`${live.toFixed(2)} - (108 - 100) = ${(live - exVal).toFixed(2)}\ \text{${T("每股", "per share")}} \;\Rightarrow\; ${((live - exVal) * 100).toFixed(0)}\ \text{${T("美元每张", "dollars per contract")}}`, true);
    } else {
      const pay = Math.max(cd.st - K, 0), pl = pay - c;
      const lead = cd.st > K
        ? T(`该行权：每股收回 ${pay.toFixed(2)} 美元。`, `Exercise: each share gives back $${pay.toFixed(2)}.`)
        : cd.st === K
          ? T("行权和放弃结果一样：收回 0。OCC 的自动行权只针对至少实值 0.01 美元的期权，所以正好平值的会作废。", "Exercising and walking away give the same zero payoff. OCC's automatic exercise applies only to options at least $0.01 in the money, so an exactly-at-the-money call lapses.")
          : T(`该放弃：按 100 买一只只值 ${cd.st.toFixed(2)} 的股票，会再亏 ${(K - cd.st).toFixed(2)} 美元。`, `Walk away: paying 100 for a stock worth ${cd.st.toFixed(2)} would lose another $${(K - cd.st).toFixed(2)}.`);
      const note = cd.st > K && pl < 0
        ? T(" 整笔仍亏，但行权把亏损从 245 美元缩小了——权利金是“沉没成本”，不该影响决定。", " The trade still loses, but exercising shrinks the loss from $245 — the premium is a sunk cost and should not change the decision.") : "";
      body = lead + note + tex(String.raw`\Pi = \max(${cd.st.toFixed(2)} - 100,\,0) - 2.45 = ${pl.toFixed(2)} \;\Rightarrow\; ${pl.toFixed(2)} \times 100 = ${pl < 0 ? "-" : ""}\$${Math.abs(pl * 100).toFixed(0)}`, true);
      body += `<div class="demo-meta">${T("这张合约的结果：", "Result for the contract: ")}${money(pl * 100)}</div>`;
    }
    $("#cod-a").innerHTML = `<div class="detail"><span class="pill ${ok ? "ok" : "bad"}">${ok ? T("对", "Right") : T("再想想", "Not quite")}</span> ${body}</div>`;
    $("#cod-score").textContent = T(`得分 ${score}`, `Score ${score}`);
  };
  $("#cod-next").addEventListener("click", () => { i = (i + 1) % cards.length; if (i === 0) score = 0; show(); });
  show();
}
