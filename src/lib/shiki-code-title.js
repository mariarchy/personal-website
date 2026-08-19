/**
 * Reads `title="…"` from a code fence's meta string and exposes it as
 * `data-title` on the <pre>, so CSS can render a caption without extra JS.
 *
 * Example:
 *   ```python title="evals/rate_limit/token_bucket.py"
 */
export function transformerCodeTitle() {
  return {
    name: 'transformer-code-title',
    pre(node) {
      const raw = metaRaw(this.options?.meta);
      const match = raw.match(/title="([^"]+)"/);
      if (match) {
        node.properties['data-title'] = match[1];
      }
      // Keyboard-focusable so overflow-x code blocks can be scrolled without a mouse.
      node.properties.tabindex = '0';
    },
  };
}

function metaRaw(meta) {
  if (!meta) return '';
  if (typeof meta === 'string') return meta;
  return meta.__raw ?? '';
}
