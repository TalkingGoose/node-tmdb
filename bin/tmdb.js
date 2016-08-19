/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

var util = require('util');
var TypeOf = require('typeof');

var Movies = require('./movies/interface');
var Shows = require('./shows/interface');
var request = require('./libs/timed-request');

function TMDB(apikey, options) {
    if (!(this instanceof TMDB)) {
        return new TMDB(options);
    }

    TMDB.super_.call(this);

    if (!TypeOf.isDefined(apikey)) {
        throw Error('API key is undefined!');
    }

    if (!TypeOf.isString(apikey)) {
        throw Error('API key must be a string!');
    }

    this.apikey = apikey;
    this.options = options;

    this.movies = new Movies(this, options);
    this.shows = new Shows(this, options);

    return this;
}

util.inherits(TMDB, Object);

Object.defineProperties(TMDB.prototype, {});

module.exports = TMDB;
//# sourceMappingURL=tmdb.js.map
