---
title: AI Agent 工作流要从"会执行"走向"可复用"
slug: /blog/claude-api/ai-agent-workflow-reusability.html
description: 深入探讨 AI Agent 工作流的复用性设计，从基础执行能力到可复用工作流的演进路径，包含模块化设计、状态管理、工具编排等核心实践。
keywords:
  - AI Agent 工作流
  - Agent 复用
  - Claude API
  - 工作流设计
  - AI Agent 架构
---

# AI Agent 工作流要从"会执行"走向"可复用"

先说结论：

**当前大多数 AI Agent 还停留在"会执行"的阶段——能完成特定任务，但无法跨项目、跨场景复用。要真正释放 AI Agent 的生产力，必须走向"可复用"的设计模式。**

这篇文章探讨如何设计可复用的 AI Agent 工作流，包括模块化架构、状态管理、工具编排等核心实践。

**国内最推荐 Claude API 中转站平台**：
> Claude API 中转站 平台地址：<https://quanzil.com>

> Claude API 中转站 平台地址：<https://jeniya.net>

> Claude API 中转站 平台地址：<https://jeniya.cn>

> Claude API 中转站 平台地址：<https://jeniya.chat>

---

## 从"执行"到"复用"的演进

### 当前的痛点

很多团队在使用 AI Agent 时会遇到这样的问题：

```
项目A：写了一个代码审查 Agent
项目B：需要类似功能，但完全重写
项目C：又是另一个版本...
```

每个项目都是独立开发，相同的功能无法复用，导致：
- 开发效率低
- 维护成本高
- 质量难以统一

### 什么是"可复用"的 Agent 工作流

可复用的 Agent 工作流具备以下特征：

| 特征 | 说明 |
|------|------|
| **模块化** | 核心逻辑拆分为独立模块，可单独使用 |
| **可配置** | 行为通过参数配置，适应不同场景 |
| **可组合** | 多个模块可以灵活组合，形成新流程 |
| **可测试** | 每个模块可单独测试，确保质量 |

---

## 模块化设计架构

### 1. 核心组件划分

一个可复用的 Agent 系统应该包含以下核心组件：

```
┌─────────────────────────────────────────────────────┐
│                   Agent Engine                       │
├─────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Planner  │  │ Executor │  │ Memory   │          │
│  │ 任务规划  │  │ 执行器   │  │ 记忆管理  │          │
│  └──────────┘  └──────────┘  └──────────┘          │
├─────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Tools    │  │ Storage  │  │ Config   │          │
│  │ 工具集   │  │ 存储层   │  │ 配置管理  │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘
```

### 2. 基础框架实现

```python
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field
from enum import Enum

class AgentState(Enum):
    IDLE = "idle"
    PLANNING = "planning"
    EXECUTING = "executing"
    WAITING = "waiting"
    COMPLETED = "completed"
    ERROR = "error"

@dataclass
class Task:
    """任务定义"""
    id: str
    description: str
    context: Dict[str, Any] = field(default_factory=dict)
    result: Optional[Any] = None
    status: AgentState = AgentState.IDLE

@dataclass
class ToolResult:
    """工具执行结果"""
    tool_name: str
    success: bool
    data: Any
    error: Optional[str] = None

class BaseTool(ABC):
    """工具基类 - 所有工具都继承此基类"""
    
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
    
    @abstractmethod
    async def execute(self, params: Dict[str, Any]) -> ToolResult:
        """执行工具逻辑"""
        pass
    
    def validate_params(self, params: Dict[str, Any]) -> bool:
        """参数验证 - 可被重写"""
        return True

class AgentContext:
    """Agent 上下文 - 管理状态和共享数据"""
    
    def __init__(self):
        self.tasks: List[Task] = []
        self.tools: Dict[str, BaseTool] = {}
        self.memory: Dict[str, Any] = {}
        self.config: Dict[str, Any] = {}
    
    def register_tool(self, tool: BaseTool):
        """注册工具"""
        self.tools[tool.name] = tool
    
    def get_tool(self, name: str) -> Optional[BaseTool]:
        """获取工具"""
        return self.tools.get(name)
    
    def set_config(self, key: str, value: Any):
        """设置配置"""
        self.config[key] = value
    
    def get_config(self, key: str, default: Any = None) -> Any:
        """获取配置"""
        return self.config.get(key, default)
```

### 3. 任务规划器

