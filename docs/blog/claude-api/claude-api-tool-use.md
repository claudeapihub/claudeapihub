---
title: 大模型 API 工具使用实战：函数调用与外部工具集成
slug: /blog/claude-api/claude-api-tool-use.html
description: 详细讲解 Claude API 工具使用功能，包括函数调用、工具定义、多工具协作、实际应用场景和最佳实践，帮助开发者构建更强大的 AI 应用。
keywords:
  - Claude API 工具使用
  - Claude API Tool Use
  - Claude API 函数调用
  - Claude API Function Calling
---

# 大模型 API 工具使用实战：函数调用与外部工具集成

先说结论：

**Claude API 是 Anthropic 提供的大模型接口，尤其适合长文本处理、严谨写作、复杂代码分析和高质量内容生成。**  
对于国内开发者来说，实际使用时最常见的问题并不是"Claude 好不好"，而是"**怎么接、怎么调、怎么选版本**"。

**国内最推荐 Claude API 中转站平台**：
> Claude API 中转站 平台地址：<https://jeniya.cn>

> Claude API 中转站 平台地址：<https://jeniya.top>

> Claude API 中转站 平台地址：<https://jeniya.chat>

---

Claude 的工具使用（Tool Use）功能是其核心能力之一，允许模型调用外部函数、查询实时数据、执行操作。这篇文章详细讲解：

- 什么是工具使用
- 如何定义和使用工具
- 多工具协作模式
- 实际应用场景
- 最佳实践和注意事项

---

## 什么是工具使用

工具使用（Tool Use）是指 Claude 可以**调用预定义的外部函数**来完成任务。这让 Claude 能够：

| 能力 | 说明 |
|------|------|
| 获取实时数据 | 查询天气、股价、新闻等 |
| 执行操作 | 发送邮件、创建任务、调用 API |
| 数据处理 | 计算器、数据库查询、格式转换 |
| 外部集成 | 连接第三方服务、内部系统 |

### 工作流程

```
1. 用户提问 → 2. Claude 分析是否需要工具 → 3. 返回工具调用请求
     ↓
6. 生成最终回答 ← 5. Claude 基于结果回答 ← 4. 执行工具并返回结果
```

---

## 基础示例：天气查询

### 定义工具

```python
from anthropic import Anthropic
import os
import json

client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# 定义天气查询工具
tools = [
    {
        "name": "get_weather",
        "description": "获取指定城市的当前天气信息",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "城市名称，如：北京、上海、广州"
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "温度单位，默认为摄氏度"
                }
            },
            "required": ["city"]
        }
    }
]
```

### 实现工具函数

```python
def get_weather(city: str, unit: str = "celsius") -> dict:
    """
    模拟天气查询函数
    实际使用时替换为真实的天气 API
    """
    # 模拟数据
    weather_data = {
        "北京": {"temp": 22, "condition": "晴", "humidity": 45},
        "上海": {"temp": 26, "condition": "多云", "humidity": 65},
        "广州": {"temp": 30, "condition": "晴", "humidity": 75}
    }
    
    if city not in weather_data:
        return {"error": f"未找到城市 {city} 的天气信息"}
    
    data = weather_data[city]
    
    # 温度转换
    if unit == "fahrenheit":
        data["temp"] = data["temp"] * 9/5 + 32
    
    return {
        "city": city,
        "temperature": data["temp"],
        "unit": unit,
        "condition": data["condition"],
        "humidity": data["humidity"]
    }
```

### 完整调用流程

```python
def chat_with_tools(user_message: str):
    """带工具调用的对话"""
    
    # 第一步：发送用户消息
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        tools=tools,
        messages=[
            {"role": "user", "content": user_message}
        ]
    )
    
    # 第二步：检查是否需要调用工具
    if response.stop_reason == "tool_use":
        # 提取工具调用信息
        tool_use = next(
            block for block in response.content 
            if block.type == "tool_use"
        )
        
        tool_name = tool_use.name
        tool_input = tool_use.input
        
        print(f"Claude 请求调用工具: {tool_name}")
        print(f"参数: {json.dumps(tool_input, ensure_ascii=False)}")
        
        # 第三步：执行工具
        if tool_name == "get_weather":
            tool_result = get_weather(**tool_input)
        else:
            tool_result = {"error": f"未知工具: {tool_name}"}
        
        print(f"工具返回结果: {json.dumps(tool_result, ensure_ascii=False)}")
        
        # 第四步：将结果返回给 Claude
        final_response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            tools=tools,
            messages=[
                {"role": "user", "content": user_message},
                {"role": "assistant", "content": response.content},
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "tool_result",
                            "tool_use_id": tool_use.id,
                            "content": json.dumps(tool_result, ensure_ascii=False)
                        }
                    ]
                }
            ]
        )
        
        return final_response.content[0].text
    
    # 如果不需要工具，直接返回回答
    return response.content[0].text

# 使用示例
if __name__ == "__main__":
    result = chat_with_tools("北京今天天气怎么样？")
    print(f"\n回答: {result}")
```

