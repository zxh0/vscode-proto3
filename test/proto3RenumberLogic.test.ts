import * as assert from 'assert';
import { computeDocumentRenumberEdits, computeEnumEdits, computeMessageEdits, findEnclosingBlock } from '../src/proto3RenumberLogic';

suite('Proto3RenumberLogic', () => {
    test('renumbers message fields while skipping nested messages', () => {
        const text = `message Outer {\n  string keep = 5;\n  message Inner {\n    string nested = 1;\n  }\n  oneof choice {\n    int32 picked = 8;\n    string named = 11;\n  }\n}`;
        const offset = text.indexOf('keep');
        const block = findEnclosingBlock(text, offset);
        assert.ok(block, 'expected outer message block');
        assert.strictEqual(block.type, 'message');

        const edits = computeMessageEdits(text, block);
        assert.strictEqual(edits.length, 3);
        assert.deepStrictEqual(edits.map(edit => text.slice(edit.start, edit.end)), ['5', '8', '11']);
        assert.deepStrictEqual(edits.map(edit => edit.replacement), ['1', '2', '3']);
    });

    test('finds nested message block', () => {
        const text = `message Wrapper {\n  message Embedded {\n    string note = 7;\n  }\n}`;
        const offset = text.indexOf('note');
        const block = findEnclosingBlock(text, offset);
        assert.ok(block, 'expected nested message block');
        assert.strictEqual(block.type, 'message');
        const edits = computeMessageEdits(text, block);
        assert.strictEqual(edits.length, 1);
        assert.strictEqual(edits[0].replacement, '1');
    });

    test('renumbers enums starting at zero', () => {
        const text = `enum Sample {\n  SAMPLE_UNKNOWN = 5;\n  SAMPLE_CREATED = 8;\n}`;
        const offset = text.indexOf('SAMPLE_UNKNOWN');
        const block = findEnclosingBlock(text, offset);
        assert.ok(block, 'expected enum block');
        assert.strictEqual(block.type, 'enum');

        const edits = computeEnumEdits(text, block);
        assert.strictEqual(edits.length, 2);
        assert.deepStrictEqual(edits.map(edit => edit.replacement), ['0', '1']);
    });

    test('renumbers entire document across messages and enums', () => {
        const text = `message Foo {\n  string keep = 3;\n  enum State {\n    UNKNOWN = 2;\n    STARTED = 5;\n  }\n  message Inner {\n    int64 value = 4;\n  }\n}`;
        const edits = computeDocumentRenumberEdits(text);
        assert.strictEqual(edits.length, 4);
        assert.deepStrictEqual(edits.map(edit => text.slice(edit.start, edit.end)), ['3', '2', '5', '4']);
        assert.deepStrictEqual(edits.map(edit => edit.replacement), ['1', '0', '1', '1']);
    });
});
