'use strict';

import vscode = require('vscode');
import path = require('path');
import { Proto3Compiler } from './proto3Compiler';

export class Proto3LanguageDiagnosticProvider {

    private errors = vscode.languages.createDiagnosticCollection("languageErrors");

    public createDiagnostics(docUri: vscode.Uri, fileName: string) {
        new Proto3Compiler().compileProtoToTmp(fileName, stderr => {
            if (stderr) {
                this.analyzeErrors(docUri, fileName, stderr);
            } else {
                this.errors.delete(docUri);
            }
        })
    }
    
    private analyzeErrors(docUrl: vscode.Uri, fileName: string, stderr: string) {
        let shortFileName = path.parse(fileName).name;
        let diagnostics = stderr.split('\n')
            .filter(line => line.includes(shortFileName))
            .map(line => this.parseErrorLine(line))
            .filter(diagnostic => diagnostic != null);

        this.errors.set(docUrl, diagnostics);
    }

    private parseErrorLine(line: string): vscode.Diagnostic {
        let errorInfo = line.match(/\w+\.proto:(\d+):(\d+):\s*(.*)/);
        if (errorInfo) {
            let startLine = parseInt(errorInfo[1]) - 1;
            let startChar = parseInt(errorInfo[2]) - 1;
            let range = new vscode.Range(startLine, startChar, startLine, line.length);
            let msg = errorInfo[3];
            return new vscode.Diagnostic(range, msg, vscode.DiagnosticSeverity.Error);
        }
        return null;
    }

}