---

## 多工具协作

### 定义多个工具

```python
tools = [
    # 计算器工具
    {
        "name": "calculator",
        "description": "执行数学计算",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "数学表达式，如：2 + 2, 100 * 5, sqrt(16)"
                }
            },
            "required": ["expression"]
        }
    },
    # 搜索工具
    {
        "name": "search",
        "description": "搜索网络获取信息",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "搜索关键词"
                },
                "num_results": {
                    "type": "integer",
                    "description": "返回结果数量，默认3"
                }
            },
            "required": ["query"]
        }
    },
    # 数据库查询工具
    {
        "name": "query_database",
        "description": "查询数据库",
        "input_schema": {
            "type": "object",
            "properties": {
                "table": {
                    "type": "string",
                    "description": "表名"
                },
                "conditions": {
                    "type": "object",
                    "description": "查询条件"
                },
                "fields": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "要查询的字段列表"
                }
            },
            "required": ["table"]
        }
    }
]
```

### 工具执行器

```python
import math
import re

class ToolExecutor:
    """工具执行器"""
    
    def __init__(self):
        self.tools = {
            "calculator": self._calculator,
            "search": self._search,
            "query_database": self._query_database,
            "get_weather": get_weather
        }
    
    def execute(self, tool_name: str, tool_input: dict) -> dict:
        """执行工具"""
        if tool_name not in self.tools:
            return {"error": f"未知工具: {tool_name}"}
        
        try:
            return self.tools[tool_name](**tool_input)
        except Exception as e:
            return {"error": str(e)}
    
    def _calculator(self, expression: str) -> dict:
        """计算器"""
        # 安全的表达式计算
        allowed = set("0123456789+-*/.() sqrt log sin cos tan")
        if not all(c in allowed for c in expression):
            return {"error": "表达式包含不允许的字符"}
        
        try:
            # 支持常用数学函数
            result = eval(expression, {
                "__builtins__": {},
                "sqrt": math.sqrt,
                "log": math.log,
                "sin": math.sin,
                "cos": math.cos,
                "tan": math.tan
            })
            return {"result": result}
        except Exception as e:
            return {"error": f"计算错误: {str(e)}"}
    
    def _search(self, query: str, num_results: int = 3) -> dict:
        """模拟搜索"""
        # 实际使用时接入真实搜索 API
        mock_results = [
            {"title": f"关于 {query} 的结果 1", "url": "https://example.com/1"},
            {"title": f"关于 {query} 的结果 2", "url": "https://example.com/2"},
            {"title": f"关于 {query} 的结果 3", "url": "https://example.com/3"}
        ]
        return {"results": mock_results[:num_results]}
    
    def _query_database(self, table: str, conditions: dict = None, fields: list = None) -> dict:
        """模拟数据库查询"""
        # 实际使用时连接真实数据库
        mock_data = {
            "users": [
                {"id": 1, "name": "张三", "email": "zhangsan@example.com"},
                {"id": 2, "name": "李四", "email": "lisi@example.com"}
            ],
            "orders": [
                {"id": 101, "user_id": 1, "amount": 99.9, "status": "completed"},
                {"id": 102, "user_id": 2, "amount": 199.9, "status": "pending"}
            ]
        }
        
        if table not in mock_data:
            return {"error": f"表 {table} 不存在"}
        
        data = mock_data[table]
        
        # 应用条件过滤（简化示例）
        if conditions:
            data = [
                row for row in data
                if all(row.get(k) == v for k, v in conditions.items())
            ]
        
        # 选择字段
        if fields:
            data = [
                {k: v for k, v in row.items() if k in fields}
                for row in data
            ]
        
        return {"data": data, "count": len(data)}
```

### 多轮工具调用

