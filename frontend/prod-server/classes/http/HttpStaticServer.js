'use strict';

const http = require('http');
const fs = require('fs');
const nodepath = require('path');

const Request = require('./HttpRequest');
const Response = require('./HttpResponse');
const RequestLogger = require('./HttpRequestLogger');

const Log = require('../Log');

module.exports = class Server {

    constructor() {

        this.server = http.createServer({
            IncomingMessage: Request,
            ServerResponse: Response
        }, this.onRequest.bind(this));

        this.staticDirectories = {};
    }

    /*
    **
    **
    */
    async onRequest(request, response) {

        if (request.method !== 'GET')
            return;
            
        request.decomposeUrl();

        new RequestLogger(request, response);

        if (!this.lookForStaticFile(request, response)) {
            
            if (!this.serveOtherPath('/', response)) {

                response.writeHead(404);
                response.end('not found', 'utf-8');
            }
        }
    }

    /*
    **
    **
    */
    lookForStaticFile(request, response) {

        for (let directoryPath in this.staticDirectories) {

            for (let file of this.staticDirectories[directoryPath]) {

                if (file.path === request.builtUrl.pathname) {

                    if (!file.content)
                        file.content = fs.readFileSync(file.filePath);

                    response.writeHead(200, {
                        'Content-Type': file.mime,
                        'Content-Length': file.content.byteLength
                    });

                    response.end(file.content, 'utf-8');

                    return true;
                }
            }
        }

        return false;
    }

    /*
    **
    **
    */
    serveOtherPath(path, response) {

        for (let directoryPath in this.staticDirectories) {

            for (let file of this.staticDirectories[directoryPath]) {

                if (file.path === path) {

                    if (!file.content)
                        file.content = fs.readFileSync(file.filePath);

                    response.writeHead(200, {
                        'Content-Type': file.mime,
                        'Content-Length': file.content.byteLength
                    });

                    response.end(file.content, 'utf-8');

                    return true;
                }
            }
        }

        return false;
    }

    /*
    **
    **
    */
    getMime(extname) {

        return {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.ico': 'image/x-icon',
            '.manifest': 'application/manifest+json'
        }[extname];
    }

    /*
    **
    **
    */
    aspireDirectory(
        directoryPath, 
        memoryLimit,
        memoryLimitPerFile,
        files = [], 
        cachedSize = 0,
        treePosition = '/') {
        
        if (!fs.existsSync(directoryPath) || !fs.lstatSync(directoryPath).isDirectory())
            return;

        for (let entryName of fs.readdirSync(directoryPath)) {
            
            let entryPath = nodepath.resolve(directoryPath, entryName);
            let entryStat = fs.lstatSync(entryPath);

            if (entryStat.isFile()) {

                let mime = this.getMime(nodepath.extname(entryName));
                
                if (!mime)
                    continue;

                let content = null;

                if (cachedSize + entryStat.size < memoryLimit && entryStat.size < memoryLimitPerFile) {
                    content = fs.readFileSync(entryPath);
                    cachedSize += entryStat.size;
                }

                if (entryName === 'index.html')
                    entryName = '';

                files.push({
                    path: `${treePosition}${entryName}`,
                    filePath: entryPath,
                    mime: mime,
                    content: content
                });
            }
            else if (entryStat.isDirectory()) {

                this.aspireDirectory(
                    entryPath, 
                    memoryLimit,
                    memoryLimitPerFile,
                    files, 
                    cachedSize,
                    `${treePosition}${entryName}/`);
            }
        }

        return files;
    }

    /*
    **
    **
    */
    static(
        directoryPath, 
        memoryLimit = 1000 * 1000 * 1000 /*1GB*/,
        memoryLimitPerFile = 1000 * 1000 * 5 /*5MB*/) {

        let data = this.aspireDirectory(directoryPath, memoryLimit, memoryLimitPerFile);

        this.staticDirectories[directoryPath] = data;
    }

    /*
    **
    **
    */
    clearStatics() {

        this.staticDirectories = [];
    }

    /*
    **
    **
    */
    listen(port = 80, arg2 = undefined) {

        this.server.listen(port, arg2, function() {

            Log.green(`Http server listening on ${port}`);
        });
    }

    /*
    **
    **
    */
    async close() {

        if (!this.server || !this.server.listening)
            return;

        await new Promise(function(resolve) {
            this.server.close(resolve);
        }.bind(this));

        Log.green('Http server closed');
    }
}