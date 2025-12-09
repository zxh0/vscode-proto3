import * as vscode from 'vscode';
import { computeDocumentRenumberEdits, computeEnumEdits, computeMessageEdits, findEnclosingBlock, ProtoBlock, NumericEdit } from './proto3RenumberLogic';

export class Proto3RenumberCommand {
    public static async run(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const document = editor.document;
        if (document.languageId !== 'proto3') {
            vscode.window.showWarningMessage('proto3: The renumber command only works on proto3 files.');
            return;
        }

        const block = this.findBlock(document, editor.selection.active);
        if (!block) {
            vscode.window.showWarningMessage('proto3: Place the cursor inside a message or enum to renumber.');
            return;
        }

        const sourceText = document.getText();
        const replacements = block.type === 'enum'
            ? computeEnumEdits(sourceText, block)
            : computeMessageEdits(sourceText, block);

        if (replacements.length === 0) {
            vscode.window.setStatusBarMessage('proto3: Nothing to renumber in the current scope.', 4000);
            return;
        }

        await editor.edit(editBuilder => {
            replacements
                .map(replacement => this.toTextEdit(document, replacement))
                .forEach(edit => editBuilder.replace(edit.range, edit.newText));
        });

        const noun = block.type === 'enum' ? 'enum values' : 'fields';
        vscode.window.setStatusBarMessage(`proto3: Renumbered ${replacements.length} ${noun}.`, 4000);
    }

    public static getDocumentTextEdits(document: vscode.TextDocument): vscode.TextEdit[] {
        return computeDocumentRenumberEdits(document.getText())
            .map(edit => this.toWorkspaceTextEdit(document, edit));
    }

    private static findBlock(document: vscode.TextDocument, position: vscode.Position): ProtoBlock | undefined {
        return findEnclosingBlock(document.getText(), document.offsetAt(position));
    }

    private static toTextEdit(document: vscode.TextDocument, edit: NumericEdit): { range: vscode.Range; newText: string } {
        return {
            range: this.createRange(document, edit),
            newText: edit.replacement,
        };
    }

    private static toWorkspaceTextEdit(document: vscode.TextDocument, edit: NumericEdit): vscode.TextEdit {
        return new vscode.TextEdit(this.createRange(document, edit), edit.replacement);
    }

    private static createRange(document: vscode.TextDocument, edit: NumericEdit): vscode.Range {
        return new vscode.Range(document.positionAt(edit.start), document.positionAt(edit.end));
    }
}
