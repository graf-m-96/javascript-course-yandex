'use strict';


var NUMBERS_ARRAY = [
    {
        roman: 'I',
        arabic: 1
    },
    {
        roman: 'IV',
        arabic: 4
    },
    {
        roman: 'V',
        arabic: 5
    },
    {
        roman: 'IX',
        arabic: 9
    },
    {
        roman: 'X',
        arabic: 10
    },
    {
        roman: 'XL',
        arabic: 40
    },
    {
        roman: 'L',
        arabic: 50
    }
];


/**
 * @param {String} time – время в формате HH:MM (например, 09:05)
 * @returns {String} – время римскими цифрами (IX:V)
 */
function romanTime(time) {
    // Немного авторского кода и замечательной магии
    checkTime(time);
    var tokens = time.split(':');
    var hours = Number(tokens[0]);
    var minutes = Number(tokens[1]);

    return convertArabicToRoman(hours) + ':' + convertArabicToRoman(minutes);
}


function convertArabicToRoman(number) {
    if (number === 0) {
        return 'N';
    }
    var aranicNumber = '';
    var indexNumber = NUMBERS_ARRAY.length - 1;
    while (number > 0) {
        if (number >= NUMBERS_ARRAY[indexNumber].arabic) {
            var numberCount = Math.floor(number / NUMBERS_ARRAY[indexNumber].arabic);
            aranicNumber += NUMBERS_ARRAY[indexNumber].roman.repeat(numberCount);
            number %= NUMBERS_ARRAY[indexNumber].arabic;
        }
        indexNumber--;
    }

    return aranicNumber;
}


function checkTime(time) {
    if (typeof time !== 'string') {
        throw new TypeError('Переменная должна иметь тип \'string\', а имеет \'' +
                            typeof time + '\'');
    }
    var tokens = time.split(':');
    if (tokens.length !== 2) {
        throw new TypeError('Время должно быть выражено через знак \':\'');
    }
    checkHours(tokens[0]);
    checkMinutes(tokens[1]);
}


function checkHours(hoursInStr) {
    if (hoursInStr.length > 2) {
        throw new TypeError('Часы должны быть заданы не более, чем 2-мя цифрами');
    }
    var hours = Number(hoursInStr);
    if (!Number.isInteger(hours)) {
        throw new TypeError('Часы должны быть целым числом');
    }
    if (hours >= 24 || hours < 0) {
        throw new TypeError('Часы должны быть заданы целым положительным числом от 0 до 23');
    }
}


function checkMinutes(minutesInStr) {
    if (minutesInStr.length > 2) {
        throw new TypeError('Минуты должны быть заданы не более, чем 2-мя цифрами');
    }
    var minutes = Number(minutesInStr);
    if (!Number.isInteger(minutes)) {
        throw new TypeError('Минуты должны быть целым числом');
    }
    if (minutes >= 60 || minutes < 0) {
        throw new TypeError('Минуты должны быть заданы целым положительным числом от 0 до 60');
    }
}

module.exports = romanTime;
