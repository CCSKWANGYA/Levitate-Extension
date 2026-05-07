/// <reference types="node" />
import * as esbuild from "esbuild";

const watch = process.argv.includes("--watch");

const clientConfig = {
	entryPoints: ["packages/client/src/extension.ts"],
	bundle: true,
	outfile: "dist/client/extension.js",
	external: ["vscode"],
	format: "cjs",
	platform: "node",
	target: "node18",
	sourcemap: true,
	minify: false,
} satisfies esbuild.BuildOptions;

const serverConfig = {
	entryPoints: ["packages/server/src/server.ts"],
	bundle: true,
	outfile: "dist/server/server.js",
	external: [],
	format: "cjs",
	platform: "node",
	target: "node18",
	sourcemap: true,
	minify: false,
} satisfies esbuild.BuildOptions;

if (watch) {
	const clientCtx = await esbuild.context(clientConfig);
	const serverCtx = await esbuild.context(serverConfig);
	await Promise.all([clientCtx.watch(), serverCtx.watch()]);
	console.log("Watching for changes...");
} else {
	await Promise.all([esbuild.build(clientConfig), esbuild.build(serverConfig)]);
	console.log("Build complete.");
}
