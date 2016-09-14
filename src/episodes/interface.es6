/**
 * Created by Paul on 14/09/2016.
 */

'use strict';

const util = require('util');

const Episode = require('./episode');

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
        'value': function(parent, data) {
            return new Episode(this.instance, parent, data);
        }
    }
});

module.exports = Interface;

