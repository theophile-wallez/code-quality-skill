# Review checklist

Go through the diff with these questions. Report what fails, most serious
first: correctness and security, then design, then readability. For each
finding give the file, the line, what's wrong, why it matters, and the fix.
Don't report what the linter or formatter already catches; run them instead.

## Correctness and safety

- [ ] Does it do what was asked, including the edge cases (empty, one,
      many, missing, duplicate, very long, concurrent)?
- [ ] Is every external input validated by a schema at the boundary, and the
      server checking permissions for this resource?
- [ ] Any `any`, `as`, `!`, `@ts-ignore` or lint-disable comment?
- [ ] Any promise not awaited, error swallowed, or `catch` that does nothing
      useful?
- [ ] Any markup built from strings without escaping, secret in the code, or
      input reaching SQL, a shell or a path?
- [ ] Are states modelled so that impossible combinations can't be written?

## Design

- [ ] Does each module have one concern, with pure logic apart from I/O?
- [ ] Does it reuse the project's helpers and patterns, or reinvent one?
- [ ] Any abstraction with one use, wrapper that only forwards, or layer "just
      in case"?
- [ ] Any defensive check of a case the types already rule out?
- [ ] Is there a new dependency, and was it needed and agreed?
- [ ] Do imports respect the project's layers (aliases, no cycles, no
      server code in the client)?

## Readability

- [ ] Do names say what things are, without abbreviations, catch-all words or
      the type in the name? Booleans as questions, functions as verbs, units
      in the name?
- [ ] Is the same concept called the same thing as elsewhere in the codebase?
- [ ] Early returns, no nested ternaries, no boolean flag parameters, no magic
      numbers, complex conditions named?
- [ ] Are comments few, short, plain, and about why? Any narration, history,
      banner, commented-out code, orphan TODO or "AI" voice?
- [ ] Files and functions within the size limits, split by meaning?

## Tests

- [ ] Is new or changed behavior tested, through the public API, on real
      outputs?
- [ ] Would the tests fail if the change were reverted?
- [ ] Any fixed sleep, dependency on time, locale or order, or mock of the
      thing under test?

## UI (if any)

- [ ] Built from the design system's primitives and tokens, no arbitrary
      values?
- [ ] Every color a token: no hex, `rgb()`, `oklch()` or named color outside
      the tokens file, no Tailwind palette class (`bg-blue-500`,
      `text-white`) or arbitrary color, no hex string in code?
- [ ] Keyboard, focus, labels, contrast, in both color schemes?
- [ ] Loading, empty, error and success states, and feedback on actions?
- [ ] Checked on phone, tablet and desktop, nothing overflowing sideways?
- [ ] Copy clear, consistent, and saying what to do next?

## Hygiene

- [ ] Docs, `AGENTS.md` and comments updated with the code?
- [ ] No debug logs, dead code, unrelated changes or throwaway files?
- [ ] Commit message in the imperative, saying what and, if needed, why?
