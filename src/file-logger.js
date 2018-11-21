/**
 * Created by im on 4/27/17.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const moment = require('moment');

const defaultDateFormat = 'DD_MM';

const helper = {
    createWriter: function () {
        if (this.writer) {
            this.writer.close();
        }

        const file = (path.join( this.options.dir, this.options.fileName ));

        this.writer = fs.createWriteStream( file, {
            flags:'a',
            encoding:'utf8'
        });
    },
    parseFileName: (options) => {
        if (options.fileNamePattern) {
            return options.fileNamePattern.replace(/<DATE>/, moment().format(options.dateFormat || defaultDateFormat));
        }
    },
    checkOptions: (options) => {
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
    }
};

class FileLogger {
    constructor (options) {
        if (options && options.fileNamePattern) {
            if (options.fileNamePattern.match(/<DATE>/)) {
                this.outputDate = moment();
                options.fileName = helper.parseFileName(options);
            }
        }

        this.options = helper.checkOptions(options);

        if (!fs.existsSync(this.options.dir)) {
            fs.mkdirSync(this.options.dir);
        }

        helper.createWriter.call(this);
    }

    log () {
        this.write("log", ...arguments);
    }
    warn () {
        this.write("warn", ...arguments);
    }
    error () {
        this.write("error", ...arguments);
    }
    info () {
        this.write("info", ...arguments);
    }
    write () {
        if (this.outputDate && !this.outputDate.isSame(moment(), 'day')) {
            this.options.fileName = helper.parseFileName(this.options);
            this.outputDate = moment();
            helper.createWriter.call(this);
        }
        this.writer.write(helper.formatMessage.apply(this, arguments));
    }
    end () {
        this.writer.end();
    }
}

module.exports = FileLogger;
