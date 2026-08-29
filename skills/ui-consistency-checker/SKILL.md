---
name: ui-consistency-checker
description: Check an app's UI/UX design for consistency, regression risk, and design-system ownership problems. Adapted from T3 Code's Macroscope ui-consistency checker. Use when asked to review, audit, or check UI code or a running app's interface (styling, theming, components, layout, accessibility, scroll behavior), before/after a UI change, or when the user wants their app's UI checked or restyled to a reference design (e.g. T3 Code style).
---

# UI Consistency Checker（UI 一致性检查器）

本 skill 源自 T3 Code（pingdotgg/t3code）的 `.macroscope/check-run-agents/ui-consistency.md` 检查 agent，通用化后可在任意项目上执行。它审查 UI 代码（或运行中的应用）是否与共享组件系统、样式所有权规则和行为约束保持一致。

**核心思想**：目标不是最少 CSS 或最少代码，而是**把每个行为放进最小的正确所有者**，同时保住交互、主题、可访问性、布局与浏览器行为。

---

## 使用方式

1. **确定审查范围**：一个 diff（改动行 + 直接受影响的调用点）或一个 UI 表面（某目录 / 某页面）。不要把聚焦的审查扩大成全仓库清理要求。
2. **收集证据**：
   - 代码证据：读样式来源、组件树、选择器消费者（字面量、动态、生成式、命令式、测试、custom element、shadow root 都要追）。
   - 实机证据：运行中的应用截图、计算样式、实际交互。**截图只能证明视觉，不能证明键盘、溢出、滚动条、响应式或运行时主题行为**——这些要配源码 / computed style / 实际操作验证。
3. **逐节套用下方规则**，只报告改动引入的、或改动直接使之恶化/相关联的具体问题。
4. **按 §报告 输出**。没有任何发现时，最终回应恰好一行 `All clear`，不加标题、解释、标点或后续分析。

---

## 1. 共享控件与变体

- 优先使用项目核心 UI 原语（如 `components/ui` 下的 Button/Input/Select/Toggle/Menu），而不是原生控件或本地重建的原语。普通产品 UI 中，重建 `Button` 的裸 `<button>`、重建 `Input` 的裸 `<input>`、本地复刻 `Select`/`Toggle`/`Menu` 的触发器，都是具体发现。
- 不要标记有意实现语义行、tab、resize 手柄、色板、图片目标、编辑器表面等行为或几何与核心原语不同的裸元素。
- 多个调用点重复同样的持久几何或处理时，优先抽象为命名原语尺寸或变体（紧凑控件、微型图标按钮、muted ghost 按钮、glass 按钮等）。上下文布局、宽度、颜色留在调用点。
- 标记在调用点用大段 class/样式覆盖原语核心高度、圆角、内边距、focus ring、cursor、命中目标或基础状态色的写法。同一模式确实共享时，优先扩展原语契约。
- 迁移时保持可访问性与交互语义：focus-visible ring、disabled 行为、loading 态、键盘行为、pointer cursor、`aria-*`、render/close props、粗指针命中目标。
- 纯视觉的小型 class 迁移不要求测试；原语组合改变了行为、prop 透传、状态转移、键盘处理或宽度/默认值逻辑时，要求聚焦测试。

## 2. CSS 与样式所有权

- 单一所有者的普通呈现样式属于所属 TS/TSX 模块（静态样式、owner 级 CSS 变量）：局部几何、间距、字体、背景、边框、简单伪元素、组件内定位。
- 真正可复用或行为复杂的才留在全局 CSS：生成的 markdown 或命令式 DOM、custom element 与 shadow root、mask、共享/复杂伪元素、动画、glass 组合、运行时主题变量、安全区计算、滚动条通道保留、Electron 拖拽区、浏览器/厂商集成。
- 判定选择器已死之前，追踪所有消费者（字面量、动态、生成、命令式、测试、custom element、shadow root），沿 class 字符串和 class 值字段名追到最终 DOM 汇点。辅助函数返回 class 不代表它被渲染。
- 只有比较过 cascade layer、选择器特异性、继承、运行时主题作用域、media/variant 作用域和最终所属元素之后，才能标记重复声明。文本相同的声明不一定行为冗余。
- 把 CSS 移入实用类时保持选择器作用域与 cascade 所有权。所属处的 utility 优于依赖样式表顺序的脆弱全局覆盖。
- 行为依赖消费者传入 class 字符串时，优先源码逻辑而不是巧妙选择器。

## 3. 主题与生成样式

- 主题性声明使用项目变体机制（如 `@variant dark` / `@variant light`），裸 `.dark` 只应出现在变体定义内部。
- 保留自定义主题与运行时 token 桥。删除变量或选择器，必须先清点所有运行时、inspector、生成式、主题调色板消费者。
- 面向应用 chrome 的对比度/可访问性设置必须从语义色 token 派生。不要对 `html`、`body` 或应用根施加 `filter`：它会同时改变用户媒体、预览、终端、glass backdrop 和 view-transition 快照。
- 派生对比度 token 时保持 alpha 与表面所有权：半透明边框/输入向透明软化而不是不透明画布；用少量语义前景混合加强边框；基础前景变化时，卡片、popover、accent、secondary、消息前景要针对各自表面调整。
- 运行时调整的角色必须是普通自定义属性，由 Tailwind 桥、全局 CSS、命令式样式字符串、发给其他渲染器的桥快照共享。审计字面量 `var(--foreground)`、`var(--border)` 等角色读取，避免标题、markdown chrome、菜单、预览、utility 分裂成调整/未调整两套颜色。
- 使用了不寻常的变体、任意选择器、嵌套伪元素或属性匹配后，检查构建产物的实际 CSS。源码语法有效不等于产物有效；标记空的 `:is()`、永远匹配不到自己 class 的选择器分支等畸形产物。

