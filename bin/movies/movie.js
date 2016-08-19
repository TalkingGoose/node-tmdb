/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

var util = require('util');
var TypeOf = require('typeof');

var request = require('../libs/timed-request');

var _require = require('../config');

var Templates = _require.Templates;


function Movie(data) {
    if (!(this instanceof Movie)) {
        return new Movie(data);
    }

    Movie.super_.call(this);

    this.data = data;

    return this;
}

util.inherits(Movie, Object);

Object.defineProperties(Movie.prototype, {
    'complete': {
        'value': function value(callback) {
            var _this = this;

            var requestData = Object.assign({}, Templates.GET, {
                'url': Templates.URL.replace('$', 'movie/' + this.get('id')),
                'qs': Object.assign({}, { 'api_key': this.instance.apikey })
            });

            request(requestData, function (error, response, body) {
                if (error) {
                    return callback(error);
                }

                _this.data = JSON.parse(body);

                return callback(null, _this);
            });
        }
    },

    'get': {
        'value': function value(id) {
            if (id in this.data) {
                return this.data[id];
            }

            return null;
        }
    }
});

module.exports = Movie;
//# sourceMappingURL=movie.js.map
