/**
 * Hi-DSH Skill Board — Host side
 * Visual toggle for skills: disabling removes skill from model catalog (hot, saves tokens).
 * Implements toggle by editing SKILL.md frontmatter `disable-model-invocation`.
 * Relies on skill-filesystem watcher + tool-skill catalog replacement (agent/pre-step).
 */
import type { Context } from '@deepseek-ai/cordis';
export declare const name = "dsh-plugin-skill-board";
export declare const inject: readonly ["skills", "fs"];
export interface SkillBoardItem {
    name: string;
    description: string;
    source: string;
    provider: string;
    path?: string;
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
    list(): Promise<SkillBoardItem[]>;
    /**
     * Toggle model-invocable for a skill file.
     * @param name skill name
     * @param enabled true = model can invoke, false = hidden from catalog (saves tokens)
     */
    toggle(name: string, enabled: boolean): Promise<{
        path: string;
        enabled: boolean;
    }>;
}
/**
 * Patch SKILL.md frontmatter to set disable-model-invocation.
 * Hot-reload is handled by skill-filesystem chokidar + tool-skill catalog replacement.
 */
export declare function toggleSkillFile(filePath: string, enabled: boolean, dryRun?: boolean): Promise<boolean>;
//# sourceMappingURL=index.d.ts.map