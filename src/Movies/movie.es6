/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

const util = require('util');

function Movie(data) {
    if (!(this instanceof Movie)) {
        return new Movie(data);
    }

    Movie.super_.call(this);

    this.data = data;

    return this;
}

util.inherits(Movie, Object);

Object.defineProperties(Movie.prototype, { });

module.exports = Movie;
