'use strict';

import { Listener } from '@src/components';

export class XMLHttpRequestWrapperLight extends Listener {

    private method: string;
    private url: string;
    private parameters: any;
    private requestType: string;
    private responseType: string;
    private generateFormData: any;
    private requestHeaders: any;
    private timeoutDuration: number;
    public xhr: any;

    private timeout;
    private responseHeaders;
    private completed;
    private aborted;

    constructor(public data: any) {

        super();
        
        if (typeof data !== 'object')
            throw new Error('Input data must be an Object, received: ' + typeof data);
        if (data.method !== 'GET' && data.method !== 'POST')
            throw new Error('Field "method" must be GET or POST, received: ' + data.method);
        if (typeof data.url !== 'string')
            throw new Error('Field "url" must be a String, received: ' + typeof data.url);

        this.method = data.method;
        this.url = data.url;
        this.parameters = typeof data.parameters === 'object' && data.parameters !== null ? data.parameters : {};
        this.requestType = data.requestType;
        this.responseType = data.responseType;
        this.generateFormData = data.generateFormData;
        this.requestHeaders = typeof data.headers === 'object' && data.headers !== null ? data.headers : {};
        this.timeoutDuration = typeof data.timeout === 'number' ? data.timeout : 75000;
    }

    /*
    **
    **
    */
    public send() : void {

        //======================
        //FORMATING URL AND BODY
        //======================

        let url: string = this.url;
        let body: any = undefined;

        if (this.method === 'GET') {
            url += '?' + this.getUrlEncodedParameters();
        }
        else {

            if (this.generateFormData) {

                let formData = new FormData();
                for (let key in this.parameters)
                    formData.append(key, this.parameters[key]);

                body = formData;
            }

            else if (['json', 'application/json'].includes(this.requestType))
                body = JSON.stringify(this.parameters);
            else
                body = this.getUrlEncodedParameters();
        }

        //=======
        //SENDING
        //=======

        this.xhr = new XMLHttpRequest();
        this.xhr.withCredentials = true;
        
        this.xhr.open(this.method, url);

        this.xhr.onreadystatechange = this.onReadyStateChange.bind(this);

        if (this.requestType)
            this.xhr.setRequestHeader("Content-type", this.requestType);
        else
            this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        for (let key in this.requestHeaders)
            this.xhr.setRequestHeader(key, this.requestHeaders[key]);

        if (this.responseType)
            this.xhr.responseType = this.responseType;

        this.xhr.send(body);

        this.timeout = setTimeout(this.onTimeout.bind(this), this.timeoutDuration);
    }

    /*
    **
    **
    */
    public abort() : void {

        if (this.xhr)
            this.xhr.abort();
    }

    /*
    **
    **
    */
    public getUrlEncodedParameters() : string {

        let parameters: any[] = [];

        for (let property in this.parameters) {
            let value = this.parameters[property];
            if (Array.isArray(value) || (typeof value === "object" && value !== null))
                value = JSON.stringify(value);
            let data = encodeURIComponent(property) + "=" + encodeURIComponent(value);
            parameters.push(data);
        }

        return parameters.join("&");
    }

    /*
    **
    **
    */
    public computeResponseHeaders() : void {

        let headers: any = {};

        let rawHeaders = this.xhr.getAllResponseHeaders();
        let split = rawHeaders.trim().split(/[\r\n]+/);

        split.forEach(function(line) {
            let parts = line.split(': ');
            let header = parts.shift();
            let value = parts.join(': ');
            headers[header] = value;
        });

        this.responseHeaders = headers;
    }

    /*
    **
    **
    */
    public onReadyStateChange(event: Event) : void {

        if (this.xhr.readyState === XMLHttpRequest.DONE) {

            let status = this.xhr.status;
    
            if (status === 0 || (status >= 200 && status < 400))
                this.onLoad(event);
            else
                this.onError(event);
        }
    }

    /*
    **
    **
    */
    public onTimeout() : void {

        this.completed = true;

        this.abort();
    }

    /*
    **
    **
    */
    public onComplete() : void {

        clearTimeout(this.timeout);

        this.computeResponseHeaders();
    }

    /*
    **
    **
    */
    public onLoad(event: Event) : void {

        if (this.aborted)
            return;

        this.onComplete();

        this.emit('load', {
            status: this.xhr.status,
            responseType: this.xhr.getResponseHeader('Content-Type'),
            response: this.xhr.response,
            headers: this.responseHeaders
        });
    }

    /*
    **
    **
    */
    public onError(event: Event) : void {

        if (this.aborted)
            return;
        
        this.onComplete();

        this.emit('error', {
            status: this.xhr.status,
            responseType: this.xhr.getResponseHeader('Content-Type'),
            response: this.xhr.response,
            headers: this.responseHeaders
        });
    }
};