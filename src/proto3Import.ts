'use strict';

import path = require('path');
import vscode = require('vscode');

export module Proto3Import {
  export const importStatementRegex = new RegExp(/^\s*import\s+('|")(.+\.proto)('|")\s*;\s*$/gim);

  export const getImportedFilePathsOnDocument = (document: vscode.TextDocument) => {
    const fullDocument = document.getText();
    let importStatement: RegExpExecArray | null;
    const importPaths: string[] = [];
    const rootPath = vscode.workspace.rootPath ?? '';
    while ((importStatement = importStatementRegex.exec(fullDocument))) {
      const protoFileName = importStatement[2];
      const searchPath = path.join(rootPath, '**', protoFileName);
      importPaths.push(searchPath);
    }
    return importPaths;
  };
}
