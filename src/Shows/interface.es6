/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

const util = require('util');
const request = require('request');
const TypeOf = require('TypeOf');

const {Templates} = require('../config');
const Timed = require('../libs/timed');
const Show = require('./show');

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

            Timed.Enforce(250, (callback) => {
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
            }, callback);
        }
    }
});

module.exports = Interface;
