/**
 * 竞彩足球计算引擎
 *
 * 中国体育彩票竞彩足球全玩法计算模块，包含：
 * - 五大玩法定义（胜平负、让球胜平负、比分、总进球、半全场）
 * - 泊松分布概率计算
 * - 单关/串关投注回报计算
 * - 期望值(EV)与凯利公式(Kelly)价值分析
 * - 最佳方案推荐引擎
 *
 * @module domain/betting
 */

import { clamp } from '../utils/format.js';

// ============================================================
// 阶乘查找表（预计算，提升泊松分布效率）
// ============================================================

/** @type {number[]} 预计算阶乘值 0! 到 20! */
const FACTORIAL = (() => {
  const table = [1];
  for (let i = 1; i <= 20; i++) {
    table[i] = table[i - 1] * i;
  }
  return table;
})();

// ============================================================
// 玩法定义
// ============================================================

/**
 * 竞彩足球五大玩法枚举
 *
 * - SPF: 胜平负（固定奖金，预测主胜/平局/客胜）
 * - RQSPF: 让球胜平负（带让球的胜平负，如让一球）
 * - BF: 比分（预测精确比分）
 * - ZJQ: 总进球（预测两队总进球数 0–7+）
 * - BQC: 半全场（预测半场和全场的胜平负组合）
 */
export const PLAY_TYPES = Object.freeze({
  SPF: { code: 'SPF', name: '胜平负', description: '预测比赛最终结果：主胜、平局或客胜' },
  RQSPF: { code: 'RQSPF', name: '让球胜平负', description: '让球后预测比赛结果，如主队让一球' },
  BF: { code: 'BF', name: '比分', description: '预测比赛精确比分' },
  ZJQ: { code: 'ZJQ', name: '总进球', description: '预测两队总进球数：0/1/2/3/4/5/6/7+' },
  BQC: { code: 'BQC', name: '半全场', description: '预测半场胜平负与全场胜平负的组合' },
});

/**
 * 串关类型定义
 *
 * 键为串关代码（如 '2串1'），值包含：
 * - n: 所需场次数
 * - m: 每注组合的场次数（数组，支持多段组合如 3串4 = 2场组合 + 3场组合）
 * - description: 中文说明
 *
 * 串关规则：M串N 表示从M场比赛中选取特定组合数进行投注
 * 例如：3串4 = C(3,2) + C(3,3) = 3 + 1 = 4 注
 */
export const PARLAY_TYPES = Object.freeze({
  '2串1': { n: 2, m: [2], description: '2场比赛过关，1注' },
  '3串1': { n: 3, m: [3], description: '3场比赛过关，1注' },
  '3串4': { n: 3, m: [2, 3], description: '3场比赛，C(3,2)+C(3,3)=4注' },
  '4串1': { n: 4, m: [4], description: '4场比赛过关，1注' },
  '4串11': { n: 4, m: [2, 3, 4], description: '4场比赛，C(4,2)+C(4,3)+C(4,4)=11注' },
  '5串1': { n: 5, m: [5], description: '5场比赛过关，1注' },
  '5串26': { n: 5, m: [2, 3, 4, 5], description: '5场比赛，C(5,2)+...+C(5,5)=26注' },
  '6串1': { n: 6, m: [6], description: '6场比赛过关，1注' },
  '6串57': { n: 6, m: [2, 3, 4, 5, 6], description: '6场比赛，C(6,2)+...+C(6,6)=57注' },
  '7串1': { n: 7, m: [7], description: '7场比赛过关，1注' },
  '8串1': { n: 8, m: [8], description: '8场比赛过关，1注' },
});

// ============================================================
// 数学工具函数
// ============================================================

/**
 * 计算组合数 C(n, k)
 * @param {number} n - 总数
 * @param {number} k - 选取数
 * @returns {number} 组合数
 */
function combination(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  // 利用 C(n,k) = C(n, n-k) 优化
  const r = Math.min(k, n - k);
  let result = 1;
  for (let i = 0; i < r; i++) {
    result = result * (n - i) / (i + 1);
  }
  return Math.round(result);
}

/**
 * 泊松分布概率质量函数
 *
 * P(k) = (λ^k × e^(-λ)) / k!
 *
 * @param {number} lambda - 期望进球数（λ）
 * @param {number} k - 实际进球数
 * @returns {number} 概率值 [0, 1]
 */
function poissonPMF(lambda, k) {
  if (lambda <= 0 || k < 0) return 0;
  // 使用预计算阶乘表
  if (k <= 20) {
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / FACTORIAL[k];
  }
  // 超过阶乘表范围时，使用对数计算避免溢出
  let logProb = -lambda + k * Math.log(lambda);
  for (let i = 1; i <= k; i++) {
    logProb -= Math.log(i);
  }
  return Math.exp(logProb);
}

