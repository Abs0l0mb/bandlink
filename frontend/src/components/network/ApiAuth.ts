'use strict';

import {
    Listener,
    Api
} from '@src/components';

export interface ApiAuthData {
    loggedIn: boolean;
    adminRights: string[];
    accessRights: string[];
    [key: string]: any;
}

export class ApiAuth extends Listener {

    public data: ApiAuthData = {
        loggedIn: false,
        adminRights: [],
        accessRights: []
    }

    constructor() {

        super();
    }

    /*
    **
    **
    */
    public async check() : Promise<void> {

        if (!Api.isLocallyLoggedIn())
            return this.emit('logged-out');

        try {

            let data = await Api.get('/me');

            data.adminRights = data.ADMIN_RIGHT_NAMES ? data.ADMIN_RIGHT_NAMES.split(',') : [];
            data.accessRights = data.ACCESS_RIGHT_NAMES ? data.ACCESS_RIGHT_NAMES.split(',') : [];

            data.loggedIn = true;

            this.data = data;
            
            this.emit('logged-in');

        } catch(error) {

            console.error('[apiAuth.check Error] ->', error);

            this.data = {
                loggedIn: false,
                adminRights: [],
                accessRights: []
            }

            this.emit('logged-out');
        }
    }
}