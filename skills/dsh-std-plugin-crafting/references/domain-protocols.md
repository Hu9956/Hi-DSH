# dsh-std 独立领域协议（Domain-Specific Protocols）速查

`dsh-std` 将插件能力划分为若干正交独立的领域协议：

---

## 1. Tool 协议 (`tool`)
用于向 LLM 注册结构化可调用的工具（Tool Use / Function Calling）。

```typescript
export interface DshToolProtocol<TParams = unknown, TResult = unknown> {
  readonly name: string
  readonly description: string
  /** JSON Schema 格式的参数定义 */
  readonly parameters: Record<string, unknown>
  /** 工具具体执行逻辑，必须保持无副作用或受控副作用 */
  execute(params: TParams, context: DshExecutionContext): Promise<TResult>
}
```

---

## 2. Command 协议 (`command`)
用于向用户交互界面注册斜杠命令（Slash Command）。

```typescript
export interface DshCommandProtocol {
  readonly command: string // 例如 "permission", "clean", "export"
  readonly description: string
  readonly usage?: string
  execute(args: string, session: DshSessionHandle): Promise<void>
}
```

---

## 3. Presentation 协议 (`presentation`)
用于挂载 React/HTML 界面组件到官方指定的 Slot 插槽。

### 常用官方 Slot 清单：
- `sidebar.settings`：设置弹窗与侧边栏设置入口
- `settings.section`：设置对话框中的顶级设置分区（如通用、桌面版等）
- `settings.general.item`：通用设置分区中的偏好配置项列表
- `composer.action`：底部输入框操作栏按钮
- `chat.header.action`：对话顶部工具栏操作按钮

---

## 4. Connection 协议 (`connection`)
用于宿主与客户端、宿主与远程工作区之间的安全握手与传输通道（Loopback HTTP / WebSocket / WebWorker）。
