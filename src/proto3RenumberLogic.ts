export type BlockType = 'message' | 'enum';

export interface ProtoBlock {
  type: BlockType;
  keywordStart: number;
  openBrace: number;
  closeBrace: number;
}

export interface NumericEdit {
  start: number;
  end: number;
  replacement: string;
}

/**
 * Finds the innermost message or enum containing the given cursor offset.
 *
 * Example:
 *   findEnclosingBlock('message Foo { string name = 1; }', 22);
 *   // => { type: 'message', ... }
 */
export function findEnclosingBlock(text: string, offset: number): ProtoBlock | undefined {
  return findEnclosingBlockInMaskedText(maskCommentsAndStrings(text), offset);
}

/**
 * Returns every message and enum block in the document in source order.
 *
 * Example:
 *   findAllBlocks('message Foo {} enum Bar {}').map(block => block.type);
 *   // => ['message', 'enum']
 */
export function findAllBlocks(text: string): ProtoBlock[] {
  return findAllBlocksInMaskedText(maskCommentsAndStrings(text));
}

/**
 * Renumbers every message field and enum value in the document and returns the edits.
 *
 * Example:
 *   computeDocumentRenumberEdits('message Foo { string name = 7; }');
 *   // => edit that rewrites 7 -> 1
 */
export function computeDocumentRenumberEdits(text: string): NumericEdit[] {
  const maskedText = maskCommentsAndStrings(text);
  const edits: NumericEdit[] = [];

  findAllBlocksInMaskedText(maskedText).forEach(block => {
    const blockEdits =
      block.type === 'enum'
        ? computeEnumEditsInMaskedText(maskedText, block)
        : computeMessageEditsInMaskedText(maskedText, block);
    edits.push(...blockEdits);
  });

  return edits.sort((a, b) => a.start - b.start);
}

/**
 * Renumbers the fields inside one message block, skipping nested messages and enums.
 *
 * Example:
 *   computeMessageEdits('message Foo { string a = 9; int32 b = 12; }', block);
 *   // => edits that rewrite 9 -> 1 and 12 -> 2
 */
export function computeMessageEdits(text: string, block: ProtoBlock): NumericEdit[] {
  return computeMessageEditsInMaskedText(maskCommentsAndStrings(text), block);
}

/**
 * Renumbers the values inside one enum block starting from zero.
 *
 * Example:
 *   computeEnumEdits('enum State { UNKNOWN = 5; STARTED = 8; }', block);
 *   // => edits that rewrite 5 -> 0 and 8 -> 1
 */
export function computeEnumEdits(text: string, block: ProtoBlock): NumericEdit[] {
  return computeEnumEditsInMaskedText(maskCommentsAndStrings(text), block);
}

/**
 * Reuses a pre-masked buffer to locate the innermost message or enum at an offset.
 *
 * Example:
 *   const masked = maskCommentsAndStrings('message Foo { string name = 1; }');
 *   findEnclosingBlockInMaskedText(masked, masked.indexOf('name'));
 *   // => { type: 'message', ... }
 */
function findEnclosingBlockInMaskedText(
  maskedText: string,
  offset: number
): ProtoBlock | undefined {
  const message = locateBlock(maskedText, offset, 'message');
  const enumeration = locateBlock(maskedText, offset, 'enum');

  if (message && enumeration) {
    return message.keywordStart > enumeration.keywordStart ? message : enumeration;
  }
  return message ?? enumeration ?? undefined;
}

/**
 * Scans a pre-masked proto buffer and returns every message/enum block in source order.
 *
 * Example:
 *   const masked = maskCommentsAndStrings('message Foo {} enum Bar {}');
 *   findAllBlocksInMaskedText(masked).map(block => block.type);
 *   // => ['message', 'enum']
 */
function findAllBlocksInMaskedText(maskedText: string): ProtoBlock[] {
  const blocks: ProtoBlock[] = [];
  const pattern = /\b(message|enum)\s+[A-Za-z_][\w]*\s*{/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(maskedText)) !== null) {
    const openBrace = match.index + match[0].lastIndexOf('{');
    const closeBrace = findMatchingBrace(maskedText, openBrace);
    if (closeBrace === -1) {
      continue;
    }
    blocks.push({
      type: match[1] as BlockType,
      keywordStart: match.index,
      openBrace,
      closeBrace,
    });
  }

  return blocks;
}

/**
 * Computes message field renumber edits from a pre-masked buffer.
 *
 * Example:
 *   const masked = maskCommentsAndStrings('message Foo { string a = 9; int32 b = 12; }');
 *   computeMessageEditsInMaskedText(masked, findAllBlocksInMaskedText(masked)[0]);
 *   // => edits that rewrite 9 -> 1 and 12 -> 2
 */
