---
title: Claude API 长文本处理实战：文档分析、总结与知识提取
slug: /blog/claude-api/claude-api-long-text-processing.html
description: 深入讲解 Claude API 长文本处理能力，包括大文档处理、文本总结、信息提取、分块策略和成本优化技巧。
keywords:
  - Claude API 长文本
  - Claude API 文档总结
  - Claude API 大文档处理
  - Claude API 上下文长度
---

# Claude API 长文本处理实战：文档分析、总结与知识提取

Claude 的一个核心优势是**长文本处理能力**。这篇文章深入讲解如何利用 Claude API 处理大文档：

- Claude 长文本能力概述
- 大文档处理策略
- 文本总结和信息提取
- 分块与合并技术
- 成本优化实践

---

## Claude 长文本能力概述

### 上下文长度对比

| 模型 | 上下文长度 | 适用场景 |
|------|------------|----------|
| Claude Haiku | 200K tokens | 快速处理，成本敏感 |
| Claude Sonnet | 200K tokens | 平衡性能和成本 |
| Claude Opus | 200K tokens | 复杂分析，高质量输出 |

### Token 概念理解

**什么是 Token？**
- 英文：约 1 个单词 = 1 个 token
- 中文：约 1-2 个汉字 = 1 个 token
- 代码：取决于语言和格式

**估算方法**：
```python
# 粗略估算
def estimate_tokens(text: str) -> int:
    """估算文本的 token 数量"""
    # 英文按空格分词
    # 中文按字符估算
    return len(text) // 4  # 粗略估算

# 精确计算需要使用 tokenizer
```

### 长文本处理的优势场景

| 场景 | 说明 |
|------|------|
| 文档总结 | 论文、报告、合同等长文档摘要 |
| 信息提取 | 从大量文本中提取关键信息 |
| 代码分析 | 分析整个项目或大型代码文件 |
| 知识问答 | 基于长文档的问答系统 |
| 内容对比 | 多文档对比分析 |

---

## 大文档处理策略

### 策略一：直接处理

适用于单文档不超过上下文限制的情况：

```python
from anthropic import Anthropic
import os

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def summarize_document(text: str) -> str:
    """直接总结文档"""
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"""请对以下文档进行全面总结，包括：
1. 核心主题
2. 主要观点（3-5条）
3. 关键结论

文档内容：
{text}"""
        }]
    )
    return response.content[0].text

# 使用示例
with open("document.txt", "r", encoding="utf-8") as f:
    document = f.read()

summary = summarize_document(document)
print(summary)
```

### 策略二：分块处理

适用于超大文档：

```python
from anthropic import Anthropic
import os
from typing import List

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def split_text(text: str, chunk_size: int = 10000, overlap: int = 500) -> List[str]:
    """
    将长文本分割成多个块
    
    Args:
        text: 原始文本
        chunk_size: 每块大小（字符数）
        overlap: 块之间的重叠长度
        
    Returns:
        文本块列表
    """
    chunks = []
    start = 0
    
    while start < len(text):
        end = start + chunk_size
        
        # 尝试在句子边界分割
        if end < len(text):
            # 向后找句号或换行
            for i in range(end, min(end + 200, len(text))):
                if text[i] in ['。', '！', '？', '\n', '.']:
                    end = i + 1
                    break
        
        chunks.append(text[start:end])
        start = end - overlap
    
    return chunks

def process_chunks(chunks: List[str]) -> List[str]:
    """处理每个文本块"""
    summaries = []
    
    for i, chunk in enumerate(chunks):
        print(f"正在处理第 {i + 1}/{len(chunks)} 块...")
        
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            messages=[{
                "role": "user",
                "content": f"请总结以下文本的要点：\n\n{chunk}"
            }]
        )
        summaries.append(response.content[0].text)
    
    return summaries

def merge_summaries(summaries: List[str]) -> str:
    """合并多个摘要"""
    combined = "\n\n".join([
        f"【第{i+1}部分】{s}"
        for i, s in enumerate(summaries)
    ])
    
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"""请将以下各部分的总结整合成一个完整的摘要：

{combined}

要求：
1. 去除重复内容
2. 按逻辑顺序组织
3. 保留关键信息"""
        }]
    )
    
    return response.content[0].text

def process_large_document(text: str) -> str:
    """完整的大文档处理流程"""
    # 1. 分块
    chunks = split_text(text)
    print(f"文档已分为 {len(chunks)} 块")
    
    # 2. 处理每块
    summaries = process_chunks(chunks)
    
    # 3. 合并结果
    final_summary = merge_summaries(summaries)
    
    return final_summary

# 使用示例
if __name__ == "__main__":
    with open("large_document.txt", "r", encoding="utf-8") as f:
        large_doc = f.read()
    
    result = process_large_document(large_doc)
    print(result)
```

