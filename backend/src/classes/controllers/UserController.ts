'use strict';

import {
    BackendServer,
    HttpRequest,
    HttpResponse,
    PublicError,
    Parser,
    Sessions,
    Session,
    Users,
    User,
    AdminRights,
    AdminRight,
    MariaDBTable
} from '@src/classes';

export class UserController {

    constructor(server: BackendServer) {

        server.get('/me', this.getMe, Sessions.isConnected);
        server.post('/me/update', this.updateMe, Sessions.isConnected);
        server.get('/me/sessions', this.getMySessions, Sessions.isConnected);
        server.post('/me/session/delete', this.deleteMySession, Sessions.isConnected);

        server.post('/logout', this.logout, Sessions.isConnected);
        
        server.get('/user', this.getUser, Sessions.canAdminUsers);
        server.get('/users', this.getUsers, Sessions.canAdminUsers);
        server.post('/user/add', this.addUser, Sessions.canAdminUsers);
        server.post('/user/update', this.updateUser, Sessions.canAdminUsers);
        server.post('/user/delete', this.deleteUser, Sessions.canAdminUsers);

        server.get('/user/sessions', this.getUserSessions, Sessions.canAdminUsers);
        server.post('/session/delete', this.deleteSession, Sessions.canAdminUsers);

        server.get('/admin-rights', this.getAdminRights, Sessions.canAdminUsers);
    }

    //==
    //ME
    //==

    /*
    **
    **
    */
    private async getMe(request: HttpRequest, response: HttpResponse) : Promise<void> {
        
        const user = new User(request.user.id);
        await user.load();

        if (!user.data)
            throw new Error('user-not-found');

        response.sendSuccessContent(await user.getData());
    }

    /*
    **
    **
    */
    private async updateMe(request: HttpRequest, response: HttpResponse) : Promise<void> {

        const params = await Parser.parse(request.getParameters(), {
            email: Parser.string
        }, true);
            
        if (params.email !== request.user.data.email) {

            const users = new Users();
            const userCheck = await users.select({
                email: params.email
            }, true);

            if (userCheck)
                throw new PublicError('email@user-already-exists');
        }

        await request.user.update(params);

        response.sendSuccessContent();
    }

    /*
    **
    **
    */
    private async getMySessions(request: HttpRequest, response: HttpResponse) : Promise<void> {

        response.sendSuccessContent(await request.user.getSessions());
    }

    /*
    **
    **
    */
    private async deleteMySession(request: HttpRequest, response: HttpResponse) : Promise<void> {

        const params = await Parser.parse(request.getParameters(), {
            id: Parser.integer,
        }, true);

        const session = new Session(params.id);

        await session.load();

        if (!session.data)
            throw new PublicError('session-not-found');

        if (session.data.user_id !== request.user.id)
            throw new PublicError('not-allowed');

        await session.delete();

        response.sendSuccessContent();
    }

    /*
    **
    **
    */
    private async logout(request: HttpRequest, response: HttpResponse) : Promise<void> {
        
        await request.session.delete();

        response.sendSuccessContent();
    }

    //====================
    //USERS ADMINISTRATION
    //====================

    /*
    **
    **
    */
    private async getUser(request: HttpRequest, response: HttpResponse) : Promise<void> {

        const params = await Parser.parse(request.getParameters(), {
            id: Parser.integer,
        }, true);

        const user = new User(params.id);

        await user.load();

        if (!user.data)
            throw new PublicError('user-not-found');

        response.sendSuccessContent(await user.getData());
    }

    /*
    **
    **
    */
    private async getUsers(request: HttpRequest, response: HttpResponse) : Promise<void> {

        const users = new Users();

        response.sendSuccessContent(await users.getList());
    }

    /*
    **
    **
    */
    private async addUser(request: HttpRequest, response: HttpResponse) : Promise<void> {

        const params = await Parser.parse(request.getParameters(), {
            email: Parser.email,
            password: Parser.password,
            adminRights: Parser.integerArray,
        }, true);

        const users = new Users();
        let user = await users.select({
            email: params.email
        }, true);

        if (user)
            throw new PublicError('email@user-already-exists');

        for (let id of params.adminRights) {
            const adminRight = new AdminRight(id);
            if (!(await adminRight.load()))
                throw new Error('admin-right-not-found');
        }

        const userData: any = {
            email: params.email,
            password: params.password
        };

        console.log('password:', params.password);
        /*
        await users.insert(userData);

        user = await users.select({
            email: params.email
        }, true);

        if (!user)
            throw new PublicError('user-creation-error');

        const userHasAdminRights = new MariaDBTable(Users.USER_HAS_ADMIN_RIGHTS_TABLE);

        for (let id of params.adminRights) {
            await userHasAdminRights.insert({
                user_id: user.id,
                admin_right_id: id
            });
        }
        */
        response.sendSuccessContent();
    }

    /*
    **
    **
    */
    private async updateUser(request: HttpRequest, response: HttpResponse) : Promise<void> {

        const params = await Parser.parse(request.getParameters(), {
            id: Parser.integer,
            email: Parser.email,
            adminRights: Parser.integerArray
        }, true);
        
        const user = new User(params.id);
        await user.load();

        if (!user.data)
            throw new PublicError('user-not-found');

        if (params.email !== user.data.email) {

            const users = new Users();
            const userCheck = await users.select({
                email: params.email
            }, true);

            if (userCheck)
                throw new PublicError('email@user-already-exists');
        }

        for (let id of params.adminRights) {
            const adminRight = new AdminRight(id);
            if (!(await adminRight.load()))
                throw new Error('admin-right-not-found');
        }

        await user.update({
            email: params.email
        });

        await user.resetAdminRights();

        const userHasAdminRights = new MariaDBTable(Users.USER_HAS_ADMIN_RIGHTS_TABLE);

        for (let id of params.adminRights) {
            await userHasAdminRights.insert({
                user_id: user.id,
                admin_right_id: id
            });
        }
        
        response.sendSuccessContent();
    }

    /*
    **
    **
    */
    private async deleteUser(request: HttpRequest, response: HttpResponse) : Promise<void> {

        const params = await Parser.parse(request.getParameters(), {
            id: Parser.integer,
        }, true);

        const user = new User(params.id);

        await user.load();

        if (!user.data)
            throw new PublicError('user-not-found');

       await user.delete();

       response.sendSuccessContent();
    }

    /*
    **
    **
    */
    private async getUserSessions(request: HttpRequest, response: HttpResponse) : Promise<void> {

        const params = await Parser.parse(request.getParameters(), {
            id: Parser.integer,
        }, true);

        const user = new User(params.id);

        await user.load();

        response.sendSuccessContent(await user.getSessions());
    }

    /*
    **
    **
    */
    private async deleteSession(request: HttpRequest, response: HttpResponse) : Promise<void> {

        const params = await Parser.parse(request.getParameters(), {
            id: Parser.integer,
        }, true);

        const session = new Session(params.id);

        await session.load();

        if (!session.data)
            throw new PublicError('session-not-found');

        await session.delete();

        response.sendSuccessContent();
    }

    /*
    **
    **
    */
    private async getAdminRights(request: HttpRequest, response: HttpResponse) : Promise<void> {

        const adminRights = new AdminRights();

        response.sendSuccessContent(await adminRights.getRaw());
    }
}