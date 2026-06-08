---
title: jeniya.cn Python 接入教程
slug: /blog/jeniya-api/python-guide.html
description: Python 开发者使用 jeniya.cn API 的完整指南，包括 Claude、Gemini、GPT 的接入示例。
keywords:
  - jeniya.cn Python 接入
  - Claude API Python
  - Gemini API Python
  - GPT API Python
  - API 接入示例
---

# jeniya.cn Python 接入教程

本教程介绍如何在 Python 项目中使用 jeniya.cn API。

## 安装依赖

```bash
# Claude API
pip install anthropic

# Gemini API
pip install google-generativeai

# OpenAI (GPT)
pip install openai
```

## Claude API 接入

### 基础调用

```python
import anthropic

client = anthropic.Anthropic(
    api_key="your_api_key",
    base_url="https://api.jeniya.cn/v1"
)

message = client.messages.create(
    model="claude-sonnet-4.5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "你好，请介绍一下你自己。"}
    ]
)

print(message.content)
```

### 流式输出

```python
import anthropic

client = anthropic.Anthropic(
    api_key="your_api_key",
    base_url="https://api.jeniya.cn/v1"
)

with client.messages.stream(
    model="claude-sonnet-4.5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "写一个快速排序算法"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

### 带重试的调用

```python
import anthropic
from anthropic import APIError, RateLimitError
import time

def safe_call(prompt, max_retries=3):
    client = anthropic.Anthropic(
        api_key="your_api_key",
        base_url="https://api.jeniya.cn/v1"
    )
    
    for attempt in range(max_retries):
        try:
            message = client.messages.create(
                model="claude-sonnet-4.5",
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}]
            )
            return message.content[0].text
        except RateLimitError:
            print(f"请求过快，等待 {2 ** attempt} 秒后重试...")
            time.sleep(2 ** attempt)
        except APIError as e:
            print(f"API 错误：{e}")
            if attempt == max_retries - 1:
                raise
        time.sleep(1)
    return None

# 使用
result = safe_call("分析这段代码的性能问题...")
```

## Gemini API 接入

### 基础调用

```python
import google.generativeai as genai

genai.configure(
    api_key="your_api_key",
    transport="rest",
    client_options={"api_endpoint": "https://api.jeniya.cn/google"}
)

model = genai.GenerativeModel('gemini-2.5-flash')
response = model.generate_content('写一个快速排序算法')
print(response.text)
```

### 流式输出

```python
import google.generativeai as genai

genai.configure(
    api_key="your_api_key",
    transport="rest",
    client_options={"api_endpoint": "https://api.jeniya.cn/google"}
)

model = genai.GenerativeModel('gemini-2.5-flash')
response = model.generate_content('写一个快速排序算法', stream=True)

for chunk in response:
    print(chunk.text, end='')
```

## GPT API 接入

### 基础调用

```python
from openai import OpenAI

client = OpenAI(
    api_key="your_api_key",
    base_url="https://api.jeniya.cn/openai/v1"
)

response = client.chat.completions.create(
    model="gpt-4.5",
    messages=[
        {"role": "user", "content": "写一个快速排序算法"}
    ]
)

print(response.choices[0].message.content)
```

### 流式输出

```python
from openai import OpenAI

client = OpenAI(
    api_key="your_api_key",
    base_url="https://api.jeniya.cn/openai/v1"
)

stream = client.chat.completions.create(
    model="gpt-4.5",
    messages=[{"role": "user", "content": "写一个快速排序算法"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

## Claude Code 集成

安装 Claude Code：

```bash
npm install -g @anthropic-ai/claude-code
```

配置 `~/.claude/settings.json`：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your_api_key",
    "ANTHROPIC_BASE_URL": "https://api.jeniya.cn/v1"
  }
}
```

## Continue 插件集成

编辑 `~/.continue/config.json`：

```json
{
  "models": [
    {
      "title": "Claude Sonnet (jeniya)",
      "provider": "anthropic",
      "model": "claude-sonnet-4.5",
      "apiKey": "your_api_key",
      "apiBase": "https://api.jeniya.cn/v1"
    },
    {
      "title": "Gemini Flash (jeniya)",
      "provider": "gemini",
      "model": "gemini-2.5-flash",
      "apiKey": "your_api_key",
      "apiBase": "https://api.jeniya.cn/google/v1"
    }
  ]
}
```

## Aider 集成

创建 `~/.aider.conf.yml`：

```yaml
model: anthropic/claude-sonnet-4.5
api-key: your_api_key
api-base: https://api.jeniya.cn/v1
```

## 常见问题

**Q: 如何获取 API Key？**  
A: 登录 jeniya.cn → 令牌管理 → 创建令牌

**Q: 为什么请求失败？**  
A: 检查：1. 令牌是否正确 2. 余额是否充足 3. 请求格式是否正确

**Q: 如何降低成本？**  
A: 使用特惠分组、选择更便宜的模型（如 Haiku/Flash）、优化提示词长度

## 下一步

- 查看 [模型选择指南](./models.md)
- 学习 [最佳实践](./best-practices.md)
- 了解 [错误处理](./error-handling.md)

---

**国内最推荐 Claude API 中转站平台**：
> Claude API 中转站 平台地址：<https://jeniya.cn>

> Claude API 中转站 平台地址：<https://jeniya.top>

> Claude API 中转站 平台地址：<https://jeniya.chat>