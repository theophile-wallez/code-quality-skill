# Tooling

What a machine can check, a machine should check: a rule a reviewer must
remember is a rule that slides. These are the checks to have, then the tools
that do them. Keep what the project already uses; never run two tools for one
job (two formatters, two linters on the same rules).

## The checks

| Check                     | Suggested tools                                             |
| ------------------------- | ----------------------------------------------------------- |
| Types                     | `tsc` (or `tsgo`), one run per tsconfig                     |
| Lint, type-aware          | oxlint + `oxlint-tsgolint`, ESLint + typescript-eslint, Biome |
| Format                    | oxfmt, Prettier, Biome                                      |
| Rules no linter expresses | a small script of your own (`assets/scripts/check-sources.ts`) |
| Tests                     | Vitest, Playwright                                          |
| Dead code, unused deps    | knip                                                        |
| Spelling                  | cspell                                                      |
| Python, if any            | ruff (lint and format), pinned                              |
| CI workflows              | actionlint                                                  |

## One command

The project has one command that runs every check, the one CI runs and the
one to pass before calling a change done:

```json
{
  "scripts": {
    "typecheck": "tsc -b",
    "lint": "oxlint",
    "format:check": "oxfmt --check",
    "test": "vitest run",
    "check": "pnpm typecheck && pnpm lint && pnpm format:check && node scripts/check-sources.ts && pnpm test",
    "check:fast": "pnpm typecheck && pnpm lint && pnpm format:check && node scripts/check-sources.ts && vitest run --changed origin/main --passWithNoTests"
  }
}
```

`check:fast` runs only the tests of what changed, for the loop while a change
is in progress; `check` runs everything, before shipping. Add `lint:fix` and
`format` for what the tools can fix.

## Lint rules

Turn the correctness, suspicious and performance categories on as errors
(oxlint's `categories`, ESLint's `recommended` and typescript-eslint's
`strict-type-checked`). Warnings are noise that nobody reads: a rule is an
error or it's off. Then these, by name:

| Rule (oxlint / ESLint name)                        | Why                                       |
| -------------------------------------------------- | ----------------------------------------- |
| `typescript/no-explicit-any`                       | no `any`                                  |
| `typescript/consistent-type-assertions` (`never`)  | no `as`                                   |
| `typescript/no-non-null-assertion`                 | no `!`                                    |
| `typescript/no-unsafe-*` (argument, assignment, call, member-access, return) | `any` doesn't leak in |
| `typescript/no-floating-promises`, `no-misused-promises`, `await-thenable` | promises are awaited |
| `typescript/switch-exhaustiveness-check`           | every union member handled                |
| `typescript/prefer-nullish-coalescing`             | `??`, not `||`                            |
| `typescript/restrict-template-expressions`         | no `[object Object]` in strings           |
| `typescript/consistent-type-imports`               | `import type`                             |
| `typescript/explicit-module-boundary-types`        | exported functions declare their return   |
| `typescript/ban-ts-comment`                        | no `@ts-ignore` (ESLint)                  |
| `eqeqeq` (`always`, `null: ignore`)                | `===`                                     |
| `complexity` 15, `max-depth` 4, `max-params` 4     | small functions                           |
| `max-lines` 250, `max-lines-per-function` 60       | small files and functions                 |
| `no-nested-ternary`, `no-else-return`              | flat control flow                         |
| `id-length` (min 2, exceptions `i j k x y z _ T K`) | real names                               |
| `no-param-reassign`, `prefer-const`, `no-var`      | no mutation by surprise                   |
| `no-console` (allow `warn`, `error`)               | no debug leftovers                        |
| `no-restricted-imports` (`../*`)                   | aliases across folders                    |
| `no-restricted-globals`                            | an area can't use what its runtime lacks  |
| `import/no-cycle`, `no-duplicates`, `no-self-import` | a clean module graph                    |
| `import/no-default-export`                         | named exports                             |
| `unicorn/filename-case` (kebab)                    | one file naming                           |
| `unicorn/no-array-for-each` (`no-for-each` in recent ESLint plugin versions), `prefer-node-protocol` | clearer loops, `node:` imports |
| `jsx-a11y/*`                                       | accessible markup (see accessibility.md)  |
| `react-hooks/rules-of-hooks`, `exhaustive-deps`    | hooks used correctly                      |

Loosen a few for tests (longer files, no per-function limit, no return types)
and for Node scripts (console allowed), in the config's overrides, never in
the files.

**No inline disabling.** A comment that switches a rule off for a line hides
the problem from every later reader. ESLint: `linterOptions.noInlineConfig:
true`. oxlint: the custom source rules below reject the comment. If a rule is
wrong somewhere, change the config, with a reason.

Templates: [`assets/lint/.oxlintrc.json`](../assets/lint/.oxlintrc.json) and
[`assets/lint/eslint.config.js`](../assets/lint/eslint.config.js), the same
rules for each tool. With TypeScript 7, typescript-eslint's type-aware
rules still need TypeScript 6 installed beside it (see typescript-eslint's
docs); oxlint's type-aware mode (`oxlint-tsgolint`) runs on TypeScript 7
already. Type-aware linting takes memory: on a small machine, lint the files
that changed rather than the whole tree while you work. Biome covers most of them under its own names
(`noExplicitAny`, `noNonNullAssertion`, `useNamingConvention`,
`noExcessiveCognitiveComplexity`…) but has no type-aware rules like
`no-floating-promises` yet in every version: check before choosing it for a
strict TypeScript project.

## Format

- A formatter decides, nobody discusses: print width 100, single quotes,
  trailing commas, no parentheses around a lone arrow parameter (or the
  project's existing choice). Template:
  [`assets/.oxfmtrc.json`](../assets/.oxfmtrc.json); the same options exist
  in Prettier.
- An [`.editorconfig`](../assets/.editorconfig) for what editors do before
  the formatter runs: UTF-8, LF, 2 spaces, a final newline, no trailing spaces.
- Sort Tailwind classes automatically if the project uses Tailwind (the
  formatter's Tailwind plugin, or a lint rule).
- Generated files (`dist`, lockfiles, generated route trees) are ignored by
  the formatter and the linter.
- Reformatting the whole repository is a commit of its own, never mixed with
  a change.

## Rules no linter expresses

A short script, run in `check`, covers what's specific to the project:
comments that switch a check off, stylesheets past a length, remote URLs in
CSS, colors written outside the tokens (a color literal in a stylesheet,
a Tailwind palette or arbitrary color class, a hex string in code), an alias
into the importer's own folder, a banned import or API, a TODO without an
issue. Each rule is a regular expression and a message, and the script has
its own tests. Template:
[`assets/scripts/check-sources.ts`](../assets/scripts/check-sources.ts), with
its rules in [`source-rules.ts`](../assets/scripts/source-rules.ts).

The color rules are strict on purpose: adapt their lists (the tokens file's
name, the Tailwind prefixes) to the project rather than switching them off.

## Agent hooks

When coding agents work in the repository, a hook can stop what the docs
alone don't: a `PreToolUse` hook that refuses a heavy or dangerous command
(the full end-to-end suite on a laptop, a force push, `rm -rf` outside the
repository), with an explicit override for when the user asks for it.
Template: [`assets/hooks/block-commands.sh`](../assets/hooks/block-commands.sh).
