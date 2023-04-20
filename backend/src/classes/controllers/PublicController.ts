'use strict';

import {
    BackendServer,
    HttpRequest,
    HttpResponse,
    PublicError,
    Sessions,
    User
} from '@src/classes';

import { readFileSync } from 'fs';
import { randomBytes } from 'crypto';

export class PublicController {

    constructor(server: BackendServer) {

        server.post('/login', this.login);

        server.get('/random-hex', this.sendRandomHex);

        server.get('/service-worker', this.getServiceWorkerScript);

        //server.get('/patch-reports', this.patchReports);
    }

    /*
    **
    **
    */
    private async login(request: HttpRequest, response: HttpResponse) : Promise<void> {
        
        const sessions = new Sessions();

        if (await sessions.login(request, response)) {

            response.sendSuccessContent();
        }
        else
            throw new PublicError('unknown-credentials');
    }

    /*
    **
    **
    */
    private async sendRandomHex(request: HttpRequest, response: HttpResponse) : Promise<void> {
        
        response.sendText(randomBytes(100*100*100).toString('hex')); //2 MB
    }

    /*
    **
    **
    */
    private async getServiceWorkerScript(request: HttpRequest, response: HttpResponse) : Promise<void> {

        response.sendContent('text/javascript', readFileSync(`${process.cwd()}/src/browser-scripts/service-worker.js`));
    }
}