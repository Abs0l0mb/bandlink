'use strict';

import { 
    HttpRequest,
    HttpResponse,
    Tools,
    Parser,
    MariaDBTable,
    PublicError,
    Session,
    Users,
    User,
    AdminRights,
    Log,
    MariaDB,
    MariaDBQueryBinder
} from '@src/classes';

import * as ldap from 'ldapjs';

export class Sessions extends MariaDBTable {

    static SESSION_HEADER_NAME = 'x-stat';
    static SESSION_COOKIE_NAME = 'hifc-sid';

    constructor() {
        
        super('sessions');
    }

    /*
    **
    **
    */
    public async check(request: HttpRequest, expectedAdminRights: string[]) : Promise<Session | null> {

        const sessionHeaderHash = request.getHeader(Sessions.SESSION_HEADER_NAME);
        const sessionCookie = request.getCookie(Sessions.SESSION_COOKIE_NAME);
        const pua = request.getParsedUserAgent();
        const userAgentHash = Sessions.getSimplifiedUserAgentHash(pua);
        const url = request.getURL();
        const ip = request.getRemoteIp();
        
        let sessionData: any = await this.select({
            session_cookie: sessionCookie,
            user_agent_hash: userAgentHash
        }, true);

        if (!sessionData)
            return null;

        let session = new Session(sessionData.id, sessionData);

        if (sessionHeaderHash !== Tools.sha256(session.data.session_header))
            return null;

        let user = await session.getUser();

        if (!user)
            return null;

        let userAdminRights = await user.getAdminRights();

        for (let expectedAdminRight of expectedAdminRights) {
            if (!userAdminRights.includes(expectedAdminRight))
                return null;
        }

        request.session = session;
        request.user = user;

        await session.update({
            last_activity: url.pathname,
            last_ip: ip,
            browser_version: pua.browser.version
        });
        
        return session;
    }

    /*
    **
    **
    */
    public async login(request: HttpRequest, response: HttpResponse) : Promise<Session | null> {

        let params = await Parser.parse(request.getParameters(), {
            email: Parser.string,
            password: Parser.string
        }, true);

        const users = new Users();
        
        let userData = await users.select({
            email: params.email
        }, true);
        
        if (!userData)
            return null;

        const authCheck = await this.checkAuth(params.email, params.password);

        console.log(authCheck);

        if (!authCheck)
            return null;

        const user = new User(userData.id, userData);

        const sessionHeader = Tools.uid(128);
        const sessionCookie = Tools.uid(128);
        const pua = request.getParsedUserAgent();
        const userAgentHash = Sessions.getSimplifiedUserAgentHash(pua);
        const url = request.getURL();
        const ip = request.getRemoteIp();

        const data: any = {
            user_id: user.id,
            user_agent_hash: userAgentHash,
            session_header: sessionHeader,
            session_cookie: sessionCookie,
            last_activity: url.pathname,
            last_ip: ip,
            browser_name: pua.browser.name,
            browser_version: pua.browser.version,
            os_name: pua.os.name,
            os_version: pua.os.version,
            device_type: pua.device.type
        };

        await this.insert(data);
        
        let session = new Session(null, data);

        request.session = session;
        request.user = user;

        response.setHeader(Sessions.SESSION_HEADER_NAME, sessionHeader);
        
        response.setCookie({
            name: Sessions.SESSION_COOKIE_NAME, 
            value: sessionCookie,
            domain: url.hostname,
            path: '/',
            httpOnly: true, 
            expires: new Date(new Date().setFullYear(new Date().getFullYear() + 50)).toUTCString(),
            //sameSite: 'None',
            //secure: true
        });
        
        return session;
    }

    /*
    **
    **
    */
    static getSimplifiedUserAgentHash(pua: any) : string {

        return Tools.sha256(`${pua.device.type}_${pua.os.name}_${pua.os.version}_${pua.browser.name}`);
    }

    /*
    **
    **
    */
    private checkAuth(email: string, password: string) : Promise<boolean> {

        return new Promise(async (resolve) => {
        
            const binder = new MariaDBQueryBinder();

            const rows = await MariaDB.getRows(`
                SELECT *
                FROM users
                WHERE email = ${binder.addParam(email)}
                AND password = SHA2(${binder.addParam(password)}, 512)
            `, binder.getParams());

            console.log(rows, rows.length);

            if(rows.length <= 0) 
                resolve(false);

            resolve(true);
        });
    }

    //===========
    //MIDDLEWARES
    //===========

    /*
    **
    **
    */
    static async isConnected(request: HttpRequest, response: HttpResponse, next: () => void) : Promise<void> {

        let sessions = new Sessions();
        let session = await sessions.check(request, []);

        if (!session)
            throw new PublicError('unauthenticated');
        
        next();
    }

    /*
    **
    **
    */
    static async canAdminUsers(request: HttpRequest, response: HttpResponse, next: () => void) : Promise<void> {

        let sessions = new Sessions();
        let session = await sessions.check(request, [
            AdminRights.USERS
        ]);

        if (!session)
            throw new PublicError('access-denied@cannot-admin-users');
        
        next();
    }

    /*
    **
    **
    */
    static async canAdminAccessRights(request: HttpRequest, response: HttpResponse, next: () => void) : Promise<void> {

        let sessions = new Sessions();
        let session = await sessions.check(request, [
            AdminRights.ACCESS_RIGHTS
        ]);

        if (!session)
            throw new PublicError('access-denied@cannot-admin-pages');
        
        next();
    }

    /*
    **
    **
    */
    static async canAdminReports(request: HttpRequest, response: HttpResponse, next: () => void) : Promise<void> {

        let sessions = new Sessions();
        let session = await sessions.check(request, [
            AdminRights.REPORTS
        ]);

        if (!session)
            throw new PublicError('access-denied@cannot-admin-reports');
        
        next();
    }

    /*
    **
    **
    */
    static async canAdminReportLogs(request: HttpRequest, response: HttpResponse, next: () => void) : Promise<void> {

        let sessions = new Sessions();
        let session = await sessions.check(request, [
            AdminRights.REPORT_LOGS
        ]);

        if (!session)
            throw new PublicError('access-denied@cannot-admin-report-logs');
        
        next();
    }

    /*
    **
    **
    */
    static async canAdminPages(request: HttpRequest, response: HttpResponse, next: () => void) : Promise<void> {

        let sessions = new Sessions();
        let session = await sessions.check(request, [
            AdminRights.PAGES
        ]);

        if (!session)
            throw new PublicError('access-denied@cannot-admin-pages');
        
        next();
    }

    /*
    **
    **
    */
    static async canAdminHTMLContents(request: HttpRequest, response: HttpResponse, next: () => void) : Promise<void> {

        let sessions = new Sessions();
        let session = await sessions.check(request, [
            AdminRights.HTML_CONTENTS
        ]);

        if (!session)
            throw new PublicError('access-denied@cannot-admin-html-contents');
        
        next();
    }
}