'use strict';

import vscode = require('vscode');
import fs = require('fs');
import path = require('path');
import cp = require('child_process');
import { Proto3CompletionItemProvider } from './proto3Suggest';
import { Proto3LanguageDiagnosticProvider } from './proto3Diagnostic';
import { Proto3Compiler, Proto3SettingsV1Loader } from './proto3Compiler';
import { PROTO3_MODE } from './proto3Mode';

export function activate(ctx: vscode.ExtensionContext): void {

    ctx.subscriptions.push(vscode.languages.registerCompletionItemProvider(PROTO3_MODE, new Proto3CompletionItemProvider(), '.', '\"'));

    let v1loader = new Proto3SettingsV1Loader();
    ctx.subscriptions.push(v1loader.setWatcher());
    let compiler = new Proto3Compiler(v1loader);

    let diagnosticProvider = new Proto3LanguageDiagnosticProvider(compiler);
    vscode.workspace.onDidSaveTextDocument(event => {
        if (event.languageId == 'proto3') {
            diagnosticProvider.createDiagnostics(event);
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
        wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
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

    if (vscode.window.activeTextEditor) {
        // 
    }
}

function deactivate() {
    //
}
