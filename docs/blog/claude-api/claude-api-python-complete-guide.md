---
title: Claude API Python 入门教程：从安装到流式输出，保姆级完整指南
slug: /blog/claude-api/claude-api-python-complete-guide.html
description: 这是一篇面向零基础开发者的 Claude API Python 完整教程，从环境安装、API Key 配置、第一次调用，到参数详解、流式输出、错误处理，手把手带你完成 Claude API 的全部接入流程。
keywords:
  - Claude API Python 教程
  - Claude API 入门
  - Claude API 安装
  - Claude API 流式输出
  - Claude API 完整指南
---

# Claude API Python 入门教程：从安装到流式输出，保姆级完整指南

如果你正在搜索"**Claude API Python 怎么用**"，或者刚接触 Claude API 不知道从哪开始，这篇文章就是为你准备的。

这是一篇**保姆级完整教程**，会带你从零开始：

- 环境怎么装
- API Key 怎么配
- 第一次调用怎么跑通
- 参数是什么意思
- 流式输出怎么实现
- 报错了怎么处理

先说结论：

**Claude API 是 Anthropic 提供的大模型接口，尤其适合长文本处理、严谨写作、复杂代码分析和高质量内容生成。**

**国内最推荐 Claude API 中转站平台**：
> Claude API 中转站 平台地址：<https://quanzil.com>

> Claude API 中转站 平台地址：<https://jeniya.net>

> Claude API 中转站 平台地址：<https://jeniya.cn>

> Claude API 中转站 平台地址：<https://jeniya.chat>

---

## 这篇教程适合谁

这篇文章假设你：

- 会基本的 Python 语法
- 知道怎么在终端运行 Python 脚本
- 对 API 没有太多经验也可以

如果你已经有 API 调用经验，可以跳到感兴趣的章节。

---

## 第一部分：环境准备

在写代码之前，先把环境准备好。

### 1.1 检查 Python 版本

Claude API 的官方 SDK 建议 Python 3.8 或以上。

打开终端，运行：

```bash
python --version
```

如果显示 `Python 3.8.x` 或更高版本，就可以继续。

如果版本太低或没有安装 Python，先去 [Python 官网](https://www.python.org/downloads/) 下载安装。

---

### 1.2 安装 Anthropic SDK

Anthropic 提供了官方 Python SDK，安装很简单：

```bash
pip install anthropic
```

安装完成后，可以验证一下：

```bash
python -c "import anthropic; print(anthropic.__version__)"
```

如果输出了版本号，说明安装成功。

::: tip 国内网络问题
如果 pip 安装很慢或失败，可以使用国内镜像：

```bash
pip install anthropic -i https://pypi.tuna.tsinghua.edu.cn/simple
```
:::

---

### 1.3 准备 API Key

调用 Claude API 需要一个 API Key。

#### 方式一：Anthropic 官方

如果你能直接访问 Anthropic 官方，可以在 [Anthropic Console](https://console.anthropic.com/) 获取 API Key。

#### 方式二：使用中转站（国内推荐）

国内开发者通常会使用兼容 OpenAI 格式的中转站，好处是：

- 接入更稳定
- 可以同时使用多种模型
- 统一调用格式

注册后获取 API Key 即可使用。

---

### 1.4 配置环境变量

**强烈建议**把 API Key 放在环境变量里，而不是直接写在代码里。

#### macOS / Linux

在终端运行：

```bash
export ANTHROPIC_API_KEY="your_api_key_here"
```

如果想永久生效，可以加到 `~/.bashrc` 或 `~/.zshrc` 文件中：

```bash
echo 'export ANTHROPIC_API_KEY="your_api_key_here"' >> ~/.zshrc
source ~/.zshrc
```

#### Windows CMD

```cmd
set ANTHROPIC_API_KEY=your_api_key_here
```

#### Windows PowerShell

```powershell
$env:ANTHROPIC_API_KEY="your_api_key_here"
```

---

## 第二部分：第一次调用

环境准备好了，现在来写第一个 Claude API 调用程序。

### 2.1 最简示例

创建一个文件 `hello_claude.py`：

```python
import os
from anthropic import Anthropic

# 从环境变量获取 API Key
api_key = os.getenv("ANTHROPIC_API_KEY")
if not api_key:
    raise ValueError("请先设置 ANTHROPIC_API_KEY 环境变量")

# 创建客户端
client = Anthropic(api_key=api_key)

# 发送请求
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=100,
    messages=[
        {"role": "user", "content": "你好，请用一句话介绍你自己"}
    ]
)

# 打印结果
print(response.content[0].text)
```

运行：

```bash
python hello_claude.py
```

如果一切正常，你会看到 Claude 的回复。

---

### 2.2 使用 OpenAI 兼容格式

如果你使用中转站，通常可以用 OpenAI SDK 格式：

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),  # 或你的中转站 Key
    base_url="https://quanzil.com/v1"  # 中转站地址
)

