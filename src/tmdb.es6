/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

const util = require('util');
const TypeOf = require('typeof');

const Movies = require('./movies/interface');
const Shows = require('./shows/interface');
const Seasons = require('./seasons/interface');

const request = require('./libs/timed-request');

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
    this.seasons = new Seasons(this, options);

    return this;
}

util.inherits(TMDB, Object);

Object.defineProperties(TMDB.prototype, { });

module.exports = TMDB;
