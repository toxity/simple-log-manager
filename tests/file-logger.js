/**
 * Created by im on 4/27/17.
 */
const assert = require('assert');

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
        const fs = require('fs');
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
});
