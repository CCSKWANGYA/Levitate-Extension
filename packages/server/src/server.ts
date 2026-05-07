import {
	createConnection,
	TextDocuments,
	ProposedFeatures,
	type InitializeParams,
	type InitializeResult,
	TextDocumentSyncKind,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import { loadLocale, t } from "./locale";
import { getData } from "./languageData";
import { registerDiagnostics } from "./diagnostics";
import { registerCompletion } from "./completion";
import { registerHover } from "./hover";
import { registerSymbols } from "./symbols";

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

connection.onInitialize((params: InitializeParams): InitializeResult => {
	const locale = params.locale ?? params.initializationOptions?.locale ?? "en";
	loadLocale(locale);

	return {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			completionProvider: {
				triggerCharacters: [" ", "%", "^", "{"],
				resolveProvider: false,
			},
			hoverProvider: true,
			documentSymbolProvider: true,
		},
	};
});

connection.onInitialized(() => {
	connection.console.info(t("ui.serverInitialized"));
});

const langData = getData(t);

registerDiagnostics(connection, documents, langData);
registerCompletion(connection, documents, langData);
registerHover(connection, documents, langData);
registerSymbols(connection, documents);

documents.listen(connection);
connection.listen();
