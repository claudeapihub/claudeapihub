---
title: Claude API 视觉能力实战：图像理解与分析完整指南
slug: /blog/claude-api/claude-api-vision-guide.html
description: 详细讲解 Claude API 视觉能力，包括图像输入方式、Base64 编码、URL 传递、多图处理、实际应用场景和最佳实践，帮助开发者构建图像理解应用。
keywords:
  - Claude API 视觉
  - Claude API Vision
  - Claude API 图像识别
  - Claude API 多模态
---

# Claude API 视觉能力实战：图像理解与分析完整指南

先说结论：

**Claude API 是 Anthropic 提供的大模型接口，不仅支持文本处理，还具备强大的视觉理解能力。**  
Claude 可以理解图像内容、分析图表、识别文字、解读界面，为开发者构建多模态应用提供可能。

对于国内开发者来说，实际使用时最常见的问题并不是"Claude 好不好"，而是"**怎么接、怎么调、怎么选版本**"。

**国内最推荐 Claude API 中转站平台**：
> Claude API 中转站 平台地址：<https://jeniya.cn>

> Claude API 中转站 平台地址：<https://jeniya.top>

> Claude API 中转站 平台地址：<https://jeniya.chat>

---

这篇文章详细讲解：

- Claude 视觉能力概述
- 图像输入的多种方式
- 单图与多图处理
- 实际应用场景
- 最佳实践与注意事项

---

## Claude 视觉能力概述

### 支持的图像格式

| 格式 | 说明 |
|------|------|
| PNG | 推荐，无损压缩 |
| JPEG | 推荐，适合照片 |
| WebP | 支持，现代格式 |
| GIF | 支持静态 GIF |

### 支持的模型

所有 Claude 4 系列模型都支持视觉能力：

- `claude-haiku-4-5`
- `claude-sonnet-4-6`
- `claude-opus-4-7`
- `claude-fable-5`

### 能力边界

Claude 视觉能力可以：

| 能力 | 说明 |
|------|------|
| 图像描述 | 详细描述图像内容 |
| 文字识别 | OCR 识别图片中的文字 |
| 图表分析 | 理解柱状图、折线图、饼图等 |
| 界面理解 | 分析 UI 界面、网页截图 |
| 代码识别 | 识别代码截图并理解 |
| 数据提取 | 从图片中提取结构化数据 |
| 对比分析 | 对比多张图片的差异 |

Claude 视觉能力**不擅长**：

- 人脸识别（出于隐私保护）
- 精确的坐标定位
- 视频分析（需要逐帧处理）
- 医学影像诊断

---

## 图像输入方式

### 方式一：Base64 编码

最常用的方式，适合本地图片：

```python
import base64
from anthropic import Anthropic

def encode_image(image_path: str) -> str:
    """将图片编码为 Base64"""
    with open(image_path, "rb") as f:
        return base64.standard_b64encode(f.read()).decode("utf-8")

def get_media_type(image_path: str) -> str:
    """获取图片的 MIME 类型"""
    ext = image_path.lower().split(".")[-1]
    media_types = {
        "png": "image/png",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "webp": "image/webp",
        "gif": "image/gif"
    }
    return media_types.get(ext, "image/jpeg")

# 使用示例
client = Anthropic(api_key="YOUR_API_KEY")

image_path = "screenshot.png"
image_data = encode_image(image_path)
media_type = get_media_type(image_path)

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": media_type,
                        "data": image_data
                    }
                },
                {
                    "type": "text",
                    "text": "请描述这张图片的内容"
                }
            ]
        }
    ]
)

print(response.content[0].text)
```

### 方式二：使用 OpenAI SDK 格式（中转站）

如果你使用兼容 OpenAI 格式的中转站：

```python
from openai import OpenAI
import base64

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://jeniya.cn/v1"
)

# 方法1：Base64 编码
def analyze_image_base64(image_path: str, prompt: str):
    with open(image_path, "rb") as f:
        image_data = base64.b64encode(f.read()).decode("utf-8")
    
    response = client.chat.completions.create(
        model="claude-sonnet-4-6",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{image_data}"
                        }
                    },
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ]
    )
    return response.choices[0].message.content

# 方法2：使用图片 URL
def analyze_image_url(image_url: str, prompt: str):
    response = client.chat.completions.create(
        model="claude-sonnet-4-6",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": image_url
                        }
                    },
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ]
    )
    return response.choices[0].message.content

# 使用示例
result = analyze_image_base64("chart.png", "请分析这个图表的数据趋势")
print(result)

result = analyze_image_url(
    "https://example.com/image.png",
    "这张图片展示了什么？"
)
print(result)
```

