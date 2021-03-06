/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

var util = require('util');
var TypeOf = require('typeof');

var Episode = require('../episodes/episode');
var request = require('../libs/timed-request');

var _require = require('../config');

var Templates = _require.Templates;


function Season(instance, parent, data) {
    if (!(this instanceof Season)) {
        return new Season(instance, parent, data);
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
        'value': function value(callback) {
            var _this = this;

            var requestData = Object.assign({}, Templates.GET, {
                'url': Templates.URL.replace('$', 'tv/' + this.parent.get('id') + '/season/' + this.get('season_number')),
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
    },

    'toJSON': {
        'value': function value() {
            return this.data;
        }
    }
});

module.exports = Season;
//# sourceMappingURL=season.js.map
