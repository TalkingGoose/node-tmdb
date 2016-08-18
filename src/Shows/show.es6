/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

const util = require('util');
const TypeOf = require('TypeOf');

const Season = require('../Seasons/season');
const request = require('../libs/timed-request');
const {Templates} = require('../config');

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
