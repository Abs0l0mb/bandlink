'use strict';

import {
    NetworkManager,
    ApiRequest
} from '@src/components';

export class Api {

    /*
    **
    **
    */
    static getBaseURL() : string {

        return `${location.protocol}//${location.hostname}:8001`;
    }

    /*
    **
    **
    */
    static get(endpoint: string, parameters: any = {}) : Promise<any> {

        return new Promise(function(resolve, reject) : any {
        
            let request = new ApiRequest({
                method: 'GET',
                url: Api.getBaseURL() + endpoint,
                parameters: Api.cleanParameters(parameters)
            });

            request.on('load', (data: any) => {
                NetworkManager.clearPendingRequest(request.id);
                resolve(data);
            });

            request.on('error', (data: any) => {
                NetworkManager.clearPendingRequest(request.id);
                reject(data);
            });
            
            NetworkManager.send(request);
        });
    }

    /*
    **
    **
    */
    static post(endpoint: string, parameters: any = {}) : Promise<any> {

        return new Promise(function(resolve, reject) {
        
            let request = new ApiRequest({
                method: 'POST',
                url: Api.getBaseURL() + endpoint,
                parameters: Api.cleanParameters(parameters)
            });

            request.on('load', (data: any) => {
                NetworkManager.clearPendingRequest(request.id);
                resolve(data);
            });

            request.on('error', (data: any) => {
                NetworkManager.clearPendingRequest(request.id);
                reject(data);
            });
            
            NetworkManager.send(request);
        });
    }

    /*
    **
    **
    */
    static cleanParameters(parameters: any) : any {

        if (typeof parameters !== 'object' || parameters === null)
            return parameters;

        for (let key in parameters) {
            if (parameters[key] === undefined)
                delete parameters[key];
        }

        return parameters;
    }
    
    /*
    **
    **
    */
    static isLocallyLoggedIn() : boolean {

        return !!localStorage.getItem('build');
    }

    /*
    **
    **
    */
    static clearAuth() : void {

        return localStorage.removeItem('build');
    }
};