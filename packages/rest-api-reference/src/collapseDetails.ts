/**
 * Processes HTML `<details>` tags in text to control their display.
 *
 * - `expandDetails` undefined or empty → all `<details>` collapsed (summary only),
 *   surrounding prose preserved.
 * - `expandDetails` contains `'*'` → every `<details>` expanded in-place,
 *   surrounding prose preserved.
 * - `expandDetails` contains specific summary texts → only matching details
 *   are returned, fully expanded; everything else (including prose and
 *   non-matching details) is stripped.
 *
 * `autoExpandIfBelow`, when provided and no `expandDetails` filter is active,
 * triggers `'*'`-style expansion if the collapsed result is shorter than the
 * given character count.
 */
export function collapseDetails(
  text: string,
  expandDetails?: string[],
  autoExpandIfBelow?: number,
): string {
  const detailsPattern = /<details(\s+open)?>([\s\S]*?)<\/details>/gi;
  const expandAll = expandDetails?.includes('*') ?? false;
  const hasFilter =
    !expandAll && expandDetails !== undefined && expandDetails.length > 0;

  if (hasFilter) {
    const matches: string[] = [];
    const regex = new RegExp(detailsPattern);

    for (
      let match = regex.exec(text);
      match !== null;
      match = regex.exec(text)
    ) {
      const content = match[2];
      if (!content) continue;

      const summaryMatch = content.match(/<summary>([\s\S]*?)<\/summary>/i);

      if (summaryMatch?.[1]) {
        const summaryText = summaryMatch[1].trim();
        if (expandDetails!.some((s) => s === summaryText)) {
          matches.push(`<details open>${content}</details>`);
        }
      }
    }

    return matches.join('\n\n');
  }

  if (expandAll) {
    return expandAllInPlace(text, detailsPattern);
  }

  const collapsed = collapseAllInPlace(text, detailsPattern);

  if (autoExpandIfBelow !== undefined && collapsed.length < autoExpandIfBelow) {
    return expandAllInPlace(text, detailsPattern);
  }

  return collapsed;
}

function expandAllInPlace(text: string, detailsPattern: RegExp): string {
  return text.replace(detailsPattern, (_match, _openAttr, content) => {
    const hasSummary = /<summary>[\s\S]*?<\/summary>/i.test(content as string);
    if (!hasSummary) return '';
    return `<details open>${content as string}</details>`;
  });
}

function collapseAllInPlace(text: string, detailsPattern: RegExp): string {
  return text.replace(detailsPattern, (_match, _openAttr, content) => {
    const summaryMatch = (content as string).match(
      /<summary>([\s\S]*?)<\/summary>/i,
    );

    if (!summaryMatch) {
      return '';
    }

    return `<details>${summaryMatch[0]}</details>`;
  });
}
