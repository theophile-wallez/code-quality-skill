# Workflow: changes, commits, docs

## How a change goes

1. **Read first.** The project's `AGENTS.md` (whole), the area's own notes,
   and a neighboring feature that does something similar. Find the helpers
   that exist before writing new ones.
2. **Draft.** Write the change to the standard of this skill, and run the fast
   check (types, lint, format, the tests of what changed). When the user
   judges the result by looking at it, show it to them before going further,
   and iterate on what they say.
3. **Finish.** Once the approach is agreed: write the tests (see each fail
   once), run the full check, look at the result for real (every breakpoint
   it touches, both color schemes), update the docs.
4. **Review your own diff**, line by line, as a demanding senior would. Is
   each line needed? Would its name, its comment, its test pass review? Is
   there anything left over?
5. **Ship** the way the project ships (see below).

## Changes

- **Small and focused**: one subject per change and per commit. A refactor,
  a reformat or a dependency update goes in its own commit.
- **A bug seen on the way** gets fixed in the same change (and said so), not
  left for later.
- **No throwaway files** left in the repository: scratch scripts,
  screenshots, logs, notes.

## Commits

- **In English, imperative, short**: a summary of about 70 characters at most
  that says what the change does ("Fix the total on discounted orders"), not
  how or which files.
- **A body only when the why isn't obvious**: the reason, the trade-off, a
  behavior change on purpose. Not a list of files.
- **No tool attribution** (`Co-Authored-By` an agent, "Generated with…")
  unless the project asks for it.
- **A straight history** when the project wants one: rebase onto the main
  branch rather than merge it in, push as a fast-forward, and run the full
  check again if the rebase brought changes to the files you touched.
- **Never rewrite shared history** (no force push to the main branch).

## Docs

- **`AGENTS.md` at the root**, read whole by every agent before changing
  anything, and by every new contributor. `CLAUDE.md` is a symlink to it (or
  a one-line `@AGENTS.md` import), so there's one source. Template:
  [`assets/AGENTS.md`](../assets/AGENTS.md).
- What it holds: the project in brief, **the quality bar** (the rules of this
  skill that apply, short), the commands, where things go, recipes for the
  changes that come back often, the pitfalls learned the hard way, and the
  definition of done.
- **Rules live in one place.** A rule written in two files ends up saying two
  things. Other files link to `AGENTS.md` rather than repeat it.
- **Pitfalls of one area** go in an `AGENTS.md` beside its code (with a
  `CLAUDE.md` that points to it), listed from the root's. Each is a short
  paragraph: the trap, why, what to do.
- **Docs change with the code.** When a change alters what a doc, a README or
  a comment describes, it updates it in the same change.
- **Architecture** that's more than a page goes in `docs/architecture.md`,
  linked from `AGENTS.md`.

## Definition of done

Written in `AGENTS.md` as a checklist, so everyone ends at the same place:

- [ ] The full check passes.
- [ ] New or changed behavior has tests, seen failing without the change.
- [ ] A user-visible change was looked at running, at every size it touches,
      in both color schemes.
- [ ] Docs match the code. No throwaway files.
- [ ] Shipped the project's way.
