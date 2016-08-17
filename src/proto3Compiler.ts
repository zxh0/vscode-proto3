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
            this.compile(fileName);
        }
    }

    public compile(fileName: string, callback?: (stderr: string) =>void) {
        // if (!fileName.endsWith('.proto')) {
        //     return;
        // }

        this.getSettings(jsonObj => {
            let proto = path.relative(vscode.workspace.rootPath, fileName);
            let cmd = this.getProtoc(jsonObj);
            let args = [this.getProtoPath(jsonObj), this.getJavaOut(), proto];
            let opts = {cwd: vscode.workspace.rootPath};

            cp.execFile(cmd, args, opts, (err, stdout, stderr) => {
                // console.log(err);
                // console.log(stdout);
                // console.log(stderr);
                if (callback) {
                    callback(stderr);
                }
            });
        })
    }

    private getProtoc(jsonObj): string {
        if (jsonObj && jsonObj.protoc && jsonObj.protoc.path) {
            return jsonObj.protoc.path;
        }
        return 'protoc';
    }

    private getProtoPath(jsonObj): string {
        if (jsonObj && jsonObj.protoc && jsonObj.protoc.options) {
             return (jsonObj.protoc.options as string[])
                     .find(opt => opt.startsWith('--proto_path'));
        }
        return "";
    }

    private getJavaOut(): string {
        return '--java_out=' + os.tmpdir();
    }
    
    private getSettings(cb: (jsonObj) => void) {
        let settingsPath = path.join(vscode.workspace.rootPath, 'settings.json');
        fs.exists(settingsPath, exists => {
            if (exists) {
                fs.readFile(settingsPath, (err, data) => {
                    if (data) {
                        cb(JSON.parse(data.toString()));
                    } else {
                        cb(null);
                    }
                });
            } else {
                cb(null);
            }
        });
    }

}