'use strict';

import fs = require('fs');
import path = require('path');
import vscode = require('vscode');
import fg = require('fast-glob');
import { guessScope, Proto3ScopeKind } from './proto3ScopeGuesser';
import { Proto3Import } from './proto3Import';
import { Proto3Primitive } from './proto3Primitive';

export class Proto3DefinitionProvider implements vscode.DefinitionProvider {

    public async provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Definition> {

        const scope = guessScope(document, position.line);
        if (scope.kind === Proto3ScopeKind.Comment) {
            return;
        }

        const targetRange = document.getWordRangeAtPosition(position) as vscode.Range;
        const targetDefinition = document.getText(targetRange);

        if (Proto3Primitive.isTypePrimitive(targetDefinition)) {
            return;
        }

        const line = document.lineAt(position);

        const isLookingForImportDefinition = new RegExp(`^\\s*import\\s+(\'|")${targetDefinition}(\'|")\\s*;\\s*$`, 'i').test(line.text);
        if (isLookingForImportDefinition) {
            const location = this.findImportDefinition(targetDefinition);
            if (location) {
                return location;
            }
            vscode.window.showErrorMessage(`Could not find ${targetDefinition} definition.`)
        }

        const isLookingForEnumOrMessageDefinition = new RegExp(`^\\s*(repeated){0,1}\\s*${targetDefinition}\\s+.*=\\s+\\d*;\\s*$`).test(line.text);
        if (isLookingForEnumOrMessageDefinition) {
            const location = this.findEnumOrMessageDefinition(document, targetDefinition);
            if (location) {
                return location;
            }
            vscode.window.showErrorMessage(`Could not find ${targetDefinition} definition.`)
        }

        return undefined;
    }

    private async findEnumOrMessageDefinition(document: vscode.TextDocument, target: string): Promise<vscode.Location> {

        const searchPaths = Proto3Import.getImportedFilePathsOnDocument(document);

        const files = [
            document.uri.fsPath,
            ...(await fg.async(searchPaths))
        ];

        for (const file of files) {
            const data = fs.readFileSync(file.toString());
            const lines = data.toString().split('\n');
            for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
                const line = lines[lineIndex];
                const messageDefinitionRegexMatch = new RegExp(`\\s*(message|enum)\\s*${target}\\s*{`).exec(line);
                if (messageDefinitionRegexMatch && messageDefinitionRegexMatch.length) {
                    const uri = vscode.Uri.file(file.toString());
                    const definitionStartPosition = new vscode.Position(lineIndex, messageDefinitionRegexMatch.index);
                    const definitionEndPosition = new vscode.Position(lineIndex, messageDefinitionRegexMatch.index + target.length);
                    const range = new vscode.Range(definitionStartPosition, definitionEndPosition);
                    return new vscode.Location(uri, range);
                }
            }
        }
    }

    private async findImportDefinition(importFileName: string): Promise<vscode.Location> {
        const files = await fg.async(path.join(vscode.workspace.rootPath, '**', importFileName));
        const importPath = files[0].toString();
        // const data = fs.readFileSync(importPath);
        // const lines = data.toString().split('\n');
        // const lastLine = lines[lines.length  - 1];
        const uri = vscode.Uri.file(importPath);
        const definitionStartPosition = new vscode.Position(0, 0);
        const definitionEndPosition = new vscode.Position(0, 0);
        const range = new vscode.Range(definitionStartPosition, definitionEndPosition);
        return new vscode.Location(uri, range);
    }

}