---

## 单图处理实战

### 场景1：图像内容描述

```python
def describe_image(image_path: str, detail_level: str = "详细") -> str:
    """
    描述图像内容
    
    Args:
        image_path: 图片路径
        detail_level: 详细程度（简略/详细/专业）
    """
    detail_prompts = {
        "简略": "请用一句话简要描述这张图片",
        "详细": "请详细描述这张图片的内容，包括主体、背景、颜色、构图等",
        "专业": "请从专业角度分析这张图片，包括构图、光线、色彩、主题表达等"
    }
    
    with open(image_path, "rb") as f:
        image_data = base64.b64encode(f.read()).decode("utf-8")
    
    response = client.chat.completions.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{image_data}"}
                    },
                    {"type": "text", "text": detail_prompts[detail_level]}
                ]
            }
        ]
    )
    
    return response.choices[0].message.content
```

### 场景2：OCR 文字识别

```python
def extract_text_from_image(image_path: str) -> dict:
    """
    从图片中提取文字
    
    Returns:
        {
            "text": "识别出的所有文字",
            "structured": "结构化的文字信息（如果有表格等）"
        }
    """
    with open(image_path, "rb") as f:
        image_data = base64.b64encode(f.read()).decode("utf-8")
    
    response = client.chat.completions.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{image_data}"}
                    },
                    {
                        "type": "text",
                        "text": """请识别图片中的所有文字，并按以下格式输出：

1. 完整文字内容（保持原有格式和换行）
2. 如果是表格或结构化内容，额外用 JSON 格式输出

输出格式：
【完整文字】
...

【结构化数据】（如有）
```json
...
```"""
                    }
                ]
            }
        ]
    )
    
    return {"raw_response": response.choices[0].message.content}
```

### 场景3：图表数据分析

```python
def analyze_chart(image_path: str) -> str:
    """
    分析图表数据
    """
    with open(image_path, "rb") as f:
        image_data = base64.b64encode(f.read()).decode("utf-8")
    
    response = client.chat.completions.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{image_data}"}
                    },
                    {
                        "type": "text",
                        "text": """请分析这个图表，包括：

1. 图表类型（柱状图/折线图/饼图等）
2. 数据概览（主要数据点）
3. 数据趋势分析
4. 关键洞察和结论

如果可能，请尝试提取具体数据并用 JSON 格式输出。"""
                    }
                ]
            }
        ]
    )
    
    return response.choices[0].message.content
```

### 场景4：UI 界面分析

```python
def analyze_ui_screenshot(image_path: str) -> str:
    """
    分析 UI 界面截图
    """
    with open(image_path, "rb") as f:
        image_data = base64.b64encode(f.read()).decode("utf-8")
    
    response = client.chat.completions.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{image_data}"}
                    },
                    {
                        "type": "text",
                        "text": """请分析这个界面截图，包括：

1. 界面类型和用途
2. 主要元素和布局
3. 功能模块说明
4. UI/UX 评价和改进建议

请用 Markdown 格式输出。"""
                    }
                ]
            }
        ]
    )
    
    return response.choices[0].message.content
```

### 场景5：代码截图识别

```python
def extract_code_from_screenshot(image_path: str) -> str:
    """
    从代码截图中提取代码
    """
    with open(image_path, "rb") as f:
        image_data = base64.b64encode(f.read()).decode("utf-8")
    
    response = client.chat.completions.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{image_data}"}
                    },
                    {
                        "type": "text",
                        "text": """请识别图片中的代码，并：

1. 输出完整的代码（保持原有格式）
2. 说明代码的编程语言
3. 简要解释代码的功能

输出格式：
【编程语言】
...

【代码】
```语言
...
```

【功能说明】
..."""
                    }
                ]
            }
        ]
    )
    
    return response.choices[0].message.content
```

---

## 多图处理实战

### 基础多图处理

```python
def analyze_multiple_images(image_paths: list, prompt: str) -> str:
    """
    分析多张图片
    
    Args:
        image_paths: 图片路径列表
        prompt: 分析提示词
    """
    content = []
    
    # 添加所有图片
    for i, image_path in enumerate(image_paths):
        with open(image_path, "rb") as f:
            image_data = base64.b64encode(f.read()).decode("utf-8")
        
        content.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/png;base64,{image_data}"}
        })
    
    # 添加文本提示
    content.append({
        "type": "text",
        "text": prompt
    })
    
    response = client.chat.completions.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[{"role": "user", "content": content}]
    )
    
    return response.choices[0].message.content

# 使用示例：对比两张图片
result = analyze_multiple_images(
    ["before.png", "after.png"],
    "请对比这两张图片，说明它们之间的差异"
)
print(result)
```

