# AGENTS.md

This file provides guidance to AI coding agents (GitHub Copilot, Claude Code, etc.) when working with this repository.

## Project Overview

Levitate Extension is a VS Code extension for the Levitate DSL (`.lvt` files). Levitate is a build/task scripting language used by ShulkerRDK. The extension provides syntax highlighting, autocompletion, hover docs, document symbols, and diagnostics. See [README.md](README.md) for feature details and installation.

## Common Commands

```bash
pnpm install              # Install dependencies
pnpm run build            # Build client + server bundles
pnpm run watch            # Rebuild on change (for dev)
pnpm run lint             # Biome linter check
pnpm run format           # Biome auto-format
pnpm run package          # Build + create .vsix
```

- Press **F5** in VS Code to launch the Extension Development Host for debugging.
- Git hooks via husky + lint-staged (auto-format on commit).

## Architecture

pnpm monorepo with three packages under `packages/`:

- **client** (`packages/client/src/extension.ts`) — VS Code extension client. Starts the language server via IPC transport, watches `.lvt` files.
- **server** (`packages/server/src/server.ts`) — LSP language server. Registers diagnostics, completion, hover, and document symbols providers.
- **grammar** — TextMate grammar (`lvt.tmLanguage.json`) and language configuration (`language-configuration.json`) for syntax highlighting.

Both client and server are bundled via `esbuild.config.mts` into `dist/` (CommonJS, Node 18 target). The `vscode` module is externalized for the client but bundled for the server.

TypeScript config in `tsconfig.base.json`: strict mode, ES2022 target, Node16 module resolution.

## Language Server Internals

- **languageData.ts** — Single source of truth for all language knowledge: `KEYWORDS`, `SUBCOMMANDS`, `ALIASES`, `ENV_VARS`. Each keyword has a category (`"script"` or `"repl-only"`) and optional subcommands. **When adding new language features, update this file first.**
- **parser.ts** — Line-based parser producing `ParsedLine` objects with tokens, variable refs (`^name^`, `%name%`), expressions (`{...}`), strings, and errors.
- **diagnostics.ts** — Validates documents on content change (300ms debounce). Flags unknown keywords and REPL-only keywords used in scripts.
- **completion.ts** — Context-aware: keyword suggestions at line start, subcommands after a keyword, variable names after `^`, env vars after `%`.
- **hover.ts** — Shows signature + description for keywords, subcommands, aliases, and env vars. Also resolves `var` definitions.
- **symbols.ts** — Document outline for `var`, `run`, `import`, `check`, `ifr` commands.

### Adding a New Keyword/Command

1. Add entry to `KEYWORD_DEFS` in `packages/server/src/languageData.ts` (name, category, subcommands)
2. Add locale strings in both `packages/server/src/locales/en.json` and `zh-cn.json`
3. Optionally update TextMate grammar in `packages/grammar/syntaxes/lvt.tmLanguage.json` for highlighting

### Locale / i18n

- **locale.ts** — Simple key-based i18n with fallback to English. The `t()` function is passed from `server.ts` to all components.
- Locale files: `packages/server/src/locales/en.json` (fallback), `zh-cn.json`
- VS Code extension display strings: `package.nls.json` (English), `package.nls.zh-cn.json` (Chinese)

## Levitate DSL Quick Reference

| Feature       | Syntax           | Example             |
| ------------- | ---------------- | ------------------- |
| Comment       | `# text`         | `# Build script`    |
| Local var     | `var name value` | `var out "./build"` |
| Local var ref | `^name^`         | `^out^`             |
| Env var ref   | `%name%`         | `%project.src%`     |
| Expression    | `{method args}`  | `{env get key}`     |
| String        | `"text"`         | `"hello world"`     |

See `test/fixtures/sample.lvt` for a comprehensive usage example including REPL-only keywords (which trigger diagnostics in scripts).

## Code Style

- Formatter: Biome with tabs, double quotes, recommended rules
- TypeScript strict mode, target ES2022, Node16 module resolution
- No ESLint — Biome handles linting and formatting
- VS Code extension contributions in `package.json` (languages, grammars, settings)

## VS Code Configuration

Extension settings defined in `package.json` under `contributes.configuration`:
| Setting                        | Default | Description                                          |
| ------------------------------ | ------- | ---------------------------------------------------- |
| `levitate.trace.server`        | `off`   | LSP communication trace (`off`/`messages`/`verbose`) |
| `levitate.maxNumberOfProblems` | `100`   | Max diagnostics per document                         |
