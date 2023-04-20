'use strict';

import { MariaDB, MariaDBQueryBinder, MariaDBSimpleSelect } from '@src/classes';

export class MariaDBTable {

    constructor(public table: string) {}

    /*
    **
    **
    */
    public async insert(data: any) : Promise<number> {

        const binder = new MariaDBQueryBinder();

        const columns: string[] = [];
        const values: string[] = [];

        for (let column in data) {
            if (data[column] === undefined)
                delete data[column];
        }

        for (let column in data) {
            
            columns.push(`${column}`);
            values.push(binder.addParam(data[column]));
        }

        const query = `INSERT INTO ${this.table} (${columns.join(', ')}) VALUES (${values.join(', ')})`;
        const response = await MariaDB.exec(query, binder.getParams());

        //https://mariadb.com/kb/en/connector-nodejs-promise-api/#json-result-sets
        return response.insertId;
    }
    
    /*
    **
    **
    */
    public async getRaw() : Promise<any> {

        return await MariaDB.getRows(`SELECT * FROM ${this.table}`);
    }

    /*
    **
    **
    */
    public async select(conditions, singleResult: boolean = false, debug: boolean = false) : Promise<any> {

        const query = new MariaDBSimpleSelect(conditions, this.table, debug);
        
        const result = await query.send();

        if (singleResult)
            return result.length > 0 ? result[0] : null;
        else
            return result;
    }
}