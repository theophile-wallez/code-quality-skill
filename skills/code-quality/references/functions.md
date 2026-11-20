# Functions

A function should be read top to bottom once, without scrolling and without
keeping a stack of conditions in mind.

## Rules

- **Early returns.** Deal with the edge cases first and return; the main path
  stays at the left margin. No `else` after a `return` (`no-else-return`).
- **One level of abstraction.** A function either orchestrates (calls named
  steps) or does the detail, not both. When the detail of one step crowds
  the others, it becomes its own function.
- **No boolean parameter that switches behavior.** `render(true)` says
  nothing at the call site. Write two functions, or take an options object
  with a named field.
- **At most 4 parameters.** Beyond that, an options object, which names
  each argument where it's passed.
- **No magic numbers.** `if (retries > 3)` becomes
  `if (retries > MAX_RETRIES)`. `0`, `1`, `-1`, `100` for a percentage, and
  obvious indexes are fine.
- **Name complex conditions.**
  `const canCheckout = cart.items.length > 0 && user.isVerified && !store.isClosed;`
- **No nested ternaries.** One ternary for a simple choice; beyond, an `if`,
  a `switch` or a lookup object.
- **Pure where possible.** Same input, same output, no hidden effect. Pass
  the clock, the random source or the fetcher in when a function needs them,
  so tests can too.
- **No hidden side effects.** A getter, a `format…` or an `is…` doesn't
  write anything. A function that changes state says so in its name
  (`save…`, `update…`, `reset…`).
- **Don't mutate arguments** (`no-param-reassign`). Return a new value.
  `const` by default, `let` when it really changes, never `var`.
- **`async`/`await`** rather than `.then()` chains. Every promise is
  awaited, returned or explicitly handed off (`no-floating-promises`).
  Independent awaits run together (`Promise.all`), not one after the other.
- **`for…of` or array methods** that say what they do (`map`, `filter`,
  `some`, `find`), rather than `forEach` with side effects or index loops
  that aren't needed.

## Before and after

```ts
// Before
function getDiscount(user, cart, flag) {
  if (user) {
    if (cart.items.length > 0) {
      if (flag) {
        return cart.total > 10000 ? (user.isVip ? 0.2 : 0.1) : 0.05;
      } else {
        return 0;
      }
    }
  }
  return 0;
}

// After
const VIP_DISCOUNT = 0.2;
const LARGE_ORDER_DISCOUNT = 0.1;
const STANDARD_DISCOUNT = 0.05;
const LARGE_ORDER_CENTS = 10_000;

function discountRate(user: User, cart: Cart): number {
  if (!cart.isPromotionActive || cart.items.length === 0) return 0;
  if (cart.totalCents <= LARGE_ORDER_CENTS) return STANDARD_DISCOUNT;
  return user.isVip ? VIP_DISCOUNT : LARGE_ORDER_DISCOUNT;
}
```

## Enforcing it

`complexity`, `max-depth`, `max-params`, `max-lines-per-function`,
`no-nested-ternary`, `no-else-return`, `no-param-reassign`, `prefer-const`,
`no-var`, `no-magic-numbers` (with `ignore: [0, 1, -1]` and
`ignoreArrayIndexes`), `no-floating-promises`, `no-misused-promises`,
`unicorn/no-array-for-each`. See [tooling.md](tooling.md).
