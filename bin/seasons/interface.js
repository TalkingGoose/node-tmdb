/**
 * Created by Paul on 14/09/2016.
 */

'use strict';

var util = require('util');

var Season = require('./season');

function Interface(instance) {
    if (!(this instanceof Interface)) {
        return new Interface(instance);
    }

    Interface.super_.call(this);

    this.instance = instance;

    return this;
}

util.inherits(Interface, Object);

Object.defineProperties(Interface.prototype, {
    'from': {
        'value': function value(parent, data) {
            return new Season(this.instance, parent, data);
        }
    }
});

module.exports = Interface;
//# sourceMappingURL=interface.js.map
