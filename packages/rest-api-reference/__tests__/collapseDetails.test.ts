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

  describe("with '*' wildcard", () => {
    it('expands every details block in place, preserving prose', () => {
      const text = `Before\n${detailsBlock}\nAfter`;
      const result = collapseDetails(text, ['*']);
      expect(result).toContain('Before');
      expect(result).toContain('After');
      expect(result).toContain('<details open>');
      expect(result).toContain('Some content for A');
    });

    it('expands multiple blocks and keeps non-matching prose', () => {
      const text = `${detailsBlock}\n\nMiddle text\n\n${detailsBlockOpen}`;
      const result = collapseDetails(text, ['*']);
      expect(result).toContain('Middle text');
      expect(result).toContain('Some content for A');
      expect(result).toContain('Some content for B');
      const opens = result.match(/<details open>/g) ?? [];
      expect(opens.length).toBe(2);
    });
  });

  describe('with autoExpandIfBelow', () => {
    it('expands all blocks when collapsed result is below threshold', () => {
      const text = `Before\n${detailsBlock}\nAfter`;
      const result = collapseDetails(text, undefined, 10_000);
      expect(result).toContain('<details open>');
      expect(result).toContain('Some content for A');
      expect(result).toContain('Before');
    });

    it('keeps blocks collapsed when collapsed result exceeds threshold', () => {
      const text = `Before\n${detailsBlock}\nAfter`;
      const result = collapseDetails(text, undefined, 5);
      expect(result).not.toContain('<details open>');
      expect(result).toContain(
        '<details><summary>Example A</summary></details>',
      );
    });

    it('is ignored when an explicit filter is active', () => {
      const text = `Before\n${detailsBlock}\nAfter`;
      const result = collapseDetails(text, ['Example A'], 10_000);
      expect(result).not.toContain('Before');
      expect(result).not.toContain('After');
      expect(result).toContain('Some content for A');
    });
  });
});