## 4. 滚动与虚拟化列表

- `ScrollArea` 拥有并 mask 其 viewport；虚拟化列表通常拥有原生滚动元素，不能自动复用 viewport 级行为。
- 重复的原生/虚拟化溢出渐隐应使用共享的溢出渐隐契约，而不是组件命名 mask 选择器。
- 保留运行时上/下溢出状态；不要把动态渐隐换成常开的静态 mask。
- 保持渐隐几何，保持原生滚动条通道不透明——把滚动条一起渐隐的 mask 是回归。
- 更改虚拟化器、mask、溢出所有权或滚动条选择器时，验证真实滚动行为；源码 class 对比不够。

## 5. 视觉与布局保持

- 保持响应式几何、标题栏内嵌、面板与内联预览模式、桌面 Electron 布局、明暗对比、裁剪、圆角、可组合阴影。
- 有意义的视觉变化要用真实应用的真实组件与状态取证；mock 复刻不能验证真实组件。主题敏感样式变化时明暗两侧证据都有用；缺少证据本身不是发现，只报告有具体依据的回归。
- 警惕共享原语的色彩间接层：原语经 CSS 变量路由图标颜色时，迁移后的上下文图标要保留预期色调，包括按下与禁用态。

## 6. 共享渲染器中的上下文路由

- 共享渲染器执行上下文相关动作（环境 RPC、能力检查、OS 派生标签）时，必须从显式作用域解析目标（绑定的环境 id、来自所属表面的 prop）。绝不允许静默回退到"全局当前"环境。
- 调用点无法提供显式作用域时，抑制该动作而不是猜。隐藏菜单项是正确的；指向错误服务器的项是具体发现。
- 能力门控、动作分发、用户可见标签必须读取同一份将执行动作的服务配置。标签源自 A 而动作打向 B 是发现。

## 7. 变更纪律

- 审查改动范围与直接受影响的消费者。聚焦的 PR 不应变成对无关遗留清理的要求。
- 优先最小持久契约，而不是组件特例或只有一个消费者的宽抽象。
- 保留解释浏览器、虚拟化器、主题或 Electron 约束的有意例外与注释。
- 提议的清理无法证明所有权或语义等价时，要证据或保持原样，不要猜。
- 按改动的行为选择验证门：类型/聚焦测试验证类型与交互契约；生产构建与产物 CSS 检查验证样式变换；有意义的视觉行为用实机取证。门是互补的，不要求每次都过全部。

## 8. 报告

- 只报告改动行/行为引入的具体违规，以及补丁直接使之相关或恶化的既有行为。碰了大文件不等于无关遗留问题可报。
- 优先在最小相关行区间给精确意见。解释破坏的行为或所有权规则，而不只是偏好的写法，并给出最小预期修复。明确的一致性或回归风险可判 fail；可选的审美偏好、无害的 class 顺序、无关遗留代码不可判 fail。
- 输出格式：每条发现 = `[严重度] 文件:行号 — 规则 — 问题 — 最小修复`；严重度用 `P0 回归 / P1 应修 / P2 建议`。

---

## 附：Hi-DSH 项目适配（在本仓库执行时附加以下规则）

- **上游只读**：`deepseek-harness/` 是 pinned submodule，兼容模式下上游 client 不加任何 override。一切发现只能落在 `dsh-plugin-desktop/`、`dsh-plugin-skill-board/` 等桌面自有包；不得要求改上游。
- **CSS 产物是哈希类名**：上游 CSS module 类名按构建哈希（如 `pbvGtq_section`）。DOM 锚定必须用 React 结构（tab id 后缀 `-tab-*`、`role="tablist"`、`data-active`），禁止匹配 class 子串。
- **locale 单一所有者**：上游 locale 命名空间重复注册会抛错。改文案只能走幂等 DOM 重标注观察器（React 重渲染后下一 tick 恢复）。
- **样式注入机制**：桌面自有 UI 的样式在 `dsh-plugin-desktop/src/client/desktop-settings-styles.ts`（`dsh*` 前缀类 + 宿主 CSS 变量如 `--dsw-alias-*`），组件内还有内联样式。检查两种来源的一致性。
- **实机取证**：外部浏览器用带环境参数的 URL 打开 `http://127.0.0.1:43120/?dsh-desktop-mode=compatibility&dsh-desktop-platform=darwin&dsh-desktop-material=off&dsh-desktop-version=<semver>`（端口以实际运行为准），再开 Settings；或直接观察 Electron 窗口。改样式后走 `corepack yarn build` + 桌面端两步重启或 renderer reload。
- **验证门**：`corepack yarn typecheck` + `corepack yarn test` + `corepack yarn build`。
