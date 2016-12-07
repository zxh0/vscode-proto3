'use strict';

import vscode = require('vscode');
import fs = require('fs');
import path = require('path');
import cp = require('child_process');
import os = require('os');

export class Proto3Compiler {

    private _settings: vscode.WorkspaceConfiguration;
    private _configResolver: ConfigurationResolver;

    constructor() {
        this._settings = vscode.workspace.getConfiguration("protoc");
        this._configResolver = new ConfigurationResolver();
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
        return this._configResolver.resolve(
            this._settings.get<string>('path', 'protoc'));
    }

    private getProtocOptions(): string[] {
        return this._configResolver.resolve(
            this._settings.get<string[]>('options', []));
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

// Workaround to substitute variable keywords in the configuration value until
// workbench/services/configurationResolver is available on Extention API.
//
// 
// Some codes are copied from:
// src/vs/workbench/services/configurationResolver/node/configurationResolverService.ts
class ConfigurationResolver {

    constructor(){
        Object.keys(process.env).forEach(key => {
			this[`env.${key}`] = process.env[key];
		});
    }

	public resolve(value: string): string;
	public resolve(value: string[]): string[];
    public resolve(value: any): any {
        if (typeof value === 'string') {
            return this.resolveString(value);
        } else if (typeof value === 'array' || typeof value === 'object') {
            return this.resolveArray(value);
        }
        return value;
    }

	private resolveArray(value: string[]): string[] {
		return value.map(s => this.resolveString(s));
	}

    private resolveString(value: string): string {
		let regexp = /\$\{(.*?)\}/g;
		const originalValue = value;
		const resolvedString = value.replace(regexp, (match: string, name: string) => {
			let newValue = (<any>this)[name];
			if (typeof newValue === 'string') {
				return newValue;
			} else {
				return match && match.indexOf('env.') > 0 ? '' : match;
			}
		});

		return this.resolveConfigVariable(resolvedString, originalValue);
	}
    
    private resolveConfigVariable(value: string, originalValue: string): string {
		let regexp = /\$\{config\.(.+?)\}/g;
		return value.replace(regexp, (match: string, name: string) => {
			let config = vscode.workspace.getConfiguration();
			let newValue: any;
			try {
				const keys: string[] = name.split('.');
				if (!keys || keys.length <= 0) {
					return '';
				}
				while (keys.length > 1) {
					const key = keys.shift();
					if (!config || !config.hasOwnProperty(key)) {
						return '';
					}
					config = config[key];
				}
				newValue = config && config.hasOwnProperty(keys[0]) ? config[keys[0]] : '';
			} catch (e) {
				return '';
			}
			if (typeof newValue === 'string') {
				// Prevent infinite recursion and also support nested references (or tokens)
				return newValue === originalValue ? '' : this.resolveString(newValue);
			} else {
				return this.resolve(newValue) + '';
			}
		});
	}

    private get workspaceRoot(): string {
		return vscode.workspace.rootPath;
	}
}