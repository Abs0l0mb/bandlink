'use strict';

import {
    Listener,
    XMLHttpRequestWrapperLight,
    Tools
} from '@src/components';

export class HttpRequest extends Listener {

    public id: string = Tools.uid();
    public request: any;
    public terminated: boolean = false;

    constructor(public data) {

        super();
        
        this.request = new XMLHttpRequestWrapperLight(this.data);

        this.request.on('load', this.onLoad.bind(this));
        this.request.on('error', this.onError.bind(this));
    }

    /*
    **
    **
    */
    send() {

        this.request.send();
    }

    /*
    **
    **
    */
    abort() {

        if (this.request)
            this.request.abort();
    }

    /*
    **
    **
    */
    onLoad(data) {

        this.terminated = true;

        this.emit('load', data);
    }

    /*
    **
    **
    */
    onError(data) {

        this.terminated = true;

        this.emit('error', data);
    }
}