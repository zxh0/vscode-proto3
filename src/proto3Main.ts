'use strict';

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import vscode = require('vscode');
import cp = require('child_process');
import { Proto3CompletionItemProvider } from './proto3Suggest';
import { Proto3LanguageDiagnosticProvider } from './proto3Diagnostic';
import { Proto3Compiler } from './proto3Compiler';
import { PROTO3_MODE } from './proto3Mode';
import { Proto3DefinitionProvider } from './proto3Definition';
import { Proto3Configuration } from './proto3Configuration';

function formatDocument(data: string): Promise<string> {
    return new Promise(function (resolve, reject) {
        fs.mkdtemp(path.join(os.tmpdir(), 'vscodeproto3'), (e, folder) => {
            if (e) return reject(e); // not common

            const tmp = path.join(folder, 'tmp.proto');
            fs.writeFile(tmp, data, function (e) {
                if (e) return reject(e); // not common
                
                const ret = vscode.workspace.getConfiguration('clang-format').get<string>('style');
                const style = ret && ret.trim() ? ret.trim() : null;

                let args = [];
                if (style) args.push(`-style=${style}`);
                args.push(tmp);

                try {
                    const stdout = cp.execFileSync('clang-format', args);
                    const output = stdout ? stdout.toString() : "";
                    resolve(output);
                } catch (e) {
                    reject(e);
                }
            });
        });
    });
}

export function activate(ctx: vscode.ExtensionContext): void {

    ctx.subscriptions.push(vscode.languages.registerCompletionItemProvider(PROTO3_MODE, new Proto3CompletionItemProvider(), '.', '\"'));
    ctx.subscriptions.push(vscode.languages.registerDefinitionProvider(PROTO3_MODE, new Proto3DefinitionProvider()));

    const compiler = new Proto3Compiler();

    const diagnosticProvider = new Proto3LanguageDiagnosticProvider(compiler);
    vscode.workspace.onDidSaveTextDocument(event => {
        if (event.languageId == 'proto3') {
            diagnosticProvider.createDiagnostics(event);
            if (Proto3Configuration.Instance().compileOnSave()) {
                compiler.compileActiveProto();
            }
        }
    });

    ctx.subscriptions.push(vscode.commands.registerCommand('proto3.compile.one', () => {
        compiler.compileActiveProto();
    }));

    ctx.subscriptions.push(vscode.commands.registerCommand('proto3.compile.all', () => {
        compiler.compileAllProtos();
    }));

    //console.log('Congratulations, your extension "vscode-pb3" is now active!');

    vscode.languages.setLanguageConfiguration(PROTO3_MODE.language, {
        indentationRules: {
            // ^(.*\*/)?\s*\}.*$
            decreaseIndentPattern: /^(.*\*\/)?\s*\}.*$/,
            // ^.*\{[^}'']*$
            increaseIndentPattern: /^.*\{[^}'']*$/
        },
        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)(\.proto){0,1}/g,
        comments: {
            lineComment: '//',
            blockComment: ['/*', '*/']
        },
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')'],
            ['<', '>'],
        ],

        __electricCharacterSupport: {
            brackets: [
                { tokenType: 'delimiter.curly.ts', open: '{', close: '}', isElectric: true },
                { tokenType: 'delimiter.square.ts', open: '[', close: ']', isElectric: true },
                { tokenType: 'delimiter.paren.ts', open: '(', close: ')', isElectric: true }
            ]
        },

        __characterPairSupport: {
            autoClosingPairs: [
                { open: '{', close: '}' },
                { open: '[', close: ']' },
                { open: '(', close: ')' },
                { open: '`', close: '`', notIn: ['string'] },
                { open: '"', close: '"', notIn: ['string'] },
                { open: '\'', close: '\'', notIn: ['string', 'comment'] }
            ]
        }
    });

    vscode.languages.registerDocumentFormattingEditProvider('proto3', {
        provideDocumentFormattingEdits(document: vscode.TextDocument): Thenable<vscode.TextEdit[]> {
            return formatDocument(document.getText())
                .then(
                    function(result) {
                        if (result) {
                            return [new vscode.TextEdit(document.validateRange(new vscode.Range(0, 0, Infinity, Infinity)), result)];
                        }
                    },
                    function (e) {
                        vscode.window.showErrorMessage(e.message);
                        return [];
                    }
                )
        }
    });

    if (vscode.window.activeTextEditor) {
        // 
    }
}

function deactivate() {
    //
}
