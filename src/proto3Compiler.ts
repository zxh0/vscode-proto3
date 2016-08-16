'use strict';

import vscode = require('vscode');
import fs = require('fs');
import path = require('path');
import cp = require('child_process');

export class Proto3Compiler {

    public compileActiveProto() {
        let editor = vscode.window.activeTextEditor;
		if (!editor){
            return;
        }

		let fileName = editor.document.fileName;
        this.compile(fileName);
    }

    public compile(fileName: string, callback?: (stderr: string) =>void) {
		if (!fileName.endsWith('.proto')) {
			return;
		}

		let proto = path.relative(vscode.workspace.rootPath, fileName);
		//console.log(proto);

		let settingsPath = path.join(vscode.workspace.rootPath, 'settings.json')
		if (fs.existsSync(settingsPath)) {
			let settingsStr = fs.readFileSync(settingsPath).toString();
			let settingsObj = JSON.parse(settingsStr);
			let cmd = settingsObj.protoc.path;
			let args = [].concat(settingsObj.protoc.options).concat(proto);
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
    }

}