---

## 文本总结和信息提取

### 多层次总结

```python
from anthropic import Anthropic
import os

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def multi_level_summary(text: str) -> dict:
    """
    多层次文档总结
    
    Returns:
        {
            "one_sentence": "一句话总结",
            "key_points": ["要点1", "要点2", ...],
            "detailed": "详细总结"
        }
    """
    # 一句话总结
    response1 = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=100,
        messages=[{
            "role": "user",
            "content": f"用一句话总结以下内容的核心观点：\n\n{text[:5000]}"  # 使用前5000字符
        }]
    )
    one_sentence = response1.content[0].text
    
    # 关键要点
    response2 = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=500,
        messages=[{
            "role": "user",
            "content": f"""从以下内容中提取5个关键要点，每点不超过30字：

{text}"""
        }]
    )
    key_points = response2.content[0].text.split('\n')
    key_points = [p.strip('- ').strip() for p in key_points if p.strip()]
    
    # 详细总结
    response3 = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"""请对以下内容进行详细总结，包括：
1. 背景介绍
2. 核心论点
3. 论据支撑
4. 结论启示

内容：
{text}"""
        }]
    )
    detailed = response3.content[0].text
    
    return {
        "one_sentence": one_sentence,
        "key_points": key_points,
        "detailed": detailed
    }
```

### 结构化信息提取

```python
def extract_structured_info(text: str) -> dict:
    """
    从文档中提取结构化信息
    
    适用于：
    - 论文：作者、摘要、关键词、结论
    - 合同：甲方、乙方、金额、期限
    - 报告：主题、数据、结论、建议
    """
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": f"""请从以下文本中提取关键信息，以 JSON 格式返回：

{{
    "title": "文档标题",
    "author": "作者（如有）",
    "date": "日期（如有）",
    "keywords": ["关键词1", "关键词2"],
    "summary": "摘要（100字以内）",
    "main_points": ["要点1", "要点2", "要点3"],
    "conclusion": "结论",
    "action_items": ["行动建议1", "行动建议2"]
}}

文本内容：
{text}"""
        }]
    )
    
    import json
    try:
        return json.loads(response.content[0].text)
    except:
        return {"raw": response.content[0].text}
```

---

## 代码分析实战

Claude 对代码有很强的理解能力：

```python
def analyze_code(code: str, language: str = "python") -> str:
    """
    分析代码并生成文档
    
    Args:
        code: 源代码
        language: 编程语言
    """
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"""请分析以下 {language} 代码，并提供：

1. **功能概述**：代码的主要功能是什么
2. **核心逻辑**：关键算法和处理流程
3. **代码质量**：可读性、可维护性评估
4. **潜在问题**：可能的 bug 或性能问题
5. **改进建议**：优化和重构建议
6. **使用示例**：如何调用这段代码

代码：
```{language}
{code}
```"""
        }]
    )
    
    return response.content[0].text

# 使用示例
code_sample = '''
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
'''

analysis = analyze_code(code_sample, "python")
print(analysis)
```

---

## 成本优化实践

### 成本估算

```python
def estimate_cost(input_tokens: int, output_tokens: int, model: str) -> float:
    """估算 API 调用成本"""
    
    # 价格参考（实际价格以官方为准）
    prices = {
        "claude-haiku-3-5": {"input": 0.25, "output": 1.25},      # 每百万 token
        "claude-sonnet-4-6": {"input": 3.0, "output": 15.0},
        "claude-opus-4": {"input": 15.0, "output": 75.0}
    }
    
    if model not in prices:
        return 0.0
    
    price = prices[model]
    input_cost = (input_tokens / 1_000_000) * price["input"]
    output_cost = (output_tokens / 1_000_000) * price["output"]
    
    return input_cost + output_cost
```

