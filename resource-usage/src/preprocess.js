/**
 * Source preprocessing helpers for the resource-usage scanner.
 *
 * The scanner uses regex on source text. Without preprocessing, comments and
 * string literals produce a torrent of false positives (e.g. the word "connect"
 * inside a JSDoc line, or "setTimeout" inside an example string). These
 * helpers neutralise that noise while preserving line numbers so downstream
 * line-based reporting still points at the right place.
 */

/**
 * Replace block comments, line comments, and string literals with whitespace
 * of equal length so line numbers and column offsets are preserved. Backticked
 * template literals are blanked too; this loses interpolation context but the
 * scanner doesn't rely on it.
 *
 * Note: this is a single-pass character walker, not a real lexer. It handles
 * the common cases (escapes inside strings, // inside strings, /* inside
 * strings) correctly enough for resource-leak heuristics.
 */
export function stripCommentsAndStrings(source) {
  const out = [];
  const len = source.length;
  let i = 0;

  const blank = (ch) => (ch === '\n' ? '\n' : ' ');

  while (i < len) {
    const c = source[i];
    const n = source[i + 1];

    // Block comment
    if (c === '/' && n === '*') {
      out.push('  ');
      i += 2;
      while (i < len && !(source[i] === '*' && source[i + 1] === '/')) {
        out.push(blank(source[i]));
        i += 1;
      }
      if (i < len) {
        out.push('  ');
        i += 2;
      }
      continue;
    }

    // Line comment
    if (c === '/' && n === '/') {
      while (i < len && source[i] !== '\n') {
        out.push(' ');
        i += 1;
      }
      continue;
    }

    // String literal: ' " `
    if (c === "'" || c === '"' || c === '`') {
      const quote = c;
      out.push(' ');
      i += 1;
      while (i < len) {
        const ch = source[i];
        if (ch === '\\') {
          out.push(' ');
          out.push(i + 1 < len ? blank(source[i + 1]) : ' ');
          i += 2;
          continue;
        }
        if (ch === quote) {
          out.push(' ');
          i += 1;
          break;
        }
        // Template-literal interpolation: `${ ... }` — blank the whole
        // expression too. Keeps things simple and safe.
        if (quote === '`' && ch === '$' && source[i + 1] === '{') {
          out.push('  ');
          i += 2;
          let depth = 1;
          while (i < len && depth > 0) {
            const cc = source[i];
            if (cc === '{') depth += 1;
            else if (cc === '}') depth -= 1;
            out.push(blank(cc));
            i += 1;
          }
          continue;
        }
        out.push(blank(ch));
        i += 1;
      }
      continue;
    }

    out.push(c);
    i += 1;
  }

  return out.join('');
}

/**
 * Find the index of the matching `}` for an opening `{` at `openIdx`.
 * Returns -1 if unbalanced. Operates on already-stripped source so braces
 * inside strings/comments don't confuse it.
 */
export function findBlockEnd(stripped, openIdx) {
  if (stripped[openIdx] !== '{') return -1;
  let depth = 0;
  for (let i = openIdx; i < stripped.length; i += 1) {
    const ch = stripped[i];
    if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * Convert a character index into a 1-based line number.
 */
export function indexToLine(source, idx) {
  if (idx <= 0) return 1;
  let count = 1;
  const upTo = Math.min(idx, source.length);
  for (let i = 0; i < upTo; i += 1) {
    if (source[i] === '\n') count += 1;
  }
  return count;
}

/**
 * Locate the smallest enclosing function/arrow body (the `{...}` that
 * surrounds `idx`). Returns `{ start, end }` indices into `stripped`, or null.
 * Walks outward from `idx` by counting braces.
 */
export function enclosingBlock(stripped, idx) {
  // Walk left, tracking how many '}' we've seen; each '{' that brings the
  // running count to -1 is our opening brace.
  let closes = 0;
  let openIdx = -1;
  for (let i = idx; i >= 0; i -= 1) {
    const ch = stripped[i];
    if (ch === '}') closes += 1;
    else if (ch === '{') {
      if (closes === 0) {
        openIdx = i;
        break;
      }
      closes -= 1;
    }
  }
  if (openIdx === -1) return null;
  const endIdx = findBlockEnd(stripped, openIdx);
  if (endIdx === -1) return null;
  return { start: openIdx, end: endIdx };
}

/**
 * True if the file looks like a one-shot script that exits after running
 * (CLI, seed, migration helper). These files legitimately call $connect and
 * tear down with $disconnect at the bottom; we shouldn't flag them.
 */
export function looksLikeOneShotScript(filePath, source) {
  if (/[\\/](scripts|cli|bin|tools)[\\/]/.test(filePath)) return true;
  if (/process\.exit\s*\(/.test(source)) return true;
  if (/\.finally\s*\(\s*\(\s*\)\s*=>\s*[\w$]+\.\$disconnect/.test(source)) return true;
  return false;
}
