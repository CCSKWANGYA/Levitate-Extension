# Levitate Extension

[English](README.md) | 中文

Levitate DSL 的 VSCode 扩展，提供语法高亮和语言服务器支持。

## 功能

- **语法高亮** — 基于 TextMate 语法，支持关键字、子命令、变量、表达式、字符串等
- **自动补全** — 关键字、子命令、变量引用的智能提示
- **悬停文档** — 鼠标悬停查看关键字签名和说明
- **文档符号** — 大纲视图显示 `var`、`run`、`import`、`check` 等结构
- **诊断提示** — 未知关键字警告、REPL-only 关键字错误、未闭合语法检查

## 安装

### 从 VSIX 安装

```bash
# VS Code
code --install-extension levitate-extension-1.0.0.vsix
# VS Code Insiders
code-insiders --install-extension levitate-extension-1.0.0.vsix
```

## 语法概览

```
# 注释
var outputDir "./build"
import shulker.magick
copy "%project.src%" "^outputDir%" true
verm sminor
echo "Building version %project.ver%..."
check {env get enablePkg} pkgr zip make "^outputDir%" "./release.zip"
```

### 变量系统

| 类型     | 声明                 | 引用            |
| -------- | -------------------- | --------------- |
| 局部变量 | `var name value`     | `^name^`        |
| 环境变量 | `env set name value` | `%name%`        |
| 表达式   | —                    | `{method args}` |

### 内置环境变量

| 变量               | 说明         |
| ------------------ | ------------ |
| `%project.src%`    | 项目源目录   |
| `%project.name%`   | 项目名称     |
| `%project.output%` | 项目输出目录 |
| `%project.ver%`    | 当前版本号   |
| `%project.cache%`  | 项目缓存目录 |

## 配置项

| 设置                           | 默认值 | 说明               |
| ------------------------------ | ------ | ------------------ |
| `levitate.trace.server`        | `off`  | 语言服务器通信日志 |
| `levitate.maxNumberOfProblems` | `100`  | 最大诊断数量       |

## 相关项目

- [ShulkerRDK](https://github.com/LiPolymer/ShulkerRDK) — Levitate 的宿主项目

## 贡献

请参阅[贡献指南](CONTRIBUTING_ZH.md)了解如何参与贡献。

## 行为准则

本项目遵循[贡献者行为准则](CODE_OF_CONDUCT_ZH.md)。

## 致谢

感谢 [ShulkerRDK](https://github.com/LiPolymer/ShulkerRDK) 以及 [图标](assets/icon.svg) 的作者 [LiPolymer](https://github.com/LiPolymer)