/**
 * 生成 M 从 N 中选取的所有组合（索引）
 * @param {number} n - 总数
 * @param {number} k - 选取数
 * @returns {number[][]} 所有组合的索引数组
 */
function combinations(n, k) {
  /** @type {number[][]} */
  const result = [];
  const current = [];

  function backtrack(start) {
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < n; i++) {
      current.push(i);
      backtrack(i + 1);
      current.pop();
    }
  }

  backtrack(0);
  return result;
}

// ============================================================
// 概率计算
// ============================================================

/**
 * 基于泊松分布计算各比分概率
 *
 * 使用主队和客队的期望进球数（xG），利用泊松分布独立计算
 * 各种比分出现的概率。
 *
 * @param {number} homeXG - 主队期望进球数
 * @param {number} awayXG - 客队期望进球数
 * @param {number} [maxGoals=7] - 单方最大进球数（含）
 * @returns {Map<string, number>} 键为 'H:A' 格式比分，值为概率
 *
 * @example
 * const probs = scoreProbabilities(1.5, 1.1);
 * // Map { '0:0' => 0.0743, '1:0' => 0.1115, '0:1' => 0.0818, ... }
 */
export function scoreProbabilities(homeXG, awayXG, maxGoals = 7) {
  const scores = new Map();
  let totalProb = 0;

  for (let h = 0; h <= maxGoals; h++) {
    const homeProb = poissonPMF(homeXG, h);
    for (let a = 0; a <= maxGoals; a++) {
      const awayProb = poissonPMF(awayXG, a);
      const prob = homeProb * awayProb;
      scores.set(`${h}:${a}`, prob);
      totalProb += prob;
    }
  }

  // 归一化，确保概率总和为 1
  if (totalProb > 0 && Math.abs(totalProb - 1) > 1e-9) {
    for (const [key, value] of scores) {
      scores.set(key, value / totalProb);
    }
  }

  return scores;
}

/**
 * 计算总进球数概率分布（0–7+）
 *
 * 对应竞彩总进球玩法的 8 个选项。
 *
 * @param {number} homeXG - 主队期望进球数
 * @param {number} awayXG - 客队期望进球数
 * @returns {number[]} 长度为 8 的概率数组，索引 0–6 对应 0–6 个进球，索引 7 对应 7+ 个进球
 *
 * @example
 * const probs = totalGoalsProbabilities(1.5, 1.1);
 * // [0.074, 0.193, 0.246, 0.209, 0.137, 0.074, ...]
 */
export function totalGoalsProbabilities(homeXG, awayXG) {
  const scores = scoreProbabilities(homeXG, awayXG);
  const totals = new Array(8).fill(0);

  for (const [key, prob] of scores) {
    const [h, a] = key.split(':').map(Number);
    const total = h + a;
    if (total >= 7) {
      totals[7] += prob;
    } else {
      totals[total] += prob;
    }
  }

  return totals;
}

/**
 * 计算半全场胜平负概率（9种组合）
 *
 * 基于泊松分布，将比赛拆分为上下半场分别模拟。
 * 假设上半场消耗约 40% 的期望进球，下半场消耗约 60%。
 *
 * 结果编码：
 * - H = 主胜, D = 平局, A = 客胜
 * - 组合为 "半场结果-全场结果"，如 HH = 半场主胜且全场主胜
 *
 * @param {number} homeXG - 主队全场期望进球数
 * @param {number} awayXG - 客队全场期望进球数
 * @returns {Object<string, number>} 9 种半全场组合的概率
 *
 * @example
 * const probs = halfTimeFullTime(1.5, 1.1);
 * // { HH: 0.15, HD: 0.04, HA: 0.02, DH: 0.12, DD: 0.10, DA: 0.06, ... }
 */
export function halfTimeFullTime(homeXG, awayXG) {
  // 上半场进球比例约 40%，下半场约 60%（足球统计经验值）
  const halfRatio = 0.4;
  const homeHalfXG = homeXG * halfRatio;
  const awayHalfXG = awayXG * halfRatio;
  const homeSecondXG = homeXG * (1 - halfRatio);
  const awaySecondXG = awayXG * (1 - halfRatio);

  const maxHalfGoals = 5; // 半场最多考虑5球
  const results = { HH: 0, HD: 0, HA: 0, DH: 0, DD: 0, DA: 0, AH: 0, AD: 0, AA: 0 };

  // 枚举上下半场所有可能的进球组合
  for (let hh = 0; hh <= maxHalfGoals; hh++) {
    const pHomeHalf = poissonPMF(homeHalfXG, hh);
    for (let ah = 0; ah <= maxHalfGoals; ah++) {
      const pAwayHalf = poissonPMF(awayHalfXG, ah);
      const halfResult = hh > ah ? 'H' : hh === ah ? 'D' : 'A';

      for (let hs = 0; hs <= maxHalfGoals; hs++) {
        const pHomeSecond = poissonPMF(homeSecondXG, hs);
        for (let as = 0; as <= maxHalfGoals; as++) {
          const pAwaySecond = poissonPMF(awaySecondXG, as);
          const totalHome = hh + hs;
          const totalAway = ah + as;
          const fullResult = totalHome > totalAway ? 'H' : totalHome === totalAway ? 'D' : 'A';
          const key = `${halfResult}${fullResult}`;
          results[key] += pHomeHalf * pAwayHalf * pHomeSecond * pAwaySecond;
        }
      }
    }
  }

  // 归一化
  const totalProb = Object.values(results).reduce((sum, v) => sum + v, 0);
  if (totalProb > 0) {
    for (const key of Object.keys(results)) {
      results[key] /= totalProb;
    }
  }

  return results;
}

