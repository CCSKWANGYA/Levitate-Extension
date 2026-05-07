# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Levitate Extension is a VS Code extension for the Levitate DSL (`.lvt` files). Levitate is a build/task scripting language used by ShulkerRDK. The extension provides syntax highlighting, autocompletion, hover docs, document symbols, and diagnostics.

## Common Commands

```bash
pnpm install              # Install dependencies
pnpm run build            # Build client + server bundles
pnpm run watch            # Rebuild on change (for dev)
pnpm run lint             # Biome linter check
pnpm run format           # Biome auto-format
pnpm run package          # Build + create .vsix
```

Press **F5** in VS Code to launch the Extension Development Host for debugging.

## Architecture

pnpm monorepo with three packages under `packages/`:

- **client** — VS Code extension client (`extension.ts`). Starts the language server via IPC transport, watches `.lvt` files.
- **server** — LSP language server (`server.ts`). Handles diagnostics, completion, hover, and document symbols. Entry point registers all providers.
- **grammar** — TextMate grammar (`lvt.tmLanguage.json`) and language configuration (`language-configuration.json`) for syntax highlighting.

Both client and server are bundled via `esbuild.config.mts` into `dist/` (CommonJS, Node 18 target). The `vscode` module is externalized for the client but bundled for the server.

## Language Server Internals

- **languageData.ts** — Single source of truth for all language knowledge: `KEYWORDS`, `SUBCOMMANDS`, `ALIASES`, `ENV_VARS`. Each keyword has a category (`"script"` or `"repl-only"`) and optional subcommands. When adding new language features, update this file first.
- **parser.ts** — Line-based parser producing `ParsedLine` objects with tokens, variable refs (`^name^`, `%name%`), expressions (`{...}`), strings, and errors.
- **diagnostics.ts** — Validates documents on content change (300ms debounce). Flags unknown keywords and REPL-only keywords used in scripts.
- **completion.ts** — Context-aware: keyword suggestions at line start, subcommands after a keyword, variable names after `^`, env vars after `%`.
- **hover.ts** — Shows signature + description for keywords, subcommands, aliases, and env vars. Also resolves `var` definitions.
- **symbols.ts** — Document outline for `var`, `run`, `import`, `check`, `ifr` commands.

## Levitate DSL Quick Reference

| Feature | Syntax | Example |
|---------|--------|---------|
| Comment | `# text` | `# Build script` |
| Local var | `var name value` | `var out "./build"` |
| Local var ref | `^name^` | `^out^` |
| Env var ref | `%name%` | `%project.src%` |
| Expression | `{method args}` | `{env get key}` |
| String | `"text"` | `"hello world"` |

## Code Style

- Formatter: Biome with tabs, double quotes, recommended rules
- TypeScript strict mode, target ES2022, Node16 module resolution
- No ESLint — Biome handles linting and formatting
