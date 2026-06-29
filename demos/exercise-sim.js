// 交互演示：行权/指派/到期情景模拟
// 给出若干“到期时”或“到期前”的情景（S vs K、看涨/看跌、美式/欧式、有无即将除息），
// 用户先预测「行权/作废/可能被提前指派」，再揭晓正确结果 + .scn-meta 解释。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);
  const MULT = 100;

  // outcome: "exercise"(自动行权/作废到期) 之三选一 → 用 key: exercised / worthless / early
  const SCN = [
    {
      q: T("到期日：你持有一张【看涨 K=100】（美式）。收盘标的 = 108。会怎样？",
        "Expiry: you hold a Long Call K=100 (American). Underlying closes at 108. What happens?"),
      opts: [
        T("自动行权（实值）", "Auto-exercised (ITM)"),
        T("作废归零（虚值）", "Expires worthless (OTM)"),
        T("可能被提前指派", "May be assigned early"),
      ],
      ans: 0,
      meta: T("看涨实值（108 > 100），到期触发自动行权（Exercise-by-Exception）。每股内在价值 8，×100 = 800 元；你以 100 买入 100 股。注意要先减去当初付的权利金才是净盈亏。",
        "The call is ITM (108 > 100), so it is auto-exercised at expiry. Intrinsic 8/share ×100 = $800; you buy 100 shares at 100. Subtract the premium paid for net P&L."),
    },
    {
      q: T("到期日：你持有一张【看跌 K=50】（欧式）。收盘标的 = 56。会怎样？",
        "Expiry: you hold a Long Put K=50 (European). Underlying closes at 56. What happens?"),
      opts: [
        T("自动行权（实值）", "Auto-exercised (ITM)"),
        T("作废归零（虚值）", "Expires worthless (OTM)"),
        T("可能被提前指派", "May be assigned early"),
      ],
      ans: 1,
      meta: T("看跌虚值（56 > 50，向下才有价值），到期作废归零，损失全部权利金。欧式本就只能到期行权，更无提前一说。",
        "The put is OTM (56 > 50; a put needs price below strike), so it expires worthless — you lose the premium. Being European, it could only ever be exercised at expiry anyway."),
    },
    {
      q: T("到期前：你【卖出 1 张看涨 K=100】（美式），标的已涨到 118（深度实值），且明天除息 2 元。最该警惕？",
        "Before expiry: you SOLD a Call K=100 (American), underlying at 118 (deep ITM), ex-dividend $2 tomorrow. Watch out for?"),
      opts: [
        T("什么都不会发生", "Nothing will happen"),
        T("它会自动作废", "It will expire worthless"),
        T("可能被提前指派", "May be assigned early"),
      ],
      ans: 2,
      meta: T("除息前 + 深度实值看涨 = 提前指派高发区！对手方为抢那 2 元股息会提前行权，你被指派、被迫按 100 卖出 100 股、错过股息。可考虑提前买回平仓。",
        "Ex-dividend + deep-ITM call = prime early-assignment territory. The holder exercises early to grab the $2 dividend; you get assigned, must sell 100 shares at 100, and miss the dividend. Consider buying to close first."),
    },
    {
      q: T("到期日：你持有一张【SPX 看涨 K=5000】（欧式·现金交割），结算 = 5040。会怎样？",
        "Expiry: you hold an SPX Call K=5000 (European, cash-settled), settles at 5040. What happens?"),
      opts: [
        T("交收一篮子成分股", "Deliver a basket of stocks"),
        T("现金交割：按差价结算现金", "Cash settled: paid the difference"),
        T("可能被提前指派", "May be assigned early"),
      ],
      ans: 1,
      meta: T("指数无法实物交收 → 现金交割。差价 40 点 ×100 = 4,000 元现金打入账户（再减权利金）。欧式无提前行权问题，特别适合做组合对冲。",
        "An index can't be physically delivered → cash settlement. The 40-point difference ×100 = $4,000 cash credited (less premium). European, so no early exercise — handy for hedging."),
    },
    {
      q: T("到期日：你持有【看涨 K=100】，收盘标的 = 100.00（正好钉在行权价）。最贴切的描述？",
        "Expiry: you hold a Call K=100, underlying closes at exactly 100.00 (pinned at strike). Best description?"),
      opts: [
        T("稳赚不赔", "Guaranteed profit"),
        T("钉住风险：实值/虚值难定，未必自动行权", "Pin risk: ITM/OTM unclear, may not auto-exercise"),
        T("一定被提前指派", "Definitely assigned early"),
      ],
      ans: 1,
      meta: T("标的正好卡在行权价 = 钉住风险（pin risk）。内在价值≈0，是否达到自动行权阈值、要不要行权都很尴尬；卖方更不知会不会被指派。临界时务必主动处理，别假设结果。",
        "Sitting right at the strike is pin risk. Intrinsic ≈ 0, so whether it clears the auto-exercise threshold is murky; sellers can't tell if they'll be assigned. Act deliberately near the pin — don't assume."),
    },
    {
      q: T("到期日：你【卖出 1 张看跌 K=95】（现金担保），收盘标的 = 90。会怎样？",
        "Expiry: you SOLD a Put K=95 (cash-secured), underlying closes at 90. What happens?"),
      opts: [
        T("作废归零，白赚权利金", "Worthless — keep premium"),
        T("被指派：按 95 买入 100 股", "Assigned: buy 100 shares at 95"),
        T("券商自动平仓不接货", "Broker closes it, no shares"),
      ],
      ans: 1,
      meta: T("看跌实值（90 < 95），买方行权 → 你作为卖方被指派，用早已备好的 9,500 元（95×100）按 95 接 100 股。实际成本还能减去当初收的权利金，相当于折价接股。",
        "The put is ITM (90 < 95); the buyer exercises and you (the seller) get assigned — using the pre-set $9,500 (95×100) to buy 100 shares at 95. Net cost is lower by the premium you collected: discounted stock."),
    },
  ];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">⚖️ ${T("行权 / 指派 / 到期 · 情景预测", "Exercise / Assignment / Expiry · predict the outcome")}</div>
      <div id="es-cards"></div>
      <div class="stat-row" style="margin-top:14px">
        <div class="stat"><div class="k">${T("已答对", "Correct")}</div><div class="v acc" id="es-score">0 / ${SCN.length}</div></div>
      </div>
      <p class="demo-tip">${T("先点你的预测，再看揭晓。记住三条线：实值到期→自动行权、虚值→作废归零、除息前深度实值看涨→卖方提前指派高发；指数期权多为欧式·现金交割。",
        "Pick your prediction, then reveal. Three rules: ITM at expiry → auto-exercise, OTM → worthless, deep-ITM call before ex-div → sellers face early assignment; index options are usually European & cash-settled.")}</p>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const answered = new Array(SCN.length).fill(false);
  let score = 0;

  function render() {
    $("#es-cards").innerHTML = SCN.map((s, i) => `
      <div class="scn" data-i="${i}">
        <div class="scn-q">${i + 1}. ${s.q}</div>
        <div class="demo-btns" data-opts="${i}">
          ${s.opts.map((o, j) => `<button class="demo-btn" data-i="${i}" data-j="${j}">${o}</button>`).join("")}
        </div>
        <div class="scn-meta" id="es-meta-${i}" hidden></div>
      </div>`).join("");

    $("#es-cards").querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () => {
        const i = +b.dataset.i, j = +b.dataset.j;
        if (answered[i]) return;
        answered[i] = true;
        const correct = SCN[i].ans;
        const wrap = $(`[data-opts="${i}"]`);
        wrap.querySelectorAll("button").forEach((x) => {
          const xj = +x.dataset.j;
          x.disabled = true;
          if (xj === correct) x.classList.add("primary");
          else if (xj === j) x.style.opacity = ".45";
        });
        if (j === correct) score++;
        const meta = $(`#es-meta-${i}`);
        const head = j === correct ? `<span class="pill ok">${T("答对", "Correct")}</span> ` : `<span class="pill bad">${T("再想想", "Not quite")}</span> `;
        meta.innerHTML = head + SCN[i].meta;
        meta.hidden = false;
        $("#es-score").textContent = `${score} / ${SCN.length}`;
      });
    });
  }

  render();
}
