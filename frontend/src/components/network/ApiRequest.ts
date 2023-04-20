'use strict';

import {
    HttpRequest,
    Tools
} from '@src/components';

export class ApiRequest extends HttpRequest {

    private RES_STATID;
    private REQ_STATID;
    private LOC_STATID;
    private regularAuthProcess;
    private responseJSON;
    
    constructor(data) {

        super(data);

        this.RES_STATID = 'x-stat';
        this.REQ_STATID = 'x-stat';
        this.LOC_STATID = 'build';

        this.regularAuthProcess = typeof this.data.regularAuthProcess === 'boolean' ? this.data.regularAuthProcess : true;

        if (this.regularAuthProcess)
            this.addRequestHeaders();
    }

    /*
    **
    **
    */
    public onLoad(data: any) : void {

        this.terminated = true;

        this.computeResponseJSON(data);
        
        if (this.responseJSON.error) {
            this.emitError(this.responseJSON.content);
            return;
        }

        if (this.regularAuthProcess)
            this.extractResponseHeaders(data);

        this.emit('load', this.responseJSON.content);
    }

    /*
    **
    **
    */
    public onError(data: any) : void {

        this.terminated = true;

        if (this.computeResponseJSON(data)) {

            if (this.responseJSON.error && typeof this.responseJSON.content === 'string') {
                
                if (this.regularAuthProcess)
                    this.extractResponseHeaders(data);

                this.emitError(this.responseJSON.content);
                return;
            }
        }
        
        this.emitError('api-request-error');
    }

    /*
    **
    **
    */
    private emitError(data: any) : void {

        this.emit('error', data);
    }

    /*
    **
    **
    */
    private computeResponseJSON(data) : boolean {

        if (this.responseJSON)
            return true;

        try {
            this.responseJSON = JSON.parse(data.response);
            return true;
        } catch(error) {
            return false;
        }
    }

    /*
    **
    **
    */
    private addRequestHeaders() : void {

        this.request.requestHeaders[this.REQ_STATID] = this.getReqStatId();
    }

    /*
    **
    **
    */
    private extractResponseHeaders(data) : void {

        let statId = data.headers[this.RES_STATID];

        if (statId)
            this.setStatId(statId);
    }

    /*
    **
    **
    */
    private getTemporaryId() : string {

        return Date.now().toString() + Math.random().toString();
    }

    /*
    **
    **
    */
    private getStatId() : string {

        let statId = localStorage.getItem(this.LOC_STATID);

        if (statId !== null)
            return statId;
        else {
            statId = this.getTemporaryId();
            this.setStatId(statId);
            return statId;
        }
    }

    /*
    **
    **
    */
    private setStatId(id) : any {

        return localStorage.setItem(this.LOC_STATID, id);
    }

    /*
    **
    **
    */
    private getReqStatId() : any {

        return Tools.sha256(this.getStatId());
    }
}