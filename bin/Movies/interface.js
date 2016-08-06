/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

var util = require('util');
var request = require('request');
var TypeOf = require('TypeOf');

var _require = require('../config');

var Templates = _require.Templates;

var Timed = require('../libs/timed');
var Movie = require('./movie');

function Interface(instance, options) {
    if (!(this instanceof Interface)) {
        return new Interface(instance, options);
    }

    Interface.super_.call(this);

    this.instance = instance;
    this.options = options;

    return this;
}

util.inherits(Interface, Object);

Object.defineProperties(Interface.prototype, {
    'search': {
        'value': function value(data, callback) {
            var requestData = Object.assign({}, Templates.GET, {
                'url': Templates.URL.replace('$', 'search/movie'),
                'qs': Object.assign({}, { 'api_key': this.instance.apikey }, data)
            });

            Timed.Enforce(250, function (callback) {
                request(requestData, function (error, response, body) {
                    if (error) {
                        return callback(error);
                    }

                    var jsonData = JSON.parse(body);
                    var results = jsonData.results;

                    if (TypeOf.isArray(results)) {
                        jsonData.results = results.map(function (data) {
                            return new Movie(data);
                        });
                    }

                    return callback(null, jsonData);
                });
            }, callback);
        }
    }
});

module.exports = Interface;
//# sourceMappingURL=interface.js.map
