# Accessibility

Accessible is part of professional: the same work makes an interface usable
with a keyboard, a screen reader, a zoomed screen, a bright sun or a tired
eye. Aim for WCAG 2.2 AA.

## Rules

- **Semantic HTML first.** A link that navigates is an `<a href>`, an action
  is a `<button>`, a list is a `<ul>`, the page has `<header>`, `<nav>`,
  `<main>`, one `<h1>` and headings in order. ARIA only when no element does
  the job, and never to restate what the element already says.
- **Everything works with the keyboard**: every control reachable with Tab in
  a logical order, activated with Enter or Space, menus and lists with the
  arrows, dialogs closed with Escape, focus kept inside an open dialog and
  given back to what opened it.
- **Focus is always visible** (`:focus-visible` with a ring that matches the
  design). Never `outline: none` without a replacement.
- **Every control has an accessible name**: a visible `<label>` tied to its
  input, an `aria-label` on an icon-only button, an `alt` on each meaningful
  image (`alt=""` on a decorative one).
- **Contrast AA**: 4.5:1 for body text, 3:1 for large text, icons and
  control borders, in both color schemes.
- **Never color alone**: an error has a message and an icon, not only a red
  border; a chart's series have labels or patterns.
- **Errors are announced**: a field's error is tied to it
  (`aria-describedby`, `aria-invalid`), a toast or a status change that
  matters goes through a live region (the toast library usually does it).
- **Zoom and text size**: the layout holds at 200% zoom and with larger text;
  no fixed heights that cut text, no `user-scalable=no`.
- **Motion** follows `prefers-reduced-motion` (see [ui.md](ui.md)), and
  nothing flashes more than three times a second.
- **Targets** are large enough to hit (24×24px at least, 44×44px on touch).

## Checking

- A lint plugin for markup (`jsx-a11y`, in oxlint and ESLint; Biome's `a11y`
  rules).
- Components tested by role and label (Testing Library's `getByRole`): if a
  test can't find a control by its role and name, neither can a screen
  reader.
- An automated audit in the end-to-end tests (axe, with
  `@axe-core/playwright`) on the main pages.
- By hand, for each new screen: go through it with the keyboard only, then
  zoom to 200%, then check both schemes. Automated tools find about a third
  of the problems.
