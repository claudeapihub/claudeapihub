---
title: Claude Code本地安装与自定义API接口配置完整指南
slug: /blog/jeniya-api/claude-code-csdn-article.html
description: 详细记录Claude Code在Windows/macOS/Linux三平台的安装过程，以及如何配置自定义API端点解决国内访问问题，包含完整的踩坑记录和解决方案。
keywords:
  - Claude Code 安装
  - Claude Code 配置
  - 自定义 API
  - 国内访问
  - API 端点配置
  - 踩坑记录
---

# Claude Code本地安装与自定义API接口配置完整指南

Claude Code是Anthropic推出的命令行AI编程助手，能够理解整个项目代码库，辅助编码、调试、重构等开发工作。本文记录了从零开始安装Claude Code并配置自定义API接口的完整过程，包括遇到的各种问题及解决方案。

## 一、环境准备

### 1.1 安装Node.js

Claude Code基于Node.js开发，需要先安装Node.js运行环境。

**检查现有环境：**

```bash
node -v
npm -v
```

如果显示版本号，说明已安装。建议Node.js版本在18以上。

**各平台安装方式：**

**Windows：**
- 下载地址：Node.js官网或国内镜像站
- 下载LTS版本安装包
- 安装时勾选"Add to PATH"选项

**macOS：**
```bash
brew install node
```

**Linux (Ubuntu/Debian)：**
```bash
sudo apt update
sudo apt install nodejs npm
```

**Linux (CentOS/RHEL)：**
```bash
sudo yum install nodejs npm
```

安装完成后重新打开终端验证。

### 1.2 安装Git（可选但推荐）

虽然不是必须，但Claude Code在Git仓库中工作效果更好。

**Windows：** 从Git官网下载安装包
**macOS：** `brew install git`
**Linux：** `sudo apt install git` 或 `sudo yum install git`

## 二、安装Claude Code

### 2.1 通过npm安装

最简单的方式是使用npm全局安装：

```bash
npm install -g @anthropic-ai/claude-code
```

安装完成后验证：

```bash
claude --version
```

### 2.2 通过npx运行

如果不想全局安装，可以使用npx：

```bash
npx @anthropic-ai/claude-code
```

这种方式每次运行都会检查更新，但首次启动需要下载。

### 2.3 常见安装问题

**问题：命令找不到**

Windows用户安装后可能提示"claude不是内部或外部命令"。

解决方法：
1. 重新打开终端窗口
2. 或检查npm全局路径是否在PATH中：
```powershell
npm config get prefix
```
将该路径下的`node_modules\.bin`添加到系统PATH。

**问题：安装速度慢**

国内用户可以切换npm镜像源：
```bash
npm config set registry https://registry.npmmirror.com
```

## 三、配置自定义API端点

Claude Code默认使用Anthropic官方API，但官方API在国内访问不稳定。通过配置环境变量，可以让Claude Code使用自定义的API端点。

### 3.1 理解配置原理

Claude Code支持以下环境变量：
- `ANTHROPIC_AUTH_TOKEN`：API认证令牌
- `ANTHROPIC_BASE_URL`：API基础地址
- `ANTHROPIC_API_KEY`：另一种认证方式（某些版本支持）

配置自定义API端点，本质上就是设置`ANTHROPIC_BASE_URL`指向中转服务地址。

### 3.2 方法一：配置文件方式（推荐）

Claude Code会读取用户目录下的配置文件：

- Windows: `C:\Users\<用户名>\.claude\settings.json`
- macOS/Linux: `~/.claude/settings.json`

**创建配置目录：**

Windows PowerShell：
```powershell
New-Item -ItemType Directory -Path "$env:USERPROFILE\.claude" -Force
```

macOS/Linux：
```bash
mkdir -p ~/.claude
```

**创建配置文件：**

