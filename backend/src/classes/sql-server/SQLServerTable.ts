'use strict';

import { SQLServer, SQLServerQueryBinder} from '@src/classes';

export class SQLServerTable {

    constructor(public configName: string, public table: string) {
    }

    /*
    **
    **
    */
    public async insert(data: any) : Promise<number> {

        const binder = new SQLServerQueryBinder();

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
        const response = await SQLServer.exec(this.configName, query, binder.getParams());

        return response.insertId;
    }
    
    /*
    **
    **
    */
    public async getRaw() : Promise<any> {

        return await SQLServer.getRows(this.configName, `SELECT * FROM ${this.table}`);
    }
}