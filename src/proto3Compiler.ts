'use strict';

import vscode = require('vscode');
import fs = require('fs');
import path = require('path');
import cp = require('child_process');
import os = require('os');

export class Proto3Compiler {

    private _settings: vscode.WorkspaceConfiguration;

    constructor() {
        this._settings = vscode.workspace.getConfiguration("protoc")
    }

    public compileAllProtos() {
        let cmd = this.getProtocPath();
        let args = this.getProtocOptions();
        args = args.concat(this.getProtos());
        let opts = {cwd: vscode.workspace.rootPath};
        //console.log(args);

        cp.execFile(cmd, args, opts, (err, stdout, stderr) => {
            console.log(stderr);
            vscode.window.showErrorMessage(stderr);
        });
    }

    public compileActiveProto() {
        let editor = vscode.window.activeTextEditor;
        if (editor && editor.document.languageId == 'proto3') {
            let fileName = editor.document.fileName;
            let proto = path.relative(vscode.workspace.rootPath, fileName);
            let cmd = this.getProtocPath();
            let args = this.getProtocOptions().concat(proto);
            let opts = {cwd: vscode.workspace.rootPath};

            cp.execFile(cmd, args, opts, (err, stdout, stderr) => {
                console.log(stderr);
                vscode.window.showErrorMessage(stderr);
            });
        }
    }

    public compileProtoToTmp(fileName: string, callback?: (stderr: string) =>void) {
        let proto = path.relative(vscode.workspace.rootPath, fileName);

        let cmd = this.getProtocPath();
        let args = this.getProtoPathOptions()
                .concat(this.getTmpJavaOutOption(), proto);
        let opts = {cwd: vscode.workspace.rootPath};

        cp.execFile(cmd, args, opts, (err, stdout, stderr) => {
            if (callback) {
                callback(stderr);
            }
        });
    }

    private getProtocPath(): string {
        return this._settings.get<string>('path', 'protoc');
    }

    private getProtocOptions(): string[] {
        return this._settings.get<string[]>('options', []);
    }

    private getProtoPathOptions(): string[] {
        return this.getProtocOptions()
            .filter(opt => opt.startsWith('--proto_path') || opt.startsWith('-I'));
    }

    private getProtos(): string[] {
        if (this._settings.has('options')) {
            return this.getProtocOptions();
        }
        return new InputCollector().collectInputs(vscode.workspace.rootPath);
    }

    private getTmpJavaOutOption(): string {
        return '--java_out=' + os.tmpdir();
    }
}

class InputCollector {

    inputs: string[] = [];

    collectInputs(dir: string): string[] {
        let kids = fs.readdirSync(dir);
        if (kids.some(kid => kid.endsWith(".proto"))) {
            let relDir = path.relative(vscode.workspace.rootPath, dir);
            let input = path.join(relDir, "*.proto");
            this.inputs = this.inputs.concat(input);
        }
        kids.map(kid => path.join(dir, kid))
            .filter(kid => fs.statSync(kid).isDirectory())
            .forEach(subDir => this.collectInputs(subDir));
        return this.inputs;
    }

}