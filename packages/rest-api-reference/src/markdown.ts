type MarkdownNode = undefined | null | string | MarkdownElement;

interface MarkdownElement {
  type: string;
  props?: Record<string, unknown>;
  children: MarkdownNode[];
}

function createElement(
  type: string,
  props?: Record<string, unknown>,
  ...children: MarkdownNode[]
): MarkdownElement {
  return { type, props: props || {}, children: children.flat() };
}

// Headings
export const h1 = (...children: MarkdownNode[]) =>
  createElement('h1', undefined, ...children);

export const h2 = (...children: MarkdownNode[]) =>
  createElement('h2', undefined, ...children);

export const h3 = (...children: MarkdownNode[]) =>
  createElement('h3', undefined, ...children);

// Text
export const p = (...children: MarkdownNode[]) =>
  createElement('p', undefined, ...children);

export const strong = (...children: MarkdownNode[]) =>
  createElement('strong', undefined, ...children);

export const em = (...children: MarkdownNode[]) =>
  createElement('em', undefined, ...children);

export const code = (...children: MarkdownNode[]) =>
  createElement('code', undefined, ...children);

export const pre = (
  props?: { language?: string },
  ...children: MarkdownNode[]
) => createElement('pre', props, ...children);

// Links
export const a = (
  props: { href: string; title?: string },
  ...children: MarkdownNode[]
) => createElement('a', props, ...children);

// Lists
export const ul = (...children: MarkdownNode[]) =>
  createElement('ul', undefined, ...children);

export const ol = (...children: MarkdownNode[]) =>
  createElement('ol', undefined, ...children);

export const li = (...children: MarkdownNode[]) =>
  createElement('li', undefined, ...children);

// Block
export const blockquote = (...children: MarkdownNode[]) =>
  createElement('blockquote', undefined, ...children);

export const hr = () => createElement('hr');
export const br = () => createElement('br');

// Rendering
function renderListItem(
  node: MarkdownElement,
  depth: number,
  number?: number,
): string {
  const indent = '  '.repeat(depth);
  const bullet = number !== undefined ? `${number}.` : '-';
  const childrenText = node.children
    .map((child) => renderNode(child, depth + 1))
    .join('');
  return `${indent}${bullet} ${childrenText}\n`;
}

function renderNode(node: MarkdownNode, depth = 0): string {
  if (!node) {
    return '';
  }

  if (typeof node === 'string') {
    return node;
  }

  const { type, props = {}, children } = node;
  const childrenText = children
    .map((child) => renderNode(child, depth + 1))
    .join('');

  switch (type) {
    case 'h1':
      return `# ${childrenText}\n\n`;
    case 'h2':
      return `## ${childrenText}\n\n`;
    case 'h3':
      return `### ${childrenText}\n\n`;
    case 'p':
      return `${childrenText}\n\n`;
    case 'strong':
      return `**${childrenText}**`;
    case 'em':
      return `*${childrenText}*`;
    case 'code':
      return `\`${childrenText}\``;
    case 'pre':
      if (props.language) {
        return `\`\`\`${props.language}\n${childrenText}\n\`\`\`\n\n`;
      }
      return `\`\`\`\n${childrenText}\n\`\`\`\n\n`;
    case 'a': {
      const title = props.title ? ` "${props.title}"` : '';
      return `[${childrenText}](${props.href}${title})`;
    }
    case 'ul':
      return `${children.map((child) => renderNode(child, depth)).join('')}\n`;
    case 'ol':
      return `${children
        .map((child, index) => {
          if (child && typeof child === 'object' && child.type === 'li') {
            return renderListItem(child, depth, index + 1);
          }
          return renderNode(child, depth);
        })
        .join('')}\n`;
    case 'li':
      return renderListItem(node, depth);
    case 'blockquote':
      return `> ${childrenText}\n\n`;
    case 'hr':
      return '---\n\n';
    case 'br':
      return '  \n';
    default:
      return childrenText;
  }
}

export function render(...nodes: MarkdownNode[]): string {
  return nodes
    .map((node) => renderNode(node))
    .join('')
    .trim();
}
