/**
 * Created by Paul on 06/08/2016.
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Timed = function () {
    function Timed() {
        _classCallCheck(this, Timed);
    }

    _createClass(Timed, null, [{
        key: 'Enforce',
        value: function Enforce(duration, operation, callback) {
            var context = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

            var start = process.hrtime();

            operation.call(context, function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                var diff = process.hrtime(start);
                var time = diff[0] * 1e3 + diff[1] * 1e-6;

                if (time > duration) {
                    return callback.call.apply(callback, [context].concat(args));
                }

                setTimeout(function () {
                    return callback.call.apply(callback, [context].concat(args));
                }, duration - time);
            });
        }
    }]);

    return Timed;
}();

module.exports = Timed;
//# sourceMappingURL=timed.js.map
