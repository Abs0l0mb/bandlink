'use strict';

import { MariaDB, MariaDBQueryBinder } from '@src/classes';

export class MariaDBSimpleSelect {
    
    constructor(private conditions: any, private from: string, private debug: boolean = false) {
    }

    /*
    **
    **
    */
    public async send() : Promise<any[]> {

        const binder = new MariaDBQueryBinder();

        const query = `SELECT * FROM ${this.from} ${this.getWhereClause(binder)}`;

        return await MariaDB.getRows(query, binder.getParams(), this.debug);
    }

    /*
    **
    **
    */
    private getWhereClause(binder: MariaDBQueryBinder) : string {

        const conditions: any = [];

        for (const column in this.conditions) {
            
            const value = this.conditions[column];
            
            if (value === null || value === 'NULL')
                conditions.push(`${column} IS NULL`);
            else if (value === 'NOT_NULL')
                conditions.push(`${column} IS NOT NULL`);
            else
                conditions.push(`${column} = ${binder.addParam(value)}`);
        }

        return `WHERE ${conditions.join(' AND ')}`;
    }
}