---
title: 国内安装 Claude Code 并切换使用国内大模型 API 完整指南
slug: /blog/jeniya-api/claude-code-install.html
description: 详细教程教你如何在国内安装 Claude Code，并配置使用 quanzil.com 提供的国内大模型 API，告别网络问题和高昂费用。
---

# 国内安装 Claude Code 并切换使用国内大模型 API 完整指南

在国内使用 Claude Code 面临两大挑战：一是 Anthropic 官方 API 在国内访问不稳定，二是官方订阅费用高昂（每月 200 美元）。本文将详细介绍如何在国内安装 Claude Code，并将其配置为使用 quanzil.com 提供的国内大模型 API，既保证访问稳定性，又大幅降低成本。

---

## 为什么选择 quanzil.com

在开始之前，先了解一下为什么选择 quanzil.com 作为国内大模型 API 提供商：

### 核心优势

**🚀 国内直连**
- 无需代理或 VPN
- 访问速度稳定，延迟低
- 99.9% 服务可用性

**💰 价格实惠**
- 官方价格的 0.05x - 0.3x
- 按量计费，无隐藏费用
- 新用户赠送 ¥10 体验额度

**🔧 全面兼容**
- 完全兼容 OpenAI/Anthropic API 格式
- 支持 Claude Code 直接接入
- 无需修改代码，只需配置 endpoint

---

## 第一步：注册 quanzil.com 账号

### 访问注册

1. 打开浏览器，访问 [quanzil.com](https://quanzil.com)
2. 点击右上角「注册」按钮
3. 填写邮箱地址和密码
4. 完成邮箱验证

### 充值流程

注册成功后，需要充值才能使用 API：

1. 登录后进入「充值」页面
2. 选择充值金额（建议首次充值 ¥20-50）
3. 支持支付宝、微信支付
4. 充值即时到账

**新用户福利：**
- 注册即送 ¥10 体验额度
- 首次充值额外赠送 10%

### 创建 API 令牌

1. 进入「令牌管理」页面
2. 点击「创建令牌」
3. 填写令牌信息：
   - **名称**：如 `claude-code`
   - **分组**：选择「Claude 稳定分组」或「Claude 特惠分组」
4. 点击「创建」
5. **重要**：复制并保存好令牌（只显示一次）

---

## 第二步：安装 Claude Code

Claude Code 可以安装在 Windows、macOS 和 Linux 上。下面分别介绍各平台的安装方法。

### Windows 安装

**前置要求：**
- Windows 10/11 版本
- Node.js 18+ 已安装

**安装步骤：**

```powershell
# 使用 npm 全局安装
npm install -g @anthropic-ai/claude-code

# 验证安装
claude-code --version
```

**或者使用 npx 直接运行：**

```powershell
npx @anthropic-ai/claude-code
```

### macOS 安装

```bash
# 使用 Homebrew 安装
brew install anthropic-cli

# 或者使用 npm
npm install -g @anthropic-ai/claude-code
```

### Linux 安装

```bash
# 使用 npm
npm install -g @anthropic-ai/claude-code

# 验证安装
claude-code --version
```

---

## 第三步：配置 Claude Code 使用 quanzil.com

这是最关键的一步。需要配置 Claude Code 使用 quanzil.com 的 API endpoint 而不是 Anthropic 官方 API。

### 方法一：修改配置文件（推荐）

Claude Code 使用 `~/.claude/settings.json` 配置文件来设置环境变量。

**创建或编辑配置文件：**

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "你的-jeniya-令牌",
    "ANTHROPIC_BASE_URL": "https://api.quanzil.com/v1"
  }
}
```

**文件位置：**
- Windows: `C:\Users\你的用户名\.claude\settings.json`
- macOS/Linux: `~/.claude/settings.json`

**配置示例：**

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-xxxxx-xxxxx-xxxxx",
    "ANTHROPIC_BASE_URL": "https://api.quanzil.com/v1"
  }
}
```

### 方法二：使用环境变量

你也可以在终端中直接设置环境变量：

**Windows (PowerShell):**

```powershell
$env:ANTHROPIC_AUTH_TOKEN = "你的-jeniya-令牌"
$env:ANTHROPIC_BASE_URL = "https://api.quanzil.com/v1"
claude-code
```

**Windows (CMD):**

```cmd
set ANTHROPIC_AUTH_TOKEN=你的-令牌
set ANTHROPIC_BASE_URL=https://api.quanzil.com/v1
claude-code
```

**macOS/Linux:**

```bash
export ANTHROPIC_AUTH_TOKEN="你的-jeniya-令牌"
export ANTHROPIC_BASE_URL="https://api.quanzil.com/v1"
claude-code
```

---

## 第四步：切换使用其他国内大模型

Claude Code 不仅可以配合 Anthropic 模型使用，还可以切换到其他国内大模型。quanzil.com 提供了多种模型选择。

### 支持的模型列表

