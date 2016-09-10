/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

var util = require('util');
var TypeOf = require('typeof');

var request = require('../libs/timed-request');

var _require = require('../config');

var Templates = _require.Templates;


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
        'value': function value() {
            var _this = this;

            var options = void 0,
                callback = void 0;
            switch (arguments.length) {
                case 1:
                    options = {};
                    callback = arguments.length <= 0 ? undefined : arguments[0];
                    break;

                case 2:
                    options = arguments.length <= 0 ? undefined : arguments[0];
                    callback = arguments.length <= 1 ? undefined : arguments[1];
                    break;

                default:
                    return;
            }

            var requestData = Object.assign({}, Templates.GET, {
                'url': Templates.URL.replace('$', 'movie/' + this.get('id')),
                'qs': Object.assign({}, options, { 'api_key': this.instance.apikey })
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
