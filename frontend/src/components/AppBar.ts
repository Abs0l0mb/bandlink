'use strict';

import {
    Block, 
    Div,
    Api,
    Tools,
    ClientLocation,
    Button
} from '@src/components';

export class AppBar extends Div {

    private dynamicContainer: Div;
    private dynamicBackground: Div;
    private appLinksContainer: Div;
    private adminLinksContainer: Div;
    private username: Div;

    constructor(parent: Block) {
        
        super('app-bar', parent);

        this.drawDynamicContainer();
        this.drawMenu();
        this.drawTitle();
        this.drawUser();
        this.drawLogo();
        this.drawPWAInstallButton();

        ClientLocation.get().on('initialized', this.onClientInitialized.bind(this));
        ClientLocation.get().on('pwa-installed', this.onPWAInstalled.bind(this));

        setTimeout(function() {
            this.setData('displayed', 1);
        }.bind(this), 50);
    }

    /*
    **
    **
    */
    private onClientInitialized() : void {

        if (ClientLocation.get().auth.data.loggedIn)
            this.displayLoggedInUI();
        else
            this.displayLoggedOutUI();
    }

    /*
    **
    **
    */
    private async displayLoggedInUI() : Promise<void> {

        await this.populateMenu();
        this.populateUser();

        this.setNavigationAvailability(true);

        this.setMenuVisibility(false);
        this.setUserVisibility(false);
        this.setInstallButtonState();
    }
    
    /*
    **
    **
    */
    private displayLoggedOutUI() : void {

        this.setNavigationAvailability(false);
        
        this.setMenuVisibility(false);
        this.setUserVisibility(false);
        this.setInstallButtonState();
    }

    /*
    **
    **
    */
    private drawDynamicContainer() : void {

        this.dynamicContainer = new Div('dynamic-container', this);
        this.dynamicBackground = new Div('dynamic-background', this.dynamicContainer);

        this.dynamicBackground.onNative('click', () => {
            this.setMenuVisibility(false);
            this.setUserVisibility(false);
        });
    }

    /*
    **
    **
    */
    private drawMenu() : void {

        new Div('menu-button dynamic-button', this).onNative('click', () => {
            parseInt(this.getData('menu-displayed')) === 1 ? this.setMenuVisibility(false) : this.setMenuVisibility(true);
        });

        const menu = new Div('menu dynamic-box', this.dynamicContainer).onNative('click', () => {
            this.setMenuVisibility(false);
        });

        this.appLinksContainer = new Div('app-links', menu);
        this.adminLinksContainer = new Div('admin-links', menu);
    }

    /*
    **
    **
    */
    private drawTitle() : void {

        new Div('title', this).write(ClientLocation.get().title).onNative('click', ClientLocation.get().routeToFirstPage.bind(ClientLocation.get()));
    }

    /*
    **
    **
    */
    private drawUser() : void {

        new Div('user-button dynamic-button', this).onNative('click', () => {
            parseInt(this.getData('user-displayed')) === 1 ? this.setUserVisibility(false) : this.setUserVisibility(true);
        });

        const user = new Div('user dynamic-box', this.dynamicContainer);
        
        this.username = new Div('username', user)
        .onNative('click', () => {
            ClientLocation.get().router.route('/me');
            this.setUserVisibility(false);
        });

        const logoutButton = new Button({
            label: 'Log out'
        }, user).onNative('click', async () => {

            logoutButton.load();

            try {
                await Api.post('/logout');
                ClientLocation.get().auth.check();
                this.setUserVisibility(false);
                await Tools.sleep(500);
                logoutButton.unload();
            } catch(error) {
                logoutButton.unload();
                ClientLocation.get().auth.check();
            }
        });
    }

    /*
    **
    **
    */
    private drawLogo() : void {

        new Div('logo', this);
    }

    /*
    **
    **
    */
    private setNavigationAvailability(availability: boolean) : void {

        this.setData('navigation-available', availability ? 1 : 0);
    }
    
    /*
    **
    **
    */
    private setMenuVisibility(visibility: boolean) : void {

        this.setData('menu-displayed', visibility ? 1 : 0);
        this.setData('user-displayed', 0);
    }

    /*
    **
    **
    */
    private setUserVisibility(visibility: boolean) : void {

        this.setData('menu-displayed', 0);
        this.setData('user-displayed', visibility ? 1 : 0);
    }

    /*
    **
    **
    */
    private async populateMenu() : Promise<void> {

        this.appLinksContainer.empty();
        this.adminLinksContainer.empty();

        const heads: Div[] = [];
        const subMenus: Div[] = [];
        const timeouts: any[] = [];

        new Div('menu-link', this.adminLinksContainer).write('Data processing').onNative('click', () => { ClientLocation.get().router.route('/data-processing'); });

        if (ClientLocation.get().auth.data?.adminRights.includes('USERS'))
            new Div('menu-link', this.adminLinksContainer).write('Users').onNative('click', () => { ClientLocation.get().router.route('/admin-users'); });

    }
    
    /*
    **
    **
    */
    private getEmbededReportsPagePath(pageData: any) : string {

        return `/embed?page=${pageData.id}`;
    }

    /*
    **
    **
    */
    private populateUser() : void {

        this.username.write(ClientLocation.get().auth.data?.email);
    }

    /*
    **
    **
    */
    private drawPWAInstallButton() : void {
        
        new Div('pwa-install-button dynamic-button', this).onNative('click', () => {
            if (ClientLocation.get().PWAInstallEvent)
                ClientLocation.get().PWAInstallEvent.prompt();
        });
    }

    /*
    **
    **
    */
    private setInstallButtonState() : void {
        
        this.setData('pwa-features', ClientLocation.get().arePWAAllFeaturesAvailable() ? 1 : 0);
        this.setData('pwa-installed', ClientLocation.get().isPWAInstalled() ? 1 : 0);
    }

    /*
    **
    **
    */
    private onPWAInstalled() : void {

        this.setInstallButtonState();
    }
}