创建`settings.json`文件，内容如下：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your-api-token-here",
    "ANTHROPIC_BASE_URL": "https://api.quanzil.com/v1"
  }
}
```

将`your-api-token-here`替换为你的API令牌。这里使用了`api.quanzil.com`作为示例端点，你也可以替换成其他兼容的服务地址。

### 3.3 方法二：环境变量方式

也可以直接在终端设置环境变量：

**Windows PowerShell：**
```powershell
$env:ANTHROPIC_AUTH_TOKEN = "your-api-token"
$env:ANTHROPIC_BASE_URL = "https://api.quanzil.com/v1"
claude
```

**Windows CMD：**
```cmd
set ANTHROPIC_AUTH_TOKEN=your-api-token
set ANTHROPIC_BASE_URL=https://api.quanzil.com/v1
claude
```

**macOS/Linux (Bash)：**
```bash
export ANTHROPIC_AUTH_TOKEN="your-api-token"
export ANTHROPIC_BASE_URL="https://api.quanzil.com/v1"
claude
```

**macOS/Linux (Zsh)：**
```zsh
export ANTHROPIC_AUTH_TOKEN="your-api-token"
export ANTHROPIC_BASE_URL="https://api.quanzil.com/v1"
claude
```

这种方式每次打开新终端都需要重新设置。

### 3.4 方法三：Shell配置文件（永久生效）

**Bash用户：**
```bash
echo 'export ANTHROPIC_AUTH_TOKEN="your-api-token"' >> ~/.bashrc
echo 'export ANTHROPIC_BASE_URL="https://api.quanzil.com/v1"' >> ~/.bashrc
source ~/.bashrc
```

**Zsh用户：**
```zsh
echo 'export ANTHROPIC_AUTH_TOKEN="your-api-token"' >> ~/.zshrc
echo 'export ANTHROPIC_BASE_URL="https://api.quanzil.com/v1"' >> ~/.zshrc
source ~/.zshrc
```

## 四、获取API令牌

要使用Claude API，需要获取API令牌。有以下几种方式：

### 4.1 官方API

访问Anthropic Console（console.anthropic.com）注册并创建API Key。

**优点：** 官方支持，稳定性最高
**缺点：** 国内访问困难，需要代理；按量计费，费用较高

### 4.2 第三方API中转服务

市面上有一些提供Claude API中转的服务，通常具有以下特点：
- 国内可直接访问，无需代理
- 兼容官方API格式，配置简单
- 价格相对较低

在配置示例中，我使用的是`api.quanzil.com`这个端点（对应的网站是quanzil.com或jeniya.com），这是一个比较常用的中转服务。你可以根据自己的需求选择其他服务，配置方式相同。

**配置示例：**
```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your-token",
    "ANTHROPIC_BASE_URL": "https://api.quanzil.com/v1"
  }
}
```

选择第三方服务时建议注意：
- 查看服务稳定性和口碑
- 确认是否支持Claude最新模型
- 了解计费方式，按量付费比较灵活
- 新用户一般都有体验额度，可以先测试

### 4.3 自建中转服务

技术能力强的用户可以自建API中转，主要方式：
- 使用Cloudflare Workers等Serverless平台
- 在有稳定网络的服务器上部署代理

这需要一定的技术基础，不在本文讨论范围内。

## 五、首次启动与测试

### 5.1 启动Claude Code

在项目目录下执行：

```bash
cd your-project-directory
claude
```

首次启动会显示欢迎界面和一些使用说明。

### 5.2 基础功能测试

输入简单问题测试：

```
请介绍一下你自己
```

或让AI分析代码：

```
分析当前项目的结构
```

### 5.3 API连接测试

如果Claude Code无法正常响应，可以用curl测试API连接：

```bash
curl https://api.quanzil.com/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-token" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

成功响应示例：
```json
{
  "id": "msg_xxx",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello! How can I help you?"
    }
  ]
}
```

如果这个测试能返回正常结果，说明API配置没问题，可以进一步排查Claude Code本身的问题。

## 六、常见问题排查

### 6.1 问题：首次启动要求登录

Claude Code首次启动可能引导用户登录Anthropic账号。

**解决方案一：** 确保配置文件正确配置了API令牌和端点

**解决方案二：** 创建假的认证文件跳过登录

Windows PowerShell：
```powershell
Set-Content -Path "$env:USERPROFILE\.claude\auth.json" -Value '{"token":"dummy"}'
```

macOS/Linux：
```bash
echo '{"token":"dummy"}' > ~/.claude/auth.json
```

### 6.2 问题：连接超时

**排查步骤：**
1. 检查网络连接
2. 确认API端点地址正确
3. 测试API令牌是否有效
4. 查看账户余额是否充足

**调试方法：**
使用curl命令测试API连接（见5.3节）

### 6.3 问题：认证失败

