'use strict';

import vscode = require('vscode');
import path = require('path');
import { Proto3Compiler } from './proto3Compiler';

export class Proto3LanguageDiagnosticProvider {
  private errors = vscode.languages.createDiagnosticCollection('languageErrors');

  public createDiagnostics(doc: vscode.TextDocument, compiler: Proto3Compiler) {
    compiler.compileProtoToTmp(doc.fileName, stderr => {
      if (stderr) {
        this.analyzeErrors(stderr, doc);
      } else {
        this.errors.delete(doc.uri);
      }
    });
  }

  private analyzeErrors(stderr: string, doc: vscode.TextDocument) {
    const shortFileName = path.parse(doc.fileName).name;
    const diagnostics = stderr
      .split('\n')
      .filter(line => line.includes(shortFileName))
      .map(line => this.parseErrorLine(line, doc))
      .filter((diagnostic): diagnostic is vscode.Diagnostic => diagnostic !== null);

    this.errors.set(doc.uri, diagnostics);
  }

  private parseErrorLine(errline: string, doc: vscode.TextDocument): vscode.Diagnostic | null {
    const errorInfo = errline.match(/\w+\.proto:(\d+):(\d+):\s*(.*)/);
    if (!errorInfo) {
      return null;
    }
    const startLine = parseInt(errorInfo[1]) - 1;
    const startCol = parseInt(errorInfo[2]) - 1;

    // protoc calculates tab width (eight spaces) and returns colunm number.
    const line = doc.lineAt(startLine);
    let startChar = 0;
    let col = 0;
    for (const c of line.text) {
      col += c === '\t' ? 8 - (col % 8) : 1;
      startChar += 1;
      if (col >= startCol) {
        break;
      }
    }
    let endChar = line.text.length;
    const tokenEnd = line.text.substring(startChar).match(/[\s;{}\[\],<>()=]/);
    if (tokenEnd && tokenEnd.index !== undefined) {
      endChar = startChar + tokenEnd.index;
    }
    const range = new vscode.Range(startLine, startChar, startLine, endChar);
    const msg = errorInfo[3];
    return new vscode.Diagnostic(range, msg, vscode.DiagnosticSeverity.Error);
  }
}
