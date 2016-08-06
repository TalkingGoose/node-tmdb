/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

class Timed {
    static Enforce(duration, operation, callback, context = null) {
        let start = process.hrtime();

        operation.call(context, (...args) => {
            let diff = process.hrtime(start);
            let time = ((diff[0] * 1e3) + (diff[1] * 1e-6));

            if (time > duration) {
                return callback.call(context, ...args);
            }

            setTimeout(() => {
                return callback.call(context, ...args);
            }, duration - time);
        });
    }
}

module.exports = Timed;

