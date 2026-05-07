import type { t as TFunction } from "./locale";

export interface KeywordInfo {
	name: string;
	category: "script" | "repl-only";
	description: string;
	signature: string;
	subcommands?: string[];
}

export interface SubcommandInfo {
	name: string;
	parentKeywords: string[];
	description: string;
}

export interface AliasInfo {
	name: string;
	expandsTo: string;
	description: string;
}

export interface EnvVarInfo {
	name: string;
	description: string;
}

const KEYWORD_DEFS: (string | string[])[][] = [
	[
		"run",
		"run",
		"script",
		["keyword.run.description", "keyword.run.signature"],
	],
	[
		"import",
		"import",
		"script",
		["keyword.import.description", "keyword.import.signature"],
	],
	[
		"echo",
		"echo",
		"script",
		["keyword.echo.description", "keyword.echo.signature"],
	],
	[
		"input",
		"input",
		"script",
		["keyword.input.description", "keyword.input.signature"],
	],
	[
		"var",
		"var",
		"script",
		["keyword.var.description", "keyword.var.signature"],
	],
	[
		"env",
		"env",
		"script",
		["keyword.env.description", "keyword.env.signature"],
		["get", "set"],
	],
	[
		"copy",
		"copy",
		"script",
		["keyword.copy.description", "keyword.copy.signature"],
	],
	[
		"delete",
		"delete",
		"script",
		["keyword.delete.description", "keyword.delete.signature"],
	],
	["sh", "sh", "script", ["keyword.sh.description", "keyword.sh.signature"]],
	[
		"flat",
		"flat",
		"script",
		["keyword.flat.description", "keyword.flat.signature"],
	],
	[
		"verm",
		"verm",
		"script",
		["keyword.verm.description", "keyword.verm.signature"],
		["smajor", "sminor", "sfix", "set", "get"],
	],
	[
		"netfile",
		"netfile",
		"script",
		["keyword.netfile.description", "keyword.netfile.signature"],
	],
	[
		"check",
		"check",
		"script",
		["keyword.check.description", "keyword.check.signature"],
	],
	[
		"path",
		"path",
		"script",
		["keyword.path.description", "keyword.path.signature"],
		["dir", "isdir"],
	],
	[
		"list",
		"list",
		"script",
		["keyword.list.description", "keyword.list.signature"],
		["get", "set", "add"],
	],
	[
		"regex",
		"regex",
		"script",
		["keyword.regex.description", "keyword.regex.signature"],
		["match", "replace"],
	],
	[
		"not",
		"not",
		"script",
		["keyword.not.description", "keyword.not.signature"],
	],
	[
		"ifr",
		"ifr",
		"script",
		["keyword.ifr.description", "keyword.ifr.signature"],
	],
	[
		"pkgr",
		"pkgr",
		"script",
		["keyword.pkgr.description", "keyword.pkgr.signature"],
		["zip", "tar", "make", "tear"],
	],
	[
		"mrp",
		"mrp",
		"script",
		["keyword.mrp.description", "keyword.mrp.signature"],
		["info", "chname", "chroot", "chout", "show", "create", "lookup"],
	],
	[
		"a2ogg",
		"a2ogg",
		"script",
		["keyword.a2ogg.description", "keyword.a2ogg.signature"],
	],
	[
		"ase",
		"ase",
		"script",
		["keyword.ase.description", "keyword.ase.signature"],
		["start", "stop"],
	],
	[
		"psdcvt",
		"psdcvt",
		"script",
		["keyword.psdcvt.description", "keyword.psdcvt.signature"],
	],
	[
		"pbrex",
		"pbrex",
		"script",
		["keyword.pbrex.description", "keyword.pbrex.signature"],
	],
	[
		"rrt",
		"rrt",
		"script",
		["keyword.rrt.description", "keyword.rrt.signature"],
	],
	["pw", "pw", "script", ["keyword.pw.description", "keyword.pw.signature"]],
	[
		"true",
		"true",
		"script",
		["keyword.true.description", "keyword.true.signature"],
	],
	[
		"false",
		"false",
		"script",
		["keyword.false.description", "keyword.false.signature"],
	],
	[
		"new",
		"new",
		"script",
		["keyword.new.description", "keyword.new.signature"],
	],
	[
		"exit",
		"exit",
		"repl-only",
		["keyword.exit.description", "keyword.exit.signature"],
	],
	[
		"clear",
		"clear",
		"repl-only",
		["keyword.clear.description", "keyword.clear.signature"],
	],
	[
		"help",
		"help",
		"repl-only",
		["keyword.help.description", "keyword.help.signature"],
	],
	[
		"proj",
		"proj",
		"repl-only",
		["keyword.proj.description", "keyword.proj.signature"],
		["create", "info", "open"],
	],
	[
		"ext",
		"ext",
		"repl-only",
		["keyword.ext.description", "keyword.ext.signature"],
		["list", "install", "remove"],
	],
	[
		"task",
		"task",
		"repl-only",
		["keyword.task.description", "keyword.task.signature"],
		["run", "list"],
	],
	[
		"reload",
		"reload",
		"repl-only",
		["keyword.reload.description", "keyword.reload.signature"],
	],
];

