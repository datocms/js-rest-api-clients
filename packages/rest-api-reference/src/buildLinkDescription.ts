import { collapseDetails } from './collapseDetails';
import { renderExample } from './renderExample';
import type { HyperschemaLink } from './types';

/** Pattern matching inline example references (e.g. `::example[create-upload]`). */
const exampleRefPattern = /::example\[([^\]]+)\]/g;

/**
 * Builds a complete Markdown description for a hyperschema link, including
 * inline and appended examples.
 *
 * Examples referenced inline via `::example[id]` are replaced in-place;
 * unreferenced examples are appended at the end.
 *
 * When `expandDetails` is empty/undefined all examples are collapsed (summary
 * only). When provided, only matching examples are rendered — fully expanded.
 */
export function buildLinkDescription(
  link: HyperschemaLink,
  expandDetails?: string[],
): string {
  const examples = link?.documentation?.javascript?.examples || [];
  const description = link.description || '';
  const inlineIds: string[] = [];
  const hasFilter = expandDetails && expandDetails.length > 0;

  const result = description.replace(exampleRefPattern, (_match, name) => {
    inlineIds.push(name as string);
    const example = examples.find((ex) => ex.id === name);
    if (!example) {
      return '';
    }

    const exampleTitle = `Example: ${example.title}`;

    if (hasFilter) {
      if (!expandDetails.includes(exampleTitle)) {
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

      if (hasFilter) {
        if (!expandDetails.includes(exampleTitle)) {
          return acc;
        }
        return `${acc}\n\n${renderExample(example, { renderFull: true, isExpanded: true })}`;
      }

      return `${acc}\n\n${renderExample(example)}`;
    }, processedResult);
}
