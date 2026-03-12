/**
 * 根据连击数计算感叹号数量
 * 规则：10 的 n 次方决定 n 个感叹号
 * - combo < 10: 0 个感叹号
 * - combo < 100: 1 个感叹号
 * - combo < 1000: 2 个感叹号
 * - combo < 10000: 3 个感叹号
 * - 以此类推
 */
export function getComboExclamationCount(combo: number): number {
  if (combo < 10) {
    return 0
  }
  
  // 计算是 10 的几次方
  const power = Math.floor(Math.log10(combo))
  return power
}

/**
 * 格式化连击数显示（带感叹号）
 */
export function formatCombo(combo: number): string {
  const exclamations = '!'.repeat(getComboExclamationCount(combo))
  return `${combo}${exclamations}`
}
