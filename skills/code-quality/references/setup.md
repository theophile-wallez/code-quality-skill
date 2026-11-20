# Setting up a project

How to bring a project up to this skill's standard, new or existing. The
files to copy are in [`assets/`](../assets/); each one is a starting point to
adapt, not to paste blind.

## 1. Look before adding

- Read `package.json` (scripts, dependencies, `packageManager`, `engines`),
  the existing configs (`tsconfig*.json`, lint and format configs,
  `.editorconfig`), the CI workflows and any `AGENTS.md` or `CLAUDE.md`.
- List which checks exist and which tool does each. **Keep the tools in
  place**: map the rules onto them. Propose a new tool only for a check that
  has none, and say why.
- Ask the user before adding a dependency, switching a tool, or anything
  that rewrites many files (a stricter tsconfig, a new formatter).

## 2. Bring it in step by step

On an existing codebase, turning every rule on at once gives hundreds of
errors and a change nobody can review. Go in steps, each its own commit:

1. **Formatter and `.editorconfig`**, with the whole reformat in a commit of
   its own.
2. **Type checker**: `strict` first, then the stricter options one by one
   (`noUncheckedIndexedAccess` usually finds the most).
3. **Linter**: the correctness categories, then the type-aware rules, then
   the size and naming limits. A rule the code can't meet yet can wait, off,
   in the config with a note; never as disable comments in the files.
4. **Custom source rules**, **tests in the check command**, then **CI**.
5. **`AGENTS.md`** with the quality bar and the commands.

## 3. The files

| Asset                                    | Goes to                          | Adapt                                        |
| ---------------------------------------- | -------------------------------- | -------------------------------------------- |
| `tsconfig.base.json`                     | root, extended by each area's tsconfig | `lib`, `types`, `module` for the runtime |
| `lint/.oxlintrc.json` or `lint/eslint.config.js` | root (only one of them)  | plugins for the framework (`react`, `jsx-a11y`), overrides' paths |
| `.oxfmtrc.json`                          | root, if oxfmt is the formatter  | the ignore list                              |
| `.editorconfig`                          | root                             | indent size for other languages              |
| `vitest.config.ts`                       | root, if Vitest                  | environments, setup files, coverage paths    |
| `scripts/check-sources.ts`               | `scripts/`                       | the folders and the rules                    |
| `ci/ci.yml`, `ci/setup/action.yml`       | `.github/workflows/`, `.github/actions/setup/` | the steps, the triggers        |
| `ci/dependabot.yml`                      | `.github/`                       | ecosystems, ignored majors                   |
| `AGENTS.md`                              | root, with `CLAUDE.md` linking to it | everything in angle brackets            |
| `hooks/block-commands.sh`                | `.claude/hooks/`, registered in `.claude/settings.json` | the commands to block |

## 4. The commands

Add to `package.json` (with the project's package manager and tools):

- `typecheck`, `lint`, `lint:fix`, `format`, `format:check`, `test`;
- `check`: all of them, plus the source rules: the one command CI runs;
- `check:fast`: the same with only the tests of what changed.

Then run `check`, fix what it finds (or record what's left for a later step),
and write the commands into `AGENTS.md`.

## 5. For a web app

On top of the above, see [ui.md](ui.md) and [app-patterns.md](app-patterns.md):

- shadcn initialized (`npx shadcn@latest init`), `components/ui/` for its
  primitives, `cn()` in `lib/utils`;
- tokens in CSS variables, both color schemes;
- a cache library for server data, a router with typed search params, a form
  library with schemas;
- environment variables validated at startup;
- error tracking, an accessibility lint plugin and an axe check in the
  end-to-end tests.
