'use strict';

import {
    BackendServer,
    HttpRequest,
    HttpResponse,
    PublicError,
    Parser,
    Sessions,
    SQLServer
} from '@src/classes';

export class SystemHealthController {

    constructor(server: BackendServer) {

        server.get('/system-health/last-updates', this.getSystemHealth, Sessions.isConnected);
    }

    /*
    **
    **
    */
    private async getSystemHealth(request: HttpRequest, response: HttpResponse) : Promise<void> {

        const GHGEmissionsLastTime = (await SQLServer.getRow('cockpit', 'SELECT TOP 1 updated FROM GHGEmissions ORDER BY updated DESC')).updated;
        const TravelCostLastTime = (await SQLServer.getRow('cockpit', 'SELECT TOP 1 updated FROM TravelCost ORDER BY updated DESC')).updated;
        const AbsencePresenceLastTime = (await SQLServer.getRow('cockpit', 'SELECT TOP 1 updated FROM AbsencePresence ORDER BY updated DESC')).updated;
        const OfficeSpaceLastTime = (await SQLServer.getRow('cockpit', 'SELECT TOP 1 updated FROM OfficeSpace ORDER BY updated DESC')).updated;

        const status: any = {
            'GHG Emissions': GHGEmissionsLastTime ? GHGEmissionsLastTime : null,
            'Travel Cost': TravelCostLastTime ? TravelCostLastTime : null,
            'HR Space': AbsencePresenceLastTime ? AbsencePresenceLastTime : null,
            'Office Space': OfficeSpaceLastTime ? OfficeSpaceLastTime : null
        };

        response.sendSuccessContent(status);
    }
}