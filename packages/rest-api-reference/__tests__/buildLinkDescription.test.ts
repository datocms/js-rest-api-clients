import { buildLinkDescription } from '../src/buildLinkDescription';
import type { HyperschemaLink } from '../src/types';

function makeLink(overrides: Partial<HyperschemaLink> = {}): HyperschemaLink {
  return {
    rel: 'create',
    title: 'Create',
    href: '/items',
    method: 'POST',
    ...overrides,
  };
}

describe('buildLinkDescription', () => {
  it('returns empty string when link has no description or examples', () => {
    expect(buildLinkDescription(makeLink())).toBe('');
  });

  it('returns description as-is when there are no examples', () => {
    const link = makeLink({ description: 'Creates a new item.' });
    expect(buildLinkDescription(link)).toBe('Creates a new item.');
  });

  it('replaces inline ::example[id] with collapsed example', () => {
    const link = makeLink({
      description: 'Creates a new item.\n\n::example[basic]',
      documentation: {
        javascript: {
          examples: [
            {
              id: 'basic',
              title: 'Basic creation',
              description: 'A basic example.',
              request: { code: 'client.items.create()' },
            },
          ],
        },
      },
    });

    const result = buildLinkDescription(link);
    expect(result).toContain('Creates a new item.');
    expect(result).toContain(
      '<details><summary>Example: Basic creation</summary></details>',
    );
    expect(result).not.toContain('::example[basic]');
  });

  it('removes inline reference when example id is not found', () => {
    const link = makeLink({
      description: 'Before ::example[missing] After',
    });

    expect(buildLinkDescription(link)).toBe('Before  After');
  });

  it('appends unreferenced examples at the end', () => {
    const link = makeLink({
      description: 'Creates a new item.',
      documentation: {
        javascript: {
          examples: [
            {
              id: 'extra',
              title: 'Extra example',
              description: 'Not inline.',
              request: { code: 'client.items.create()' },
            },
          ],
        },
      },
    });

    const result = buildLinkDescription(link);
    expect(result).toContain('Creates a new item.');
    expect(result).toContain(
      '<details><summary>Example: Extra example</summary></details>',
    );
  });

  it('does not double-render inline examples in appended section', () => {
    const link = makeLink({
      description: '::example[inline-one]',
      documentation: {
        javascript: {
          examples: [
            {
              id: 'inline-one',
              title: 'Inline One',
              description: 'Desc',
              request: { code: 'code()' },
            },
            {
              id: 'appended',
              title: 'Appended',
              description: 'Desc',
              request: { code: 'code()' },
            },
          ],
        },
      },
    });

    const result = buildLinkDescription(link);
    const inlineCount = (
      result.match(/Example: Inline One/g) || []
    ).length;
    expect(inlineCount).toBe(1);
    expect(result).toContain('Example: Appended');
  });

  describe('with expandDetails filter', () => {
    const link = makeLink({
      description: 'Creates an item.\n\n::example[basic]',
      documentation: {
        javascript: {
          examples: [
            {
              id: 'basic',
              title: 'Basic creation',
              description: 'A basic example.',
              request: { code: 'client.items.create()' },
            },
            {
              id: 'advanced',
              title: 'Advanced creation',
              description: 'An advanced example.',
              request: { code: 'client.items.create({ complex: true })' },
            },
          ],
        },
      },
    });

    it('expands only matching inline examples', () => {
      const result = buildLinkDescription(link, [
        'Example: Basic creation',
      ]);
      expect(result).toContain('<details open>');
      expect(result).toContain('client.items.create()');
    });

    it('filters out non-matching inline examples', () => {
      const result = buildLinkDescription(link, [
        'Example: Advanced creation',
      ]);
      expect(result).toContain('<details open>');
      expect(result).toContain('client.items.create({ complex: true })');
    });

    it('expands matching appended examples', () => {
      const result = buildLinkDescription(link, [
        'Example: Advanced creation',
      ]);
      expect(result).toContain('Advanced creation');
      expect(result).toContain('<details open>');
    });
  });
});
