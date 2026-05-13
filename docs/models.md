---
title: Claude 模型列表
description: 查看 Claude API 支持的模型列表，包括 Claude Opus、Sonnet、Haiku 等模型的能力说明、适用场景和选择建议。
---

# Claude 模型列表

我们提供 Claude 系列 API 中转服务，支持 Claude Opus、Sonnet、Haiku 等多个版本，兼容 OpenAI 格式，方便开发者使用统一方式完成接入、调用与切换。

> 🚀 Claude API 平台地址：<https://jeniya.cn>

## 接口兼容性

本平台默认兼容 OpenAI 格式，开发者通常可以沿用常见的 OpenAI SDK、请求结构和调用习惯完成接入。

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://jeniya.cn/v1"
)
```

---

## 支持的 Claude 模型

### 🏆 Claude Opus 系列

Claude Opus 是 Claude 系列中能力最强的模型，适合高复杂度任务。

<div class="model-card">

| 项目 | 说明 |
|------|------|
| **模型名称** | claude-opus-4-7、claude-opus-4-6、claude-opus-4-6-thinking |
| **定位** | 能力最强的旗舰模型 |
| **上下文** | 支持 200K+ 超长上下文 |
| **价格** | 相对较高，能力最强 |

**适合场景：**
- 复杂推理和多步分析
- 高价值内容生成
- 专业文档撰写
- 复杂代码理解与分析
- 研究型任务
- 需要深度思考的决策支持

**模型特点：**
- 推理能力最强
- 理解和分析能力出色
- 适合对质量要求极高的任务

</div>

---

### ⚖️ Claude Sonnet 系列

Claude Sonnet 是 Claude 系列的主力模型，在能力、速度、成本之间取得最佳平衡。

<div class="model-card">

| 项目 | 说明 |
|------|------|
| **模型名称** | claude-sonnet-4-6、claude-sonnet-4-5-20250929、claude-sonnet-4-6-thinking |
| **定位** | 能力与成本的最佳平衡 |
| **上下文** | 支持 200K+ 超长上下文 |
| **价格** | 适中，性价比最高 |

**适合场景：**
- 大多数主流业务场景
- 长文本处理和总结
- 代码分析和开发辅助
- 内容创作和技术文档
- 企业知识问答
- 客服机器人

**模型特点：**
- 能力、速度、成本平衡最佳
- 长文本处理能力强
- 大多数项目的默认选择

</div>

---

### ⚡ Claude Haiku 系列

Claude Haiku 是 Claude 系列中的轻量级模型，主打速度快、成本低。

<div class="model-card">

| 项目 | 说明 |
|------|------|
| **模型名称** | claude-haiku-4-5-20251001 |
| **定位** | 快速响应的轻量模型 |
| **上下文** | 支持长上下文 |
| **价格** | 最低，成本最优 |

**适合场景：**
- 快速问答
- 简单文本处理
- 轻量客服场景
- 高频批量任务
- 成本敏感型业务
- 实时响应场景

**模型特点：**
- 响应速度最快
- 调用成本最低
- 适合大量基础任务

</div>

---

## 模型选择建议

### 如果你是新手

**推荐从 Claude Sonnet 开始**

```
推荐模型：claude-sonnet-4-6
```

理由：
- 能力覆盖面广
- 大多数场景都适用
- 后续可根据需要升级或降级

### 如果你要控制成本

**推荐使用 Claude Haiku**

```
推荐模型：claude-haiku-4-5-20251001
```

适合场景：
- 简单任务处理
- 高频调用场景
- 对质量要求不高的场景

### 如果你要最高质量

**推荐使用 Claude Opus**

```
推荐模型：claude-opus-4-6
```

适合场景：
- 复杂推理任务
- 高价值内容生成
- 专业级输出需求

---

## 模型能力对比

| 维度 | Haiku | Sonnet | Opus |
|-----|:-----:|:------:|:----:|
| 推理能力 | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 响应速度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 成本优势 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| 长文本处理 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 代码分析 | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 创意写作 | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 稳定性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 使用建议

### 模型分层调用

```python
def get_model_for_task(task_type: str) -> str:
    """根据任务类型选择合适的模型"""
    model_mapping = {
        # 简单任务用 Haiku
        "simple_qa": "claude-haiku-4-5-20251001",
        "classification": "claude-haiku-4-5-20251001",
        
        # 主流任务用 Sonnet
        "analysis": "claude-sonnet-4-6",
        "summary": "claude-sonnet-4-6",
        "code_review": "claude-sonnet-4-6",
        
        # 关键任务用 Opus
        "complex_reasoning": "claude-opus-4-6",
        "high_value_content": "claude-opus-4-6"
    }
    return model_mapping.get(task_type, "claude-sonnet-4-6")
```

### 成本优化策略

| 策略 | 说明 |
|------|------|
| 简单任务用 Haiku | 快速问答、简单分类，成本最低 |
| 主流任务用 Sonnet | 长文本处理、代码分析，性价比最高 |
| 关键任务用 Opus | 复杂推理、高价值内容，质量最优 |

---

## 模型切换示例

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://jeniya.cn/v1"
)

# 使用 Sonnet 进行常规对话
response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[
        {"role": "user", "content": "分析这段代码的逻辑..."}
    ]
)

# 使用 Opus 进行复杂推理
response = client.chat.completions.create(
    model="claude-opus-4-6",
    messages=[
        {"role": "user", "content": "请深入分析这个复杂问题..."}
    ]
)

# 使用 Haiku 进行快速问答
response = client.chat.completions.create(
    model="claude-haiku-4-5-20251001",
    messages=[
        {"role": "user", "content": "什么是 Python？"}
    ]
)
```

---

## 说明

::: tip 注意
- 支持模型会随着上游渠道和平台策略动态调整
- 不同模型的价格、上下文长度和能力可能不同
- 具体可用模型请以平台后台实时展示为准
:::

---

## 相关页面

- [价格说明](/pricing.html) - 了解各模型的详细价格
- [API 接入文档](/docs.html) - 查看完整的接入指南
- [常见问题 FAQ](/faq.html) - 解答常见疑问
- [Claude API 教程](/blog/claude-api/) - 深入学习 Claude API

---

## 开始使用

如果你已经准备好接入 Claude API，可以直接前往平台查看：

<div class="action-buttons">

[前往 Claude API 平台](https://jeniya.cn){.brand}

[查看接入文档](/docs.html){.alt}

</div>

<style>
.model-card {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider);
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.action-buttons a {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.action-buttons a.brand {
  background: linear-gradient(135deg, #cf6e49 0%, #d4a574 100%);
  color: white;
}

.action-buttons a.brand:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(207, 110, 73, 0.3);
}

.action-buttons a.alt {
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.action-buttons a.alt:hover {
  border-color: #cf6e49;
  color: #cf6e49;
}
</style>
