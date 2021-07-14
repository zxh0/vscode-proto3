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

export class Proto3DocumentSymbolProvider implements DocumentSymbolProvider {
  constructor(private state: "free" | "rpc" | "message" | 'service' = "free") { }

  provideDocumentSymbols(doc: TextDocument, token: CancellationToken): ProvideSymbolsResult {
    const ret: SymbolInformation[] = [];

    const tokenizer = tokenize(doc.getText(), false);
    for (let tok = tokenizer.next(); tok !== null; tok = tokenizer.next()) {
      switch (tok) {
        case "message":
          this.state = "message";
          break;

        case "rpc":
          this.state = "rpc";
          break;

        case 'service':
          this.state = 'service';
          break;

        default:
          if (this.state === "free") {
            continue;
          }

          if (!/^[a-zA-Z_]+\w*/.test(tok)) {
            // identifier expected but found other token
            this.state = "free";
            continue;
          }

          const location = new Location(doc.uri, new Position(tokenizer.line - 1, 0));
          let kind = SymbolKind.Struct;
          switch (this.state) {
            case 'message':
              kind = SymbolKind.Struct;
              break;
            case 'rpc':
              kind = SymbolKind.Method;
              break
            case 'service':
              kind = SymbolKind.Class;
              break;
          }
          ret.push(new SymbolInformation(tok, kind, "", location));
          this.state = "free";
          break;
      }
    }

    return ret;
  }
}
