import * as assert from 'assert';

// Tests for syntax highlighting patterns in proto3.tmLanguage.json
// These test the regex patterns used for TextMate grammar

suite('Proto3 Syntax Highlighting Patterns', () => {
  suite('Enum value pattern (Issue #168 - Negative values)', () => {
    // Pattern from proto3.tmLanguage.json enum section
    const enumValuePattern = /([A-Za-z][A-Za-z0-9_]*)\s*(=)\s*(-?0[xX][0-9a-fA-F]+|-?[0-9]+)/;

    test('matches positive decimal value', () => {
      const line = '  SOME_VALUE = 1;';
      const match = enumValuePattern.exec(line);
      assert.ok(match, 'Should match positive decimal');
      assert.strictEqual(match[1], 'SOME_VALUE');
      assert.strictEqual(match[3], '1');
    });

    test('matches zero value', () => {
      const line = '  ZERO = 0;';
      const match = enumValuePattern.exec(line);
      assert.ok(match, 'Should match zero');
      assert.strictEqual(match[3], '0');
    });

    test('matches negative decimal value', () => {
      const line = '  NEGATIVE_ONE = -1;';
      const match = enumValuePattern.exec(line);
      assert.ok(match, 'Should match negative decimal');
      assert.strictEqual(match[1], 'NEGATIVE_ONE');
      assert.strictEqual(match[3], '-1');
    });

    test('matches large negative value', () => {
      const line = '  BIG_NEGATIVE = -2147483648;';
      const match = enumValuePattern.exec(line);
      assert.ok(match, 'Should match large negative');
      assert.strictEqual(match[3], '-2147483648');
    });

    test('matches positive hex value', () => {
      const line = '  HEX_VALUE = 0xFF;';
      const match = enumValuePattern.exec(line);
      assert.ok(match, 'Should match positive hex');
      assert.strictEqual(match[3], '0xFF');
    });

    test('matches negative hex value', () => {
      const line = '  NEG_HEX = -0x10;';
      const match = enumValuePattern.exec(line);
      assert.ok(match, 'Should match negative hex');
      assert.strictEqual(match[3], '-0x10');
    });

    test('matches hex with uppercase X', () => {
      const line = '  HEX_UPPER = 0XABC;';
      const match = enumValuePattern.exec(line);
      assert.ok(match, 'Should match hex with uppercase X');
      assert.strictEqual(match[3], '0XABC');
    });
  });

  suite('Field pattern (Issue #167 - Fully qualified types)', () => {
    // Pattern from proto3.tmLanguage.json field section - updated to support leading dot
    const fieldPattern =
      /\s*(optional|repeated|required)?\s*(\.?[\w.]+)\s+(\w+)\s*(=)\s*(0[xX][0-9a-fA-F]+|[0-9]+)/;

    test('matches simple field', () => {
      const line = '  string name = 1;';
      const match = fieldPattern.exec(line);
      assert.ok(match, 'Should match simple field');
      assert.strictEqual(match[2], 'string');
      assert.strictEqual(match[3], 'name');
    });

    test('matches field with package prefix', () => {
      const line = '  google.protobuf.Timestamp time = 1;';
      const match = fieldPattern.exec(line);
      assert.ok(match, 'Should match package prefix');
      assert.strictEqual(match[2], 'google.protobuf.Timestamp');
    });

    test('matches field with leading dot (fully qualified)', () => {
      const line = '  .google.protobuf.Timestamp time = 1;';
      const match = fieldPattern.exec(line);
      assert.ok(match, 'Should match leading dot');
      assert.strictEqual(match[2], '.google.protobuf.Timestamp');
    });

    test('matches optional field with leading dot', () => {
      const line = '  optional .my.package.Message field = 1;';
      const match = fieldPattern.exec(line);
      assert.ok(match, 'Should match optional with leading dot');
      assert.strictEqual(match[1], 'optional');
      assert.strictEqual(match[2], '.my.package.Message');
    });

    test('matches repeated field with leading dot', () => {
      const line = '  repeated .my.Type items = 2;';
      const match = fieldPattern.exec(line);
      assert.ok(match, 'Should match repeated with leading dot');
      assert.strictEqual(match[1], 'repeated');
      assert.strictEqual(match[2], '.my.Type');
    });

    test('matches local type with leading dot', () => {
      const line = '  .LocalMessage nested = 3;';
      const match = fieldPattern.exec(line);
      assert.ok(match, 'Should match local type with leading dot');
      assert.strictEqual(match[2], '.LocalMessage');
    });
  });

  suite('Map field pattern (Issue #167 - Fully qualified types)', () => {
    // Pattern from proto3.tmLanguage.json mapfield section - updated
    const mapFieldPattern =
      /\s*(map)\s*(<)\s*(\.?[\w.]+)\s*,\s*(\.?[\w.]+)\s*(>)\s+(\w+)\s*(=)\s*(\d+)/;

    test('matches simple map', () => {
      const line = '  map<string, int32> counts = 1;';
      const match = mapFieldPattern.exec(line);
      assert.ok(match, 'Should match simple map');
      assert.strictEqual(match[3], 'string');
      assert.strictEqual(match[4], 'int32');
    });

    test('matches map with message value', () => {
      const line = '  map<string, MyMessage> items = 2;';
      const match = mapFieldPattern.exec(line);
      assert.ok(match, 'Should match message value');
      assert.strictEqual(match[4], 'MyMessage');
    });

    test('matches map with fully qualified value', () => {
      const line = '  map<string, .google.protobuf.Any> data = 3;';
      const match = mapFieldPattern.exec(line);
      assert.ok(match, 'Should match fully qualified value');
      assert.strictEqual(match[4], '.google.protobuf.Any');
    });

    test('matches map with package prefix value', () => {
      const line = '  map<int64, my.package.Value> lookup = 4;';
      const match = mapFieldPattern.exec(line);
      assert.ok(match, 'Should match package prefix');
      assert.strictEqual(match[4], 'my.package.Value');
    });
  });

  suite('RPC ident pattern (Issue #167 - Fully qualified types)', () => {
    // Pattern from proto3.tmLanguage.json ident section - updated
    const identPattern = /\.?[A-Za-z][A-Za-z0-9_.]*/;

    test('matches simple identifier', () => {
      const text = 'Request';
      const match = identPattern.exec(text);
      assert.ok(match, 'Should match simple identifier');
      assert.strictEqual(match[0], 'Request');
    });

    test('matches identifier with leading dot', () => {
      const text = '.Request';
      const match = identPattern.exec(text);
      assert.ok(match, 'Should match leading dot');
      assert.strictEqual(match[0], '.Request');
    });

    test('matches fully qualified identifier', () => {
      const text = '.google.protobuf.Empty';
      const match = identPattern.exec(text);
      assert.ok(match, 'Should match fully qualified');
      assert.strictEqual(match[0], '.google.protobuf.Empty');
    });

    test('matches package qualified identifier', () => {
      const text = 'my.package.Request';
      const match = identPattern.exec(text);
      assert.ok(match, 'Should match package qualified');
      assert.strictEqual(match[0], 'my.package.Request');
    });
  });
});
