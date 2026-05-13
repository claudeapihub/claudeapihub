---
title: Claude API 接入文档
description: Claude API 接入文档，包括接口地址、请求格式、参数说明、代码示例和常见问题，帮助开发者快速完成 Claude API 接入。
---

# Claude API 接入文档

本文档提供 Claude API 的完整接入指南，包括接口地址、请求格式、参数说明和代码示例。

> 🚀 Claude API 平台地址：<https://jeniya.cn>

---

## 快速开始

### 第一步：获取 API Key

1. 访问平台地址注册账号
2. 在控制台获取 API Key
3. 妥善保管您的 API Key

### 第二步：了解接口地址

```
Base URL: https://jeniya.cn/v1
Chat 接口: https://jeniya.cn/v1/chat/completions
```

### 第三步：发送第一个请求

```python
from openai import OpenAI

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

---

## 接口兼容性

::: tip 兼容 OpenAI 格式
本平台完全兼容 OpenAI API 格式，您可以：
- 直接使用 OpenAI SDK
- 无需学习新接口
- 只需修改 base_url 即可迁移
:::

### 使用 OpenAI SDK

```python
from openai import OpenAI

# 只需修改 base_url
client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://jeniya.cn/v1"  # 指向中转站
)

# 其余代码无需修改
response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[
        {"role": "user", "content": "你好"}
    ]
)
```

---

## 请求示例

### Python 示例

```python
import requests
import json

url = "https://jeniya.cn/v1/chat/completions"
api_key = "YOUR_API_KEY"

payload = {
    "model": "claude-sonnet-4-6",
    "messages": [
        {
            "role": "system",
            "content": "你是一个专业的 AI 助手。"
        },
        {
            "role": "user",
            "content": "请解释一下什么是机器学习？"
        }
    ],
    "temperature": 0.7,
    "max_tokens": 500
}

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {api_key}"
}

response = requests.post(url, json=payload, headers=headers, timeout=60)
result = response.json()

print(result["choices"][0]["message"]["content"])
```

### cURL 示例

```bash
curl -X POST https://jeniya.cn/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "claude-sonnet-4-6",
    "messages": [
      {"role": "user", "content": "你好"}
    ],
    "max_tokens": 100
  }'
```

### Node.js 示例

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://jeniya.cn/v1'
});

async function main() {
  const response = await client.chat.completions.create({
    model: 'claude-sonnet-4-6',
    messages: [
      { role: 'user', content: '你好，请介绍一下你自己。' }
    ]
  });

  console.log(response.choices[0].message.content);
}

main();
```

---

## 参数说明

### 必填参数

| 参数 | 类型 | 说明 | 示例 |
|-----|------|------|------|
| `model` | string | 模型名称 | `"claude-sonnet-4-6"` |
| `messages` | array | 消息数组 | `[{"role": "user", "content": "..."}]` |

### 可选参数

| 参数 | 类型 | 默认值 | 说明 |
|-----|------|-------|------|
| `temperature` | float | 0.7 | 输出随机性，范围 0-2 |
| `max_tokens` | int | 自动 | 最大输出 Token 数 |
| `top_p` | float | 1 | 核采样参数 |
| `stream` | bool | false | 是否流式输出 |
| `stop` | array | - | 停止词列表 |
| `presence_penalty` | float | 0 | 存在惩罚，范围 -2 到 2 |
| `frequency_penalty` | float | 0 | 频率惩罚，范围 -2 到 2 |

### 参数详解

#### temperature（温度）

控制输出的随机性和创造性：

| 值 | 效果 | 适用场景 |
|---|------|---------|
| 0.0 - 0.3 | 保守、稳定 | 代码生成、数据分析 |
| 0.4 - 0.7 | 平衡 | 常规对话、内容创作 |
| 0.8 - 1.0 | 创造、多样 | 创意写作、头脑风暴 |

```python
# 稳定输出（适合代码、分析）
temperature=0.2

# 平衡输出（适合常规对话）
temperature=0.7

# 创造性输出（适合创意写作）
temperature=0.9
```

#### max_tokens（最大输出长度）

控制模型输出的最大长度：

```python
# 简短回答
max_tokens=100

# 中等长度
max_tokens=500

# 长输出
max_tokens=2000
```

#### stream（流式输出）

启用流式输出以获得更好的用户体验：

