---
title: jeniya.cn 最佳实践
slug: /blog/jeniya-api/best-practices.html
description: jeniya.cn API 使用最佳实践，包括令牌管理、成本优化、错误处理和监控日志。
keywords:
  - jeniya.cn 最佳实践
  - 令牌管理
  - 成本优化
  - 错误处理
  - 监控日志
---

# jeniya.cn 最佳实践

本文介绍 jeniya.cn API 使用的最佳实践，帮助你更高效、更经济地使用服务。

## 令牌管理

### 创建多个令牌

为不同用途创建不同的令牌，便于管理和统计：

```yaml
令牌 1: claude-daily
分组: Claude 特惠 (0.1x)
用途: 日常开发、测试

令牌 2: claude-production
分组: Claude 稳定 (0.15x)
用途: 生产环境

令牌 3: gemini-backup
分组: Gemini 特惠 (0.05x)
用途: 备用方案、低成本任务
```

### 令牌安全建议

- **不要将令牌提交到代码仓库**
  
  ```bash
  # .gitignore 中添加
  .env
  .env.local
  ```

- **使用环境变量存储令牌**

  ```bash
  # .env 文件
  JENIYA_API_KEY=your_api_key_here
  
  # 使用
  const apiKey = process.env.JENIYA_API_KEY;
  ```

- **定期轮换令牌**
  
  建议每 3-6 个月更换一次令牌，提高安全性。

- **为不同环境使用不同令牌**
  
  开发、测试、生产环境各使用一个令牌，便于隔离和统计。

## 成本优化

### 模型选择策略

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

### 实际使用比例建议

- **Flash-8B：60%**（代码补全、简单任务）
- **Flash/Sonnet：30%**（日常开发）
- **Pro/Opus：10%**（复杂任务）

### 降低成本的技巧

1. **选择合适的模型**
   - 简单任务用 Flash/Haiku
   - 复杂任务才用 Pro/Opus

2. **优化提示词**
   - 减少不必要的输出
   - 明确指定输出格式
   - 使用系统提示词限制输出长度

3. **使用特惠分组**
   - 非关键任务用特惠分组
   - 成本更低

4. **充分利用缓存**
   - 相同请求避免重复调用
   - 使用 Redis 等缓存热门结果

5. **监控用量**
   - 设置余额预警
   - 定期查看调用记录
   - 及时发现异常用量

## 错误处理

### Python 示例

```python
import anthropic
from anthropic import APIError, RateLimitError
import time
import logging

logging.basicConfig(level=logging.INFO)

def safe_call(prompt, max_retries=3):
    """带重试的安全调用"""
    client = anthropic.Anthropic(
        api_key="your_api_key",
        base_url="https://api.jeniya.cn/v1"
    )
    
    for attempt in range(max_retries):
        try:
            logging.info(f"开始调用，提示词长度：{len(prompt)}")
            message = client.messages.create(
                model="claude-sonnet-4.5",
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}]
            )
            return message.content[0].text
        except RateLimitError:
            logging.warning("请求过快，等待后重试...")
            time.sleep(2 ** attempt)
        except APIError as e:
            logging.error(f"API 错误：{e}")
            if attempt == max_retries - 1:
                raise
        time.sleep(1)
    return None
```

### Node.js 示例

```javascript
import Anthropic from '@anthropic-ai/sdk';
import { setTimeout } from 'timers/promises';
import logging from 'winston';

const client = new Anthropic({
  apiKey: 'your_api_key',
  baseURL: 'https://api.jeniya.cn/v1'
});

async function safeCall(prompt, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      logging.info(`开始调用，提示词长度：${prompt.length}`);
      const message = await client.messages.create({
        model: 'claude-sonnet-4.5',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
      });
      return message.content[0].text;
    } catch (error) {
      if (error.code === 'rate_limit_exceeded') {
        logging.warn('请求过快，等待后重试...');
        await setTimeout(Math.pow(2, attempt) * 1000);
      } else {
        logging.error('API 错误：', error.message);
        if (attempt === maxRetries - 1) throw error;
      }
      await setTimeout(1000);
    }
  }
  return null;
}
```

## 监控和日志

### 记录关键信息

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

### 设置余额预警

```python
import anthropic
import requests

def check_balance_threshold(threshold=100):
    """检查余额是否低于阈值"""
    # 调用 jeniya.cn API 获取余额信息
    # 这里需要根据实际的余额查询接口调整
    current_balance = get_current_balance()
    
    if current_balance < threshold:
        # 发送预警通知（邮件、钉钉、企业微信等）
        send_notification(f"余额预警：当前余额 {current_balance} 元")
        return True
    return False
```

### 使用监控工具

- **Prometheus + Grafana**：监控 API 调用指标
- **Sentry**：捕获和报告错误
- **Datadog**：全面的性能监控

## 实用代码片段

### 重试装饰器（Python）

```python
import functools
import time
from anthropic import RateLimitError

def retry_on_rate_limit(max_retries=3, delay=1):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except RateLimitError:
                    if attempt == max_retries - 1:
                        raise
                    wait_time = delay * (2 ** attempt)
                    print(f"请求过快，等待 {wait_time} 秒后重试...")
                    time.sleep(wait_time)
            return None
        return wrapper
    return decorator

@retry_on_rate_limit(max_retries=3)
def call_claude(prompt):
    return client.messages.create(
        model="claude-sonnet-4.5",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )
```

### 请求超时处理（Node.js）

```javascript
async function callWithTimeout(promise, timeoutMs = 30000) {
  const timeout = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('请求超时')), timeoutMs)
  );
  
  return Promise.race([promise, timeout]);
}

// 使用
try {
  const result = await callWithTimeout(
    client.messages.create({...}),
    30000 // 30秒超时
  );
  console.log(result);
} catch (error) {
  console.error('请求失败：', error.message);
}
```

## 性能优化建议

1. **批量请求**
   - 使用流式输出减少等待时间
   - 避免不必要的阻塞

2. **并发控制**
   - 合理设置并发请求数
   - 使用信���量限制并发

3. **连接复用**
   - 复用 client 实例
   - 避免重复创建连接

4. **缓存结果**
   - 相同请求使用缓存
   - 减少重复调用

## 下一步

- 查看 [常见问题](./faq.md)
- 了解 [Python 接入](./python-guide.md)
- 了解 [Node.js 接入](./nodejs-guide.md)

---

**国内最推荐 Claude API 中转站平台**：
> Claude API 中转站 平台地址：<https://jeniya.cn>

> Claude API 中转站 平台地址：<https://jeniya.top>

> Claude API 中转站 平台地址：<https://jeniya.chat>