/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

const util = require('util');
const TypeOf = require('typeof');

const request = require('../libs/timed-request');
const {Templates} = require('../config');

function Movie(instance, data) {
    if (!(this instanceof Movie)) {
        return new Movie(data);
    }

    Movie.super_.call(this);

    this.instance = instance;
    this.data = data;

    return this;
}

util.inherits(Movie, Object);

Object.defineProperties(Movie.prototype, {
    'complete': {
        'value': function(...args) {
            let options, callback;
            switch (args.length) {
                case 1:
                    options = {};
                    callback = args[0];
                    break;

                case 2:
                    options = args[0];
                    callback = args[1];
                    break;

                default:
                    return;
            }

            let requestData = Object.assign({}, Templates.GET, {
                'url': Templates.URL.replace('$', `movie/${this.get('id')}`),
                'qs': Object.assign({}, options, { 'api_key': this.instance.apikey })
            });

            request(requestData, (error, response, body) => {
                if (error) {
                    return callback(error);
                }

                this.data = JSON.parse(body);

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

module.exports = Movie;
