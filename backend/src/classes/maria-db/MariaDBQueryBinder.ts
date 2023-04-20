'use strict';

import { Tools } from '../Tools';

export class MariaDBQueryBinder {

    private params: any = {};

    /*
    **
    **
    */
    public addParam(value: any) : string {

        const name = Tools.uid(16);

        if (value === undefined)
            value = '';
            
        this.params[name] = value;

        return `:${name}`;
    }

    /*
    **
    **
    */
    public getParams() : any[] {

        return this.params;
    }
}