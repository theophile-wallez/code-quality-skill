# Testing

A test is worth what it would catch. Write the ones that fail when the
behavior breaks, and only then.

## Rules

- **Every change ships with tests** of the behavior it adds or changes. A bug
  fix starts with a test that reproduces the bug.
- **See each new test fail once** before trusting it: break the code, or run
  the test before the fix. A test that can't fail isn't a test.
- **Test behavior through the public API**, not the internals. A refactor that
  keeps the behavior keeps the tests green.
- **Assert on real outputs**, not on a mock's own answers. A test that mocks
  the function under test, or only checks that a mock was called with what the
  test passed it, proves nothing.
- **Mock at the edges only**: the network, the clock, randomness, the file
  system. Prefer fakes you control (a fake server with MSW, a fake clock, an
  in-memory store) to mocking modules.
- **Tests sit next to the code** (`invoice-total.test.ts` beside
  `invoice-total.ts`). Shared test helpers have their own folder.
- **DOM code is tested on real markup**: build the HTML the app really
  renders (or the third-party markup you work on), run the code, check what
  it changed. Test components the way users use them: by role and label
  (Testing Library), not by class names or internal state.
- **No fixed sleeps.** Wait for the condition (`await expect(…).toBeVisible()`,
  `vi.waitFor`, fake timers), never `setTimeout(…, 500)`.
- **Deterministic.** No dependency on the time of day, the time zone, the
  locale, the order of tests or the network. Floating-point results are
  compared with a tolerance: math functions can differ in the last bit
  between platforms.
- **Recorded fixtures are a reference.** Outputs recorded from a version known
  to be right define the behavior; never regenerate them from the new code to
  make a test pass. Changing one is a deliberate behavior change, said in the
  commit.
- **Turn repeated review comments into tests.** When the same rule keeps being
  broken (no icon rotates on hover, no animation off the compositor, no color
  outside the tokens), write a test that scans for it, so nobody has to say it
  again.
- **Clean state between tests:** restore mocks and stubbed globals
  automatically (`restoreMocks`, `unstubGlobals` in Vitest), reset the DOM.

## Levels

- **Unit tests** for logic and components: most of the suite, fast enough to
  run on every change.
- **Integration tests** for a feature's wiring: a route with its loader, an
  endpoint with its database (a real one in a container beats a mock).
- **End-to-end tests** for the critical paths only (sign-up, sign-in,
  checkout, the main page of each area), for what the lower levels can't see:
  the real browser, the real layout, the pieces together. Don't add one per
  feature; its unit tests cover it.

Suggested: Vitest (with happy-dom or jsdom for the DOM), Testing Library,
MSW, Playwright for end-to-end. Template:
[`assets/vitest.config.ts`](../assets/vitest.config.ts).

## In CI

- Run the whole suite, with coverage reported (not a target to chase: a map of
  what isn't tested).
- End-to-end: `forbidOnly` so a stray `.only` fails the run, retries in CI
  only, a trace and a screenshot kept on failure.
- A fast local check runs only the tests of what changed
  (`vitest --changed origin/main`). Beware: a change to a file that no test
  imports (a stylesheet, a JSON file) selects no test. If tests read such
  files, add them to the fast check by hand.
