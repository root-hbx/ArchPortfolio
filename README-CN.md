# Arch Linux 桌面模拟

一个模拟 **Arch Linux + Hyprland** 平铺式窗口管理器桌面环境的个人主页，基于 Next.js 和 React 构建。

**在线演示:** [https://root-hbx.github.io/archlinux-web](https://root-hbx.github.io/archlinux-web)

[English](./README.md)

![桌面截图](./public/wallpapers/default.png)

## 技术栈

- **Next.js 14** (App Router) + TypeScript + React 18
- **Tailwind CSS**，使用 Catppuccin Mocha 配色方案
- **Zustand** 状态管理
- **Framer Motion** 动画效果
- **静态导出**，部署至 GitHub Pages

## 功能特性

- **启动动画** — Systemd 风格的开机引导，TTY 登录界面
- **平铺窗口管理器** — 二叉树布局，可拖拽分割手柄，6px 间距
- **终端模拟器** — 支持 `ls`、`cd`、`cat`、`neofetch`、`pacman` 等命令
- **Chrome 浏览器** — 内嵌 iframe 浏览器，含地址栏和导航功能
- **应用启动器** — Rofi 风格的搜索启动浮层
- **多工作区** — 5 个独立工作区自由切换
- **浮动窗口** — 窗口可在平铺和浮动模式间切换

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/root-hbx/archlinux-web.git
cd archlinux-web

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

## 构建

```bash
# 生产构建（静态导出）
npm run build

# 输出在 /out 目录
```

## 快捷键

| 快捷键 | 功能 |
|---|---|
| `Ctrl + Enter` | 新建终端 |
| `Ctrl + D` | 打开/关闭应用启动器 |
| `Ctrl + Q` | 关闭当前窗口 |
| `Ctrl + 1-5` | 切换工作区 |
| `Ctrl + H/J/K/L` | 移动焦点（Vim 方向键） |
| `Ctrl + Space` | 切换浮动模式 |
| `Ctrl + F` | 切换全屏 |

## 项目结构

```
src/
├── app/                  # Next.js App Router
├── components/
│   ├── apps/             # 终端、浏览器、设置等应用
│   ├── boot/             # 启动画面与登录界面
│   ├── desktop/          # 顶栏、底部 Dock、壁纸
│   ├── launcher/         # Rofi 应用启动器
│   └── wm/               # 平铺布局、窗口节点、分割手柄
├── hooks/                # 键盘快捷键
├── lib/
│   ├── terminal/         # 虚拟文件系统、命令、neofetch
│   └── wm/               # 二叉树与布局计算
├── store/                # Zustand 状态管理
└── types/
```

## 许可证

MIT
