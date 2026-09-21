export default {
  id: "product-map-2026",
  stage: 2,
  order: 7,
  title: "2026 产品地图：SPY / SPX / XSP / IBIT / Deribit",
  difficulty: 2,
  prereqs: ["exercise-assignment", "zerodte-spx"],

  oneLiner:
    "同一句“指数期权”下面其实是**不同的交割、行权、乘数和场所**：SPY 美式实物，SPX 欧式现金，XSP 迷你，IBIT 是份额不是比特币，Deribit 是加密期权（Coinbase 已收购）。数字全部带日期；CoinGlass 标**二手**。",

  intuition: `
阶段 2.4 讲了美式/欧式、现金/实物；阶段 2.6 讲了 SPX 0DTE 已经是主带。这一节把**你会在券商菜单里点到的名字**摊开成一张**列表地图**（渲染器没有表格，所以用子弹）。

先立三条纪律：

- **快照带日期**，不冻结实时 AUM / OI / 资金费。
- **CoinGlass 等聚合器标二手**。
- **税率不编**：SPX 常被归 1256，细节问税务顾问。

**这一节，我们把产品地图拆成六块：**

- **① SPY：美式、实物、×100**
- **② SPX：欧式、现金、×100，AM/PM 不是一回事**
- **③ XSP：迷你 SPX（2026 年 7 月 ADV 快照）**
- **④ IBIT 期权：份额 ≠ BTC（纪录成交不是日常）**
- **⑤ Deribit 与加密期权场所（收购、CIE 迁移、H1 份额二手）**
- **⑥ OCC 尺度：张数小的指数，名义可以很大**
`,

  mechanics: `
### ① SPY：美式、实物、×100

- **行权**：美式，到期前任何交易日都可能行权。
- **交割**：实物，一张 = **100 股** SPY。卖方可能被提前指派（除息前尤其，阶段 2.4）。
- **直觉**：它跟着 ETF 股份走，股权式指派，不是指数现金印。

### ② SPX：欧式、现金、×100

- **行权**：欧式，只有到期。
- **交割**：现金，乘数 **100**（每点 100 美元）。
- **结算印**：月度 SPX 常常是 **AM / SOQ**；多数周期权与 **0DTE 是 PM**（阶段 2.4）。你以为在对冲周五收盘，对手方按上午开盘印结算——这是真脚枪。
- **税**：美国常把这类指数期权归 **1256**。本课**不编税率、不编持有期**，问税务的人。

### ③ XSP：迷你 SPX

- 欧式、现金，名义大约是 SPX 的十分之一，适合较小账户表达同一套指数逻辑。
- Cboe IR **2026 年 7 月**亮点：XSP 月度 ADV **创纪录 238k**，其中 0DTE ADV **138k**。这是当月快照。

### ④ IBIT 期权：份额 ≠ BTC

IBIT 是现货比特币 ETF 的**份额**。写在 IBIT 上的期权：

- 通常是美式、实物、×100 份额——交割的是**基金股份**，不是一枚 BTC，也不是 Deribit 上的币期权，更不是一条 BTC 永续（阶段 12）。
- **不要冻结 AUM**。
- 成交可以突然变得极大，那是**纪录场**不是日常：Goldman（经 CryptoBriefing，**2026-08-24**）称单场 **158 万张 IBIT 看涨**（RECORD）；OptiView **2026-08-28** 该场 **1,082,676** 张。把纪录当成“每天都这样”，会把仓位算错。

### ⑤ Deribit 与加密期权（二手份额要标）

- **Coinbase 于 2025-08-14 完成收购 Deribit**。再把它教成“独立荷兰小所”已经过时。
- **CIE 机构盘计划 2026-09-09 迁到 Deribit**（[Coinbase Help](https://help.coinbase.com/en/international-exchange/deribit/institutional-faqs)）。
- H1 2026 加密期权成交额（**CoinGlass，二手**，经转引）：Deribit **49.3%**（425.9B 美元），Bybit 22.3%，Binance 13.4%，OKX 13.3%。BTC 期权 Deribit 仍领先约 **55.3%**；ETH 期权 Bybit 约 **38%**、Deribit 约 29%。CME 期权份额被引为 **1.7%**（相对 2025 年 7 月的 4.1% 下降）。**不要把这组数冻成 8 月 31 日的盘口，也不要写成 Hyperliquid 取代了 Binance。**
- 保证金：**币本位 / 反向** vs **USD 稳定币**——和 OCC 的美元 ×100 不是同一套爆仓规则。线性永续的资金费/ADL 见**阶段 12**，别和期权混名。

### ⑥ OCC 尺度

OCC **2026 年 7 月**（Mondo Visione）：YTD 期权 ADV **70,820,829**（股票 35.2M / ETF 29.3M / 指数 6.3M）；7 月全期权 **15.5 亿张**，同比 **+25.7%**。

指数按**张数**是最小的一块，按**名义**往往最大——一张 SPX ×100 点值，不是一张 20 美元股票期权能比的。0DTE 之所以能进宏观对话，靠的是这个名义，不是“指数 ADV 看起来不大”。

把六块串起来：**先问交割和行权，再问乘数和场所。** SPY 实物美式；SPX/XSP 现金欧式（再问 AM 还是 PM）；IBIT 是份额；Deribit 是加密期权场所（已属 Coinbase）。选券商时把“有没有指数 / 0DTE / IBIT”写进清单（阶段 11.1）。
`,

  demo: "product-selector",

  analogy: `
把这些合约想成**同一条河上的不同船票**：

- SPY 是**把货物搬上岸**的票（实物股份）。
- SPX 是**只结算差价的大船**（现金 ×100），还要问是早上的水位（AM/SOQ）还是傍晚的水位（PM）。
- XSP 是**同一条航线的小船**。
- IBIT 是**“比特币主题公园的门票”**，不是比特币本身。
- Deribit 是**另一座港口的规则**（币保证金、另一套清算），和 OCC 码头不是同一个章。

拿错票，不是涨跌看反，是**交割那天你手里的东西根本不是你以为的那种。**
`,

  misconceptions: [
    "**“SPY 和 SPX 都是标普 500，对冲起来一样。”** —— 美式实物 vs 欧式现金，再加上 AM/PM 结算印不同。周五收盘对冲、周一发现对手方按上午 SOQ 结算，是经典脚枪（阶段 2.4）。",
    "**“IBIT 期权就是比特币期权。”** —— 标的是 ETF **份额**。≠ Deribit BTC 期权 ≠ CME ≠ 永续。不要冻结 AUM。",
    "**“Deribit 还是独立的荷兰交易所。”** —— Coinbase **2025-08-14** 已关闭收购；CIE 机构盘 **2026-09-09** 迁入（Coinbase Help）。",
    "**“CoinGlass 的 49.3% 就是此刻实时份额。”** —— **H1 2026、二手聚合**。本课不把它冻成 8 月 31 日磁带，也不说谁取代了 Binance。",
    "**“指数期权 ADV 只有 630 万张，所以对市场不重要。”** —— 张数小、名义大。OCC 7 月拆开了股票/ETF/指数；0DTE 对话靠的是名义（阶段 2.6）。",
  ],

  quiz: [
    {
      q: "SPY 期权与 SPX 期权最关键的结构差别是？",
      options: [
        "两者都是欧式现金，只是代码不同",
        "SPY 是美式实物（×100 股）；SPX 是欧式现金（×100 点），月度常 AM、0DTE 多 PM",
        "SPX 会交收一篮子股票",
        "SPY 没有 Gamma",
      ],
      answer: 1,
      explain: "SPY：美式、实物、股权式指派。SPX：欧式、现金；再叠加 AM vs PM 结算印。混用对冲点是脚枪。",
    },
    {
      q: "关于 IBIT 期权，哪句正确？",
      options: [
        "行权交割的是比特币现货",
        "标的是 ETF 份额，份额 ≠ BTC；2026-08-24 单场 158 万张看涨是纪录不是日常，且不要冻结 AUM",
        "它和 Deribit BTC 期权是同一张合约",
        "AUM 已在本课写成永恒常数",
      ],
      answer: 1,
      explain: "IBIT 期权写在**基金份额**上。纪录成交要标 RECORD。AUM 不冻结。三套工具不要混。",
    },
    {
      q: "Coinbase 与 Deribit，下列哪项符合已公开时间线？",
      options: [
        "Deribit 在 2026 年仍是完全独立的荷兰交易所",
        "Coinbase 于 2025-08-14 完成收购；CIE 机构盘计划 2026-09-09 迁到 Deribit",
        "Hyperliquid 已经取代 Binance 成为期权第一",
        "CME 期权占加密期权的一半以上",
      ],
      answer: 1,
      explain: "收购关闭 **14 Aug 2025**；CIE→Deribit **9 Sep 2026**。H1 CoinGlass 二手里 CME 期权份额被引为 1.7%，且**不要**写 Hyperliquid 取代 Binance。",
    },
    {
      q: "OCC 2026 年 7 月：指数期权 ADV 约 630 万张，远小于股票+ETF。正确读法是？",
      options: [
        "指数期权可以忽略",
        "按张数小、按名义往往很大；0DTE/SPX 的宏观影响来自名义不是张数",
        "这说明 0DTE 不存在",
        "YTD ADV 70,820,829 是实时 OI",
      ],
      answer: 1,
      explain: "OCC 7 月 YTD ADV **70,820,829**（股 35.2M / ETF 29.3M / 指数 6.3M）是**月报快照**。指数张数小、名义大。",
    },
  ],

  further: [
    { label: "Mondo Visione：OCC 2026 年 7 月成交", url: "https://mondovisione.com/news/occ-july-2026-monthly-volume-data-202686/" },
    { label: "Coinbase Help：CIE 机构迁移到 Deribit（2026-09-09）", url: "https://help.coinbase.com/en/international-exchange/deribit/institutional-faqs" },
    { label: "Cboe IR：2026 年 7 月亮点（XSP ADV）", url: "https://ir.cboe.com/" },
  ],
};
