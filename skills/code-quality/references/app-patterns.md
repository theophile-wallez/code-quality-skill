# App patterns: data, states, forms, performance

Examples use React with TanStack Query and Router; the principles hold with
other frameworks.

## Server state

- **Server data goes through a cache library** (TanStack Query, SWR, the
  framework's loaders), never `useEffect` + `fetch` + `useState`. The library
  handles caching, deduplication, retries, refetching and race conditions
  that hand-written effects get wrong.
- **Query keys and fetchers in one place per resource** (a query options
  factory: `invoiceQueries.detail(id)`), not string arrays retyped in each
  component.
- **Mutations invalidate what they change**, explicitly, or update the cache
  with the server's answer.
- **Optimistic updates** where an action is quick and easy to undo (a like, a
  toggle, a reorder), rolled back on failure.
- **Load in the route, not in a cascade.** The route's loader starts the
  requests the page needs, in parallel, before rendering; a child component
  doesn't wait for its parent's data to start its own.
- **Responses are validated** at the boundary (see
  [typescript.md](typescript.md)). Types shared between client and server come
  from the same schema, or from the server's typed functions (tRPC, server
  functions, OpenAPI-generated clients).

## Client state

- **Each piece of state lives once.** Nothing derived is stored: compute it
  during render (`const total = sumBy(items, …)`), memoize only if it's
  measured as slow.
- **URL state in the URL**: filters, tabs, sort, pagination and search are
  search params, typed and validated by the router, so a page can be shared,
  reloaded and navigated back to.
- **Local state stays local.** A global store (Zustand, a context) only for
  truly app-wide state (the session, the theme, a cart), never to avoid
  passing a prop two levels down.
- **Forms hold their own state** in the form library, not in a global store.

## UI states

Every view that loads data handles four states, designed, not left to chance:

- **Loading**: a skeleton the shape of the content; nothing jumps when the
  content arrives.
- **Empty**: a short message and the action that fills it.
- **Error**: what happened, in the user's words, and a button to retry.
- **Success**: the content.

Also:

- **Error boundaries per route or area**, so a failing widget doesn't take the
  whole app down; each one reports the error and offers a way out.
- **Every action gives feedback**: the button shows it's working and can't be
  pressed twice, then a toast or an inline change says it's done or failed.
- **Destructive actions** ask for confirmation, or better, can be undone for a
  few seconds.
- **Pending navigation shows**: a progress bar or the old page dimmed, not a
  frozen screen.

## Forms

- **A form library** (TanStack Form, React Hook Form, the framework's form
  actions) with **one schema** validating on the client and again on the
  server.
- **Errors under their field**, tied to it (`aria-describedby`), shown when
  the field is left or the form is sent, not at every keystroke. On submit,
  focus moves to the first field in error. Server errors map back to their
  fields.
- **The submit button** shows the request in progress and blocks a second
  submission.
- **The right input** for each field: `type` (`email`, `tel`, `url`,
  `number` only for real quantities), `autocomplete` (`email`,
  `current-password`, `one-time-code`…) and `inputmode`, so phone keyboards
  and password managers work.
- **Labels always visible**; a placeholder is an example, never the label.
- **Nothing lost**: a failed submission keeps what was typed; leaving a form
  with unsaved changes asks first.

## React

- **Small function components**, one per file when exported, named like
  their file.
- **Never define a component inside another one**: it's recreated on each
  render and loses its state.
- **Stable `key`s** in lists, from the data's id; never the index of a list
  that can change order.
- **Effects for synchronizing with the outside** (a subscription, a DOM API,
  a timer), not for deriving state or reacting to an event: that goes in the
  event handler.
- **Memoize after measuring**, or let the React Compiler do it; don't wrap
  everything in `useMemo` and `useCallback` by reflex.
- **Long lists are virtualized** (TanStack Virtual) past a few hundred rows.
- **Renders stay narrow**: state that changes often (a media's time, a
  pointer's position) lives in the leaf that shows it, not at the top of the
  tree.

## Web performance

- **Split by route** (lazy routes, dynamic imports for heavy, rarely used
  parts), and watch the bundle size: a budget in CI, a check of what each new
  dependency weighs.
- **Images**: modern formats (WebP, AVIF), `srcset` and `sizes`,
  `loading="lazy"` below the fold, `width` and `height` always set, the main
  image preloaded.
- **Fonts**: self-hosted, subset, `font-display: swap`, at most a few weights.
- **Core Web Vitals** measured in production (LCP under 2.5 s, INP under
  200 ms, CLS under 0.1), and the app tried on a mid-range phone, not only on
  a fast laptop.
- **Cheap when idle**: no polling or animation loop that runs while nothing
  changes, no layout reads in hot paths, write to the DOM only what changed.