/**
 * 计算让球后的胜平负概率
 *
 * 让球规则：
 * - handicap = -1 表示主队让 1 球（主队需净胜 2+ 球才算主胜）
 * - handicap = +1 表示主队受让 1 球（主队只要不输 2+ 球即可）
 *
 * @param {number} homeWinProb - 原始主胜概率（0-1）
 * @param {number} drawProb - 原始平局概率（0-1）
 * @param {number} awayWinProb - 原始客胜概率（0-1）
 * @param {number} handicap - 让球数（负数=主队让球，正数=主队受让）
 * @returns {{ homeWin: number, draw: number, awayWin: number }} 让球后胜平负概率
 *
 * @example
 * // 主队让一球
 * handicapProbabilities(0.5, 0.25, 0.25, -1);
 * // 需要基于比分概率重新分配
 */
export function handicapProbabilities(homeWinProb, drawProb, awayWinProb, handicap) {
  // 使用逆推 xG 方法：从胜平负概率反推近似 xG，再基于比分概率计算让球结果
  // 利用比分矩阵来精确计算让球后的胜平负
  const totalGoals = 2.6; // 足球平均总进球数
  const homeRatio = homeWinProb / (homeWinProb + awayWinProb + 0.001);
  const approxHomeXG = totalGoals * clamp(homeRatio * 0.65 + 0.175, 0.3, 0.7);
  const approxAwayXG = totalGoals - approxHomeXG;

  const scores = scoreProbabilities(approxHomeXG, approxAwayXG);

  let homeWin = 0;
  let draw = 0;
  let awayWin = 0;

  for (const [key, prob] of scores) {
    const [h, a] = key.split(':').map(Number);
    // 让球后的虚拟比分：主队 + handicap
    const adjustedDiff = (h + handicap) - a;
    if (adjustedDiff > 0) {
      homeWin += prob;
    } else if (adjustedDiff === 0) {
      draw += prob;
    } else {
      awayWin += prob;
    }
  }

  // 归一化
  const total = homeWin + draw + awayWin;
  if (total > 0) {
    homeWin /= total;
    draw /= total;
    awayWin /= total;
  }

  return { homeWin, draw, awayWin };
}

// ============================================================
// 投注计算
// ============================================================

/**
 * 计算单关投注回报
 *
 * @param {number} odds - 赔率（SP值）
 * @param {number} betAmount - 投注金额（元）
 * @returns {{ betAmount: number, odds: number, potentialReturn: number, profit: number }}
 *
 * @example
 * calculateSingleReturn(1.85, 100);
 * // { betAmount: 100, odds: 1.85, potentialReturn: 185, profit: 85 }
 */
export function calculateSingleReturn(odds, betAmount) {
  const potentialReturn = betAmount * odds;
  return {
    betAmount,
    odds,
    potentialReturn: Number(potentialReturn.toFixed(2)),
    profit: Number((potentialReturn - betAmount).toFixed(2)),
  };
}

/**
 * 计算串关投注回报
 *
 * 串关回报 = 投注金额 × SP1 × SP2 × ... × SPn（对每个组合）
 *
 * @param {Array<{ odds: number, matchId?: string, outcome?: string }>} selections - 选项数组
 * @param {number} betAmount - 每注金额（元）
 * @param {string} parlayType - 串关类型代码，如 '2串1', '3串4'
 * @returns {{
 *   totalBets: number,
 *   totalCost: number,
 *   maxReturn: number,
 *   minReturn: number,
 *   combinations: Array<{ indices: number[], odds: number, potentialReturn: number }>
 * }}
 *
 * @example
 * const result = calculateParlayReturn(
 *   [{ odds: 1.85 }, { odds: 2.10 }, { odds: 1.55 }],
 *   100,
 *   '3串4'
 * );
 */
