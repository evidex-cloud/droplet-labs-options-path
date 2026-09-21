// 教学卡片：比较结算/行权风格。不是实时期权链，也没有实时 AUM。
export default function mount(root, lang) {
  const en = lang === "en";
  const T = (zh, e) => (en ? e : zh);

  const items = [
    {
      id: "spy",
      title: "SPY",
      blurbZh: "美式 · 实物 · ×100",
      blurbEn: "American · physical · ×100",
      bodyZh: "SPY 是 ETF 期权：美式、实物交收 100 股。卖方可能被提前指派（除息前尤其）。结算跟股票收盘，不是 SPX 的上午 SOQ。",
      bodyEn: "SPY is an ETF option: American, physically delivering 100 shares. Sellers can be assigned early (especially into an ex-dividend). It settles with the stock close, not SPX's morning SOQ.",
    },
    {
      id: "spx",
      title: "SPX",
      blurbZh: "欧式 · 现金 · ×100",
      blurbEn: "European · cash · ×100",
      bodyZh: "SPX 是指数期权：欧式、现金交割、乘数 100（每点 100 美元）。月度合约常 AM 结算（SOQ）；多数周期权/0DTE 是 PM。税务上常被归 1256——具体问税务顾问，本课不编税率。",
      bodyEn: "SPX is an index option: European, cash-settled, multiplier 100 ($100 per point). Monthlies are often AM-settled (SOQ); most weeklies/0DTE are PM. Tax treatment is often 1256 — ask a tax person; this course does not invent rates.",
    },
    {
      id: "xsp",
      title: "XSP",
      blurbZh: "迷你 SPX · 欧式 · 现金",
      blurbEn: "Mini-SPX · European · cash",
      bodyZh: "XSP 是迷你 SPX：同样欧式现金，名义大约是 SPX 的 1/10。Cboe IR：2026 年 7 月 XSP 月度 ADV 创纪录 238k，其中 0DTE ADV 138k——这是当月快照，不是永恒。",
      bodyEn: "XSP is mini-SPX: also European cash, notionally about 1/10 of SPX. Cboe IR: July 2026 XSP monthly ADV hit a record 238k, of which 0DTE ADV was 138k — a monthly snapshot, not eternal.",
    },
    {
      id: "ibit",
      title: "IBIT",
      blurbZh: "美式实物 · 份额 ≠ BTC",
      blurbEn: "American physical · shares ≠ BTC",
      bodyZh: "IBIT 期权写在比特币现货 ETF 份额上，不是比特币本身。一次创纪录成交（Goldman via CryptoBriefing，2026-08-24：单场 158 万张看涨）是 RECORD，不是日常。不要把 ETF 期权、Deribit 币期权、CME、永续混成一种工具。AUM 不在本课冻结。",
      bodyEn: "IBIT options are written on a spot-BTC ETF share, not on bitcoin itself. A record session (Goldman via CryptoBriefing, 24 Aug 2026: 1.58M call contracts) is a RECORD, not typical. Do not freeze AUM. ETF options ≠ Deribit coin options ≠ CME ≠ a perp.",
    },
    {
      id: "deribit",
      title: "Deribit",
      blurbZh: "加密期权场所 · 非 OCC",
      blurbEn: "Crypto options venue · not OCC",
      bodyZh: "Coinbase 于 2025-08-14 完成收购 Deribit；CIE 机构盘计划 2026-09-09 迁到 Deribit（Coinbase Help）。合约常是币本位/反向或 USD 稳定币保证金，和 OCC 的 ×100 美股期权不是同一套规则。永续机制见阶段 12。",
      bodyEn: "Coinbase closed the Deribit acquisition on 14 Aug 2025; CIE's institutional book is scheduled onto Deribit on 9 Sep 2026 (Coinbase Help). Contracts are often coin-margined/inverse or USD-stablecoin margined — not OCC ×100 equity options. Perp mechanics: Stage 12.",
    },
  ];

  root.innerHTML = `
    <div class="demo">
      <div class="demo-head">🗺 ${T("产品地图：点一张卡片看结算/行权", "Product map: tap a card for settlement / exercise")}</div>
      <div class="demo-seg" id="ps-seg" style="flex-wrap:wrap"></div>
      <div class="detail" id="ps-body" style="margin-top:10px"></div>
      <p class="demo-tip">${T(
        "教学对照，<b>不是实时链、不是实时 AUM/OI</b>。SPY 美式实物；SPX/XSP 欧式现金；IBIT 是份额不是币；Deribit 是加密期权场所。选券商时把覆盖面当检查项（阶段 11.1）。",
        "A teaching compare — <b>not a live chain, not live AUM/OI</b>. SPY American physical; SPX/XSP European cash; IBIT is shares not coins; Deribit is a crypto-options venue. Make coverage a broker checklist item (Stage 11.1)."
      )}</p>
    </div>`;

  const seg = root.querySelector("#ps-seg");
  const body = root.querySelector("#ps-body");
  items.forEach((it, i) => {
    const b = document.createElement("button");
    b.dataset.id = it.id;
    if (i === 1) b.classList.add("on");
    b.innerHTML = `<b>${it.title}</b><br><span style="opacity:.8;font-size:.85em">${en ? it.blurbEn : it.blurbZh}</span>`;
    seg.appendChild(b);
  });

  function paint(id) {
    const it = items.find((x) => x.id === id) || items[1];
    seg.querySelectorAll("button").forEach((b) => b.classList.toggle("on", b.dataset.id === it.id));
    body.innerHTML = en ? it.bodyEn : it.bodyZh;
  }
  seg.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (b) paint(b.dataset.id);
  });
  paint("spx");
}
