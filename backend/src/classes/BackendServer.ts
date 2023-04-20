'use strict';

import { 
    HttpServer,
    HttpCORSHandler,
    Sessions,
    PublicController,
    UserController
} from '@src/classes';

export class BackendServer extends HttpServer {

    constructor(private port: number) {

        super();

        new HttpCORSHandler(this)
            .enableFullAccess()
            .allowMethods([
                'OPTIONS',
                'GET',
                'POST'
            ])
            .allowHeaders([
                Sessions.SESSION_HEADER_NAME
            ])
            .allowResponseHeaders([
                Sessions.SESSION_HEADER_NAME
            ]);

        new PublicController(this);
        new UserController(this);

        this.listen(this.port);
    }
}