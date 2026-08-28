/**
 * dsh-std 后台服务插件模板 (Host Service Template)
 * apiVersion: dsh-std/v1
 * kind: Service
 */

import type { Context } from '@deepseek-ai/cordis'

export const manifest = {
  apiVersion: 'dsh-std/v1',
  kind: 'Service',
  name: 'my-backend-service',
  version: '1.0.0',
  description: 'A sample background service following dsh-std conventions',
  requires: ['settings'],
} as const

declare module '@deepseek-ai/cordis' {
  interface Context {
    myBackendService: MyBackendService
  }
}

export class MyBackendService {
  constructor(private ctx: Context) {}

  public async getStatus(): Promise<{ running: boolean; uptime: number }> {
    return {
      running: true,
      uptime: process.uptime(),
    }
  }
}

export const name = 'myBackendService'

export function apply(ctx: Context): void {
  const service = new MyBackendService(ctx)
  ctx.provide(name, service)

  ctx.effect(() => {
    ctx.logger.info(`[dsh-std] ${manifest.name} service started`)
    return () => {
      ctx.logger.info(`[dsh-std] ${manifest.name} service disposed`)
    }
  }, 'my-backend-service lifecycle')
}
