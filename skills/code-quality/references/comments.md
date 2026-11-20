# Comments

Good code needs few comments. The ones it has are short, plain, and say what
the code can't.

## What a comment is for

Say **why**: a constraint you can't see in the code, a pitfall of a library
or a browser, a business rule, a choice that looks wrong but isn't, a link to
the issue or spec it follows.

```ts
// Safari fires `resize` before layout settles: measure on the next frame.
requestAnimationFrame(measure);

// Stripe rounds each line item, not the total: sum the rounded lines.
const totalCents = sumBy(lines, line => Math.round(line.amountCents));
```

## Rules

- **Few.** If a name, a smaller function or a named constant would make the
  comment unnecessary, do that instead.
- **Short.** One or two lines is the norm. A longer explanation goes in the
  docs, the commit message or the pull request.
- **Plain, natural language**, as you'd explain it to a colleague at their
  desk. Simple words, full sentences, no jargon for its own sake.
- **No "AI" voice.** No marketing or flowery tone ("This elegant utility
  seamlessly orchestrates…"), no "robust", "comprehensive", "leverage", no
  emoji, no exclamation marks.
- **Never narrate the code.** `// Loop over the users` above a loop over the
  users, `// Step 1: fetch the data`, `// Return the result`: delete them.
- **No history.** "We used to…", "Changed to fix…", "New approach": that's
  what git is for. A comment describes the code as it is.
- **No decoration.** No banners (`// ===== HELPERS =====`), no ASCII art, no
  section dividers. If a file needs sections, it needs splitting.
- **No commented-out code.** Delete it; git keeps it.
- **No orphan `TODO`.** A `TODO` names an issue or an owner
  (`// TODO(#123): …`), or it doesn't go in.
- **No restating the types.** JSDoc is for the public API, and says what
  TypeScript can't (units, edge cases, what `null` means), not
  `@param id - the id`.
- **A wrong comment is worse than none.** When you change the code, change or
  delete the comments that describe it in the same change.
- **A module may open** with a few lines on what it is for. That's the one
  place a short paragraph belongs.

## Before and after

```ts
// Before
// ===== USER HELPERS =====
/**
 * This function retrieves the user data from the API and returns it.
 * @param id - The id of the user
 * @returns The user
 */
export async function getUser(id: string): Promise<User> {
  // Make the API call
  const response = await fetch(`/api/users/${id}`);
  // Parse the JSON (changed from .text() to fix bug)
  return UserSchema.parse(await response.json());
  // return legacyGetUser(id);
}

// After
export async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return UserSchema.parse(await response.json());
}
```

## Enforcing it

No tool judges a comment's value, so this is on the author and the reviewer.
Some checks help: a spell checker (cspell) over comments; a lint rule or a
custom source rule that rejects `TODO` without an issue number
(`no-warning-comments` with a pattern, or `unicorn/expiring-todo-comments`);
and a review pass that reads the comments of the diff on their own.
