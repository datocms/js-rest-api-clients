/**
 * Processes HTML `<details>` tags in text to control their display.
 *
 * When `expandDetails` is undefined or empty, all `<details>` blocks are
 * collapsed: only their `<summary>` line is kept.
 *
 * When `expandDetails` is provided, **only** matching details (by summary
 * text) are returned — fully expanded — and everything else is stripped.
 */
export function collapseDetails(
  text: string,
  expandDetails?: string[],
): string {
  const detailsPattern = /<details(\s+open)?>([\s\S]*?)<\/details>/gi;
  const hasFilter = expandDetails && expandDetails.length > 0;

  if (hasFilter) {
    const matches: string[] = [];
    let match: RegExpExecArray | null;
    const regex = new RegExp(detailsPattern);

    while ((match = regex.exec(text)) !== null) {
      const content = match[2];
      if (!content) continue;

      const summaryMatch = content.match(/<summary>([\s\S]*?)<\/summary>/i);

      if (summaryMatch?.[1]) {
        const summaryText = summaryMatch[1].trim();
        if (expandDetails.some((s) => s === summaryText)) {
          matches.push(`<details open>${content}</details>`);
        }
      }
    }

    return matches.join('\n\n');
  }

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
