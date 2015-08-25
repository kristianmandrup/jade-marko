/*
 * jade-markoa
 * https://github.com/kristianmandrup/jade-markoa
 *
 * Copyright (c) 2015, Kristian Mandrup
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai'),
    expect = chai.expect;

chai.should();

var jade-markoa = require('../lib/index.js');

describe('jade-markoa module', function() {
    describe('#awesome()', function() {
        it('should return a hello', function() {
            expect(jade-markoa.awesome('livia')).to.equal('hello livia');
        });
    });
});