export function calculateParlayReturn(selections, betAmount, parlayType) {
  const config = PARLAY_TYPES[parlayType];
  if (!config) {
    return { totalBets: 0, totalCost: 0, maxReturn: 0, minReturn: 0, combinations: [] };
  }

  if (selections.length < config.n) {
    return { totalBets: 0, totalCost: 0, maxReturn: 0, minReturn: 0, combinations: [] };
  }

  const allCombinations = [];

  // 对每个组合段（m 值）生成组合
  for (const k of config.m) {
    const combos = combinations(selections.length, k);
    for (const indices of combos) {
      const combinedOdds = indices.reduce((product, idx) => product * selections[idx].odds, 1);
      allCombinations.push({
        indices,
        odds: Number(combinedOdds.toFixed(4)),
        potentialReturn: Number((betAmount * combinedOdds).toFixed(2)),
      });
    }
  }

  const totalBets = allCombinations.length;
  const totalCost = totalBets * betAmount;
  const returns = allCombinations.map(c => c.potentialReturn);
  const maxReturn = returns.length > 0 ? returns.reduce((a, b) => Math.max(a, b), 0) : 0;
  const minReturn = returns.length > 0 ? returns.reduce((a, b) => Math.min(a, b), Infinity) : 0;

  return {
    totalBets,
    totalCost: Number(totalCost.toFixed(2)),
    maxReturn: Number(maxReturn.toFixed(2)),
    minReturn: Number(minReturn.toFixed(2)),
    combinations: allCombinations,
  };
}

/**
 * 计算串关组合数
 *
 * 根据场次数和串关类型，返回总投注注数。
 *
 * @param {number} n - 比赛场次数
 * @param {string} parlayType - 串关类型代码
 * @returns {number} 投注组合数
 *
 * @example
 * parlayCount(3, '3串4'); // 4 (= C(3,2) + C(3,3))
 * parlayCount(4, '4串11'); // 11 (= C(4,2) + C(4,3) + C(4,4))
 */
export function parlayCount(n, parlayType) {
  const config = PARLAY_TYPES[parlayType];
  if (!config) return 0;
  if (n < config.n) return 0;

  let total = 0;
  for (const k of config.m) {
    total += combination(n, k);
  }
  return total;
}

// ============================================================
// 价值分析
// ============================================================

/**
 * 计算期望值（EV）
 *
 * EV = 模型概率 × 赔率 - 1
 * EV > 0 表示正期望，为价值投注
 *
 * @param {number} modelProb - 模型预测概率（0-1）
 * @param {number} lotteryOdds - 竞彩赔率
 * @returns {number} 期望值（正数 = 价值投注）
 *
 * @example
 * expectedValue(0.55, 2.10); // 0.155（即 15.5% 正期望）
 */
export function expectedValue(modelProb, lotteryOdds) {
  if (!Number.isFinite(modelProb) || !Number.isFinite(lotteryOdds)) return -1;
  if (modelProb <= 0 || lotteryOdds <= 0) return -1;
  return modelProb * lotteryOdds - 1;
}

/**
 * 凯利公式计算最优投注比例
 *
 * Kelly 公式：f = (p × b - q) / b
 * 其中：
 *   p = 模型预测胜率
 *   q = 1 - p（失败概率）
 *   b = 赔率 - 1（净赔率）
 *
 * 结果上限为 25%（防止过度投注）
 *
 * @param {number} modelProb - 模型预测概率（0-1）
 * @param {number} lotteryOdds - 竞彩赔率
 * @returns {number} 最优投注比例（0-0.25）
 *
 * @example
 * kellyFraction(0.55, 2.10); // 约 0.141
 */
export function kellyFraction(modelProb, lotteryOdds) {
  if (!Number.isFinite(modelProb) || !Number.isFinite(lotteryOdds)) return 0;
  if (modelProb <= 0 || modelProb >= 1 || lotteryOdds <= 1) return 0;

  const p = modelProb;
  const q = 1 - p;
  const b = lotteryOdds - 1;

  const fraction = (p * b - q) / b;

  // 负值表示无价值，返回 0；上限 25% 防止过度投注
  return clamp(fraction, 0, 0.25);
}

/**
 * 投注价值置信评级
 *
 * 综合期望值、凯利比例和模型置信度，给出中文评级。
 *
 * @param {number} ev - 期望值
 * @param {number} kelly - 凯利比例
 * @param {number} modelConfidence - 模型置信度（0-100）
 * @returns {'高价值' | '中等价值' | '低价值' | '无价值'}
 *
 * @example
 * confidenceRating(0.15, 0.12, 75); // '高价值'
 */
