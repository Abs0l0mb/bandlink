'use strict';

const http = require('http');

module.exports = class Response extends http.ServerResponse {

    constructor(...args) {

        super(...args);
    }

    isFinished() {

        return this.writableFinished || this.writableEnded;
    }
}