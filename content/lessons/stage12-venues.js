export default {
  id: "perp-venues-2026",
  stage: 12,
  order: 6,
  title: "2026 永续场所：CEX、Hyperliquid、CME",
  difficulty: 2,
  prereqs: ["what-is-perp"],

  oneLiner:
    "成交量仍由 **Binance / OKX / Bybit** 这类 CEX 主导；**Hyperliquid** 是 2026 年真实的链上订单簿竞争者，不是玩具，也**没有取代 Binance**。CME 做的是到期期货，别混进离岸永续。",

  intuition: `
场所不是风景，是你的对手方与规则来源。用**带日期的快照**说话，不用“此刻 OI”。

CoinGlass《2026 Q1 市场份额报告》（**二手聚合**，as-of 该季度）：

- 加密衍生品成交约 **$18.6T**，现货约 **$1.94T**。
- Binance 衍生品约 **$4.9T**，约占头部十家切片的 **35%**。
- Hyperliquid 成交约 **$492.7B**，平均 OI 约 **$6.0B**，进入头部十家名单。

二手新闻口径（必须贴标签）：

- Hyperliquid 占**全所永续成交**纪录 **7.6%**（2026-06-08，The Block / Buildix 二手）。
- 相对 Binance，2026 年 5 月成交比 **14.4%**（Gate News 二手）。
- HIP-3 建造者部署市场：有报道 5 月成交 **>$62B**、撰稿时 OI 约 **$3B**（Gate）——**早期、不确定**，不要写成新标准。

结论只能说到这一步：**CEX 仍主导；HL 已是量级上的竞争者；不是王座易主。**

**这一节五块：**

- **① CEX 永续仍是流量中心**
- **② Hyperliquid：链上订单簿，不是 AMM 玩具**
- **③ HIP-3 / 类股票 / 预上市永续：早期**
- **④ CME：到期、受监管，不是离岸永续**
- **⑤ DEX ≠ 无对手方风险**
`,

  mechanics: `
### ① CEX

Binance、OKX、Bybit 等仍吃下大部分成交。托管、KYC、风控引擎、保险基金、强平队列，都是中心化规则。优点是深度；代价是 FTX 那类托管失败（阶段 12.5）。

### ② Hyperliquid

它是**链上中央限价订单簿**，不是 2020 年那种 AMM 永续玩具。Q1 2026 的 CoinGlass 数字说明它已经大到必须被放进场所课。资金费多为 **1 小时**（阶段 12.3），和 Binance 的 8h 比之前要归一化。

不要写“HL 取代了 Binance”：4.9T vs 0.49T 的量级差还在（Q1 切片，二手聚合）。

### ③ HIP-3 与类股票永续

建造者可部署市场、股权/预上市风格的线性合约，是 2026 的实验层。Gate 等二手报道的成交/OI **不要当审计过的事实**。它们**不是股票**：没有股东权、分红权，对冲路径也不等于借券做空。阶段 12.8 会再打这条。

### ④ CME

CME 比特币/以太合约是**有到期的期货**，参与者、保证金、交割、监管都不同。机构迁移新闻里，Coinbase 收购 Deribit（**2025-08-14**）、CIE 机构期权迁到 Deribit（**2026-09-09**）属于**期权场所**，放到阶段 12.7，不要塞进“永续成交榜”。

### ⑤ 对手方换皮

链上订单簿去掉了“老板卷款”这一种形态，还留下：预言机/指数组成、标记价公式、验证者集合、桥、升级密钥。测验里若把 DEX 永续写成“无对手方风险”，就是错。
`,

  demo: "venue-map",

  analogy: `
把 CEX 想成昼夜营业的巨型菜市场，Hyperliquid 想成 2026 年已经排上号的新市场（真的有人在里面喊价成交，不是过家家摊位），CME 想成有开门铃和监管的批发所——卖的还是“哪月交割”的合同，不是无限期摊位。

HIP-3 像有人在市场角落挂出“某未上市公司的价格”。你可以交易那个数字，但你没买到股份。
`,

  misconceptions: [
    "**“Hyperliquid 已经取代 Binance。”** —— Q1 2026 CoinGlass：Binance 衍生品约 $4.9T，HL 约 $492.7B。竞争者，不是加冕。",
    "**“DEX 永续没有对手方风险。”** —— 仍有预言机、标记、验证者、桥。",
    "**“CoinGlass 数字就是交易所官方成交。”** —— 二手聚合，必须写 as-of 与来源。",
    "**“CME 比特币期货就是永续。”** —— CME 是到期期货。",
    "**“HIP-3 成交已经是市场标准。”** —— 早期报道，不确定。",
  ],

  quiz: [
    {
      q: "关于 2026 Q1（CoinGlass，二手聚合）下列哪项正确？",
      options: ["Hyperliquid 衍生品成交已经超过 Binance", "Binance 衍生品约 $4.9T，HL 约 $492.7B，CEX 仍主导", "现货成交高于衍生品", "这些是实时 OI，无需日期"],
      answer: 1,
      explain: "快照：衍生品 ≫ 现货；Binance 仍是切片里最大头；HL 进入头部但仍小一个数量级。不是 live feed。",
    },
    {
      q: "为何不能说 DEX 永续“无对手方风险”？",
      options: ["因为它们其实是期权", "仍有预言机/标记价/验证者/桥等风险", "因为 CME 禁止", "因为没有订单簿"],
      answer: 1,
      explain: "换掉了托管老板，没换掉价格源与基础设施风险。",
    },
    {
      q: "CME 比特币合约在本模块的正确归类是？",
      options: ["离岸永续", "受监管的到期期货，时钟是交割不是资金费", "HIP-3 股票永续", "Deribit 期权"],
      answer: 1,
      explain: "产品设计不同。Deribit 是期权场所（阶段 12.7）。",
    },
    {
      q: "HIP-3 / 类股票永续目前最稳妥的表述是？",
      options: ["已等同持有股票", "早期实验，报道数据需标不确定，不是股东权", "已取代 CME", "无风险因为链上"],
      answer: 1,
      explain: "线性价格敞口 ≠ 股权。数据早期。",
    },
  ],

  further: [
    { label: "CoinGlass：2026 Q1 市场份额报告（英）", url: "https://www.coinglass.com/learn/2026-q1-mktshare-report-en" },
    { label: "Hyperliquid 文档", url: "https://hyperliquid.gitbook.io/hyperliquid-docs" },
    { label: "CME 比特币期货", url: "https://www.cmegroup.com/markets/cryptocurrencies/bitcoin/bitcoin.html" },
  ],
};
