/**
 * Created by im on 4/27/17.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const helper = {
    parseFileNamePattern: function (pattern, dateFormat) {
        if (pattern.match(/<DATE>/)) {
            return pattern.replace(/<DATE>/, moment().format( dateFormat || 'DD_MM'));
        }

        return pattern;
    },
    checkOptions: function (options) {
        const required = ["dir", "fileName"];
        if (!options || typeof options !== 'object') {
            throw Error ('Options should be specified');
        }
        for (const option of required) {
            if (!(option in options)) {
                throw Error (`Option should be specified - ${option}`);
            }
        }
        return options;
    },
    getTime: () => moment().format('HH:mm:ss.SSS'),
    formatMessage: function () {
        const type = arguments[0].toUpperCase() || "Unknown";

        const args = Array.prototype.slice.call(arguments, 1);

        let result = `${helper.getTime()} ${type}`;

        for (const argument of args) {
            result += ` ${argument}`;
        }
        return result+"\n";
    },
};

function FileLogger (options) {
    if (options.fileNamePattern) {
        options.fileName = helper.parseFileNamePattern(options.fileNamePattern, options.dateFormat);
    }

    this.options = helper.checkOptions(options);

    if (!fs.existsSync(this.options.dir)) {
        fs.mkdirSync(this.options.dir);
    }

    const file = path.join( this.options.dir, this.options.fileName );

    this.writer = fs.createWriteStream( file, {
        flags:'a',
        encoding:'utf8'
    });
}

FileLogger.prototype = {
    log: function () {
        this.write("log", ...arguments);
    },
    warn: function () {
        this.write("warn", ...arguments);
    },
    error: function () {
        this.write("error", ...arguments);
    },
    info: function () {
        this.write("info", ...arguments);
    },
    write: function () {
        this.writer.write(helper.formatMessage.apply(this, arguments));
    },
    end: function () {
        this.writer.end();
    }
};

module.exports = FileLogger;
