import { readFile, writeFile } from "node:fs/promises";
import { parse, stringify } from "yaml";
//#region src/index.ts
const name = "dsh-plugin-skill-board";
const inject = ["skills", "fs"];
function apply(ctx, config = {}) {
	ctx.effect(() => {
		ctx.skillBoard = new SkillBoardService(ctx, config);
		return () => {
			delete ctx.skillBoard;
		};
	});
	ctx.effect(() => {});
}
var SkillBoardService = class {
	ctx;
	config;
	constructor(ctx, config) {
		this.ctx = ctx;
		this.config = config;
	}
	async list() {
		return (await this.ctx.skills.snapshot({ cwd: process.cwd() })).skills.map((s) => ({
			name: s.name,
			description: s.description,
			source: s.source,
			provider: s.provider,
			path: s.path,
			modelInvocable: s.invocation.modelInvocable,
			userInvocable: s.invocation.userInvocable
		})).sort((a, b) => a.name.localeCompare(b.name));
	}
	/**
	* Toggle model-invocable for a skill file.
	* @param name skill name
	* @param enabled true = model can invoke, false = hidden from catalog (saves tokens)
	*/
	async toggle(name, enabled) {
		const target = (await this.ctx.skills.snapshot({ cwd: process.cwd() })).skills.find((s) => s.name === name);
		if (!target) throw new Error(`skill "${name}" not found`);
		if (!target.path) throw new Error(`skill "${name}" has no file path (runtime skill) — cannot toggle via file`);
		const filePath = target.path;
		const newMode = await toggleSkillFile(filePath, enabled, this.config.dryRun ?? false);
		ctx.logger.info(`skill-board: ${name} -> modelInvocable=${newMode} at ${filePath}`);
		return {
			path: filePath,
			enabled: newMode
		};
	}
};
/**
* Patch SKILL.md frontmatter to set disable-model-invocation.
* Hot-reload is handled by skill-filesystem chokidar + tool-skill catalog replacement.
*/
async function toggleSkillFile(filePath, enabled, dryRun = false) {
	const parsed = parseFrontmatter(await readFile(filePath, "utf8"));
	if (!parsed) throw new Error(`skill file ${filePath} missing frontmatter`);
	const data = parsed.data;
	if ("disableModelInvocation" in data || "modelInvocable" in data) throw new Error(`skill ${filePath} uses legacy frontmatter key`);
	if (enabled) {
		if ("disable-model-invocation" in data) delete data["disable-model-invocation"];
	} else data["disable-model-invocation"] = true;
	const newRaw = stringifyFrontmatter(data, parsed.body);
	if (!dryRun) await writeFile(filePath, newRaw, "utf8");
	return enabled;
}
function parseFrontmatter(raw) {
	if (!raw.startsWith("---\n")) return void 0;
	const end = raw.indexOf("\n---", 3);
	if (end === -1) return void 0;
	const yaml = raw.slice(4, end);
	const bodyStart = raw.indexOf("\n", end + 4);
	const body = bodyStart === -1 ? "" : raw.slice(bodyStart + 1);
	const data = parse(yaml);
	if (typeof data !== "object" || data === null || Array.isArray(data)) return void 0;
	return {
		data,
		body
	};
}
function stringifyFrontmatter(data, body) {
	return `---\n${stringify(data).trimEnd()}\n---\n${body.startsWith("\n") ? body : body ? body : ""}`;
}
//#endregion
export { SkillBoardService, apply, inject, name, toggleSkillFile };
