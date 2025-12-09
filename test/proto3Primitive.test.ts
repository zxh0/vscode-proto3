import * as assert from 'assert';
import { Proto3Primitive } from '../src/proto3Primitive';

suite('Proto3Primitive', () => {
  suite('primitiveTypes', () => {
    test('should contain all protobuf primitive types', () => {
      const expectedTypes = [
        'double',
        'float',
        'int32',
        'int64',
        'uint32',
        'uint64',
        'sint32',
        'sint64',
        'fixed32',
        'fixed64',
        'sfixed32',
        'sfixed64',
        'bool',
        'string',
      ];

      assert.deepStrictEqual(Proto3Primitive.primitiveTypes, expectedTypes);
    });

    test('should have 14 primitive types', () => {
      assert.strictEqual(Proto3Primitive.primitiveTypes.length, 14);
    });
  });

  suite('isTypePrimitive', () => {
    test('should return true for all numeric types', () => {
      const numericTypes = [
        'double',
        'float',
        'int32',
        'int64',
        'uint32',
        'uint64',
        'sint32',
        'sint64',
        'fixed32',
        'fixed64',
        'sfixed32',
        'sfixed64',
      ];

      numericTypes.forEach(type => {
        assert.strictEqual(
          Proto3Primitive.isTypePrimitive(type),
          true,
          `Expected ${type} to be primitive`
        );
      });
    });

    test('should return true for bool type', () => {
      assert.strictEqual(Proto3Primitive.isTypePrimitive('bool'), true);
    });

    test('should return true for string type', () => {
      assert.strictEqual(Proto3Primitive.isTypePrimitive('string'), true);
    });

    test('should return false for bytes type (not in primitives list)', () => {
      assert.strictEqual(Proto3Primitive.isTypePrimitive('bytes'), false);
    });

    test('should return false for custom message types', () => {
      assert.strictEqual(Proto3Primitive.isTypePrimitive('MyMessage'), false);
      assert.strictEqual(Proto3Primitive.isTypePrimitive('Person'), false);
      assert.strictEqual(Proto3Primitive.isTypePrimitive('google.protobuf.Timestamp'), false);
    });

    test('should return false for enum types', () => {
      assert.strictEqual(Proto3Primitive.isTypePrimitive('Status'), false);
      assert.strictEqual(Proto3Primitive.isTypePrimitive('MyEnum'), false);
    });

    test('should return false for empty string', () => {
      assert.strictEqual(Proto3Primitive.isTypePrimitive(''), false);
    });

    test('should be case-sensitive', () => {
      assert.strictEqual(Proto3Primitive.isTypePrimitive('String'), false);
      assert.strictEqual(Proto3Primitive.isTypePrimitive('INT32'), false);
      assert.strictEqual(Proto3Primitive.isTypePrimitive('Bool'), false);
    });

    test('should return false for types with whitespace', () => {
      assert.strictEqual(Proto3Primitive.isTypePrimitive(' string'), false);
      assert.strictEqual(Proto3Primitive.isTypePrimitive('string '), false);
      assert.strictEqual(Proto3Primitive.isTypePrimitive(' int32 '), false);
    });

    test('should return false for map types', () => {
      assert.strictEqual(Proto3Primitive.isTypePrimitive('map<string, int32>'), false);
      assert.strictEqual(Proto3Primitive.isTypePrimitive('map'), false);
    });

    test('should return false for repeated modifier', () => {
      assert.strictEqual(Proto3Primitive.isTypePrimitive('repeated'), false);
      assert.strictEqual(Proto3Primitive.isTypePrimitive('repeated string'), false);
    });
  });
});
