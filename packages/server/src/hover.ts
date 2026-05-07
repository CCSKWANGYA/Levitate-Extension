import {
	type Connection,
	type Hover,
	MarkupKind,
	type TextDocuments,
} from "vscode-languageserver/node";
import type { TextDocument } from "vscode-languageserver-textdocument";
import { t } from "./locale";
import type { LanguageData } from "./languageData";

export function registerHover(
	connection: Connection,
	documents: TextDocuments<TextDocument>,
	langData: LanguageData,
): void {
	connection.onHover((params): Hover | undefined => {
		const document = documents.get(params.textDocument.uri);
		if (!document) return undefined;

		const position = params.position;
		const lineText = document.getText({
			start: { line: position.line, character: 0 },
			end: { line: position.line, character: Number.MAX_VALUE },
		});

		const word = getWordAtPosition(lineText, position.character);
		if (!word) return undefined;

		// Check keywords
		const kw = langData.KEYWORDS.get(word);
		if (kw) {
			let md = `**${kw.signature}**\n\n${kw.description}`;
			if (kw.subcommands && kw.subcommands.length > 0) {
				md += `\n\n**${t("ui.subcommands")}** ${kw.subcommands.join(", ")}`;
			}
			return {
				contents: { kind: MarkupKind.Markdown, value: md },
			};
		}

		// Check subcommands
		const sc = langData.SUBCOMMANDS.get(word);
		if (sc) {
			return {
				contents: {
					kind: MarkupKind.Markdown,
					value: `**${sc.name}** — ${sc.description}\n\n${t("ui.usedWith")} ${sc.parentKeywords.join(", ")}`,
				},
			};
		}

		// Check aliases
		const alias = langData.ALIASES.get(word);
		if (alias) {
			return {
				contents: {
					kind: MarkupKind.Markdown,
					value: `**${t("ui.alias")}** \`${alias.expandsTo}\`\n\n${alias.description}`,
				},
			};
		}

		// Check env vars (without %)
		const envName = word.replace(/^%|%$/g, "");
		const envVar = langData.ENV_VARS.find((e) => e.name === envName);
		if (envVar) {
			return {
				contents: {
					kind: MarkupKind.Markdown,
					value: `**${t("ui.environmentVariable")}** \`%${envVar.name}%\`\n\n${envVar.description}`,
				},
			};
		}

		// Check local variable definitions
		const docText = document.getText();
		const varPattern = new RegExp(`^var\\s+${escapeRegex(word)}\\s+(.+)$`, "m");
		const varMatch = varPattern.exec(docText);
		if (varMatch) {
			return {
				contents: {
					kind: MarkupKind.Markdown,
					value: `**${t("ui.variable")}** \`^${word}^\`\n\n${t("ui.value")} \`${varMatch[1]}\``,
				},
			};
		}

		return undefined;
	});
}

function getWordAtPosition(
	lineText: string,
	character: number,
): string | undefined {
	if (character >= lineText.length) return undefined;

	let start = character;
	let end = character;

	while (start > 0 && /\w/.test(lineText[start - 1])) start--;
	while (end < lineText.length && /\w/.test(lineText[end])) end++;

	if (start === end) return undefined;
	return lineText.slice(start, end);
}

function escapeRegex(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
