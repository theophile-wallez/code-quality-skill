// Checks every file git knows (tracked or new, not ignored) against the rules
// of source-rules.ts. Run with Node 24 or later: `node scripts/check-sources.ts`.

import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { findProblems, isChecked } from './source-rules.ts';

const listed = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
  encoding: 'utf8',
});
const files = listed.split('\n').filter(file => file !== '' && isChecked(file));

const perFile = await Promise.all(
  files.map(async file => {
    const text = await readFile(file, 'utf8');
    return findProblems(file, text).map(problem => `${file} ${problem}`);
  }),
);
const problems = perFile.flat();

if (problems.length > 0) {
  for (const problem of problems) console.error(problem);
  process.exit(1);
}
console.log(`Sources check out: ${files.length} files.`);
