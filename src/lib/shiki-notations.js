/**
 * Shiki's bundled notation transformers recombine split comment tokens on
 * `//`, so Python `# [!code --]` markers survive highlighting as visible text.
 * This walks the highlighted <pre> tree and applies the same classes.
 */
export function transformerHashNotations() {
  return {
    name: 'transformer-hash-notations',
    pre(node) {
      const code = node.children?.find(
        (child) => child.type === 'element' && child.tagName === 'code'
      );
      if (!code) return;

      const lines = code.children.filter((child) => child.type === 'element');
      let hasDiff = false;
      let hasHighlighted = false;

      for (const line of lines) {
        const text = hastText(line);
        const notation = text.match(/\[!code\s+([^\]]+)\]/);
        if (!notation) continue;

        const kind = notation[1].trim();
        if (kind === '--' || kind.startsWith('--')) {
          this.addClassToHast(line, 'diff');
          this.addClassToHast(line, 'remove');
          hasDiff = true;
        } else if (kind === '++' || kind.startsWith('++')) {
          this.addClassToHast(line, 'diff');
          this.addClassToHast(line, 'add');
          hasDiff = true;
        } else if (kind.startsWith('highlight')) {
          this.addClassToHast(line, 'highlighted');
          hasHighlighted = true;
        } else {
          continue;
        }

        stripTrailingNotation(line);
      }

      if (hasDiff) this.addClassToHast(node, 'has-diff');
      if (hasHighlighted) this.addClassToHast(node, 'has-highlighted');
    },
  };
}

function hastText(node) {
  if (node.type === 'text') return node.value ?? '';
  if (!node.children) return '';
  return node.children.map(hastText).join('');
}

function stripTrailingNotation(line) {
  const suffix = hastText(line).match(/\s*#\s*\[!code[^\]]*\]\s*$/);
  if (!suffix) return;

  let remaining = suffix[0].length;
  for (let i = line.children.length - 1; i >= 0 && remaining > 0; i--) {
    const child = line.children[i];
    const text = hastText(child);
    if (text.length <= remaining) {
      line.children.splice(i, 1);
      remaining -= text.length;
      continue;
    }
    truncateHast(child, text.length - remaining);
    remaining = 0;
  }

  while (line.children.length) {
    const last = line.children[line.children.length - 1];
    const text = hastText(last);
    if (!/^\s+$/.test(text)) break;
    line.children.pop();
  }
}

function truncateHast(node, keep) {
  if (node.type === 'text') {
    node.value = node.value.slice(0, keep);
    return;
  }
  if (!node.children) return;
  let used = 0;
  const next = [];
  for (const child of node.children) {
    const len = hastText(child).length;
    if (used >= keep) break;
    if (used + len <= keep) {
      next.push(child);
      used += len;
    } else {
      truncateHast(child, keep - used);
      next.push(child);
      used = keep;
    }
  }
  node.children = next;
}