### 图片对比分析

```python
def compare_images(image1_path: str, image2_path: str) -> str:
    """
    对比两张图片
    """
    def load_image(path):
        with open(path, "rb") as f:
            return base64.b64encode(f.read()).decode("utf-8")
    
    response = client.chat.completions.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{load_image(image1_path)}"}
                    },
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{load_image(image2_path)}"}
                    },
                    {
                        "type": "text",
                        "text": """请对比这两张图片：

1. 相同点
2. 不同点（详细列出）
3. 哪些内容发生了变化
4. 变化的程度评价"""
                    }
                ]
            }
        ]
    )
    
    return response.choices[0].message.content
```

### 图片序列分析

```python
def analyze_image_sequence(image_paths: list, context: str = "") -> str:
    """
    分析图片序列（如 UI 流程、故事板等）
    """
    content = []
    
    for i, image_path in enumerate(image_paths):
        with open(image_path, "rb") as f:
            image_data = base64.b64encode(f.read()).decode("utf-8")
        
        content.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/png;base64,{image_data}"}
        })
    
    prompt = f"""这是一个图片序列（共 {len(image_paths)} 张），{context}

请分析：
1. 每张图片分别展示了什么
2. 图片之间的关系和顺序逻辑
3. 整体流程或故事线
4. 关键变化和转折点"""
    
    content.append({"type": "text", "text": prompt})
    
    response = client.chat.completions.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        messages=[{"role": "user", "content": content}]
    )
    
    return response.choices[0].message.content
```

---

## 实际应用场景

### 场景1：智能文档处理

```python
def process_document_image(image_path: str) -> dict:
    """
    处理文档图片（发票、合同、表格等）
    """
    with open(image_path, "rb") as f:
        image_data = base64.b64encode(f.read()).decode("utf-8")
    
    response = client.chat.completions.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{image_data}"}
                    },
                    {
                        "type": "text",
                        "text": """请识别这份文档并提取关键信息：

1. 文档类型
2. 关键字段和值（用 JSON 格式输出）
3. 重要数字和日期
4. 需要关注的事项

输出格式：
{
  "document_type": "文档类型",
  "fields": {
    "字段名": "值",
    ...
  },
  "important_numbers": [...],
  "dates": [...],
  "notes": [...]
}"""
                    }
                ]
            }
        ]
    )
    
    return response.choices[0].message.content
```

### 场景2：产品图片分析

```python
def analyze_product_image(image_path: str) -> str:
    """
    分析产品图片
    """
    with open(image_path, "rb") as f:
        image_data = base64.b64encode(f.read()).decode("utf-8")
    
    response = client.chat.completions.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{image_data}"}
                    },
                    {
                        "type": "text",
                        "text": """请分析这个产品图片，并提供：

1. 产品类型和名称
2. 产品特征描述
3. 适用场景
4. 产品描述文案建议（用于电商）
5. 标签建议"""
                    }
                ]
            }
        ]
    )
    
    return response.choices[0].message.content
```

### 场景3：截图自动化测试

```python
def test_ui_screenshot(image_path: str, expected_elements: list) -> dict:
    """
    自动化 UI 测试：检查截图是否包含预期元素
    """
    with open(image_path, "rb") as f:
        image_data = base64.b64encode(f.read()).decode("utf-8")
    
    elements_str = "、".join(expected_elements)
    
    response = client.chat.completions.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{image_data}"}
                    },
                    {
                        "type": "text",
                        "text": f"""这是一个 UI 界面截图。请检查以下元素是否存在：

预期元素：{elements_str}

请用 JSON 格式输出检查结果：
{{
  "all_present": true/false,
  "elements": {{
    "元素名": {{"present": true/false, "description": "位置描述"}}
  }},
  "missing_elements": [...],
  "additional_notes": "..."
}}"""
                    }
                ]
            }
        ]
    )
    
    return response.choices[0].message.content
```

### 场景4：社交媒体内容分析

