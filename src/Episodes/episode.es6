/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

const util = require('util');
const request = require('request');
const TypeOf = require('TypeOf');

const {Templates} = require('../config');
const Timed = require('../libs/timed');

function Episode(instance, parent, data) {
    if (!(this instanceof Episode)) {
        return new Episode(instance, data);
    }

    Episode.super_.call(this);

    this.instance = instance;
    this.parent = parent;
    this.data = data;

    return this;
}

util.inherits(Episode, Object);

Object.defineProperties(Episode.prototype, {
    'complete': {
        'value': function(callback) {
            let requestData = Object.assign({}, Templates.GET, {
                'url': Templates.URL.replace('$', `tv/${this.parent.parent.get('id')}/season/${this.parent.get('season_number')}/episode/${this.get('episode_number')}`),
                'qs': Object.assign({}, { 'api_key': this.instance.apikey })
            });

            Timed.Enforce(250, (callback) => {
                request(requestData, (error, response, body) => {
                    if (error) {
                        return callback(error);
                    }

                    this.data = JSON.parse(body);

                    return callback(null);
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

module.exports = Episode;

