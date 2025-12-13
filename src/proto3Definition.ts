'use strict';

import fs = require('fs');
import path = require('path');
import vscode = require('vscode');
import fg = require('fast-glob');
import { guessScope, Proto3ScopeKind } from './proto3ScopeGuesser';
import { Proto3Import } from './proto3Import';
import { Proto3Primitive } from './proto3Primitive';

export class Proto3DefinitionProvider implements vscode.DefinitionProvider {
  public async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ): Promise<vscode.Definition | undefined> {
    const scope = guessScope(document, position.line);
    if (scope.kind === Proto3ScopeKind.Comment) {
      return undefined;
    }

    const targetRange = document.getWordRangeAtPosition(position) as vscode.Range;
    const targetDefinition = document.getText(targetRange);

    if (Proto3Primitive.isTypePrimitive(targetDefinition)) {
      return undefined;
    }

    const lineText = document.lineAt(position).text;

    const importRegExp = new RegExp(
      `^\\s*import\\s+(\'|")((\\w+\/)*${targetDefinition})(\'|")\\s*;.*$`,
      'i'
    );
    const matchedGroups = importRegExp.exec(lineText);
    if (matchedGroups && matchedGroups.length == 5) {
      const importFilePath = matchedGroups[2];
      const location = await this.findImportDefinition(importFilePath);
      if (location) {
        return location;
      }
      // Show subtle status bar message for missing reference
      vscode.window.setStatusBarMessage(`Could not find ${targetDefinition} definition`, 3000);
    }
    const messageOrEnumPattern = `\\s*(\\w+\\.)*\\w+\\s*`;
    const messageFieldPattern = `\\s+\\w+\\s*=\\s*\\d+;.*`;
    const rpcReqOrRspPattern = `\\s*\\(\\s*(stream\\s+)?${messageOrEnumPattern}\\s*\\)\\s*`;

    const messageRegExp = new RegExp(
      `^\\s*(optional|repeated)?\\s*(${messageOrEnumPattern})${messageFieldPattern}$`,
      'i'
    );
    const messageInMap = new RegExp(
      `^\\s*map\\s*<${messageOrEnumPattern},${messageOrEnumPattern}>${messageFieldPattern}$`,
      'i'
    );
    const messageInRpcRegExp = new RegExp(
      `^\\s*rpc\\s*\\w+${rpcReqOrRspPattern}returns${rpcReqOrRspPattern}[;{].*$`,
      'i'
    );

    if (
      messageRegExp.test(lineText) ||
      messageInRpcRegExp.test(lineText) ||
      messageInMap.test(lineText)
    ) {
      const location = await this.findEnumOrMessageDefinition(document, targetDefinition);
      if (location) {
        return location;
      }
      // Show subtle status bar message for missing reference
      vscode.window.setStatusBarMessage(`Could not find ${targetDefinition} definition`, 3000);
    }

    return undefined;
  }

  private async findEnumOrMessageDefinition(
    document: vscode.TextDocument,
    target: string
  ): Promise<vscode.Location | undefined> {
    const searchPaths = Proto3Import.getImportedFilePathsOnDocument(document);

    const files = [document.uri.fsPath, ...(await fg(searchPaths))];

    // Also search in proto paths for any files that might not be directly imported
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
    const { Proto3Configuration } = await import('./proto3Configuration');
    const config = Proto3Configuration.Instance(workspaceFolder);
    const protoPaths = config.getAllProtoPathsForImport();

    for (const protoPath of protoPaths) {
      const pathFiles = await fg(path.join(protoPath, '**', '*.proto'));
      files.push(...pathFiles);
    }

    const uniqueFiles = Array.from(new Set(files));
    for (const file of uniqueFiles) {
      const data = fs.readFileSync(file.toString());
      const lines = data.toString().split('\n');
      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex];
        const messageDefinitionRegexMatch = new RegExp(`\\s*(message|enum)\\s*${target}\\s*{`).exec(
          line
        );
        if (messageDefinitionRegexMatch && messageDefinitionRegexMatch.length) {
          const uri = vscode.Uri.file(file.toString());
          const range = this.getTargetLocationInline(
            lineIndex,
            line,
            target,
            messageDefinitionRegexMatch
          );
          return new vscode.Location(uri, range);
        }
      }
    }
    return undefined;
  }

  private async findImportDefinition(importFileName: string): Promise<vscode.Location | undefined> {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
      return undefined;
    }

    const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
    const { Proto3Configuration } = await import('./proto3Configuration');
    const config = Proto3Configuration.Instance(workspaceFolder);
    const protoPaths = config.getAllProtoPathsForImport();

    // Search in all configured proto paths
    for (const protoPath of protoPaths) {
      const searchPattern = path.join(protoPath, '**', importFileName);
      const files = await fg(searchPattern);
      if (files.length > 0) {
        const importPath = files[0].toString();
        const uri = vscode.Uri.file(importPath);
        const definitionStartPosition = new vscode.Position(0, 0);
        const definitionEndPosition = new vscode.Position(0, 0);
        const range = new vscode.Range(definitionStartPosition, definitionEndPosition);
        return new vscode.Location(uri, range);
      }
    }

    return undefined;
  }

  private getTargetLocationInline(
    lineIndex: number,
    line: string,
    target: string,
    definitionRegexMatch: RegExpExecArray
  ): vscode.Range {
    const matchedStr = definitionRegexMatch[0];
    const index = line.indexOf(matchedStr) + matchedStr.indexOf(target);
    const definitionStartPosition = new vscode.Position(lineIndex, index);
    const definitionEndPosition = new vscode.Position(lineIndex, index + target.length);
    return new vscode.Range(definitionStartPosition, definitionEndPosition);
  }
}
