# TypeScript

The compiler is the first reviewer. Give it every chance to say no.

## Compiler options

Start from [`assets/tsconfig.base.json`](../assets/tsconfig.base.json). On top
of `strict`, these catch real bugs for little noise:

| Option                               | What it catches                                         |
| ------------------------------------ | ------------------------------------------------------- |
| `noUncheckedIndexedAccess`           | `items[0]` may be `undefined`                           |
| `exactOptionalPropertyTypes`         | `{ name?: string }` set to `undefined` on purpose       |
| `noImplicitOverride`                 | a method that silently stops overriding after a rename  |
| `noImplicitReturns`                  | a branch that forgets to return                         |
| `noFallthroughCasesInSwitch`         | a `case` that runs into the next                        |
| `noUnusedLocals`, `noUnusedParameters` | leftovers                                             |
| `allowUnreachableCode: false`        | code after a `return`                                   |
| `verbatimModuleSyntax`               | type imports that must be `import type`                 |
| `erasableSyntaxOnly`                 | `enum`, `namespace` and parameter properties: syntax that isn't just types, so Node and bundlers can strip the types |
| `isolatedModules`                    | what a single-file transpiler can't compile             |

When parts of the code run in different environments (browser, worker,
server, scripts), give each its own `tsconfig.json` with only the `lib` and
`types` it really has, and type-check them all in one command. Then the
browser code can't call `fs`, and the worker can't touch `document`.

## Never lie to the compiler

- No `any`. Use `unknown` and narrow it.
- No type assertion: `value as User`, `<User>value` and `value!` turn a
  question into a claim nobody checks. Narrow instead (`instanceof`, `in`, a
  type guard, a schema). `as const` is fine: it narrows, it claims nothing.
- No `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`, and no comment that
  switches a lint rule off. If a check is wrong for a whole area, change the
  config, visibly and with a reason; never in a comment on one line.

```ts
// Before
const button = document.querySelector('.save') as HTMLButtonElement;
button.disabled = true;

// After: a helper that narrows, used everywhere
const button = queryOne('.save', HTMLButtonElement);
if (button) button.disabled = true;
```

## Validate at the boundary

Data from outside the program is `unknown` until a schema says otherwise:
HTTP responses, `JSON.parse`, `localStorage`, environment variables,
`postMessage`, URL parameters, form data, a third-party global.

- Validate once, where the data enters. Past that point, trust the types and
  don't check again.
- The type comes from the schema (`z.infer<typeof UserSchema>`), never
  written beside it by hand, so the two can't drift apart.
- Wrap the common reads in small helpers that return `null` (or a result)
  instead of throwing: `parseJson(text, schema)`, `readStored(key, schema)`.
- For a live object that must keep its identity (a framework's instance, a
  DOM node), use a type guard backed by a schema rather than a parse, which
  returns a copy. Such a schema must not rewrite the value: no default, no
  coercion, no transform.

Suggested: [zod](https://zod.dev) (`zod/mini` where bundle size matters),
Valibot, ArkType, or Effect `Schema` if the project uses Effect. One schema
library per project.

```ts
const UserSchema = z.object({ id: z.string(), name: z.string(), isAdmin: z.boolean() });
type User = z.infer<typeof UserSchema>;

export async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return UserSchema.parse(await response.json());
}
```

## Types that say what is possible

- **Discriminated unions over flags.** A request isn't
  `{ isLoading: boolean; error?: Error; data?: User }`, where eight
  combinations exist and three make sense. It is
  `{ status: 'loading' } | { status: 'error'; error: Error } | { status: 'success'; data: User }`.
- **Exhaustive switches.** A `switch` over a union handles every member, and
  the linter (`switch-exhaustiveness-check`) or a `never` check catches the
  member added later.
- **Literal unions or `as const` objects, not `enum`.** They are plain
  JavaScript, and they narrow.
- **Branded types** for values that must not be mixed up:
  `type UserId = string & { readonly __brand: 'UserId' }`, created only by
  the code that validates them.
- **Derive, don't copy.** `typeof`, `ReturnType`, `Parameters`, `keyof`,
  `z.infer`, indexed access: a type written twice drifts.
- **`readonly` by default** for parameters and data you don't mean to
  change (`readonly string[]`, `Readonly<Record<…>>`).
- **Explicit return types on exported functions.** They are the module's
  contract: an accidental change shows where it happens, not three files away.
- **`import type`** for imports used only as types.
- **`??` rather than `||`** for defaults, so that `0` and `''` stay values.
- **`===`** everywhere. `== null` is the one shortcut worth keeping, as it
  covers `null` and `undefined` together.
