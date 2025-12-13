'use strict';

import path = require('path');
import vscode = require('vscode');
import { Proto3Configuration } from './proto3Configuration';

export module Proto3Import {
  export const importStatementRegex = new RegExp(/^\s*import\s+('|")(.+\.proto)('|")\s*;\s*$/gim);

  export const getImportedFilePathsOnDocument = (document: vscode.TextDocument) => {
    const fullDocument = document.getText();
    let importStatement: RegExpExecArray | null;
    const importPaths: string[] = [];

    // Get all proto paths from configuration
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    const config = Proto3Configuration.Instance(workspaceFolder);
    const protoPaths = config.getAllProtoPathsForImport();

    while ((importStatement = importStatementRegex.exec(fullDocument))) {
      const protoFileName = importStatement[2];

      // Create search paths for all configured proto paths
      for (const protoPath of protoPaths) {
        const searchPath = path.join(protoPath, '**', protoFileName);
        importPaths.push(searchPath);
      }

      // Also support the original workspace root search for backward compatibility
      const rootPath = vscode.workspace.rootPath ?? '';
      if (rootPath && !protoPaths.includes(rootPath)) {
        const searchPath = path.join(rootPath, '**', protoFileName);
        importPaths.push(searchPath);
      }
    }
    return importPaths;
  };

  export const findImportFile = (protoFileName: string, workspaceFolder?: vscode.WorkspaceFolder): string | undefined => {
    const config = Proto3Configuration.Instance(workspaceFolder);
    const protoPaths = config.getAllProtoPathsForImport();

    // Search in all configured proto paths
    for (const protoPath of protoPaths) {
      const fullPath = path.join(protoPath, protoFileName);
      if (require('fs').existsSync(fullPath)) {
        return fullPath;
      }
    }

    return undefined;
  };
}
