import {
  CancellationToken,
  DocumentSymbol,
  DocumentSymbolProvider,
  ProviderResult,
  Range,
  SymbolKind,
  TextDocument,
} from 'vscode';
import { tokenize, ITokenizerHandle } from 'protobufjs';

type ProvideSymbolsResult = ProviderResult<DocumentSymbol[]>;

const cache: Record<string, DocumentSymbol[]> = {};

export class Proto3DocumentSymbolProvider implements DocumentSymbolProvider {
  provideDocumentSymbols(doc: TextDocument, _token: CancellationToken): ProvideSymbolsResult {
    const cacheKey = `${doc.uri}__${doc.version}`;
    const prevCacheKey = `${doc.uri}__${doc.version - 1}`;

    // Retrieve tokens if previously cached
    if (cache[cacheKey]) {
      return cache[cacheKey];
    }

    // remove preceding cache entry
    if (cache[prevCacheKey]) {
      delete cache[prevCacheKey];
    }

    // Parse and build hierarchical symbols
    const symbols = this.parseDocument(doc);
    cache[cacheKey] = symbols;

    return symbols;
  }

  private parseDocument(doc: TextDocument): DocumentSymbol[] {
    const symbols: DocumentSymbol[] = [];
    const tokenizer = tokenize(doc.getText(), false);

    let tok = tokenizer.next();
    while (tok !== null) {
      switch (tok) {
        case 'message':
          const msgSymbol = this.parseMessage(doc, tokenizer);
          if (msgSymbol) symbols.push(msgSymbol);
          break;

        case 'enum':
          const enumSymbol = this.parseEnum(doc, tokenizer);
          if (enumSymbol) symbols.push(enumSymbol);
          break;

        case 'service':
          const svcSymbol = this.parseService(doc, tokenizer);
          if (svcSymbol) symbols.push(svcSymbol);
          break;
      }
      tok = tokenizer.next();
    }

    return symbols;
  }

  private parseMessage(doc: TextDocument, tokenizer: ITokenizerHandle): DocumentSymbol | null {
    const name = tokenizer.next();
    if (!name || !/^[a-zA-Z_]\w*$/.test(name)) return null;

    const startLine = tokenizer.line - 1;
    const children: DocumentSymbol[] = [];

    // Look for opening brace
    let tok = tokenizer.next();
    while (tok !== null && tok !== '{') {
      tok = tokenizer.next();
    }
    if (tok !== '{') return null;

    let braceDepth = 1;
    tok = tokenizer.next();

    while (tok !== null && braceDepth > 0) {
      if (tok === '{') {
        braceDepth++;
      } else if (tok === '}') {
        braceDepth--;
      } else if (braceDepth === 1) {
        // Only parse direct children
        switch (tok) {
          case 'message':
            const nestedMsg = this.parseMessage(doc, tokenizer);
            if (nestedMsg) children.push(nestedMsg);
            break;

          case 'enum':
            const nestedEnum = this.parseEnum(doc, tokenizer);
            if (nestedEnum) children.push(nestedEnum);
            break;

          case 'oneof':
            const oneofSymbol = this.parseOneof(doc, tokenizer);
            if (oneofSymbol) children.push(oneofSymbol);
            break;

          case 'optional':
          case 'repeated':
          case 'required':
            const fieldWithModifier = this.parseField(doc, tokenizer, tok);
            if (fieldWithModifier) children.push(fieldWithModifier);
            break;

          case 'map':
            const mapField = this.parseMapField(doc, tokenizer);
            if (mapField) children.push(mapField);
            break;

          default:
            // Could be a field type
            if (/^[a-zA-Z_.][\w.]*$/.test(tok)) {
              const field = this.parseField(doc, tokenizer, tok);
              if (field) children.push(field);
            }
            break;
        }
      }

      if (braceDepth > 0) {
        tok = tokenizer.next();
      }
    }

    const endLine = tokenizer.line - 1;
    const range = new Range(startLine, 0, endLine, doc.lineAt(endLine).text.length);
    const selectionRange = new Range(startLine, 0, startLine, name.length);

    const symbol = new DocumentSymbol(name, '', SymbolKind.Struct, range, selectionRange);
    symbol.children = children;
    return symbol;
  }

  private parseEnum(doc: TextDocument, tokenizer: ITokenizerHandle): DocumentSymbol | null {
    const name = tokenizer.next();
    if (!name || !/^[a-zA-Z_]\w*$/.test(name)) return null;

    const startLine = tokenizer.line - 1;
    const children: DocumentSymbol[] = [];

    // Look for opening brace
    let tok = tokenizer.next();
    while (tok !== null && tok !== '{') {
      tok = tokenizer.next();
    }
    if (tok !== '{') return null;

    tok = tokenizer.next();
    while (tok !== null && tok !== '}') {
      // Enum value: NAME = NUMBER
      if (/^[a-zA-Z_]\w*$/.test(tok)) {
        const valueName = tok;
        const valueLine = tokenizer.line - 1;
        const lineText = doc.lineAt(valueLine).text;

        // Skip to semicolon
        let next = tokenizer.next();
        while (next !== null && next !== ';' && next !== '}') {
          next = tokenizer.next();
        }

        const valueRange = new Range(valueLine, 0, valueLine, lineText.length);
        const valueSelectionRange = new Range(valueLine, 0, valueLine, valueName.length);
        children.push(
          new DocumentSymbol(valueName, '', SymbolKind.EnumMember, valueRange, valueSelectionRange)
        );

        if (next === '}') break;
      }
      tok = tokenizer.next();
    }

    const endLine = tokenizer.line - 1;
    const range = new Range(startLine, 0, endLine, doc.lineAt(endLine).text.length);
    const selectionRange = new Range(startLine, 0, startLine, name.length);

    const symbol = new DocumentSymbol(name, '', SymbolKind.Enum, range, selectionRange);
    symbol.children = children;
    return symbol;
  }

