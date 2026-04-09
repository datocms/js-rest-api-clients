import {
  render,
  h1,
  h2,
  h3,
  p,
  strong,
  em,
  code,
  pre,
  a,
  ul,
  ol,
  li,
  blockquote,
  hr,
  br,
} from '../src/markdown';

describe('markdown', () => {
  describe('headings', () => {
    it('renders h1', () => {
      expect(render(h1('Title'))).toBe('# Title');
    });

    it('renders h2', () => {
      expect(render(h2('Subtitle'))).toBe('## Subtitle');
    });

    it('renders h3', () => {
      expect(render(h3('Section'))).toBe('### Section');
    });
  });

  describe('text formatting', () => {
    it('renders paragraphs', () => {
      expect(render(p('Hello world'))).toBe('Hello world');
    });

    it('renders strong', () => {
      expect(render(p('This is ', strong('bold'), ' text'))).toBe(
        'This is **bold** text',
      );
    });

    it('renders em', () => {
      expect(render(p('This is ', em('italic'), ' text'))).toBe(
        'This is *italic* text',
      );
    });

    it('renders inline code', () => {
      expect(render(p('Use ', code('npm install')))).toBe(
        'Use `npm install`',
      );
    });
  });

  describe('code blocks', () => {
    it('renders pre without language', () => {
      expect(render(pre(undefined, 'const x = 1;'))).toBe(
        '```\nconst x = 1;\n```',
      );
    });

    it('renders pre with language', () => {
      expect(render(pre({ language: 'javascript' }, 'const x = 1;'))).toBe(
        '```javascript\nconst x = 1;\n```',
      );
    });
  });

  describe('links', () => {
    it('renders a link', () => {
      expect(render(a({ href: 'https://example.com' }, 'Click'))).toBe(
        '[Click](https://example.com)',
      );
    });

    it('renders a link with title', () => {
      expect(
        render(a({ href: 'https://example.com', title: 'My Title' }, 'Click')),
      ).toBe('[Click](https://example.com "My Title")');
    });
  });

  describe('lists', () => {
    it('renders unordered list', () => {
      expect(render(ul(li('First'), li('Second')))).toBe(
        '- First\n- Second',
      );
    });

    it('renders ordered list', () => {
      expect(render(ol(li('First'), li('Second')))).toBe(
        '1. First\n2. Second',
      );
    });
  });

  describe('block elements', () => {
    it('renders blockquote', () => {
      expect(render(blockquote('A quote'))).toBe('> A quote');
    });

    it('renders hr', () => {
      expect(render(hr())).toBe('---');
    });

    it('renders br', () => {
      expect(render(p('Line1', br(), 'Line2'))).toBe('Line1  \nLine2');
    });
  });

  describe('render', () => {
    it('handles null and undefined children', () => {
      expect(render(p('Hello', null, undefined, ' world'))).toBe(
        'Hello world',
      );
    });

    it('renders multiple nodes', () => {
      expect(render(h1('Title'), p('Body'))).toBe('# Title\n\nBody');
    });

    it('renders nested structures', () => {
      expect(
        render(
          h1('API'),
          p('Use ', strong(code('client.items')), ' to fetch items.'),
          ul(li('First'), li('Second')),
        ),
      ).toBe(
        '# API\n\nUse **`client.items`** to fetch items.\n\n- First\n- Second',
      );
    });
  });
});
