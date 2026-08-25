/**
 * Hi-DSH Skill Board — Client side
 * Registers a Settings section via DSH slots.
 * In v0.1 we mount as a plain React component; host provides /api/hi-dsh/skill-board/*
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
export declare const name = "dsh-plugin-skill-board/client";
export declare const inject: readonly ["slots"];
export declare function apply(ctx: ClientContext): void;
//# sourceMappingURL=client.d.ts.map