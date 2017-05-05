# simple-log-manager

[![Build Status](https://travis-ci.org/toxity/simple-log-manager.svg?branch=master)](https://travis-ci.org/toxity/simple-log-manager)
[![npm version](https://badge.fury.io/js/simple-log-manager.svg)](https://travis-ci.org/toxity/simle-log-manager)

> simple Node.js log manager with different outputs

## Install
```
$ npm install simple-log-manager
```

## Info
You can use 3 different output types:
1. File logger
2. Console logger
3. Dummy logger

Each logger has 4 methods for output - `log`, `warn`, `info`, `error`.

#### File logger
File loggers will write all output to file with logger name.

To create file logger you should specify logger name and 2 options:
`fileName` and `dir`.
> you can specify `fileNamePattern` instead of `fileName`:
```
    {
        fileNamePattern: "instance-<DATE>.log",
        dir: "../logs"
    }
```

Example:
```javascript
    var manager = require('simple-log-manager');

    var options = {
       fileNamePattern: "testName-<DATE>.log",
       dir: require('path').join(__dirname, "logs")
    }

    var logger = manager.createFileLogger("testName", options);

    // now you can use log methods:
    logger.log("Hello", "World", "!");
    logger.warn("Hello", "World", "!");
    logger.error("Hello", "World", "!");


    //output testName-05_07.log:

    14:19:38.038 LOG Hello World !
    14:19:38.040 WARN Hello World !
    14:19:38.041 ERROR Hello World !
```
---
#### Console logger
Console logger is simple js console instance. So all methods will output
to console.


Example:
```javascript
    var manager = require('simple-log-manager');
    var logger = manager.createConsoleLogger("testName");

    logger.log("Hello", "World", "!");   // => "Hello World !"
    logger.warn("Hello", "World", "!");  // => "Hello World !"
    logger.error("Hello", "World", "!"); // => "Hello World !"
```
---
#### Dummy logger
Name speaks for itself. It's dummy logger with all
log method which will do nothing.

Example:
```javascript
    var manager = require('simple-log-manager');
    var logger = manager.createDummyLogger("testName");

    logger.log("Hello", "World", "!");   // => nothing
    logger.warn("Hello", "World", "!");  // => nothing
    logger.error("Hello", "World", "!"); // => nothing
```
---

### Usage
You can create loggers in your entry file and get it deeper in your app

Example
```javascript
    //main.js
    var manager = require('simple-log-manager');

    manager.createConsoleLogger("console");
    manager.createConsoleLogger("file", {
        fileName: "test",
        dir: "logs"
    });


    //app.js
    var logger = require('simple-log-manager').get("console");

    //controller.js
    var logger = require('simple-log-manager').get("file");
```
> you can remove already created logger: `manager.remove(console)`


Also you can switch between different output types with
any condition, e.g. with environment variable.

Example:
```javascript
const logger = (() => {
    const manager = require('simple-log-manager');

    if (process.env.LOG && Boolean(process.env.LOG) === false) {
        return manager.createDummyLogger("instance");

    }

    if (Boolean(process.env.DEBUG)) {
        return manager.createConsoleLogger("instance");
    }

    return manager.createFileLogger("instance", {
        fileNamePattern: "instance-<DATE>.log",
        dir: require('path').join(__dirname, "..", "logs")
    })
})();


logger.log("app was started");
...
logger.error("something went wrong!")
```

In the example above all application logs will prints to file in `logs` dir.
But if you need to debug you can pass `DEBUG=true` to environment and vualá -
all output is in your console. Also you can pass `LOG=false` and all logs will
be disabled without any changes in source code.