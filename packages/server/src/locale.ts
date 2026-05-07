let strings: Record<string, string> = {};
let fallback: Record<string, string> = {};

try {
	fallback = require("./locales/en.json") as Record<string, string>;
} catch {
	// en.json is the fallback — should always exist
}

export function loadLocale(locale: string): void {
	const normalized = locale.toLowerCase().replace(/_/g, "-");
	if (normalized === "en" || normalized.startsWith("en-")) {
		strings = {};
		return;
	}
	try {
		strings = require(`./locales/${normalized}.json`) as Record<string, string>;
	} catch {
		strings = {};
	}
}

export function t(key: string, ...args: string[]): string {
	let value = strings[key] ?? fallback[key] ?? key;
	for (let i = 0; i < args.length; i++) {
		value = value.replace(new RegExp(`\\{${i}\\}`, "g"), args[i]);
	}
	return value;
}
