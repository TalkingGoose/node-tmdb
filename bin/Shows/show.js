/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

var util = require('util');
var TypeOf = require('TypeOf');

var Season = require('../Seasons/season');
var request = require('../libs/timed-request');

var _require = require('../config');

var Templates = _require.Templates;


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
        'value': function value(callback) {
            var _this = this;

            var requestData = Object.assign({}, Templates.GET, {
                'url': Templates.URL.replace('$', 'tv/' + this.data.id),
                'qs': Object.assign({}, { 'api_key': this.instance.apikey })
            });

            request(requestData, function (error, response, body) {
                if (error) {
                    return callback(error);
                }

                _this.data = JSON.parse(body);
                var seasons = _this.data.seasons;

                if (TypeOf.isArray(seasons)) {
                    _this.data.seasons = seasons.map(function (data) {
                        return new Season(_this.instance, _this, data);
                    });
                }

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

module.exports = Show;
//# sourceMappingURL=show.js.map
