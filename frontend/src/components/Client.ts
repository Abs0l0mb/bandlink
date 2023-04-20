'use strict';

import {
    Router,
    ApiAuth,
    FontManager,
    Block,
    Div,
    Tools,
    Listener,
    ClientLocation
} from '@src/components';

export interface ClientConfig {
    title?: string,
    fonts?: string[] 
};

export class Client extends Listener {
    
    public fontManager: FontManager;
    public title: string;
    public block: Block;
    public firstScreen: Block;
    public topContainer: Block;
    public contentRoot: Block;
    public router: Router;
    public auth: ApiAuth
    public visibilityChangeListener: any;
    public parameters: any;
    public localURLSCache: any = {};
    public dataCache: any = {};
    public tools: any = Tools;
    
    constructor(private config: ClientConfig) {

        super();

        let parametersElement = document.getElementById('parameters');
        if (parametersElement)
            this.parameters = JSON.parse(parametersElement.innerText);
        else
            this.parameters = {};

        document.addEventListener('DOMContentLoaded', this.onDOMContentLoaded.bind(this));
        document.addEventListener('click', this.onDOMClick.bind(this));

        ClientLocation.set(this);
    }

    /*
    **
    **
    */
    private async onDOMContentLoaded() : Promise<void> {

        await this.beforeInit();

        if (this.config.fonts) {

            this.fontManager = new FontManager(this.config.fonts);
            this.fontManager.on('load', this.init.bind(this));
        }
        else
            this.init();
    }

    /*
    **
    **
    */
    private async onDOMClick(event: MouseEvent) : Promise<void> {

        this.emit('document-click', {
            target: event.target,
            x: event.pageX,
            y: event.pageY
        });
    }

    /*
    **
    **
    */
    public async init() : Promise<void> {
        
        this.title = this.config.title ? this.config.title : '';

        document.addEventListener('scroll', this.onScroll.bind(this));
        window.addEventListener('resize', this.onResize.bind(this));
        this.initVisibilityChangeListener();
        this.onResize(new Event('fake-resize'));
    
        this.block = new Block(document.getElementById('app'));
        this.block.setData('mobile', Tools.isMobile() ? 1 : 0);

        this.firstScreen = new Block(document.getElementById('first-screen'));
        this.topContainer = new Div('top-container', this.block);      
        this.contentRoot = new Div('content-root', this.block);
        
        this.router = new Router();
        this.router.on('route', this.onRoute.bind(this));

        this.auth = new ApiAuth();
        this.auth.on('logged-in', this.loggedIn.bind(this));
        this.auth.on('logged-out', this.loggedOut.bind(this));
        await this.auth.check();

        this.afterInit();
    }

    /*
    **
    **
    */
    public ready() : void {

        this.block.setData('ready', 1);
    }
    
    /*
    **
    **
    */
    private initVisibilityChangeListener() : void {

        if (this.visibilityChangeListener)
            return;

        this.visibilityChangeListener = document.addEventListener('visibilitychange', this.onVisibilityChange.bind(this), false);
    }

    /*
    **
    **
    */
    private onVisibilityChange() : void {

        this.emit('visibilityChange', document.visibilityState === "visible");
    }

    /*
    **
    **
    */
    private onScroll(event): void {

        this.emit('scroll', event);
    }

    /*
    **
    **
    */
    private onResize(event) : void {

        this.emit('resize', event);
    }

    /*
    **
    **
    */
    private onRoute(path) : void {
        
        this.emit('route', path);
    }
    
    /*
    **
    **
    */
    private beforeInit() : void {
        
        this.emit('before-init');
    }

    /*
    **
    **
    */
    private afterInit() : void {
        
        this.emit('after-init');
    }

    /*
    **
    **
    */
    private loggedIn() : void {
        
        this.emit('logged-in');
    }

    /*
    **
    **
    */
    private loggedOut() : void {
        
        this.emit('logged-out');
    }

    /*
    **
    **
    */
    protected initialized() : void {

        this.emit('initialized');
    }
}