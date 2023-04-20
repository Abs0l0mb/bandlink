'use strict';

import {
    Listener,
    NetworkManager,
    Page,
    ClientLocation,
    Tools
} from '@src/components';

export interface RoutesConfig {
    [path: string]: any /* Page Constructor */
}

export class Router extends Listener {

    private routes: any = {};
    private path: string;
    private page: Page;
    private history: any[] = [];
    public params: any = {};
    
    constructor() {

        super();
        
        window.onpopstate = this.onPopState.bind(this);
    }

    /*
    **
    **
    */
    private async onPopState(event: Event) : Promise<void> {

        await this.route(null, false);
    }

    /*
    **
    **
    */
    public async setRoutes(routes: RoutesConfig) : Promise<void> {

        this.routes = routes;
    }

    /*
    **
    **
    */
    public async route(path: string | null = null, pushState: boolean = true) : Promise<void> {

        this.emit('beforeRoute', path);
        
        if (!path)
            path = location.pathname + location.search;

        if (path !== location.pathname)
            this.history.push(path);
        
        NetworkManager.clearPendingRequests();
    
        let pageConstructor = this.routes[path.split('?')[0]];

        if (!pageConstructor)
            throw new Error(`Unable to found a page constructor for the specified path ${path}`);
        
        if (pushState && path !== location.pathname)
            window.history.pushState({}, '', path); 

        if (this.page) {
            await this.page.onLeave();
            this.page.delete();
        }

        this.params = Router.getParams(path);
        this.path = path;
        this.page = new pageConstructor();

        ClientLocation.get().contentRoot.append(this.page);

        Tools.scrollTop();

        this.emit('route', path);
    }

    /*
    **
    **
    */
    public routeCurrentPath() : void {

        const currentPath = document.location.pathname;
        const currentPathWithQuery = document.location.pathname + document.location.search;

        for (let path of Object.keys(this.routes)) {
            if (path === currentPath) {
                this.route(currentPathWithQuery);
                return;
            }
        }

        this.route(Object.keys(this.routes)[0]);
    }

    /*
    **
    **
    */
    static getParams(url: string) : any {
        
        if (url.indexOf('?') === -1)
            return {};

        return url.split('?')[1].split("&").reduce(function(prev, curr, i, arr) {
            var p = curr.split("=");
            prev[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
            return prev;
        }, {});
    }
}