export function confidenceRating(ev, kelly, modelConfidence) {
  if (ev <= 0 || kelly <= 0) return '无价值';

  // 综合评分 = EV权重 + Kelly权重 + 置信度权重
  const evScore = clamp(ev * 100, 0, 40); // EV 贡献最多 40 分
  const kellyScore = clamp(kelly * 160, 0, 30); // Kelly 贡献最多 30 分
  const confScore = clamp((modelConfidence - 50) * 0.6, 0, 30); // 置信度贡献最多 30 分

  const totalScore = evScore + kellyScore + confScore;

  if (totalScore >= 45) return '高价值';
  if (totalScore >= 25) return '中等价值';
  if (totalScore >= 10) return '低价值';
  return '无价值';
}

// ============================================================
// 最佳方案推荐
// ============================================================

/**
 * 扫描所有比赛，找出价值投注机会
 *
 * 对每场比赛的每个玩法选项计算 EV 和 Kelly，筛选出正期望的投注。
 *
 * @param {Array<{ id: string, home: string, away: string }>} matches - 比赛数组
 * @param {Object<string, { probs: number[], homeXG: number, awayXG: number, confidence?: number }>} modelData
 *   模型数据，键为比赛 ID
 * @param {Object<string, {
 *   spf?: { h: number, d: number, a: number },
 *   rqspf?: { h: number, d: number, a: number, handicap: number },
 *   bf?: Object<string, number>,
 *   zjq?: number[],
 *   bqc?: Object<string, number>
 * }>} lotteryOdds - 竞彩赔率，键为比赛 ID
 * @returns {Array<{
 *   matchId: string,
 *   playType: string,
 *   outcome: string,
 *   modelProb: number,
 *   odds: number,
 *   ev: number,
 *   kelly: number,
 *   confidence: string,
 *   modelConfidence: number
 * }>} 按 EV 降序排列的价值投注数组
 */
export function findValueBets(matches, modelData, lotteryOdds) {
  const valueBets = [];

  for (const match of matches) {
    const model = modelData[match.id];
    const odds = lotteryOdds[match.id];
    if (!model || !odds) continue;

    const modelConf = model.confidence ?? 60;
    const [homeProb, drawProb, awayProb] = model.probs.map(p => p / 100);

    // === 胜平负 (SPF) ===
    if (odds.spf) {
      const spfOutcomes = [
        { outcome: '主胜', prob: homeProb, odd: odds.spf.h },
        { outcome: '平局', prob: drawProb, odd: odds.spf.d },
        { outcome: '客胜', prob: awayProb, odd: odds.spf.a },
      ];
      for (const { outcome, prob, odd } of spfOutcomes) {
        if (!odd || odd <= 0) continue;
        const ev = expectedValue(prob, odd);
        const kelly = kellyFraction(prob, odd);
        if (ev > 0) {
          valueBets.push({
            matchId: match.id,
            playType: 'SPF',
            playTypeName: '胜平负',
            outcome,
            modelProb: prob,
            odds: odd,
            ev: Number(ev.toFixed(4)),
            kelly: Number(kelly.toFixed(4)),
            confidence: confidenceRating(ev, kelly, modelConf),
            modelConfidence: modelConf,
          });
        }
      }
    }

    // === 让球胜平负 (RQSPF) ===
    if (odds.rqspf) {
      const handicap = odds.rqspf.handicap || 0;
      const hcProbs = handicapProbabilities(homeProb, drawProb, awayProb, handicap);
      const rqspfOutcomes = [
        { outcome: `让球主胜(${handicap >= 0 ? '+' : ''}${handicap})`, prob: hcProbs.homeWin, odd: odds.rqspf.h },
        { outcome: `让球平局(${handicap >= 0 ? '+' : ''}${handicap})`, prob: hcProbs.draw, odd: odds.rqspf.d },
        { outcome: `让球客胜(${handicap >= 0 ? '+' : ''}${handicap})`, prob: hcProbs.awayWin, odd: odds.rqspf.a },
      ];
      for (const { outcome, prob, odd } of rqspfOutcomes) {
        if (!odd || odd <= 0) continue;
        const ev = expectedValue(prob, odd);
        const kelly = kellyFraction(prob, odd);
        if (ev > 0) {
          valueBets.push({
            matchId: match.id,
            playType: 'RQSPF',
            playTypeName: '让球胜平负',
            outcome,
            modelProb: prob,
            odds: odd,
            ev: Number(ev.toFixed(4)),
            kelly: Number(kelly.toFixed(4)),
            confidence: confidenceRating(ev, kelly, modelConf),
            modelConfidence: modelConf,
          });
        }
      }
    }

    // === 比分 (BF) ===
    if (odds.bf && model.homeXG != null && model.awayXG != null) {
      const scoreProbs = scoreProbabilities(model.homeXG, model.awayXG);
      for (const [score, prob] of scoreProbs) {
        const odd = odds.bf[score];
        if (!odd || odd <= 0 || prob < 0.01) continue; // 忽略概率过低的比分
        const ev = expectedValue(prob, odd);
        const kelly = kellyFraction(prob, odd);
        if (ev > 0) {
          valueBets.push({
            matchId: match.id,
            playType: 'BF',
            playTypeName: '比分',
            outcome: score,
            modelProb: prob,
            odds: odd,
            ev: Number(ev.toFixed(4)),
            kelly: Number(kelly.toFixed(4)),
            confidence: confidenceRating(ev, kelly, modelConf),
            modelConfidence: modelConf,
          });
        }
      }
    }

    // === 总进球 (ZJQ) ===
    if (odds.zjq && model.homeXG != null && model.awayXG != null) {
      const totalProbs = totalGoalsProbabilities(model.homeXG, model.awayXG);
      const zjqLabels = ['0球', '1球', '2球', '3球', '4球', '5球', '6球', '7+球'];
      for (let i = 0; i < totalProbs.length && i < odds.zjq.length; i++) {
        const prob = totalProbs[i];
        const odd = odds.zjq[i];
        if (!odd || odd <= 0) continue;
        const ev = expectedValue(prob, odd);
        const kelly = kellyFraction(prob, odd);
        if (ev > 0) {
          valueBets.push({
            matchId: match.id,
            playType: 'ZJQ',
            playTypeName: '总进球',
            outcome: zjqLabels[i],
            modelProb: prob,
            odds: odd,
            ev: Number(ev.toFixed(4)),
            kelly: Number(kelly.toFixed(4)),
            confidence: confidenceRating(ev, kelly, modelConf),
            modelConfidence: modelConf,
          });
        }
      }
    }

    // === 半全场 (BQC) ===
    if (odds.bqc && model.homeXG != null && model.awayXG != null) {
      const bqcProbs = halfTimeFullTime(model.homeXG, model.awayXG);
      const bqcLabels = {
        HH: '胜-胜', HD: '胜-平', HA: '胜-负',
        DH: '平-胜', DD: '平-平', DA: '平-负',
        AH: '负-胜', AD: '负-平', AA: '负-负',
      };
      for (const [key, prob] of Object.entries(bqcProbs)) {
        const odd = odds.bqc[key];
        if (!odd || odd <= 0) continue;
        const ev = expectedValue(prob, odd);
        const kelly = kellyFraction(prob, odd);
        if (ev > 0) {
          valueBets.push({
            matchId: match.id,
            playType: 'BQC',
            playTypeName: '半全场',
            outcome: bqcLabels[key] || key,
            modelProb: prob,
            odds: odd,
            ev: Number(ev.toFixed(4)),
            kelly: Number(kelly.toFixed(4)),
            confidence: confidenceRating(ev, kelly, modelConf),
            modelConfidence: modelConf,
          });
        }
      }
    }
  }

  // 按 EV 降序排列
  valueBets.sort((a, b) => b.ev - a.ev);
  return valueBets;
}

