/**
 * Created by im on 4/26/17.
 */
const assert = require('assert');

const manager = require('./../index');

describe('log-manager', () => {
    
    describe('console-logger', () => {

        describe('create', () => {
            after(() => {
                manager.delete('logger');
            });

            it('should create new logger', () => {
                const logger = manager.createConsoleLogger("logger");
                assert.equal(logger.name, "logger");
            });

            it('should throw during creating of existed logger', () => {
                assert.throws(() => manager.createConsoleLogger("logger"));
            });
        });

        describe('delete', () => {
            beforeEach(() => {
                manager.createConsoleLogger('logger');
            });

            it('should delete existed logger', () => {
                manager.delete("logger");
                assert.equal(manager.get("logger"), null);
            });
        });

        describe('get', () => {
            after(() => {
                manager.delete('logger');
            });

            it("should return null if can't find logger by name", () => {
                assert.equal(manager.get("logger"), null);
            });

            it('should return logger by name', () => {
                manager.createConsoleLogger("logger");

                const logger = manager.get("logger");
                assert.equal(logger.name, "logger");
            });
        });
    });

    describe('file-logger', () => {
        function getFileLoader () {
            const path = require('path');
            const dir = path.join(__dirname, '..', 'logs');

            return manager.createFileLogger("logger", { dir: dir, fileName: "test.log"})
        }

        describe('create', () => {
            after(() => {
                manager.delete('logger');
            });

            it('should create new logger', () => {
                const logger = getFileLoader();
                assert.equal(logger.name, "logger");
            });

            it('should throw during creating of existed logger', () => {
                assert.throws(() => getFileLoader());
            });
        });

        describe('delete', () => {
            beforeEach(getFileLoader);

            it('should delete existed logger', () => {
                manager.delete("logger");
                assert.equal(manager.get("logger"), null);
            });
        });

        describe('get', () => {
            after(() => {
                manager.delete('logger');
            });

            it("should return null if can't find logger by name", () => {
                assert.equal(manager.get("logger"), null);
            });

            it('should return logger by name', () => {
                getFileLoader();

                const logger = manager.get("logger");
                assert.equal(logger.name, "logger");
            });
        });
    });

    describe('dummy-logger', () => {
        it('should return dummy logger', () => {
            const logger = manager.createDummyLogger("logger");
            assert.notEqual(logger.log, undefined);
        });
    });
});