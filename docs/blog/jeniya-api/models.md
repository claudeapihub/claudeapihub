---
title: jeniya.cn 支持模型列表
slug: /blog/jeniya-api/models.html
description: jeniya.cn 支持 Claude、GPT、Gemini 等主流大模型，详细模型信息、倍率和使用场景。
keywords:
  - jeniya.cn 支持模型
  - Claude 模型列表
  - Gemini 模型列表
  - GPT 模型列表
  - 国产模型支持
---

# jeniya.cn 支持模型列表

jeniya.cn 支持多种主流大模型，覆盖 Claude、GPT、Gemini 及国产模型系列。

## Claude 系列

**接入地址：** `https://api.jeniya.cn/v1`

| 模型 | 模型 ID | 上下文 | 适用场景 | 倍率 |
|------|---------|--------|---------|------|
| Claude Opus 4.5 | claude-opus-4.5 | 200K | 复杂任务、架构设计 | 0.2x |
| Claude Sonnet 4.5 | claude-sonnet-4.5 | 200K | 日常开发、代码生成 | 0.1x |
| Claude Haiku 4.5 | claude-haiku-4.5 | 200K | 简单任务、快速响应 | 0.1x |

**推荐使用场景：**
- Opus：复杂推理、高质量写作、多步骤任务
- Sonnet：平衡方案，适合大多数应用场景
- Haiku：低成本、高频次、简单任务

## Gemini 系列

**接入地址：** `https://api.jeniya.cn/google/v1`

| 模型 | 模型 ID | 上下文 | 适用场景 | 倍率 |
|------|---------|--------|---------|------|
| Gemini 2.5 Pro | gemini-2.5-pro | 2M | 复杂推理、大型项目 | 0.15x |
| Gemini 2.5 Flash | gemini-2.5-flash | 1M | 日常开发、快速响应 | 0.05x |
| Gemini 2.5 Flash-8B | gemini-2.5-flash-8b | 1M | 代码补全、简单任务 | 0.05x |

**推荐使用场景：**
- Pro：复杂推理、大型项目、长文本处理
- Flash：通用任务、快速响应、中等复杂度
- Flash-8B：代码补全、简单任务、成本优化

## GPT 系列

**接入地址：** `https://api.jeniya.cn/openai/v1`

| 模型 | 模型 ID | 上下文 | 适用场景 | 倍率 |
|------|---------|--------|---------|------|
| GPT-4.5 | gpt-4.5 | 128K | 通用任务 | 0.2x |
| GPT-5.2-codex | gpt-5.2-codex-high | 128K | 代码生成 | 0.2x |

## 国产模型

**接入地址：** `https://api.jeniya.cn/v1`

| 模型 | 模型 ID | 适用场景 | 倍率 |
|------|---------|---------|------|
| GLM-4 | chatglm3-6b | 通用任务 | 0.08x |
| DeepSeek | deepseek-chat | 代码生成 | 0.1x |
| Qwen | qwen-max | 多语言支持 | 0.12x |

## 模型选择建议

### 代码开发场景
- **代码补全：** Gemini 2.5 Flash-8B (最便宜)
- **代码生成：** Claude Sonnet 4.5 或 GPT-5.2-codex
- **代码审查：** Claude Opus 4.5

### 内容创作场景
- **简单内容：** Gemini 2.5 Flash
- **高质量写作：** Claude Opus 4.5 或 Sonnet 4.5
- **长文创作：** Claude Opus 4.5（200K 上下文）

### 企业应用
- **问答系统：** Claude Sonnet 4.5 或 Gemini 2.5 Pro
- **文档分析：** Claude Opus 4.5
- **多语言支持：** Qwen 或 Gemini 2.5 Pro

## 倍率说明

| 倍率范围 | 说明 | 适合场景 |
|---------|------|---------|
| 0.05x - 0.1x | 特惠分组 | 高频使用、成本敏感 |
| 0.15x - 0.2x | 标准分组 | 平衡方案、常规使用 |
| 0.2x+ | 优质分组 | 高质量、生产环境 |

**注意：** 具体倍率可能随活动调整，请以控制台显示为准。

---

**国内最推荐 Claude API 中转站平台**：
> Claude API 中转站 平台地址：<https://jeniya.cn>

> Claude API 中转站 平台地址：<https://jeniya.top>

> Claude API 中转站 平台地址：<https://jeniya.chat>