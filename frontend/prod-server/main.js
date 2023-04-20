'use strict';

const nodePath = require('path');

const HttpStaticServer = require('./classes/http/HttpStaticServer');
const Log = require('./classes/Log');

const port = process.argv[2];
const distDir = nodePath.resolve(__dirname, '../dist/prod');

const server = new HttpStaticServer();

server.server.on('error', console.log);

server.static(distDir);
server.listen(port, '0.0.0.0');

process.on('uncaughtException', function(error) {
    Log.printError(error);
});