/**
 * dsh-std 基础工具插件模板 (Tool Template)
 * apiVersion: dsh-std/v1
 * kind: Tool
 */

import type { Context } from '@deepseek-ai/cordis'

export const manifest = {
  apiVersion: 'dsh-std/v1',
  kind: 'Tool',
  name: 'my-custom-tool',
  version: '1.0.0',
  description: 'A sample tool following dsh-std conventions',
  requires: ['network'],
} as const

export interface ToolInput {
  query: string
}

export interface ToolOutput {
  result: string
  timestamp: number
}

/** Cordis 插件标准 apply 入口 */
export function apply(ctx: Context): void {
  // 注入 harness/tools 服务注册能力
  ctx.inject(['harness'], (harnessCtx) => {
    harnessCtx.harness.registerTool({
      name: manifest.name,
      description: manifest.description,
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'The search query or input text' },
        },
        required: ['query'],
      },
      async execute(input: ToolInput): Promise<ToolOutput> {
        try {
          // 业务逻辑实现
          return {
            result: `Processed query: ${input.query}`,
            timestamp: Date.now(),
          }
        } catch (error) {
          throw new Error(`Tool execution failed: ${error instanceof Error ? error.message : String(error)}`)
        }
      },
    })
  })
}
