# AGENTS.md

## Commit message

简明扼要。写清改了什么，必要时补一句为什么。不写排查过程、像素值、选择器细节、文件清单；这些在 diff 和文档里。

格式：`type(scope): 一句话`

- type：`feat` / `fix` / `refactor` / `docs` / `test` / `chore` / `ci`；发版用 `release: vX.Y.Z`
- scope：改动所在的块，如 `home`、`operator`、`enemies`、`preview`、`tokens`、`chrome`、`typography`、`site`
- 标题用中文，一行，尽量不超过 50 字；说结果（「头像视图整块居中」），不说过程
- 正文可省。需要时空一行，写 1–3 行说明，或几条 `- ` 列表，每条一行
- 有没同步完的下游（如 prts-skin-migration）用一句话带过