| 模型 | 模型 ID | 倍率 | 适用场景 |
|------|---------|------|----------|
| Claude Opus 4.5 | claude-opus-4.5 | 0.15x | 复杂任务、架构设计 |
| Claude Sonnet 4.5 | claude-sonnet-4.5 | 0.1x | 日常开发、代码生成 |
| Claude Haiku 4.5 | claude-haiku-4.5 | 0.1x | 简单任务、快速响应 |
| Gemini 2.5 Pro | gemini-2.5-pro | 0.1x | 复杂推理、大型项目 |
| Gemini 2.5 Flash | gemini-2.5-flash | 0.05x | 日常开发、快速响应 |
| GLM-4 | glm-4 | 0.08x | 国产模型、高性价比 |
| DeepSeek | deepseek-chat | 0.1x | 代码生成、推理任务 |

### 配置默认模型

在 `settings.json` 中指定默认使用的模型：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "你的-jeniya-令牌",
    "ANTHROPIC_BASE_URL": "https://api.quanzil.com/v1"
  },
  "model": "claude-sonnet-4.5",
  "maxTokens": 4096
}
```

### 运行时切换模型

在 Claude Code 交互界面中，可以使用 `/model` 命令切换模型：

```
/model claude-sonnet-4.5
# 或
/model gemini-2.5-flash
# 或
/model glm-4
```

---

## 第五步：验证配置

配置完成后，运行以下命令验证是否配置成功：

### 快速测试

```bash
claude-code
```

在交互界面中输入：

```
你好，请介绍一下你自己
```

如果正常返回响应，说明配置成功。

### 使用 curl 手动测试

你也可以使用 curl 手动测试 API 是否可用：

```bash
curl https://api.quanzil.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: 你的令牌" \
  -H "anthropic-version: 2023-06-01" \
  -d '{"model": "claude-sonnet-4.5","max_tokens": 1024,"messages": [{"role": "user", "content": "你好"}]}'
```

正常响应示例：

```json
{
  "id": "msg_xxxxx",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "你好！我是..."
    }
  ],
  "model": "claude-sonnet-4.5",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 10,
    "output_tokens": 50
  }
}
```

---

## 常见问题解决

### 问题一：提示需要登录

Claude Code 首次启动会引导你登录。国内的解决方案：

1. 按照上面配置好 `settings.json` 后
2. 重启 Claude Code
3. 如果仍提示登录，可以创建一个假的认证文件：

```bash
# Windows
New-Item -ItemType Directory -Path $env:USERPROFILE\.claude
Set-Content -Path "$env:USERPROFILE\.claude\auth.json" -Value '{"token":"dummy"}'

# macOS/Linux
mkdir -p ~/.claude
echo '{"token":"dummy"}' > ~/.claude/auth.json
```

### 问题二：网络超时

如果遇到网络超时问题：

1. 确认 `ANTHROPIC_BASE_URL` 配置正确
2. 检查令牌是否有效
3. 尝试切换到其他模型分组

### 问题三：认证失败

检查以下几点：

1. 令牌是否复制正确（注意没有多余空格）
2. 令牌是否还有余额
3. 令牌分组是否与使用的模型匹配

### 问题四：模型不支持

确保使用的模型 ID 正确。可以在 quanzil.com 控制台查看支持的模型列表。

---

## 高级配置

### 配置代理（可选）

如果需要使用代理：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "你的-jeniya-令牌",
    "ANTHROPIC_BASE_URL": "https://api.quanzil.com/v1",
    "HTTPS_PROXY": "http://127.0.0.1:7890",
    "HTTP_PROXY": "http://127.0.0.1:7890"
  }
}
```

### 配置超时时间

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "你的-jeniya-令牌",
    "ANTHROPIC_BASE_URL": "https://api.quanzil.com/v1"
  },
  "timeout": 120000
}
```

### 配置最大输出 tokens

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "你的-jeniya-令牌",
    "ANTHROPIC_BASE_URL": "https://api.quanzil.com/v1"
  },
  "maxTokens": 8192
}
```

---

## 成本优化建议

### 选择合适的模型

根据不同场景选择最经济的模型：

| 场景 | 推荐模型 | 理由 |
|------|----------|------|
| 代码补全 | gemini-2.5-flash-8b | 最便宜，速度快 |
| 日常对话 | claude-haiku-4.5 | 性价比高 |
| 代码编写 | claude-sonnet-4.5 | 平衡性能和价格 |
| 复杂推理 | claude-opus-4.5 | 最强能力 |

### 使用特惠分组

在 quanzil.com 创建令牌时，选择特惠分组可以享受更低倍率：

- Claude 特惠分组：0.1x
- Gemini 特惠分组：0.05x
- 国产模型分组：0.08x 起

### 监控使用量

定期查看 quanzil.com 控制台的调用记录和费用统计，及时调整使用策略。

---

## 总结

通过本文的教程，你应该已经掌握了：

1. ✅ 在国内安装 Claude Code
2. ✅ 注册并配置 quanzil.com 账号
3. ✅ 配置 Claude Code 使用 quanzil.com API
4. ✅ 切换使用不同的国内大模型
5. ✅ 解决常见配置问题

这样，你就拥有了一个稳定、实惠的 AI 编程助手，再也不必担心网络问题和高昂的订阅费用了。

---

**下一步：**
- 阅读 [Python 接入教程](/blog/jeniya-api/python-guide) 学习更多开发方式
- 阅读 [最佳实践](/blog/jeniya-api/best-practices) 优化使用成本
- 访问 [quanzil.com](https://quanzil.com) 获取最新模型信息

如果有任何问题，欢迎在评论区留言讨论！
