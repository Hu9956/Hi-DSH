/**
 * Hi-DSH Skill Board — Loopback HTTP handlers
 * GET  /api/hi-dsh/skill-board/list   -> list skills
 * POST /api/hi-dsh/skill-board/toggle -> {name, enabled}
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { SkillBoardService } from './index.ts';
export declare function handleSkillBoardList(req: IncomingMessage, res: ServerResponse, expectedOrigin: string, service: SkillBoardService): Promise<void>;
export declare function handleSkillBoardToggle(req: IncomingMessage, res: ServerResponse, expectedOrigin: string, service: SkillBoardService): Promise<void>;
export declare function handleSkillBoardPage(req: IncomingMessage, res: ServerResponse, expectedOrigin: string): Promise<void>;
export declare const skillBoardRouteConstants: {
    readonly listPath: "/api/hi-dsh/skill-board/list";
    readonly togglePath: "/api/hi-dsh/skill-board/toggle";
    readonly pagePath: "/hi-dsh/skill-board";
};
//# sourceMappingURL=skill-board-route.d.ts.map