```python
def multi_tool_chat(user_message: str, max_turns: int = 5):
    """支持多轮工具调用的对话"""
    
    executor = ToolExecutor()
    messages = [{"role": "user", "content": user_message}]
    
    for turn in range(max_turns):
        # 调用 Claude
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1024,
            tools=tools,
            messages=messages
        )
        
        # 检查是否需要工具调用
        if response.stop_reason != "tool_use":
            # 不需要工具，返回最终回答
            return response.content[0].text
        
        # 提取所有工具调用
        tool_uses = [
            block for block in response.content
            if block.type == "tool_use"
        ]
        
        # 执行所有工具
        tool_results = []
        for tool_use in tool_uses:
            result = executor.execute(tool_use.name, tool_use.input)
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": tool_use.id,
                "content": json.dumps(result, ensure_ascii=False)
            })
        
        # 更新消息历史
        messages.append({"role": "assistant", "content": response.content})
        messages.append({"role": "user", "content": tool_results})
    
    return "超过最大工具调用次数"

# 使用示例
if __name__ == "__main__":
    # 复杂查询示例
    result = multi_tool_chat("查询张三的订单金额，然后计算订单总额的 10% 是多少")
    print(result)
```

---

## 实际应用场景

### 场景1：智能客服系统

```python
# 客服工具定义
customer_service_tools = [
    {
        "name": "query_order",
        "description": "查询订单状态",
        "input_schema": {
            "type": "object",
            "properties": {
                "order_id": {
                    "type": "string",
                    "description": "订单号"
                }
            },
            "required": ["order_id"]
        }
    },
    {
        "name": "check_inventory",
        "description": "检查商品库存",
        "input_schema": {
            "type": "object",
            "properties": {
                "product_id": {
                    "type": "string",
                    "description": "商品ID"
                }
            },
            "required": ["product_id"]
        }
    },
    {
        "name": "create_return_request",
        "description": "创建退货申请",
        "input_schema": {
            "type": "object",
            "properties": {
                "order_id": {"type": "string"},
                "reason": {"type": "string"},
                "items": {
                    "type": "array",
                    "items": {"type": "string"}
                }
            },
            "required": ["order_id", "reason"]
        }
    }
]

class CustomerServiceBot:
    """智能客服机器人"""
    
    def __init__(self):
        self.executor = ToolExecutor()
    
    def chat(self, user_message: str) -> str:
        """客服对话"""
        # 实现类似 multi_tool_chat 的逻辑
        # 这里简化展示
        return multi_tool_chat(user_message)

# 使用示例
bot = CustomerServiceBot()
response = bot.chat("我的订单 12345 现在什么状态？")
```

### 场景2：数据分析助手

```python
# 数据分析工具
data_analysis_tools = [
    {
        "name": "get_statistics",
        "description": "获取数据统计信息",
        "input_schema": {
            "type": "object",
            "properties": {
                "dataset": {"type": "string"},
                "metrics": {
                    "type": "array",
                    "items": {"type": "string"}
                }
            },
            "required": ["dataset"]
        }
    },
    {
        "name": "create_chart",
        "description": "创建图表",
        "input_schema": {
            "type": "object",
            "properties": {
                "type": {
                    "type": "string",
                    "enum": ["bar", "line", "pie", "scatter"]
                },
                "data": {"type": "object"},
                "title": {"type": "string"}
            },
            "required": ["type", "data"]
        }
    },
    {
        "name": "export_report",
        "description": "导出分析报告",
        "input_schema": {
            "type": "object",
            "properties": {
                "format": {
                    "type": "string",
                    "enum": ["pdf", "excel", "csv"]
                },
                "content": {"type": "string"}
            },
            "required": ["format", "content"]
        }
    }
]
```

### 场景3：代码助手

```python
# 开发工具
dev_tools = [
    {
        "name": "read_file",
        "description": "读取文件内容",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string"}
            },
            "required": ["path"]
        }
    },
    {
        "name": "write_file",
        "description": "写入文件",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string"},
                "content": {"type": "string"}
            },
            "required": ["path", "content"]
        }
    },
    {
        "name": "run_command",
        "description": "执行命令",
        "input_schema": {
            "type": "object",
            "properties": {
                "command": {"type": "string"},
                "cwd": {"type": "string"}
            },
            "required": ["command"]
        }
    },
    {
        "name": "git_operation",
        "description": "Git 操作",
        "input_schema": {
            "type": "object",
            "properties": {
                "operation": {
                    "type": "string",
                    "enum": ["status", "diff", "commit", "push", "pull"]
                },
                "message": {"type": "string"}
            },
            "required": ["operation"]
        }
    }
]
```

---

## 最佳实践

### 1. 工具描述要清晰

```python
# 不好的描述
{
    "name": "search",
    "description": "搜索"
}

# 好的描述
{
    "name": "search",
    "description": "在网络上搜索信息，返回相关网页标题和摘要。适用于需要查找实时信息、新闻、技术文档等场景。"
}
```

### 2. 参数定义要完整

