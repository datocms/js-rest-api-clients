import { pre, render } from './markdown';
import type { HyperschemaLinkJsExample } from './types';

/**
 * Renders a JavaScript example as a Markdown `<details>` block.
 *
 * When `renderFull` is false (default), only the collapsed summary is emitted.
 * When `renderFull` is true, the full code example is included inside the
 * details block, optionally with the `open` attribute.
 */
export function renderExample(
  example: HyperschemaLinkJsExample,
  options?: { renderFull?: boolean; isExpanded?: boolean },
): string {
  if (!example.request?.code) {
    return '';
  }

  if (!options?.renderFull) {
    return `<details><summary>Example: ${example.title}</summary></details>`;
  }

  const content = render(
    example.description,
    pre({ language: 'javascript' }, example.request.code),
  );

  const openAttr = options.isExpanded ? ' open' : '';
  return `<details${openAttr}>\n<summary>Example: ${example.title}</summary>\n\n${content}\n</details>`;
}
