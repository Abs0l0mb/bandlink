"use strict";

import { SQLServer, SQLServerQueryBinder } from '@src/classes';

export class SQLServerTableEntry {

    constructor(public configName: string, public table: string, public id: number | null, public data: any | null = null) {}

    /*
    **
    **
    */
    public isLoaded() : boolean {

        return !!this.data;
    }

    /*
    **
    **
    */
    public async load() : Promise<boolean> {

        if (!this.id)
            return false;

        const binder = new SQLServerQueryBinder();

        const query = `SELECT * FROM ${this.table} WHERE ID = ${binder.addParam(this.id)}`;

        const result = await SQLServer.getRows(this.configName, query, binder.getParams());

        if (Array.isArray(result) && result.length > 0) {
            this.data = result[0];
            return true;
        }
        else {
            this.data = null;
            return false;
        }
    }

    /*
    **
    **
    */
    public async update(data: any) : Promise<boolean>{
        
        if (!this.id)
            return false;

        const binder = new SQLServerQueryBinder();

        const columns: any = [];

        for (const key in data) {
            if (data[key] === undefined)
                delete data[key];
        }

        for (const column in data)
            columns.push([`${column} = ${binder.addParam(data[column])}`]);

        const query = `UPDATE ${this.table} SET ${columns.join(', ')} WHERE ID = ${binder.addParam(this.id)}`;

        await SQLServer.exec(this.configName, query, binder.getParams());

        for (const key in data)
            this.data[key] = data[key];

        return true;
    }

    /*
    **
    **
    */
    public async beforeDelete() : Promise<void> {}

    /*
    **
    **
    */
    public async delete() : Promise<void> {

        if (!this.id)
            return;

        await this.beforeDelete();

        const binder = new SQLServerQueryBinder();

        const query = `DELETE FROM ${this.table} WHERE ID = ${binder.addParam(this.id)}`;

        return SQLServer.exec(this.configName, query, binder.getParams());
    }
}