**常见原因：**
- API令牌复制错误（包含空格或换行）
- 令牌已过期或被撤销
- 账户余额不足
- API端点不支持该令牌格式

**解决方法：**
- 重新复制令牌，确保没有多余字符
- 检查令牌状态
- 确认账户余额

### 6.4 问题：模型不存在

确保使用正确的模型ID。Claude模型命名格式为：
- `claude-opus-4-20250514`
- `claude-sonnet-4-20250514`
- `claude-haiku-4-20250514`

不同API服务支持的模型可能不同，请查看具体服务的文档。

### 6.5 问题：Windows下npm全局安装后找不到命令

**原因：** npm全局安装路径未添加到PATH

**解决：**

1. 查看npm全局安装路径：
```powershell
npm config get prefix
```

2. 将返回路径下的`node_modules\.bin`添加到系统环境变量PATH中

3. 重新打开终端窗口

## 七、模型选择与切换

### 7.1 Claude模型对比

| 模型 | 特点 | 适用场景 |
|------|------|---------|
| Claude Opus 4 | 能力最强，处理复杂任务 | 架构设计、深度分析 |
| Claude Sonnet 4 | 平衡性能和成本 | 日常开发、代码生成 |
| Claude Haiku 4 | 速度快，成本低 | 简单任务、快速响应 |

### 7.2 切换模型

**运行时切换：**

在Claude Code交互界面中：
```
/model claude-sonnet-4-20250514
```

**配置默认模型：**

在`settings.json`中添加：
```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your-token",
    "ANTHROPIC_BASE_URL": "https://api.quanzil.com/v1"
  },
  "model": "claude-sonnet-4-20250514"
}
```

## 八、进阶配置

### 8.1 配置代理

如需通过代理访问API：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your-token",
    "ANTHROPIC_BASE_URL": "https://api.quanzil.com/v1",
    "HTTPS_PROXY": "http://127.0.0.1:7890",
    "HTTP_PROXY": "http://127.0.0.1:7890"
  }
}
```

### 8.2 配置超时时间

对于复杂任务，可以增加超时时间（毫秒）：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your-token",
    "ANTHROPIC_BASE_URL": "https://api.quanzil.com/v1"
  },
  "timeout": 180000
}
```

### 8.3 配置最大输出Token数

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your-token",
    "ANTHROPIC_BASE_URL": "https://api.quanzil.com/v1"
  },
  "maxTokens": 8192
}
```

### 8.4 配置自定义CLAUDE.md

在项目根目录创建`CLAUDE.md`文件，可以给Claude Code提供项目上下文：

```markdown
# 项目说明

这是一个React项目，使用TypeScript开发。

## 技术栈
- React 18
- TypeScript
- Vite

## 代码规范
- 使用函数式组件
- 使用ESLint和Prettier
```

## 九、使用技巧

### 9.1 常用命令

- `/help`：查看帮助
- `/model`：切换模型
- `/clear`：清除对话
- `/cost`：查看成本统计
- `/config`：查看配置

### 9.2 最佳实践

1. **在Git仓库中使用**：Claude Code能更好地理解项目结构
2. **提供清晰的指令**：明确说明想要做什么
3. **分步骤处理复杂任务**：不要一次要求做太多事情
4. **及时反馈**：如果AI理解有误，直接指出
5. **定期保存工作**：重要修改及时提交Git

### 9.3 成本优化

- 简单任务使用Haiku模型
- 日常开发使用Sonnet模型
- 复杂任务才使用Opus模型
- 注意监控Token使用量

## 十、总结

本文详细记录了Claude Code的安装和配置过程：

1. 环境准备：安装Node.js和Git
2. 安装Claude Code：npm或npx方式
3. 配置自定义API端点：配置文件或环境变量
4. 获取API令牌：官方或第三方服务
5. 问题排查：登录、超时、认证等问题解决
6. 进阶使用：模型切换、代理配置、超时设置

Claude Code是一个强大的AI编程助手，通过自定义API端点配置，可以解决国内访问问题，正常使用其功能。配置过程中遇到的问题大多与网络、认证、配置文件有关，按照本文的排查步骤基本都能解决。

---

**补充说明：** 本文示例中使用的`api.quanzil.com`是作者实际测试过的一个可用端点，对应的平台是quanzil.com。如果你已经有其他API服务，直接替换配置中的端点地址即可，配置方法完全相同。

