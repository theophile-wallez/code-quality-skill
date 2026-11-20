# Structure

Code is read far more than it's written. Its layout should tell a newcomer
where things are before they open a file.

## Modules

- **One concern per module.** A file parses, or renders, or talks to the
  network; it doesn't do all three. When you can't name a file without
  "and", split it.
- **Pure logic apart from effects.** Parsing, rules, geometry, formatting and
  computations live in modules that touch no DOM, network, disk or clock. They
  are tested without mocks. The code around them is thin and does the I/O.
- **Size limits.** About 250 lines per file, 60 per function, 4 parameters,
  a cyclomatic complexity of 15, 4 levels of nesting. Test files can be longer
  (about 400 lines). These are alarms, not goals: split by what the code
  does, never by cutting a function in two at line 60.
- **Stylesheets too:** past about 400 lines, a folder of partials.

## Folders

- **By feature, not by kind.** `billing/` holding its component, hooks, API
  calls, schema and tests beats `components/`, `hooks/`, `api/` spread across
  the tree. Colocate a module's test, styles and types beside it.
- **A feature has one entry point** that the app registers in one place
  (a route, an `index.ts` list in start order, a plugin list). Adding a feature
  is adding a folder and a line, not editing ten files.
- **Shared code has one home** (`shared/`, `lib/`), and you look there
  before writing a helper. Test-only helpers go in their own folder
  (`shared/testing/`) and are never imported by production code.
- **UI primitives apart from feature components.** `components/ui/` holds the
  design system's building blocks; features compose them in their own folders.

## Imports

- **Path aliases across folders**, never `../../`: package.json `imports`
  (`#shared/*`) or tsconfig `paths` (`@/lib/*`). `./` for the same folder or
  below. An alias that points into the importer's own folder should be `./`.
- **No import cycles.** A cycle means two modules are one concern, or a third
  one is missing.
- **Named exports**, not `export default`: one name per thing, across the
  codebase, which rename tools and search follow. (Frameworks that require a
  default export, such as some route files, are the exception.)
- **No barrel files** (`index.ts` that re-exports a folder). They hide where
  things live, slow builds and tests, and invite cycles. Import from the file.
- **Restrict what each area may import** when the architecture has layers or
  runtimes: the domain doesn't import the UI, the browser code doesn't import
  a server module. A lint rule (`no-restricted-imports`,
  `no-restricted-globals`, eslint-plugin-boundaries) or a tsconfig per area
  makes it a check.
- Keep the file extension in relative imports when the runtime needs it
  (Node ESM, `allowImportingTsExtensions`), and do it everywhere.

## Inside a file

The same order in every file, so the eye knows where to look:

1. imports;
2. constants;
3. types;
4. the exported functions or component, the reason the file exists;
5. private helpers.

A module may open with a few lines on what it is for. Nothing else at the top.

## Naming things that belong to you

When code shares a space with code you don't own (a page you inject into,
global CSS, `localStorage`, `postMessage`, events), prefix everything of
yours with one prefix kept in one constant: classes, ids, data attributes,
CSS variables, storage keys, message types. Keep storage keys and message
types in one registry, never as string literals scattered around.

## Recipes

When a kind of change comes back often (a page, an endpoint, a storage key,
a feature), write its recipe in `AGENTS.md`: which file to create, where to
register it, what test to write, which doc line to add. The next person, or
agent, follows it instead of guessing.
