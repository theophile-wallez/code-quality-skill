---
name: code-quality
description: Holds code to a senior engineer's standard (strict types, validated boundaries, small focused modules, explicit names, few plain comments, behavior covered by tests) and sets up the checks that enforce it (type checker, linter, formatter, tests, CI, agent docs). Covers modern web apps too (shadcn-style components, Tailwind tokens, accessibility, UI states, forms, server state, production hygiene) and when Effect is worth it. Use when writing, reviewing or refactoring TypeScript or JavaScript, when setting up lint, format, test or CI for a project, or when the user asks for clean, professional, readable or "not AI-looking" code.
---

# Code quality

Every change must read as if a senior engineer wrote it for code review:
clear, small, typed, tested, and no more clever than it needs to be. This
skill gives the rules, the reasons behind them, and ready-made configs that
let the machine enforce what it can.

## How to use it

- **Writing or refactoring code.** Follow the core rules below, and open the
  reference of the area you touch before you start (see the table).
- **Reviewing code.** Go through
  [references/review-checklist.md](references/review-checklist.md) and report
  what fails, most serious first, with the file, the line and the fix.
- **Setting up a project.** Follow [references/setup.md](references/setup.md):
  it says what to look at first, which files of `assets/` to copy and how to
  adapt them.

**Tools are suggestions, not requirements.** Each rule is written as a
principle; the tools named after it (oxlint, ESLint, Biome, Vitest, zod,
shadcn, Tailwind, TanStack Query, Effect…) are ways to get there. If the
project already has a tool for a job, keep it and map the rules onto it.
Never add a second tool that does the same job as one already in place, and
never add a dependency the user didn't agree to.

**The codebase comes first.** Before writing anything, read how the project
already does it (its `AGENTS.md`, its helpers, a neighboring feature) and do
it the same way. One way of doing each thing beats two good ones.

## Core rules

These hold everywhere. The references explain each one, with examples.

**Types**

- Strict mode on. No `any`, no type assertion (`as`, `<T>x`, `!`; `as const`
  is fine), no `@ts-ignore`, `@ts-expect-error` or lint-disable comment.
- Everything that comes from outside (HTTP, JSON, storage, env, messages,
  forms, third-party globals) is validated by a schema at the boundary, and
  its type is inferred from that schema, never written by hand.
- Model states with discriminated unions, not with a pile of booleans and
  optional fields.

**Structure**

- One concern per module. Pure logic lives apart from what touches the DOM,
  the network or the disk, so it can be tested alone.
- Look for an existing helper before writing one. Shared code has one home.
- Files stay short (about 250 lines), functions too (about 60), with 4
  parameters at most (beyond that, an options object) and no nested ternary.
  Split by what the code does, never just to pass the limit.
- No import cycle, no `../../` chains (use path aliases), named exports.

**Names and comments**

- Names say what things are: `retryCount`, `isOpen`, `fetchInvoice`,
  `timeoutMs`. No abbreviation, no `data`, `item`, `temp`, `manager`,
  `utils`. One word per concept across the codebase.
- Few comments, short (one or two lines), in plain natural language, saying
  why: a constraint, a pitfall, a choice that isn't obvious. Never narrate
  what the code does, never tell its history, no commented-out code, no
  marketing or "AI" voice, no emoji.

**Simplicity**

- Early returns, not nested `if`s. Named constants, not magic numbers. A
  complex condition gets a name.
- No abstraction before the third repetition, no wrapper that only forwards,
  no defensive check of a case the types rule out, no `try/catch` where
  nothing can be done about the error.
- No leftover debug logs, dead code or throwaway files.

**Errors**

- Never swallow an error. A message says what happened, with the context to
  act on it. Fail fast on bugs; handle expected failures (network, input)
  where something useful can be done.

**Tests**

- Every change ships with tests of its behavior, through the public API,
  asserting on real outputs. See each new test fail once before trusting it.
- No fixed sleeps: wait for the condition.

**UI** (when the project has one)

- Accessible primitives (shadcn on Radix or Base UI, React Aria…) rather
  than hand-rolled overlays. Design tokens as CSS variables, no hardcoded
  colors. Keyboard, focus and contrast checked, in both color schemes.
- Every view that loads data handles loading, empty, error and success.
- Server state goes through a cache library, not `useEffect` + `fetch`.

**Docs and changes**

- When code changes what a doc or comment says, update it in the same change.
- Small, focused changes: one subject per commit, no unrelated reformatting.
- Before calling it done, read your own diff as a demanding reviewer would.

## References

| Area                                       | Open when you…                                        |
| ------------------------------------------ | ----------------------------------------------------- |
| [typescript.md](references/typescript.md)  | write types, read external data, model state          |
| [structure.md](references/structure.md)    | add a file or feature, move code, import across dirs  |
| [naming.md](references/naming.md)          | name anything                                         |
| [comments.md](references/comments.md)      | write or keep a comment                               |
| [functions.md](references/functions.md)    | write a function, a condition, a loop                 |
| [simplicity.md](references/simplicity.md)  | are tempted to abstract, wrap, guard or catch         |
| [errors.md](references/errors.md)          | throw, catch, return a failure, or consider Effect    |
| [testing.md](references/testing.md)        | write or change tests                                 |
| [tooling.md](references/tooling.md)        | configure type checker, linter, formatter, checks     |
| [ui.md](references/ui.md)                  | build components, style, theme, animate, write copy   |
| [accessibility.md](references/accessibility.md) | build anything interactive                       |
| [app-patterns.md](references/app-patterns.md) | fetch data, handle UI states, build forms, React perf |
| [security.md](references/security.md)      | handle input, HTML, auth, secrets, env, headers       |
| [production.md](references/production.md)  | log, monitor, migrate, deploy, manage dependencies    |
| [workflow.md](references/workflow.md)      | commit, ship, write `AGENTS.md`, define done          |
| [review-checklist.md](references/review-checklist.md) | review a change                            |
| [setup.md](references/setup.md)            | set up a new or existing project                      |

## Definition of done

A change is done when all of these hold:

- [ ] The project's full check passes: types, lint, format, custom rules, tests.
- [ ] New or changed behavior is covered by tests you've seen fail without it.
- [ ] A user-visible change was looked at for real (the running app, every
      breakpoint it touches, both color schemes), not only in tests.
- [ ] Docs, `AGENTS.md` and comments match the code.
- [ ] No debug code, dead code or throwaway file is left.
- [ ] The diff was reread line by line, and each line earns its place.
