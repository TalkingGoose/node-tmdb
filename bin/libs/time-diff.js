/**
 * Created by Paul on 07/08/2016.
 */

'use strict';

module.exports = function (start) {
  var diff = process.hrtime(start);
  return diff[0] * 1e3 + diff[1] * 1e-6;
};
//# sourceMappingURL=time-diff.js.map
