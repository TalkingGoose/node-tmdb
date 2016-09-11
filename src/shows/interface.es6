/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

const util = require('util');
const TypeOf = require('typeof');

const Show = require('./show');
const request = require('../libs/timed-request');
const {Templates} = require('../config');

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
        'value': function(data, callback) {
            let requestData = Object.assign({}, Templates.GET, {
                'url': Templates.URL.replace('$', 'search/tv'),
                'qs': Object.assign({}, { 'api_key': this.instance.apikey }, data)
            });

            request(requestData, (error, response, body) => {
                if (error) {
                    return callback(error);
                }

                let jsonData = JSON.parse(body);
                let results = jsonData.results;

                if (TypeOf.isArray(results)) {
                    jsonData.results = results.map((data) => new Show(this.instance, data));
                }

                return callback(null, jsonData);
            });
        }
    },

    'genres': {
        'value': (function() {
            let LAST_UPDATE = (new Date());
            let RESULT = null;
            return function(callback) {
                if (RESULT !== null) {
                    let diff = ((new Date()) - LAST_UPDATE);
                    if (diff < 1e6) {
                        return RESULT;
                    }

                    LAST_UPDATE = (new Date());
                }

                let requestData = Object.assign({}, Templates.GET, {
                    'url': Templates.URL.replace('$', 'genre/tv/list'),
                    'qs': Object.assign({}, { 'api_key': this.instance.apikey })
                });

                request(requestData, (error, response, body) => {
                    if (error) {
                        return callback(error);
                    }

                    RESULT = JSON.parse(body);

                    return callback(null, RESULT);
                });
            };
        }())
    },

    'from': {
        'value': function(data) {
            return new Show(this.instance, data);
        }
    }
});

module.exports = Interface;
