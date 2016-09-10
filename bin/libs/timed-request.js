/**
 * Created by Paul on 07/08/2016.
 */

'use strict';

var util = require('util');
var request = require('request');
var TypeOf = require('typeof');
var timeDiff = require('./time-diff');

var REQUEST_QUEUE = [];
var REQUEST_PENDING = false;
var REQUEST_LAST = null;

function TimedRequest(options, callback) {
    REQUEST_QUEUE.push({ options: options, callback: callback });

    if (!REQUEST_PENDING) {
        REQUEST_PENDING = true;

        if (REQUEST_LAST === null) {
            return process.nextTick(TimedRequest.consume);
        }

        var diff = timeDiff(REQUEST_LAST);
        if (diff >= TimedRequest.duration()) {
            return process.nextTick(TimedRequest.consume);
        }

        setTimeout(TimedRequest.consume, TimedRequest.duration() - diff);
    }
}

util.inherits(TimedRequest, Object);

Object.defineProperties(TimedRequest, {
    'consume': {
        'value': function value() {
            REQUEST_PENDING = true;

            var data = REQUEST_QUEUE.shift();

            // Enforce a minimum time constraint (can take longer)
            TimedRequest.timed(TimedRequest.duration(), function (callback) {
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
        'value': function value(duration, operation, callback) {
            var start = process.hrtime();

            operation.call(null, function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                var time = timeDiff(start);
                if (time >= duration) {
                    return callback.call.apply(callback, [null].concat(args));
                }

                setTimeout(function () {
                    return callback.call.apply(callback, [null].concat(args));
                }, duration - time);
            });
        }
    },

    'duration': {
        'value': function value(_value) {
            if (TypeOf.isNumber(_value)) {
                TimedRequest._duration = _value;
            }

            return TimedRequest._duration;
        }
    }
});

// Default duration
TimedRequest.duration(350);

module.exports = TimedRequest;
//# sourceMappingURL=timed-request.js.map