```python
stream = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": "写一首诗"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

---

## 支持的模型

| 模型 | 说明 | 推荐场景 |
|-----|------|---------|
| `claude-opus-4-7` | Opus 系列最新模型 | 复杂推理任务 |
| `claude-opus-4-6` | Opus 系列主力模型 | 高质量内容 |
| `claude-sonnet-4-6` | Sonnet 系列主力模型 | 大多数业务场景 |
| `claude-sonnet-4-5-20250929` | Sonnet 系列模型 | 平衡选择 |
| `claude-haiku-4-5-20251001` | Haiku 系列轻量模型 | 快速响应 |

完整模型列表请查看 [支持模型列表](/models.html)。

---

## 响应格式

### 成功响应

```json
{
  "id": "chatcmpl-xxx",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "claude-sonnet-4-6",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "回答内容..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 50,
    "total_tokens": 70
  }
}
```

### 错误响应

```json
{
  "error": {
    "message": "错误信息描述",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
```

---

## 流式输出

### 基础流式输出

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://jeniya.cn/v1"
)

stream = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[
        {"role": "user", "content": "写一首关于春天的诗"}
    ],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

### 异步流式输出

```python
import asyncio
from openai import AsyncOpenAI

async def stream_chat():
    client = AsyncOpenAI(
        api_key="YOUR_API_KEY",
        base_url="https://jeniya.cn/v1"
    )

    stream = await client.chat.completions.create(
        model="claude-sonnet-4-6",
        messages=[{"role": "user", "content": "你好"}],
        stream=True
    )

    async for chunk in stream:
        if chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="", flush=True)

asyncio.run(stream_chat())
```

---

## 错误处理

### 常见错误码

| 错误码 | 说明 | 处理方法 |
|-------|------|---------|
| `400` | 请求参数错误 | 检查请求格式和参数 |
| `401` | 鉴权失败 | 检查 API Key 是否正确 |
| `403` | 权限不足 | 检查账号权限 |
| `404` | 模型不存在 | 检查模型名称 |
| `429` | 请求频率过高 | 降低请求频率或重试 |
| `500` | 服务器错误 | 稍后重试 |

### 错误处理示例

```python
import time
from openai import OpenAI, APIError, RateLimitError, APIConnectionError

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://jeniya.cn/v1"
)

def call_with_retry(messages, max_retries=3):
    """带重试机制的调用"""
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="claude-sonnet-4-6",
                messages=messages,
                timeout=60
            )
            return response
        
        except RateLimitError:
            if attempt < max_retries - 1:
                wait_time = 2 ** attempt  # 指数退避
                print(f"触发限流，{wait_time}秒后重试...")
                time.sleep(wait_time)
            else:
                raise Exception("请求频率过高，请稍后重试")
        
        except APIConnectionError:
            if attempt < max_retries - 1:
                print(f"网络错误，重试中... ({attempt + 1}/{max_retries})")
                time.sleep(1)
            else:
                raise Exception("网络连接失败，请检查网络")
        
        except APIError as e:
            raise Exception(f"API 错误: {e.message}")

# 使用示例
try:
    response = call_with_retry([
        {"role": "user", "content": "你好"}
    ])
    print(response.choices[0].message.content)
except Exception as e:
    print(f"调用失败: {e}")
```

详细错误处理请查看 [Claude API 错误处理完整指南](/blog/claude-api/claude-api-error-handling)。

---

## 最佳实践

### 1. 设置合理的超时

```python
# 根据任务复杂度设置超时
response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=messages,
    timeout=60  # 简单任务
    # timeout=120  # 中等复杂度
    # timeout=300  # 复杂任务
)
```

### 2. 使用 System Prompt

```python
response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[
        {
            "role": "system",
            "content": "你是一个专业的 Python 开发专家，擅长代码分析和优化建议。"
        },
        {
            "role": "user",
            "content": "请分析这段代码..."
        }
    ]
)
```

### 3. 控制输出格式

```python
response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[
        {
            "role": "user",
            "content": """
请以 JSON 格式返回分析结果，包含以下字段：
- summary: 摘要
- points: 要点列表
- conclusion: 结论
"""
        }
    ],
    temperature=0.3  # 降低随机性以获得结构化输出
)
```

### 4. 处理长对话

```python
def chat_with_history(client, messages, new_message, max_history=10):
    """维护对话历史的聊天"""
    # 添加新消息
    messages.append({"role": "user", "content": new_message})
    
    # 限制历史长度
    if len(messages) > max_history:
        messages = messages[-max_history:]
    
    # 调用 API
    response = client.chat.completions.create(
        model="claude-sonnet-4-6",
        messages=messages
    )
    
    # 添加助手回复到历史
    messages.append({
        "role": "assistant",
        "content": response.choices[0].message.content
    })
    
    return messages, response
```

---

## 相关页面

- [支持模型列表](/models.html) - 了解各模型的能力差异
- [价格说明](/pricing.html) - 了解计费方式和价格
- [常见问题 FAQ](/faq.html) - 解答常见疑问
- [Claude API 教程](/blog/claude-api/) - 深入学习 Claude API

---

## 联系支持

如有问题，请访问平台获取帮助：

<div class="action-buttons">

[前往 Claude API 平台](https://jeniya.cn){.brand}

[查看常见问题](/faq.html){.alt}

</div>

<style>
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
