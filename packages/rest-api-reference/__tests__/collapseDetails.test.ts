import { collapseDetails } from '../src/collapseDetails';

describe('collapseDetails', () => {
  const detailsBlock = [
    '<details>',
    '<summary>Example A</summary>',
    '',
    'Some content for A',
    '</details>',
  ].join('\n');

  const detailsBlockOpen = [
    '<details open>',
    '<summary>Example B</summary>',
    '',
    'Some content for B',
    '</details>',
  ].join('\n');

  describe('without filter', () => {
    it('collapses a details block to summary only', () => {
      expect(collapseDetails(detailsBlock)).toBe(
        '<details><summary>Example A</summary></details>',
      );
    });

    it('collapses an open details block', () => {
      expect(collapseDetails(detailsBlockOpen)).toBe(
        '<details><summary>Example B</summary></details>',
      );
    });

    it('collapses multiple details blocks', () => {
      const text = `${detailsBlock}\n\n${detailsBlockOpen}`;
      expect(collapseDetails(text)).toBe(
        '<details><summary>Example A</summary></details>\n\n<details><summary>Example B</summary></details>',
      );
    });

    it('removes details without summary', () => {
      const block = '<details>\nNo summary here\n</details>';
      expect(collapseDetails(block)).toBe('');
    });

    it('preserves text outside details blocks', () => {
      const text = `Before\n${detailsBlock}\nAfter`;
      expect(collapseDetails(text)).toBe(
        'Before\n<details><summary>Example A</summary></details>\nAfter',
      );
    });

    it('handles empty expandDetails the same as undefined', () => {
      expect(collapseDetails(detailsBlock, [])).toBe(
        '<details><summary>Example A</summary></details>',
      );
    });
  });

  describe('with filter', () => {
    it('returns only matching details blocks, fully expanded', () => {
      const text = `${detailsBlock}\n\n${detailsBlockOpen}`;
      expect(collapseDetails(text, ['Example A'])).toBe(
        '<details open>\n<summary>Example A</summary>\n\nSome content for A\n</details>',
      );
    });

    it('returns multiple matching blocks', () => {
      const text = `${detailsBlock}\n\n${detailsBlockOpen}`;
      const result = collapseDetails(text, ['Example A', 'Example B']);
      expect(result).toContain('<summary>Example A</summary>');
      expect(result).toContain('<summary>Example B</summary>');
    });

    it('returns empty string when nothing matches', () => {
      expect(collapseDetails(detailsBlock, ['Nonexistent'])).toBe('');
    });

    it('strips all non-matching text', () => {
      const text = `Some preamble\n${detailsBlock}\nSome postscript`;
      const result = collapseDetails(text, ['Example A']);
      expect(result).not.toContain('preamble');
      expect(result).not.toContain('postscript');
    });
  });
});
