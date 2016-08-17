'use strict';

import vscode = require('vscode');
import fs = require('fs');
import path = require('path');
import cp = require('child_process');
import os = require('os');

export class Proto3Compiler {

    public compileActiveProto() {
        let editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId == 'proto3') {
            let fileName = editor.document.fileName;
            let proto = path.relative(vscode.workspace.rootPath, fileName);
            this.loadSettings(settings => {
                let cmd = this.getProtocPath(settings);
                let args = this.getProtocOptions(settings).concat(proto);
                let opts = {cwd: vscode.workspace.rootPath};

                cp.execFile(cmd, args, opts, (err, stdout, stderr) => {
                    console.log(stderr);
                });
            })
        }
    }

    public compileProtoToTmp(fileName: string, callback?: (stderr: string) =>void) {
        let proto = path.relative(vscode.workspace.rootPath, fileName);
        this.loadSettings(settings => {
            let cmd = this.getProtocPath(settings);
            let args = [
                this.getProtoPathOption(settings),
                this.getTmpJavaOutOption(),
                proto
            ];
            let opts = {cwd: vscode.workspace.rootPath};

            cp.execFile(cmd, args, opts, (err, stdout, stderr) => {
                if (callback) {
                    callback(stderr);
                }
            });
        })
    }

    private getProtocPath(settings): string {
        if (settings && settings.protoc && settings.protoc.path) {
            return settings.protoc.path as string;
        }
        return 'protoc';
    }

    private getProtocOptions(settings): string[] {
        if (settings && settings.protoc && settings.protoc.options) {
             return settings.protoc.options as string[];
        }
        return [];
    }

    private getProtoPathOption(settings): string {
        return this.getProtocOptions(settings)
            .find(opt => opt.startsWith('--proto_path'));
    }

    private getTmpJavaOutOption(): string {
        return '--java_out=' + os.tmpdir();
    }
    
    private loadSettings(cb: (settings) => void) {
        let settingsPath = path.join(vscode.workspace.rootPath, 'settings.json');
        fs.exists(settingsPath, exists => {
            if (exists) {
                fs.readFile(settingsPath, (err, data) => {
                    if (data) {
                        cb(JSON.parse(data.toString()));
                    } else {
                        cb({});
                    }
                });
            } else {
                cb({});
            }
        });
    }

}