'use strict';

import {
    Client,
    AppBar,
    Footer,
    Api,
    Popup,
    Tools,
    DataProcessingPage
} from '@src/components';

import { 
    LoginPage, 
    MePage,
    EmbedPage,
    MyDashboardPage,
    AdminUsersPage,
    AdminReportsPage,
    AdminReportGroupsPage,
    AdminPagesPage,
    AdminAccessRightsPage,
    AdminReportLogsPage,
    AdminHTMLContentsPage
} from '@src/components';

new class extends Client {

    private loggedInFirstPath: string = '/me';
    private loggedInFirstPage: any = MePage;
    private offlinePopup: Popup | null;

    public PWAInstallEvent: any | null = null;
    public systemHealth: any = {};
    public appBar: AppBar;
    public footer: Footer;

    constructor() {

        super({
            title: 'Demo App',
            fonts: ['Inter:300,400,500,700,900']
        });

        this.on('before-init', this.onBeforeInit.bind(this));
        this.on('after-init', this.onAfterInit.bind(this));
        this.on('logged-in', this.onAuthState.bind(this));
        this.on('logged-out', this.onAuthState.bind(this));

        window.addEventListener("beforeinstallprompt", this.onPWABeforeInstallPrompt.bind(this));
    }

    /*
    **
    **
    */
    private async onBeforeInit() : Promise<void> {

        if ('serviceWorker' in navigator) {

            try {
                const nsw = navigator.serviceWorker;
                const serviceWorker = await nsw.register('/service-worker');
                console.log('Service Worker registered', serviceWorker);
            }
            catch(error) {
                console.log('Service Worker registration error', error);
            }
        }
    }

    /*
    **
    **
    */
    private async onAfterInit() : Promise<void> {

        this.appBar = new AppBar(this.topContainer);
        this.footer = new Footer(this.topContainer);
        
        this.checkConnectivity();
    }

    /*
    **
    **
    */
    private async onAuthState() : Promise<void> {

        if (this.auth.data.loggedIn)
            await this.onLoggedIn();
        else
            await this.onLoggedOut();
        
        this.initialized();
    }

    /*
    **
    **
    */
    private onLoggedOut() : void {

        this.router.setRoutes({
            '/': LoginPage
        });

        this.router.routeCurrentPath();
    }
    
    /*
    **
    **
    */
    private async onLoggedIn() : Promise<void> {

        await this.populateSystemHealth();
        await this.populateloggedInFirstPage();

        this.router.setRoutes({
            [this.loggedInFirstPath]: this.loggedInFirstPage,
            '/me': MePage,
            '/data-processing': DataProcessingPage,
            '/admin-users': AdminUsersPage
        });
        
        this.router.routeCurrentPath();
    }

    /*
    **
    **
    */
    public async populateloggedInFirstPage() : Promise<void> {

        try {

            this.loggedInFirstPath = `/admin-users`;
            this.loggedInFirstPage = EmbedPage;

        } catch(ignored) {}
    }

    /*
    **
    **
    */
    public routeToFirstPage() : void {

        if (this.router)
            this.router.route(this.loggedInFirstPath);
    }

    /*
    **
    **
    */
    public async populateSystemHealth() : Promise<void> {

        try {

            const lastUpdates = await Api.get('/system-health/last-updates');
            const downloadSpeedMBPS = await this.getDownloadSpeedMBPS();

            this.systemHealth = {
                score: 2,
                downloadSpeed: {
                    score: 2,
                    MBPS: downloadSpeedMBPS
                },
                lastUpdates: {}
            }

            if (downloadSpeedMBPS < 1) {
                this.systemHealth.score = 1;
                this.systemHealth.downloadSpeed.score = 1;
            }

            for (let key in lastUpdates) {

                const date = new Date(lastUpdates[key]);

                if (!date || new Date().getTime() / 1000 - date.getTime() / 1000 > 7 * 24 * 60 * 1000) {
                    this.systemHealth.score = 1;
                    this.systemHealth.lastUpdates[key] = {
                        score: 1,
                        date: date ? date : null
                    }
                }
                else {
                    this.systemHealth.lastUpdates[key] = {
                        score: 2,
                        date: date
                    }
                }
            }
        
        } catch (ignored) {}
    }

    /*
    **
    **
    */
    public async getDownloadSpeedMBPS() : Promise<number> {

        const start = Date.now();

        const request = new Request(`${Api.getBaseURL()}/random-hex`);
        const response = await fetch(request);
        const hex = await response.text();
        
        const duration = Date.now() - start;

        const bytesLength = hex.length;
        
        const seconds = duration / 1000;
        const MB = bytesLength / ( 1000 * 1000 );

        return parseFloat((MB/seconds).toFixed(2));
    }

    /*
    **
    **
    */
    public async checkConnectivity() : Promise<void> {

        if (!navigator.onLine && !this.offlinePopup) {

            this.offlinePopup = new Popup({
                title: 'Network error',
                message: "Check your internet connection to access the application",
                noButtons: true,
                notRemovable: true,
                ready: true
            });
        }
        else if (navigator.onLine && this.offlinePopup) {

            this.offlinePopup.hide();
            this.offlinePopup = null;
        }

        await Tools.sleep(3000);

        this.checkConnectivity();
    }

    /*
    **
    **
    */
    private onPWABeforeInstallPrompt(event: any /* Non-standard BeforeInstallPromptEvent */) : void {

        this.PWAInstallEvent = event;
        
        this.PWAInstallEvent.userChoice.then((choiceResult: any) => {
            if (choiceResult === undefined || choiceResult.outcome === "accepted") {
                this.PWAInstallEvent = null
                this.emit('pwa-installed');
            }
        });
    }

    /*
    **
    **
    */
    public arePWAAllFeaturesAvailable(): boolean {

        return !!(navigator.userAgent.match(/chrome|chromium|crios/i) || navigator.userAgent.match(/edg/i) || navigator.userAgent.match(/opr\//i));
    }

    /*
    **
    **
    */
    public isPWAInstalled(): boolean {

        return this.arePWAAllFeaturesAvailable() && !this.PWAInstallEvent;
    }
}