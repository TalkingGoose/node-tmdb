/**
 * Created by Paul on 07/08/2016.
 */

'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var timeDiff = require('./time-diff');

module.exports = function (target, expire) {
    var cache = null;
    var lastRetrieval = null;
    var isPending = false;
    var queue = [];

    return function (callback) {
        if (isPending) {
            queue.push(callback);
            return;
        }

        if (cache !== null && timeDiff(lastRetrieval) < expire) {
            logger.debug('[CACHED]');
            callback.apply(undefined, _toConsumableArray(cache));
        }

        isPending = true;
        target.call(this, function () {
            for (var _len = arguments.length, results = Array(_len), _key = 0; _key < _len; _key++) {
                results[_key] = arguments[_key];
            }

            isPending = false;
            cache = results;

            var callback = null;
            while ((callback = queue.shift()) !== undefined) {
                logger.debug('[QUEUED]');
                callback.apply(undefined, _toConsumableArray(cache));
            }
        });
    };
};
//# sourceMappingURL=cached.js.map
