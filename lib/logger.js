/**
 * Created by im on 4/26/17.
 */
'use strict';

var logger = require('simple-node-logger');

var loggers = [];
var outputs = ["console", "file"];
var default_output = "file";

function checkOutput(output) {
    if (!~outputs.indexOf(output)) {
        throw Error("Invalid output type");
    }
    return true;
}

function Logger(name, output) {
    this.name = name;

    if (!output) {
        this.type = default_output;
    } else {
        checkOutput(output);
        this.type = output;
    }

    if (this.type === "file") {
        var fs = require("fs");
        var path = require("path");
        var logsDir = path.join(__dirname, '..', 'logs');

        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir);
        }

        this.logger = logger.createRollingFileLogger({
            logDirectory: logsDir,
            fileNamePattern: name + '-<DATE>.log',
            dateFormat: 'DD.MM.YYYY'
        });

        this.logger.info("---------------- START OF NEW OUTPUT ----------------");
    }
}

Logger.prototype = {
    isFile: function isFile() {
        return this.type === 'file';
    },
    log: function log() {
        if (this.isFile()) {
            return this.logger.info.apply(this.logger, arguments);
        }
        console.log.apply(console, arguments);
    },
    warn: function warn() {
        if (this.isFile()) {
            return this.logger.warn.apply(this.logger, arguments);
        }
        console.warn.apply(console, arguments);
    },
    error: function error() {
        if (this.isFile()) {
            return this.logger.error.apply(this.logger, arguments);
        }
        console.error.apply(console, arguments);
    },
    info: function info() {
        if (this.isFile()) {
            return this.logger.info.apply(this.logger, arguments);
        }
        console.info.apply(console, arguments);
    }
};

module.exports = {
    get: function get(name) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = loggers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _logger = _step.value;

                if (_logger.name === name) {
                    return _logger;
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

        return null;
    },
    create: function create(name, isConsole) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = loggers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _logger2 = _step2.value;

                if (_logger2.name === name) {
                    throw Error("Trying to create already existed logger " + name);
                }
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

        var logger = new Logger(name, isConsole);
        loggers.push(logger);
        return logger;
    },
    changeOutput: function changeOutput(value) {
        checkOutput(value);
        default_output = value;
    }
};
//# sourceMappingURL=logger.js.map