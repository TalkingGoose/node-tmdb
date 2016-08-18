/**
 * Created by Paul on 07/08/2016.
 */

'use strict';

const timeDiff = require('./time-diff');

module.exports = function(target, expire) {
    let cache = null;
    let lastRetrieval = null;
    let isPending = false;
    let queue = [];

    return function(callback) {
        if (isPending) {
            queue.push(callback);
            return;
        }

        if (cache !== null && timeDiff(lastRetrieval) < expire) {
            logger.debug('[CACHED]');
            callback(...cache);
        }

        isPending = true;
        target.call(this, (...results) => {
            isPending = false;
            cache = results;

            let callback = null;
            while ((callback = queue.shift()) !== undefined) {
                logger.debug('[QUEUED]');
                callback(...cache);
            }
        });
    };
};