response = client.chat.completions.create(
    model="claude-sonnet-4-6",
    messages=[
        {"role": "user", "content": "你好，请用一句话介绍你自己"}
    ]
)

print(response.choices[0].message.content)
```

安装 OpenAI SDK：

```bash
pip install openai
```

这种方式的好处是，如果你同时使用 GPT 或其他模型，代码格式统一。

---

### 2.3 常见第一次报错

#### 问题 1：`invalid_api_key`

**原因**：API Key 错误或未设置

**解决**：
1. 检查环境变量是否设置成功
2. 确认 Key 没有多余的空格或引号
3. 确认 Key 没有过期或被禁用

```python
# 调试：检查环境变量
import os
print(f"API Key: {os.getenv('ANTHROPIC_API_KEY')}")
```

#### 问题 2：`model_not_found`

**原因**：模型名称错误

**解决**：确认你使用的平台支持的模型名称。不同平台的命名可能略有不同。

#### 问题 3：连接超时

**原因**：网络问题

**解决**：
1. 检查网络连接
2. 如果在国内，考虑使用中转站
3. 增加超时时间

---

## 第三部分：参数详解

第一次调用成功后，我们来详细理解每个参数的含义。

### 3.1 核心参数一览

```python
response = client.messages.create(
    model="claude-sonnet-4-6",  # 模型名称
    max_tokens=1024,            # 最大输出长度
    temperature=0.7,            # 随机性
    system="你是一个专业助手",   # 系统提示词
    messages=[                  # 对话消息
        {"role": "user", "content": "你好"}
    ]
)
```

---

### 3.2 model：模型选择

Claude 有多个模型版本：

| 模型 | 特点 | 适用场景 |
|------|------|----------|
| **claude-haiku-4-5** | 速度快、成本低 | 简单问答、批量处理 |
| **claude-sonnet-4-6** | 平衡性好 | 大多数业务场景 |
| **claude-opus-4-7** | 能力最强 | 复杂推理、高价值任务 |

**选择建议**：
- 不知道选哪个 → 先用 Sonnet
- 追求性价比 → 用 Haiku
- 需要最高质量 → 用 Opus

---

### 3.3 max_tokens：输出长度控制

这个参数控制 Claude 最多生成多少 token。

```python
# 简短回答
max_tokens=100

# 一般对话
max_tokens=500

# 长文本生成
max_tokens=4096
```

**注意**：
- 设置太小会中途截断
- 设置太大会增加成本（按实际使用计费）
- 根据 your 需求合理设置

---

### 3.4 temperature：随机性控制

`temperature` 控制输出的随机程度：

```python
# 更稳定、更确定
temperature=0.1

# 平衡
temperature=0.7

