# Hi-DSH — 产品定位

## 一句话
为自己，也分享给和我一样嫌官方丑、嫌 CLI 难用的人，在 Mac/Win 上双击即用的、高度可视化拼装的 DSH。

## 核心差异：插槽化拼装，不是插件列表
- 所有能力都是“选项”，可启用/禁用
- 互斥与否看插件实际声明，不预设单选/多选
- 热生效 vs 需重启看插件实际能力，UI 上明确区分

## v0.1 范围：只做技能热开关
- 壳：Fork dsh-desktop，锁死上游
- 魂：dsh-plugin-skill-board，可视化开关技能，关掉即不进上下文，省 Token

## 来源与协议
- Fork from anywhere-labs/dsh-desktop (MIT)
- Upstream deepseek-ai/deepseek-harness (MIT) @ b150a551b8d465e31e418e1b2eaf5e79bbb7d28e
- 本项目 MIT，需保留原 LICENSE，品牌已更名为 Hi-DSH，不冒充官方
