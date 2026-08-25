//#region src/skill-board-route.ts
const MAX_BODY = 16 * 1024;
const SKILL_BOARD_LIST_PATH = "/api/hi-dsh/skill-board/list";
const SKILL_BOARD_TOGGLE_PATH = "/api/hi-dsh/skill-board/toggle";
function finishJson(res, status, value) {
	res.statusCode = status;
	res.setHeader("cache-control", "no-store");
	res.setHeader("content-type", "application/json; charset=utf-8");
	res.end(JSON.stringify(value));
}
function isLoopbackAddress(addr) {
	if (!addr) return false;
	if (addr === "::1" || addr === "127.0.0.1") return true;
	if (addr.startsWith("::ffff:")) return addr.slice(7).startsWith("127.");
	return addr.startsWith("127.");
}
function isAllowed(req, expectedOrigin) {
	try {
		const expected = new URL(expectedOrigin);
		if (expected.hostname !== "127.0.0.1" && expected.hostname !== "[::1]") return false;
		if (!isLoopbackAddress(req.socket.remoteAddress)) return false;
		if (req.headers.host?.toLowerCase() !== expected.host.toLowerCase()) return false;
		const origin = req.headers.origin;
		if (origin !== void 0) return origin === expectedOrigin;
		if (req.method === "GET") return req.headers["sec-fetch-site"] === "same-origin" || req.headers["sec-fetch-site"] === void 0;
		return false;
	} catch {
		return false;
	}
}
async function readJson(req) {
	let size = 0;
	const chunks = [];
	for await (const chunk of req) {
		const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		size += buf.byteLength;
		if (size > MAX_BODY) throw new Error("body too large");
		chunks.push(buf);
	}
	return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
async function handleSkillBoardList(req, res, expectedOrigin, service) {
	if (req.method !== "GET") {
		finishJson(res, 405, { error: "method not allowed" });
		return;
	}
	if (!isAllowed(req, expectedOrigin)) {
		finishJson(res, 403, { error: "forbidden" });
		return;
	}
	try {
		finishJson(res, 200, { skills: await service.list() });
	} catch (e) {
		finishJson(res, 500, { error: String(e) });
	}
}
async function handleSkillBoardToggle(req, res, expectedOrigin, service) {
	if (req.method !== "POST") {
		finishJson(res, 405, { error: "method not allowed" });
		return;
	}
	if (!isAllowed(req, expectedOrigin)) {
		finishJson(res, 403, { error: "forbidden" });
		return;
	}
	if (req.headers["content-type"]?.split(";")[0]?.trim() !== "application/json") {
		finishJson(res, 415, { error: "content-type must be application/json" });
		return;
	}
	let body;
	try {
		body = await readJson(req);
	} catch {
		finishJson(res, 400, { error: "invalid JSON" });
		return;
	}
	if (typeof body !== "object" || body === null || Array.isArray(body)) {
		finishJson(res, 400, { error: "invalid request" });
		return;
	}
	const { name, enabled } = body;
	if (typeof name !== "string" || typeof enabled !== "boolean") {
		finishJson(res, 400, { error: "name and enabled required" });
		return;
	}
	try {
		finishJson(res, 200, {
			ok: true,
			...await service.toggle(name, enabled),
			hot: true,
			message: enabled ? "已启用，下一轮对话生效（热）" : "已禁用，下一轮对话生效（热，省 Token）"
		});
	} catch (e) {
		finishJson(res, 400, { error: e instanceof Error ? e.message : String(e) });
	}
}
const skillBoardRouteConstants = {
	listPath: SKILL_BOARD_LIST_PATH,
	togglePath: SKILL_BOARD_TOGGLE_PATH
};
//#endregion
export { handleSkillBoardList, handleSkillBoardToggle, skillBoardRouteConstants };
