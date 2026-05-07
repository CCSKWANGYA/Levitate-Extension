import {
	type Connection,
	type Diagnostic,
	DiagnosticSeverity,
	type TextDocuments,
} from "vscode-languageserver/node";
import type { TextDocument } from "vscode-languageserver-textdocument";
import { parseLine } from "./parser";
import { t } from "./locale";
import type { LanguageData } from "./languageData";

const debounceTimers = new Map<string, NodeJS.Timeout>();

export function registerDiagnostics(
	connection: Connection,
	documents: TextDocuments<TextDocument>,
	langData: LanguageData,
): void {
	documents.onDidChangeContent((change) => {
		const uri = change.document.uri;
		const existing = debounceTimers.get(uri);
		if (existing) clearTimeout(existing);
		debounceTimers.set(
			uri,
			setTimeout(() => {
				debounceTimers.delete(uri);
				validateDocument(connection, change.document, langData);
			}, 300),
		);
	});
}

function validateDocument(
	connection: Connection,
	document: TextDocument,
	langData: LanguageData,
): void {
	const diagnostics: Diagnostic[] = [];
	const lines = document.getText().split(/\r?\n/);

	for (let i = 0; i < lines.length; i++) {
		const parsed = parseLine(lines[i], t);
		const lineStart = { line: i, character: 0 };
		const lineEnd = { line: i, character: lines[i].length };

		for (const err of parsed.errors) {
			diagnostics.push({
				severity:
					err.severity === "error"
						? DiagnosticSeverity.Error
						: DiagnosticSeverity.Warning,
				range: {
					start: { line: i, character: err.range.start },
					end: { line: i, character: err.range.end },
				},
				message: err.message,
				source: "Levitate Language Server",
			});
		}

		if (parsed.type === "command" && parsed.keyword) {
			if (
				!langData.isKeyword(parsed.keyword) &&
				!langData.isAlias(parsed.keyword)
			) {
				diagnostics.push({
					severity: DiagnosticSeverity.Warning,
					range: { start: lineStart, end: lineEnd },
					message: t("diagnostic.unknownKeyword", parsed.keyword),
					source: "Levitate Language Server",
				});
			} else if (langData.isReplOnly(parsed.keyword)) {
				diagnostics.push({
					severity: DiagnosticSeverity.Error,
					range: { start: lineStart, end: lineEnd },
					message: t("diagnostic.replOnlyKeyword", parsed.keyword),
					source: "Levitate Language Server",
				});
			}
		}
	}

	connection.sendDiagnostics({ uri: document.uri, diagnostics });
}
