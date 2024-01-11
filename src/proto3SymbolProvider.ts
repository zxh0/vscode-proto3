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
} from "vscode";
import { tokenize } from "protobufjs";

type ProvideSymbolsResult = ProviderResult<SymbolInformation[] | DocumentSymbol[]>;

const cache = {}

export class Proto3DocumentSymbolProvider implements DocumentSymbolProvider {
  provideDocumentSymbols(doc: TextDocument, token: CancellationToken): ProvideSymbolsResult {
    const ret: SymbolInformation[] = [];

    // Retrieve tokens if previously cached
    if (cache[doc.uri+'__'+doc.version]) {
      return cache[doc.uri+'__'+doc.version]
    }

    // remove preceding cache entry
    if (cache[doc.uri+'__'+(doc.version - 1)]) {
      delete cache[doc.uri+'__'+(doc.version - 1)]
    }

    // create cache entry
    const tokenizer = tokenize(doc.getText(), false);
    let state: "free" | "rpc" | "message" | "service" | "enum" = "free"
    for (let tok = tokenizer.next(); tok !== null; tok = tokenizer.next()) {
      switch (tok) {
        case "message":
        case "rpc":
        case "service":
        case "enum":
          state = tok;
          break;

        default:
          if (state === "free") {
            continue;
          }

          if (!/^[a-zA-Z_]+\w*/.test(tok)) {
            // identifier expected but found other token
            state = "free";
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
              break
            case 'service':
              kind = SymbolKind.Class;
              break;
            case 'enum':
              kind = SymbolKind.Enum;
              break;
          }
          ret.push(new SymbolInformation(tok, kind, "", location));
          state = "free";
          break;
      }
    }

    cache[doc.uri+'__'+doc.version] = ret

    return ret;
  }
}
