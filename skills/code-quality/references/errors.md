# Errors

There are two kinds of failure, and they're handled differently:

- **Bugs**: a state the code should never reach (an impossible branch, a
  broken invariant, a schema your own server breaks). Fail fast and loud, so
  it gets fixed: throw, let it reach the error tracker.
- **Expected failures**: the network is down, the input is invalid, the user
  isn't allowed, the record doesn't exist. They're part of the feature: handle
  them where something useful can be done, and show the user what to do.

## Rules

- **Never swallow an error.** No empty `catch`, no `catch` that only logs and
  carries on as if nothing happened, no `.catch(() => {})`.
- **Catch where you can act**: retry, fall back, show a message, or add
  context and rethrow. Elsewhere, let it propagate to one boundary (the
  request handler, the route's error boundary, the job runner) that reports
  it.
- **A message says what happened and to what**, with the context needed to
  act: `Fetching invoice inv_123 failed: 503`, not `Error` or
  `Something went wrong`. Keep the cause: `new Error('…', { cause })`.
- **User-facing messages are written for users**: what happened, what to do
  next, no stack trace or internal code. See [ui.md](ui.md).
- **No exceptions for control flow.** A missing record on a lookup, a
  validation failure, an "already exists": return them as values (`null`, a
  union, a result) when the caller is expected to handle them.
- **Throw `Error` objects**, never strings or plain objects. Custom error
  classes get a name that says what failed (`InvoiceNotFoundError`), and
  carry the data needed to handle them.
- **Expected failures in the types** when callers must handle them. Pick one
  of the approaches below for the project, and use it consistently.

## Effect, a Result type, or plain `try/catch`?

**Plain `async`/`await` and exceptions** fit most UI code, simple CRUD,
scripts, and any code where an error just goes to one boundary. Add schemas
at the edges and an error boundary, and stop there.

**A `Result` type** fits when a few functions have expected failures their
callers must handle, and you want the compiler to make sure they do, without
a new paradigm. A union of ten lines, or a small library (neverthrow):

```ts
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

type SignUpError = { kind: 'email-taken' } | { kind: 'weak-password'; reason: string };

export async function signUp(input: SignUpInput): Promise<Result<User, SignUpError>> {
  if (await isEmailTaken(input.email)) return { ok: false, error: { kind: 'email-taken' } };
  …
}
```

**[Effect](https://effect.website)** fits server or domain code with many
ways to fail, external calls, retries, timeouts, cancellation, concurrency
limits, resources to release, or dependencies to inject and replace in tests.
There, it removes a lot of hand-written plumbing, and the signature
`Effect<Success, Error, Requirements>` says exactly what can go wrong and what
the code needs.

It's the wrong choice for a UI layer, a simple app, a script, or a team that
doesn't know it: it takes time to learn, code written with it reads poorly
to someone who doesn't, it spreads to everything that calls it, it overlaps
tools already in place (its `Schema` and zod, its data fetching and TanStack
Query), and it adds weight to a client bundle. Suggest it with these
trade-offs, and let the user decide; never bring it in on your own.

If the project uses Effect:

- **Use it for a whole layer** (services, domain), not half in Effect and half
  in `try/catch` and promises. Leave Effect only at the edges: the HTTP
  handler, the route loader, the job runner (`Effect.runPromise` and the like).
- **Tagged errors with domain names**, never `Error` or `unknown` in the
  error channel:
  ```ts
  class UserNotFound extends Data.TaggedError('UserNotFound')<{ readonly userId: UserId }> {}
  ```
- **Handle them by tag** (`Effect.catchTag('UserNotFound', …)`), and let the
  compiler show which ones are left.
- **Dependencies as services** provided by layers, so a test provides a fake
  one instead of mocking a module.
- **Retries, timeouts and concurrency** through Effect's own tools
  (`Effect.retry` with a `Schedule`, `Effect.timeout`, `concurrency` options),
  not hand-written loops.
- **One schema library:** Effect `Schema` or zod, not both.
- **Prefer `Effect.gen`** with `yield*` for anything longer than a couple of
  steps: it reads like the `async` code everyone knows.
- Effect's API moves between major versions: check the docs of the version
  the project uses rather than writing from memory. The example below is
  written for Effect 4.

```ts
const User = Schema.Struct({ id: Schema.String, name: Schema.String });

class NetworkError extends Data.TaggedError('NetworkError')<{ readonly cause: unknown }> {}
class UserNotFound extends Data.TaggedError('UserNotFound')<{ readonly userId: string }> {}

const request = <T>(run: (signal: AbortSignal) => Promise<T>) =>
  Effect.tryPromise({ try: run, catch: cause => new NetworkError({ cause }) });

export const fetchUser = (userId: string) =>
  Effect.gen(function* () {
    const response = yield* request(signal => fetch(`/api/users/${userId}`, { signal }));
    if (response.status === 404) return yield* new UserNotFound({ userId });
    const body: unknown = yield* request(() => response.json());
    return yield* Schema.decodeUnknownEffect(User)(body);
  }).pipe(
    // Only the network is worth retrying: a missing user stays missing.
    Effect.retry({
      schedule: Schedule.exponential('100 millis'),
      times: 3,
      while: error => error._tag === 'NetworkError',
    }),
    Effect.timeout('5 seconds'),
  );
```
