/* eslint-env mocha */
'use strict';

const { sum } = require('../math');
const assert = require('assert');

describe('Math', function () {
    describe('sum', function () {
        it('should sum `1` and `2` and get `3`', function () {
            assert.strictEqual(sum(1, 2), 3);
        });
    });
});
