import { collapseDetails } from './collapseDetails.js';
import { renderExample } from './renderExample.js';
import type { HyperschemaLink } from './types.js';

/** Pattern matching inline example references (e.g. `::example[create-upload]`). */
const exampleRefPattern = /::example\[([^\]]+)\]/g;

/**
 * Builds a complete Markdown description for a hyperschema link, including
 * inline and appended examples.
 *
 * - `expandDetails` undefined/empty → all examples collapsed (summary only).
 * - `expandDetails` contains `'*'` → all examples rendered open, prose preserved.
 * - `expandDetails` contains specific summary texts → only matching examples
 *   are emitted (fully expanded), all other prose and examples are stripped.
 *
 * `autoExpandIfBelow`, when set and no `expandDetails` filter is active,
 * triggers `'*'`-style expansion if the collapsed result is shorter than the
 * given character count.
 */
export function buildLinkDescription(
  link: HyperschemaLink,
  expandDetails?: string[],
  autoExpandIfBelow?: number,
): string {
  const expandAll = expandDetails?.includes('*') ?? false;
  const collapsed = renderInternal(link, expandDetails);

  if (
    !expandAll &&
    (!expandDetails || expandDetails.length === 0) &&
    autoExpandIfBelow !== undefined &&
    collapsed.length < autoExpandIfBelow
  ) {
    return renderInternal(link, ['*']);
  }

  return collapsed;
}

function renderInternal(
  link: HyperschemaLink,
  expandDetails: string[] | undefined,
): string {
  const examples = link?.documentation?.javascript?.examples || [];
  const description = link.description || '';
  const inlineIds: string[] = [];
  const expandAll = expandDetails?.includes('*') ?? false;
  const hasFilter =
    !expandAll && expandDetails !== undefined && expandDetails.length > 0;

  const result = description.replace(exampleRefPattern, (_match, name) => {
    inlineIds.push(name as string);
    const example = examples.find((ex) => ex.id === name);
    if (!example) {
      return '';
    }

    const exampleTitle = `Example: ${example.title}`;

    if (expandAll) {
      return `\n\n${renderExample(example, { renderFull: true, isExpanded: true })}`;
    }

    if (hasFilter) {
      if (!expandDetails!.includes(exampleTitle)) {
        return '';
      }
      return `\n\n${renderExample(example, { renderFull: true, isExpanded: true })}`;
    }

    return `\n\n${renderExample(example)}`;
  });

  const processedResult = collapseDetails(result, expandDetails);

  return examples
    .filter((example) => !inlineIds.includes(example.id))
    .reduce((acc, example) => {
      const exampleTitle = `Example: ${example.title}`;

      if (expandAll) {
        return `${acc}\n\n${renderExample(example, { renderFull: true, isExpanded: true })}`;
      }

      if (hasFilter) {
        if (!expandDetails!.includes(exampleTitle)) {
          return acc;
        }
        return `${acc}\n\n${renderExample(example, { renderFull: true, isExpanded: true })}`;
      }

      return `${acc}\n\n${renderExample(example)}`;
    }, processedResult);
}
