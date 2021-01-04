'use strict';

module.exports.isStar = true;

let messages = [];
let id = 0;

let express = require('express');
let bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());

app.get('/messages', (req, res) => {
    getMessages(res, req.query);
});

app.post('/messages', (req, res) => {
    saveMessage(res, req.body, req.query);
});

app.delete('/messages/:id', (req, res) => {
    deleteMessage(res, Number(req.params.id));
});

app.patch('/messages/:id', (req, res) => {
    editMessage(res, Number(req.params.id), req.body);
});

/**
 * @param {Object} response
 * @param {Number} editableId
 * @param {Object} body
 */
function editMessage(response, editableId, body) {
    let newText = body.text;
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].id === editableId) {
            messages[i].edited = true;
            messages[i].text = newText;
            response.send(messages[i]);

            return;
        }
    }
    response.send();
}

/**
 * @param {Object} response
 * @param {Number} removableId
 */
function deleteMessage(response, removableId) {
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].id === removableId) {
            messages.splice(i, 1);
            response.send({ 'status': 'ok' });

            return;
        }
    }
    response.send();
}

/**
 * @param {Object} response
 * @param {Object} queryParameters
 */
function getMessages(response, queryParameters) {
    let filteredMessages = messages.filter(message => {
        return isSuitableToTemplate(message, queryParameters);
    });
    response.send(filteredMessages);
}

/**
 * @param {String} message
 * @param {Object} queryParameters
 * @returns {boolean}
 */
function isSuitableToTemplate(message, queryParameters) {
    for (let key of ['from', 'to']) {
        if (key in queryParameters && queryParameters[key] !== message[key]) {
            return false;
        }
    }

    return true;
}

/**
 * @param {Object} response
 * @param {Object} body
 * @param {Object} queryParameters
 */
function saveMessage(response, body, queryParameters) {
    queryParameters.text = body.text;
    queryParameters.id = id++;
    messages.push(queryParameters);
    response.send(queryParameters);
}

module.exports = app;
