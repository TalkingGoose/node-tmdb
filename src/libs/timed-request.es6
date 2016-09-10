/**
 * Created by Paul on 07/08/2016.
 */

'use strict';

const util = require('util');
const request = require('request');
const TypeOf = require('typeof');
const timeDiff = require('./time-diff');

let REQUEST_QUEUE = [];
let REQUEST_PENDING = false;
let REQUEST_LAST = null;

function TimedRequest(options, callback) {
    REQUEST_QUEUE.push({ options, callback });

    if (!REQUEST_PENDING) {
        REQUEST_PENDING = true;

        if (REQUEST_LAST === null) {
            return process.nextTick(TimedRequest.consume);
        }

        let diff = timeDiff(REQUEST_LAST);
        if (diff >= TimedRequest.duration()) {
            return process.nextTick(TimedRequest.consume);
        }

        setTimeout(TimedRequest.consume, TimedRequest.duration() - diff);
    }
}

util.inherits(TimedRequest, Object);

Object.defineProperties(TimedRequest, {
    'consume': {
        'value': function() {
            REQUEST_PENDING = true;

            let data = REQUEST_QUEUE.shift();

            // Enforce a minimum time constraint (can take longer)
            TimedRequest.timed(TimedRequest.duration(), (callback) => {
                request(data.options, callback);

                REQUEST_PENDING = false;
                REQUEST_LAST = process.hrtime();
                if (REQUEST_QUEUE.length > 0) {
                    REQUEST_PENDING = true;
                    process.nextTick(TimedRequest.consume);
                }
            }, data.callback);
        }
    },

    'timed': {
        'value': function(duration, operation, callback) {
            let start = process.hrtime();

            operation.call(null, (...args) => {
                let time = timeDiff(start);
                if (time >= duration) {
                    return callback.call(null, ...args);
                }

                setTimeout(() => {
                    return callback.call(null, ...args);
                }, duration - time);
            });
        }
    },

    'duration': {
        'value': function(value) {
            if (TypeOf.isNumber(value)) {
                TimedRequest._duration = value;
            }

            return TimedRequest._duration;
        }
    }
});

// Default duration
TimedRequest.duration(350);

module.exports = TimedRequest;