# 更有创意、更多变化
temperature=1.0
```

**不同场景的建议值**：

| 场景 | 建议值 | 原因 |
|------|--------|------|
| 代码生成 | 0.1-0.3 | 需要准确性 |
| 文档总结 | 0.2-0.4 | 需要稳定性 |
| 普通对话 | 0.7 | 平衡自然度 |
| 创意写作 | 0.8-1.0 | 需要多样性 |

---

### 3.5 system：系统提示词

`system` 参数用来给 Claude 设定角色和行为规范：

```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system="你是一个 Python 编程专家，擅长解释代码和调试问题。回答要简洁、专业、有代码示例。",
    messages=[
        {"role": "user", "content": "什么是装饰器？"}
    ]
)
```

**好的 system prompt 包含**：
1. 角色定位（你是什么）
2. 专业领域（你擅长什么）
3. 回答风格（简洁/详细/专业/通俗）
4. 特殊要求（是否要代码示例、是否要分点等）

---

### 3.6 messages：对话内容

`messages` 是一个列表，包含对话的完整历史：

```python
messages = [
    {"role": "user", "content": "什么是 Python？"},
    {"role": "assistant", "content": "Python 是一种编程语言..."},
    {"role": "user", "content": "它有什么优点？"}
]
```

**多轮对话示例**：

```python
def chat(client, messages: list, user_input: str):
    # 添加用户消息
    messages.append({"role": "user", "content": user_input})
    
    # 调用 API
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=messages
    )
    
    # 获取回复
    assistant_message = response.content[0].text
    
    # 添加到历史
    messages.append({"role": "assistant", "content": assistant_message})
    
    return assistant_message

# 使用示例
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
history = []

while True:
    user_input = input("你: ")
    if user_input.lower() in ["exit", "quit", "q"]:
        break
    
    response = chat(client, history, user_input)
    print(f"Claude: {response}\n")
```

---

## 第四部分：流式输出

当 Claude 生成长文本时，等待完整回复会很慢。**流式输出**可以让你实时看到内容，体验更好。

### 4.1 什么是流式输出

**传统模式**：
```
用户发送请求 → 等待... → 一次性返回完整结果
```

**流式输出模式**：
```
用户发送请求 → 逐字返回 → 实时显示 → 完成
```

流式输出的好处：
- 用户感知更快
- 可以实时看到内容生成
- 更自然的对话体验

---

### 4.2 基础流式输出示例

```python
import os
from anthropic import Anthropic

def stream_chat(prompt: str):
    """基础流式输出"""
    client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    
    print("Claude: ", end="", flush=True)
    
    with client.messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
    
    print()  # 换行

if __name__ == "__main__":
    stream_chat("请写一首关于编程的五言绝句")
```

运行后，你会看到文字逐字出现，而不是等很久后一次性显示。

---

### 4.3 使用 OpenAI SDK 格式的流式输出

```python
import os
from openai import OpenAI

def stream_chat_openai(prompt: str):
    """OpenAI SDK 格式的流式输出"""
    client = OpenAI(
        api_key=os.getenv("OPENAI_API_KEY"),
        base_url="https://quanzil.com/v1"
    )
    
    print("Claude: ", end="", flush=True)
    
    stream = client.chat.completions.create(
        model="claude-sonnet-4-6",
        messages=[{"role": "user", "content": prompt}],
        stream=True  # 开启流式输出
    )
    
    for chunk in stream:
        if chunk.choices[0].delta.content:
            print(chunk.choices[0].delta.content, end="", flush=True)
    
    print()

if __name__ == "__main__":
    stream_chat_openai("请解释什么是机器学习，用通俗易懂的语言")
```

---

### 4.4 流式输出封装类

下面是一个更实用的封装，可以直接用到项目中：

```python
import os
from anthropic import Anthropic
from typing import Generator, Optional, Callable

