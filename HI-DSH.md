# Hi-DSH — 产品定位与开发规范备忘录

## 一、一句话定位
为自己，也分享给和我一样嫌官方丑、嫌 CLI 难用的人，在 Mac/Win 上双击即用的、高度可视化拼装的 DSH 桌面发行版。

---

## 二、核心差异：插槽化拼装，不是插件列表
- **一切皆选项**：所有能力都是可装配、可插拔的插槽选项（Slot Options）；
- **按需互斥**：互斥与否看插件实际声明与能力，不预设死板的单选/多选；
- **冷热感知明确**：热生效（Hot-reload）vs 需重启（Restart-required）在 UI 上明确区分展示；
- **v0.1 核心重点**：`dsh-plugin-skill-board`（技能看板），可视化开关技能，关闭直接通过修改 Frontmatter `disable-model-invocation: true` 并由 `chokidar` 热监听生效，不进后续 `<available_skills>` 提示词上下文，显著省 Token、降延迟。

---

## 三、功能开发与界面改造必须遵守的 6 大铁律

1. **绝对锁死上游源码（Never Edit Upstream）**：
   - `deepseek-harness/` 是固定的 Git Submodule，严禁直接修改；
   - 所有功能与 UI 改造在自有 package（如 `dsh-plugin-desktop`、`dsh-plugin-skill-board`、`dsh-community-market`）中通过 Cordis 插件与 Slot 插槽实现。
2. **包管理器与工作区隔离**：
   - 根工作区与自有包统一使用 Yarn 4.18.0（`nodeLinker: node-modules`）；
   - 上游 submodule 保持独立 pnpm workspace，严禁混用。
3. **严格的安全沙箱（No Raw IPC Leak）**：
   - 沙箱 Web 渲染端绝不暴露 Node/Electron 原生句柄；
   - 界面与底层通信严格走 Loopback HTTP / WebSocket 或公开 Cordis Client Service（如 `desktopWindow`）。
4. **UI 插槽与几何安全区规范**：
   - 界面扩展挂载到官方 Slot 或注册独立 Route；
   - 遵守 `desktopWindow` 的 `safeAreaInsets` 和 `-webkit-app-region: no-drag` 拖拽排除规则。
5. **保持无头门禁安全（Headless-Safe）**：
   - `yarn build`、`yarn typecheck`、`yarn test`、`yarn check` 必须在无图形环境下 100% 通过。
6. **双语对齐与依赖方向一致性**：
   - 用户可见文档保持中英双语对齐，严格遵守架构依赖方向。

---

## 四、社区插件共创标准（`dsh-std`）核心理念备忘

参考社区 [Yan-Zero/dsh-std](https://github.com/Yan-Zero/dsh-std) 及仓库中的 `dsh-community-fabric`：

1. **元协定（Meta-Protocol）`@dsh-std/core`**：
   - “管协定的协定”：核心无业务字段，只定义协议坐标（`apiVersion` + `kind`）、能力声明（`requires`/`supports`）与纯函数协商。
2. **独立领域协议（Domain-Specific Protocols）**：
   - `command`（命令）、`tool`（工具）、`model`（模型）、`presentation`（交互弹窗/审批）、`connection`（连接握手）等独立版本化。
3. **Adapter 单点减震器**：
   - 上游内核重构的变化由适配层吸收，生态插件做到“一次编写，跨端（Web/Desktop/TUI/Headless）到处运行”。
4. **静态清单感知**：
   - 不跑代码即可静态推断环境兼容性与所需权限。

---

## 五、来源与协议
- Fork from `anywhere-labs/dsh-desktop` (MIT)
- Upstream `deepseek-ai/deepseek-harness` (MIT) @ `b150a551b8d465e31e418e1b2eaf5e79bbb7d28e`
- 本项目 MIT，保留原 LICENSE，品牌更名为 Hi-DSH，不冒充官方。
