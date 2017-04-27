/**
 * Created by im on 4/26/17.
 */
'use strict';
const loggers = [];
const outputs = ["console", "file"];
const default_output = "file";

function checkOutput (output) {
    if (!~outputs.indexOf(output)) {
        throw Error ("Invalid output type");
    }
    return true;
}

function Logger (name, outputType, fileLoggerOptions) {
    this.name = name;

    if (!outputType) {
        this.type = default_output;
    } else {
        checkOutput(outputType);
        this.type = outputType;
    }

    if (this.type === "file") {
        const fs = require("fs");
        const FileLogger = require("./file-logger");

        this.logger = new FileLogger(fileLoggerOptions);

        if (!fs.existsSync(fileLoggerOptions.dir)) {
            fs.mkdirSync(fileLoggerOptions.dir);
        }
    } else {
        this.logger = console;
    }
}

Logger.prototype = {
    terminate: function () {
        if ("end" in this.logger) {
            this.logger.end();
        }
    },
    log: function () {
        this.logger.log.apply(this.logger, arguments);
    },
    warn: function () {
        this.logger.warn.apply(this.logger, arguments);
    },
    error: function () {
         this.logger.error.apply(this.logger, arguments);
    },
    info: function () {
        this.logger.info.apply(this.logger, arguments);
    }
};

const create = function (name, type, options) {
    for (const logger of loggers) {
        if (logger.name === name) {
            throw new Error ("Trying to create already existed logger "+name);
        }
    }

    const logger = new Logger(name, type, options);
    loggers.push(logger);
    return logger;
};

module.exports = {
    get: function (name) {
        for (const logger of loggers) {
            if (logger.name === name) {
                return logger;
            }
        }
        return null;
    },

    createFileLogger: function (name, options) {
        return create(name, "file", options);
    },

    createConsoleLogger: function (name) {
        return create(name, "console");
    },

    createDummyLogger: function () {
        return {
            log : () => {},
            warn : () => {},
            error : () => {},
            info : () => {}
        }
    },

    delete: function (name) {
        for (let i = 0; i < loggers.length; i++ ) {
            const logger = loggers[i];
            if (logger.name === name) {
                if ("end" in logger) {
                    logger.end();
                }
                loggers.splice(i, 1);
            }
        }
    }
};