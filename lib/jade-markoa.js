/*
 * jade-markoa
 * https://github.com/kristianmandrup/jade-markoa
 *
 * Copyright (c) 2015, Kristian Mandrup
 * Licensed under the MIT license.
 */

'use strict';
/**
 * Method responsible for say Hello
 *
 * @example
 *
 *     jade-markoa.awesome('livia');
 *
 * @method awesome
 * @param {String} name Name of People
 * @return {String} Returns hello name
 */

exports.awesome = function (name) {
  return 'hello ' + name;
};
