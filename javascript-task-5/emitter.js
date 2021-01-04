'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;


/**
 * @param {String} rawEvent
 * @returns {Object}
 */
function parseEventToNamespace(rawEvent) {
    let rootNamespace = {};
    rawEvent.split('.').reduce((nestedNamespace, namespace) => {
        nestedNamespace[namespace] = {};

        return nestedNamespace[namespace];
    }, rootNamespace);

    return rootNamespace;
}


/**
 * @param {String} event
 * @param {Object} context
 * @param {Function} handler
 * @param {Object} optional
 * @constructor
 */
function Subscription(event, context, handler, optional = {}) {
    this.namespace = parseEventToNamespace(event);
    this.context = context;
    this.handler = handler.bind(context);
    Object.entries(optional).forEach(([key, value]) => {
        this[key] = value;
    });
}


/**
 * @param {Object} subscriptionNamespace
 * @param {String} rawEvent
 * @returns {Boolean}
 */
function namespaceStartWithEvent(subscriptionNamespace, rawEvent) {
    return rawEvent.split('.').every(event => {
        subscriptionNamespace = subscriptionNamespace[event];

        return subscriptionNamespace;
    });
}

/**
 * @param {{Object: namespace, Object: context, Function: handler}} subscription
 * @param {Number} indexInQueue
 * @param {Array<String>} eventNamespaces
 * @returns {{handler, namespaceDepth, indexInQueue}|undefined}
 */
function calculateExecutionOrder(subscription, indexInQueue, eventNamespaces) {
    let subscriptionNamespace = subscription.namespace;
    let namespaceDepth = 0;
    for (; namespaceDepth < eventNamespaces.length; namespaceDepth++) {
        if (!(eventNamespaces[namespaceDepth] in subscriptionNamespace)) {
            break;
        }
        subscriptionNamespace = subscriptionNamespace[eventNamespaces[namespaceDepth]];
    }
    if (!Object.keys(subscriptionNamespace).length) {
        return {
            handler: subscription.handler,
            namespaceDepth,
            indexInQueue
        };
    }
}


/**
 * @param {Array<{handler, namespaceDepth, indexInQueue}>} actions
 */
function performActionsInOrder(actions) {
    actions.sort((a, b) => {
        if (a.namespaceDepth > b.namespaceDepth) {
            return -1;
        }
        if (a.namespaceDepth < b.namespaceDepth) {
            return 1;
        }

        return a.indexInQueue - b.indexInQueue;
    }).forEach(action => action.handler());
}

/**
 * @param {{namespace, context, handler}} subscription
 */
function changeHandlerCounters(subscription) {
    if ('times' in subscription) {
        subscription.times--;
    }
    if ('frequency' in subscription && 'callCounter' in subscription) {
        subscription.callCounter = (subscription.callCounter + 1) % subscription.frequency;
    }
}


/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let queueSubscriptions = [];

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            queueSubscriptions.push(new Subscription(event, context, handler));

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            queueSubscriptions = queueSubscriptions.filter(subscription => {

                return subscription.context !== context ||
                    !namespaceStartWithEvent(subscription.namespace, event);
            });

            return this;
        },


        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            let actions = [];
            let eventNamespaces = event.split('.');
            queueSubscriptions = queueSubscriptions.filter((subscription, index) => {
                let actionOrder = calculateExecutionOrder(subscription, index, eventNamespaces);
                if (actionOrder) {
                    if (!subscription.callCounter) {
                        actions.push(actionOrder);
                    }
                    changeHandlerCounters(subscription);
                }

                return subscription.times !== 0;
            });
            performActionsInOrder(actions);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            if (times <= 0) {
                return this.on(event, context, handler);
            }
            let subscription = new Subscription(event, context, handler, { times });
            queueSubscriptions.push(subscription);

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            if (frequency <= 0) {
                return this.on(event, context, handler);
            }
            let subscription = new Subscription(event, context, handler,
                { frequency, callCounter: 0 });
            queueSubscriptions.push(subscription);

            return this;
        }
    };
}
