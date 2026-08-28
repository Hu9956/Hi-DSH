# dsh-std 元协定（Meta-Protocol）规范

元协定是 `dsh-std` 的基础，它本身不包含具体的业务逻辑字段，而是专门用于**标识协议坐标、声明能力需求与进行纯函数协商**。

---

## 1. 协议坐标（Protocol Coordinates）

每个遵循标准的插件必须输出一个符合元协定的结构体：

```typescript
export interface DshStdManifest {
  /** 协议版本标识，当前基线为 dsh-std/v1 */
  readonly apiVersion: 'dsh-std/v1'
  /** 插件主类别：Tool | Command | Presentation | Service | Bundle */
  readonly kind: 'Tool' | 'Command' | 'Presentation' | 'Service' | 'Bundle'
  /** 插件唯一标识符，建议使用 npm 作用域命名或小写下划线 */
  readonly name: string
  /** 语义化版本号 */
  readonly version: string
  /** 插件简明描述 */
  readonly description: string
  /** 声明所需的宿主能力与权限 */
  readonly requires?: readonly DshCapability[]
  /** 声明插件自身对外暴露或支持的能力 */
  readonly supports?: readonly string[]
}

export type DshCapability =
  | 'network'       // 需要发起网络 HTTP/WebSocket 请求
  | 'workspace-fs'  // 需要读写用户工作区文件
  | 'settings'      // 需要持久化插件自身配置
  | 'ui-slot'       // 需要挂载前端界面插槽
  | 'model-invoke'  // 需要作为工具被 LLM 模型调用
```

---

## 2. 纯函数能力协商（Pure-Function Negotiation）

协商过程不应当产生副作用，仅通过对比宿主（Host）与插件（Plugin）的元数据计算出是否兼容：

```typescript
export function negotiateCapabilities(
  hostCapabilities: Set<DshCapability>,
  manifest: DshStdManifest,
): { compatible: boolean; missing: DshCapability[] } {
  const missing: DshCapability[] = []
  for (const req of manifest.requires ?? []) {
    if (!hostCapabilities.has(req)) {
      missing.push(req)
    }
  }
  return {
    compatible: missing.length === 0,
    missing,
  }
}
```
