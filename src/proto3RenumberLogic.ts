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

export function findEnclosingBlock(text: string, offset: number): ProtoBlock | undefined {
    const message = locateBlock(text, offset, 'message');
    const enumeration = locateBlock(text, offset, 'enum');

    if (message && enumeration) {
        return message.keywordStart > enumeration.keywordStart ? message : enumeration;
    }
    return message ?? enumeration ?? undefined;
}

export function findAllBlocks(text: string): ProtoBlock[] {
    const blocks: ProtoBlock[] = [];
    const pattern = /\b(message|enum)\s+[A-Za-z_][\w]*\s*{/g;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text)) !== null) {
        const openBrace = match.index + match[0].lastIndexOf('{');
        if (openBrace === -1) {
            continue;
        }
        const closeBrace = findMatchingBrace(text, openBrace);
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

export function computeDocumentRenumberEdits(text: string): NumericEdit[] {
    const edits: NumericEdit[] = [];
    findAllBlocks(text).forEach(block => {
        const blockEdits = block.type === 'enum'
            ? computeEnumEdits(text, block)
            : computeMessageEdits(text, block);
        edits.push(...blockEdits);
    });
    return edits.sort((a, b) => a.start - b.start);
}

export function computeMessageEdits(text: string, block: ProtoBlock): NumericEdit[] {
    if (block.type !== 'message') {
        return [];
    }

    const edits: NumericEdit[] = [];
    const bodyStart = block.openBrace + 1;
    const bodyEnd = block.closeBrace;
    const body = text.slice(bodyStart, bodyEnd);
    const nested = collectNestedTypeRanges(text, bodyStart, bodyEnd);
    const pattern = /^\s*(?:(?:repeated|optional|required)\s+)?(?:map<[^>]+>|[.A-Za-z_][\w<>.]*)\s+[A-Za-z_][\w]*\s*=\s*(\d+)/gm;
    let nextId = 1;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(body)) !== null) {
        const digitsRelative = match[0].indexOf(match[1]);
        const digitsStart = bodyStart + match.index + digitsRelative;
        const digitsEnd = digitsStart + match[1].length;

        if (isInsideNestedRange(digitsStart, nested)) {
            continue;
        }

        const replacement = String(nextId);
        if (replacement !== match[1]) {
            edits.push({ start: digitsStart, end: digitsEnd, replacement });
        }
        nextId++;
    }

    return edits;
}

export function computeEnumEdits(text: string, block: ProtoBlock): NumericEdit[] {
    if (block.type !== 'enum') {
        return [];
    }

    const edits: NumericEdit[] = [];
    const bodyStart = block.openBrace + 1;
    const bodyEnd = block.closeBrace;
    const body = text.slice(bodyStart, bodyEnd);
    const pattern = /^\s*[A-Za-z_][\w]*\s*=\s*(-?\d+)/gm;
    let nextId = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(body)) !== null) {
        const digitsRelative = match[0].indexOf(match[1]);
        const digitsStart = bodyStart + match.index + digitsRelative;
        const digitsEnd = digitsStart + match[1].length;
        const replacement = String(nextId);

        if (replacement !== match[1]) {
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
        const openBrace = text.indexOf('{', match.index);
        if (openBrace === -1) {
            continue;
        }
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

function collectNestedTypeRanges(text: string, start: number, end: number): Array<{ start: number; end: number }> {
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

function isInsideNestedRange(offset: number, ranges: Array<{ start: number; end: number }>): boolean {
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
