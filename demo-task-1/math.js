'use strict';

exports.isStar = true;

exports.sum = function () {
    // Реализуйте сложение в этой функции
    var sum = 0;
    for (var i = 0; i < arguments.length; i++) {
        sum += parseInt(arguments[i], 10);
    }

    return sum;
};
