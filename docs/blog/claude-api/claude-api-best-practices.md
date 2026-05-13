---
title: Claude API 最佳实践：提示词优化与成本控制
slug: /blog/claude-api/claude-api-best-practices.html
description: Claude API 最佳实践指南，包括提示词优化技巧、成本控制策略、长文本处理方案、错误处理与重试机制，帮助你更高效地使用 Claude API。
keywords:
  - Claude API 最佳实践
  - Claude 提示词优化
  - Claude 成本控制
  - Claude API 优化
---

# Claude API 最佳实践：提示词优化与成本控制

成功接入 Claude API 只是第一步，如何**高效、稳定、经济**地使用才是关键。

这篇文章分享 Claude API 的实战经验，帮助你：

- 设计更有效的提示词
- 控制调用成本
- 处理长文本场景
- 建立稳定的错误处理机制

---

## 提示词优化技巧

Claude 对提示词的遵循度较高，好的提示词能显著提升输出质量。

### 1. 明确角色设定

在 `system` 消息中明确定义 AI 的角色和行为规范。

```python
messages=[
    {
        "role": "system",
        "content": """你是一位专业的技术文档撰写专家，请遵循以下原则：
1. 使用清晰、简洁的专业语言
2. 结构化输出，使用标题和列表
3. 给出具体示例和代码片段
4. 避免模糊和不确定的表述"""
    },
    {
        "role": "user",
        "content": "请解释什么是 RESTful API"
    }
]
```

### 2. 明确输出格式

告诉 Claude 你需要什么样的输出结构。

```python
{
    "role": "user",
    "content": """请分析以下代码，按以下格式输出：

## 功能概述
（一句话说明功能）

## 主要逻辑
（列出关键步骤）

## 潜在问题
- 问题1：描述
- 问题2：描述

## 优化建议
1. 建议1
2. 建议2"""
}
```

### 3. 提供示例

对于复杂任务，提供示例能显著提升一致性。

```python
{
    "role": "user",
    "content": """请将以下产品描述改写为营销文案。

示例输入：一款降噪耳机，续航30小时
示例输出：沉浸式聆听体验，30小时超长续航，让音乐陪伴你的每一刻。

请改写：一款智能手表，支持心率监测"""
}
```

### 4. 分步引导

对于复杂任务，可以拆分为多个步骤。

```python
{
    "role": "user",
    "content": """请按以下步骤完成任务：
1. 首先总结文章核心观点
2. 然后列出支撑论据
3. 最后给出你的评价和建议"""
}
```

### 5. 控制输出风格

```python
{
    "role": "system",
    "content": """你的回答应该：
- 语气：专业、客观
- 长度：控制在 300 字以内
- 格式：使用 Markdown 格式
- 风格：避免营销性语言"""
}
```

---

## 成本控制策略

### 1. 合理设置 max_tokens

```python
# 简短回答
max_tokens=100-300

# 中等长度内容
max_tokens=500-1000

# 长文本输出
max_tokens=1500-3000
```

**建议**：根据实际需要设置，避免过大的 `max_tokens` 导致成本浪费。

### 2. 精简输入内容

- 去除不必要的信息
- 提前做文本摘要
- 只传递关键内容

```python
# 不推荐：传递完整文档
full_text = "..." # 几万字的长文档

# 推荐：先提取关键部分
key_sections = extract_key_sections(full_text)
prompt = f"请分析以下核心内容：\n{key_sections}"
```

### 3. 模型分层调用

根据任务复杂度选择不同模型：

```python
def get_model_for_task(task_type: str) -> str:
    if task_type in ["simple_qa", "classification"]:
        return "claude-haiku-4-5-20251001"
    elif task_type in ["analysis", "writing"]:
        return "claude-sonnet-4-6"
    else:  # complex_reasoning
        return "claude-opus-4-6"
```

### 4. 缓存常见结果

对于重复性问题，建立缓存机制：

```python
import hashlib

def get_cached_response(prompt: str):
    cache_key = hashlib.md5(prompt.encode()).hexdigest()
    if cache_key in cache:
        return cache[cache_key]
    # 调用 API 并缓存
    response = call_claude_api(prompt)
    cache[cache_key] = response
    return response
```

### 5. 批量处理优化

```python
# 不推荐：逐个处理
for item in items:
    response = call_api(item)

# 推荐：合并处理
batch_prompt = "\n---\n".join(items)
response = call_api(f"请分别处理以下内容：\n{batch_prompt}")
```

