// 双语术语表（悬浮提示用）。课程渲染器读取每条 terms（按当前语言），
// 在课文中查找首个出现的字符串，并以 def 作为悬浮释义显示。
// terms = 在正文中要匹配的词，def = 简明的一到两句释义。
// 注意：def 用双引号包裹，内部不得出现 ASCII 直引号，需用中文/弯引号 “ ” ‘ ’。

export const GLOSSARY = [
  {
    zh: { terms: ["看涨期权", "Call期权", "认购期权"], def: "赋予买方在到期前（或到期时）以约定行权价买入标的权利的合约。看涨买方押标的上涨。" },
    en: { terms: ["call option", "call options", "call"], def: "A contract giving the buyer the right to buy the underlying at the strike price. A call buyer bets the underlying rises." },
  },
  {
    zh: { terms: ["看跌期权", "Put期权", "认沽期权"], def: "赋予买方以约定行权价卖出标的权利的合约。看跌买方押标的下跌，也常用来给持仓买保险。" },
    en: { terms: ["put option", "put options", "put"], def: "A contract giving the buyer the right to sell the underlying at the strike price. A put buyer bets on a fall, or buys it as insurance." },
  },
  {
    zh: { terms: ["标的", "标的资产"], def: "期权背后的那个东西——股票、ETF、指数、期货或加密货币。期权的价值随它的价格变化而变化。" },
    en: { terms: ["underlying", "underlying asset"], def: "The thing the option is written on — a stock, ETF, index, future, or crypto. The option's value moves with the underlying's price." },
  },
  {
    zh: { terms: ["行权价", "执行价", "履约价"], def: "合约里约定好的买入或卖出价格（strike）。它是判断期权实值还是虚值的基准线。" },
    en: { terms: ["strike price", "strike", "exercise price"], def: "The agreed price at which the option lets you buy or sell. It is the reference line for whether an option is in- or out-of-the-money." },
  },
  {
    zh: { terms: ["到期日", "到期", "存续期"], def: "期权权利失效的日期。到期后未行权的期权一文不值；离到期越近，时间价值流失越快。" },
    en: { terms: ["expiration", "expiry", "expiration date"], def: "The date the option's right ends. After expiry an unexercised option is worthless; the closer to expiry, the faster time value bleeds." },
  },
  {
    zh: { terms: ["权利金", "期权费", "期权金"], def: "买方为获得期权权利付给卖方的价格（premium）。它是买方的最大亏损，也是卖方的最大收益。" },
    en: { terms: ["premium"], def: "The price the buyer pays the seller for the option. It is the buyer's maximum loss and the seller's maximum gain." },
  },
  {
    zh: { terms: ["行权", "履约"], def: "买方动用权利、按行权价真正买入或卖出标的的动作。美式可随时行权，欧式只能到期行权。" },
    en: { terms: ["exercise"], def: "When the buyer uses the right and actually buys or sells at the strike. American style can exercise any time; European only at expiry." },
  },
  {
    zh: { terms: ["指派", "被指派", "分配"], def: "当买方行权时，系统从卖方中随机挑出一位履行义务（assignment）。卖出期权就承担了被指派的风险。" },
    en: { terms: ["assignment", "assigned"], def: "When a buyer exercises, a seller is randomly picked to fulfill the obligation. Selling an option means accepting assignment risk." },
  },
  {
    zh: { terms: ["实值", "价内", "ITM"], def: "现在行权就有内在价值的状态：看涨的标的价高于行权价，或看跌的标的价低于行权价。" },
    en: { terms: ["in-the-money", "in the money", "ITM"], def: "An option with intrinsic value if exercised now: a call whose underlying is above the strike, or a put whose underlying is below it." },
  },
  {
    zh: { terms: ["平值", "价平", "ATM"], def: "标的价格大致等于行权价的状态。平值期权的时间价值最高，Gamma 和 Theta 也最大。" },
    en: { terms: ["at-the-money", "at the money", "ATM"], def: "When the underlying price is roughly equal to the strike. At-the-money options have the most time value, and the largest Gamma and Theta." },
  },
  {
    zh: { terms: ["虚值", "价外", "OTM"], def: "现在行权没有内在价值的状态。虚值期权全是时间价值，更便宜也更容易归零。" },
    en: { terms: ["out-of-the-money", "out of the money", "OTM"], def: "An option with no intrinsic value if exercised now. It is all time value — cheaper, but more likely to expire worthless." },
  },
  {
    zh: { terms: ["内在价值"], def: "立刻行权能拿到的价值：看涨为 max(标的−行权价,0)，看跌为 max(行权价−标的,0)。它永远不为负。" },
    en: { terms: ["intrinsic value"], def: "What you would get exercising right now: max(spot−strike,0) for a call, max(strike−spot,0) for a put. It is never negative." },
  },
  {
    zh: { terms: ["时间价值", "外在价值"], def: "权利金里超出内在价值的那部分，反映“到期前还可能变得更值钱”的可能性。它随时间和波动率而消长，到期归零。" },
    en: { terms: ["time value", "extrinsic value"], def: "The part of the premium above intrinsic value — the chance the option gets more valuable before expiry. It decays to zero at expiration." },
  },
  {
    zh: { terms: ["moneyness", "价值状态"], def: "描述标的价相对行权价位置的统称：实值/平值/虚值。它决定期权的 Delta、风险与价格构成。" },
    en: { terms: ["moneyness"], def: "How far the underlying sits from the strike — in-, at-, or out-of-the-money. It shapes an option's Delta, risk, and price composition." },
  },
  {
    zh: { terms: ["美式期权"], def: "可在到期前任意时间行权的期权。美股个股期权多为美式，因此卖方要随时提防被提前指派。" },
    en: { terms: ["American option", "American-style"], def: "An option that can be exercised any time before expiry. Most US single-stock options are American, so sellers must watch for early assignment." },
  },
  {
    zh: { terms: ["欧式期权"], def: "只能在到期日当天行权的期权。多数股指期权（如 SPX）是欧式，定价更干净、无提前行权问题。" },
    en: { terms: ["European option", "European-style"], def: "An option exercisable only at expiry. Most index options (like SPX) are European, making pricing cleaner with no early-exercise issue." },
  },
  {
    zh: { terms: ["损益图", "盈亏图", "payoff"], def: "以到期标的价格为横轴、盈亏为纵轴画出的图，是期权交易者最重要的“地图”。看涨呈钩形，价差呈台阶形。" },
    en: { terms: ["payoff diagram", "payoff", "P&L diagram"], def: "A chart of profit/loss (vertical) against the underlying price at expiry (horizontal) — the trader's key map. A call looks like a hockey stick." },
  },
  {
    zh: { terms: ["盈亏平衡点", "盈亏平衡", "breakeven"], def: "到期时不赚不赔的标的价格。买入看涨的盈亏平衡 = 行权价 + 权利金；买入看跌 = 行权价 − 权利金。" },
    en: { terms: ["breakeven", "break-even"], def: "The underlying price at expiry where you neither gain nor lose. For a long call it is strike + premium; for a long put, strike − premium." },
  },
  {
    zh: { terms: ["合约乘数", "合约单位"], def: "一张期权代表的标的数量。美股期权通常为 100 股，所以报价 2.50 美元实际是每张 250 美元。" },
    en: { terms: ["contract multiplier", "multiplier", "contract size"], def: "How many units of the underlying one contract controls — usually 100 shares for US equity options, so a $2.50 quote costs $250 per contract." },
  },
  {
    zh: { terms: ["期权链", "T型报价", "期权报价表"], def: "把同一标的不同行权价、不同到期的期权报价排成的表（option chain）。中间一列是行权价，两侧分别是看涨与看跌。" },
    en: { terms: ["option chain", "options chain"], def: "A table of an underlying's option quotes across strikes and expiries. The strikes run down the middle, with calls on one side and puts on the other." },
  },
  {
    zh: { terms: ["买卖价差", "买卖盘差", "bid-ask", "买一卖一"], def: "买方愿付的最高价(bid)与卖方愿收的最低价(ask)之差。价差越宽，进出成本越高、流动性越差。" },
    en: { terms: ["bid-ask spread", "bid-ask", "bid/ask"], def: "The gap between the highest price buyers will pay (bid) and the lowest sellers will take (ask). Wider spreads mean higher cost and worse liquidity." },
  },
  {
    zh: { terms: ["流动性"], def: "一份合约能以接近公允价、快速成交的难易程度。高未平仓量、窄价差、活跃成交都是流动性好的标志。" },
    en: { terms: ["liquidity"], def: "How easily a contract trades near fair value without moving the price. High open interest, tight spreads, and active volume signal good liquidity." },
  },
  {
    zh: { terms: ["未平仓量", "持仓量", "open interest"], def: "市场上当前存续、尚未平仓的合约总数。它和成交量一起，用来判断某个行权价的流动性与关注度。" },
    en: { terms: ["open interest"], def: "The total number of contracts currently open and not yet closed. With volume, it gauges how liquid and watched a given strike is." },
  },
  {
    zh: { terms: ["保证金", "维持保证金"], def: "卖出（裸卖）期权时，券商冻结的、用于担保你履约能力的资金。卖方风险大，所以要交保证金而非收权利金了事。" },
    en: { terms: ["margin"], def: "Collateral your broker locks up when you sell options, to guarantee you can meet the obligation. Because sellers carry large risk, margin is required." },
  },
  {
    zh: { terms: ["波动率", "波动性"], def: "标的价格波动剧烈程度的度量，通常以年化标准差表示。波动率越高，期权（尤其时间价值）越贵。" },
    en: { terms: ["volatility"], def: "A measure of how much the underlying's price swings, usually as an annualized standard deviation. Higher volatility makes options more expensive." },
  },
  {
    zh: { terms: ["隐含波动率", "IV"], def: "从期权市场价格反推出来的波动率，代表市场对未来波动的预期。它是期权真正的“价格刻度”——同一只票，IV 越高期权越贵。" },
    en: { terms: ["implied volatility", "implied vol", "IV"], def: "The volatility backed out of an option's market price — the market's forecast of future movement. It is the real price gauge: higher IV, pricier options." },
  },
  {
    zh: { terms: ["历史波动率", "已实现波动率", "HV"], def: "由标的过去价格算出的实际波动幅度（也叫已实现波动率）。把它和隐含波动率比较，是判断期权贵贱的常用方法。" },
    en: { terms: ["historical volatility", "realized volatility", "HV"], def: "The actual volatility computed from the underlying's past prices. Comparing it to implied vol is a common way to judge whether options look cheap or rich." },
  },
  {
    zh: { terms: ["波动率微笑", "波动率偏斜", "skew", "smile"], def: "不同行权价的隐含波动率连成的曲线。股票市场通常呈“偏斜”：低行权价（看跌保护）IV 更高，反映崩盘恐惧。" },
    en: { terms: ["volatility smile", "volatility skew", "vol skew", "skew"], def: "The curve of implied vol across strikes. Equities usually show a skew: low strikes (downside puts) trade at higher IV, pricing in crash fear." },
  },
  {
    zh: { terms: ["波动率曲面", "vol surface"], def: "把隐含波动率同时按行权价和到期日铺开形成的三维曲面。做市商和量化用它来一致地给整串期权定价。" },
    en: { terms: ["volatility surface", "vol surface"], def: "Implied vol spread across both strike and expiry as a 3-D surface. Market makers and quants use it to price a whole grid of options consistently." },
  },
  {
    zh: { terms: ["期限结构"], def: "同一行权价、不同到期日的隐含波动率排列。正常时远月 IV 较高；恐慌时近月飙升，曲线倒挂。" },
    en: { terms: ["term structure"], def: "Implied vol across expiries for a given strike. Normally far months carry higher IV; in panic the front month spikes and the curve inverts." },
  },
  {
    zh: { terms: ["VIX", "恐慌指数"], def: "由标普500期权隐含波动率合成的 30 天预期波动指数。VIX 飙升通常意味着市场恐慌、看跌保护需求暴增。" },
    en: { terms: ["VIX", "fear index"], def: "An index of 30-day expected volatility built from S&P 500 option prices. A spiking VIX usually means panic and a rush for downside protection." },
  },
  {
    zh: { terms: ["希腊字母", "希腊值", "Greeks"], def: "衡量期权价格对各因素敏感度的一组指标：Delta、Gamma、Theta、Vega、Rho。它们是管理期权风险的“仪表盘”。" },
    en: { terms: ["the Greeks", "Greeks"], def: "A set of sensitivities of an option's price: Delta, Gamma, Theta, Vega, Rho. They are the dashboard for managing option risk." },
  },
  {
    zh: { terms: ["Delta"], def: "标的每涨 1 元、期权价格大约变动多少。看涨 Delta 在 0~1，看跌在 −1~0；它也近似“到期实值的概率”和对冲所需股数。" },
    en: { terms: ["Delta"], def: "How much the option price moves per $1 move in the underlying. Calls are 0 to 1, puts −1 to 0; it also approximates the probability of finishing ITM." },
  },
  {
    zh: { terms: ["Gamma"], def: "Delta 随标的变化的速度，即“Delta 的加速度”。买方 Gamma 为正（越涨越快赚），平值临近到期时 Gamma 最大。" },
    en: { terms: ["Gamma"], def: "How fast Delta changes as the underlying moves — the acceleration of Delta. Long options have positive Gamma; it peaks for at-the-money options near expiry." },
  },
  {
    zh: { terms: ["Theta", "时间衰减"], def: "每过一天期权大约损失多少时间价值（time decay）。买方 Theta 为负（时间是敌人），卖方为正（时间是朋友）。" },
    en: { terms: ["Theta", "time decay"], def: "How much value an option loses per day of passing time. Buyers have negative Theta (time is the enemy); sellers positive (time is a friend)." },
  },
  {
    zh: { terms: ["Vega"], def: "隐含波动率每变动 1 个百分点，期权价格大约变多少。买方 Vega 为正（盼 IV 涨），它在远月、平值时最大。" },
    en: { terms: ["Vega"], def: "How much the option price moves per 1-point change in implied volatility. Long options have positive Vega; it is largest for at-the-money, far-dated options." },
  },
  {
    zh: { terms: ["Rho"], def: "无风险利率每变动 1 个百分点，期权价格大约变多少。它在长期期权上才显著，平时是最被忽视的希腊字母。" },
    en: { terms: ["Rho"], def: "How much the option price moves per 1-point change in interest rates. It only matters much for long-dated options and is the most ignored Greek." },
  },
  {
    zh: { terms: ["二阶希腊", "Vanna", "Charm", "Volga"], def: "希腊字母的变化率，如 Vanna(Delta 对波动率的敏感)、Charm(Delta 随时间漂移)、Volga(Vega 对波动率的敏感)。做市商对冲离不开它们。" },
    en: { terms: ["second-order Greeks", "Vanna", "Charm", "Volga"], def: "Sensitivities of the Greeks themselves — Vanna (Delta vs vol), Charm (Delta drift over time), Volga (Vega vs vol). Dealers rely on them to hedge." },
  },
  {
    zh: { terms: ["Black-Scholes", "BS模型", "BSM"], def: "1973 年提出的欧式期权定价公式，用标的价、行权价、到期、利率和波动率算出理论价。它是整个期权定价体系的基石。" },
    en: { terms: ["Black-Scholes", "Black-Scholes-Merton", "BSM"], def: "The 1973 formula for pricing European options from spot, strike, time, rate, and volatility. It is the cornerstone of modern option pricing." },
  },
  {
    zh: { terms: ["看跌看涨平价", "平价关系", "put-call parity"], def: "无套利下的恒等式：买看涨+卖看跌 ≈ 持有标的（同行权价、同到期）。它把看涨、看跌、标的与现金绑定在一起。" },
    en: { terms: ["put-call parity", "put–call parity", "parity"], def: "A no-arbitrage identity: long call + short put ≈ holding the underlying (same strike and expiry). It ties calls, puts, spot, and cash together." },
  },
  {
    zh: { terms: ["无套利"], def: "市场不会留下“无风险白赚”的机会这一原则。它是所有期权定价的逻辑出发点：公平价就是杜绝套利的价。" },
    en: { terms: ["no-arbitrage", "arbitrage-free"], def: "The principle that markets leave no risk-free free lunch. It is the logical starting point of all option pricing: the fair price is the one that rules out arbitrage." },
  },
  {
    zh: { terms: ["复制", "对冲组合", "replication"], def: "用标的和现金动态搭出与期权完全相同回报的组合。能复制就能定价——复制成本就是期权的公平价。" },
    en: { terms: ["replication", "replicating portfolio"], def: "Building a mix of underlying and cash that reproduces an option's exact payoff. If you can replicate it, you can price it — the cost of replication is the fair value." },
  },
  {
    zh: { terms: ["二叉树", "二叉树模型"], def: "把到期前的时间切成一格格、每格价格只能上或下的定价模型。逐格倒推期望值，就能给期权（含美式）估值。" },
    en: { terms: ["binomial model", "binomial tree"], def: "A pricing model that chops time into steps where the price can only go up or down. Working backward through the tree values the option, including American ones." },
  },
  {
    zh: { terms: ["风险中性", "风险中性定价", "风险中性概率"], def: "一种定价技巧：假装所有资产都只赚无风险利率，用这套“伪概率”算期望并贴现。它给出的价与真实世界一致，却好算得多。" },
    en: { terms: ["risk-neutral", "risk-neutral pricing", "risk-neutral probability"], def: "A pricing trick: pretend every asset earns only the risk-free rate, then take the expected payoff under these pseudo-probabilities and discount. It is easier yet gives the right price." },
  },
  {
    zh: { terms: ["备兑开仓", "备兑看涨", "covered call"], def: "持有 100 股的同时卖出 1 张看涨，用收来的权利金增厚收益。代价是放弃了股价大涨时的上方空间。" },
    en: { terms: ["covered call"], def: "Holding 100 shares while selling one call against them to collect premium. The trade-off is giving up the upside above the strike." },
  },
  {
    zh: { terms: ["现金担保看跌", "担保看跌", "cash-secured put", "CSP"], def: "卖出看跌并备好按行权价买股的现金。被指派就以折扣价接股，否则白赚权利金；是“轮动”策略的前半段。" },
    en: { terms: ["cash-secured put", "CSP"], def: "Selling a put while holding enough cash to buy the stock at the strike. You either get assigned cheap stock or keep the premium — the first leg of the Wheel." },
  },
  {
    zh: { terms: ["保护性看跌", "保护看跌", "protective put"], def: "持有标的同时买入看跌，给持仓上一份“保险”。下跌时看跌升值补偿亏损，代价是付出的权利金。" },
    en: { terms: ["protective put", "married put"], def: "Holding the underlying while buying a put as insurance. If it falls, the put gains and offsets the loss; the cost is the premium paid." },
  },
  {
    zh: { terms: ["垂直价差", "牛市价差", "熊市价差", "vertical spread"], def: "同到期、不同行权价的一买一卖。它用卖腿降低成本、锁定最大盈亏，是性价比最高的方向性结构之一。" },
    en: { terms: ["vertical spread", "bull spread", "bear spread"], def: "Buying one option and selling another at a different strike, same expiry. The short leg cuts cost and caps both gain and loss — an efficient directional structure." },
  },
  {
    zh: { terms: ["借记价差", "买入价差", "debit spread"], def: "净付出权利金建立的价差（如牛市看涨价差）。最大亏损 = 付出的净权利金，方向看对才赚。" },
    en: { terms: ["debit spread"], def: "A spread you pay a net premium to open (like a bull call spread). Max loss is the net debit paid; you profit if the direction is right." },
  },
  {
    zh: { terms: ["贷记价差", "卖出价差", "credit spread"], def: "净收到权利金建立的价差（如熊市看涨价差）。最大盈利 = 收到的净权利金，靠时间和方向不利于对手而赚。" },
    en: { terms: ["credit spread"], def: "A spread you receive a net premium to open (like a bear call spread). Max gain is the net credit; you profit from time decay and the move not going against you." },
  },
  {
    zh: { terms: ["领口", "领口策略", "collar"], def: "持股 + 买保护性看跌 + 卖看涨。卖看涨的权利金资助买看跌的保险，代价是封住上方空间，常用于低成本护盘。" },
    en: { terms: ["collar"], def: "Stock + a protective put + a short call. The call premium finances the put's insurance; the cost is capping the upside — a cheap way to protect a holding." },
  },
  {
    zh: { terms: ["跨式", "跨式组合", "straddle"], def: "同时买入同行权价的看涨和看跌，押标的“会大动但不知方向”。波动够大就赚，盘整或 IV 下跌则双输。" },
    en: { terms: ["straddle"], def: "Buying a call and a put at the same strike, betting on a big move in either direction. A large move pays; a quiet market or falling IV loses on both legs." },
  },
  {
    zh: { terms: ["宽跨式", "勒式", "strangle"], def: "买入不同行权价（看涨较高、看跌较低）的组合，比跨式便宜但需要更大的波动才回本。" },
    en: { terms: ["strangle"], def: "Buying an out-of-the-money call and put at different strikes. Cheaper than a straddle, but needs an even bigger move to pay off." },
  },
  {
    zh: { terms: ["蝶式", "蝶式价差", "butterfly"], def: "三个行权价、买1卖2买1的组合，押标的“钉在中间行权价附近”。成本低、最大盈利出现在正中央。" },
    en: { terms: ["butterfly", "butterfly spread"], def: "A three-strike structure (buy 1, sell 2, buy 1) betting the underlying pins near the middle strike. Cheap, with max profit dead center." },
  },
  {
    zh: { terms: ["铁鹰", "铁兀鹰", "iron condor"], def: "卖出一个虚值看涨价差 + 一个虚值看跌价差，押标的在区间内盘整。靠时间衰减收租，最大亏损被价差锁定。" },
    en: { terms: ["iron condor"], def: "Selling an OTM call spread and an OTM put spread, betting the underlying stays in a range. It collects time decay, with loss capped by the spreads." },
  },
  {
    zh: { terms: ["日历价差", "时间价差", "calendar spread"], def: "卖近月、买远月（同行权价）的组合，利用近月时间衰减更快获利。本质是在交易时间与期限结构。" },
    en: { terms: ["calendar spread", "time spread"], def: "Selling a near-term option and buying a longer-dated one at the same strike, profiting from faster near-term decay. It trades time and term structure." },
  },
  {
    zh: { terms: ["对角价差", "diagonal spread"], def: "行权价和到期都不同的“日历+垂直”混合结构，可同时表达方向观点和时间观点。" },
    en: { terms: ["diagonal spread"], def: "A calendar-plus-vertical hybrid with different strikes and expiries, letting you express a directional view and a time view at once." },
  },
  {
    zh: { terms: ["合成头寸", "合成多头", "合成空头", "synthetic"], def: "用期权（和现金）拼出与直接持有/做空标的相同回报的组合，根据平价关系等价。例如买看涨+卖看跌≈做多标的。" },
    en: { terms: ["synthetic position", "synthetic"], def: "Using options (and cash) to reproduce being long or short the underlying, equivalent by parity. For example, long call + short put ≈ long the underlying." },
  },
  {
    zh: { terms: ["Delta 对冲", "Delta中性", "delta hedging"], def: "通过买卖标的把组合的净 Delta 调到接近 0，从而剥离方向风险、只留下波动率（Gamma/Vega）敞口。做市商的日常。" },
    en: { terms: ["delta hedging", "delta-neutral"], def: "Buying or selling the underlying to push a position's net Delta near zero, stripping out direction and leaving volatility (Gamma/Vega) exposure. A dealer's daily job." },
  },
  {
    zh: { terms: ["Gamma 剥头皮", "gamma scalping"], def: "持有正 Gamma 多头并不断 Delta 对冲：标的来回波动时高抛低吸赚价差，用以抵消每天的 Theta 损耗。" },
    en: { terms: ["gamma scalping"], def: "Holding positive Gamma and continually delta-hedging: as the underlying swings, you buy low and sell high to harvest moves and offset daily Theta." },
  },
  {
    zh: { terms: ["方差风险溢价", "波动率风险溢价", "variance risk premium", "VRP"], def: "隐含波动率长期略高于实际兑现波动率的现象。它是卖方策略（如卖跨式、铁鹰）长期获利的根本来源。" },
    en: { terms: ["variance risk premium", "volatility risk premium", "VRP"], def: "The tendency for implied vol to sit above realized vol over time. It is the fundamental edge behind premium-selling strategies like short straddles and condors." },
  },
  {
    zh: { terms: ["尾部风险", "尾部对冲", "tail risk"], def: "极端、低概率却破坏巨大的行情（黑天鹅）带来的风险。尾部对冲常用便宜的深度虚值看跌，在崩盘时获得超额赔付。" },
    en: { terms: ["tail risk", "tail hedge", "tail hedging"], def: "The risk from rare, extreme moves (black swans). Tail hedges often use cheap deep-OTM puts that pay off massively in a crash." },
  },
  {
    zh: { terms: ["做市商", "庄家", "market maker"], def: "持续报出买卖价、为市场提供流动性的机构。它们靠价差获利，并通过 Delta 对冲管理库存风险——其对冲流能反过来推动标的。" },
    en: { terms: ["market maker", "dealer"], def: "A firm that continuously quotes bids and offers to provide liquidity. It earns the spread and manages inventory by delta hedging — and that hedging flow can move the underlying." },
  },
  {
    zh: { terms: ["Gamma 挤压", "伽马挤压", "gamma squeeze"], def: "大量买看涨迫使做市商买股对冲，推高股价又迫使其买更多，形成自我强化的上涨螺旋。2021 年的 meme 股是典型。" },
    en: { terms: ["gamma squeeze"], def: "Heavy call buying forces dealers to buy stock to hedge, pushing the price up and forcing still more buying — a self-reinforcing spiral, as in the 2021 meme stocks." },
  },
  {
    zh: { terms: ["凯利公式", "凯利", "Kelly"], def: "在已知优势和赔率时，能使长期资金增长最快的最优下注比例公式。期权里常用“分数凯利”来控制回撤。" },
    en: { terms: ["Kelly criterion", "Kelly"], def: "The bet-sizing formula that maximizes long-run capital growth given your edge and odds. Options traders often use a fractional Kelly to tame drawdowns." },
  },
  {
    zh: { terms: ["蒙特卡洛", "蒙特卡洛模拟"], def: "用计算机生成成千上万条随机价格路径、取回报平均来给期权定价的方法。尤其擅长路径依赖的奇异期权。" },
    en: { terms: ["Monte Carlo", "Monte Carlo simulation"], def: "Pricing an option by generating thousands of random price paths and averaging the payoff. It shines for path-dependent exotic options." },
  },
  {
    zh: { terms: ["奇异期权", "exotic"], def: "结构比普通看涨看跌更复杂的期权：障碍、亚式、二元、回望等。它们多依赖路径，常用蒙特卡洛或数值方法定价。" },
    en: { terms: ["exotic option", "exotics"], def: "Options more complex than plain calls and puts — barrier, Asian, digital, lookback. Many are path-dependent and priced by Monte Carlo or numerical methods." },
  },
  {
    zh: { terms: ["障碍期权", "barrier option"], def: "只有当标的触及（或没触及）某价格水平时才生效或失效的期权，如敲入、敲出。比普通期权便宜，但更难对冲。" },
    en: { terms: ["barrier option"], def: "An option that activates or dies only if the underlying touches a set level (knock-in, knock-out). Cheaper than vanilla, but trickier to hedge." },
  },
  {
    zh: { terms: ["随机波动率", "Heston", "stochastic volatility"], def: "把波动率本身当作随机变动的量来建模（如 Heston 模型），能自然产生市场观察到的波动率微笑。" },
    en: { terms: ["stochastic volatility", "Heston"], def: "Modeling volatility itself as random (as in the Heston model), which naturally reproduces the volatility smile seen in markets." },
  },
  {
    zh: { terms: ["GARCH"], def: "一类预测波动率的时间序列模型，核心思想是“波动会聚集”——大波动后往往跟着大波动。常用于估计未来已实现波动率。" },
    en: { terms: ["GARCH"], def: "A family of time-series models for forecasting volatility, built on volatility clustering — big moves tend to follow big moves. Used to estimate future realized vol." },
  },
  {
    zh: { terms: ["深度对冲", "deep hedging"], def: "用神经网络在含交易成本、跳跃等真实摩擦下，直接学出最优对冲策略，而不依赖 Black-Scholes 的理想假设。" },
    en: { terms: ["deep hedging"], def: "Using a neural network to learn an optimal hedging strategy directly under real frictions like transaction costs and jumps, instead of Black-Scholes' idealized assumptions." },
  },
  {
    zh: { terms: ["强化学习", "RL"], def: "让智能体通过试错与奖励学习决策的机器学习范式。在期权里用于最优执行、做市报价和对冲策略。" },
    en: { terms: ["reinforcement learning", "RL"], def: "A machine-learning paradigm where an agent learns decisions by trial, error, and reward. In options it is used for optimal execution, market making, and hedging." },
  },
  {
    zh: { terms: ["滑点", "slippage"], def: "下单意图价与实际成交价之间的差距，由价差、冲击和延迟造成。算法执行的目标之一就是把它压到最小。" },
    en: { terms: ["slippage"], def: "The gap between the price you intended and the price you actually got, caused by spread, market impact, and latency. Minimizing it is a key goal of algorithmic execution." },
  },
  {
    zh: { terms: ["钉住风险", "pin risk"], def: "到期时标的恰好卡在行权价附近，卖方难以判断会不会被指派、对冲也尴尬的风险。" },
    en: { terms: ["pin risk"], def: "The risk that the underlying lands right at the strike at expiry, leaving a seller unsure whether they will be assigned and awkward to hedge." },
  },
  {
    zh: { terms: ["无风险利率", "risk-free rate"], def: "理论上无违约风险的收益率（常用短期国债）。它是给未来现金流贴现、以及 Black-Scholes 定价的关键输入。" },
    en: { terms: ["risk-free rate"], def: "The theoretical return with no default risk (often short-term government bills). It is used to discount future cash flows and is a key input to Black-Scholes." },
  },
];
