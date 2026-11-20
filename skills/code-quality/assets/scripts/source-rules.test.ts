import { describe, expect, it } from 'vitest';
import { findProblems, isChecked } from './source-rules.ts';

// Pieced together, so this file doesn't break the rules it tests.
const TS_IGNORE = ['// @ts', '-ignore'].join('');
const LINT_DISABLE = ['// eslint', '-disable-next-line'].join('');
const TO_DO = ['TO', 'DO'].join('');

describe('source rules', () => {
  it('rejects a comment that switches a check off', () => {
    expect(findProblems('a.ts', `${TS_IGNORE}\nconst x = 1;`)).toEqual([
      'switches a check off with a comment',
    ]);
    expect(findProblems('a.tsx', LINT_DISABLE)).toHaveLength(1);
  });

  it('rejects a to-do without an issue or owner', () => {
    expect(findProblems('a.ts', `// ${TO_DO}: later`)).toHaveLength(1);
    expect(findProblems('a.ts', `// ${TO_DO}(#12): after the migration`)).toEqual([]);
  });

  it('rejects a long stylesheet', () => {
    expect(findProblems('a.css', 'a {}\n'.repeat(401))).toHaveLength(1);
    expect(findProblems('a.css', 'a {}\n'.repeat(400))).toEqual([]);
  });

  it('rejects a remote asset in CSS, but not an SVG namespace', () => {
    expect(
      findProblems('a.css', "a { background: url('https://cdn.example.com/x.png'); }"),
    ).toHaveLength(1);
    expect(findProblems('a.css', '@import "//fonts.example.com/font.css";')).toHaveLength(1);
    expect(
      findProblems(
        'a.css',
        `a { mask: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>"); }`,
      ),
    ).toEqual([]);
  });

  it('rejects a color literal in a stylesheet, but not in the tokens file', () => {
    const rule = '.card { color: #3b82f6; }';
    expect(findProblems('src/card.css', rule)).toHaveLength(1);
    expect(findProblems('src/card.css', '.card { border-color: rgb(0 0 0 / 10%); }')).toHaveLength(
      1,
    );
    expect(findProblems('src/card.css', '.card { background: oklch(0.7 0.1 250) }')).toHaveLength(
      1,
    );
    expect(findProblems('src/styles/tokens.css', `:root { --primary: #3b82f6; }`)).toEqual([]);
  });

  it('accepts tokens, keywords and ids in selectors', () => {
    const tokens = '.card { color: var(--foreground); border-color: currentColor; fill: none; }';
    expect(findProblems('src/card.css', tokens)).toEqual([]);
    expect(findProblems('src/card.css', '#add { color: var(--primary); }')).toEqual([]);
    const mixed = '.card { background: color-mix(in oklch, var(--primary) 20%, transparent); }';
    expect(findProblems('src/card.css', mixed)).toEqual([]);
  });

  it("rejects Tailwind's palette and arbitrary colors in code", () => {
    // Pieced together, so this file doesn't break the rule it tests.
    const palette = ['bg', 'blue', '500'].join('-');
    const white = ['text', 'white'].join('-');
    const arbitrary = ['bg', '[#3b82f6]'].join('-');
    for (const color of [palette, `hover:${palette}/50`, white, arbitrary]) {
      expect(findProblems('a.tsx', `<div className="p-4 ${color}" />`)).toHaveLength(1);
    }
    expect(findProblems('a.tsx', '<div className="bg-primary text-muted-foreground" />')).toEqual(
      [],
    );
  });

  it('rejects a hex color written as a string in code', () => {
    const hex = ['#', '3b82f6'].join('');
    expect(findProblems('chart.ts', `const series = { color: '${hex}' };`)).toHaveLength(1);
    expect(findProblems('a.ts', "const anchor = '#section';")).toEqual([]);
  });

  it('reads only the files a rule applies to', () => {
    expect(isChecked('src/app.ts')).toBe(true);
    expect(isChecked('src/app.css')).toBe(true);
    expect(isChecked('README.md')).toBe(false);
  });
});
