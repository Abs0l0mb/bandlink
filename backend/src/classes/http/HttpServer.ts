'use strict';

import { HttpRequest, HttpResponse, HttpRequestLog, PublicError, Log } from '@src/classes';

import * as http from 'http';

export type MiddlewareCallback = (request: HttpRequest, response: HttpResponse, next: () => void) => Promise<void>; 
export type EndpointCallback = (request: HttpRequest, response: HttpResponse) => Promise<void>;

export interface Middleware {
    pattern: string,
    callback: MiddlewareCallback,
    method?: string | string[]
}

export interface Endpoint {
    method: string,
    pattern: string,
    wildcard?: boolean,
    callback: EndpointCallback
}

export class HttpServer {

    private wrapped: http.Server;
    private middlewares: Middleware[] = [];
    private endpoints: Endpoint[] = [];

    constructor() {

        this.wrapped = http.createServer({
            IncomingMessage: HttpRequest,
            ServerResponse: HttpResponse
        } as any, this.onHttpRequest.bind(this));
    }

    /*
    **
    **
    */
    protected async onHttpRequest(request: HttpRequest, response: HttpResponse) : Promise<void> {

        try {
            
            request.buildHeaders();
            request.buildURL();

            await request.extractGETParameters();
            await request.extractPOSTParameters();

            new HttpRequestLog(request, response);

            await this.processMiddlewares(request, response);

            if (response.isFinished()) return;
            if (await this.lookForEndpoint(request, response)) return;
            if (response.isFinished()) return;
            if (await this.lookForWildcardEndpoint(request, response)) return;
            if (response.isFinished()) return;

            throw new PublicError('endpoint-not-found');
        }
        catch(error) {

            if (typeof error === 'object'
             && error !== null
             && error.public
             && error.message) {
                response.sendErrorContent(error.message);
            }
            else {

                response.sendErrorContent('internal-error');

                Log.red(`ERROR on ${request.getURL().pathname}`);
                Log.printError(error);
            }
        }
    }

    /*
    **
    **
    */
    private async processMiddlewares(request: HttpRequest, response: HttpResponse) : Promise<void> {

        for (let middleware of this.middlewares) {

            if (request.getURL().pathname.indexOf(middleware.pattern) === 0) {
                
                if (typeof middleware.method === 'string' && request.method !== middleware.method)
                    continue;
                
                else if (Array.isArray(middleware.method) && request.method && !middleware.method.includes(request.method))
                    continue;
                    
                await new Promise(async function(resolve: any, reject: any) {
                    try {
                        await middleware.callback(request, response, resolve);
                    } catch(error) {
                        reject(error);
                    }
                });
            }
        }
    }

    /*
    **
    **
    */
    private async lookForEndpoint(request: HttpRequest, response: HttpResponse) : Promise<boolean> {

        for (let endpoint of this.endpoints) {

            if (request.method === endpoint.method 
             && request.getURL().pathname === endpoint.pattern) {

                await endpoint.callback(request, response);
                
                return true;
            }
        }

        return false;
    }

    /*
    **
    **
    */
    private async lookForWildcardEndpoint(request: HttpRequest, response: HttpResponse) : Promise<boolean> {

        for (let endpoint of this.endpoints) {

            if (request.method === endpoint.method 
             && request.getURL().pathname.indexOf(endpoint.pattern) === 0 
             && endpoint.wildcard) {

                await endpoint.callback(request, response);
                
                return true;
            }
        }

        return false;
    }

    /*
    **
    **
    */
    private addMiddleware(pattern: string, callback: MiddlewareCallback, method?: string | string[]) : void {

        this.middlewares.push({
            pattern: pattern,
            callback: callback,
            method: method
        });
    }

    /*
    **
    **
    */
    private addEndpoint(method: string, pattern: string, callback: EndpointCallback) : void {

        let wildcard = false;
        
        if (pattern.slice(-1) === '*') {
            wildcard = true;    
            pattern = pattern.slice(0, -1);
        }

        if (pattern.slice(-1) === '/')
            pattern = pattern.slice(0, -1);

        this.endpoints.push({
            method: method,
            pattern: pattern,
            wildcard: wildcard,
            callback: callback
        });
    }

    /*
    **
    **
    */
    public use(pattern: string, middleware: MiddlewareCallback | MiddlewareCallback[], method?: string | string[]) : HttpServer {
        
        if (Array.isArray(middleware)) {
            for (let middleware_ of middleware)
                this.use(pattern, middleware_);
            return this;
        }

        this.addMiddleware(pattern, middleware, method);
        
        return this;
    }

    /*
    **
    **
    */
    public options(pattern: string, callback: EndpointCallback, middleware?: MiddlewareCallback | MiddlewareCallback[]) : HttpServer {
        
        const method = 'OPTIONS';

        this.addEndpoint(method, pattern, callback);

        if (middleware)
            this.use(pattern, middleware, method);

        return this;
    }

    /*
    **
    **
    */
    public get(pattern: string, callback: EndpointCallback, middleware?: MiddlewareCallback | MiddlewareCallback[]) : HttpServer {

        const method = 'GET';

        this.addEndpoint(method, pattern, callback);

        if (middleware)
            this.use(pattern, middleware, method);

        return this;
    }

    /*
    **
    **
    */
    public post(pattern: string, callback: EndpointCallback, middleware?: MiddlewareCallback | MiddlewareCallback[]) : HttpServer {

        const method = 'POST';

        this.addEndpoint(method, pattern, callback);

        if (middleware)
            this.use(pattern, middleware, method);

        return this;
    }

    /*
    **
    **
    */
    public listen(port: number = 8080, host?: string) : void {

        this.wrapped.listen(port, host, function() {
            Log.green(`HTTP Server listening on ${port}`);
        });
    }
}