class ClaudeStreamer:
    """Claude 流式输出封装类"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.client = Anthropic(
            api_key=api_key or os.getenv("ANTHROPIC_API_KEY")
        )
    
    def stream(
        self,
        prompt: str,
        model: str = "claude-sonnet-4-6",
        max_tokens: int = 2048,
        temperature: float = 0.7,
        system: Optional[str] = None
    ) -> Generator[str, None, None]:
        """
        流式生成文本
        
        参数:
            prompt: 用户输入
            model: 模型名称
            max_tokens: 最大输出长度
            temperature: 随机性
            system: 系统提示词
            
        返回:
            生成器，逐个返回文本片段
        """
        params = {
            "model": model,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "messages": [{"role": "user", "content": prompt}]
        }
        
        if system:
            params["system"] = system
        
        with self.client.messages.stream(**params) as stream:
            for text in stream.text_stream:
                yield text
    
    def stream_with_callback(
        self,
        prompt: str,
        callback: Callable[[str], None],
        **kwargs
    ) -> str:
        """
        带回调的流式输出
        
        参数:
            prompt: 用户输入
            callback: 每收到一段文本就调用的函数
            **kwargs: 其他参数
            
        返回:
            完整的生成文本
        """
        full_text = ""
        for chunk in self.stream(prompt, **kwargs):
            full_text += chunk
            callback(chunk)
        return full_text
    
    def print_stream(self, prompt: str, **kwargs) -> str:
        """
        流式输出并打印
        
        参数:
            prompt: 用户输入
            **kwargs: 其他参数
            
        返回:
            完整的生成文本
        """
        full_text = ""
        for chunk in self.stream(prompt, **kwargs):
            print(chunk, end="", flush=True)
            full_text += chunk
        print()  # 换行
        return full_text


# 使用示例
if __name__ == "__main__":
    streamer = ClaudeStreamer()
    
    # 方式1：直接打印
    print("=== 方式1：直接打印 ===")
    result = streamer.print_stream("用三句话介绍 Python")
    print(f"\n完整内容: {result}\n")
    
    # 方式2：自定义回调
    print("=== 方式2：自定义回调 ===")
    def my_callback(chunk):
        # 可以在这里做额外处理，比如更新 UI
        pass
    
    result = streamer.stream_with_callback(
        "解释什么是 API",
        callback=my_callback
    )
    print(f"完整内容: {result}\n")
    
    # 方式3：手动迭代
    print("=== 方式3：手动迭代 ===")
    for chunk in streamer.stream("什么是机器学习？"):
        print(chunk, end="", flush=True)
    print()
```

---

### 4.5 流式输出的错误处理

流式输出过程中可能遇到网络中断或 API 错误，需要妥善处理：

```python
import os
import time
from anthropic import Anthropic, APIError, APIConnectionError, RateLimitError

def robust_stream(prompt: str, max_retries: int = 3):
    """带错误处理和重试的流式输出"""
    client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    
    for attempt in range(max_retries):
        try:
            with client.messages.stream(
                model="claude-sonnet-4-6",
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}]
            ) as stream:
                for text in stream.text_stream:
                    yield text
            break  # 成功完成，退出重试循环
            
        except RateLimitError:
            wait_time = 2 ** attempt  # 指数退避
            print(f"\n触发限流，{wait_time}秒后重试...")
            time.sleep(wait_time)
            continue
            
        except APIConnectionError:
            print(f"\n连接失败，正在重试 ({attempt + 1}/{max_retries})...")
            time.sleep(1)
            continue
            
        except APIError as e:
            print(f"\nAPI 错误: {e}")
            if attempt < max_retries - 1:
                time.sleep(1)
                continue
            raise

# 使用示例
if __name__ == "__main__":
    for chunk in robust_stream("解释什么是深度学习"):
        print(chunk, end="", flush=True)
```

---

## 第五部分：实用示例

### 5.1 文档总结器

```python
import os
from anthropic import Anthropic

def summarize_text(text: str, style: str = "简洁") -> str:
    """
    文档总结器
    
    参数:
        text: 要总结的文本
        style: 总结风格（简洁/详细/要点）
        
    返回:
        总结内容
    """
    client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    
    style_prompts = {
        "简洁": "请用 3-5 句话简洁总结以下内容：",
        "详细": "请详细总结以下内容，包括主要观点和关键细节：",
        "要点": "请将以下内容总结为 5-7 个要点，每个要点一句话："
    }
    
    system_prompt = style_prompts.get(style, style_prompts["简洁"])
    
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1000,
        temperature=0.3,
        messages=[{
            "role": "user",
            "content": f"{system_prompt}\n\n{text}"
        }]
    )
    
    return response.content[0].text

# 使用示例
if __name__ == "__main__":
    long_text = """
    Claude API 是 Anthropic 提供的大模型接口服务。
    它支持长文本处理、代码分析、文档总结等多种任务。
    Claude 的特点是输出风格严谨、长文本能力强、适合企业级应用。
    通过 Python SDK，开发者可以快速接入 Claude API。
    主要参数包括 model、max_tokens、temperature 等。
    """
    
    print("=== 简洁总结 ===")
    print(summarize_text(long_text, "简洁"))
    
    print("\n=== 要点总结 ===")
    print(summarize_text(long_text, "要点"))
```

---

### 5.2 代码解释器

```python
import os
from anthropic import Anthropic

def explain_code(code: str, language: str = "Python") -> str:
    """
    代码解释器
    
    参数:
        code: 要解释的代码
        language: 编程语言
        
    返回:
        代码解释
    """
    client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        temperature=0.2,
        system=f"你是一个{language}编程专家，擅长解释代码的工作原理。请用清晰、专业的中文解释，包含：1）代码整体功能 2）关键步骤说明 3）可能的改进建议",
        messages=[{
            "role": "user",
            "content": f"请解释以下{language}代码：\n\n```{language.lower()}\n{code}\n```"
        }]
    )
    
    return response.content[0].text

# 使用示例
if __name__ == "__main__":
    code_example = """
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
"""
    
    print(explain_code(code_example))
```

---

### 5.3 多轮对话机器人

```python
import os
from anthropic import Anthropic

class ChatBot:
    """多轮对话机器人"""
    
    def __init__(
        self,
        system_prompt: str = "你是一个友好的 AI 助手，擅长回答各种问题。",
        model: str = "claude-sonnet-4-6"
    ):
        self.client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        self.system_prompt = system_prompt
        self.model = model
        self.history = []
    
    def chat(self, user_input: str) -> str:
        """发送消息并获取回复"""
        # 添加用户消息
        self.history.append({"role": "user", "content": user_input})
        
        # 调用 API
        response = self.client.messages.create(
            model=self.model,
            max_tokens=2048,
            system=self.system_prompt,
            messages=self.history
        )
        
        # 获取回复
        assistant_message = response.content[0].text
        
        # 添加到历史
        self.history.append({"role": "assistant", "content": assistant_message})
        
        return assistant_message
    
    def clear_history(self):
        """清空对话历史"""
        self.history = []
    
    def show_history(self):
        """显示对话历史"""
        for msg in self.history:
            role = "你" if msg["role"] == "user" else "Claude"
            print(f"{role}: {msg['content']}\n")

# 使用示例
if __name__ == "__main__":
    bot = ChatBot(
        system_prompt="你是一个 Python 编程专家，擅长解答编程问题。"
    )
    
    print("对话开始，输入 'quit' 退出，输入 'clear' 清空历史\n")
    
    while True:
        user_input = input("你: ").strip()
        
        if user_input.lower() == "quit":
            break
        elif user_input.lower() == "clear":
            bot.clear_history()
            print("对话历史已清空\n")
            continue
        elif not user_input:
            continue
        
        response = bot.chat(user_input)
        print(f"Claude: {response}\n")
```

---

## 第六部分：错误处理

调用 API 时可能遇到各种错误，了解如何处理很重要。

### 6.1 常见错误类型

| 错误类型 | HTTP 状态码 | 常见原因 |
|----------|-------------|----------|
| 鉴权失败 | 401 | API Key 错误或过期 |
| 权限不足 | 403 | 没有访问该模型的权限 |
| 资源不存在 | 404 | 模型名称错误 |
| 请求过于频繁 | 429 | 触发限流 |
| 服务器错误 | 500 | 服务端问题 |
| 超时 | - | 网络问题或请求时间过长 |

---

### 6.2 完整的错误处理示例

```python
import os
import time
from anthropic import Anthropic, APIError, APIConnectionError, RateLimitError, AuthenticationError

def call_claude_with_retry(
    prompt: str,
    max_retries: int = 3,
    retry_delay: float = 1.0
) -> str:
    """
    带重试机制的 Claude API 调用
    
    参数:
        prompt: 用户输入
        max_retries: 最大重试次数
        retry_delay: 重试间隔（秒）
        
    返回:
        Claude 的回复
    """
    client = Anthropic(
        api_key=os.getenv("ANTHROPIC_API_KEY"),
        timeout=60.0  # 设置超时时间
    )
    
    last_error = None
    
    for attempt in range(max_retries):
        try:
            response = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=1024,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.content[0].text
            
        except AuthenticationError as e:
            # 鉴权错误，不需要重试
            raise ValueError(f"API Key 验证失败: {e}")
            
        except RateLimitError as e:
            # 限流，使用指数退避
            wait_time = retry_delay * (2 ** attempt)
            print(f"触发限流，{wait_time}秒后重试...")
            time.sleep(wait_time)
            last_error = e
            continue
            
        except APIConnectionError as e:
            # 连接错误
            print(f"连接失败 ({attempt + 1}/{max_retries}): {e}")
            time.sleep(retry_delay)
            last_error = e
            continue
            
        except APIError as e:
            # 其他 API 错误
            print(f"API 错误: {e}")
            last_error = e
            if attempt < max_retries - 1:
                time.sleep(retry_delay)
                continue
    
    raise Exception(f"重试 {max_retries} 次后仍然失败: {last_error}")

# 使用示例
if __name__ == "__main__":
    try:
        result = call_claude_with_retry("你好，介绍一下你自己")
        print(result)
    except Exception as e:
        print(f"调用失败: {e}")
```

---

### 6.3 超时设置

```python
from anthropic import Anthropic
import os

# 设置全局超时
client = Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY"),
    timeout=120.0  # 120 秒
)

# 或者单次请求超时
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "你好"}],
    timeout=60.0  # 这个请求超时 60 秒
)
```

---

## 第七部分：最佳实践

### 7.1 成本控制

Claude API 按 token 计费，以下技巧可以帮你省钱：

#### 控制输入长度

```python
# 不推荐：直接传很长的文本
long_article = "..." * 100000  # 很长的文章
response = client.messages.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": long_article}]
)

# 推荐：先预处理，只传必要的部分
relevant_part = extract_relevant_section(long_article)
response = client.messages.create(
    model="claude-sonnet-4-6",
    messages=[{"role": "user", "content": relevant_part}]
)
```

#### 选择合适的模型

```python
# 简单任务用 Haiku
def simple_qa(question: str):
    response = client.messages.create(
        model="claude-haiku-4-5",  # 更便宜
        max_tokens=200,
        messages=[{"role": "user", "content": question}]
    )
    return response.content[0].text

# 复杂任务用 Sonnet
def complex_analysis(text: str):
    response = client.messages.create(
        model="claude-sonnet-4-6",  # 更强大
        max_tokens=2000,
        messages=[{"role": "user", "content": f"分析以下内容：\n{text}"}]
    )
    return response.content[0].text
```

#### 设置 max_tokens

```python
# 不推荐：不设置或设置太大
max_tokens=100000  # 太大

# 推荐：根据需求设置合理的上限
max_tokens=500   # 简短回答
max_tokens=2000  # 一般长文
max_tokens=4096  # 很长的输出
```

---

### 7.2 提示词优化

#### 使用清晰的 System Prompt

```python
# 不推荐
system = "你是个助手"

# 推荐
system = """
你是一个专业的技术文档撰写专家，具有以下特点：
1. 擅长将复杂的技术概念用简洁的语言解释清楚
2. 回答结构化，使用分点和代码示例
3. 语言专业但不晦涩，适合初学者阅读
4. 如果涉及代码，会提供完整的可运行示例
"""
```

#### 给出示例

```python
prompt = """
请将以下产品描述改写为营销文案。

