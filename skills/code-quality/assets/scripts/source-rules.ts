// Rules the linters can't express, checked over every source file. Each rule is
// a pattern of file names and a check that returns what's wrong, or null.
// Add the project's own: a banned import or API, a naming rule, a header. Drop
// the color rules in a project with no tokens yet, until it has them.

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

// The stylesheets that define the color tokens: the only place a color is written as a value.
const TOKEN_FILES = /(?:^|\/)(?:tokens|theme|colors)[\w.-]*\.(?:css|scss)$/;

// A declaration whose value is a color literal: hex, or a color function. A
// declaration ends with `;` or `}`, so an id in a selector doesn't count.
const CSS_COLOR =
  /[\w-]+\s*:[^;{}]*?(?:#[\da-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\()[^;{}]*[;}]/i;

// A Tailwind color from the default palette, or an arbitrary one, rather than a token's class.
const TAILWIND_COLOR =
  /\b(?:bg|text|border(?:-[trblxyse])?|ring|outline|fill|stroke|from|via|to|shadow|accent|caret|divide|decoration|placeholder)-(?:(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b|(?:white|black)\b|\[(?:#|rgb|hsl|oklch))/;

// A hex color as a string in code: an inline style, a chart's series, a canvas fill.
const CODE_COLOR = /['"`]#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})['"`]/i;

function rawStyleColor(text: string, file: string): string | null {
  if (TOKEN_FILES.test(file) || !CSS_COLOR.test(text)) return null;
  return 'writes a color as a value: use a token (var(--…)), defined in the tokens file';
}

function rawCodeColor(text: string): string | null {
  if (TAILWIND_COLOR.test(text))
    return "uses a palette or arbitrary color class: use a token's class";
  if (CODE_COLOR.test(text)) return 'writes a color as a string: read it from a token';
  return null;
}

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
  { files: CODE, check: rawCodeColor },
  { files: STYLES, check: rawStyleColor },
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
