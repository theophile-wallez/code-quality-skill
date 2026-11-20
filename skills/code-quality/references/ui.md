# UI: components, styles and polish

What makes an app look professional is mostly consistency: the same few
components, the same spacing, the same colors, the same motion, everywhere.
These rules use shadcn and Tailwind as examples; the principles hold with any
component library and any styling approach.

## Components

- **Start from accessible primitives**: shadcn (on Radix or Base UI), React
  Aria, Ark UI, Headless UI. Never hand-roll a dialog, popover, menu, select,
  combobox, tooltip or tabs: focus traps, keyboard support, positioning and
  screen-reader semantics are hard, and the libraries got them right.
- **Add a missing primitive with the CLI** (`npx shadcn@latest add dialog`),
  never by writing it by hand or copying it from another project. Generated
  files live in `components/ui/`; adjust them there, in one place, when the
  design calls for it.
- **`components/ui/` holds primitives only.** Feature components compose them
  in their own folders, and don't restyle a primitive at each use: if a
  variant comes back, it becomes a variant of the primitive.
- **Variants through a typed API**, such as `cva`:
  `<Button variant="destructive" size="sm">`, not class strings rebuilt at
  every call site.
- **Use the primitives you have.** A `<Button>`, an `<Input>`, a `<Dialog>`,
  never a `<div onClick>` or a raw `<button>` styled again by hand.
- **One icon library**, imported icon by icon (lucide with shadcn, or
  Hugeicons, Phosphor…), with one size and stroke per context. Icons, not
  emoji, in the interface.
- **Components accept `className`** and merge it last, so a caller can adjust
  layout (margin, width) without fighting specificity.

## Styles and tokens

- **Design tokens as CSS variables**, named by role, not by look:
  `--background`, `--foreground`, `--primary`, `--muted-foreground`,
  `--border`, `--destructive`, `--radius`. With Tailwind v4, declare them in
  `@theme` (or map them there), and use the classes they generate
  (`bg-primary`, `text-muted-foreground`).
- **No hardcoded colors** in components: no `#3b82f6`, no `bg-blue-500` for a
  brand color, no `rgba(…)` for a shadow. A new need is a new token.
- **One spacing scale and one type scale.** No arbitrary values
  (`p-[13px]`, `text-[15px]`) unless something outside the design (a
  third-party widget, a fixed asset) requires it; then a comment says what.
- **Merge classes with a helper** (`cn()`: `clsx` + `tailwind-merge`), so a
  conflicting class passed in wins instead of both applying.
- **Sorted classes**, by the formatter's Tailwind plugin or a lint rule.
- **No loose global CSS.** Base styles in `@layer base`, the rest as
  utilities or in the component. No `!important` except to beat third-party
  CSS you can't change.
- **Long class lists** get split by concern or moved into a variant, not
  left as a 200-character line nobody can review.

## Themes

- **Dark and light from the same tokens.** Each token has a value per
  scheme; components never test the theme. Follow the system by default, let
  the user choose, and remember the choice without a flash of the wrong theme
  on load.
- **Check both schemes** for every change, contrast included
  (see [accessibility.md](accessibility.md)).
- Colored text and icons on colored backgrounds keep enough contrast. A
  status (success, warning, error) is a hue on a tint of itself, more
  readable than white on a saturated fill.

## Responsive

- **Mobile first.** Base styles for the small screen, breakpoints add room.
  Every screen is checked on a phone (about 390px), a tablet (about 768 and
  1024px) and the desktop, on both sides of each breakpoint the page uses.
- **Nothing overflows sideways**, at any width. Long words, names and URLs
  wrap or truncate with an ellipsis and a full title.
- **Touch targets** of at least 44×44px on touch screens. Hover effects that
  would stick after a tap go under `@media (hover: hover)`.
- Use `dvh` rather than `vh` for full-height layouts: on phones `100vh` is
  taller than the visible area.

## Motion

- **Every animation has a purpose**: an entrance, an exit, feedback on an
  action, a change of place that the eye should follow. Nothing moves for
  decoration, and nothing loops for ever without a reason.
- **Short**: 150 to 300 ms for most interface motion, with an ease-out curve
  for what enters. One set of durations and curves, as tokens.
- **Only `transform` and `opacity`**, which the compositor runs without
  layout. Never animate `width`, `height`, `top` or `margin` in a loop.
- **Respect the user's preference** (`prefers-reduced-motion`): reduce
  movement, keep the feedback (a fade instead of a slide), unless the product
  decided otherwise on purpose.

## Copy

- **Clear and consistent.** One word per concept across the interface (the
  same as in the code, see [naming.md](naming.md)), sentence case for labels
  and titles.
- **Buttons say what they do**: "Save changes", "Delete project", not "OK",
  "Submit" or "Yes".
- **Errors say what happened and what to do**, in the user's words: "We
  couldn't save your changes. Check your connection and try again.", never
  "Error 500" or "Invalid input".
- **Empty states invite the next step** ("No projects yet. Create your first
  one."), with the button to do it.
- **No jargon, no internal names, no blame.**
- Dates, numbers, currencies and plurals go through `Intl`
  (`Intl.DateTimeFormat`, `NumberFormat`, `RelativeTimeFormat`,
  `PluralRules`). If the app is or will be translated, no string is
  hardcoded in a component: it goes through the i18n library from the start.

## Details that show

- A title, a favicon and metadata (description, Open Graph image) for every
  public route; a `lang` on `<html>`.
- Skeletons the shape of the content, not spinners in the middle of nothing.
- Space reserved for images and async content: nothing jumps when it loads.
- Focus rings that match the design, never removed.
- Numbers that line up in tables (`tabular-nums`), text that never touches a
  container's edge, consistent radii and shadows from the tokens.
