import { ITokenizerHandle, tokenize } from "protobufjs";
import * as vscode from "vscode";

class position {
  constructor(public line: number, public col: number) {}

  static from(pos: position): position {
    return Object.assign(new position(0, 0), pos);
  }
}

class token {
  constructor(public tok: string, public pos: position) {}
}

class tokenizer {
  private _pos: position = new position(0, 0);
  private _token_width: number = 0;
  private _handler: ITokenizerHandle;

  constructor(public doc: vscode.TextDocument) {
    this._handler = tokenize(doc.getText(), false);
  }

  public peek(): token | null {
    const tok = this._handler.peek();
    if (tok == null) {
      return null;
    }

    let row = this._handler.line,
      col = this._pos.col;
    if (row !== this._pos.line) {
      col = 0;
    }
    col = this.doc.lineAt(row).text.indexOf(tok, this._pos.col);
    return new token(tok, new position(row, col));
  }

  public next(): token | null {
    const tok = this._handler.next();
    if (tok === null) {
      return null;
    }

    const lineno = this._handler.line;
    if (lineno !== this._pos.line) {
      this._pos = new position(lineno, 0);
      this._token_width = 0;
    }

    // 注意 vscode 的行号是从0开始的，protobufjs 的 tokenize 返回的行号是从 1 开始的
    this._pos.col = this.doc.lineAt(lineno - 1).text.indexOf(tok, this._pos.col + this._token_width);
    this._token_width = tok.length;

    return new token(tok, position.from(this._pos));
  }

  public peek_expect(regexp: RegExp): token | null {
    const t = this.peek();
    if (t === null) {
      return null;
    }

    if (regexp.test(t.tok)) {
      return t;
    }

    return null;
  }

  public expect(regexp: RegExp): token | null {
    const t = this.next();
    if (t === null) {
      return null;
    }
    if (regexp.test(t.tok)) {
      throw new Error("unexpected token");
    }
    return t;
  }

  public get position(): position {
    return position.from(this._pos);
  }
}

class scope {
  constructor(
    public name: "message" | "enum" | "service" | "rpc" | "returns" | "rpcbody" | "",
    public sym: "(" | "{",
    public pos: position,
    public end: position = null
  ) {}
}

// check is pos inside range(begin,end)
function isContains(pos: position, begin: position, end: position) {
  // scope 起止都在同一行，光标在起止范围内
  return (
    (begin.line === end.line && begin.line === pos.line && pos.col >= begin.col && pos.col <= end.col) ||
    // scope 不在同一行，光标在起始行的起始token后
    (begin.line !== end.line && begin.line === pos.line && pos.col >= begin.col) ||
    // scope 不在同一行，光标在结束行的结束token前
    (begin.line !== end.line && end.line === pos.line && pos.col <= end.col) ||
    // scope 不在同一行，光标在起始行和结束行中间
    (begin.line !== end.line && pos.line < end.line && pos.line > begin.line)
  );
}

// 全局返回 null
// 其他情况返回 scope
export function SyntacticGuessScope(document: vscode.TextDocument, cursorPosition: vscode.Position): scope | null {
  const stack: scope[] = [];
  const tkn = new tokenizer(document);
  for (let tok = tkn.next(); tok !== null; tok = tkn.next()) {
    switch (tok.tok) {
      case "message": {
        // take next token until reach left brace
        let t = tkn.next();
        for (; t !== null && t.tok !== "{"; t = tkn.next()) {}
        stack.push(new scope("message", "{", position.from(t.pos)));

        break;
      }
      case "enum": {
        // take next token until reach left brace
        let t = tkn.next();
        for (; t !== null && t.tok !== "{"; t = tkn.next()) {}
        stack.push(new scope("enum", "{", position.from(t.pos)));
        break;
      }
      case "rpc": {
        // take next token until reach left paren
        let t = tkn.next();
        for (; t !== null && t.tok !== "("; t = tkn.next()) {}
        stack.push(new scope("rpc", "(", position.from(t.pos)));
        break;
      }
      case "returns": {
        // take next token until reach left paren
        let t = tkn.next();
        for (; t !== null && t.tok !== "("; t = tkn.next()) {}
        stack.push(new scope("returns", "(", position.from(t.pos)));
        break;
      }
      case "service": {
        // take next token until reach left brace
        let t = tkn.next();
        for (; t !== null && t.tok !== "{"; t = tkn.next()) {}
        stack.push(new scope("service", "{", position.from(t.pos)));
        break;
      }
      case "(":
        stack.push(new scope("", "(", position.from(tok.pos)));
        break;
      case "{":
        stack.push(new scope("", "{", position.from(tok.pos)));
        break;
      case "}": {
        // 匹配栈顶的符号并且是我们关注的 scope 类型 (name!=='')，此时才开始检查光标位置是不是在 scope 区间内
        const lastScope = stack[stack.length - 1];
        if (lastScope.sym === "{") {
          stack.pop();

          if (lastScope.name !== "") {
            // 光标在范围内直接返回
            // 注意 vscode 的行号是从0开始的，protobufjs 的 tokenize 返回的行号是从 1 开始的
            if (isContains(new position(cursorPosition.line + 1, cursorPosition.character), lastScope.pos, tok.pos)) {
              lastScope.end = position.from(tok.pos);
              return lastScope;
            }
          }
        } else {
          // mismatch!
          return null;
        }
        break;
      }
      case ")": {
        // 匹配栈顶的符号并且是我们关注的 scope 类型 (name!=='')，此时才开始检查光标位置是不是在 scope 区间内
        const lastScope = stack[stack.length - 1];
        if (lastScope.sym === "(") {
          stack.pop();

          if (lastScope.name !== "") {
            // 光标在范围内直接返回
            // 注意 vscode 的行号是从0开始的，protobufjs 的 tokenize 返回的行号是从 1 开始的
            const cursor = new position(cursorPosition.line + 1, cursorPosition.character);
            if (isContains(cursor, lastScope.pos, tok.pos)) {
              lastScope.end = position.from(tok.pos);
              return lastScope;
            }

            // 针对rpc 的 option
            if (lastScope.name === "returns") {
              if (tkn.peek().tok === "{") {
                const t = tkn.next();
                stack.push(new scope("rpcbody", "{", position.from(t.pos)));
              }
            }
          }
        } else {
          // mismatch!
          return null;
        }
        break;
      }
    }
  }

  while (stack.length > 0) {
    const lastScope = stack.pop();
    if (lastScope.name !== "") {
      return lastScope;
    }
  }

  return null;
}