```python
{
    "name": "send_email",
    "description": "发送邮件",
    "input_schema": {
        "type": "object",
        "properties": {
            "to": {
                "type": "string",
                "description": "收件人邮箱地址"
            },
            "subject": {
                "type": "string",
                "description": "邮件主题，不超过100字"
            },
            "body": {
                "type": "string",
                "description": "邮件正文内容"
            },
            "cc": {
                "type": "array",
                "items": {"type": "string"},
                "description": "抄送列表（可选）"
            }
        },
        "required": ["to", "subject", "body"]
    }
}
```

### 3. 错误处理要完善

```python
def safe_tool_execute(tool_name: str, tool_input: dict) -> dict:
    """安全的工具执行"""
    try:
        # 验证工具存在
        if tool_name not in registered_tools:
            return {
                "error": f"工具 {tool_name} 不存在",
                "available_tools": list(registered_tools.keys())
            }
        
        # 验证参数
        schema = registered_tools[tool_name]["input_schema"]
        validation_error = validate_input(tool_input, schema)
        if validation_error:
            return {"error": f"参数验证失败: {validation_error}"}
        
        # 执行工具
        result = execute_tool(tool_name, tool_input)
        
        return {"success": True, "result": result}
        
    except Exception as e:
        return {"error": f"执行失败: {str(e)}"}

def validate_input(input_data: dict, schema: dict) -> str:
    """验证输入参数"""
    required = schema.get("required", [])
    properties = schema.get("properties", {})
    
    for field in required:
        if field not in input_data:
            return f"缺少必填字段: {field}"
    
    for key, value in input_data.items():
        if key in properties:
            expected_type = properties[key].get("type")
            if expected_type and not isinstance(value, eval(expected_type)):
                return f"字段 {key} 类型错误，期望 {expected_type}"
    
    return None
```

### 4. 安全控制

```python
class SecureToolExecutor:
    """带安全控制的工具执行器"""
    
    def __init__(self):
        self.executor = ToolExecutor()
        self.rate_limiter = {}
        self.sensitive_operations = ["delete", "write_file", "run_command"]
    
    def execute(self, tool_name: str, tool_input: dict, user_id: str = "default") -> dict:
        """执行工具（带安全检查）"""
        
        # 1. 速率限制
        if not self._check_rate_limit(user_id, tool_name):
            return {"error": "操作过于频繁，请稍后再试"}
        
        # 2. 敏感操作确认
        if tool_name in self.sensitive_operations:
            # 实际应用中可以要求用户确认
            print(f"⚠️ 敏感操作: {tool_name}")
        
        # 3. 输入过滤
        sanitized_input = self._sanitize_input(tool_input)
        
        # 4. 执行
        return self.executor.execute(tool_name, sanitized_input)
    
    def _check_rate_limit(self, user_id: str, tool_name: str) -> bool:
        """检查速率限制"""
        # 实现速率限制逻辑
        return True
    
    def _sanitize_input(self, input_data: dict) -> dict:
        """过滤敏感输入"""
        # 移除潜在危险字符
        sanitized = {}
        for k, v in input_data.items():
            if isinstance(v, str):
                # 移除可能的注入代码
                v = v.replace("<script>", "").replace("</script>", "")
            sanitized[k] = v
        return sanitized
```

---

## 注意事项

### 1. 工具数量限制

- 建议每次请求工具数量不超过 10 个
- 工具过多会影响 Claude 的选择准确度

### 2. 响应时间

- 工具调用会增加响应延迟
- 复杂任务可能需要多轮调用
- 考虑使用异步处理

### 3. 成本控制

- 工具调用消耗 token
- 每次调用都会计入费用
- 合理设计工具，减少不必要的调用

### 4. 调试技巧

```python
def debug_tool_call(response):
    """调试工具调用"""
    print(f"停止原因: {response.stop_reason}")
    
    for block in response.content:
        if block.type == "tool_use":
            print(f"工具名称: {block.name}")
            print(f"工具参数: {json.dumps(block.input, ensure_ascii=False, indent=2)}")
```

---

## 总结

**工具使用的核心价值**：

- 扩展 Claude 的能力边界
- 连接外部系统和数据
- 执行实际操作

**最佳实践要点**：

- 清晰定义工具描述
- 完善参数验证
- 做好错误处理
- 注意安全控制
- 合理控制成本

---

## 相关阅读

- [Claude API 如何调用？Python 接入示例与参数说明](/blog/claude-api/claude-api-python-guide)
- [Claude API 提示词工程实战：从入门到精通的优化技巧](/blog/claude-api/claude-api-prompt-engineering)
- [Claude API 错误处理完整指南](/blog/claude-api/claude-api-error-handling)

---

<style>
code {
  background: #f6f8fa;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
}

pre {
  background: #f6f8fa;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
}
</style>