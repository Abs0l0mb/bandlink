'use strict';

import { sha256 } from 'js-sha256';
import { customAlphabet } from 'nanoid';

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

        return sha256(data);
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

        let alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-";

        return customAlphabet(alphabet, size)();
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
    static isMobile() : boolean {

        if ('ontouchstart' in window)
            return true;

        var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
        var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
        
        return window.matchMedia(query).matches;
    }

    /*
    **
    **
    */
    static getOffset(el) : any {

        let x = 0;
        let y = 0;

        while(el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            x += el.offsetLeft - el.scrollLeft;
            y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }

        return { 
            top: y, 
            left: x
        };
    }

    /*
    **
    **
    */
    static scrollTop() : void {

        if (window.scrollTo)
            window.scrollTo(0, 0);
        else
            document.documentElement.scrollTop = 0;
    }

    /*
    **
    **
    */
    static scrollBottom() : void {

        let scrollingElement = (document.scrollingElement || document.body);
        scrollingElement.scrollTop = scrollingElement.scrollHeight;
    }

    /*
    **
    **
    */
    static timeSince(date: Date) : string {

        let seconds = Math.floor((Date.now() - date.getTime()) / 1000);

        let interval = Math.floor(seconds / 31536000);
        if (interval > 1) 
            return interval + " années";
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) 
            return interval + " mois";
        interval = Math.floor(seconds / 86400);
        if (interval > 1) 
            return interval + " jours";
        interval = Math.floor(seconds / 3600);
        if (interval > 1) 
            return interval + " heures";
        interval = Math.floor(seconds / 60);
        if (interval > 1) 
            return interval + " minutes";
        
        let s = Math.floor(seconds);
        s = s < 0 ? 0 : s; 
        return s <= 1 ? s + " seconde" : s + " secondes";
    }

    /*
    **
    **
    */
    static getBase64FromFile(file: File) : Promise<string> {

        return new Promise(function(resolve, reject) {

            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function(event) {
                
                if (reader.result)
                    resolve(reader.result.toString().split('base64,')[1]);
                else
                    reject();
            };
        });
    }

    /*
    **
    **
    */
    static buildPath(path, params) : string {

        if (path.includes('?'))
            path.slice(path.indexOf('?') + 1);
    
        let str = '?';
        
        for (let key in params)
            str += `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}&`;
        
        if (str.length > 1)
            str = str.slice(0, -1);

        return path + str;
    }

    /*
    **
    **
    */
    static toInputDateFormat(date: Date) : string {

        return date.toISOString().split('T')[0];
    }

    /*
    **
    **
    */
    static base64ToBlob(b64Data, contentType='', sliceSize=512) {

        let byteCharacters = atob(b64Data);
        let byteArrays: any[] = [];
      
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {

            let slice = byteCharacters.slice(offset, offset + sliceSize);
        
            let byteNumbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i++)
                byteNumbers[i] = slice.charCodeAt(i);
        
            let byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }
      
        let blob = new Blob(byteArrays, {type: contentType});

        return blob;
    }
}