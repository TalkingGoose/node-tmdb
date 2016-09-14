/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

const util = require('util');
const TypeOf = require('typeof');

const Movies = require('./movies/interface');
const Shows = require('./shows/interface');
const Seasons = require('./seasons/interface');
const Episodes = require('./episodes/interface');

const request = require('./libs/timed-request');

function TMDB(apikey) {
    if (!(this instanceof TMDB)) {
        return new TMDB();
    }

    TMDB.super_.call(this);

    if (!TypeOf.isDefined(apikey)) {
        throw Error('API key is undefined!');
    }

    if (!TypeOf.isString(apikey)) {
        throw Error('API key must be a string!');
    }

    this.apikey = apikey;

    this.movies = new Movies(this);
    this.shows = new Shows(this);
    this.seasons = new Seasons(this);
    this.episodes = new Episodes(this);

    return this;
}

util.inherits(TMDB, Object);

Object.defineProperties(TMDB.prototype, { });

module.exports = TMDB;
