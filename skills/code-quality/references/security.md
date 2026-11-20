# Security

Most security bugs are quality bugs: unvalidated input, string-built markup,
a check done in the UI only. These rules close the common ones.

## Input and output

- **Validate every input on the server**, with the same schema as the
  client's when there is one. The client's validation is for the user's
  comfort, never for safety.
- **No markup built from strings.** Let the framework escape (JSX, templates).
  Where markup must be built as text, go through one escaping tagged template
  whose output has its own type, so unescaped text can't pass as markup; keep
  a "trusted" variant for constants only. No `innerHTML`,
  `dangerouslySetInnerHTML` or `v-html` with anything that came from outside
  without a sanitizer (DOMPurify).
- **Messages between windows or workers** check where they come from
  (`event.origin` or `event.source`) and validate their shape with a schema,
  in one module that does both.
- **No SQL, shell commands or file paths built from input**: parameterized
  queries or a query builder, argument arrays rather than a shell string, paths
  resolved and checked against their root.
- **Redirects** go only to allowed destinations, never to a URL taken from
  the query string as is.

## Access

- **The server checks permissions on every request**, for every resource:
  hiding a button is not access control. Check that the resource belongs to
  the user, not only that the user is signed in.
- **Sessions in cookies** that are `HttpOnly`, `Secure` and `SameSite=Lax`
  (or `Strict`), with CSRF protection where the framework doesn't give it.
- **Rate limits** on sign-in, sign-up, password reset and any costly or
  public endpoint.
- **Use a proven auth library or service**; never write password hashing,
  token signing or OAuth flows by hand.

## Secrets and configuration

- **No secret in the repository**, the client bundle or the logs. `.env` files
  are ignored by git; a `.env.example` lists the variables without values.
  Ignore key and certificate files (`*.pem`, `*.key`).
- **Environment variables are validated at startup** by a schema (t3-env,
  or zod over `process.env`), so a missing or malformed one stops the app at
  once instead of failing later. Variables exposed to the client are a
  separate, explicit list (`VITE_`, `NEXT_PUBLIC_`).
- **A leaked secret is rotated**, not just deleted from the history.

## Headers and assets

- **Security headers**: a Content Security Policy, HSTS,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and frame
  restrictions (`frame-ancestors`).
- **No assets loaded from third-party hosts at run time** unless needed and
  pinned (Subresource Integrity); bundle fonts, icons and scripts.

## Supply chain and CI

- **Lockfile committed and respected** (`--frozen-lockfile` in CI).
- **Fresh releases wait**: a minimum release age for new versions (pnpm's
  `minimumReleaseAge`, Dependabot's `cooldown`), as compromised packages are
  usually caught within days.
- **CI with the least permissions**: `permissions: {}` or `contents: read` by
  default, more only on the job that needs it, `persist-credentials: false` on
  checkouts, third-party actions pinned to a version (or a commit SHA), secrets
  only in the jobs that use them.
- **Review new dependencies**: who maintains it, how much it pulls in,
  whether the platform already does it.
