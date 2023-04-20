'use strict';

const crypto = require('crypto');
const nanoid = require('nanoid');

export class Tools {

    /*
    **
    **
    */
    static getDecimal(number: number) : number {

        return parseInt((number % 1).toFixed(2).substring(2));
    }

    /*
    **
    **
    */
    static timestamp() : number {

        return Math.floor(Date.now() / 1000);
    }

    /*
    **
    **
    */
    static sha256(data: any) : string {

        return crypto.createHash('sha256').update(data).digest('hex');
    }

    /*
    **
    **
    */
    static isSha256(str: string) : boolean {

        return /^[0-9a-fA-F]{64}$/.test(str);
    }

    /*
    **
    **
    */
    static sleep(time: number) : Promise<void>{

        return new Promise(function (resolve) {
            setTimeout(resolve, time);
        });
    }
    
    /*
    **
    **
    */
    static removeFrom(array: any, value: any) : any {

        for (let i in array) {
            if (array[i] === value) {
                array.splice(i, 1);
                break;
            }
        }
    }

    /*
    **
    **
    */
    static uid(size = 32) : string {

        let alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        return nanoid.customAlphabet(alphabet, size)();
    }

    /*
    **
    **
    */
    static randBetween(min: number, max: number) : number {

        return Math.floor(Math.random()*(max-min+1)+min);
    }

    /*
    **
    **
    */
    static hex2bin(str: string) : string {

        return Buffer.from(str, 'hex').toString('utf8');
    }

    /*
    **
    **
    */
    static bin2hex(str: string) : string {

        return Buffer.from(str, 'utf8').toString('hex');
    }

    /*
    **
    **
    */
    static base64Encode(string: any) : string {
        
        return Buffer.from(string).toString('base64');
    }

    /*
    **
    **
    */
    static base64Decode(string: any) : string {
        
        return Buffer.from(string, 'base64').toString();
    }

    /*
    **
    **
    */
    static chunk(items: any[], size: number) : any[] {

        let chunks: any[] = []
        
        items = [].concat(...items);
      
        while (items.length)
            chunks.push(items.splice(0, size));
      
        return chunks;
    }
}