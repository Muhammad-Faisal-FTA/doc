function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Deliberately dumb conversion, matching the locked-in decision in TRD
 * section 11: "plain content import, #-style headings mapped to Tiptap headings,
 * no smart parsing." No lists, bold, links, etc. — that's explicitly out
 * of scope for the upload path. Anything beyond a bare line becomes a
 * plain paragraph.
 *
 * - .md: lines starting with 1-3 `#` become h1/h2/h3, everything else is
 *   a paragraph.
 * - .txt: every non-blank line is a paragraph.
 */
export function convertToEditorHtml(rawText: string, extension: "txt" | "md"): string {
  const lines = rawText.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") continue;

    if (extension === "md") {
      const headingMatch = /^(#{1,3})\s+(.*)$/.exec(trimmed);
      if (headingMatch) {
        const level = headingMatch[1].length;
        html.push(`<h${level}>${escapeHtml(headingMatch[2])}</h${level}>`);
        continue;
      }
    }

    html.push(`<p>${escapeHtml(trimmed)}</p>`);
  }

  return html.join("") || "<p></p>";
}
