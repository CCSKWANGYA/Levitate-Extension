import {
	type Connection,
	type DocumentSymbol,
	SymbolKind,
	type TextDocuments,
} from "vscode-languageserver/node";
import type { TextDocument } from "vscode-languageserver-textdocument";
import { parseLine } from "./parser";
import { t } from "./locale";

export function registerSymbols(
	connection: Connection,
	documents: TextDocuments<TextDocument>,
): void {
	connection.onDocumentSymbol((params): DocumentSymbol[] => {
		const document = documents.get(params.textDocument.uri);
		if (!document) return [];

		const symbols: DocumentSymbol[] = [];
		const lines = document.getText().split(/\r?\n/);

		for (let i = 0; i < lines.length; i++) {
			const parsed = parseLine(lines[i], t);
			if (parsed.type !== "command" || !parsed.keyword) continue;

			let symbol: DocumentSymbol | undefined;

			switch (parsed.keyword) {
				case "var":
					if (parsed.args.length >= 1) {
						symbol = {
							name: parsed.args[0],
							kind: SymbolKind.Variable,
							range: {
								start: { line: i, character: 0 },
								end: { line: i, character: lines[i].length },
							},
							selectionRange: {
								start: { line: i, character: lines[i].indexOf(parsed.args[0]) },
								end: {
									line: i,
									character:
										lines[i].indexOf(parsed.args[0]) + parsed.args[0].length,
								},
							},
						};
					}
					break;
				case "run":
					if (parsed.args.length >= 1) {
						symbol = {
							name: `run ${parsed.args[0]}`,
							kind: SymbolKind.Module,
							range: {
								start: { line: i, character: 0 },
								end: { line: i, character: lines[i].length },
							},
							selectionRange: {
								start: { line: i, character: 0 },
								end: { line: i, character: lines[i].length },
							},
						};
					}
					break;
				case "import":
					if (parsed.args.length >= 1) {
						symbol = {
							name: `import ${parsed.args[0]}`,
							kind: SymbolKind.Package,
							range: {
								start: { line: i, character: 0 },
								end: { line: i, character: lines[i].length },
							},
							selectionRange: {
								start: { line: i, character: 0 },
								end: { line: i, character: lines[i].length },
							},
						};
					}
					break;
				case "check":
				case "ifr":
					symbol = {
						name: `${parsed.keyword} ${parsed.args.slice(0, 2).join(" ")}`,
						kind: SymbolKind.Function,
						range: {
							start: { line: i, character: 0 },
							end: { line: i, character: lines[i].length },
						},
						selectionRange: {
							start: { line: i, character: 0 },
							end: { line: i, character: lines[i].length },
						},
					};
					break;
			}

			if (symbol) symbols.push(symbol);
		}

		return symbols;
	});
}
