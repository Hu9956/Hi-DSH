---
name: dsh-std-plugin-crafting
description: Guide, scaffold, implement, and verify DeepSeek Harness (DSH) community plugins following the official dsh-std (DSH Standard) multi-domain protocol and adapter architecture. Use this skill when asked to create, modify, audit, or scaffold a DSH plugin, tool, UI slot component, or backend service to ensure full cross-platform compatibility, clean decoupling, sandbox safety, and zero upstream pollution.
---

# DSH Standard Plugin Crafting Guide (`dsh-std`)

本技能指导开发者和 AI Agent 按照 **`dsh-std` 社区共创协议标准**（基于 `Yan-Zero/dsh-std` 规范与 Hi-DSH 架构原则）进行插件的高质量设计、编码、插槽装配与安全准入自检。

---

## 核心设计哲学：三层解耦与单点减震

```text
┌─────────────────────────────────────────────────────────────┐
│                 业务插件逻辑 (Your Plugin Code)               │
│         仅依赖标准接口：@dsh-std/core + 独立领域协议           │
├─────────────────────────────────────────────────────────────┤
│         适配层 / 减震器 (@dsh-std/adapter-dsh)              │
│       隔离上游 breaking change，负责 Cordis 上下文转换       │
├─────────────────────────────────────────────────────────────┤
│            底层运行时 (DSH Host / Web / Desktop / TUI)       │
└─────────────────────────────────────────────────────────────┘
```

1. **元协定（Meta-Protocol）驱动**：插件必须显式声明协议坐标（`apiVersion: 'dsh-std/v1'`）与能力清单，使用纯函数协商，不硬编码未定型的私有内部实现。
2. **领域协议（Domain Protocols）正交分离**：`tool`（工具）、`command`（命令）、`presentation`（UI 交互与插槽）、`model`（模型接口）、`connection`（通信握手）各司其职、独立版本化演进。
3. **单点减震（Adapter Pattern）**：业务代码只面对标准 Adapter，无论 DSH 官方如何升级重构，业务插件“一次编写，跨端到处运行”。

---

## 插件开发 6 大铁律（必须严格遵守）

1. **绝对锁死上游源码（Never Edit Upstream）**：
   - 严禁修改 `deepseek-harness/` 官方子模块中的任何文件；
   - 插件能力完全通过 Cordis 插件生命周期和 Slot 插槽挂载。
2. **沙箱边界安全（No Raw Node Leak in Renderer）**：
   - Client Web 渲染端绝对不得直接引入 `node:fs`、`child_process` 或 `electron` 原生句柄；
   - 跨端通信必须通过标准 Loopback HTTP/WebSocket 或已暴露的 Cordis Service。
3. **静态清单完备（Static Capability Declaration）**：
   - 必须在插件元数据或配置中显式声明所申请的权限（如 `network`、`workspace-fs`、`settings`）及支持的平台。
4. **插槽自注册机制（Slot Self-Registration）**：
   - UI 扩展挂载到官方标准 Slot（如 `sidebar.settings`、`settings.general.item`、`composer.action` 等）；
   - 遵守安全区几何（`safeAreaInsets`）与拖拽排除（`-webkit-app-region: no-drag`）。
5. **冷热感知明确（Hot-reload vs Restart）**：
   - 纯数据、技能开关和提示词调整优先实现无感热生效（Hot-reload）；
   - 涉及深层进程启动或原生窗口模式变更时，显式标记 `applies: 'restart'`。
6. **无头测试安全性（Headless-Safe Verification）**：
   - 插件必须提供无头环境下的单元测试，避免直接调用依赖图形界面的浏览器全局对象。

---

## 常用插件开发工作流

### 步骤 1：确定插件类型与所属领域
- **纯函数工具类（Tool）**：向 Agent 提供特定能力（如查天气、SQL 查询、API 对接）➡️ 采用 `tool` 领域协议；
- **斜杠命令类（Command）**：向聊天框提供 `/xxx` 快速指令 ➡️ 采用 `command` 领域协议；
- **界面插槽类（Presentation）**：在侧边栏、设置页或输入框挂载自定义组件 ➡️ 采用 `presentation` 领域协议；
- **后台常驻服务（Service）**：持久化状态、定时任务或守护进程 ➡️ 采用 Host `Service`。

### 步骤 2：使用标准模板脚手架
参考本技能目录中的模板：
- [基础工具插件模板](templates/basic-tool.ts)
- [UI 插槽组件模板](templates/ui-slot-component.tsx)
- [后台服务插件模板](templates/service-backend.ts)

### 步骤 3：自检与准入审计清单（Checker Checklist）
编写完代码后，必须逐条自检：
- [ ] 是否在头部/元数据中声明了 `apiVersion: 'dsh-std/v1'`？
- [ ] 是否存在向 Web 渲染端泄露 Node 原生句柄的危险引用？
- [ ] 是否存在直接修改 `deepseek-harness/` 子模块的违法操作？
- [ ] 所有异步调用是否包含严密的 `try-catch` 与友好错误提示？
- [ ] 是否已编写对应的 Vitest / Jest 单元测试？
