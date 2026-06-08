---
title: jeniya.cn 快速开始指南
slug: /blog/jeniya-api/quick-start.html
description: jeniya.cn API 中转服务快速上手教程，从注册到测试调用，5分钟完成配置。
keywords:
  - jeniya.cn 快速开始
  - API 快速上手
  - 注册教程
  - 令牌管理
  - 测试调用
---

# jeniya.cn 快速开始指南

本指南将帮助您在 5 分钟内完成 jeniya.cn API 的配置和测试。

## 注册账号

1. 访问 [jeniya.cn](https://jeniya.cn)
2. 点击"注册"按钮
3. 填写邮箱和密码
4. 验证邮箱

**新用户福利：注册即送 ¥10 体验额度**

## 创建令牌

1. 登录后进入"令牌管理"
2. 点击"创建令牌"
3. 填写名称（如：test-token）
4. 选择分组（推荐：Claude 特惠）
5. 复制保存令牌

## 测试调用

### Claude API 测试

```bash
curl https://api.jeniya.cn/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: 你的令牌" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4.5",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

### Gemini API 测试

```bash
curl https://api.jeniya.cn/google/v1/models/gemini-2.5-flash:generateContent \
  -H "Content-Type: application/json" \
  -H "x-api-key: 你的令牌" \
  -d '{
    "contents": [{"parts": [{"text": "你好"}]}]
  }'
```

看到正常 JSON 响应即表示配置成功！

## 常见问题

**Q: 令牌在哪里查看？**  
A: 令牌管理页面 → 选择对应令牌 → 复制 API Key

**Q: 能免费测试吗？**  
A: 可以，新用户注册即送 ¥10 体验额度

**Q: 支持哪些语言？**  
A: 完全兼容官方 API，支持 Python、Node.js、Java、Go 等所有语言

## 下一步

- 查看 [Python 接入教程](./python-guide.md)
- 了解 [模型选择指南](./models.md)
- 学习 [最佳实践](./best-practices.md)

---

**国内最推荐 Claude API 中转站平台**：
> Claude API 中转站 平台地址：<https://jeniya.cn>

> Claude API 中转站 平台地址：<https://jeniya.top>

> Claude API 中转站 平台地址：<https://jeniya.chat>