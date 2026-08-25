//#region src/client.ts
const name = "dsh-plugin-skill-board/client";
const inject = ["slots"];
function apply(ctx) {
	ctx.effect(() => {
		let dispose;
		import("./SkillBoardSection-CF68tfeC.mjs").then((mod) => {
			const { SkillBoardSection } = mod;
			try {
				dispose = ctx.slots.register("settings.section", {
					component: SkillBoardSection,
					id: "hi-dsh-skill-board",
					title: "Hi-DSH 技能开关"
				});
			} catch {
				globalThis.__hiDshSkillBoard = SkillBoardSection;
			}
		}).catch(() => {});
		return () => {
			try {
				dispose?.();
			} catch {}
		};
	});
}
//#endregion
export { apply, inject, name };
