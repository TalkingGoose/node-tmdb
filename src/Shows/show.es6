/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

const util = require('util');
const request = require('request');
const TypeOf = require('TypeOf');

const {Templates} = require('../config');
const Timed = require('../libs/timed');
const Season = require('../Seasons/season');

function Show(instance, data) {
    if (!(this instanceof Show)) {
        return new Show(data);
    }

    Show.super_.call(this);

    this.instance = instance;
    this.data = data;

    return this;
}

util.inherits(Show, Object);

Object.defineProperties(Show.prototype, {
    'complete': {
        'value': function(callback) {
            let requestData = Object.assign({}, Templates.GET, {
                'url': Templates.URL.replace('$', `tv/${this.data.id}`),
                'qs': Object.assign({}, { 'api_key': this.instance.apikey })
            });

            Timed.Enforce(250, (callback) => {
                request(requestData, (error, response, body) => {
                    if (error) {
                        return callback(error);
                    }

                    this.data = JSON.parse(body);
                    let seasons = this.data.seasons;

                    if (TypeOf.isArray(seasons)) {
                        this.data.seasons = seasons.map((data) => new Season(this.instance, this, data));
                    }

                    return callback(null, this);
                });
            }, callback);
        }
    },

    'get': {
        'value': function(id) {
            if (id in this.data) {
                return this.data[id];
            }

            return null;
        }
    }
});

module.exports = Show;
