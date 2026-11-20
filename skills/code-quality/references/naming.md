# Naming

A good name makes the comment unnecessary. A bad one makes the reader open
the function to find out what it does.

## Rules

- **Say what it is.** `square`, `whiteShare`, `moveTimes`, `retryCount`;
  never `sq`, `ws`, `mt`, `n`. Explicit without being a sentence: not
  `numberOfTimesWeHaveRetriedTheRequest`.
- **No abbreviations**, except the ones everyone reads without thinking:
  `id`, `url`, `html`, `api`, `db`, `i18n`.
- **One letter only** for loop indexes (`i`, `j`, `k`), coordinates (`x`,
  `y`, `z`) and type parameters (`T`, `K`). A lint rule (`id-length` with
  those exceptions) keeps it so.
- **No catch-all names:** `data`, `info`, `item`, `obj`, `temp`, `result`,
  `value`, `thing`, `stuff`, `handler`, `manager`, `helper`, `utils`, `misc`,
  `common`. Each one is a name you haven't found yet. `utils.ts` becomes
  `dates.ts`, `currency.ts`, `retry.ts`.
- **Booleans read as a question:** `isOpen`, `hasAccess`, `canEdit`,
  `shouldRetry`, `wasSent`. Positive: `isVisible`, not `isNotHidden`, so that
  `!isVisible` reads without a double negative.
- **Functions start with a verb:** `fetchUser`, `formatPrice`, `parseMove`,
  `isValidEmail`. A function that returns a boolean reads like one
  (`hasExpired(token)`).
- **Event handlers follow one convention:** `onSubmit` for the prop,
  `handleSubmit` for the function that implements it.
- **Units in the name** when there is one: `timeoutMs`, `widthPx`,
  `priceCents`, `durationSeconds`, `ratio` (0 to 1) or `percent` (0 to 100).
- **Plural for collections, without the type:** `users`, not `userList`,
  `userArray` or `arrUsers`. A map says what it maps: `usersById`,
  `priceBySku`.
- **No type in the name:** no `strName`, `IUser`, `TUser`, `UserInterface`,
  `UserType`. TypeScript already knows.
- **One word per concept, across the codebase.** Pick `fetch`, `get` or
  `load` and stick to it; the same for `remove` and `delete`, `create` and
  `add`, `user`, `account` and `member`. Two words make the reader wonder
  whether there are two things.
- **The domain's words**, the ones users and the business use, rather than
  invented technical ones. If users say "invoice", the code doesn't say
  `billingDocument`.
- **Constants** that are real constants (a limit, a config value known at
  load time) in `SCREAMING_SNAKE_CASE`: `MAX_UPLOAD_MB`. Everything else in
  `camelCase`, types and components in `PascalCase`.
- **Files** named after what they export, in one case for the whole project
  (kebab-case suggested: `invoice-total.ts`), enforced by a lint rule
  (`unicorn/filename-case`).

## Examples

```ts
// Before
const d = await get(u);
const res = d.filter(x => !x.flag);
let tmp = 0;
for (const r of res) tmp += r.amt;

// After
const invoices = await fetchInvoices(userId);
const unpaidInvoices = invoices.filter(invoice => !invoice.isPaid);
const totalDueCents = sumBy(unpaidInvoices, invoice => invoice.amountCents);
```

```ts
// Before
function process(data: Data, flag: boolean) { … }

// After: the name says what, the options say how
function archiveOrder(order: Order, options: { notifyCustomer: boolean }) { … }
```

## Enforcing it

- `id-length` (minimum 2, with the exceptions above).
- `@typescript-eslint/naming-convention` (ESLint) can require boolean
  variables to start with `is`, `has`, `can`, `should`, `was`, `will`.
- `unicorn/filename-case` for file names.
- A spell checker (cspell, with a project word list) catches typos in names
  and comments.
