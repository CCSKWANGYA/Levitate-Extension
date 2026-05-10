# Levitate Extension

English | [中文](README_ZH.md)

VSCode extension for the Levitate DSL, providing syntax highlighting and language server support.

## Features

- **Syntax Highlighting** — TextMate grammar with keywords, subcommands, variables, expressions, strings
- **Auto Completion** — Smart suggestions for keywords, subcommands, and variable references
- **Hover Documentation** — View keyword signatures and descriptions on hover
- **Document Symbols** — Outline view showing `var`, `run`, `import`, `check` and more
- **Diagnostics** — Unknown keyword warnings, REPL-only errors, unclosed syntax detection

## Installation

### From VSIX

```bash
# VS Code
code --install-extension levitate-extension-1.0.0.vsix
# VS Code Insiders
code-insiders --install-extension levitate-extension-1.0.0.vsix
```

## Syntax Overview

```
# Comment
var outputDir "./build"
import shulker.magick
copy "%project.src%" "^outputDir%" true
verm sminor
echo "Building version %project.ver%..."
check {env get enablePkg} pkgr zip make "^outputDir%" "./release.zip"
```

### Variable System

| Type        | Declaration          | Reference       |
| ----------- | -------------------- | --------------- |
| Local       | `var name value`     | `^name^`        |
| Environment | `env set name value` | `%name%`        |
| Expression  | —                    | `{method args}` |

### Built-in Environment Variables

| Variable           | Description              |
| ------------------ | ------------------------ |
| `%project.src%`    | Project source directory |
| `%project.name%`   | Project name             |
| `%project.output%` | Project output directory |
| `%project.ver%`    | Current version string   |
| `%project.cache%`  | Project cache directory  |

## Configuration

| Setting                        | Default | Description                         |
| ------------------------------ | ------- | ----------------------------------- |
| `levitate.trace.server`        | `off`   | Language server communication trace |
| `levitate.maxNumberOfProblems` | `100`   | Maximum number of diagnostics       |

## Related Projects

- [ShulkerRDK](https://github.com/LiPolymer/ShulkerRDK) — Host project for Levitate

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

## Acknowledgments

Thanks to [LiPolymer](https://github.com/LiPolymer), the author of [ShulkerRDK](https://github.com/LiPolymer/ShulkerRDK) and [icon](assets/icon.svg)