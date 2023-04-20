'use strict';

import { Store, Parser, Log } from '@src/classes';

import * as driver from 'mariadb';

export class MariaDB {

    static POOL: driver.Pool;

    /*
    **
    **
    */
    static async getConfiguration() : Promise<any> {
        
        return await Parser.parse(await Store.get('mariadb'), {
            host: Parser.string,
            user: Parser.string,
            password: Parser.string,
            database: Parser.string,
            connectionLimit: Parser.integer
        });
    }

    /*
    **
    **
    */
    static async getPool() : Promise<driver.Pool> {

        if (MariaDB.POOL)
            return MariaDB.POOL;
        else {
            
            let pool: driver.Pool;

            pool = driver.createPool(await MariaDB.getConfiguration());

            MariaDB.POOL = pool;
            return pool;
        }
    }

    /*
    **
    **
    */
    static async exec(query: string, params: any = {}, debug?: boolean) : Promise<any> {

        if (debug) {
            console.log(`\n\x1b[33m${query}\x1b[0m\n`);
            console.log(`\n\x1b[33m${JSON.stringify(params)}\x1b[0m\n`);
        }

        let connection;

        try {

            let pool: driver.Pool;

            pool = await MariaDB.getPool();

            connection = await pool.getConnection();

            //https://mariadb.com/kb/en/connector-nodejs-promise-api/#query-options

            return await connection.query({
                namedPlaceholders: true, 
                sql: query
            }, params);
        }
        catch(error) {

            Log.red(query);
            Log.red(JSON.stringify(params));

            throw new Error(error.message);
        }
        finally {

            if (connection)
                connection.end();
        }
    }

    /*
    **
    **
    */
    static async getRows(query: string, params: any = {}, debug?: boolean) : Promise<any[]> {
        
        //https://mariadb.com/kb/en/connector-nodejs-promise-api/#array-result-sets
        return await MariaDB.exec(query, params, debug);
    }

    /*
    **
    **
    */
    static async getRow(query: string, params: any = {}, debug?: boolean) : Promise<any> {

        let rows = await MariaDB.getRows(query, params, debug);

        if (rows.length > 0)
            return rows[0];
        else    
            return {};
    }
}