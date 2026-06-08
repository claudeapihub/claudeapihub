---
title: jeniya.cn 错误处理指南
slug: /blog/jeniya-api/error-handling.html
description: jeniya.cn API 错误处理完整指南，包括常见错误代码、处理策略和重试机制。
keywords:
  - jeniya.cn 错误处理
  - API 错误代码
  - 重试机制
  - RateLimitError
  - API 限流
---

# jeniya.cn 错误处理指南

本文介绍 jeniya.cn API 的错误处理方法。

## 常见错误代码

| 错误代码 | HTTP 状态码 | 说明 | 解决方案 |
|---------|------------|------|---------|
| `invalid_api_key` | 401 | 无效的 API Key | 检查 API Key 是否正确 |
| `insufficient_funds` | 402 | 余额不足 | 充值或使用其他令牌 |
| `rate_limit_exceeded` | 429 | 请求过快 | 降低请求频率，使用指数退避 |
| `invalid_request` | 400 | 请求格式错误 | 检查请求参数和格式 |
| `model_not_found` | 404 | 模型不存在 | 检查模型名称是否正确 |
| `server_error` | 500 | 服务器错误 | 稍后重试，联系客服 |
| `service_unavailable` | 503 | 服务不可用 | 稍后重试，联系客服 |

## 错误处理策略

### 1. 无效的 API Key

**错误代码：** `invalid_api_key`  
**HTTP 状态码：** 401

**处理方法：**
1. 检查 API Key 是否正确
2. 确认 API Key 未被删除或禁用
3. 确认使用了正确的请求头格式

```python
# 错误示例
import anthropic

try:
    client = anthropic.Anthropic(api_key="wrong_key")
    client.messages.create(...)
except anthropic.AuthenticationError as e:
    print("API Key 错误，请检查是否正确")
    # 处理：重新获取 API Key
```

### 2. 余额不足

**错误代码：** `insufficient_funds`  
**HTTP 状态码：** 402

**处理方法：**
1. 检查余额
2. 及时充值
3. 设置余额预警

```python
import anthropic
from anthropic import APIToolError

def call_with_balance_check(prompt):
    try:
        return client.messages.create(...)
    except APIToolError as e:
        if "insufficient_funds" in str(e):
            print("余额不足，请充值")
            send_notification("余额不足，请及时充值")
            return None
        raise
```

### 3. 请求过快（限流）

**错误代码：** `rate_limit_exceeded`  
**HTTP 状态码：** 429

**处理方法：**
1. 使用指数退避重试
2. 降低请求频率
3. 使用队列控制并发

```python
import anthropic
from anthropic import RateLimitError
import time

def call_with_rate_limit_handling(prompt, max_retries=5):
    for attempt in range(max_retries):
        try:
            return client.messages.create(...)
        except RateLimitError:
            if attempt == max_retries - 1:
                print("请求频繁，请稍后再试")
                return None
            
            wait_time = 2 ** attempt
            print(f"请求频繁，等待 {wait_time} 秒...")
            time.sleep(wait_time)
    return None
```

### 4. 请求格式错误

**错误代码：** `invalid_request`  
**HTTP 状态码：** 400

**处理方法：**
1. 检查请求参数
2. 对照 API 文档
3. 查看示例代码

```python
import anthropic
from anthropic import APIStatusError

def validate_and_call(prompt):
    if not prompt or len(prompt) > 100000:
        print("提示词长度不合法")
        return None
    
    try:
        return client.messages.create(...)
    except APIStatusError as e:
        if e.status_code == 400:
            print(f"请求格式错误：{e.message}")
            print("请检查请求参数")
        raise
```

## 重试机制

### 指数退避算法

```python
import time

def exponential_backoff(max_retries=5, base_delay=1):
    """指数退避装饰器"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except (RateLimitError, APIConnectionError) as e:
                    if attempt == max_retries - 1:
                        raise
                    
                    delay = base_delay * (2 ** attempt)
                    print(f"重试 {attempt + 1}/{max_retries}，等待 {delay} 秒...")
                    time.sleep(delay)
            return None
        return wrapper
    return decorator

@exponential_backoff(max_retries=5)
def call_with_retry(prompt):
    return client.messages.create(...)
```

### Node.js 版本

