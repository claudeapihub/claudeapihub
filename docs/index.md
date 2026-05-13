---
title: Claude API 中转站导航与使用指南
description: Claude API 中转站、Claude API 调用教程、Claude 模型价格说明与国内接入指南，专注 Claude API 接入与使用经验分享。

layout: home

hero:
  name: "Claude API"
  text: "中转站导航与使用指南"
  tagline: "专注 Claude API 接入教程 · 模型价格说明 · 国内开发指南"
  image:
    src: /claude-logo.svg
    alt: Claude API
  actions:
    - theme: brand
      text: 🚀 立即访问 Claude API 中转站
      link: https://jeniya.cn
    - theme: alt
      text: 📖 开始阅读 Claude API 教程
      link: /blog/claude-api/

features:
  - icon: 🔄
    title: Claude API 中转站
    details: 提供 Claude API 中转服务，稳定高效，兼容 OpenAI 格式，一行代码即可切换接入。
  - icon: 📚
    title: 完整调用教程
    details: 涵盖 Python 接入示例、参数详解、流式输出、错误处理，从入门到精通一站式学习。
  - icon: 💰
    title: 模型价格说明
    details: 详细对比 Claude Haiku、Sonnet、Opus 模型价格、能力差异与适用场景，帮你选择最优方案。
  - icon: 🌐
    title: 国内接入指南
    details: 针对国内开发者提供完整的 Claude API 接入方案，解决访问、鉴权、稳定性等问题。
  - icon: ⚡
    title: 快速开始
    details: 兼容 OpenAI SDK，无需学习新接口，修改 base_url 即可完成迁移，分钟级接入。
  - icon: 🛠️
    title: 最佳实践
    details: 分享提示词优化、成本控制、长文本处理、错误重试等实战经验，提升开发效率。
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 添加页面加载动画
  document.querySelectorAll('.VPFeature').forEach((el, index) => {
    el.style.animationDelay = `${index * 0.1}s`
  })
})
</script>

<style>
/* Hero 区域增强 */
.VPHero {
  padding-bottom: 48px !important;
}

.VPHero .name {
  background: linear-gradient(120deg, #cf6e49 0%, #d4a574 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.VPHero .tagline {
  color: var(--vp-c-text-2);
  font-size: 1.1rem;
  margin-top: 8px;
}

/* Features 卡片样式增强 */
.VPFeatures {
  padding: 24px 24px 48px !important;
}

.VPFeature {
  transition: all 0.3s ease;
  border-radius: 12px;
  animation: fadeInUp 0.5s ease forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.VPFeature:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.VPFeature .icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.VPFeature .title {
  font-weight: 600;
  font-size: 1.1rem;
}

.VPFeature .details {
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

/* 按钮样式增强 */
.VPButton.brand {
  background: linear-gradient(120deg, #cf6e49 0%, #d4a574 100%);
  border: none;
  font-weight: 500;
}

.VPButton.brand:hover {
  background: linear-gradient(120deg, #b85c3a 0%, #c49567 100%);
}

/* 自定义区块样式 */
.custom-block {
  margin: 16px 0;
  border-radius: 8px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .VPHero .text {
    font-size: 2rem !important;
  }
  
  .VPFeature {
    margin-bottom: 16px;
  }
}
</style>

## 🎯 Claude API 中转站导航与使用指南

本站专注分享 Claude API 相关内容，帮助开发者快速完成 Claude API 接入与使用。

### 📋 核心内容

| 主题 | 说明 |
|------|------|
| Claude API 中转站 | 稳定、高效、兼容 OpenAI 格式的 Claude API 接入方案 |
| Claude API 调用教程 | Python 接入示例、参数详解、流式输出、错误处理 |
| Claude 模型价格说明 | Haiku / Sonnet / Opus 模型价格对比与选择建议 |
| Claude API 国内使用 | 针对 国内开发者的完整接入与使用指南 |
| Claude API 最佳实践 | 提示词优化、成本控制、长文本处理技巧 |

---

## 🚀 快速入口

<div class="quick-links">

| 入口 | 说明 |
|------|------|
| [Claude API 教程](/blog/claude-api/) | 从入门到精通的完整教程 |
| [支持模型列表](/models.html) | Claude Opus / Sonnet / Haiku 模型说明 |
| [价格说明](/pricing.html) | Claude API 计费方式与价格参考 |
| [API 接入文档](/docs.html) | 接口地址、参数说明、代码示例 |
| [常见问题 FAQ](/faq.html) | 接入与使用中的常见问题解答 |

</div>

---

## 📚 专题导航

<div class="topic-nav">

### [Claude API 教程](/blog/claude-api/)

完整的 Claude API 学习路径：
- **入门教程**：Claude API 基础概念与快速开始
- **模型选择**：Haiku / Sonnet / Opus 对比与选择建议
- **最佳实践**：提示词优化、成本控制、错误处理
- **实战案例**：长文本处理、文档总结、代码分析

### [API 中转专题](/blog/api-middleman/)

深入了解 API 中转站：
- 什么是 API 中转站？作用与价值
- API 中转 vs 官方 API：如何选择
- 如何选择可靠的 API 中转站
- 接入经验与最佳实践

</div>

---

## 👥 适合哪些人使用

| 用户类型 | 适用场景 |
|----------|----------|
| Claude API 开发者 | 需要将 Claude 集成到应用或服务中 |
| AI 应用开发者 | 构建基于 Claude 的 AI 产品 |
| 独立站长 | 运营需要 AI 能力的网站或工具 |
| 自动化办公用户 | 使用 Claude 进行文档处理、内容生成 |
| 企业模型接入团队 | 在企业环境中部署 Claude API |
| 长文本处理开发者 | 需要处理长文档、代码分析等任务 |

---

## 💡 为什么选择 Claude API

Claude API 在以下场景表现出色：

### 📄 长文本处理
- 支持 200K+ 超长上下文
- 适合文档分析、报告总结
- 长文档理解能力出色

### ✍️ 严谨写作
- 输出风格克制、专业
- 适合商务文案和技术文档
- 结构化输出能力强

### 💻 代码分析
- 擅长代码解释与 Bug 分析
- 提供重构建议
- 支持多种编程语言

### 🏢 企业知识处理
- 知识库问答
- 合规内容审核
- 企业文档理解

---

## 🔧 快速接入示例

```python
from openai import OpenAI

# 使用 OpenAI SDK 接入 Claude API
client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://jeniya.cn/v1"
)

response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[
        {"role": "user", "content": "你好，请介绍一下你自己。"}
    ]
)

print(response.choices[0].message.content)
```

> 💡 **提示**：平台兼容 OpenAI 格式，只需修改 `base_url` 即可完成迁移。

---

## ⚠️ 免责声明

本站仅提供 Claude API 中转站、Claude API 调用教程、模型价格及相关信息整理与经验分享，不代表任何平台官方立场。

---

<style>
.quick-links table,
.topic-nav {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 16px;
  margin: 16px 0;
}

.quick-links td {
  padding: 8px 12px;
}

.topic-nav h3 {
  margin-top: 24px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid var(--vp-c-divider);
}

.topic-nav p {
  color: var(--vp-c-text-2);
  margin: 8px 0;
}
</style>
