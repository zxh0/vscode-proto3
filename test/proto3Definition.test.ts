import * as assert from 'assert';

// Test the regex patterns from proto3Definition.ts
// These patterns are used for "Go to Definition" functionality

suite('Proto3Definition', () => {
  suite('messageRegExp with optional keyword (Issue #180)', () => {
    // Pattern from proto3Definition.ts
    const messageOrEnumPattern = `\\s*(\\w+\\.)*\\w+\\s*`;
    const messageFieldPattern = `\\s+\\w+\\s*=\\s*\\d+;.*`;

    // Updated pattern that supports 'optional' keyword
    const messageRegExp = new RegExp(
      `^\\s*(optional|repeated)?\\s*(${messageOrEnumPattern})${messageFieldPattern}$`,
      'i'
    );

    test('matches field with optional keyword', () => {
      const line = '  optional MyMessage field = 1;';
      assert.ok(messageRegExp.test(line), 'Should match optional MyMessage field');
    });

    test('matches field with repeated keyword', () => {
      const line = '  repeated MyMessage field = 1;';
      assert.ok(messageRegExp.test(line), 'Should match repeated MyMessage field');
    });

    test('matches field without modifier', () => {
      const line = '  MyMessage field = 1;';
      assert.ok(messageRegExp.test(line), 'Should match field without modifier');
    });

    test('matches field with package prefix', () => {
      const line = '  optional my.package.MyMessage field = 1;';
      assert.ok(messageRegExp.test(line), 'Should match optional with package prefix');
    });

    test('matches primitive types', () => {
      const line = '  optional string name = 1;';
      assert.ok(messageRegExp.test(line), 'Should match optional primitive');
    });

    test('does not match import statements', () => {
      const line = 'import "foo.proto";';
      assert.ok(!messageRegExp.test(line), 'Should not match import');
    });

    test('does not match message definitions', () => {
      const line = 'message MyMessage {';
      assert.ok(!messageRegExp.test(line), 'Should not match message definition');
    });
  });

  suite('messageInMap pattern', () => {
    const messageOrEnumPattern = `\\s*(\\w+\\.)*\\w+\\s*`;
    const messageFieldPattern = `\\s+\\w+\\s*=\\s*\\d+;.*`;

    const messageInMap = new RegExp(
      `^\\s*map\\s*<${messageOrEnumPattern},${messageOrEnumPattern}>${messageFieldPattern}$`,
      'i'
    );

    test('matches map field', () => {
      const line = '  map<string, MyMessage> items = 1;';
      assert.ok(messageInMap.test(line), 'Should match map field');
    });

    test('matches map with package prefix in value', () => {
      const line = '  map<string, my.package.Value> data = 2;';
      assert.ok(messageInMap.test(line), 'Should match map with package prefix');
    });
  });

  suite('messageInRpcRegExp pattern', () => {
    const messageOrEnumPattern = `\\s*(\\w+\\.)*\\w+\\s*`;
    const rpcReqOrRspPattern = `\\s*\\(\\s*(stream\\s+)?${messageOrEnumPattern}\\s*\\)\\s*`;

    const messageInRpcRegExp = new RegExp(
      `^\\s*rpc\\s*\\w+${rpcReqOrRspPattern}returns${rpcReqOrRspPattern}[;{].*$`,
      'i'
    );

    test('matches simple rpc', () => {
      const line = '  rpc GetItem(Request) returns (Response);';
      assert.ok(messageInRpcRegExp.test(line), 'Should match simple rpc');
    });

    test('matches streaming rpc', () => {
      const line = '  rpc StreamItems(stream Request) returns (stream Response);';
      assert.ok(messageInRpcRegExp.test(line), 'Should match streaming rpc');
    });

    test('matches rpc with package prefix', () => {
      const line = '  rpc GetItem(my.package.Request) returns (my.package.Response);';
      assert.ok(messageInRpcRegExp.test(line), 'Should match rpc with package prefix');
    });

    test('matches rpc with body', () => {
      const line = '  rpc GetItem(Request) returns (Response) {';
      assert.ok(messageInRpcRegExp.test(line), 'Should match rpc with body');
    });
  });
});
