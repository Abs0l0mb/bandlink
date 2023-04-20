'use strict';

import { Store, Parser, Log } from '@src/classes';

import * as driver from 'mssql';

export interface Pools {[configName: string]: driver.ConnectionPool};

export class SQLServer {

    static POOLS: Pools = {};

    /*
    **
    **
    */
    static async getConfiguration(name: string) : Promise<any> {
        
        return await Parser.parse(await Store.get(name), {
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
    static async getPool(configName: string) : Promise<driver.ConnectionPool> {

        if (!SQLServer.POOLS[configName]) {
            
            const config = await SQLServer.getConfiguration(configName);

            const pool: driver.ConnectionPool = await new driver.ConnectionPool({
                user: config.user,
                password: config.password,
                server: config.host,
                database: config.database,
                pool: {
                    max: config.connectionLimit,
                    min: 0,
                    idleTimeoutMillis: 30000
                },
                options: {
                    trustServerCertificate: true
                }
            });

            pool.close = (...args) => {
                delete SQLServer.POOLS[configName];
                return pool.close.bind(pool)(...args);
            };

            SQLServer.POOLS[configName] = pool;
        }

        return SQLServer.POOLS[configName];
    }

    /*
    **
    **
    */
    static async exec(configName: string, query: string, params: any = {}, debug?: boolean) : Promise<any> {

        if (debug) {
            console.log(`\n\x1b[33m${query}\x1b[0m\n`);
            console.log(`\n\x1b[33m${JSON.stringify(params)}\x1b[0m\n`);
        }

        let connection;

        try {

            const pool: driver.ConnectionPool = await SQLServer.getPool(configName);

            const preparedStatment = new driver.PreparedStatement(await pool.connect());

            for (let key in params) {

                const value = params[key];

                if (typeof value === 'string')
                    preparedStatment.input(key, driver.NVarChar);
                else if (typeof value === 'number')
                    preparedStatment.input(key, driver.Numeric);
                else if (value instanceof Date)
                    preparedStatment.input(key, driver.Date);
            }

            return await new Promise((resolve, reject) => {

                preparedStatment.prepare(query, error => {
                    
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }

                    preparedStatment.execute(params, (error, result) => {

                        if (error)
                            return reject(error);

                        preparedStatment.unprepare();

                        resolve(result);
                    });
                });
            });
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
    static async getRows(configName: string, query: string, params: any = {}, debug?: boolean) : Promise<any[]> {
        
        return (await SQLServer.exec(configName, query, params, debug)).recordset;
    }

    /*
    **
    **
    */
    static async getRow(configName: string, query: string, params: any = {}, debug?: boolean) : Promise<any> {

        let rows = await SQLServer.getRows(configName, query, params, debug);

        if (rows.length > 0)
            return rows[0];
        else
            return {};
    }
}