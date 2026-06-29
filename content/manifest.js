// 课程地图（双语 + 元数据）。路线图/侧栏只读这个文件。
// 每节课字段：id, title(中), titleEn(英), module(中文正文), status, difficulty(1基础/2进阶/3高级), personas(相关学习目标)
// 英文正文在 ./content/lessons/en/ 下同名文件；难度与 persona 与语言无关。
// status: "ready"=已写好可点开；其它(如 "soon")=路线图里显示但标"编写中"。

export const COURSE = {
  title: "Droplet Labs · 期权之路",
  titleEn: "Droplet Labs · Options Path",
  subtitle: "从零到专家，一步步吃透期权：原理、定价、希腊字母、策略，以及 AI 时代的量化执行。",
  subtitleEn: "From zero to expert — master options step by step: mechanics, pricing, the Greeks, strategies, and quant execution in the AI era.",

  tiers: [
    { id: "intro",   label: "入门层 · 浅", labelEn: "Beginner · Surface", color: "#14b8a6" },
    { id: "core",    label: "原理层",       labelEn: "Principles",         color: "#0d9488" },
    { id: "systems", label: "策略系统层",   labelEn: "Strategy Systems",   color: "#0f766e" },
    { id: "mastery", label: "精通层 · 深",  labelEn: "Mastery · Deep",     color: "#115e59" },
  ],

  goals: [
    { id: "beginner", label: "新手",   labelEn: "Newcomer" },
    { id: "trader",   label: "交易者", labelEn: "Trader" },
    { id: "hedger",   label: "对冲者", labelEn: "Hedger" },
    { id: "quant",    label: "量化/开发", labelEn: "Quant/Dev" },
  ],

  stages: [
    {
      n: 0, tier: "intro", title: "为什么需要期权", titleEn: "Why Options Exist",
      blurb: "衍生品 · 权利与义务 · 保险与杠杆", blurbEn: "Derivatives · Rights vs obligations · Insurance & leverage",
      lessons: [
        { id: "derivative-intro", title: "衍生品是什么：价格的“影子合约”", titleEn: "What Is a Derivative: A Contract on a Price", module: "./content/lessons/stage0-derivative.js", status: "ready", difficulty: 1, personas: ["beginner", "trader", "hedger", "quant"] },
        { id: "why-options", title: "为什么需要期权：保险、杠杆与可能性", titleEn: "Why Options: Insurance, Leverage & Optionality", module: "./content/lessons/stage0-why-options.js", status: "ready", difficulty: 1, personas: ["beginner", "trader", "hedger", "quant"] },
        { id: "call-put-rights", title: "两种基本权利：看涨与看跌", titleEn: "The Two Basic Rights: Calls & Puts", module: "./content/lessons/stage0-rights.js", status: "ready", difficulty: 1, personas: ["beginner", "trader", "hedger", "quant"] },
        { id: "options-vs-others", title: "期权 vs 股票 vs 期货：到底差在哪", titleEn: "Options vs Stocks vs Futures: What's Different", module: "./content/lessons/stage0-vs-others.js", status: "ready", difficulty: 1, personas: ["beginner", "trader", "hedger"] },
      ],
    },
    {
      n: 1, tier: "intro", title: "期权基础概念", titleEn: "Options Fundamentals",
      blurb: "行权价 · 到期 · 权利金 · 实虚平值", blurbEn: "Strike · Expiry · Premium · Moneyness",
      lessons: [
        { id: "call-option", title: "看涨期权 Call：买入的权利", titleEn: "The Call Option: The Right to Buy", module: "./content/lessons/stage1-call.js", status: "ready", difficulty: 1, personas: ["beginner", "trader", "hedger", "quant"] },
        { id: "put-option", title: "看跌期权 Put：卖出的权利", titleEn: "The Put Option: The Right to Sell", module: "./content/lessons/stage1-put.js", status: "ready", difficulty: 1, personas: ["beginner", "trader", "hedger", "quant"] },
        { id: "four-positions", title: "四个基本头寸：买卖双方的镜像", titleEn: "The Four Basic Positions: Buyer vs Seller", module: "./content/lessons/stage1-four-positions.js", status: "ready", difficulty: 1, personas: ["beginner", "trader", "hedger", "quant"] },
        { id: "key-terms", title: "关键术语：行权价、到期、权利金、合约乘数", titleEn: "Key Terms: Strike, Expiry, Premium, Multiplier", module: "./content/lessons/stage1-key-terms.js", status: "ready", difficulty: 1, personas: ["beginner", "trader", "hedger", "quant"] },
        { id: "moneyness", title: "实值、平值、虚值：钱在哪", titleEn: "ITM, ATM, OTM: Where the Money Is", module: "./content/lessons/stage1-moneyness.js", status: "ready", difficulty: 2, personas: ["beginner", "trader", "hedger", "quant"] },
        { id: "intrinsic-time-value", title: "内在价值 vs 时间价值", titleEn: "Intrinsic Value vs Time Value", module: "./content/lessons/stage1-value.js", status: "ready", difficulty: 2, personas: ["beginner", "trader", "hedger", "quant"] },
      ],
    },
    {
      n: 2, tier: "intro", title: "读懂与交易期权", titleEn: "Reading & Trading Options",
      blurb: "期权链 · 损益图 · 盈亏平衡 · 下单与保证金", blurbEn: "Option chain · Payoff diagrams · Breakeven · Orders & margin",
      lessons: [
        { id: "option-chain", title: "读懂期权链：报价表怎么看", titleEn: "Reading the Option Chain", module: "./content/lessons/stage2-chain.js", status: "ready", difficulty: 1, personas: ["beginner", "trader", "hedger", "quant"] },
        { id: "payoff-diagrams", title: "损益图入门：期权交易者的“地图”", titleEn: "Payoff Diagrams 101: The Trader's Map", module: "./content/lessons/stage2-payoff.js", status: "ready", difficulty: 1, personas: ["beginner", "trader", "hedger", "quant"] },
        { id: "breakeven", title: "盈亏平衡点与回报计算", titleEn: "Breakeven & Computing Your Return", module: "./content/lessons/stage2-breakeven.js", status: "ready", difficulty: 1, personas: ["beginner", "trader", "hedger"] },
        { id: "exercise-assignment", title: "行权、指派与到期：美式/欧式、现金/实物交割", titleEn: "Exercise, Assignment & Expiry", module: "./content/lessons/stage2-exercise.js", status: "ready", difficulty: 2, personas: ["trader", "hedger", "quant"] },
        { id: "orders-margin", title: "下单与执行：买开卖平、bid/ask、保证金", titleEn: "Orders & Margin: Bid/Ask, Open/Close, Collateral", module: "./content/lessons/stage2-orders.js", status: "ready", difficulty: 2, personas: ["trader", "hedger"] },
      ],
    },
    {
      n: 3, tier: "core", title: "期权定价的逻辑", titleEn: "The Logic of Pricing",
      blurb: "影响因素 · 平价关系 · 复制对冲 · 二叉树 · 风险中性", blurbEn: "Drivers · Parity · Replication · Binomial · Risk-neutral",
      lessons: [
        { id: "price-drivers", title: "决定权利金的六个因素", titleEn: "The Six Drivers of an Option's Premium", module: "./content/lessons/stage3-drivers.js", status: "ready", difficulty: 2, personas: ["beginner", "trader", "hedger", "quant"] },
        { id: "put-call-parity", title: "看跌看涨平价：期权世界的“守恒律”", titleEn: "Put-Call Parity: The Conservation Law", module: "./content/lessons/stage3-parity.js", status: "ready", difficulty: 2, personas: ["trader", "quant"] },
        { id: "no-arbitrage", title: "无套利与复制：期权为什么有“公平价”", titleEn: "No-Arbitrage & Replication", module: "./content/lessons/stage3-replication.js", status: "ready", difficulty: 3, personas: ["quant"] },
        { id: "binomial-model", title: "二叉树定价：一步步给期权估值", titleEn: "The Binomial Model: Pricing Step by Step", module: "./content/lessons/stage3-binomial.js", status: "ready", difficulty: 3, personas: ["quant"] },
        { id: "risk-neutral", title: "风险中性定价：被误解最深的直觉", titleEn: "Risk-Neutral Valuation: The Most Misunderstood Idea", module: "./content/lessons/stage3-risk-neutral.js", status: "ready", difficulty: 3, personas: ["quant"] },
      ],
    },
    {
      n: 4, tier: "core", title: "Black-Scholes 与波动率", titleEn: "Black-Scholes & Volatility",
      blurb: "BS 模型 · 历史/隐含波动率 · 微笑偏斜 · 曲面 · VIX", blurbEn: "BS model · HV/IV · Smile & skew · Surface · VIX",
      lessons: [
        { id: "black-scholes", title: "Black-Scholes：从直觉到公式", titleEn: "Black-Scholes: From Intuition to Formula", module: "./content/lessons/stage4-bs.js", status: "ready", difficulty: 3, personas: ["trader", "quant"] },
        { id: "hist-implied-vol", title: "历史波动率 vs 隐含波动率", titleEn: "Historical vs Implied Volatility", module: "./content/lessons/stage4-vol.js", status: "ready", difficulty: 2, personas: ["beginner", "trader", "quant"] },
        { id: "vol-smile-skew", title: "波动率微笑与偏斜", titleEn: "The Volatility Smile & Skew", module: "./content/lessons/stage4-smile.js", status: "ready", difficulty: 3, personas: ["trader", "quant"] },
        { id: "term-structure-surface", title: "波动率期限结构与曲面", titleEn: "Term Structure & the Vol Surface", module: "./content/lessons/stage4-surface.js", status: "ready", difficulty: 3, personas: ["quant"] },
        { id: "vix", title: "VIX 恐慌指数：给恐惧定价", titleEn: "The VIX: Pricing Fear", module: "./content/lessons/stage4-vix.js", status: "ready", difficulty: 2, personas: ["beginner", "trader", "hedger", "quant"] },
      ],
    },
    {
      n: 5, tier: "core", title: "希腊字母", titleEn: "The Greeks",
      blurb: "Delta · Gamma · Theta · Vega · Rho · 组合希腊", blurbEn: "Delta · Gamma · Theta · Vega · Rho · Portfolio Greeks",
      lessons: [
        { id: "greeks-overview", title: "希腊字母总览：期权的“仪表盘”", titleEn: "The Greeks Overview: Your Dashboard", module: "./content/lessons/stage5-overview.js", status: "ready", difficulty: 2, personas: ["beginner", "trader", "hedger", "quant"] },
        { id: "delta", title: "Delta：方向暴露与对冲比率", titleEn: "Delta: Directional Exposure & Hedge Ratio", module: "./content/lessons/stage5-delta.js", status: "ready", difficulty: 2, personas: ["trader", "hedger", "quant"] },
        { id: "gamma", title: "Gamma：Delta 的“加速度”", titleEn: "Gamma: The Acceleration of Delta", module: "./content/lessons/stage5-gamma.js", status: "ready", difficulty: 3, personas: ["trader", "quant"] },
        { id: "theta", title: "Theta：时间在融化你的期权", titleEn: "Theta: Time Is Melting Your Option", module: "./content/lessons/stage5-theta.js", status: "ready", difficulty: 2, personas: ["beginner", "trader", "hedger", "quant"] },
        { id: "vega", title: "Vega：你其实在交易波动率", titleEn: "Vega: You're Really Trading Volatility", module: "./content/lessons/stage5-vega.js", status: "ready", difficulty: 2, personas: ["trader", "quant"] },
        { id: "rho-dividends", title: "Rho 与股息：利率与分红的影响", titleEn: "Rho & Dividends: Rates and Payouts", module: "./content/lessons/stage5-rho.js", status: "ready", difficulty: 3, personas: ["quant"] },
        { id: "portfolio-greeks", title: "组合希腊字母与二阶希腊（Vanna/Charm）", titleEn: "Portfolio Greeks & Second-Order (Vanna/Charm)", module: "./content/lessons/stage5-portfolio.js", status: "ready", difficulty: 3, personas: ["trader", "quant"] },
      ],
    },
    {
      n: 6, tier: "systems", title: "单腿与价差策略", titleEn: "Single-Leg & Spreads",
      blurb: "备兑 · 担保看跌/轮动 · 保护 · 垂直价差 · 领口", blurbEn: "Covered call · CSP/Wheel · Protective put · Verticals · Collar",
      lessons: [
        { id: "long-call-put", title: "买入看涨/看跌：方向性押注", titleEn: "Long Calls & Puts: Directional Bets", module: "./content/lessons/stage6-long.js", status: "ready", difficulty: 1, personas: ["beginner", "trader"] },
        { id: "covered-call", title: "备兑开仓：手里有股，卖出看涨", titleEn: "Covered Calls: Sell Calls Against Stock", module: "./content/lessons/stage6-covered-call.js", status: "ready", difficulty: 2, personas: ["hedger", "trader"] },
        { id: "cash-secured-put", title: "现金担保看跌与“轮动”策略", titleEn: "Cash-Secured Puts & the Wheel", module: "./content/lessons/stage6-csp.js", status: "ready", difficulty: 2, personas: ["trader", "hedger"] },
        { id: "protective-put", title: "保护性看跌：给持仓买保险", titleEn: "Protective Puts: Insuring a Position", module: "./content/lessons/stage6-protective-put.js", status: "ready", difficulty: 2, personas: ["hedger"] },
        { id: "vertical-spreads", title: "垂直价差：牛市/熊市、借记/贷记", titleEn: "Vertical Spreads: Bull/Bear, Debit/Credit", module: "./content/lessons/stage6-verticals.js", status: "ready", difficulty: 2, personas: ["trader"] },
        { id: "collar", title: "领口策略：用卖权资助保险", titleEn: "The Collar: Financing Protection", module: "./content/lessons/stage6-collar.js", status: "ready", difficulty: 2, personas: ["hedger"] },
      ],
    },
    {
      n: 7, tier: "systems", title: "组合与波动率策略", titleEn: "Combinations & Vol Structures",
      blurb: "跨式 · 蝶式 · 铁鹰 · 日历 · 比率 · 合成", blurbEn: "Straddle · Butterfly · Condor · Calendar · Ratio · Synthetics",
      lessons: [
        { id: "straddle-strangle", title: "跨式与宽跨式：押“会大动”", titleEn: "Straddles & Strangles: Betting on a Big Move", module: "./content/lessons/stage7-straddle.js", status: "ready", difficulty: 2, personas: ["trader"] },
        { id: "butterfly", title: "蝶式价差：押“不怎么动”", titleEn: "Butterflies: Betting on Calm", module: "./content/lessons/stage7-butterfly.js", status: "ready", difficulty: 3, personas: ["trader", "quant"] },
        { id: "iron-condor", title: "铁鹰：区间收租", titleEn: "Iron Condors: Renting a Range", module: "./content/lessons/stage7-condor.js", status: "ready", difficulty: 3, personas: ["trader"] },
        { id: "calendar-diagonal", title: "日历与对角价差：交易时间与期限", titleEn: "Calendars & Diagonals: Trading Time", module: "./content/lessons/stage7-calendar.js", status: "ready", difficulty: 3, personas: ["trader", "quant"] },
        { id: "ratio-backspread", title: "比率价差与反向价差", titleEn: "Ratio Spreads & Backspreads", module: "./content/lessons/stage7-ratio.js", status: "ready", difficulty: 3, personas: ["trader", "quant"] },
        { id: "synthetics", title: "合成头寸：用平价关系拼出任意结构", titleEn: "Synthetics: Building Any Position from Parity", module: "./content/lessons/stage7-synthetics.js", status: "ready", difficulty: 3, personas: ["quant", "trader"] },
      ],
    },
    {
      n: 8, tier: "systems", title: "风险管理与做市视角", titleEn: "Risk Management & the Market Maker",
      blurb: "仓位 · 对冲 · 尾部 · 做市商流 · 心理", blurbEn: "Sizing · Hedging · Tail risk · Dealer flows · Psychology",
      lessons: [
        { id: "position-sizing", title: "仓位管理与凯利公式", titleEn: "Position Sizing & the Kelly Criterion", module: "./content/lessons/stage8-sizing.js", status: "ready", difficulty: 2, personas: ["trader", "quant"] },
        { id: "delta-hedging", title: "Delta 对冲与 Gamma 剥头皮", titleEn: "Delta Hedging & Gamma Scalping", module: "./content/lessons/stage8-hedging.js", status: "ready", difficulty: 3, personas: ["quant"] },
        { id: "vol-as-asset", title: "波动率作为资产：方差风险溢价", titleEn: "Volatility as an Asset: The Variance Risk Premium", module: "./content/lessons/stage8-vrp.js", status: "ready", difficulty: 3, personas: ["quant", "trader"] },
        { id: "tail-risk", title: "尾部风险、黑天鹅与尾部对冲", titleEn: "Tail Risk, Black Swans & Tail Hedging", module: "./content/lessons/stage8-tail.js", status: "ready", difficulty: 3, personas: ["hedger", "quant"] },
        { id: "dealer-flows", title: "做市商对冲如何撬动市场：Gamma 挤压与 Vanna/Charm", titleEn: "How Dealer Hedging Moves Markets: Gamma Squeezes", module: "./content/lessons/stage8-dealer.js", status: "ready", difficulty: 3, personas: ["trader", "quant"] },
        { id: "psychology", title: "心理、纪律与常见亏损模式", titleEn: "Psychology, Discipline & Common Loss Patterns", module: "./content/lessons/stage8-psychology.js", status: "ready", difficulty: 1, personas: ["beginner", "trader", "hedger"] },
      ],
    },
    {
      n: 9, tier: "mastery", title: "量化期权", titleEn: "Quantitative Options",
      blurb: "蒙特卡洛 · 数值方法 · 随机波动率 · 奇异期权 · 回测", blurbEn: "Monte Carlo · Numerics · Stochastic vol · Exotics · Backtesting",
      lessons: [
        { id: "monte-carlo", title: "蒙特卡洛定价：用模拟给期权估值", titleEn: "Monte Carlo Pricing: Valuing by Simulation", module: "./content/lessons/stage9-monte-carlo.js", status: "ready", difficulty: 3, personas: ["quant"] },
        { id: "finite-difference", title: "有限差分与 PDE：另一条定价路", titleEn: "Finite Differences & the PDE Approach", module: "./content/lessons/stage9-fd.js", status: "ready", difficulty: 3, personas: ["quant"] },
        { id: "vol-models", title: "波动率建模：GARCH、局部与随机波动率(Heston)", titleEn: "Vol Modeling: GARCH, Local & Stochastic (Heston)", module: "./content/lessons/stage9-vol-models.js", status: "ready", difficulty: 3, personas: ["quant"] },
        { id: "exotic-options", title: "奇异期权：障碍、亚式、二元、回望", titleEn: "Exotic Options: Barrier, Asian, Digital, Lookback", module: "./content/lessons/stage9-exotics.js", status: "ready", difficulty: 3, personas: ["quant"] },
        { id: "american-pricing", title: "美式期权与提前行权", titleEn: "American Options & Early Exercise", module: "./content/lessons/stage9-american.js", status: "ready", difficulty: 3, personas: ["quant"] },
        { id: "backtesting", title: "期权策略回测：那些坑", titleEn: "Backtesting Options Strategies: The Pitfalls", module: "./content/lessons/stage9-backtest.js", status: "ready", difficulty: 3, personas: ["quant", "trader"] },
      ],
    },
    {
      n: 10, tier: "mastery", title: "AI 时代的期权", titleEn: "Options in the AI Era",
      blurb: "ML 波动率 · 深度对冲 · RL 做市 · 另类数据 · 智能体", blurbEn: "ML vol · Deep hedging · RL · Alt-data · Agents",
      lessons: [
        { id: "ml-vol-forecast", title: "用机器学习预测波动率", titleEn: "Machine Learning for Volatility Forecasting", module: "./content/lessons/stage10-ml-vol.js", status: "ready", difficulty: 3, personas: ["quant"] },
        { id: "deep-hedging", title: "深度对冲：让神经网络学会对冲", titleEn: "Deep Hedging: Teaching a Network to Hedge", module: "./content/lessons/stage10-deep-hedging.js", status: "ready", difficulty: 3, personas: ["quant"] },
        { id: "rl-market-making", title: "强化学习做市与最优执行", titleEn: "RL for Market Making & Optimal Execution", module: "./content/lessons/stage10-rl.js", status: "ready", difficulty: 3, personas: ["quant"] },
        { id: "alt-data-nlp", title: "另类数据与 NLP：从新闻/财报里挖信号", titleEn: "Alt-Data & NLP: Signals from News & Filings", module: "./content/lessons/stage10-altdata.js", status: "ready", difficulty: 3, personas: ["quant", "trader"] },
        { id: "llm-agents", title: "用 LLM 与智能体研究、编码、执行策略", titleEn: "Using LLMs & Agents to Research, Code & Execute", module: "./content/lessons/stage10-agents.js", status: "ready", difficulty: 2, personas: ["beginner", "trader", "quant"] },
        { id: "algo-execution", title: "算法执行：滑点、智能路由与 TCA", titleEn: "Algorithmic Execution: Slippage, Routing & TCA", module: "./content/lessons/stage10-execution.js", status: "ready", difficulty: 3, personas: ["quant", "trader"] },
      ],
    },
    {
      n: 11, tier: "mastery", title: "动手与实战", titleEn: "Hands-On & Real Trading",
      blurb: "券商 · 真实下单 · Python 定价 · 回测 · AI 工作流 · 速查", blurbEn: "Brokers · Real trade · Python · Backtest · AI workflow · Cheat sheet",
      lessons: [
        { id: "choose-broker", title: "选择券商与平台", titleEn: "Choosing a Broker & Platform", module: "./content/lessons/stage11-broker.js", status: "ready", difficulty: 1, personas: ["trader", "hedger"] },
        { id: "first-real-trade", title: "一笔真实交易的全流程", titleEn: "Placing a Real Trade, End to End", module: "./content/lessons/stage11-first-trade.js", status: "ready", difficulty: 2, personas: ["trader", "hedger"] },
        { id: "python-pricing", title: "用 Python 给期权定价、画希腊字母", titleEn: "Pricing & Plotting Greeks in Python", module: "./content/lessons/stage11-python.js", status: "ready", difficulty: 3, personas: ["quant"] },
        { id: "build-backtest", title: "构建并回测一个策略", titleEn: "Build & Backtest a Strategy", module: "./content/lessons/stage11-backtest.js", status: "ready", difficulty: 3, personas: ["quant", "trader"] },
        { id: "ai-trading-workflow", title: "搭一套 AI 辅助的交易工作流", titleEn: "Build an AI-Assisted Trading Workflow", module: "./content/lessons/stage11-ai-workflow.js", status: "ready", difficulty: 2, personas: ["trader", "quant"] },
        { id: "traps-lessons", title: "常见陷阱与教训：指派、钉住、流动性、财报", titleEn: "Common Traps: Assignment, Pin Risk, Liquidity, Earnings", module: "./content/lessons/stage11-traps.js", status: "ready", difficulty: 2, personas: ["beginner", "trader", "hedger"] },
        { id: "cheatsheet", title: "附录：关键公式与数字速查", titleEn: "Appendix: Formula & Numbers Cheat Sheet", module: "./content/lessons/stage11-cheatsheet.js", status: "ready", difficulty: 1, personas: ["beginner", "trader", "hedger", "quant"] },
      ],
    },
  ],
};