```python
def analyze_social_media_image(image_path: str) -> dict:
    """
    分析社交媒体图片内容
    """
    with open(image_path, "rb") as f:
        image_data = base64.b64encode(f.read()).decode("utf-8")
    
    response = client.chat.completions.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{image_data}"}
                    },
                    {
                        "type": "text",
                        "text": """请分析这张社交媒体图片：

1. 内容类型（风景/人物/产品/文字等）
2. 视觉风格（色调、构图、氛围）
3. 情感倾向（正面/负面/中性）
4. 适合的场景和受众
5. 配文建议"""
                    }
                ]
            }
        ]
    )
    
    return response.choices[0].message.content
```

---

## 高级封装：通用视觉处理类

```python
import base64
from openai import OpenAI
from typing import Union, List, Optional

class ClaudeVision:
    """Claude 视觉能力封装类"""
    
    def __init__(self, api_key: str, base_url: str = "https://jeniya.cn/v1"):
        self.client = OpenAI(api_key=api_key, base_url=base_url)
    
    def _load_image(self, image_source: str) -> str:
        """加载图片，支持路径和 URL"""
        if image_source.startswith("http"):
            return image_source
        
        with open(image_source, "rb") as f:
            return f"data:image/png;base64,{base64.b64encode(f.read()).decode('utf-8')}"
    
    def analyze(
        self,
        image: Union[str, List[str]],
        prompt: str,
        model: str = "claude-sonnet-4-6",
        max_tokens: int = 2048
    ) -> str:
        """
        分析图片
        
        Args:
            image: 图片路径、URL 或列表
            prompt: 分析提示词
            model: 模型名称
            max_tokens: 最大输出长度
            
        Returns:
            分析结果
        """
        content = []
        
        # 处理单张或多张图片
        images = [image] if isinstance(image, str) else image
        for img in images:
            content.append({
                "type": "image_url",
                "image_url": {"url": self._load_image(img)}
            })
        
        content.append({"type": "text", "text": prompt})
        
        response = self.client.chat.completions.create(
            model=model,
            max_tokens=max_tokens,
            messages=[{"role": "user", "content": content}]
        )
        
        return response.choices[0].message.content
    
    def describe(self, image: str, detail: str = "详细") -> str:
        """快速描述图片"""
        prompts = {
            "简略": "用一句话描述这张图片",
            "详细": "详细描述这张图片的内容",
            "专业": "从专业角度分析这张图片"
        }
        return self.analyze(image, prompts.get(detail, prompts["详细"]))
    
    def ocr(self, image: str) -> str:
        """OCR 文字识别"""
        return self.analyze(
            image,
            "请识别图片中的所有文字，保持原有格式输出"
        )
    
    def extract_data(self, image: str, fields: List[str]) -> str:
        """提取结构化数据"""
        fields_str = "、".join(fields)
        return self.analyze(
            image,
            f"请从图片中提取以下信息：{fields_str}。用 JSON 格式输出。"
        )
    
    def compare(self, image1: str, image2: str, aspect: str = "整体") -> str:
        """对比两张图片"""
        return self.analyze(
            [image1, image2],
            f"请对比这两张图片的{aspect}方面，说明相同点和不同点"
        )


# 使用示例
if __name__ == "__main__":
    vision = ClaudeVision(api_key="YOUR_API_KEY")
    
    # 描述图片
    desc = vision.describe("photo.jpg", detail="详细")
    print("图片描述：", desc)
    
    # OCR 识别
    text = vision.ocr("document.png")
    print("识别文字：", text)
    
    # 提取数据
    data = vision.extract_data("invoice.jpg", ["发票号", "金额", "日期", "公司名称"])
    print("提取数据：", data)
    
    # 对比图片
    diff = vision.compare("v1.png", "v2.png", aspect="UI设计")
    print("对比结果：", diff)
```

---

## 限制与注意事项

### 1. 图片大小限制

| 限制项 | 说明 |
|-------|------|
| 单张图片大小 | 建议不超过 5MB |
| 图片数量 | 单次请求建议不超过 20 张 |
| 总 token 消耗 | 图片会消耗大量 token |

### 2. Token 消耗估算

图片会消耗输入 token，估算方法：

```python
def estimate_image_tokens(width: int, height: int) -> int:
    """
    估算图片消耗的 token 数
    
    规则：
    - 小于 200x200：约 85 tokens
    - 其他：约 (width * height) / 750 tokens
    """
    if width <= 200 and height <= 200:
        return 85
    return int(width * height / 750)

# 示例
print(estimate_image_tokens(1920, 1080))  # 约 2764 tokens
print(estimate_image_tokens(800, 600))    # 约 640 tokens
```

