'use strict';

const fs = require('fs');

export class Store {

    static DATA: any = {};
    static DIRECTORY_PATH: string = `${process.cwd()}/src/store`; 

    static cache: any = {};

    /*
    **
    **
    */
    static getFilePath(key: string) : string {

        return `${Store.DIRECTORY_PATH}/${key}.json`;
    }

    /*
    **
    **
    */
    static async get(key: string) : Promise<any> {

        if (typeof Store.cache[key] === 'object')
            return Store.cache[key];
        else {

            let filePath = Store.getFilePath(key);
        
            if (!fs.existsSync(filePath))
                return null;
                
            let data = JSON.parse(fs.readFileSync(filePath).toString());
            
            Store.cache[key] = data;

            return data;
        }
    }

    /*
    **
    **
    */
    static async set(key: string, value: any) : Promise<void> {

        let filePath = Store.getFilePath(key);

        let data = JSON.stringify(value);

        fs.writeFileSync(filePath, data);

        Store.cache[key] = data;
    }
}