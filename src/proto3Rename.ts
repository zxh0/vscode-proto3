'use strict';

import path = require('path');
import vscode = require('vscode');
import fg = require('fast-glob');

export class Proto3RenameProvider implements vscode.RenameProvider {
  provideRenameEdits(
    document: vscode.TextDocument,
    position: vscode.Position,
    newName: string,
    _token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.WorkspaceEdit> {
    const wordRange = document.getWordRangeAtPosition(position);
    const word = document.getText(wordRange);
    const edits = new vscode.WorkspaceEdit();
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      let match: RegExpExecArray | null;
      while ((match = regex.exec(line.text)) !== null) {
        const start = new vscode.Position(i, match.index);
        const end = new vscode.Position(i, match.index + match[0].length);
        const range = new vscode.Range(start, end);
        edits.replace(document.uri, range, newName);
      }
      regex.lastIndex = 0; // Reset for next line
    }

    // update files that import this file
    this.updateChildren(document, regex, edits, newName);

    // update the file that is imported by this file
    this.updateParents(document, regex, edits, newName);

    return edits;
  }

  private updateParents(
    document: vscode.TextDocument,
    regex: RegExp,
    edits: vscode.WorkspaceEdit,
    newName: string
  ) {
    const importFileRegex = new RegExp(`import\\s+"(.+)"`);
    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      const match = importFileRegex.exec(line.text);
      if (match) {
        const importFile = match[1];
        const importFileUri = vscode.Uri.file(
          path.join(path.dirname(document.uri.fsPath), importFile)
        );
        const importFileDocument = vscode.workspace.textDocuments.find(
          doc => doc.uri.fsPath === importFileUri.fsPath
        );
        if (importFileDocument) {
          for (let j = 0; j < importFileDocument.lineCount; j++) {
            const line = importFileDocument.lineAt(j);
            let match: RegExpExecArray | null;
            while ((match = regex.exec(line.text)) !== null) {
              const start = new vscode.Position(j, match.index);
              const end = new vscode.Position(j, match.index + match[0].length);
              const range = new vscode.Range(start, end);
              edits.replace(importFileUri, range, newName);
            }
            regex.lastIndex = 0; // Reset for next line
          }
        }
      }
    }
  }

  private updateChildren(
    document: vscode.TextDocument,
    regex: RegExp,
    edits: vscode.WorkspaceEdit,
    newName: string
  ) {
    const importRegex = new RegExp(`import\\s+"${path.basename(document.uri.fsPath)}"`);
    const files = fg.sync('**/*.proto', {
      cwd: path.dirname(document.uri.fsPath),
    });
    for (const file of files) {
      if (file === path.basename(document.uri.fsPath)) {
        continue;
      }

      const fileUri = vscode.Uri.file(path.join(path.dirname(document.uri.fsPath), file));
      const fileDocument = vscode.workspace.textDocuments.find(
        doc => doc.uri.fsPath === fileUri.fsPath
      );
      if (fileDocument) {
        let startLineIdx = 0;
        for (let i = 0; i < fileDocument.lineCount; i++) {
          const line = fileDocument.lineAt(i);
          const match = importRegex.exec(line.text);
          if (match) {
            startLineIdx = i;
          }
        }

        if (startLineIdx > 0) {
          for (let i = startLineIdx; i < fileDocument.lineCount; i++) {
            const line = fileDocument.lineAt(i);
            let match: RegExpExecArray | null;
            while ((match = regex.exec(line.text)) !== null) {
              const start = new vscode.Position(i, match.index);
              const end = new vscode.Position(i, match.index + match[0].length);
              const range = new vscode.Range(start, end);
              edits.replace(fileUri, range, newName);
            }
            regex.lastIndex = 0; // Reset for next line
          }
        }
      }
    }
  }
}