---

## 长文本处理方案

Claude 擅长长文本处理，但需要合理设计。

### 1. 分段处理策略

```python
def process_long_document(document: str, chunk_size: int = 10000):
    chunks = [document[i:i+chunk_size] for i in range(0, len(document), chunk_size)]
    
    summaries = []
    for chunk in chunks:
        summary = call_claude_api(
            f"请总结以下内容的核心要点：\n{chunk}",
            model="claude-sonnet-4-6",
            max_tokens=200
        )
        summaries.append(summary)
    
    # 汇总所有摘要
    final_summary = call_claude_api(
        f"请整合以下摘要，生成完整总结：\n{' '.join(summaries)}"
    )
    return final_summary
```

### 2. 上下文管理

```python
class ConversationManager:
    def __init__(self, max_context_length: int = 50000):
        self.messages = []
        self.max_context_length = max_context_length
    
    def add_message(self, role: str, content: str):
        self.messages.append({"role": role, "content": content})
        self._trim_context()
    
    def _trim_context(self):
        # 超出长度时，移除较早的消息
        while self._estimate_tokens() > self.max_context_length:
            if len(self.messages) > 1:
                self.messages.pop(0)
            else:
                break
    
    def _estimate_tokens(self):
        # 粗略估算 token 数量
        return sum(len(m["content"]) for m in self.messages) // 4
```

### 3. 提示词长度控制

```python
def truncate_prompt(prompt: str, max_length: int = 100000):
    if len(prompt) > max_length:
        return prompt[:max_length] + "\n\n[内容已截断...]"
    return prompt
```

---

## 错误处理与重试机制

### 1. 指数退避重试

```python
import time
import random

def call_with_retry(func, max_retries: int = 3):
    for attempt in range(max_retries):
        try:
            return func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise e
            
            # 指数退避
            wait_time = (2 ** attempt) + random.random()
            time.sleep(wait_time)
```

### 2. 错误分类处理

```python
def handle_api_error(error):
    error_str = str(error)
    
    if "401" in error_str or "unauthorized" in error_str.lower():
        return "鉴权失败，请检查 API Key"
    
    elif "429" in error_str or "rate limit" in error_str.lower():
        return "请求频率过高，请稍后重试"
    
    elif "timeout" in error_str.lower():
        return "请求超时，请检查网络或减少输入长度"
    
    elif "model" in error_str.lower() and "not found" in error_str.lower():
        return "模型不存在，请检查模型名称"
    
    else:
        return f"未知错误：{error_str}"
```

### 3. 超时设置

```python
# 为不同场景设置不同超时
TIMEOUT_SHORT = 30    # 简单任务
TIMEOUT_MEDIUM = 60   # 中等任务
TIMEOUT_LONG = 120    # 复杂任务

response = requests.post(
    url,
    json=payload,
    headers=headers,
    timeout=TIMEOUT_MEDIUM
)
```

---

## 性能优化建议

### 1. 并发控制

```python
from concurrent.futures import ThreadPoolExecutor, as_completed

def batch_call(prompts: list, max_workers: int = 5):
    results = []
    
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(call_api, p): p for p in prompts}
        
        for future in as_completed(futures):
            try:
                results.append(future.result())
            except Exception as e:
                print(f"Error: {e}")
    
    return results
```

### 2. 流式输出

对于长输出，使用流式响应提升用户体验：

```python
def stream_response(prompt: str):
    with client.messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    ) as stream:
        for text in stream.text_stream:
            yield text
```

---

## 总结

### 提示词优化要点

- 明确角色和输出格式
- 提供示例和分步引导
- 控制输出风格

### 成本控制要点

- 合理设置 `max_tokens`
- 精简输入内容
- 模型分层调用
- 建立缓存机制

### 错误处理要点

- 实现指数退避重试
- 分类处理不同错误
- 设置合理的超时

---

## 相关阅读

- [Claude API 如何调用？Python 接入示例与参数说明](/blog/claude-api/claude-api-python-guide)
- [Claude 模型版本对比：Haiku vs Sonnet vs Opus 如何选择](/blog/claude-api/claude-models-comparison)
- [Claude API 错误处理完整指南](/blog/claude-api/claude-api-error-handling)
- [价格说明](/pricing)

---
