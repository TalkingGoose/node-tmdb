/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

const util = require('util');
const TypeOf = require('typeof');

const Episode = require('../episodes/episode');
const request = require('../libs/timed-request');
const {Templates} = require('../config');

function Season(instance, parent, data) {
    if (!(this instanceof Season)) {
        return new Season(instance, data);
    }

    Season.super_.call(this);

    this.instance = instance;
    this.parent = parent;
    this.data = data;

    return this;
}

util.inherits(Season, Object);

Object.defineProperties(Season.prototype, {
    'complete': {
        'value': function(callback) {
            let requestData = Object.assign({}, Templates.GET, {
                'url': Templates.URL.replace('$', `tv/${this.parent.get('id')}/season/${this.get('season_number')}`),
                'qs': Object.assign({}, { 'api_key': this.instance.apikey })
            });

            request(requestData, (error, response, body) => {
                if (error) {
                    return callback(error);
                }

                this.data = JSON.parse(body);
                let episodes = this.data.episodes;

                if (TypeOf.isArray(episodes)) {
                    this.data.episodes = episodes.map((data) => new Episode(this.instance, this, data));
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

module.exports = Season;
