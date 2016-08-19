/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

var util = require('util');
var TypeOf = require('typeof');

var Movie = require('./movie');
var request = require('../libs/timed-request');
var cached = require('../libs/cached');

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
                'url': Templates.URL.replace('$', 'search/movie'),
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
                        return new Movie(_this.instance, data);
                    });
                }

                return callback(null, jsonData);
            });
        }
    },

    'genres': {
        'value': cached(function (callback) {
            var requestData = Object.assign({}, Templates.GET, {
                'url': Templates.URL.replace('$', 'genre/movie/list'),
                'qs': Object.assign({}, { 'api_key': this.instance.apikey })
            });

            request(requestData, function (error, response, body) {
                if (error) {
                    return callback(error);
                }

                return callback(null, JSON.parse(body));
            });
        }, 10000)
    },

    'from': {
        'value': function value(data) {
            return new Movie(this.instance, data);
        }
    }
});

module.exports = Interface;
//# sourceMappingURL=interface.js.map