```python
class TaskPlanner:
    """任务规划器 - 将复杂任务分解为可执行步骤"""
    
    def __init__(self, llm_client, tools: List[BaseTool]):
        self.llm = llm_client
        self.tools = {t.name: t for t in tools}
    
    async def plan(self, task: Task) -> List[Dict[str, Any]]:
        """规划任务步骤"""
        
        # 构建工具描述
        tool_descriptions = "\n".join([
            f"- {name}: {tool.description}"
            for name, tool in self.tools.items()
        ])
        
        prompt = f"""请将以下任务分解为具体的执行步骤。

任务：{task.description}

可用工具：
{tool_descriptions}

请以 JSON 数组格式返回步骤，每个步骤包含：
- step: 步骤序号
- action: 要执行的动作
- tool: 使用的工具名称
- params: 传递给工具的参数

返回格式：
[{{"step": 1, "action": "xxx", "tool": "xxx", "params": {{}}}}]"""
        
        response = await self.llm.chat(prompt)
        steps = self._parse_steps(response)
        
        return steps
    
    def _parse_steps(self, response: str) -> List[Dict[str, Any]]:
        """解析 LLM 返回的步骤"""
        import json
        import re
        
        # 尝试提取 JSON 数组
        match = re.search(r'\[.*\]', response, re.DOTALL)
        if match:
            return json.loads(match.group())
        
        return []
```

### 4. 执行引擎

```python
class AgentExecutor:
    """执行引擎 - 负责任务的实际执行"""
    
    def __init__(self, context: AgentContext):
        self.context = context
        self.history: List[Dict[str, Any]] = []
    
    async def execute_task(self, task: Task, plan: List[Dict[str, Any]]) -> Task:
        """执行任务"""
        task.status = AgentState.EXECUTING
        
        for step in plan:
            try:
                result = await self._execute_step(step)
                self.history.append({
                    "step": step,
                    "result": result,
                    "success": True
                })
                
                # 检查是否需要根据结果调整计划
                if self._should_replan(result):
                    # 重新规划
                    task.context["last_result"] = result
                    new_plan = await self._replan(task, result)
                    plan.extend(new_plan)
                
            except Exception as e:
                self.history.append({
                    "step": step,
                    "error": str(e),
                    "success": False
                })
                task.status = AgentState.ERROR
                task.result = {"error": str(e)}
                break
        
        if task.status != AgentState.ERROR:
            task.status = AgentState.COMPLETED
            task.result = self._aggregate_results()
        
        return task
    
    async def _execute_step(self, step: Dict[str, Any]) -> ToolResult:
        """执行单个步骤"""
        tool_name = step.get("tool")
        params = step.get("params", {})
        
        tool = self.context.get_tool(tool_name)
        if not tool:
            raise ValueError(f"Tool not found: {tool_name}")
        
        if not tool.validate_params(params):
            raise ValueError(f"Invalid params for {tool_name}")
        
        return await tool.execute(params)
    
    def _should_replan(self, result: ToolResult) -> bool:
        """判断是否需要重新规划"""
        # 可以根据结果特征决定是否需要调整计划
        return False
    
    def _aggregate_results(self) -> Dict[str, Any]:
        """聚合所有步骤结果"""
        return {
            "steps": len(self.history),
            "results": [
                {"step": h["step"], "result": h.get("result")}
                for h in self.history if h.get("success")
            ]
        }
```

---

## 工具系统设计

### 1. 工具基类与实现

```python
class SearchTool(BaseTool):
    """搜索工具"""
    
    def __init__(self):
        super().__init__(
            name="search",
            description="搜索信息，接受关键词返回搜索结果"
        )
    
    async def execute(self, params: Dict[str, Any]) -> ToolResult:
        query = params.get("query", "")
        # 实际搜索逻辑
        results = await self._search(query)
        return ToolResult(
            tool_name=self.name,
            success=True,
            data=results
        )
    
    async def _search(self, query: str) -> List[Dict[str, Any]]:
        # 实现搜索逻辑
        return [{"title": "Result 1", "url": "..."}]

class CodeAnalysisTool(BaseTool):
    """代码分析工具"""
    
    def __init__(self):
        super().__init__(
            name="code_analysis",
            description="分析代码质量，返回问题和优化建议"
        )
    
    async def execute(self, params: Dict[str, Any]) -> ToolResult:
        code = params.get("code", "")
        language = params.get("language", "python")
        
        # 分析逻辑
        issues = self._analyze(code, language)
        
        return ToolResult(
            tool_name=self.name,
            success=True,
            data={"issues": issues, "score": 85}
        )
    
    def validate_params(self, params: Dict[str, Any]) -> bool:
        return "code" in params
    
    def _analyze(self, code: str, language: str) -> List[Dict[str, Any]]:
        # 实现分析逻辑
        return []
```

### 2. 工具注册与发现

