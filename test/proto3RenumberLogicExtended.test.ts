import * as assert from 'assert';
import {
  computeDocumentRenumberEdits,
  computeEnumEdits,
  computeMessageEdits,
  findAllBlocks,
  findEnclosingBlock,
} from '../src/proto3RenumberLogic';

suite('Proto3RenumberLogic - Extended Tests', () => {
  suite('findEnclosingBlock', () => {
    test('returns undefined for empty text', () => {
      const result = findEnclosingBlock('', 0);
      assert.strictEqual(result, undefined);
    });

    test('returns undefined when cursor is outside any block', () => {
      const text = `syntax = "proto3";\n\nmessage Foo {\n  string name = 1;\n}`;
      const offset = 0; // at syntax
      const result = findEnclosingBlock(text, offset);
      assert.strictEqual(result, undefined);
    });

    test('finds message block when cursor is on field', () => {
      const text = `message Foo {\n  string name = 1;\n}`;
      const offset = text.indexOf('name');
      const result = findEnclosingBlock(text, offset);
      assert.ok(result);
      assert.strictEqual(result.type, 'message');
    });

    test('finds enum block when cursor is on value', () => {
      const text = `enum Status {\n  UNKNOWN = 0;\n  ACTIVE = 1;\n}`;
      const offset = text.indexOf('ACTIVE');
      const result = findEnclosingBlock(text, offset);
      assert.ok(result);
      assert.strictEqual(result.type, 'enum');
    });

    test('returns innermost block when nested', () => {
      const text = `message Outer {\n  enum Inner {\n    VALUE = 0;\n  }\n}`;
      const offset = text.indexOf('VALUE');
      const result = findEnclosingBlock(text, offset);
      assert.ok(result);
      assert.strictEqual(result.type, 'enum');
    });

    test('returns message when cursor is in outer message but not in enum', () => {
      const text = `message Outer {\n  string field = 1;\n  enum Inner {\n    VALUE = 0;\n  }\n}`;
      const offset = text.indexOf('field');
      const result = findEnclosingBlock(text, offset);
      assert.ok(result);
      assert.strictEqual(result.type, 'message');
    });

    test('handles multiple messages and returns correct one', () => {
      const text = `message First {\n  int32 a = 1;\n}\n\nmessage Second {\n  int32 b = 1;\n}`;
      const offset = text.indexOf('b =');
      const result = findEnclosingBlock(text, offset);
      assert.ok(result);
      assert.strictEqual(result.type, 'message');
      assert.ok(text.slice(result.keywordStart).startsWith('message Second'));
    });
  });

  suite('findAllBlocks', () => {
    test('returns empty array for empty text', () => {
      const result = findAllBlocks('');
      assert.deepStrictEqual(result, []);
    });

    test('returns empty array for text without blocks', () => {
      const result = findAllBlocks('syntax = "proto3";');
      assert.deepStrictEqual(result, []);
    });

    test('finds single message block', () => {
      const text = `message Foo {\n  string name = 1;\n}`;
      const result = findAllBlocks(text);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].type, 'message');
    });

    test('finds single enum block', () => {
      const text = `enum Status {\n  UNKNOWN = 0;\n}`;
      const result = findAllBlocks(text);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].type, 'enum');
    });

    test('finds multiple blocks at same level', () => {
      const text = `message Foo {\n}\n\nenum Status {\n}\n\nmessage Bar {\n}`;
      const result = findAllBlocks(text);
      assert.strictEqual(result.length, 3);
      assert.strictEqual(result[0].type, 'message');
      assert.strictEqual(result[1].type, 'enum');
      assert.strictEqual(result[2].type, 'message');
    });

    test('finds nested blocks', () => {
      const text = `message Outer {\n  message Inner {\n  }\n  enum Status {\n  }\n}`;
      const result = findAllBlocks(text);
      assert.strictEqual(result.length, 3);
    });

    test('correctly identifies block positions', () => {
      const text = `message Foo {\n  string name = 1;\n}`;
      const result = findAllBlocks(text);
      assert.strictEqual(result[0].keywordStart, 0);
      assert.strictEqual(result[0].openBrace, text.indexOf('{'));
      assert.strictEqual(result[0].closeBrace, text.lastIndexOf('}'));
    });
  });

  suite('computeMessageEdits', () => {
    test('returns empty array for enum block', () => {
      const text = `enum Status {\n  UNKNOWN = 0;\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeMessageEdits(text, block);
      assert.deepStrictEqual(result, []);
    });

    test('returns empty array for message with no fields', () => {
      const text = `message Empty {\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeMessageEdits(text, block);
      assert.deepStrictEqual(result, []);
    });

    test('renumbers single field', () => {
      const text = `message Foo {\n  string name = 5;\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeMessageEdits(text, block);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].replacement, '1');
    });

    test('renumbers multiple fields sequentially', () => {
      const text = `message Foo {\n  string a = 10;\n  int32 b = 20;\n  bool c = 30;\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeMessageEdits(text, block);
      assert.strictEqual(result.length, 3);
      assert.deepStrictEqual(
        result.map(e => e.replacement),
        ['1', '2', '3']
      );
    });

    test('handles repeated fields', () => {
      const text = `message Foo {\n  repeated string names = 5;\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeMessageEdits(text, block);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].replacement, '1');
    });

    test('handles optional fields', () => {
      const text = `message Foo {\n  optional string name = 5;\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeMessageEdits(text, block);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].replacement, '1');
    });

    test('handles map fields', () => {
      const text = `message Foo {\n  map<string, int32> lookup = 5;\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeMessageEdits(text, block);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].replacement, '1');
    });

    test('skips nested message fields', () => {
      const text = `message Outer {\n  string outer_field = 5;\n  message Inner {\n    string inner_field = 10;\n  }\n}`;
      const outerBlock = findEnclosingBlock(text, text.indexOf('outer_field'))!;
      const result = computeMessageEdits(text, outerBlock);
      // Should only renumber outer_field, not inner_field
      assert.strictEqual(result.length, 1);
      assert.strictEqual(text.slice(result[0].start, result[0].end), '5');
    });

    test('handles oneof fields', () => {
      const text = `message Foo {\n  oneof choice {\n    string a = 5;\n    int32 b = 6;\n  }\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeMessageEdits(text, block);
      assert.strictEqual(result.length, 2);
      assert.deepStrictEqual(
        result.map(e => e.replacement),
        ['1', '2']
      );
    });

    test('does not create edit when field already has correct number', () => {
      const text = `message Foo {\n  string a = 1;\n  int32 b = 2;\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeMessageEdits(text, block);
      assert.strictEqual(result.length, 0);
    });

    test('handles custom message types as field types', () => {
      const text = `message Foo {\n  MyCustomType field = 5;\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeMessageEdits(text, block);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].replacement, '1');
    });

    test('handles fully qualified type names', () => {
      const text = `message Foo {\n  google.protobuf.Timestamp created_at = 5;\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeMessageEdits(text, block);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].replacement, '1');
    });
  });

  suite('computeEnumEdits', () => {
    test('returns empty array for message block', () => {
      const text = `message Foo {\n  string name = 1;\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeEnumEdits(text, block);
      assert.deepStrictEqual(result, []);
    });

    test('returns empty array for empty enum', () => {
      const text = `enum Empty {\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeEnumEdits(text, block);
      assert.deepStrictEqual(result, []);
    });

    test('renumbers enum starting at 0', () => {
      const text = `enum Status {\n  UNKNOWN = 5;\n  ACTIVE = 10;\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeEnumEdits(text, block);
      assert.strictEqual(result.length, 2);
      assert.deepStrictEqual(
        result.map(e => e.replacement),
        ['0', '1']
      );
    });

    test('handles negative enum values', () => {
      const text = `enum Status {\n  NEGATIVE = -1;\n  ZERO = 0;\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeEnumEdits(text, block);
      // Should renumber to 0, 1
      assert.strictEqual(result.length, 2);
      assert.deepStrictEqual(
        result.map(e => e.replacement),
        ['0', '1']
      );
    });

    test('does not create edit when values already correct', () => {
      const text = `enum Status {\n  UNKNOWN = 0;\n  ACTIVE = 1;\n  DELETED = 2;\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeEnumEdits(text, block);
      assert.strictEqual(result.length, 0);
    });

    test('handles enum values with underscores', () => {
      const text = `enum Status {\n  STATUS_UNKNOWN = 5;\n  STATUS_ACTIVE = 10;\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeEnumEdits(text, block);
      assert.strictEqual(result.length, 2);
    });
  });

  suite('computeDocumentRenumberEdits', () => {
    test('returns empty array for empty document', () => {
      const result = computeDocumentRenumberEdits('');
      assert.deepStrictEqual(result, []);
    });

    test('returns empty array for document with only syntax', () => {
      const result = computeDocumentRenumberEdits('syntax = "proto3";');
      assert.deepStrictEqual(result, []);
    });

    test('renumbers all messages in document', () => {
      const text = `message Foo {\n  string a = 5;\n}\n\nmessage Bar {\n  int32 b = 10;\n}`;
      const result = computeDocumentRenumberEdits(text);
      assert.strictEqual(result.length, 2);
      assert.deepStrictEqual(
        result.map(e => e.replacement),
        ['1', '1']
      );
    });

    test('renumbers both messages and enums', () => {
      const text = `message Foo {\n  string a = 5;\n}\n\nenum Status {\n  UNKNOWN = 5;\n}`;
      const result = computeDocumentRenumberEdits(text);
      assert.strictEqual(result.length, 2);
    });

    test('returns edits sorted by position', () => {
      const text = `enum Status {\n  A = 5;\n}\n\nmessage Foo {\n  string b = 10;\n}`;
      const result = computeDocumentRenumberEdits(text);
      // Verify edits are sorted by start position
      for (let i = 1; i < result.length; i++) {
        assert.ok(
          result[i].start > result[i - 1].start,
          'Edits should be sorted by start position'
        );
      }
    });

    test('handles complex nested structures', () => {
      const text = `
message Outer {
  string outer1 = 10;
  message Middle {
    int32 middle1 = 20;
    enum State {
      UNKNOWN = 5;
      ACTIVE = 6;
    }
    message Inner {
      bool inner1 = 30;
    }
  }
  string outer2 = 11;
}`;
      const result = computeDocumentRenumberEdits(text);
      // Should have edits for: outer1, outer2, middle1, UNKNOWN, ACTIVE, inner1
      assert.ok(result.length > 0);
    });
  });

  suite('Edge Cases', () => {
    test('handles Windows line endings', () => {
      const text = `message Foo {\r\n  string name = 5;\r\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeMessageEdits(text, block);
      assert.strictEqual(result.length, 1);
    });

    test('handles tabs for indentation', () => {
      const text = `message Foo {\n\tstring name = 5;\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeMessageEdits(text, block);
      assert.strictEqual(result.length, 1);
    });

    test('handles mixed spaces and tabs', () => {
      const text = `message Foo {\n  \tstring name = 5;\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeMessageEdits(text, block);
      assert.strictEqual(result.length, 1);
    });

    test('handles comments between fields', () => {
      const text = `message Foo {\n  // Comment\n  string a = 5;\n  /* Block comment */\n  int32 b = 10;\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeMessageEdits(text, block);
      assert.strictEqual(result.length, 2);
    });

    test('handles inline comments', () => {
      const text = `message Foo {\n  string name = 5; // inline comment\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeMessageEdits(text, block);
      assert.strictEqual(result.length, 1);
    });

    test('handles reserved ranges', () => {
      const text = `message Foo {\n  reserved 2, 15, 9 to 11;\n  string name = 5;\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeMessageEdits(text, block);
      // Should only renumber the actual field, not reserved numbers
      assert.strictEqual(result.length, 1);
    });

    test('handles large field numbers', () => {
      const text = `message Foo {\n  string name = 536870911;\n}`;
      const block = findAllBlocks(text)[0];
      const result = computeMessageEdits(text, block);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].replacement, '1');
    });
  });
});
