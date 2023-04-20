'use strict';

import { Client } from '@src/components';

export class ClientLocation {

    private static client: Client | any;

    /*
    **
    **
    */
    static set(client: Client | any) : void {
        
        ClientLocation.client = client;
    }

    /*
    **
    **
    */
    static get() : Client | any {

        return ClientLocation.client;
    }
};