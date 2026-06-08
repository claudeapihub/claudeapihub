---
title: jeniya.cn Node.js 接入教程
slug: /blog/jeniya-api/nodejs-guide.html
description: Node.js 开发者使用 jeniya.cn API 的完整指南，包括 Claude、Gemini、GPT 的接入示例。
keywords:
  - jeniya.cn Node.js 接入
  - Claude API Node.js
  - Gemini API Node.js
  - GPT API Node.js
  - API 接入示例
---

# jeniya.cn Node.js 接入教程

本教程介绍如何在 Node.js 项目中使用 jeniya.cn API。

## 安装依赖

```bash
# Claude API
npm install @anthropic-ai/sdk

# Gemini API
npm install @google/generative-ai

# OpenAI (GPT)
npm install openai
```

## Claude API 接入

### 基础调用

```javascript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: 'your_api_key',
  baseURL: 'https://api.jeniya.cn/v1'
});

const message = await client.messages.create({
  model: 'claude-sonnet-4.5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: '你好，请介绍一下你自己。' }]
});

console.log(message.content);
```

### 流式输出

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

### 带重试的调用

```javascript
import Anthropic from '@anthropic-ai/sdk';
import { setTimeout } from 'timers/promises';

const client = new Anthropic({
  apiKey: 'your_api_key',
  baseURL: 'https://api.jeniya.cn/v1'
});

async function safeCall(prompt, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const message = await client.messages.create({
        model: 'claude-sonnet-4.5',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      });
      return message.content[0].text;
    } catch (error) {
      if (error.code === 'rate_limit_exceeded') {
        console.log(`请求过快，等待 ${Math.pow(2, attempt)} 秒后重试...`);
        await setTimeout(Math.pow(2, attempt) * 1000);
      } else {
        console.error('API 错误：', error.message);
        if (attempt === maxRetries - 1) throw error;
      }
      await setTimeout(1000);
    }
  }
  return null;
}

// 使用
const result = await safeCall('分析这段代码的性能问题...');
```

## Gemini API 接入

### 基础调用

```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("your_api_key");
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  baseUrl: "https://api.jeniya.cn/google"
});

const result = await model.generateContent('写一个快速排序算法');
console.log(result.response.text());
```

### 流式输出

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

## GPT API 接入

### 基础调用

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'your_api_key',
  baseURL: 'https://api.jeniya.cn/openai/v1'
});

const response = await client.chat.completions.create({
  model: 'gpt-4.5',
  messages: [{ role: 'user', content: '写一个快速排序算法' }]
});

console.log(response.choices[0].message.content);
```

### 流式输出

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'your_api_key',
  baseURL: 'https://api.jeniya.cn/openai/v1'
});

const stream = await client.chat.completions.create({
  model: 'gpt-4.5',
  messages: [{ role: 'user', content: '写一个快速排序算法' }],
  stream: true
});

for await (const chunk of stream) {
  if (chunk.choices[0]?.delta?.content) {
    process.stdout.write(chunk.choices[0].delta.content);
  }
}
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

## Cursor 集成

在 Cursor 设置中添加自定义模型：
- Models → Add Model
- 填写 jeniya.cn API 配置信息

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