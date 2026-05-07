import type { t as TFunction } from "./locale";

export interface VariableRef {
	name: string;
	kind: "local" | "env";
	range: { start: number; end: number };
}

export interface ExpressionRef {
	content: string;
	range: { start: number; end: number };
}

export interface StringLiteral {
	content: string;
	range: { start: number; end: number };
}

export interface ParseError {
	message: string;
	range: { start: number; end: number };
	severity: "error" | "warning";
}

export interface ParsedLine {
	type: "comment" | "empty" | "command";
	keyword?: string;
	args: string[];
	variables: VariableRef[];
	expressions: ExpressionRef[];
	strings: StringLiteral[];
	errors: ParseError[];
}

export function parseLine(text: string, t: typeof TFunction): ParsedLine {
	const trimmed = text.trimStart();
	const leadingSpaces = text.length - trimmed.length;

	if (trimmed.length === 0) {
		return {
			type: "empty",
			variables: [],
			expressions: [],
			strings: [],
			errors: [],
			args: [],
		};
	}

	if (trimmed.startsWith("#")) {
		return {
			type: "comment",
			variables: [],
			expressions: [],
			strings: [],
			errors: [],
			args: [],
		};
	}

	const variables: VariableRef[] = [];
	const expressions: ExpressionRef[] = [];
	const strings: StringLiteral[] = [];
	const errors: ParseError[] = [];
	const tokens: string[] = [];

	let i = leadingSpaces;
	while (i < text.length) {
		const ch = text[i];

		// Skip whitespace between tokens
		if (ch === " " || ch === "\t") {
			i++;
			continue;
		}

		// Comment starts - stop parsing rest of line
		if (ch === "#") break;

		// Double-quoted string
		if (ch === '"') {
			const start = i;
			i++; // skip opening quote
			let content = "";
			while (i < text.length) {
				const c = text[i];
				if (c === "\\" && i + 1 < text.length) {
					content += text[i + 1];
					i += 2;
					continue;
				}
				if (c === '"') {
					i++; // skip closing quote
					strings.push({ content, range: { start, end: i } });
					break;
				}
				content += c;
				i++;
			}
			if (i > text.length || (i === text.length && text[i - 1] !== '"')) {
				errors.push({
					message: t("parser.unclosedString"),
					range: { start, end: text.length },
					severity: "error",
				});
			}
			tokens.push(content);
			continue;
		}

		// Expression { ... }
		if (ch === "{") {
			const start = i;
			let depth = 1;
			i++; // skip opening brace
			const contentStart = i;
			while (i < text.length && depth > 0) {
				if (text[i] === "{") depth++;
				else if (text[i] === "}") depth--;
				if (depth > 0) i++;
			}
			const content = text.slice(contentStart, i);
			if (depth > 0) {
				errors.push({
					message: t("parser.unclosedExpression"),
					range: { start, end: text.length },
					severity: "error",
				});
			} else {
				i++; // skip closing brace
			}
			expressions.push({ content, range: { start, end: i } });
			tokens.push(content);
			continue;
		}

		// Local variable ^name^
		if (ch === "^") {
			const start = i;
			i++; // skip opening ^
			const nameStart = i;
			while (
				i < text.length &&
				text[i] !== "^" &&
				text[i] !== " " &&
				text[i] !== "\t"
			) {
				i++;
			}
			if (i >= text.length || text[i] !== "^") {
				errors.push({
					message: t("parser.unclosedVarRef"),
					range: { start, end: text.length },
					severity: "error",
				});
			} else {
				const name = text.slice(nameStart, i);
				variables.push({ name, kind: "local", range: { start, end: i + 1 } });
				tokens.push(name);
				i++; // skip closing ^
			}
			continue;
		}

		// Environment variable %name%
		if (ch === "%") {
			const start = i;
			i++; // skip opening %
			const nameStart = i;
			while (
				i < text.length &&
				text[i] !== "%" &&
				text[i] !== " " &&
				text[i] !== "\t"
			) {
				i++;
			}
			if (i >= text.length || text[i] !== "%") {
				errors.push({
					message: t("parser.unclosedEnvRef"),
					range: { start, end: text.length },
					severity: "error",
				});
			} else {
				const name = text.slice(nameStart, i);
				variables.push({ name, kind: "env", range: { start, end: i + 1 } });
				tokens.push(name);
				i++; // skip closing %
			}
			continue;
		}

		// Regular token (word)
		const tokenStart = i;
		while (i < text.length && text[i] !== " " && text[i] !== "\t") {
			i++;
		}
		tokens.push(text.slice(tokenStart, i));
	}

	const keyword = tokens[0];

	return {
		type: "command",
		keyword,
		args: tokens.slice(1),
		variables,
		expressions,
		strings,
		errors,
	};
}
