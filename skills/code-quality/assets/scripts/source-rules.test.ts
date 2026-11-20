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

  it('reads only the files a rule applies to', () => {
    expect(isChecked('src/app.ts')).toBe(true);
    expect(isChecked('src/app.css')).toBe(true);
    expect(isChecked('README.md')).toBe(false);
  });
});
