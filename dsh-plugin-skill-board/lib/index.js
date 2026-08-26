import { handleSkillBoardList, handleSkillBoardPage, handleSkillBoardToggle, skillBoardRouteConstants } from "./skill-board-route.mjs";
import { access, readFile, readdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { parse, stringify } from "yaml";
//#region src/index.ts
const name = "dsh-plugin-skill-board";
const inject = ["skills"];
function apply(ctx, config = {}) {
	const service = new SkillBoardService(ctx, config);
	ctx.effect(() => {
		let d1;
		let d2;
		let d3;
		let timer;
		const tryRegister = () => {
			const webServer = ctx.get("webServer");
			if (webServer === void 0) return false;
			const expectedOrigin = `http://${webServer.host}:${String(webServer.port)}`;
			d1 = webServer.register({
				kind: "exact",
				path: skillBoardRouteConstants.listPath,
				handler: (req, res) => handleSkillBoardList(req, res, expectedOrigin, service)
			});
			d2 = webServer.register({
				kind: "exact",
				path: skillBoardRouteConstants.togglePath,
				handler: (req, res) => handleSkillBoardToggle(req, res, expectedOrigin, service)
			});
			d3 = webServer.register({
				kind: "exact",
				path: skillBoardRouteConstants.pagePath,
				handler: (req, res) => handleSkillBoardPage(req, res, expectedOrigin)
			});
			ctx.logger.info(`skill-board: routes registered at ${expectedOrigin}${skillBoardRouteConstants.pagePath}`);
			return true;
		};
		if (!tryRegister()) timer = setInterval(() => {
			if (tryRegister() && timer !== void 0) {
				clearInterval(timer);
				timer = void 0;
			}
		}, 200);
		return () => {
			if (timer !== void 0) clearInterval(timer);
			try {
				d1?.();
			} catch {}
			try {
				d2?.();
			} catch {}
			try {
				d3?.();
			} catch {}
		};
	});
}
const USER_DSH_RANK = 400;
const USER_AGENTS_RANK = 500;
var SkillBoardService = class {
	ctx;
	config;
	constructor(ctx, config) {
		this.ctx = ctx;
		this.config = config;
	}
	/** Skill roots mirroring the local provider's default roots (user level). */
	roots() {
		return [{
			path: join(resolveDshHomeSafe(), "skills"),
			source: "user-dsh",
			rank: USER_DSH_RANK
		}, {
			path: join(process.env.DSH_AGENTS_HOME ?? join(homedir(), ".agents"), "skills"),
			source: "user-agents",
			rank: USER_AGENTS_RANK
		}];
	}
	async list() {
		return (await this.scan()).sort((a, b) => a.name.localeCompare(b.name));
	}
	async toggle(name, enabled) {
		const target = (await this.scan()).find((s) => s.name === name);
		if (!target) throw new Error(`skill "${name}" not found`);
		const newMode = await toggleSkillFile(target.path, enabled, this.config.dryRun ?? false);
		this.ctx.logger.info(`skill-board: ${name} -> modelInvocable=${newMode} at ${target.path}`);
		return {
			path: target.path,
			enabled: newMode
		};
	}
	/** Scan user roots for bundle (dir/SKILL.md) and flat (<name>.md) skills. */
	async scan() {
		const result = [];
		for (const root of this.roots()) {
			let entries;
			try {
				entries = await readdir(root.path, { withFileTypes: true });
			} catch {
				continue;
			}
			for (const entry of entries) {
				if (entry.name === ".system") continue;
				if (entry.isDirectory()) {
					const path = join(root.path, entry.name, "SKILL.md");
					const parsed = await this.parse(path, root.source);
					if (parsed) result.push(parsed);
				} else if (entry.isFile() && entry.name.endsWith(".md")) {
					const path = join(root.path, entry.name);
					const parsed = await this.parse(path, root.source);
					if (parsed) result.push(parsed);
				}
			}
		}
		const seen = /* @__PURE__ */ new Set();
		return result.filter((s) => !seen.has(s.name) && seen.add(s.name) !== void 0);
	}
	async parse(path, source) {
		try {
			await access(path);
			const parsed = parseFrontmatter(await readFile(path, "utf8"));
			if (!parsed) return void 0;
			const name = parsed.data["name"];
			const description = parsed.data["description"];
			if (typeof name !== "string" || typeof description !== "string") return void 0;
			const disableModel = parsed.data["disable-model-invocation"];
			const userInv = parsed.data["user-invocable"];
			return {
				name,
				description,
				source,
				path,
				modelInvocable: disableModel !== true,
				userInvocable: userInv !== false
			};
		} catch {
			return;
		}
	}
};
function resolveDshHomeSafe() {
	return resolve(process.env.DSH_HOME ?? join(homedir(), ".dsh"));
}
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
