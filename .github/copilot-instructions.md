## Purpose
Help AI coding agents be productive in the oxJS repository: a collection of Loon/Clash/Quantumult-X automation scripts, Clash rule sets, and small helper assets.

## Where to look first
- `Loon/` — plugin manifests (`*.lpx` under `Loon/plugin`) and `Loon/Scripts/` contain the actual JS scripts referenced by plugins.
- `Clash/` — many per-service YAML rule files (e.g. `Clash/rule-kelee2025.10.27/*.yaml`) define domain/rule lists.
- `QX/` and `Scriptable/` — additional platform-specific scripts and examples.
- `\!CommonFiles/icon/` — shared icon assets and previews.

## Big-picture architecture & patterns
- This repo is a content/configuration repo (not a compiled project). It holds: 1) integration manifests for mobile proxy apps (Loon/Quantumult-X), 2) script files (mostly JS) called by those manifests, and 3) Clash rule YAMLs.
- Manifests (example: `Loon/plugin/task.lpx`) use a simple metadata format: header comments starting with a hash-plus-bang prefix (used for name/desc/loon_version/date), followed by sections like `[Argument]`, `[Script]`, and `[MitM]`.
- `[Argument]` entries follow an `argN` naming pattern (arg1..arg40). Plugins then reference those with `{argN}` placeholders in `[Script]` lines (e.g. `cron {arg3} script-path = <url>, enable= {arg2}`). Preserve this pattern when adding/removing args.
- `[Script]` lines commonly reference remote raw URLs (GitHub/Gist). When changing a script, update both the local copy under `Loon/Scripts/` (if present) and any plugin entries that point to remote/raw paths.

## Project-specific conventions (do these)
- Keep plugin metadata keys that use the hash-plus-bang prefix (name, desc, date, loon_version) unchanged in format and encoding.
- Use `argN` sequential numbering for arguments; do not reuse numbers in the same file — append new args at the end and update related `{argN}` references.
- Cron and trigger lines follow the pattern seen in `task.lpx`:
  - token capture: `http-request|http-response <pattern> script-path = <url>, requires-body = true, enable= {argX}, tag = <Tag>`
  - scheduled tasks: `cron {argY} script-path = <url>, enable= {argZ}, tag = <Tag>`
- Host interception list belongs in the `[MitM]` block — add domains there when a script captures tokens via MitM.
- When referencing internal scripts prefer repo raw links that include the branch (the codebase currently uses `refs/heads/dev` in many URLs). If you update a script, mirror the change both in `Loon/Scripts/` and update plugin `script-path` URLs.

## External dependencies & integration points
- Many scripts load or depend on remote JS hosted on GitHub or Gist (e.g. `raw.githubusercontent.com`, `gist.githubusercontent.com`). Treat these as external dependencies — changes to them may break multiple plugins.
- Clash rule files are standalone YAML lists used by downstream tools. Editing a rule file is low-risk but be mindful of service-specific naming and the repository's per-service organization.

## How to validate edits (manual steps)
- There is no CI or automated test harness in this repo. Validation is manual:
  1. For Loon/QX plugins, load the updated `.lpx` or config into the target app (Loon or Quantumult X) on a device/emulator and observe logs/notifications.
 2. For Clash rules, load the YAML into your Clash client and check that parsing succeeds and the expected domains appear.
- When changing a script referenced by remote URLs, update the local script and optionally test by replacing `script-path` temporarily with a local/raw branch URL and re-loading the config in-app.

## Small examples (concrete)
- Argument reference: `arg13 = input, "0 0 9 * * *", tag = [哔哩哔哩]定时参数Cron` and usage `cron {arg13} script-path = https://raw.githubusercontent.com/.../BiliBiliDailyBonus.js, enable={arg12}` — keep this mapping intact.
- MitM example (from `task.lpx`): `hostname = payapp.weixin.qq.com, auth.alipan.com, ...` — add domains here when a script needs to intercept requests.

## Editing & commit guidance
- Edit files in the `dev` branch and open a PR to merge to `main` (this repo commonly references `dev` in internal URLs).
- Make small, self-contained commits. When modifying a plugin manifest, include the referenced script edits in the same PR where possible (so reviewers can test end-to-end).

## What to avoid / gotchas
- Do not rewrite argument numbering in-place (renumbering breaks existing user configurations). Append new args instead.
- Avoid changing remote script URLs without ensuring the new target contains the same exported behavior. Many plugins reference third-party gists — altering these can silently break users.

If anything is unclear or you want more detail about a subdirectory (for example, the `Clash` rule format or the `Loon/Scripts` organization), tell me which area and I'll expand these instructions.
