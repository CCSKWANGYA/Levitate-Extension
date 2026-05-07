import {
	type Connection,
	type CompletionItem,
	CompletionItemKind,
	type TextDocuments,
} from "vscode-languageserver/node";
import type { TextDocument } from "vscode-languageserver-textdocument";
import { parseLine } from "./parser";
import { t } from "./locale";
import type { LanguageData } from "./languageData";

export function registerCompletion(
	connection: Connection,
	documents: TextDocuments<TextDocument>,
	langData: LanguageData,
): void {
	connection.onCompletion((params): CompletionItem[] => {
		const document = documents.get(params.textDocument.uri);
		if (!document) return [];

		const position = params.position;
		const line = document.getText({
			start: { line: position.line, character: 0 },
			end: position,
		});

		// Context A: First word on line (keyword/alias completion)
		const trimmed = line.trimStart();
		if (
			trimmed.length === 0 ||
			(trimmed === line.trimEnd() && !line.includes(" "))
		) {
			const items: CompletionItem[] = [];

			for (const [name, info] of langData.KEYWORDS) {
				items.push({
					label: name,
					kind: CompletionItemKind.Keyword,
					detail: info.category === "repl-only" ? t("ui.replOnly") : undefined,
					documentation: {
						kind: "markdown",
						value: `**${info.signature}**\n\n${info.description}`,
					},
				});
			}

			for (const [name, info] of langData.ALIASES) {
				items.push({
					label: name,
					kind: CompletionItemKind.Function,
					detail: `${t("ui.aliasFor")} ${info.expandsTo}`,
					documentation: { kind: "markdown", value: info.description },
				});
			}

			return items;
		}

		// Context B: After a keyword that has subcommands
		const parsed = parseLine(line, t);
		if (parsed.keyword && langData.KEYWORDS.has(parsed.keyword)) {
			const kwInfo = langData.KEYWORDS.get(parsed.keyword);
			if (!kwInfo) return [];
			if (kwInfo.subcommands && kwInfo.subcommands.length > 0) {
				return kwInfo.subcommands.map((sc) => {
					const info = langData.SUBCOMMANDS.get(sc);
					return {
						label: sc,
						kind: CompletionItemKind.Method,
						detail: info ? info.description : undefined,
					};
				});
			}
		}

		// Context C: After ^ or %
		const lastChar = line[line.length - 1];
		if (lastChar === "^") {
			// Collect var definitions from the document
			const items: CompletionItem[] = [];
			const docText = document.getText();
			const varPattern = /^var\s+(\S+)/gm;
			for (const match of docText.matchAll(varPattern)) {
				items.push({
					label: match[1],
					kind: CompletionItemKind.Variable,
				});
			}
			return items;
		}

		if (lastChar === "%") {
			return langData.ENV_VARS.map((ev) => ({
				label: ev.name,
				kind: CompletionItemKind.Variable,
				documentation: { kind: "markdown", value: ev.description },
			}));
		}

		return [];
	});
}