/**
 * 生成串关推荐方案
 *
 * 根据价值投注列表和用户配置，自动组合生成不同风险等级的串关方案。
 *
 * @param {Array<{ matchId: string, odds: number, ev: number, kelly: number, confidence: string, modelProb: number, outcome: string, playType: string }>} valueBets
 *   findValueBets 返回的价值投注数组
 * @param {{
 *   budget?: number,
 *   riskLevel?: 'conservative' | 'balanced' | 'aggressive',
 *   maxMatches?: number
 * }} config - 推荐配置
 * @returns {{
 *   conservative: Array,
 *   balanced: Array,
 *   aggressive: Array
 * }} 三种风险等级的推荐方案
 */
export function generateParlayRecommendations(valueBets, config = {}) {
  const budget = config.budget || 200;
  const maxMatches = config.maxMatches || 5;

  if (!valueBets || valueBets.length === 0) {
    return { conservative: [], balanced: [], aggressive: [] };
  }

  // 按不同比赛去重，每场比赛只取 EV 最高的选项
  const bestByMatch = new Map();
  for (const bet of valueBets) {
    const existing = bestByMatch.get(bet.matchId);
    if (!existing || bet.ev > existing.ev) {
      bestByMatch.set(bet.matchId, bet);
    }
  }
  const uniqueBets = Array.from(bestByMatch.values()).sort((a, b) => b.ev - a.ev);

  const plans = { conservative: [], balanced: [], aggressive: [] };

  // === 保守方案：2串1，选取 EV 最高的 2 场，高概率选项 ===
  const conservativeBets = uniqueBets
    .filter(b => b.modelProb >= 0.4 && b.ev > 0.03)
    .slice(0, Math.min(3, maxMatches));

  if (conservativeBets.length >= 2) {
    const selected = conservativeBets.slice(0, 2);
    const parlayResult = calculateParlayReturn(selected, Math.floor(budget * 0.5), '2串1');
    const winProb = selected.reduce((p, s) => p * s.modelProb, 1);
    plans.conservative.push({
      selections: selected,
      parlayType: '2串1',
      totalCost: parlayResult.totalCost,
      expectedReturn: Number((parlayResult.maxReturn * winProb).toFixed(2)),
      maxReturn: parlayResult.maxReturn,
      winProb: Number(winProb.toFixed(4)),
      ev: Number((winProb * selected.reduce((p, s) => p * s.odds, 1) - 1).toFixed(4)),
    });
  }

  // === 均衡方案：3串4 或 3串1，选取 EV 前 3 场 ===
  const balancedBets = uniqueBets
    .filter(b => b.ev > 0.02)
    .slice(0, Math.min(4, maxMatches));

  if (balancedBets.length >= 3) {
    const selected = balancedBets.slice(0, 3);
    // 3串4：包含所有 2 场组合和 1 个 3 场过关
    const parlayResult = calculateParlayReturn(selected, Math.floor(budget * 0.3), '3串4');
    const fullWinProb = selected.reduce((p, s) => p * s.modelProb, 1);

    // 计算任意 2 场命中的概率（更复杂但更实际）
    let anyTwoWinProb = 0;
    const combos2 = combinations(selected.length, 2);
    for (const indices of combos2) {
      let comboProb = 1;
      for (let i = 0; i < selected.length; i++) {
        if (indices.includes(i)) {
          comboProb *= selected[i].modelProb;
        } else {
          comboProb *= (1 - selected[i].modelProb);
        }
      }
      anyTwoWinProb += comboProb;
    }
    const totalWinExpected = anyTwoWinProb + fullWinProb;

    plans.balanced.push({
      selections: selected,
      parlayType: '3串4',
      totalCost: parlayResult.totalCost,
      expectedReturn: Number((parlayResult.combinations.reduce((sum, c) => {
        // 每个组合的期望 = 组合回报 × 该组合全中的概率
        const comboWinProb = c.indices.reduce((p, idx) => p * selected[idx].modelProb, 1);
        return sum + c.potentialReturn * comboWinProb;
      }, 0)).toFixed(2)),
      maxReturn: Number(parlayResult.combinations.reduce((sum, c) => sum + c.potentialReturn, 0).toFixed(2)),
      winProb: Number(totalWinExpected.toFixed(4)),
      ev: Number((parlayResult.combinations.reduce((sum, c) => {
        const comboWinProb = c.indices.reduce((p, idx) => p * selected[idx].modelProb, 1);
        return sum + c.potentialReturn * comboWinProb;
      }, 0) / parlayResult.totalCost - 1).toFixed(4)),
    });
  }

  // === 激进方案：4串1 或 5串1，高赔率组合 ===
  const aggressiveBets = uniqueBets
    .filter(b => b.ev > 0)
    .slice(0, Math.min(5, maxMatches));

  if (aggressiveBets.length >= 4) {
    const selected = aggressiveBets.slice(0, 4);
    const parlayResult = calculateParlayReturn(selected, Math.floor(budget * 0.15), '4串1');
    const winProb = selected.reduce((p, s) => p * s.modelProb, 1);
    plans.aggressive.push({
      selections: selected,
      parlayType: '4串1',
      totalCost: parlayResult.totalCost,
      expectedReturn: Number((parlayResult.maxReturn * winProb).toFixed(2)),
      maxReturn: parlayResult.maxReturn,
      winProb: Number(winProb.toFixed(4)),
      ev: Number((winProb * selected.reduce((p, s) => p * s.odds, 1) - 1).toFixed(4)),
    });
  }

  // 如果有 5 场以上，追加 5 串 1 激进方案
  if (aggressiveBets.length >= 5) {
    const selected = aggressiveBets.slice(0, 5);
    const parlayResult = calculateParlayReturn(selected, Math.floor(budget * 0.1), '5串1');
    const winProb = selected.reduce((p, s) => p * s.modelProb, 1);
    plans.aggressive.push({
      selections: selected,
      parlayType: '5串1',
      totalCost: parlayResult.totalCost,
      expectedReturn: Number((parlayResult.maxReturn * winProb).toFixed(2)),
      maxReturn: parlayResult.maxReturn,
      winProb: Number(winProb.toFixed(4)),
      ev: Number((winProb * selected.reduce((p, s) => p * s.odds, 1) - 1).toFixed(4)),
    });
  }

  return plans;
}

