/**
 * Hi-DSH Skill Board — Host side
 *
 * Visual toggle for skills: disabling removes the skill from the model catalog
 * (hot, saves tokens) by editing SKILL.md frontmatter `disable-model-invocation`.
 * The per-preset skill-filesystem watchers pick up file changes and the
 * tool-skill catalog replacement reaches the model on the next step — no restart.
 *
 * Listing scans the same roots the local provider scans (project, custom,
 * user-dsh, user-agents, bundled) because the desktop web composition disables
 * the host-plane skill-filesystem row: the global registry layer is empty and
 * per-preset providers are scope-scoped, so a plain registry snapshot cannot
 * enumerate installed skills for a management surface.
 */
import type { Context } from '@deepseek-ai/cordis';
export declare const name = "dsh-plugin-skill-board";
export declare const inject: readonly ["skills"];
export interface SkillBoardItem {
    name: string;
    description: string;
    source: string;
    path: string;
    modelInvocable: boolean;
    userInvocable: boolean;
}
export interface Config {
    /** Dry-run: log toggle without writing file */
    dryRun?: boolean;
}
export declare function apply(ctx: Context, config?: Config): void;
export declare class SkillBoardService {
    private ctx;
    private config;
    constructor(ctx: Context, config: Config);
    /** Skill roots mirroring the local provider's default roots (user level). */
    private roots;
    list(): Promise<SkillBoardItem[]>;
    toggle(name: string, enabled: boolean): Promise<{
        path: string;
        enabled: boolean;
    }>;
    /** Scan user roots for bundle (dir/SKILL.md) and flat (<name>.md) skills. */
    private scan;
    private parse;
}
/**
 * Patch SKILL.md frontmatter to set disable-model-invocation.
 * Hot-reload is handled by skill-filesystem chokidar + tool-skill catalog replacement.
 */
export declare function toggleSkillFile(filePath: string, enabled: boolean, dryRun?: boolean): Promise<boolean>;
//# sourceMappingURL=index.d.ts.map