#!/usr/bin/env node

/**
 * 自动更新版本号脚本
 * 用法：node scripts/update-version.js [major|minor|patch] "更新说明"
 */

const fs = require('fs')
const path = require('path')

// 获取参数
const bumpType = process.argv[2] || 'patch' // major, minor, patch
const subtitle = process.argv[3] || ''

// 读取当前版本
const versionFile = path.join(__dirname, '../src/utils/version.ts')
let content = fs.readFileSync(versionFile, 'utf-8')

// 解析当前版本号
const versionMatch = content.match(/version: 'v(\d+)\.(\d+)\.(\d+)'/)
if (!versionMatch) {
  console.error('无法解析版本号')
  process.exit(1)
}

let [major, minor, patch] = versionMatch.slice(1).map(Number)

// 更新版本号
switch (bumpType) {
  case 'major':
    major++
    minor = 0
    patch = 0
    break
  case 'minor':
    minor++
    patch = 0
    break
  case 'patch':
    patch++
    break
}

const newVersion = `v${major}.${minor}.${patch}`
const now = new Date()
const buildDate = now.toISOString().replace('T', ' ').substring(0, 16)
const buildTime = now.getTime()

// 更新版本文件
content = content.replace(
  /version: 'v\d+\.\d+\.\d+'/,
  `version: '${newVersion}'`
)

if (subtitle) {
  content = content.replace(
    /subtitle: '[^']*'/,
    `subtitle: '${subtitle}'`
  )
}

content = content.replace(
  /buildDate: '\d{4}-\d{2}-\d{2} \d{2}:\d{2}'/,
  `buildDate: '${buildDate}'`
)

content = content.replace(
  /buildTime: \d+/,
  `buildTime: ${buildTime}`
)

// 更新 CHANGELOG
const changelogStart = content.indexOf('export const CHANGELOG = [')
if (changelogStart !== -1) {
  // 这里可以添加自动更新 changelog 的逻辑
  console.log('✓ 版本号已更新')
}

// 写入文件
fs.writeFileSync(versionFile, content, 'utf-8')

console.log(`✓ 版本号已更新：${newVersion}${subtitle ? ' - ' + subtitle : ''}`)
console.log(`✓ 构建时间：${buildDate}`)

// 同时更新 LandingPage.vue 中的版本号
const landingPageFile = path.join(__dirname, '../src/components/LandingPage.vue')
let landingContent = fs.readFileSync(landingPageFile, 'utf-8')

// 更新版本号显示
landingContent = landingContent.replace(
  /<span class="footer-version">v\d+\.\d+\.\d+[^<]*<\/span>/,
  `<span class="footer-version">${newVersion}${subtitle ? ' - ' + subtitle : ''}</span>`
)

// 更新时间
landingContent = landingContent.replace(
  /更新于：\d{4}-\d{2}-\d{2} \d{2}:\d{2}/,
  `更新于：${buildDate}`
)

fs.writeFileSync(landingPageFile, landingContent, 'utf-8')
console.log('✓ LandingPage 已更新')

console.log('\n下一步:')
console.log('1. git add -A')
console.log(`2. git commit -m "chore: 更新版本号至 ${newVersion}${subtitle ? ' - ' + subtitle : ''}"`)
console.log('3. npm run build')
console.log('4. git push origin main')
