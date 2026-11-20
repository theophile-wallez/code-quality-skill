# AGENTS.md

Instructions for AI coding agents (and humans) working on <project>. Read
this file whole before changing anything. The design is detailed in
[docs/architecture.md](docs/architecture.md).

## The project in brief

- <What it is, for whom, in two or three lines.>
- <The stack: language, framework, build, where it runs.>
- <The main parts and how they talk to each other.>

## The quality bar

Every change must read as if a senior engineer wrote it for code review.
`<pm> check` enforces much of what follows; the rest is on you.

**Types**

- Strict TypeScript. Never `any`, never a type assertion (`as`, `<T>x`, `!`;
  `as const` is fine), never `@ts-ignore` or a lint-disable comment.
- Every piece of data from outside (HTTP, JSON, storage, env, messages,
  forms) is validated by a <zod> schema, and its type is inferred from it.
- States are discriminated unions, not piles of booleans.

**Structure**

- One concern per module. Pure logic lives apart from the code that touches
  the DOM, the network or the disk.
- A feature is a folder under `<src/features>/`. Shared code goes in
  `<src/lib>/`: look there before writing a helper.
- Imports across folders use the `<@/>` aliases, never `../`. Named exports,
  no barrel files, no cycles.
- At most 250 lines per file, 60 per function, 4 parameters, complexity 15,
  no nested ternaries. Split by what the code does, not to dodge the limit.

**Names and comments**

- Names say what things are: `retryCount`, `isOpen`, `fetchInvoice`,
  `timeoutMs`; never `n`, `data`, `tmp`, `utils`. One word per concept.
- Comments are few, short and plain, and say why: a constraint, a pitfall, a
  choice that isn't obvious. Never narrate what the code does, never tell its
  history, no commented-out code, no "AI" voice.

**Simplicity and errors**

- No abstraction before the third use, no wrapper that only forwards, no
  check of what the types rule out, no `try/catch` where nothing can be done.
- Never swallow an error; a message says what failed and with what.

**UI**

- Components from `<components/ui>` (shadcn: add one with
  `npx shadcn@latest add <name>`), colors and spacing from the tokens in
  `<src/styles.css>`, never hardcoded.
- Every view that loads data handles loading, empty, error and success.
  Server data goes through <TanStack Query>.
- Keyboard, focus, labels and contrast, in both color schemes, at phone,
  tablet and desktop widths.

**Tests**

- Every change ships with tests, next to the code (`name.test.ts`), through
  the public API, on real outputs. See each new test fail once.
- No fixed sleeps in tests: wait for the thing you need.

**Docs**

- When you change what this file, a README or a comment describes, update it
  in the same change.

## Commands

| Command               | What it does                                               |
| --------------------- | ---------------------------------------------------------- |
| `<pm> install`        | installs the dependencies (<runtime and version> first)    |
| `<pm> dev`            | <runs the app on localhost:PORT>                           |
| `<pm> check`          | types, lint, format check, source rules, tests             |
| `<pm> check:fast`     | the same, with only the tests of what changed              |
| `<pm> test`           | unit tests                                                 |
| `<pm> lint:fix`, `format` | fix what the linter and formatter can                  |

## Where things go

- `<src/features>/`: <a folder per feature>.
- `<src/lib>/`: <shared helpers>, `testing/` for tests.
- `<src/components/ui>/`: <the design system's primitives>.
- `scripts/`: <build, checks, tooling>.

**Recipes**

- _A feature:_ <a folder, its entry point, where to register it, its tests,
  a line in docs/architecture.md>.
- _An endpoint:_ <its schema, its handler, its permission check, its test>.

## Pitfalls

Learned the hard way. Check here before touching the area concerned. Those of
one area are in an `AGENTS.md` beside its code.

- **<Pitfall>.** <What happens, why, and what to do instead, in two or three
  lines.>

## Definition of done

- [ ] `<pm> check` passes.
- [ ] New or changed behavior is covered by tests you've seen fail without
      the change.
- [ ] User-visible changes were looked at running: phone, tablet and desktop,
      both color schemes.
- [ ] Docs match the code. No throwaway files are left in the repo.

## Shipping

<How a change reaches main and production: branch and pull request, or
rebase and fast-forward; who starts CI; how releases are versioned.> Commit
messages are in English, in the imperative, under ~70 characters, with a body
only when the why isn't obvious.
