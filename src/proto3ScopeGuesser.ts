'use strict';

import vscode = require('vscode');
import { parse } from './proto3JSCC';

interface ScopeJSCC {
    startOffset: number;
    endOffset: number;
    kind: number;
}

interface ParseResultJSCC {
    syntax: number;
    scopes: ScopeJSCC[];
}

export enum Proto3ScopeKind {
    //Comment,
    Proto,
    Message,
    Enum,
    Service,
}

export class Proto3Scope {

    syntax: number; // 2 or 3
    kind: Proto3ScopeKind;
    offset: number;

    constructor(kind: Proto3ScopeKind, offset: number) {
        this.kind = kind;
        this.offset = offset;
    }

}

export function guessScope(text: string, cursorOffset: number): Proto3Scope {
    let scopeAtCursor = new Proto3Scope(Proto3ScopeKind.Proto, 0);

    let parseResult: ParseResultJSCC = parse(text);
    parseResult.scopes.forEach(scope => {
        if (scope.startOffset > scopeAtCursor.offset) {
            if (scope.startOffset <= cursorOffset && cursorOffset <= scope.endOffset) {
                scopeAtCursor = new Proto3Scope(scope.kind, scope.startOffset);;
            }
        }
    });
    
    scopeAtCursor.syntax = parseResult.syntax;
    return scopeAtCursor
}
