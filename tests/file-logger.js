/**
 * Created by im on 4/27/17.
 */
const assert = require('assert');
const moment = require('moment');
const fs = require('fs');

const FileLogger = require('./../lib/file-logger');

describe('file-logger', () => {
    const path = require('path');
    const logsDir = path.join(__dirname, "..", "logs");
    const logsFile = path.join(logsDir, "test.log");

    const options = {
        dir: logsDir,
        fileName: "test.log"
    };

    afterEach(() => {
        if (fs.existsSync(logsFile)) {
            fs.unlinkSync(logsFile);
        }
    });

    it('should create new file-logger', () => {
        const logger = new FileLogger(options);
        assert.notEqual(logger.writer, undefined);
    });

    it('should throws without options', () => {
        assert.throws(() => {
            new FileLogger();
        })
    });

    it ('should create logger file by pattern', () => {
        const expectedName = `test-${moment().format('DD_MM')}.log`;
        const pathToFile = path.join(logsDir, expectedName);

        const logger = new FileLogger({
            dir: logsDir,
            fileNamePattern: "test-<DATE>.log"
        });

        assert.notEqual(logger.writer, undefined);

        return logger.writer.on('open', function () {
            assert.equal(fs.existsSync(pathToFile), true);
        });
    });

    it ('should create logger file by pattern with date format', () => {
        const format = "DD-MM-YYYY";
        const expectedName = `test-${moment().format(format)}.log`;
        const pathToFile = path.join(logsDir, expectedName);

        const logger = new FileLogger({
            dir: logsDir,
            fileNamePattern: "test-<DATE>.log",
            dateFormat: format
        });

        assert.notEqual(logger.writer, undefined);

        return logger.writer.on('open', function () {
            assert.equal(fs.existsSync(pathToFile), true);
            fs.unlinkSync(pathToFile);
        });
    });

    it.skip ('should create new file when next date come', () => {
        //TODO think about how to test it
    })
});