const SUBCOMMAND_DEFS: [string, string[], string][] = [
	["get", ["env", "verm", "list"], "subcommand.get.description"],
	["set", ["env", "verm", "list"], "subcommand.set.description"],
	["add", ["list"], "subcommand.add.description"],
	["remove", ["list"], "subcommand.remove.description"],
	["restore", ["verm"], "subcommand.restore.description"],
	["r", ["verm"], "subcommand.r.description"],
	["serialize", ["verm"], "subcommand.serialize.description"],
	["s", ["verm"], "subcommand.s.description"],
	["export", ["verm"], "subcommand.export.description"],
	["e", ["verm"], "subcommand.e.description"],
	["update", ["verm"], "subcommand.update.description"],
	["u", ["verm"], "subcommand.u.description"],
	["lock", ["verm"], "subcommand.lock.description"],
	["unlock", ["verm"], "subcommand.unlock.description"],
	["clean", ["verm"], "subcommand.clean.description"],
	["smajor", ["verm"], "subcommand.smajor.description"],
	["sminor", ["verm"], "subcommand.sminor.description"],
	["sfix", ["verm"], "subcommand.sfix.description"],
	["remapper", ["verm"], "subcommand.remapper.description"],
	["dir", ["path"], "subcommand.dir.description"],
	["isdir", ["path"], "subcommand.isdir.description"],
	["match", ["regex"], "subcommand.match.description"],
	["replace", ["regex"], "subcommand.replace.description"],
	["make", ["pkgr"], "subcommand.make.description"],
	["tear", ["pkgr"], "subcommand.tear.description"],
	["zip", ["pkgr"], "subcommand.zip.description"],
	["tar", ["pkgr"], "subcommand.tar.description"],
	["start", ["ase"], "subcommand.start.description"],
	["stop", ["ase"], "subcommand.stop.description"],
	["mono", ["ase"], "subcommand.mono.description"],
	["info", ["mrp", "proj"], "subcommand.info.description"],
	["chname", ["mrp"], "subcommand.chname.description"],
	["chroot", ["mrp"], "subcommand.chroot.description"],
	["chout", ["mrp"], "subcommand.chout.description"],
	["show", ["mrp"], "subcommand.show.description"],
	["create", ["mrp", "proj"], "subcommand.create.description"],
	["lookup", ["mrp"], "subcommand.lookup.description"],
	["commands", ["help"], "subcommand.commands.description"],
	["alias", ["help"], "subcommand.alias.description"],
];

const ALIAS_DEFS: [string, string, string][] = [
	["makeCleanup", 'delete "%project.cache%"', "alias.makeCleanup.description"],
	[
		"makeCopy",
		'copy "%project.src%" "%project.output%"',
		"alias.makeCopy.description",
	],
	[
		"makePkg",
		'pkgr zip make "%project.output%" "%project.name%.zip"',
		"alias.makePkg.description",
	],
	["psdCvt", "psdcvt <source> <destination>", "alias.psdCvt.description"],
	["pbrEx", "pbrex <source> <destination>", "alias.pbrEx.description"],
];

const ENV_VAR_DEFS: [string, string][] = [
	["project.src", "envvar.project.src.description"],
	["project.name", "envvar.project.name.description"],
	["project.output", "envvar.project.output.description"],
	["project.ver", "envvar.project.ver.description"],
	["project.cache", "envvar.project.cache.description"],
];

export function getData(t: typeof TFunction) {
	const KEYWORDS = new Map<string, KeywordInfo>(
		KEYWORD_DEFS.map((def) => {
			const name = def[0] as string;
			const cmdName = def[1] as string;
			const category = def[2] as "script" | "repl-only";
			const keys = def[3] as string[];
			const subcommands = def[4] as string[] | undefined;
			return [
				name,
				{
					name: cmdName,
					category,
					description: t(keys[0]),
					signature: t(keys[1]),
					...(subcommands ? { subcommands } : {}),
				},
			];
		}),
	);

	const SUBCOMMANDS = new Map<string, SubcommandInfo>(
		SUBCOMMAND_DEFS.map((def) => {
			const [name, parentKeywords, descKey] = def;
			return [name, { name, parentKeywords, description: t(descKey) }];
		}),
	);

	const ALIASES = new Map<string, AliasInfo>(
		ALIAS_DEFS.map((def) => {
			const [name, expandsTo, descKey] = def;
			return [name, { name, expandsTo, description: t(descKey) }];
		}),
	);

	const ENV_VARS: EnvVarInfo[] = ENV_VAR_DEFS.map(([name, descKey]) => ({
		name,
		description: t(descKey),
	}));

	const KEYWORD_NAMES = new Set(KEYWORDS.keys());
	const REPL_ONLY_NAMES = new Set(
		[...KEYWORDS.values()]
			.filter((k) => k.category === "repl-only")
			.map((k) => k.name),
	);
	const ALIAS_NAMES = new Set(ALIASES.keys());
	const SUBCOMMAND_NAMES = new Set(SUBCOMMANDS.keys());

	return {
		KEYWORDS,
		SUBCOMMANDS,
		ALIASES,
		ENV_VARS,
		KEYWORD_NAMES,
		REPL_ONLY_NAMES,
		ALIAS_NAMES,
		SUBCOMMAND_NAMES,
		isKeyword: (name: string): boolean => KEYWORD_NAMES.has(name),
		isReplOnly: (name: string): boolean => REPL_ONLY_NAMES.has(name),
		isAlias: (name: string): boolean => ALIAS_NAMES.has(name),
		isSubcommand: (name: string): boolean => SUBCOMMAND_NAMES.has(name),
	};
}

export type LanguageData = ReturnType<typeof getData>;