```python
class ToolRegistry:
    """工具注册中心 - 统一管理所有可用工具"""
    
    def __init__(self):
        self._tools: Dict[str, BaseTool] = {}
        self._categories: Dict[str, List[str]] = {}
    
    def register(self, tool: BaseTool, category: str = "general"):
        """注册工具"""
        self._tools[tool.name] = tool
        
        if category not in self._categories:
            self._categories[category] = []
        self._categories[category].append(tool.name)
    
    def get(self, name: str) -> Optional[BaseTool]:
        """获取工具"""
        return self._tools.get(name)
    
    def list_by_category(self, category: str) -> List[BaseTool]:
        """按类别获取工具"""
        tool_names = self._categories.get(category, [])
        return [self._tools[name] for name in tool_names if name in self._tools]
    
    def list_all(self) -> List[BaseTool]:
        """列出所有工具"""
        return list(self._tools.values())

# 使用示例
registry = ToolRegistry()
registry.register(SearchTool(), "information")
registry.register(CodeAnalysisTool(), "analysis")
```

---

## 记忆与状态管理

### 1. 多层记忆系统

```python
class MemorySystem:
    """记忆系统 - 管理 Agent 的记忆能力"""
    
    def __init__(self):
        self.short_term: List[Dict[str, Any]] = []  # 当前会话
        self.long_term: Dict[str, Any] = {}         # 持久存储
        self.working: Dict[str, Any] = {}           # 工作记忆
    
    def remember(self, key: str, value: Any, memory_type: str = "working"):
        """存储记忆"""
        if memory_type == "short":
            self.short_term.append({"key": key, "value": value})
        elif memory_type == "long":
            self.long_term[key] = value
        else:
            self.working[key] = value
    
    def recall(self, key: str, memory_type: str = "working") -> Any:
        """回忆记忆"""
        if memory_type == "short":
            for item in reversed(self.short_term):
                if item["key"] == key:
                    return item["value"]
        elif memory_type == "long":
            return self.long_term.get(key)
        else:
            return self.working.get(key)
    
    def clear_short_term(self):
        """清空短期记忆"""
        self.short_term.clear()
    
    def compact_short_term(self, max_items: int = 50):
        """压缩短期记忆，保留关键信息"""
        if len(self.short_term) > max_items:
            # 保留最近的和重要的
            self.short_term = self.short_term[-max_items:]
```

### 2. 会话状态管理

```python
class SessionManager:
    """会话管理器 - 管理多轮对话状态"""
    
    def __init__(self, max_turns: int = 50):
        self.max_turns = max_turns
        self.sessions: Dict[str, List[Dict[str, Any]]] = {}
    
    def create_session(self, session_id: str) -> str:
        """创建新会话"""
        self.sessions[session_id] = []
        return session_id
    
    def add_turn(self, session_id: str, role: str, content: str):
        """添加对话轮次"""
        if session_id not in self.sessions:
            self.create_session(session_id)
        
        self.sessions[session_id].append({
            "role": role,
            "content": content
        })
        
        # 限制会话长度
        if len(self.sessions[session_id]) > self.max_turns:
            # 压缩早期消息
            self.sessions[session_id] = self._compact_session(
                self.sessions[session_id]
            )
    
    def get_history(self, session_id: str) -> List[Dict[str, Any]]:
        """获取会话历史"""
        return self.sessions.get(session_id, [])
    
    def _compact_session(self, turns: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """压缩会话历史"""
        # 保留系统提示和最近的消息
        if len(turns) <= self.max_turns:
            return turns
        
        # 简单策略：保留首尾
        system = turns[0] if turns[0]["role"] == "system" else None
        recent = turns[-(self.max_turns - 1):]
        
        if system:
            return [system] + recent
        return recent
```

---

## 工作流编排

### 1. 流程定义与执行

```python
from typing import Callable, Awaitable
import asyncio

class WorkflowStep:
    """工作流步骤"""
    
    def __init__(
        self,
        name: str,
        handler: Callable[[AgentContext], Awaitable[Any]],
        condition: Optional[Callable[[AgentContext], bool]] = None,
        on_error: Optional[Callable[[Exception, AgentContext], None]] = None
    ):
        self.name = name
        self.handler = handler
        self.condition = condition
        self.on_error = on_error

class Workflow:
    """工作流 - 编排多个步骤"""
    
    def __init__(self, name: str):
        self.name = name
        self.steps: List[WorkflowStep] = []
    
    def add_step(
        self,
        name: str,
        handler: Callable[[AgentContext], Awaitable[Any]],
        condition: Optional[Callable[[AgentContext], bool]] = None,
        on_error: Optional[Callable[[Exception, AgentContext], None]] = None
    ):
        """添加步骤"""
        step = WorkflowStep(name, handler, condition, on_error)
        self.steps.append(step)
        return self  # 支持链式调用
    
    async def execute(self, context: AgentContext) -> Dict[str, Any]:
        """执行工作流"""
        results = {}
        
        for step in self.steps:
            # 检查条件
            if step.condition and not step.condition(context):
                continue
            
            try:
                result = await step.handler(context)
                results[step.name] = {"success": True, "data": result}
            except Exception as e:
                results[step.name] = {"success": False, "error": str(e)}
                
                if step.on_error:
                    step.on_error(e, context)
                else:
                    # 默认错误处理：停止执行
                    break
        
        return results
```

