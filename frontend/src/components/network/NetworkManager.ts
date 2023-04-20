'use strict';

import { HttpRequest } from '@src/components';

export class NetworkManager {

    static pendingRequests: { [key: string]: HttpRequest } = {};

    static async send(request: HttpRequest) {
        
        NetworkManager.pendingRequests[request.id] = request;

        if (request.terminated)
            return;

        request.send();
    }

    /*
    **
    **
    */
    static clearPendingRequests() {

        Object.values(NetworkManager.pendingRequests).forEach(function(request) {
            request.abort();
        });
        
        NetworkManager.pendingRequests = {};
    }

    /*
    **
    **
    */
    static clearPendingRequest(id: string) {

        const pendingRequest = NetworkManager.pendingRequests[id]
        
        if (pendingRequest)
            pendingRequest.abort(); 
        
        delete NetworkManager.pendingRequests[id];
    }

    /*
    **
    **
    */
    static hasPendingRequests() {

        return Object.values(NetworkManager.pendingRequests).length > 0;
    }
};