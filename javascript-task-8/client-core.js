'use strict';

module.exports.execute = execute;
module.exports.isStar = true;

const querystring = require('querystring');
const yargs = require('yargs');
const chalk = require('chalk');
const rp = require('request-promise');

/**
 * Действия для разных http методов
 */
class Controller {

    /**
     * @param {Object} reqOptions
     * @param {String} method
     * @param {Object} args
     */
    constructor(reqOptions, method, args) {
        this.reqOptions = reqOptions;
        this.method = method;
        this.args = args;
    }

    /**
     * @returns {Promise}
     */
    fulfillMethod() {
        if (!(this.method.toLowerCase() in this)) {
            throw new Error('Команда валидная, но её разбор не описан.\nОбратитесь в техподдержку');
        }

        return this[this.method.toLowerCase()]();
    }

    get() {
        return rp(this.reqOptions)
            .then(body => compileResponse(body, this.args));
    }

    post() {
        this.reqOptions.body = {
            'text': this.args.text
        };

        return rp(this.reqOptions)
            .then(body => compileResponse(body, this.args));
    }

    delete() {
        return rp(this.reqOptions)
            .then(body => {
                if (body.status === 'ok') {
                    return 'DELETED';
                }
            });
    }

    patch() {
        this.reqOptions.body = {
            'text': this.args.text
        };

        return rp(this.reqOptions)
            .then(body => compileResponse(body, this.args));
    }
}

/**
 * main
 * @returns {Promise}
 */
function execute() {
    const args = parseArgs();
    let method = getHttpMethod(args);
    let reqOptions = createOptionsForRequest(args, method);

    return new Controller(reqOptions, method, args).fulfillMethod();
}

/**
 * @param {Object|Array<Object>} body
 * @param {Object} args yargs.argv
 * @returns {String}
 */
function compileResponse(body, args) {
    if (Array.isArray(body)) {
        let compiledMessages = body.map(message => compileMessage(message, args));

        return compiledMessages.join('\n\n');
    }

    return compileMessage(body, args);
}

/**
 * @param {Object} letter
 * @param {Object} args yargs.argv
 * @returns {String}
 */
function compileMessage(letter, args) {
    const red = chalk.hex('#f00');
    const green = chalk.hex('#0f0');
    const yellow = chalk.hex('#ff0');
    const gray = chalk.hex('#777');
    // const red = chalk.red;
    // const green = chalk.green;
    // const yellow = chalk.yellow;
    // const gray = chalk.gray;
    let message = '';
    if (args.verbose) {
        message += `${yellow('ID')}: ${letter.id}\n`;
    }
    if (letter.from) {
        message += `${red('FROM')}: ${letter.from}\n`;
    }
    if (letter.to) {
        message += `${red('TO')}: ${letter.to}\n`;
    }
    message += `${green('TEXT')}: ${letter.text}`;
    if (letter.edited) {
        message += `${gray('(edited)')}`;
    }

    return message;
}

/**
 * @param {Object} args yargs.argv
 * @param {String} method
 * @returns {Object}
 */
function createOptionsForRequest(args, method) {
    let options = {
        method,
        json: true
    };
    let protocol = 'http';
    let host = 'localhost';
    let port = '8080';
    if (['GET', 'POST'].includes(method)) {
        let queryParameters = getQueryParameters(args);
        options.uri = `${protocol}://${host}:${port}/messages?${queryParameters}`;

        return options;
    }
    if (['DELETE', 'PATCH'].includes(method)) {
        options.uri = `${protocol}://${host}:${port}/messages/${args.id}`;

        return options;
    }

    throw new Error('Команда валидная, но её разбор не описан.\nОбратитесь в техподдержку');
}

/**
 * @param {Object} args yargs.argv
 * @returns {String}
 */
function getHttpMethod(args) {
    const actionMapping = {
        list: 'GET',
        send: 'POST',
        delete: 'DELETE',
        edit: 'PATCH'
    };
    const method = actionMapping[args._[args._.length - 1]];
    if (!method) {
        yargs.showHelp();
        process.exit(1);
    }

    return method;
}

/**
 * @param {Object} args yargs.argv
 * @returns {String}
 */
function getQueryParameters(args) {
    let queryParameters = {};
    for (let key of ['from', 'to']) {
        if (args[key]) {
            queryParameters[key] = args[key];
        }
    }

    return querystring.stringify(queryParameters);
}

/**
 * @returns {Object} yargs.argv
 */
function parseArgs() {
    return yargs
        .usage('<command> [--param1] [--param2]')
        .command('list', 'Запрашивает у сервера сообщения')
        .command('send', 'Отправляет на сервер сообщение', {
            'text': {
                demandOption: true,
                type: 'string',
                describe: 'Текст сообщения'
            }
        })
        .command('delete', 'Удаляет сообщение по id', {
            'id': {
                demandOption: true,
                type: 'number',
                describe: 'Id удаляемого сообщения'
            }
        })
        .command('edit', 'Изменяет сообщение по id и text', {
            'id': {
                demandOption: true,
                type: 'number',
                describe: 'Id удаляемого сообщения'
            },
            'text': {
                demandOption: true,
                type: 'string',
                describe: 'Текст сообщения'
            }
        })
        .option('from', {
            type: 'string',
            describe: 'Автор'
        })
        .option('to', {
            type: 'string',
            describe: 'Получатель'
        })
        .option('verbose', {
            alias: 'v',
            boolean: true,
            describe: 'Подробный вывод (id, изменялось ли сообщение)'
        })
        .demandCommand(1, 'Требуется одна команда из раздела "Commands"')
        .parse(process.argv);
}
