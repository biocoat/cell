// Require the built in 'assertion' library
const assert = require('assert');

// Create a group of tests about Arrays
describe('Array', function () {
    // Within our Array group, Create a group of tests for indexOf
    describe('#indexOf()', function () {
        // A string explanation of what we're testing
        it('should return -1 when the value is not present', function () {
            // Our actual test: -1 should equal indexOf(...)
            assert.strictEqual(-1, [1, 2, 3].indexOf(4));
        });
    });
});

describe('Math', function () {
    it('should test if 3*3 = 9', function () {
        assert.strictEqual(9, 3 * 3);
    });
    it('should test if (3-4) * 8', function () {
        assert.strictEqual(-8, (3 - 4) * 8);
    });
});