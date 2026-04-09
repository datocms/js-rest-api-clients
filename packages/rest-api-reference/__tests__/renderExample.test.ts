import { renderExample } from '../src/renderExample';
import type { HyperschemaLinkJsExample } from '../src/types';

describe('renderExample', () => {
  const example: HyperschemaLinkJsExample = {
    id: 'ex1',
    title: 'Create item',
    description: 'Creates a new item.',
    request: {
      code: 'await client.items.create({ itemType: { id: "123", type: "item_type" } })',
    },
  };

  it('returns empty string when example has no request code', () => {
    const noCode: HyperschemaLinkJsExample = {
      id: 'ex2',
      title: 'Empty',
      description: 'No code',
    };
    expect(renderExample(noCode)).toBe('');
  });

  it('returns empty string when request.code is undefined', () => {
    const noCode: HyperschemaLinkJsExample = {
      id: 'ex2',
      title: 'Empty',
      description: 'No code',
      request: {},
    };
    expect(renderExample(noCode)).toBe('');
  });

  it('renders collapsed summary by default', () => {
    expect(renderExample(example)).toBe(
      '<details><summary>Example: Create item</summary></details>',
    );
  });

  it('renders collapsed summary when renderFull is false', () => {
    expect(renderExample(example, { renderFull: false })).toBe(
      '<details><summary>Example: Create item</summary></details>',
    );
  });

  it('renders full content when renderFull is true', () => {
    const result = renderExample(example, { renderFull: true });
    expect(result).toContain('<details>');
    expect(result).toContain('<summary>Example: Create item</summary>');
    expect(result).toContain('Creates a new item.');
    expect(result).toContain('```javascript');
    expect(result).toContain('client.items.create');
    expect(result).toContain('</details>');
    expect(result).not.toContain('open');
  });

  it('renders full content with open attribute when isExpanded', () => {
    const result = renderExample(example, {
      renderFull: true,
      isExpanded: true,
    });
    expect(result).toContain('<details open>');
  });
});
