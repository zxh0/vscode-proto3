'use strict';

import vscode = require('vscode');
import fs = require('fs');
import path = require('path');
import cp = require('child_process');
import os = require('os');

export class Proto3Compiler {

    public compileActiveProto() {
        let editor = vscode.window.activeTextEditor;
		if (!editor){
            return;
        }

		let fileName = editor.document.fileName;
        this.compile(fileName);
    }

	private prepareProtoc(cb: (protocPath: string, protoPathOpt) => void) {
		
	}

    public compile(fileName: string, callback?: (stderr: string) =>void) {
		if (!fileName.endsWith('.proto')) {
			return;
		}

		this.getSettings(jsonObj => {
			if (jsonObj) {
				let proto = path.relative(vscode.workspace.rootPath, fileName);

				let cmd = jsonObj.protoc.path;
				let args = [].concat(jsonObj.protoc.options).concat(proto);
				let opts = {cwd: vscode.workspace.rootPath};

				cp.execFile(cmd, args, opts, (err, stdout, stderr) => {
					//console.log(err);
					//console.log(stdout);
					//console.log(stderr);
					if (callback && stderr) {
						callback(stderr);
					}
				});
			}
		})
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