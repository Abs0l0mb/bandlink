'use strict';

import {
    HttpRequest,
    ClientLocation
} from '@src/components';

export class ImageRequest extends HttpRequest {

    protected url: string;
    protected options: any;
    protected responseType: string;
    protected localURL: string;

    constructor(url: string, options: any = {}) {

        options = typeof options === 'object' && options !== null ? options : {};

        let responseType;

        if (options.responseAs === 'dataURL')
            responseType = 'arraybuffer';
        else
            responseType = 'blob';

        super({
            method: 'GET',
            url: url,
            responseType: responseType
        });

        this.url = url;
        this.options = options;
        this.responseType = responseType;
    }

    /*
    **
    **
    */
    public send() : void {
        
        if (typeof ClientLocation.get().localURLSCache === 'object' 
            && ClientLocation.get().localURLSCache !== null
            && ClientLocation.get().localURLSCache[this.url]) {
            
            this.emit('localURL', ClientLocation.get().localURLSCache[this.url]);
        }
        else
            super.send();
    }

    /*
    **
    **
    */
    public onLoad(data: any) : void {

        if (this.options.responseAs === 'dataURL') {

            let codes = new Uint8Array(data.response);
            let binary = String.fromCharCode.apply(null, codes);
            let base64 = btoa(binary);

            this.localURL = `data:${data.responseType};base64,${base64}`;
        }
        else
            this.localURL = URL.createObjectURL(data.response);
        
        if (typeof ClientLocation.get().localURLSCache !== 'object' || ClientLocation.get().localURLSCache === null)
            ClientLocation.get().localURLSCache = {};

        ClientLocation.get().localURLSCache[this.url] = this.localURL;

        this.emit('localURL', this.localURL);
    }
}