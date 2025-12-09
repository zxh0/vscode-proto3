import * as assert from 'assert';

// Defines a Mocha test suite to group tests of similar kind together
suite('Extension Tests', () => {
  // Defines a Mocha unit test
  test('Array indexOf should return -1 for items not in array', () => {
    assert.strictEqual([1, 2, 3].indexOf(5), -1);
    assert.strictEqual([1, 2, 3].indexOf(0), -1);
  });
});
