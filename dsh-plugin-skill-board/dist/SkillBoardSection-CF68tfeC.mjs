import { useCallback, useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/client/SkillBoardSection.tsx
function SkillBoardSection() {
	const [skills, setSkills] = useState(null);
	const [busy, setBusy] = useState(null);
	const [error, setError] = useState(null);
	const [toast, setToast] = useState(null);
	const load = useCallback(async () => {
		setError(null);
		try {
			const res = await fetch("/api/hi-dsh/skill-board/list", { headers: { "accept": "application/json" } });
			if (!res.ok) throw new Error(`list failed ${res.status}`);
			const data = await res.json();
			setSkills(data.skills);
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		}
	}, []);
	useEffect(() => {
		load();
	}, [load]);
	useEffect(() => {
		if (!toast) return;
		const t = setTimeout(() => setToast(null), 2500);
		return () => clearTimeout(t);
	}, [toast]);
	const toggle = async (name, enabled) => {
		setBusy(name);
		setError(null);
		try {
			const res = await fetch("/api/hi-dsh/skill-board/toggle", {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					name,
					enabled
				})
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error ?? `toggle failed ${res.status}`);
			setToast(data.message ?? (enabled ? "已启用（热）" : "已禁用（热，省 Token）"));
			await load();
		} catch (e) {
			setError(e instanceof Error ? e.message : String(e));
		} finally {
			setBusy(null);
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "hiDshSkillBoard",
		style: { padding: 16 },
		children: [
			/* @__PURE__ */ jsxs("h2", {
				style: {
					fontSize: 18,
					fontWeight: 600,
					marginBottom: 8
				},
				children: ["Hi-DSH 技能开关 ", /* @__PURE__ */ jsx("span", {
					style: {
						fontWeight: 400,
						fontSize: 12,
						color: "#888"
					},
					children: "· 热生效 · 关掉即省 Token"
				})]
			}),
			/* @__PURE__ */ jsxs("p", {
				style: {
					fontSize: 12,
					color: "#666",
					marginBottom: 12
				},
				children: [
					"这里列出当前 Profile 已安装的所有技能。关闭后该技能不会进入模型的 ",
					/* @__PURE__ */ jsx("code", { children: "<available_skills>" }),
					" 目录，下一轮对话即生效，无需重启。规则按插件实际声明，不预设单选/多选。"
				]
			}),
			error && /* @__PURE__ */ jsxs("div", {
				style: {
					color: "#c00",
					fontSize: 12,
					marginBottom: 8
				},
				children: ["错误：", error]
			}),
			toast && /* @__PURE__ */ jsx("div", {
				style: {
					background: "#111",
					color: "#fff",
					fontSize: 12,
					padding: "6px 10px",
					borderRadius: 6,
					marginBottom: 8
				},
				children: toast
			}),
			skills === null ? /* @__PURE__ */ jsx("div", {
				style: {
					fontSize: 12,
					color: "#888"
				},
				children: "加载中…"
			}) : skills.length === 0 ? /* @__PURE__ */ jsx("div", {
				style: {
					fontSize: 12,
					color: "#888"
				},
				children: "暂无已安装技能。去插件市场装几个技能后刷新。"
			}) : /* @__PURE__ */ jsx("div", {
				style: {
					display: "grid",
					gap: 8
				},
				children: skills.map((s) => /* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						border: "1px solid #e5e7eb",
						borderRadius: 8,
						padding: "10px 12px",
						background: s.modelInvocable ? "#fff" : "#f9fafb"
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: { minWidth: 0 },
						children: [
							/* @__PURE__ */ jsxs("div", {
								style: {
									fontWeight: 600,
									fontSize: 13
								},
								children: [
									s.name,
									" ",
									/* @__PURE__ */ jsxs("span", {
										style: {
											fontWeight: 400,
											color: "#888",
											fontSize: 11
										},
										children: [
											"· ",
											s.source,
											" · ",
											s.provider
										]
									})
								]
							}),
							/* @__PURE__ */ jsx("div", {
								style: {
									fontSize: 12,
									color: "#555",
									whiteSpace: "nowrap",
									overflow: "hidden",
									textOverflow: "ellipsis",
									maxWidth: 480
								},
								children: s.description
							}),
							/* @__PURE__ */ jsx("div", {
								style: {
									fontSize: 11,
									color: s.modelInvocable ? "#16a34a" : "#9ca3af"
								},
								children: s.modelInvocable ? "● 模型可见（会进上下文）" : "○ 已隐藏（省 Token，热）"
							})
						]
					}), /* @__PURE__ */ jsxs("label", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: 8,
							marginLeft: 12
						},
						children: [/* @__PURE__ */ jsx("input", {
							type: "checkbox",
							checked: s.modelInvocable,
							disabled: busy === s.name || !s.path,
							onChange: (e) => void toggle(s.name, e.target.checked),
							title: s.path ? `文件: ${s.path}` : "运行时技能不可切换"
						}), /* @__PURE__ */ jsx("span", {
							style: { fontSize: 12 },
							children: s.path ? s.modelInvocable ? "已启用" : "已禁用" : "不可切换"
						})]
					})]
				}, s.name))
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					marginTop: 12,
					fontSize: 11,
					color: "#888"
				},
				children: [
					"提示：开关改的是 ",
					/* @__PURE__ */ jsx("code", { children: "SKILL.md" }),
					" 的 ",
					/* @__PURE__ */ jsx("code", { children: "disable-model-invocation" }),
					"，由 ",
					/* @__PURE__ */ jsx("code", { children: "skill-filesystem" }),
					" 的 ",
					/* @__PURE__ */ jsx("code", { children: "chokidar" }),
					" 监听热更新，无需重启。运行时技能（无 path）暂不可切换。"
				]
			})
		]
	});
}
//#endregion
export { SkillBoardSection };
