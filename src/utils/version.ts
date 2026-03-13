/**
 * Vortex Keyboard - 版本信息
 * 每次部署时自动更新此文件
 */

export const VERSION = {
  version: 'v1.6.0',
  subtitle: '',
  buildDate: '2026-03-13 22:53',
  buildTime: 1710344000000, // Unix timestamp
}

export const CHANGELOG = [
  {
    version: 'v1.6.0 - 反作弊系统',
    date: '2026-03-13 22:53',
    changes: [
      '实现反作弊系统，防止自动化脚本刷关',
      '输入行为检测（按键间隔分析、标准差计算）',
      '风险评分系统（0-100 分），多层检测规则',
      '自动阻止粘贴功能',
      '修复检测到作弊后弹窗不显示的问题',
      '优化事件绑定逻辑，确保按键被正确记录'
    ]
  },
  {
    version: 'v1.5.0',
    date: '2026-03-13 00:18',
    changes: [
      '首页底部显示版本号和最后更新时间',
      '日期精确到分钟'
    ]
  },
  {
    version: 'v1.4.0',
    date: '2026-03-13 00:06',
    changes: [
      '修复移动端重复输入问题',
      '修复错误检测逻辑'
    ]
  },
  {
    version: 'v1.3.0',
    date: '2026-03-13 00:03',
    changes: [
      '修复移动端输入错误',
      '优化输入框内容同步'
    ]
  },
  {
    version: 'v1.2.0',
    date: '2026-03-13 00:00',
    changes: [
      '修复 TypeScript 错误'
    ]
  }
]

// 获取完整版本号
export function getFullVersion(): string {
  return VERSION.subtitle 
    ? `${VERSION.version} - ${VERSION.subtitle}`
    : VERSION.version
}

// 获取格式化日期
export function getFormattedDate(): string {
  return VERSION.buildDate
}
