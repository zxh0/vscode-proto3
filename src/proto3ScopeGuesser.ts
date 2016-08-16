'use strict';

import vscode = require('vscode');

export function guessScope(doc: vscode.TextDocument, cursorLineNum: number): Proto3Scope {
    return new ScopeGuesser().guess(doc, cursorLineNum);
}

export enum Proto3ScopeKind {
    Proto,
    Message,
    Enum,
}

export class Proto3Scope {
    kind: Proto3ScopeKind;
    parent: Proto3Scope;
    children: Proto3Scope[];
    lineFrom: number;
    lineTo: number;

    constructor(kind: Proto3ScopeKind, lineFrom: number) {
        this.kind = kind;
        this.children = [];
        this.lineFrom = lineFrom;
    }

    addChild(child: Proto3Scope) {
        this.children.push(child);
        child.parent = this;
    }
}

const MSG_BEGIN = /\s*message\s*(\w+)\s*\{.*/
const ENUM_BEGIN = /\s*enum\s*(\w+)\s*\{.*/
const SCOPE_END = /\s*\}.*/

class ScopeGuesser {

    private currentScope: Proto3Scope;
    private scopeAtCursor: Proto3Scope;
    private cursorLineNum: number;

    guess(doc: vscode.TextDocument, cursorLineNum: number): Proto3Scope {
        this.cursorLineNum = cursorLineNum;
        this.enterScope(Proto3ScopeKind.Proto, 0);
        for (var i = 0; i < doc.lineCount; i++) {
            var line = doc.lineAt(i);
            if (line.isEmptyOrWhitespace) {
                continue;
            }
            //let text = line.text.replace(/\s*\/\/.*/, "");
            if (line.text.match(SCOPE_END)) {
                this.exitScope(i);
            } else if (line.text.match(MSG_BEGIN)) {
                this.enterScope(Proto3ScopeKind.Message, i);
            } else if (line.text.match(ENUM_BEGIN)) {
                this.enterScope(Proto3ScopeKind.Enum, i);
            }
        }
        this.exitScope(doc.lineCount);
        return this.scopeAtCursor;
    }

    private enterScope(kind: Proto3ScopeKind, lineNum: number) {
        let newScope = new Proto3Scope(kind, lineNum);
        if (this.currentScope) {
            this.currentScope.addChild(newScope);
        }
        this.currentScope = newScope;
    }

    private exitScope(lineNum: number) {
        this.currentScope.lineTo = lineNum;
        if (!this.scopeAtCursor) {
            if (this.currentScope.lineFrom <= this.cursorLineNum
                && this.currentScope.lineTo >= this.cursorLineNum) {

                    this.scopeAtCursor = this.currentScope;
            }
        }
        if (this.currentScope.parent) {
            this.currentScope = this.currentScope.parent;
        }
    }
    
}
