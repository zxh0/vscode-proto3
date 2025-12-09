import {
  CancellationToken,
  DocumentSymbol,
  DocumentSymbolProvider,
  Location,
  Position,
  ProviderResult,
  SymbolInformation,
  SymbolKind,
  TextDocument,
} from 'vscode';
import { tokenize } from 'protobufjs';

type ProvideSymbolsResult = ProviderResult<SymbolInformation[] | DocumentSymbol[]>;

const cache: Record<string, SymbolInformation[]> = {};

export class Proto3DocumentSymbolProvider implements DocumentSymbolProvider {
  provideDocumentSymbols(doc: TextDocument, _token: CancellationToken): ProvideSymbolsResult {
    const ret: SymbolInformation[] = [];
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

    // create cache entry
    const tokenizer = tokenize(doc.getText(), false);
    let state: 'free' | 'rpc' | 'message' | 'service' = 'free';
    for (let tok = tokenizer.next(); tok !== null; tok = tokenizer.next()) {
      switch (tok) {
        case 'message':
          state = 'message';
          break;

        case 'rpc':
          state = 'rpc';
          break;

        case 'service':
          state = 'service';
          break;

        default:
          if (state === 'free') {
            continue;
          }

          if (!/^[a-zA-Z_]+\w*/.test(tok)) {
            // identifier expected but found other token
            state = 'free';
            continue;
          }

          const location = new Location(doc.uri, new Position(tokenizer.line - 1, 0));
          let kind = SymbolKind.Struct;
          switch (state) {
            case 'message':
              kind = SymbolKind.Struct;
              break;
            case 'rpc':
              kind = SymbolKind.Method;
              break;
            case 'service':
              kind = SymbolKind.Class;
              break;
          }
          ret.push(new SymbolInformation(tok, kind, '', location));
          state = 'free';
          break;
      }
    }

    cache[cacheKey] = ret;

    return ret;
  }
}