/**
 * 生成完整投注摘要（用于界面展示）
 *
 * 汇总所有选项的详细信息，包括潜在回报、风险评估等。
 *
 * @param {Array<{ matchId: string, outcome: string, playType: string, odds: number, modelProb?: number }>} selections
 *   投注选项
 * @param {Object} lotteryOdds - 竞彩赔率数据
 * @param {number} betAmount - 每注金额
 * @param {string} parlayType - 串关类型
 * @returns {{
 *   selections: Array,
 *   parlayType: string,
 *   parlayTypeName: string,
 *   betAmount: number,
 *   totalBets: number,
 *   totalCost: number,
 *   maxReturn: number,
 *   minReturn: number,
 *   overallWinProb: number,
 *   overallEV: number,
 *   riskLevel: string,
 *   combinations: Array
 * }}
 */
export function generateBettingSummary(selections, lotteryOdds, betAmount, parlayType) {
  const config = PARLAY_TYPES[parlayType];
  const parlayTypeName = config?.description || parlayType;

  // 为每个选项补充详细信息
  const enrichedSelections = selections.map(sel => {
    const matchOdds = lotteryOdds[sel.matchId];
    const odds = sel.odds || resolveOdds(matchOdds, sel.playType, sel.outcome) || 1;
    const ev = sel.modelProb ? expectedValue(sel.modelProb, odds) : null;
    const kelly = sel.modelProb ? kellyFraction(sel.modelProb, odds) : null;
    return {
      ...sel,
      odds,
      ev: ev !== null ? Number(ev.toFixed(4)) : null,
      kelly: kelly !== null ? Number(kelly.toFixed(4)) : null,
      confidence: (ev !== null && kelly !== null)
        ? confidenceRating(ev, kelly, sel.modelConfidence || 60)
        : '未知',
    };
  });

  // 计算串关
  const parlayResult = calculateParlayReturn(enrichedSelections, betAmount, parlayType);

  // 计算整体胜率（所有选项全中的概率）
  const overallWinProb = enrichedSelections.every(s => s.modelProb != null)
    ? enrichedSelections.reduce((p, s) => p * s.modelProb, 1)
    : null;

  // 整体 EV
  const totalOdds = enrichedSelections.reduce((p, s) => p * s.odds, 1);
  const overallEV = overallWinProb !== null
    ? Number((overallWinProb * totalOdds - 1).toFixed(4))
    : null;

  // 风险等级判定
  let riskLevel = '中等风险';
  if (overallWinProb !== null) {
    if (overallWinProb >= 0.25) riskLevel = '低风险';
    else if (overallWinProb >= 0.08) riskLevel = '中等风险';
    else riskLevel = '高风险';
  }

  return {
    selections: enrichedSelections,
    parlayType,
    parlayTypeName,
    betAmount,
    totalBets: parlayResult.totalBets,
    totalCost: parlayResult.totalCost,
    maxReturn: parlayResult.maxReturn,
    minReturn: parlayResult.minReturn,
    overallWinProb: overallWinProb !== null ? Number(overallWinProb.toFixed(6)) : null,
    overallEV,
    riskLevel,
    combinations: parlayResult.combinations,
  };
}

