/**
 * Created by Paul on 07/08/2016.
 */

'use strict';

module.exports = function(start) {
    let diff = process.hrtime(start);
    return ((diff[0] * 1e3) + (diff[1] * 1e-6));
};
