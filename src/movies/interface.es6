/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

const util = require('util');
const TypeOf = require('typeof');

const Movie = require('./movie');
const request = require('../libs/timed-request');
const cached = require('../libs/cached');
const {Templates} = require('../config');

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
    'search': {
        'value': function(data, callback) {
            let requestData = Object.assign({}, Templates.GET, {
                'url': Templates.URL.replace('$', 'search/movie'),
                'qs': Object.assign({}, { 'api_key': this.instance.apikey }, data)
            });

            request(requestData, (error, response, body) => {
                if (error) {
                    return callback(error);
                }

                let jsonData = JSON.parse(body);
                let results = jsonData.results;

                if (TypeOf.isArray(results)) {
                    jsonData.results = results.map((data) => new Movie(this.instance, data));
                }

                return callback(null, jsonData);
            });
        }
    },

    'genres': {
        'value': cached(function(callback) {
            let requestData = Object.assign({}, Templates.GET, {
                'url': Templates.URL.replace('$', 'genre/movie/list'),
                'qs': Object.assign({}, { 'api_key': this.instance.apikey })
            });

            request(requestData, (error, response, body) => {
                if (error) {
                    return callback(error);
                }

                return callback(null, JSON.parse(body));
            });
        }, 10000)
    },

    'from': {
        'value': function(data) {
            return new Movie(this.instance, data);
        }
    }
});

module.exports = Interface;
