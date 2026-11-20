# Production

Code that's clean in the editor still has to be run, watched and changed
safely once it's live.

## Observing

- **Errors are tracked** (Sentry or similar) on the client and the server,
  with source maps and the release they come from, so a new error points to
  the change that brought it.
- **Logs are structured** (JSON with a message and fields, through one
  logger), with a level and a request id; never `console.log` strings stitched
  together. No personal data, token or password in a log.
- **What matters is measured**: response times, error rates, Core Web Vitals,
  the business events the product cares about.

## Data

- **The database schema changes through versioned migrations**, committed
  with the code that needs them and run by the deploy, never by hand on a
  server.
- **Migrations are backward compatible** with the code still running during a
  deploy: add a column, ship the code that uses it, then remove the old one in
  a later change.
- **Backups exist and have been restored once**, to know they work.

## Deploying

- **Every branch can get a preview deployment**, so a change is looked at
  running before it's merged.
- **The deploy is automated** from the main branch, and the same build goes to
  every environment; configuration comes from the environment.
- **End-to-end tests cover the critical paths** (sign-up, sign-in, payment,
  the main screen) and run before a release.
- **A release can be rolled back** quickly: the previous build kept, a flag to
  switch off a risky feature.
- **The version is computed, not typed**: from tags or the commit count in
  CI, so nobody bumps it by hand or forgets to.

## Dependencies and toolchain

- **Pinned versions**: the runtime (`.nvmrc`, `engines`), the package manager
  (`packageManager` in package.json, with corepack), tools like ruff at an
  exact version in CI, and the lockfile installed as is.
- **Automated updates, grouped and weekly** (Dependabot or Renovate):
  development tools in one group, runtime dependencies in another, CI actions
  in a third, with a cooldown of a few days on fresh releases. Template:
  [`assets/ci/dependabot.yml`](../assets/ci/dependabot.yml).
- **The CI setup is shared**: one composite action (or reusable workflow)
  installs the runtime and the dependencies, used by every job. Template:
  [`assets/ci/`](../assets/ci/).
- **Workflows are linted** (actionlint).
