# jeniya.cn API 中转服务文档

jeniya.cn 是专业的 AI API 中转服务平台，为开发者提供稳定、高效、经济的 AI 模型访问方案。

## 📚 文档导航

### 快速开始
- **[完整指南](./index.md)** - jeniya.cn API 的完整使用指南
- **[快速开始](./quick-start.md)** - 5分钟快速上手教程

### 入门教程
- **[Python 接入教程](./python-guide.md)** - Python 开发者的完整接入指南
- **[Node.js 接入教程](./nodejs-guide.md)** - Node.js 开发者的完整接入指南
- **[支持模型](./models.md)** - 支持的 Claude、GPT、Gemini 模型列表

### 进阶指南
- **[流式输出](./streaming-guide.md)** - 实时响应方案，提升用户体验
- **[错误处理](./error-handling.md)** - 完整的错误处理指南
- **[最佳实践](./best-practices.md)** - 令牌管理、成本优化、监控日志
- **[成本优化](./cost-optimization.md)** - 经济高效地使用 API

### 常见问题
- **[常见问题 FAQ](./faq.md)** - 账号、令牌、使用、成本等问题解答

## 🎯 项目结构

```
docs/
└── blog/
    └── jeniya-api/
        ├── index.md              # 完整指南
        ├── quick-start.md        # 快速开始
        ├── python-guide.md       # Python 教程
        ├── nodejs-guide.md       # Node.js 教程
        ├── models.md             # 模型列表
        ├── streaming-guide.md    # 流式输出
        ├── error-handling.md     # 错误处理
        ├── best-practices.md     # 最佳实践
        ├── cost-optimization.md  # 成本优化
        └── faq.md               # 常见问题
```

## 🚀 快速开始

### 1. 注册账号
访问 [jeniya.cn](https://jeniya.cn) 注册，新用户送 ¥10 体验额度

### 2. 创建令牌
登录后进入"令牌管理"，创建新令牌

### 3. 测试调用

**Python:**
```python
import anthropic

client = anthropic.Anthropic(
    api_key="your_api_key",
    base_url="https://api.jeniya.cn/v1"
)

message = client.messages.create(
    model="claude-sonnet-4.5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "你好"}]
)

print(message.content)
```

**Node.js:**
```javascript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: 'your_api_key',
  baseURL: 'https://api.jeniya.cn/v1'
});

const message = await client.messages.create({
  model: 'claude-sonnet-4.5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: '你好' }]
});

console.log(message.content);
```

## 📖 推荐阅读顺序

1. **[完整指南](./index.md)** - 了解 jeniya.cn 的基本概念和功能
2. **[快速开始](./quick-start.md)** - 5分钟完成配置和测试
3. **[Python 接入教程](./python-guide.md)** 或 **[Node.js 接入教程](./nodejs-guide.md)** - 选择你使用的语言
4. **[支持模型](./models.md)** - 了解支持的模型和选择建议
5. **[最佳实践](./best-practices.md)** - 学习令牌管理和成本优化
6. **[常见问题 FAQ](./faq.md)** - 解答常见问题

## 💡 产品特色

- **🚀 稳定可靠** - 国内直连，无需代理，99.9% 服务可用性
- **💰 价格优惠** - 0.05x - 0.3x 官方倍率，按量计费
- **🔧 易于集成** - 完全兼容官方 API，支持所有主流语言
- **📊 透明管理** - 实时用量统计，详细调用记录

## 🤝 技术支持

- **文档**: https://jeniya.cn/docs
- **API 文档**: https://jeniya.cn/api-docs
- **客服**: support@jeniya.cn
- **工单**: 控制台提交

---

**感谢使用 jeniya.cn！**  
如有任何问题，欢迎随时联系我们。