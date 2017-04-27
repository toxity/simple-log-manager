/**
 * Created by im on 4/26/17.
 */
'use strict';

var loggers = [];
var outputs = ["console", "file"];
var default_output = "file";

function checkOutput(output) {
    if (!~outputs.indexOf(output)) {
        throw Error("Invalid output type");
    }
    return true;
}

function Logger(name, outputType, fileLoggerOptions) {
    this.name = name;

    if (!outputType) {
        this.type = default_output;
    } else {
        checkOutput(outputType);
        this.type = outputType;
    }

    if (this.type === "file") {
        var fs = require("fs");
        var FileLogger = require("./file-logger");

        this.logger = new FileLogger(fileLoggerOptions);

        if (!fs.existsSync(fileLoggerOptions.dir)) {
            fs.mkdirSync(fileLoggerOptions.dir);
        }
    } else {
        this.logger = console;
    }
}

Logger.prototype = {
    terminate: function terminate() {
        if ("end" in this.logger) {
            this.logger.end();
        }
    },
    log: function log() {
        this.logger.log.apply(this.logger, arguments);
    },
    warn: function warn() {
        this.logger.warn.apply(this.logger, arguments);
    },
    error: function error() {
        this.logger.error.apply(this.logger, arguments);
    },
    info: function info() {
        this.logger.info.apply(this.logger, arguments);
    }
};

var create = function create(name, type, options) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = loggers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _logger = _step.value;

            if (_logger.name === name) {
                throw new Error("Trying to create already existed logger " + name);
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

    var logger = new Logger(name, type, options);
    loggers.push(logger);
    return logger;
};

module.exports = {
    get: function get(name) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = loggers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var logger = _step2.value;

                if (logger.name === name) {
                    return logger;
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

        return null;
    },

    createFileLogger: function createFileLogger(name, options) {
        return create(name, "file", options);
    },

    createConsoleLogger: function createConsoleLogger(name) {
        return create(name, "console");
    },

    createDummyLogger: function createDummyLogger() {
        return {
            log: function log() {},
            warn: function warn() {},
            error: function error() {},
            info: function info() {}
        };
    },

    delete: function _delete(name) {
        for (var i = 0; i < loggers.length; i++) {
            var logger = loggers[i];
            if (logger.name === name) {
                if ("end" in logger) {
                    logger.end();
                }
                loggers.splice(i, 1);
            }
        }
    }
};