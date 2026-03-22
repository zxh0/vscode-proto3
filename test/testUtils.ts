import { NumericEdit } from '../src/proto3RenumberLogic';

/**
 * Applies offset-based edits from right to left so earlier ranges stay valid.
 *
 * Example:
 *   applyEdits('a = 5; b = 8;', [
 *     { start: 4, end: 5, replacement: '1' },
 *     { start: 11, end: 12, replacement: '2' },
 *   ]);
 *   // => 'a = 1; b = 2;'
 */
export function applyEdits(text: string, edits: ReadonlyArray<NumericEdit>): string {
  return [...edits]
    .sort((a, b) => b.start - a.start)
    .reduce(
      (updated, edit) => updated.slice(0, edit.start) + edit.replacement + updated.slice(edit.end),
      text
    );
}
