---
title: jeniya.cn API 中转服务完整指南
description: jeniya.cn 是专业的 AI API 中转服务平台，本指南将帮助您快速上手，从注册到使用，涵盖所有常见场景和问题。
---

# jeniya.cn API 中转服务完整指南

jeniya.cn 是专业的 AI API 中转服务平台，为开发者提供稳定、高效、经济的 AI 模型访问方案。

## 📋 目录

- [什么是 jeniya.cn](#什么是-jeniyacn)
- [快速开始](#快速开始)
- [模型支持](#模型支持)
- [使用教程](#使用教程)
- [开发工具集成](#开发工具集成)
- [常见问题](#常见问题)
- [最佳实践](#最佳实践)

---

## 什么是 jeniya.cn

jeniya.cn 是一个专业的 AI API 中转服务平台，为开发者提供稳定、高效、经济的 AI 模型访问方案。

### 核心优势

**🚀 稳定可靠**
- 国内直连，无需代理
- 99.9% 服务可用性
- 多节点负载均衡
- 智能故障切换

**💰 价格优惠**
- 0.05x - 0.3x 官方倍率
- 按量计费，用多少付多少
- 新用户体验额度
- 无隐藏费用

**🔧 易于集成**
- 完全兼容官方 API
- 支持主流开发语言
- 详细的接入文档
- 活跃的社区支持

**📊 透明管理**
- 实时用量统计
- 详细的调用记录
- 余额预警提醒
- 多令牌管理

### 支持的模型

| 模型系列 | 包含模型 | 倍率范围 |
|---------|---------|---------|
| **Claude** | Opus 4.5, Sonnet 4.5, Haiku 4.5 | 0.1x - 0.2x |
| **GPT** | GPT-4.5, GPT-5.2-codex | 0.15x - 0.25x |
| **Gemini** | 2.5 Pro, 2.5 Flash, 2.5 Flash-8B | 0.05x - 0.15x |
| **国产模型** | GLM-4, DeepSeek, Qwen | 0.08x - 0.2x |

---

## 快速开始

### 第一步：注册账号

1. 访问 [jeniya.cn](https://jeniya.cn)
2. 点击右上角"注册"按钮
3. 填写邮箱和密码
4. 验证邮箱
5. 完成注册

**新用户福利：**
- 注册即送 ¥10 体验额度
- 首次充值额外赠送 10%

### 第二步：充值

1. 登录后进入"充值"页面
2. 选择充值金额
3. 支持支付宝、微信支付
4. 到账即时

**充值建议：**
- 首次充值：¥20-50（测试使用）
- 日常开发：¥50-100/月
- 重度使用：¥100-200/月

### 第三步：创建令牌

1. 进入"令牌管理"页面
2. 点击"创建令牌"
3. 填写令牌信息：
   - **名称**：便于识别（如：claude-daily）
   - **分组**：选择模型分组
   - **备注**：可选
4. 点击"创建"
5. 复制保存令牌（只显示一次）

**令牌分组说明：**

```yaml
Claude 特惠分组 (0.1x):
- 适合：日常开发
- 稳定性：良好
- 推荐模型：Sonnet 4.5

Claude 稳定分组 (0.15x):
- 适合：生产环境
- 稳定性：优秀
- 推荐模型：Opus 4.5

Gemini 特惠分组 (0.05x):
- 适合：高频使用
- 稳定性：良好
- 推荐模型：2.5 Flash

GPT 特惠分组 (0.2x):
- 适合：备用方案
- 稳定性：优秀
- 推荐模型：5.2-codex
```

### 第四步：测试调用

**使用 curl 测试：**

```bash
# Claude API 测试
curl https://api.jeniya.cn/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: 你的令牌" \
  -H "anthropic-version: 2023-06-01" \
  -d '{"model": "claude-sonnet-4.5","max_tokens": 1024,"messages": [{"role": "user", "content": "你好"}]}'

# Gemini API 测试
curl https://api.jeniya.cn/google/v1/models/gemini-2.5-flash:generateContent \
  -H "Content-Type: application/json" \
  -H "x-api-key: 你的令牌" \
  -d '{"contents": [{"parts": [{"text": "你好"}]}]}'
```

**看到正常响应即表示配置成功！**

---

## 模型支持

### Claude 系列

**接入地址：** `https://api.jeniya.cn/v1`

**支持模型：**

| 模型 | 模型 ID | 上下文 | 适用场景 |
|------|---------|--------|---------|
| Claude Opus 4.5 | claude-opus-4.5 | 200K | 复杂任务、架构设计 |
| Claude Sonnet 4.5 | claude-sonnet-4.5 | 200K | 日常开发、代码生成 |
| Claude Haiku 4.5 | claude-haiku-4.5 | 200K | 简单任务、快速响应 |

**Python 示例：**

```python
import anthropic

client = anthropic.Anthropic(
    api_key="你的令牌",
    base_url="https://api.jeniya.cn/v1"
)

message = client.messages.create(
    model="claude-sonnet-4.5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "写一个快速排序"}
    ]
)

print(message.content)
```

**Node.js 示例：**

```javascript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: '你的令牌',
  baseURL: 'https://api.jeniya.cn/v1'
});

const message = await client.messages.create({
  model: 'claude-sonnet-4.5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: '写一个快速排序' }]
});

console.log(message.content);
```

### Gemini 系列

**接入地址：** `https://api.jeniya.cn/google/v1`

**支持模型：**

| 模型 | 模型 ID | 上下文 | 适用场景 |
|------|---------|--------|---------|
| Gemini 2.5 Pro | gemini-2.5-pro | 2M | 复杂推理、大型项目 |
| Gemini 2.5 Flash | gemini-2.5-flash | 1M | 日常开发、快速响应 |
| Gemini 2.5 Flash-8B | gemini-2.5-flash-8b | 1M | 代码补全、简单任务 |

**Python 示例：**

```python
import google.generativeai as genai

genai.configure(
    api_key="你的令牌",
    transport="rest",
    client_options={"api_endpoint": "https://api.jeniya.cn/google"}
)

model = genai.GenerativeModel('gemini-2.5-flash')
response = model.generate_content('写一个快速排序')
print(response.text)
```

**Node.js 示例：**

```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("你的令牌");
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  baseUrl: "https://api.jeniya.cn/google"
});

const result = await model.generateContent('写一个快速排序');
console.log(result.response.text());
```

### GPT 系列

**接入地址：** `https://api.jeniya.cn/openai/v1`

**支持模型：**

| 模型 | 模型 ID | 上下文 | 适用场景 |
|------|---------|--------|---------|
| GPT-4.5 | gpt-4.5 | 128K | 通用任务 |
| GPT-5.2-codex | gpt-5.2-codex-high | 128K | 代码生成 |

**Python 示例：**

```python
from openai import OpenAI

client = OpenAI(
    api_key="你的令牌",
    base_url="https://api.jeniya.cn/openai/v1"
)

response = client.chat.completions.create(
    model="gpt-4.5",
    messages=[
        {"role": "user", "content": "写一个快速排序"}
    ]
)

print(response.choices[0].message.content)
```

---

## 使用教程

### Claude Code 集成

**安装：**

```bash
npm install -g @anthropic-ai/claude-code
```

**配置：**

编辑 `~/.claude/settings.json`：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "你的令牌",
    "ANTHROPIC_BASE_URL": "https://api.jeniya.cn/v1"
  }
}
```

**启动使用：**

```bash
claude-code
# 测试
> 你好，请介绍一下你自己
```

### Continue 插件集成

**配置：**

编辑 `~/.continue/config.json`：

```json
{
  "models": [
    {
      "title": "Claude Sonnet",
      "provider": "anthropic",
      "model": "claude-sonnet-4.5",
      "apiKey": "你的令牌",
      "apiBase": "https://api.jeniya.cn/v1"
    },
    {
      "title": "Gemini Flash",
      "provider": "gemini",
      "model": "gemini-2.5-flash",
      "apiKey": "你的令牌",
      "apiBase": "https://api.jeniya.cn/google/v1"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Gemini 8B",
    "provider": "gemini",
    "model": "gemini-2.5-flash-8b",
    "apiKey": "你的令牌",
    "apiBase": "https://api.jeniya.cn/google/v1"
  }
}
```

### Aider 集成

**配置：**

创建 `~/.aider.conf.yml`：

```yaml
# Claude 配置
model: anthropic/claude-sonnet-4.5
api-key: 你的令牌
api-base: https://api.jeniya.cn/v1

# 或 Gemini 配置
# model: gemini/gemini-2.5-flash
# api-key: 你的令牌
# api-base: https://api.jeniya.cn/google/v1
```

### Cursor 集成

在 Cursor 设置中添加自定义模型：
- Models → Add Model
- 填写 jeniya.cn API 配置信息

---

## 开发工具集成

### Python SDK

**Claude：**

```python
import anthropic

client = anthropic.Anthropic(
    api_key="你的令牌",
    base_url="https://api.jeniya.cn/v1"
)

# 流式输出
with client.messages.stream(
    model="claude-sonnet-4.5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "写一个快速排序"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

**Gemini：**

```python
import google.generativeai as genai

genai.configure(
    api_key="你的令牌",
    transport="rest",
    client_options={"api_endpoint": "https://api.jeniya.cn/google"}
)

model = genai.GenerativeModel('gemini-2.5-flash')

# 流式输出
response = model.generate_content('写一个快速排序', stream=True)
for chunk in response:
    print(chunk.text, end='')
```

### Node.js SDK

**Claude：**

```javascript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: '你的令牌',
  baseURL: 'https://api.jeniya.cn/v1'
});

// 流式输出
const stream = await client.messages.stream({
  model: 'claude-sonnet-4.5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: '写一个快速排序' }]
});

for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta') {
    process.stdout.write(chunk.delta.text);
  }
}
```

**Gemini：**

```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("你的令牌");
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  baseUrl: "https://api.jeniya.cn/google"
});

// 流式输出
const result = await model.generateContentStream('写一个快速排序');
for await (const chunk of result.stream) {
  process.stdout.write(chunk.text());
}
```

### REST API

**Claude API：**

```bash
curl https://api.jeniya.cn/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: 你的令牌" \
  -H "anthropic-version: 2023-06-01" \
  -d '{"model": "claude-sonnet-4.5","max_tokens": 1024,"messages": [{"role": "user", "content": "你好"}]}'
```

**Gemini API：**

```bash
curl https://api.jeniya.cn/google/v1/models/gemini-2.5-flash:generateContent \
  -H "Content-Type: application/json" \
  -H "x-api-key: 你的令牌" \
  -d '{"contents": [{"parts": [{"text": "你好"}]}]}'
```

---

## 常见问题

### 账号相关

**Q: 如何充值？**  
A: 登录后进入"充值"页面，支持支付宝、微信支付，到账即时。

**Q: 余额不足会怎样？**  
A: 余额不足时 API 调用会失败，建议设置余额预警。

**Q: 可以开发票吗？**  
A: 可以，联系客服提供充值记录和开票信息。

### 令牌相关

**Q: 令牌泄露了怎么办？**  
A: 立即在控制台删除该令牌，创建新令牌。

**Q: 一个令牌可以用于多个项目吗？**  
A: 可以，但建议为不同项目创建不同令牌，便于管理和统计。

**Q: 令牌有有效期吗？**  
A: 没有，除非手动删除。

### 使用相关

**Q: 为什么请求失败？**  
A: 常见原因：
1. 令牌错误或已删除
2. 余额不足
3. 请求格式错误
4. 网络问题  
检查控制台的调用记录查看详细错误信息。

**Q: 响应速度慢怎么办？**  
A: 
1. 检查网络连接
2. 尝试切换到稳定分组
3. 使用更快的模型（如 Flash 代替 Pro）
4. 联系客服反馈

**Q: 支持哪些地区访问？**  
A: 全球可访问，国内直连无需代理。

### 成本相关

**Q: 如何计算费用？**  
A: 费用 = 输入 tokens × 输入单价 × 倍率 + 输出 tokens × 输出单价 × 倍率

**Q: 如何降低成本？**  
A: 
1. 选择合适的模型（简单任务用 Flash/Haiku）
2. 优化提示词，减少不必要的输出
3. 使用特惠分组
4. 充分利用缓存

**Q: 可以查看详细的费用明细吗？**  
A: 可以，在控制台的"调用记录"中查看每次调用的详细费用。

---

## 最佳实践

### 令牌管理

**建议创建多个令牌：**

```yaml
令牌 1: claude-daily
分组: Claude 特惠 (0.1x)
用途: 日常开发

令牌 2: claude-production
分组: Claude 稳定 (0.15x)
用途: 生产环境

令牌 3: gemini-backup
分组: Gemini 特惠 (0.05x)
用途: 备用方案
```

**安全建议：**
- 不要将令牌提交到代码仓库
- 使用环境变量存储令牌
- 定期轮换令牌
- 为不同环境使用不同令牌

### 成本优化

**模型选择策略：**

```typescript
const modelStrategy = {
  // 代码补全：最便宜
  autocomplete: "gemini-2.5-flash-8b",
  // 简单任务：快速便宜
  simple: "gemini-2.5-flash",
  // 日常开发：平衡
  daily: "claude-sonnet-4.5",
  // 复杂任务：最强
  complex: "claude-opus-4.5"
};
```

**实际使用比例建议：**
- Flash-8B：60%（代码补全）
- Flash/Sonnet：30%（日常开发）
- Pro/Opus：10%（复杂任务）

### 错误处理

**Python 示例：**

```python
import anthropic
from anthropic import APIError, RateLimitError
import time

def safe_call(prompt, max_retries=3):
    """带重试的安全调用"""
    client = anthropic.Anthropic(
        api_key="你的令牌",
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
            print("请求过快，等待后重试...")
            time.sleep(2 ** attempt)
        except APIError as e:
            print(f"API 错误：{e}")
            if attempt == max_retries - 1:
                raise
        time.sleep(1)
    return None
```

### 监控和日志

**记录关键信息：**

```python
import logging
from datetime import datetime

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def call_with_logging(prompt):
    """带日志的调用"""
    start_time = datetime.now()
    try:
        logging.info(f"开始调用，提示词长度：{len(prompt)}")
        response = client.messages.create(...)
        duration = (datetime.now() - start_time).total_seconds()
        logging.info(f"调用成功，耗时：{duration}秒")
        return response
    except Exception as e:
        logging.error(f"调用失败：{e}")
        raise
```

---

## 技术支持

### 获取帮助

**文档：**
- 用户指南：https://jeniya.cn/docs
- API 文档：https://jeniya.cn/api-docs
- 常见问题：https://jeniya.cn/faq

**社区：**
- 用户交流群：见网站底部
- GitHub Discussions
- 技术博客

**客服：**
- 工作时间：9:00 - 21:00
- 响应时间：< 2 小时
- 联系方式：见网站"联系我们"

---

**感谢使用 jeniya.cn！**  
如有任何问题，欢迎随时联系我们。祝您使用愉快！