### 成本优化技巧

```python
def optimized_summary(text: str) -> str:
    """成本优化的文档总结"""
    
    # 技巧1：使用更便宜的模型处理简单任务
    model = "claude-haiku-3-5"  # 成本较低
    
    # 技巧2：限制输出长度
    max_tokens = 500
    
    # 技巧3：精简提示词
    prompt = f"总结要点：\n{text}"
    
    response = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.content[0].text
```

---

## 完整示例：智能文档助手

```python
from anthropic import Anthropic
import os
from typing import Optional

class DocumentAssistant:
    """智能文档助手"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.client = Anthropic(
            api_key=api_key or os.getenv("ANTHROPIC_API_KEY")
        )
    
    def analyze(self, text: str, task: str = "summary") -> str:
        """
        文档分析
        
        Args:
            text: 文档内容
            task: 任务类型 (summary/extract/qa/translate)
        """
        prompts = {
            "summary": "请总结以下文档的核心内容和关键观点：\n\n{text}",
            "extract": "请从以下文档中提取所有关键信息，包括数字、日期、人名、地点等：\n\n{text}",
            "qa": "请分析以下文档，并列出可能的读者问答：\n\n{text}",
            "translate": "请将以下文档翻译成英文（如果是英文则翻译成中文）：\n\n{text}"
        }
        
        prompt = prompts.get(task, prompts["summary"]).format(text=text)
        
        response = self.client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2048,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return response.content[0].text
    
    def ask(self, document: str, question: str) -> str:
        """基于文档的问答"""
        response = self.client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            messages=[{
                "role": "user",
                "content": f"""基于以下文档内容回答问题。如果文档中没有相关信息，请说明。

文档：
{document}

问题：{question}"""
            }]
        )
        
        return response.content[0].text
    
    def compare(self, doc1: str, doc2: str) -> str:
        """对比两篇文档"""
        response = self.client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=2048,
            messages=[{
                "role": "user",
                "content": f"""请对比分析以下两篇文档：

【文档A】
{doc1}

【文档B】
{doc2}

请从以下维度进行对比：
1. 主题差异
2. 观点差异
3. 论据差异
4. 结论差异"""
            }]
        )
        
        return response.content[0].text

# 使用示例
if __name__ == "__main__":
    assistant = DocumentAssistant()
    
    # 读取文档
    with open("article.txt", "r", encoding="utf-8") as f:
        doc = f.read()
    
    # 总结
    print("=== 文档总结 ===")
    print(assistant.analyze(doc, "summary"))
    
    # 问答
    print("\n=== 文档问答 ===")
    print(assistant.ask(doc, "这篇文章的主要观点是什么？"))
```

---

## 常见问题

### 1. 文档超过上下文限制怎么办？

使用分块策略，将大文档拆分成多个小块分别处理，然后合并结果。

### 2. 如何处理表格和结构化数据？

在提示词中明确要求保留结构，或使用 JSON 格式输出。

### 3. 长文本处理速度慢怎么办？

- 考虑使用 Haiku 模型处理简单任务
- 减少不必要的输出长度
- 使用流式输出提升体验

---

## 总结

**Claude 长文本处理的核心优势**：
- 支持 200K+ 超长上下文
- 适合复杂文档分析
- 结构化输出能力强

**最佳实践**：
- 根据文档大小选择处理策略
- 合理使用分块和合并
- 控制输出长度以节省成本
- 使用流式输出提升体验

---

## 相关阅读

- [Claude API 如何调用？Python 接入示例与参数说明](/blog/claude-api/claude-api-python-guide)
- [Claude API 流式输出完整指南](/blog/claude-api/claude-api-streaming-guide)
- [Claude API 最佳实践：提示词优化与成本控制](/blog/claude-api/claude-api-best-practices)
- [Claude 模型版本对比：Haiku vs Sonnet vs Opus 如何选择](/blog/claude-api/claude-models-comparison)

---
