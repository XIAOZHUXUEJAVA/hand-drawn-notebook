# 手绘笔记本

一个模拟真实纸质笔记本体验的数字笔记应用。

在线预览: https://hand-draw-notebook.netlify.app/

## 功能特性

### 核心功能
- 富文本编辑：基于 contentEditable 实现的文本编辑器
- 多种书写工具：钢笔、墨水笔、铅笔、荧光笔、橡皮擦，每种工具有不同的文字样式效果
- 纸张样式：白纸、米黄纸、黄纸、复古纸，支持横线/无线样式
- 笔记本管理：支持创建多个笔记本和分区
- 图片附件：支持上传和管理图片附件

### 数据管理
- 本地存储：未登录时自动保存到浏览器 localStorage
- 云端同步：登录后可将笔记同步到 Supabase 云端

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **动画**: Framer Motion
- **数据库**: Supabase (PostgreSQL)
- **认证**: Supabase Auth

## 快速开始

### 环境要求
- Node.js 20+
- npm / yarn / pnpm

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env.local`，并填入你的 Supabase 配置：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

如果不配置 Supabase，应用仍可正常使用，但仅支持本地存储。

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
notebook/
├── app/                    # Next.js 应用目录
│   ├── auth/              # 认证相关页面
│   ├── login/             # 登录页面
│   ├── register/          # 注册页面
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React 组件
│   ├── Paper.tsx          # 纸张组件
│   ├── NotePage.tsx       # 笔记页面组件
│   ├── Toolbar.tsx        # 工具栏
│   ├── Sidebar.tsx        # 侧边栏
│   └── ...
├── lib/                   # 工具库
│   ├── api/              # API 调用
│   └── supabase/         # Supabase 客户端
├── types/                # TypeScript 类型定义
└── data/                 # 示例数据
```

## 使用说明

### 基本操作
1. 点击顶部工具栏选择书写工具（不同工具有不同的文字样式）
2. 在笔记页面中输入文字
3. 使用底部导航器切换页面
4. 点击"新建笔记"创建新页面
5. 点击"保存"按钮保存笔记
6. 点击书签图标可为笔记添加书签

### 笔记本管理
1. 点击左侧边栏打开笔记本列表
2. 点击"+"创建新笔记本或分区
3. 点击笔记本名称展开/收起分区
4. 点击分区切换到对应笔记

### 云端同步
1. 点击右上角"登录"按钮
2. 注册或登录账号
3. 登录后点击"保存"即可同步到云端
4. 在其他设备登录同一账号可查看同步的笔记

## 许可证

MIT License

