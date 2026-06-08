---
title: jeniya.cn 流式输出完整指南
slug: /blog/jeniya-api/streaming-guide.html
description: jeniya.cn API 流式输出完整指南，提升用户体验的实时响应方案。
keywords:
  - jeniya.cn 流式输出
  - 流式输出教程
  - 实时响应方案
  - Python 流式
  - Node.js 流式
---

# jeniya.cn 流式输出完整指南

流式输出（Streaming）可以让你在生成结果时实时显示，而不是等待全部生成完成后再显示。这对于提升用户体验非常重要。

## 为什么需要流式输出？

**传统模式的问题：**
- 用户需要等待完整结果才能看到任何输出
- 长文本生成时等待时间长
- 用户体验差，感觉应用无响应

**流式输出的优势：**
- 实时显示生成进度
- 用户体验更好
- 感觉应用响应更快
- 可以显示打字效果

## Python 流式输出

### Claude API 流式输出

```python
import anthropic

client = anthropic.Anthropic(
    api_key="your_api_key",
    base_url="https://api.jeniya.cn/v1"
)

# 使用 stream 方法
with client.messages.stream(
    model="claude-sonnet-4.5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "写一个快速排序算法"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

**注意：** `flush=True` 很重要，可以确保内容立即显示。

### Gemini API 流式输出

```python
import google.generativeai as genai

genai.configure(
    api_key="your_api_key",
    transport="rest",
    client_options={"api_endpoint": "https://api.jeniya.cn/google"}
)

model = genai.GenerativeModel('gemini-2.5-flash')

# 流式输出
response = model.generate_content('写一个快速排序算法', stream=True)

for chunk in response:
    print(chunk.text, end='')
```

## Node.js 流式输出

### Claude API 流式输出

```javascript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: 'your_api_key',
  baseURL: 'https://api.jeniya.cn/v1'
});

const stream = await client.messages.stream({
  model: 'claude-sonnet-4.5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: '写一个快速排序算法' }]
});

for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta') {
    process.stdout.write(chunk.delta.text);
  }
}
```

### Gemini API 流式输出

```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("your_api_key");
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  baseUrl: "https://api.jeniya.cn/google"
});

const result = await model.generateContentStream('写一个快速排序算法');
for await (const chunk of result.stream) {
  process.stdout.write(chunk.text());
}
```

## REST API 流式输出

### 使用 curl

```bash
# Claude API
curl https://api.jeniya.cn/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: streams-2024-05-15" \
  -d '{
    "model": "claude-sonnet-4.5",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "写一个快速排序算法"}],
    "stream": true
  }' | while IFS= read -r line; do
    if [[ $line == "data:"* ]]; then
      echo $line | sed 's/^data: //' | jq -r '.delta.text // empty' 
    fi
  done
```

### 使用 fetch (浏览器)

```javascript
async function streamClaudeMessage(prompt) {
  const response = await fetch('https://api.jeniya.cn/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'your_api_key',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4.5',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
      stream: true
    })
  });

  if (!response.body) {
    throw new Error('Response body is null');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(line => line.trim() !== '');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        
        try {
          const parsed = JSON.parse(data);
          if (parsed.delta?.text) {
            process.stdout.write(parsed.delta.text);
          }
        } catch (e) {
          // 忽略解析错误
        }
      }
    }
  }
}
```

## Web 前端实现

### 基础流式显示

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>流式输出示例</title>
  <style>
    #output {
      white-space: pre-wrap;
      font-family: monospace;
      padding: 20px;
      background: #f5f5f5;
      border-radius: 8px;
      min-height: 200px;
    }
  </style>
</head>
<body>
  <button id="generate">生成内容</button>
  <div id="output"></div>

  <script>
    async function streamResponse() {
      const outputDiv = document.getElementById('output');
      outputDiv.textContent = '生成中...';
      
      const response = await fetch('https://api.jeniya.cn/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'your_api_key'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4.5',
          max_tokens: 1024,
          messages: [{ role: 'user', content: '写一个简单的 Hello World 程序' }],
          stream: true
        })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.delta?.text) {
                fullText += parsed.delta.text;
                outputDiv.textContent = fullText;
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    }

    document.getElementById('generate').addEventListener('click', streamResponse);
  </script>
</body>
</html>
```

### 带打字效果的流式显示

```javascript
class Typewriter {
  constructor(element, speed = 30) {
    this.element = element;
    this.speed = speed;
    this.text = '';
    this.timer = null;
  }

  start(newText) {
    this.text = '';
    this.element.textContent = '';
    this.processText(newText);
  }

  processText(text) {
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      setTimeout(() => {
        this.element.textContent += lines[i];
        if (i < lines.length - 1) {
          this.element.textContent += '\n';
        }
      }, i * 500); // 每行延迟
    }
  }
}

// 使用
const outputDiv = document.getElementById('output');
const typewriter = new Typewriter(outputDiv);

// 在流式输出中使用
typewriter.start(fullText);
```

## 最佳实践

### 1. ���示生成进度

```python
# Python
with client.messages.stream(...) as stream:
    total_tokens = 0
    for event in stream:
        if hasattr(event, 'usage'):
            total_tokens = event.usage.output_tokens
        print(f"\r生成中... {total_tokens} tokens", end="", flush=True)
```

### 2. 错误处理

```javascript
try {
  const stream = await client.messages.stream({...});
  for await (const chunk of stream) {
    // 处理数据
  }
} catch (error) {
  console.error('流式输出错误:', error);
  // 显示错误信息
  outputDiv.textContent = '生成失败，请重试';
}
```

### 3. 取消请求

```javascript
const controller = new AbortController();

// 取消按钮
document.getElementById('cancel').addEventListener('click', () => {
  controller.abort();
  console.log('请求已取消');
});

const response = await fetch(url, {
  signal: controller.signal,
  // ... 其他配置
});
```

### 4. 性能优化

```python
# 使用生成器避免内存占用
def stream_generator(stream):
    for text in stream.text_stream:
        yield text

# 逐步处理
for text in stream_generator(stream):
    process(text)  # 实时处理，无需等待全部完成
```

## 注意事项

1. **流式输出仍然会产生完整费用**
   - 虽然你可以实时显示，但费用计算基于完整输出

2. **确保网络稳定**
   - 流式输出需要保持连接
   - 不稳定的网络可能导致中断

3. **处理部分数据**
   - 流式数据可能是不完整的
   - 需要正确处理边界情况

4. **用户体验**
   - 添加加载动画或提示
   - 提供取消操作
   - 显示生成状态

## 下一步

- 查看 [Python 接入指南](./python-guide.md)
- 查看 [Node.js 接入指南](./nodejs-guide.md)
- 学习 [最佳实践](./best-practices.md)

---

**国内最推荐 Claude API 中转站平台**：
> Claude API 中转站 平台地址：<https://jeniya.cn>

> Claude API 中转站 平台地址：<https://jeniya.top>

> Claude API 中转站 平台地址：<https://jeniya.chat>