示例输入：
"这款耳机采用蓝牙5.0技术，续航30小时"

示例输出：
"告别电量焦虑！蓝牙5.0稳定连接，30小时超长续航，让音乐陪伴你的每一刻。"

请改写：
"这款笔记本电脑重量只有1.2kg，处理器是最新款，续航12小时"
"""
```

---

### 7.3 安全建议

#### 不要在客户端暴露 API Key

```python
# ❌ 错误：前端代码
# const response = await fetch('https://api.anthropic.com/...', {
#     headers: { 'x-api-key': 'your-key' }  // 会暴露给用户！
# })

# ✅ 正确：通过后端代理
# 前端只调用自己的后端
# 后端再调用 Claude API
```

#### 使用环境变量

```python
# ❌ 错误：硬编码
api_key = "sk-ant-xxxxx"

# ✅ 正确：环境变量
import os
api_key = os.getenv("ANTHROPIC_API_KEY")
```

#### 敏感信息处理

```python
def sanitize_input(text: str) -> str:
    """移除可能的敏感信息"""
    import re
    # 移除可能的 API Key
    text = re.sub(r'sk-[a-zA-Z0-9]{20,}', '[REDACTED]', text)
    # 移除可能的密码
    text = re.sub(r'password["\']?\s*[:=]\s*["\']?[^"\',\s]+', 'password=[REDACTED]', text)
    return text
```

---

## 第八部分：调试技巧

### 8.1 查看请求详情

```python
import os
from anthropic import Anthropic

# 开启调试模式
import httpx
client = Anthropic(
    api_key=os.getenv("ANTHROPIC_API_KEY"),
    http_client=httpx.Client(timeout=60.0)
)

# 打印请求信息
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=100,
    messages=[{"role": "user", "content": "你好"}]
)

# 查看响应详情
print(f"Model: {response.model}")
print(f"Usage: {response.usage}")
print(f"Stop reason: {response.stop_reason}")
print(f"Content: {response.content[0].text}")
```

---

### 8.2 计算成本

```python
def estimate_cost(
    input_tokens: int,
    output_tokens: int,
    model: str = "claude-sonnet-4-6"
) -> float:
    """
    估算成本（美元）
    价格仅供参考，以官方最新价格为准
    """
    prices = {
        "claude-haiku-4-5": {"input": 0.25, "output": 1.25},
        "claude-sonnet-4-6": {"input": 3.0, "output": 15.0},
        "claude-opus-4-7": {"input": 15.0, "output": 75.0},
    }
    
    # 价格单位：美元 / 百万 token
    price = prices.get(model, prices["claude-sonnet-4-6"])
    
    input_cost = (input_tokens / 1_000_000) * price["input"]
    output_cost = (output_tokens / 1_000_000) * price["output"]
    
    return input_cost + output_cost

# 使用示例
if __name__ == "__main__":
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=100,
        messages=[{"role": "user", "content": "你好"}]
    )
    
    cost = estimate_cost(
        input_tokens=response.usage.input_tokens,
        output_tokens=response.usage.output_tokens,
        model="claude-sonnet-4-6"
    )
    
    print(f"本次调用成本: ${cost:.6f}")
```

---

## 总结

这篇教程从零开始，带你完成了 Claude API Python 接入的完整流程：

**环境准备**：
- Python 3.8+ 环境
- 安装 `anthropic` SDK
- 配置 API Key

**基础调用**：
- 创建客户端
- 发送第一次请求
- 理解核心参数

**流式输出**：
- 基础流式调用
- 封装可复用的类
- 错误处理和重试

**实用示例**：
- 文档总结器
- 代码解释器
- 多轮对话机器人

**最佳实践**：
- 成本控制
- 提示词优化
- 安全建议

---

## 下一步学习

- [Claude API 错误处理完整指南](/blog/claude-api/claude-api-error-handling)
- [Claude API 最佳实践：提示词优化与成本控制](/blog/claude-api/claude-api-best-practices)
- [Claude 模型版本对比：Haiku vs Sonnet vs Opus 如何选择](/blog/claude-api/claude-models-comparison)
- [Claude API 长文本处理实战](/blog/claude-api/claude-api-long-text-processing)
- [价格说明](/pricing)
- [开发文档](/docs)

---
