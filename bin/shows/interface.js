/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

var util = require('util');
var TypeOf = require('typeof');

var Show = require('./show');
var request = require('../libs/timed-request');

var _require = require('../config');

var Templates = _require.Templates;


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
            var _this = this;

            var requestData = Object.assign({}, Templates.GET, {
                'url': Templates.URL.replace('$', 'search/tv'),
                'qs': Object.assign({}, { 'api_key': this.instance.apikey }, data)
            });

            request(requestData, function (error, response, body) {
                if (error) {
                    return callback(error);
                }

                var jsonData = JSON.parse(body);
                var results = jsonData.results;

                if (TypeOf.isArray(results)) {
                    jsonData.results = results.map(function (data) {
                        return new Show(_this.instance, data);
                    });
                }

                return callback(null, jsonData);
            });
        }
    },

    'genres': {
        'value': function () {
            var LAST_UPDATE = new Date();
            var RESULT = null;
            return function (callback) {
                if (RESULT !== null) {
                    var diff = new Date() - LAST_UPDATE;
                    if (diff < 1e6) {
                        return RESULT;
                    }

                    LAST_UPDATE = new Date();
                }

                var requestData = Object.assign({}, Templates.GET, {
                    'url': Templates.URL.replace('$', 'genre/tv/list'),
                    'qs': Object.assign({}, { 'api_key': this.instance.apikey })
                });

                request(requestData, function (error, response, body) {
                    if (error) {
                        return callback(error);
                    }

                    RESULT = JSON.parse(body);

                    return callback(null, RESULT);
                });
            };
        }()
    },

    'from': {
        'value': function value(data) {
            return new Show(this.instance, data);
        }
    }
});

module.exports = Interface;
//# sourceMappingURL=interface.js.map