### 2. 预定义工作流模板

```python
# 代码审查工作流
def create_code_review_workflow() -> Workflow:
    workflow = Workflow("code_review")
    
    # 步骤1：接收代码
    workflow.add_step(
        "receive_code",
        lambda ctx: ctx.get_config("code")
    )
    
    # 步骤2：静态分析
    workflow.add_step(
        "static_analysis",
        lambda ctx: asyncio.create_task(
            ctx.get_tool("code_analysis").execute({
                "code": ctx.get_config("code"),
                "language": ctx.get_config("language", "python")
            })
        )
    )
    
    # 步骤3：生成报告
    workflow.add_step(
        "generate_report",
        lambda ctx: f"代码审查完成，发现 {len(ctx.memory.get('issues', []))} 个问题"
    )
    
    return workflow

# 文档生成工作流
def create_doc_generation_workflow() -> Workflow:
    workflow = Workflow("doc_generation")
    
    workflow.add_step(
        "analyze_code",
        lambda ctx: ctx.get_tool("code_analysis").execute({
            "code": ctx.get_config("code")
        })
    )
    
    workflow.add_step(
        "generate_docs",
        lambda ctx: ctx.get_tool("doc_generator").execute({
            "analysis": ctx.memory.get("analysis_result")
        })
    )
    
    return workflow
```

---

## 配置管理

### 1. 灵活的参数配置

```python
from dataclasses import dataclass

@dataclass
class AgentConfig:
    """Agent 配置"""
    model: str = "claude-sonnet-4-6"
    temperature: float = 0.7
    max_tokens: int = 2000
    max_retries: int = 3
    timeout: int = 60
    
    # 工具配置
    enabled_tools: List[str] = None
    tool_timeout: int = 30
    
    # 记忆配置
    max_short_term_items: int = 50
    max_session_turns: int = 50
    
    def __post_init__(self):
        if self.enabled_tools is None:
            self.enabled_tools = ["search", "code_analysis"]

class ConfigManager:
    """配置管理器"""
    
    def __init__(self):
        self._configs: Dict[str, AgentConfig] = {}
    
    def register(self, name: str, config: AgentConfig):
        """注册配置"""
        self._configs[name] = config
    
    def get(self, name: str) -> AgentConfig:
        """获取配置"""
        return self._configs.get(name, AgentConfig())
    
    def update(self, name: str, **kwargs):
        """更新配置"""
        if name in self._configs:
            current = self._configs[name]
            for key, value in kwargs.items():
                if hasattr(current, key):
                    setattr(current, key, value)

# 使用示例
config_manager = ConfigManager()
config_manager.register("default", AgentConfig())
config_manager.register(
    "code_review",
    AgentConfig(
        model="claude-opus-4-6",
        temperature=0.3,
        enabled_tools=["code_analysis", "search", "git"]
    )
)
```

---

## 总结

### 可复用设计的关键要点

| 层面 | 实践 |
|------|------|
| **模块化** | 工具、规划器、执行器解耦 |
| **抽象化** | 通过基类和接口实现扩展 |
| **配置化** | 行为通过参数配置而非硬编码 |
| **组合化** | 工作流可灵活组合 |
| **可测试** | 组件独立测试 |

### 进阶方向

1. **工作流市场** - 共享和发现优秀工作流
2. **低代码编排** - 可视化拖拽构建工作流
3. **版本控制** - 工作流的版本管理和回滚
4. **监控与优化** - 运行时性能分析和优化

---

## 相关阅读

- [Claude API 工具使用实战：函数调用与外部工具集成](/blog/claude-api/claude-api-tool-use)
- [Claude API 最佳实践：提示词优化与成本控制](/blog/claude-api/claude-api-best-practices)
- [Claude API 提示词工程实战：从入门到精通的优化技巧](/blog/claude-api/claude-api-prompt-engineering)
- [Claude 模型版本对比：Haiku vs Sonnet vs Opus 如何选择](/blog/claude-api/claude-models-comparison)

---