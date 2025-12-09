'use strict';

import vscode = require('vscode');
import cp = require('child_process');

import { Proto3Configuration } from './proto3Configuration';

export class Proto3Compiler {
  private _config: Proto3Configuration;
  private _isProtocInPath: boolean;

  constructor(workspaceFolder?: vscode.WorkspaceFolder) {
    this._config = Proto3Configuration.Instance(workspaceFolder);
    try {
      cp.execFileSync('protoc', ['-h']);
      this._isProtocInPath = true;
    } catch {
      this._isProtocInPath = false;
    }
  }

  public compileAllProtos() {
    const args = this._config.getProtocOptions();
    // Compile in batch produces errors. Must be 1 by 1.
    this._config.getAllProtoPaths().forEach(proto => {
      this.runProtoc(args.concat(proto), undefined, (_stdout, stderr) => {
        vscode.window.showErrorMessage(stderr);
      });
    });
  }

  public compileActiveProto() {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.languageId == 'proto3') {
      const fileName = editor.document.fileName;
      const args = this._config.getProtocOptions().concat(fileName);

      this.runProtoc(args, undefined, (_stdout, stderr) => {
        vscode.window.showErrorMessage(stderr);
      });
    }
  }

  public compileProtoToTmp(fileName: string, callback?: (stderr: string) => void) {
    // Use full file path for proper validation (fix from upstream)
    const args = this._config
      .getProtoPathOptions()
      .concat(this._config.getTmpJavaOutOption(), fileName);

    this.runProtoc(args, undefined, (_stdout, stderr) => {
      if (callback) {
        callback(stderr);
      }
    });
  }

  private runProtoc(
    args: string[],
    opts?: cp.ExecFileOptions,
    callback?: (stdout: string, stderr: string) => void
  ) {
    const protocPath = this._config.getProtocPath(this._isProtocInPath);
    if (protocPath == '?') {
      return; // protoc is not configured
    }

    if (!opts) {
      opts = {};
    }
    opts = Object.assign(opts, { cwd: vscode.workspace.rootPath });
    cp.execFile(protocPath, args, opts, (err, stdout, stderr) => {
      const stdoutStr = typeof stdout === 'string' ? stdout : stdout.toString();
      const stderrStr = typeof stderr === 'string' ? stderr : stderr.toString();
      if (err && stdoutStr.length == 0 && stderrStr.length == 0) {
        // Assume the OS error if no messages to buffers because
        // "err" does not provide error type info.
        vscode.window.showErrorMessage(err.message);
        console.error(err);
        return;
      }
      if (callback) {
        callback(stdoutStr, stderrStr);
      }
    });
  }
}