// ============================================================
// 内部辅助函数
// ============================================================

/**
 * 从赔率对象中根据玩法和选项解析赔率值
 * @param {Object} matchOdds - 单场比赛赔率对象
 * @param {string} playType - 玩法代码
 * @param {string} outcome - 选项名称
 * @returns {number|null} 赔率值
 */
function resolveOdds(matchOdds, playType, outcome) {
  if (!matchOdds) return null;

  switch (playType) {
    case 'SPF': {
      const map = { '主胜': 'h', '平局': 'd', '客胜': 'a' };
      return matchOdds.spf?.[map[outcome]] ?? null;
    }
    case 'RQSPF': {
      // 让球选项格式为 "让球主胜(-1)" 等
      if (outcome.includes('主胜')) return matchOdds.rqspf?.h ?? null;
      if (outcome.includes('平局')) return matchOdds.rqspf?.d ?? null;
      if (outcome.includes('客胜')) return matchOdds.rqspf?.a ?? null;
      return null;
    }
    case 'BF':
      return matchOdds.bf?.[outcome] ?? null;
    case 'ZJQ': {
      const zjqMap = { '0球': 0, '1球': 1, '2球': 2, '3球': 3, '4球': 4, '5球': 5, '6球': 6, '7+球': 7 };
      const idx = zjqMap[outcome];
      return idx != null ? (matchOdds.zjq?.[idx] ?? null) : null;
    }
    case 'BQC': {
      const bqcMap = {
        '胜-胜': 'HH', '胜-平': 'HD', '胜-负': 'HA',
        '平-胜': 'DH', '平-平': 'DD', '平-负': 'DA',
        '负-胜': 'AH', '负-平': 'AD', '负-负': 'AA',
      };
      return matchOdds.bqc?.[bqcMap[outcome]] ?? null;
    }
    default:
      return null;
  }
}
