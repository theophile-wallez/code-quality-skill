# code-quality

An agent skill that holds code to a senior engineer's standard, and sets up
the checks that keep it there. It works with Claude Code, and with any agent
that reads the `SKILL.md` format.

The rules come from a real codebase that had to be rewritten once because a
contributor called it AI-generated and unclean. The skill keeps that from
happening again. Its rules cover:

- **Types:** strict TypeScript, no `any` or `as`, every external input
  validated by a schema, states modelled as unions.
- **Structure:** one concern per module, pure logic apart from I/O, short
  files and functions, aliases instead of `../`, no import cycles.
- **Names and comments:** names that say what things are, and few short
  comments in plain language that say why. No narration and no "AI" voice.
- **Simplicity:** no abstraction before the third use, no wrapper that only
  forwards, no defensive checks of impossible cases, no errors swallowed.
- **Errors:** when a plain `try/catch` is enough, when to use a `Result`
  type, and when [Effect](https://effect.website) is worth it.
- **Tests:** test behavior on real outputs, and see each test fail once.
- **Modern UI:** shadcn-style primitives, Tailwind tokens, both color
  schemes, accessibility, loading, empty and error states, forms, server
  state.
- **Production:** security, observability, migrations, pinned toolchains,
  least-privilege CI.
- **Workflow:** focused commits, an `AGENTS.md` that holds the rules, and a
  definition of done.

Tools are suggested, never imposed. Each rule is written as a principle,
followed by the tools that enforce it: oxlint or ESLint or Biome, oxfmt or
Prettier, zod or Valibot, Vitest, Playwright, knip. A project keeps the
tools it already has.

## Install

With the [`skills`](https://skills.sh) CLI (Claude Code, Codex, Cursor,
OpenCode and more):

```bash
npx skills add theophile-wallez/code-quality-skill
```

As a Claude Code plugin:

```
/plugin marketplace add theophile-wallez/code-quality-skill
/plugin install code-quality@code-quality
```

Or copy `skills/code-quality` into `~/.claude/skills/` (for every project) or
into a project's `.claude/skills/`.

Then ask, for example:

- _"Review this change for code quality."_
- _"Set up linting, formatting and CI for this project."_
- _"Refactor this module so it reads like a senior wrote it."_

## What's inside

- [`SKILL.md`](skills/code-quality/SKILL.md) holds the core rules, how to use
  the skill and the definition of done.
- [`references/`](skills/code-quality/references/) has one file per area, with
  before/after examples: TypeScript, structure, naming, comments, functions,
  simplicity, errors and Effect, testing, tooling, UI, accessibility, app
  patterns, security, production, workflow. It also holds a
  [review checklist](skills/code-quality/references/review-checklist.md) and
  a [setup guide](skills/code-quality/references/setup.md).
- [`assets/`](skills/code-quality/assets/) has configs to copy and adapt:
  - `tsconfig.base.json` with the strict options;
  - the same lint rules for oxlint and for ESLint;
  - oxfmt and `.editorconfig`;
  - a Vitest config;
  - a script for the rules no linter expresses, with its tests;
  - GitHub Actions CI and Dependabot;
  - an `AGENTS.md` template;
  - a Claude Code hook that blocks heavy or dangerous commands.

The configs were run on a sample project. The oxlint and ESLint configs
catch what the rules forbid and pass clean code, and the source-rules
script's tests pass.

## License

MIT
