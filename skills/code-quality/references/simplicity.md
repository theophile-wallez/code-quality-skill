# Simplicity

The marks of generated, unreviewed code are easy to spot: layers that do
nothing, checks for what can't happen, errors caught and dropped, helpers
that already existed, names three words too long. A reviewer reads them as
"nobody thought about this". Write the simplest code that does the job
correctly, then stop.

## Rules

- **No premature abstraction.** Write it twice if you must; factor it out the
  third time, when you know what actually varies. A wrong abstraction costs
  more than a little repetition.
- **No layer "just in case".** No interface with one implementation, no
  factory for one class, no config option nobody sets, no generic parameter
  used with one type (YAGNI).
- **No wrapper that only forwards.** A function whose body is one call to
  another function with the same arguments is noise: call the other one.
- **No defensive checks of impossible cases.** If the types say `user` is a
  `User`, don't test `if (!user) return`. Validate at the boundaries (see
  [typescript.md](typescript.md)) and trust the types inside.
- **No `try/catch` everywhere.** Catch where you can do something about the
  error (retry, fall back, show it, add context). Elsewhere, let it
  propagate. See [errors.md](errors.md).
- **No clever code.** The obvious version beats the short one. A reduce that
  needs a comment becomes a loop that doesn't.
- **Reuse before writing.** Search the codebase for a helper that does it
  (dates, money, retries, DOM queries) before writing one. Two helpers for
  one job is worse than none.
- **Platform first.** No dependency for what the language or the platform
  already does (`structuredClone`, `Intl`, `URL`, `AbortController`,
  `Array.prototype.toSorted`, `fetch`). A new dependency is a decision, made
  with the user.
- **No debug leftovers.** No `console.log`, `debugger`, commented-out code,
  temporary flags or throwaway files. `console.warn` and `console.error` stay
  for real warnings and errors (`no-console` with those allowed).
- **No dead code.** Unused exports, files, dependencies and feature flags go.
  A tool finds them (knip suggested).
- **Verbose isn't explicit.** `userId` is explicit;
  `currentlyAuthenticatedUserIdentifier` is just long.
- **Don't fix what wasn't asked**, except bugs. Unrelated refactors and
  reformatting go in their own change. A real bug you see on the way gets
  fixed in the same change, and said so.

## Before and after

```ts
// Before
export class UserServiceFactory {
  static create(): UserService {
    return new UserServiceImpl();
  }
}

export async function getUserSafely(id: string): Promise<User | undefined> {
  try {
    if (!id) return undefined;
    const user = await userService.getUser(id);
    if (!user) return undefined;
    return user;
  } catch (error) {
    console.log('Error getting user', error);
    return undefined;
  }
}

// After
export async function fetchUser(id: UserId): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error(`Fetching user ${id} failed: ${response.status}`);
  return UserSchema.parse(await response.json());
}
```