### 3. 图片优化建议

```python
from PIL import Image
import io
import base64

def optimize_image(
    image_path: str,
    max_width: int = 1920,
    max_height: int = 1080,
    quality: int = 85
) -> str:
    """
    优化图片大小
    
    Args:
        image_path: 图片路径
        max_width: 最大宽度
        max_height: 最大高度
        quality: JPEG 质量
        
    Returns:
        Base64 编码的优化后图片
    """
    img = Image.open(image_path)
    
    # 调整大小
    if img.width > max_width or img.height > max_height:
        img.thumbnail((max_width, max_height))
    
    # 转换为 RGB（如果需要）
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    
    # 压缩
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=quality)
    
    return base64.b64encode(buffer.getvalue()).decode("utf-8")
```

### 4. 错误处理

```python
def safe_image_analyze(image_path: str, prompt: str, max_retries: int = 3) -> str:
    """安全的图片分析，带错误处理"""
    
    for attempt in range(max_retries):
        try:
            # 检查文件是否存在
            if not os.path.exists(image_path):
                return f"错误：文件不存在 {image_path}"
            
            # 检查文件大小
            file_size = os.path.getsize(image_path)
            if file_size > 10 * 1024 * 1024:  # 10MB
                return "错误：图片文件过大，请压缩后重试"
            
            # 尝试分析
            return vision.analyze(image_path, prompt)
            
        except Exception as e:
            if attempt < max_retries - 1:
                print(f"第 {attempt + 1} 次尝试失败：{e}")
                continue
            return f"分析失败：{str(e)}"
```

---

## 最佳实践

### 1. 提示词优化

```python
# 不好的提示词
"分析这张图"

# 好的提示词
"""
请分析这张图表，具体说明：
1. 图表类型是什么？
2. 主要数据点有哪些？
3. 趋势如何？
4. 有什么关键洞察？

请用 Markdown 格式输出，数据部分用表格呈现。
"""
```

### 2. 分步骤处理复杂任务

```python
def complex_image_analysis(image_path: str) -> dict:
    """复杂图片分析：分步骤处理"""
    
    # 第一步：识别图片类型
    type_result = vision.analyze(
        image_path,
        "这是什么类型的图片？（图表/文档/照片/UI截图/其他）"
    )
    
    # 第二步：根据类型选择处理方式
    if "图表" in type_result:
        detail = vision.analyze(image_path, "详细分析这个图表的数据和趋势")
    elif "文档" in type_result:
        detail = vision.ocr(image_path)
    elif "UI" in type_result:
        detail = vision.analyze(image_path, "分析这个UI界面的布局和功能")
    else:
        detail = vision.describe(image_path)
    
    return {
        "type": type_result,
        "detail": detail
    }
```

### 3. 批量处理

```python
import concurrent.futures
from typing import List, Dict

def batch_analyze_images(
    image_paths: List[str],
    prompt: str,
    max_workers: int = 5
) -> List[Dict]:
    """批量分析图片"""
    
    results = []
    
    def process_single(path):
        try:
            result = vision.analyze(path, prompt)
            return {"path": path, "success": True, "result": result}
        except Exception as e:
            return {"path": path, "success": False, "error": str(e)}
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(process_single, p) for p in image_paths]
        for future in concurrent.futures.as_completed(futures):
            results.append(future.result())
    
    return results
```

---

## 总结

**Claude 视觉能力的核心价值**：

- 无需专门训练即可理解图像
- 支持多种图像处理场景
- 与文本能力无缝结合
- 简单易用的 API 接口

**适用场景**：

| 场景 | 效果 |
|------|------|
| 文档 OCR | ⭐⭐⭐⭐⭐ |
| 图表分析 | ⭐⭐⭐⭐⭐ |
| UI 理解 | ⭐⭐⭐⭐ |
| 图片描述 | ⭐⭐⭐⭐ |
| 数据提取 | ⭐⭐⭐⭐ |

**注意事项**：

- 注意图片大小和 token 消耗
- 提供清晰的提示词
- 对敏感图片做好处理
- 做好错误处理和重试机制

---

## 相关阅读

- [Claude API 如何调用？Python 接入示例与参数说明](/blog/claude-api/claude-api-python-guide)
- [Claude API 工具使用实战：函数调用与外部工具集成](/blog/claude-api/claude-api-tool-use)
- [Claude API 最佳实践：提示词优化与成本控制](/blog/claude-api/claude-api-best-practices)

---