```javascript
async function retryWithExponentialBackoff(
  fn, 
  maxRetries = 5, 
  baseDelay = 1
) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      if (error.code === 'rate_limit_exceeded' || 
          error.code === 'api_connection_error') {
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`重试 ${attempt + 1}/${maxRetries}，等待 ${delay}ms...`);
        await setTimeout(delay);
      } else {
        throw error;
      }
    }
  }
}

// 使用
const result = await retryWithExponentialBackoff(async () => {
  return await client.messages.create({...});
});
```

## 实用工具函数

### Python 统一错误处理

```python
import anthropic
from anthropic import (
    APIStatusError, 
    RateLimitError, 
    APIToolError,
    AuthenticationError
)
import time

class APIErrorHandler:
    def __init__(self, max_retries=3):
        self.max_retries = max_retries
        self.error_counts = {}
    
    def handle(self, error, context=""):
        """统一错误处理"""
        error_type = type(error).__name__
        self.error_counts[error_type] = self.error_counts.get(error_type, 0) + 1
        
        if isinstance(error, AuthenticationError):
            print("API Key 错误，请检查")
            return None
            
        elif isinstance(error, RateLimitError):
            print("请求频繁，请稍后再试")
            return None
            
        elif isinstance(error, APIToolError):
            print(f"API 调用失败: {error.message}")
            return None
            
        elif isinstance(error, APIStatusError):
            if error.status_code == 400:
                print(f"请求格式错误: {error.message}")
            elif error.status_code == 401:
                print("认证失败")
            elif error.status_code == 402:
                print("余额不足")
            elif error.status_code == 404:
                print("资源不存在")
            elif error.status_code >= 500:
                print(f"服务器错误: {error.message}")
            return None
            
        else:
            print(f"未知错误: {error}")
            return None
    
    def call_with_error_handling(self, func, *args, **kwargs):
        """带错误处理的调用"""
        for attempt in range(self.max_retries):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                result = self.handle(e)
                if result is not None:
                    return result
                if attempt == self.max_retries - 1:
                    raise
                time.sleep(1)
        return None
```

### Node.js 统一错误处理

```javascript
class APIErrorHandler {
  constructor(maxRetries = 3) {
    this.maxRetries = maxRetries;
    this.errorCounts = {};
  }

  handle(error, context = "") {
    const errorType = error.code || error.name;
    this.errorCounts[errorType] = (this.errorCounts[errorType] || 0) + 1;

    if (error.code === 'invalid_api_key') {
      console.log("API Key 错误，请检查");
      return null;
    } else if (error.code === 'rate_limit_exceeded') {
      console.log("请求频繁，请稍后再试");
      return null;
    } else if (error.code === 'insufficient_funds') {
      console.log("余额不足");
      return null;
    } else if (error.code === 'invalid_request') {
      console.log(`请求格式错误: ${error.message}`);
      return null;
    } else {
      console.log(`未知错误: ${error.message}`);
      return null;
    }
  }

  async callWithErrorHandling(asyncFunc) {
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        return await asyncFunc();
      } catch (error) {
        const result = this.handle(error);
        if (result !== null) return result;
        
        if (attempt === this.maxRetries - 1) throw error;
        await setTimeout(1000);
      }
    }
    return null;
  }
}
```

## 最佳实践

1. **始终添加错误处理**
   ```python
   try:
       response = client.messages.create(...)
   except Exception as e:
       handle_error(e)
   ```

2. **记录错误日志**
   ```python
   logging.error(f"API 调用失败: {error}", exc_info=True)
   ```

3. **使用重试机制**
   - 限流错误使用指数退避
   - 服务器错误等待后重试
   - 客户端错误不重试

4. **设置合理的超时**
   ```python
   response = client.messages.create(
       ...,
       timeout=60.0  # 60秒超时
   )
   ```

5. **监控错误率**
   - 统计各类错误出现频率
   - 及时发现异常
   - 优化代码

## 下一步

- 查看 [最佳实践](./best-practices.md)
- 查看 [常见问题](./faq.md)

---

**国内最推荐 Claude API 中转站平台**：
> Claude API 中转站 平台地址：<https://jeniya.cn>

> Claude API 中转站 平台地址：<https://jeniya.top>

> Claude API 中转站 平台地址：<https://jeniya.chat>