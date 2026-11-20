// Rules the linters can't express, checked over every source file. Each rule is
// a pattern of file names and a check that returns what's wrong, or null.
// Add the project's own: a banned import or API, a naming rule, a header.

export interface Rule {
  readonly files: RegExp;
  readonly check: (text: string, file: string) => string | null;
}

const CODE = /\.(?:[cm]?[jt]sx?)$/;
const STYLES = /\.(?:css|scss)$/;

const MAX_STYLESHEET_LINES = 400;

// A comment that switches the type checker or a linter off. Written in pieces,
// so this file doesn't match itself.
const SUPPRESSION =
  /@ts-(?:ignore|expect-error|nocheck)|(?:eslint|oxlint|biome)-(?:disable|ignore)/;

// A to-do with no issue or owner in parentheses: `TODO(#123)` or `TODO(ada)` pass.
// The brackets keep this file from matching itself.
const ORPHAN_TODO = /\b(?:TO[D]O|FIX[M]E)\b(?!\()/;

// A URL that CSS loads (`url()`, `@import`, `image-set()`), absolute or
// protocol-relative. An inline SVG's namespace is a name, not a download.
const REMOTE_URL =
  /(?:url\(\s*['"]?|@import\s+['"]|image-set\([^;}]*?['"])(?:https?:)?\/\/(?!www\.w3\.org\/)/i;

function longStylesheet(text: string): string | null {
  const lines = text.split('\n').length - 1;
  return lines > MAX_STYLESHEET_LINES
    ? `has ${lines} lines (at most ${MAX_STYLESHEET_LINES}): split it into partials`
    : null;
}

export const RULES: readonly Rule[] = [
  {
    files: CODE,
    check: text => (SUPPRESSION.test(text) ? 'switches a check off with a comment' : null),
  },
  {
    files: CODE,
    check: text =>
      ORPHAN_TODO.test(text) ? 'has a to-do without an issue or owner: TODO(#123)' : null,
  },
  { files: STYLES, check: longStylesheet },
  {
    files: STYLES,
    check: text => (REMOTE_URL.test(text) ? 'loads an asset from another site: bundle it' : null),
  },
];

/** Whether any rule applies to the file, so the others needn't be read. */
export const isChecked = (file: string): boolean => RULES.some(rule => rule.files.test(file));

/** What the file breaks, one message per rule. */
export function findProblems(file: string, text: string): string[] {
  return RULES.filter(rule => rule.files.test(file)).flatMap(rule => {
    const problem = rule.check(text, file);
    return problem === null ? [] : [problem];
  });
}