function computeMessageEditsInMaskedText(maskedText: string, block: ProtoBlock): NumericEdit[] {
  if (block.type !== 'message') {
    return [];
  }

  const edits: NumericEdit[] = [];
  const bodyStart = block.openBrace + 1;
  const bodyEnd = block.closeBrace;
  const body = maskedText.slice(bodyStart, bodyEnd);
  const nested = collectNestedTypeRanges(maskedText, bodyStart, bodyEnd);
  const pattern =
    /^(\s*(?:(?:repeated|optional|required)\s+)?(?:map<[^>]+>|[.A-Za-z_][\w<>.]*)\s+[A-Za-z_][\w]*\s*=\s*)(\d+)/gm;
  let nextId = 1;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(body)) !== null) {
    const digitsRelative = match[1].length;
    const digitsStart = bodyStart + match.index + digitsRelative;
    const digitsEnd = digitsStart + match[2].length;

    if (isInsideNestedRange(digitsStart, nested)) {
      continue;
    }

    const replacement = String(nextId);
    if (replacement !== match[2]) {
      edits.push({ start: digitsStart, end: digitsEnd, replacement });
    }
    nextId++;
  }

  return edits;
}

/**
 * Computes enum value renumber edits from a pre-masked buffer.
 *
 * Example:
 *   const masked = maskCommentsAndStrings('enum State { UNKNOWN = 5; STARTED = 8; }');
 *   computeEnumEditsInMaskedText(masked, findAllBlocksInMaskedText(masked)[0]);
 *   // => edits that rewrite 5 -> 0 and 8 -> 1
 */
function computeEnumEditsInMaskedText(maskedText: string, block: ProtoBlock): NumericEdit[] {
  if (block.type !== 'enum') {
    return [];
  }

  const edits: NumericEdit[] = [];
  const bodyStart = block.openBrace + 1;
  const bodyEnd = block.closeBrace;
  const body = maskedText.slice(bodyStart, bodyEnd);
  // Hexadecimal renumbering is unlikely because hex values usually serve a specific purpose,
  // but if the user requests it, we should handle it properly instead of corrupting the literal.
  const pattern = /^(\s*[A-Za-z_][\w]*\s*=\s*)(-?(?:0[xX][0-9A-Fa-f]+|\d+))/gm;
  let nextId = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(body)) !== null) {
    const digitsRelative = match[1].length;
    const digitsStart = bodyStart + match.index + digitsRelative;
    const digitsEnd = digitsStart + match[2].length;
    const replacement = String(nextId);

    if (replacement !== match[2]) {
      edits.push({ start: digitsStart, end: digitsEnd, replacement });
    }
    nextId++;
  }

  return edits;
}

function locateBlock(text: string, offset: number, keyword: BlockType): ProtoBlock | undefined {
  const pattern = new RegExp(`\\b${keyword}\\s+[A-Za-z_][\\w]*\\s*{`, 'g');
  let match: RegExpExecArray | null;
  let candidate: ProtoBlock | undefined;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > offset) {
      break;
    }
    const openBrace = match.index + match[0].lastIndexOf('{');
    const closeBrace = findMatchingBrace(text, openBrace);
    if (closeBrace === -1) {
      continue;
    }
    if (offset >= openBrace && offset <= closeBrace) {
      candidate = {
        type: keyword,
        keywordStart: match.index,
        openBrace,
        closeBrace,
      };
    }
  }

  return candidate;
}

function collectNestedTypeRanges(
  text: string,
  start: number,
  end: number
): Array<{ start: number; end: number }> {
  const ranges: Array<{ start: number; end: number }> = [];
  const slice = text.slice(start, end);
  const pattern = /\b(message|enum)\s+[A-Za-z_][\w]*\s*{/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(slice)) !== null) {
    const openBrace = start + match.index + match[0].lastIndexOf('{');
    const closeBrace = findMatchingBrace(text, openBrace);
    if (closeBrace === -1 || closeBrace > end) {
      break;
    }
    ranges.push({ start: start + match.index, end: closeBrace + 1 });
    pattern.lastIndex = closeBrace + 1 - start;
  }

  return ranges;
}

function isInsideNestedRange(
  offset: number,
  ranges: Array<{ start: number; end: number }>
): boolean {
  return ranges.some(range => offset >= range.start && offset < range.end);
}

function findMatchingBrace(text: string, openBraceIndex: number): number {
  let depth = 0;
  for (let i = openBraceIndex; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * Produces a same-length shadow buffer with comment and string contents masked out.
 * This lets the renumbering parser ignore braces and number-like text inside those
 * regions while keeping all original offsets valid for later edits.
 *
 * Example:
 *   message Foo { option note = "}"; // comment with }
 * becomes:
 *   message Foo {
 */
function maskCommentsAndStrings(text: string): string {
  let result = '';
  let i = 0;

  while (i < text.length) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '/' && next === '/') {
      result += '  ';
      i += 2;
      while (i < text.length && text[i] !== '\n') {
        result += ' ';
        i++;
      }
      continue;
    }

    if (ch === '/' && next === '*') {
      result += '  ';
      i += 2;
      while (i < text.length) {
        const blockCh = text[i];
        const blockNext = text[i + 1];
        if (blockCh === '*' && blockNext === '/') {
          result += '  ';
          i += 2;
          break;
        }
        result += blockCh === '\n' ? '\n' : ' ';
        i++;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      const quote = ch;
      result += ' ';
      i++;
      while (i < text.length) {
        const strCh = text[i];
        if (strCh === '\\') {
          result += ' ';
          i++;
          if (i < text.length) {
            result += text[i] === '\n' ? '\n' : ' ';
            i++;
          }
          continue;
        }
        result += strCh === '\n' ? '\n' : ' ';
        i++;
        if (strCh === quote) {
          break;
        }
      }
      continue;
    }

    result += ch;
    i++;
  }

  return result;
}