  private parseService(doc: TextDocument, tokenizer: ITokenizerHandle): DocumentSymbol | null {
    const name = tokenizer.next();
    if (!name || !/^[a-zA-Z_]\w*$/.test(name)) return null;

    const startLine = tokenizer.line - 1;
    const children: DocumentSymbol[] = [];

    // Look for opening brace
    let tok = tokenizer.next();
    while (tok !== null && tok !== '{') {
      tok = tokenizer.next();
    }
    if (tok !== '{') return null;

    tok = tokenizer.next();
    while (tok !== null && tok !== '}') {
      if (tok === 'rpc') {
        const rpcSymbol = this.parseRpc(doc, tokenizer);
        if (rpcSymbol) children.push(rpcSymbol);
      }
      tok = tokenizer.next();
    }

    const endLine = tokenizer.line - 1;
    const range = new Range(startLine, 0, endLine, doc.lineAt(endLine).text.length);
    const selectionRange = new Range(startLine, 0, startLine, name.length);

    const symbol = new DocumentSymbol(name, '', SymbolKind.Class, range, selectionRange);
    symbol.children = children;
    return symbol;
  }

  private parseRpc(doc: TextDocument, tokenizer: ITokenizerHandle): DocumentSymbol | null {
    const name = tokenizer.next();
    if (!name || !/^[a-zA-Z_]\w*$/.test(name)) return null;

    const startLine = tokenizer.line - 1;

    // Skip to end of rpc declaration (either ; or })
    let tok = tokenizer.next();
    let braceDepth = 0;
    while (tok !== null) {
      if (tok === '{') {
        braceDepth++;
      } else if (tok === '}') {
        if (braceDepth === 0) break;
        braceDepth--;
        if (braceDepth === 0) break;
      } else if (tok === ';' && braceDepth === 0) {
        break;
      }
      tok = tokenizer.next();
    }

    const endLine = tokenizer.line - 1;
    const range = new Range(startLine, 0, endLine, doc.lineAt(endLine).text.length);
    const selectionRange = new Range(startLine, 0, startLine, name.length);

    return new DocumentSymbol(name, '', SymbolKind.Method, range, selectionRange);
  }

  private parseOneof(doc: TextDocument, tokenizer: ITokenizerHandle): DocumentSymbol | null {
    const name = tokenizer.next();
    if (!name || !/^[a-zA-Z_]\w*$/.test(name)) return null;

    const startLine = tokenizer.line - 1;
    const children: DocumentSymbol[] = [];

    // Look for opening brace
    let tok = tokenizer.next();
    while (tok !== null && tok !== '{') {
      tok = tokenizer.next();
    }
    if (tok !== '{') return null;

    tok = tokenizer.next();
    while (tok !== null && tok !== '}') {
      // Parse oneof fields
      if (/^[a-zA-Z_.][\w.]*$/.test(tok)) {
        const field = this.parseField(doc, tokenizer, tok);
        if (field) children.push(field);
      }
      tok = tokenizer.next();
    }

    const endLine = tokenizer.line - 1;
    const range = new Range(startLine, 0, endLine, doc.lineAt(endLine).text.length);
    const selectionRange = new Range(startLine, 0, startLine, name.length);

    const symbol = new DocumentSymbol(name, '', SymbolKind.Struct, range, selectionRange);
    symbol.children = children;
    return symbol;
  }

  private parseField(
    doc: TextDocument,
    tokenizer: ITokenizerHandle,
    firstToken: string
  ): DocumentSymbol | null {
    let typeName = firstToken;
    const fieldLine = tokenizer.line - 1;

    // Handle modifiers
    if (firstToken === 'optional' || firstToken === 'repeated' || firstToken === 'required') {
      const type = tokenizer.next();
      if (!type) return null;
      typeName = type;
    }

    // Get field name
    const fieldName = tokenizer.next();
    if (!fieldName || !/^[a-zA-Z_]\w*$/.test(fieldName)) return null;

    // Skip to semicolon
    let tok = tokenizer.next();
    while (tok !== null && tok !== ';') {
      tok = tokenizer.next();
    }

    const lineText = doc.lineAt(fieldLine).text;
    const range = new Range(fieldLine, 0, fieldLine, lineText.length);
    const selectionRange = new Range(fieldLine, 0, fieldLine, fieldName.length);

    return new DocumentSymbol(fieldName, typeName, SymbolKind.Field, range, selectionRange);
  }

  private parseMapField(doc: TextDocument, tokenizer: ITokenizerHandle): DocumentSymbol | null {
    const fieldLine = tokenizer.line - 1;

    // Skip map<key, value>
    let tok = tokenizer.next();
    while (tok !== null && tok !== '>') {
      tok = tokenizer.next();
    }
    if (!tok) return null;

    // Get field name
    const fieldName = tokenizer.next();
    if (!fieldName || !/^[a-zA-Z_]\w*$/.test(fieldName)) return null;

    // Skip to semicolon
    tok = tokenizer.next();
    while (tok !== null && tok !== ';') {
      tok = tokenizer.next();
    }

    const lineText = doc.lineAt(fieldLine).text;
    const range = new Range(fieldLine, 0, fieldLine, lineText.length);
    const selectionRange = new Range(fieldLine, 0, fieldLine, fieldName.length);

    return new DocumentSymbol(fieldName, 'map', SymbolKind.Field, range, selectionRange);
  }
}
