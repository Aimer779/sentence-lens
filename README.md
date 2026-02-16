# SentenceLens

SentenceLens 是一个 AI 驱动的英语句子成分分析工具，通过彩色标注和语法树帮助你直观理解句子结构。

## 功能特性

- **AI 句子成分分析** — 调用 OpenAI 兼容 API，自动识别句子中的语法成分
- **彩色标注视图** — 9 种成分（主语、谓语、宾语、补语、定语、状语、从句、连接词、标点）以不同颜色高亮显示
- **交互式语法树** — 层级化展示句子的从句结构
- **中文翻译** — 提供整句翻译和每个词/短语的中文释义
- **语法模式识别** — 识别并标注句子中使用的语法模式
- **成分角色筛选** — 按角色类型过滤，聚焦特定成分
- **支持 OpenAI 兼容 API** — 可配置任意 OpenAI 兼容的 API 端点
- **响应式设计** — 适配桌面端和移动端

## 技术栈

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) 5.9
- [Vite](https://vite.dev/) 7
- [Tailwind CSS](https://tailwindcss.com/) 4
- [lucide-react](https://lucide.dev/) 图标库

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 代码检查
pnpm lint
```

## 配置说明

首次使用时，点击左侧边栏的设置图标配置 API 信息：

- **API Key** — 你的 OpenAI 或兼容服务的 API 密钥
- **Base URL** — API 端点地址（如 `https://api.openai.com/v1`）
- **Model** — 使用的模型名称（如 `gpt-4o`）

配置保存在浏览器的 `localStorage` 中，键名为 `sentence-lens-settings`。

## 项目结构

```
src/
├── App.tsx                  # 主应用组件，处理分析流程
├── main.tsx                 # 入口文件
├── components/
│   ├── InputPanel.tsx       # 句子输入面板
│   ├── ColorAnnotation.tsx  # 彩色标注视图
│   ├── TreeView.tsx         # 语法树视图
│   ├── Sidebar.tsx          # 侧边栏（角色筛选）
│   └── SettingsPanel.tsx    # API 设置面板
├── services/
│   └── ai.ts               # AI API 调用逻辑
├── types/
│   └── analysis.ts          # 分析结果类型定义
└── utils/
    ├── colors.ts            # 颜色映射与角色标签
    └── settings.ts          # 设置读写工具函数
```
