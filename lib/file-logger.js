/**
 * Created by im on 4/27/17.
 */
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var fs = require('fs');
var path = require('path');
var moment = require('moment');

var helper = {
    parseFileNamePattern: function parseFileNamePattern(pattern, dateFormat) {
        if (pattern.match(/<DATE>/)) {
            return pattern.replace(/<DATE>/, moment().format(dateFormat || 'DD_MM'));
        }

        return pattern;
    },
    checkOptions: function checkOptions(options) {
        var required = ["dir", "fileName"];
        if (!options || (typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
            throw Error('Options should be specified');
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = required[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var option = _step.value;

                if (!(option in options)) {
                    throw Error('Option should be specified - ' + option);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return options;
    },
    getTime: function getTime() {
        return moment().format('HH:mm:ss.SSS');
    },
    formatMessage: function formatMessage() {
        var type = arguments[0].toUpperCase() || "Unknown";

        var args = Array.prototype.slice.call(arguments, 1);

        var result = helper.getTime() + ' ' + type;

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = args[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var argument = _step2.value;

                result += ' ' + argument;
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return result + "\n";
    }
};

function FileLogger(options) {
    if (options.fileNamePattern) {
        options.fileName = helper.parseFileNamePattern(options.fileNamePattern, options.dateFormat);
    }

    this.options = helper.checkOptions(options);

    if (!fs.existsSync(this.options.dir)) {
        fs.mkdirSync(this.options.dir);
    }

    var file = path.join(this.options.dir, this.options.fileName);

    this.writer = fs.createWriteStream(file, {
        flags: 'a',
        encoding: 'utf8'
    });
}

FileLogger.prototype = {
    log: function log() {
        this.write.apply(this, ["log"].concat(Array.prototype.slice.call(arguments)));
    },
    warn: function warn() {
        this.write.apply(this, ["warn"].concat(Array.prototype.slice.call(arguments)));
    },
    error: function error() {
        this.write.apply(this, ["error"].concat(Array.prototype.slice.call(arguments)));
    },
    info: function info() {
        this.write.apply(this, ["info"].concat(Array.prototype.slice.call(arguments)));
    },
    write: function write() {
        this.writer.write(helper.formatMessage.apply(this, arguments));
    },
    end: function end() {
        this.writer.end();
    }
};

module.exports = FileLogger;
//# sourceMappingURL=file-logger.js.map