'use strict';

import {
    Div,
    ClientLocation,
    Tools
} from '@src/components';

export class Page extends Div {

    public params: any;

    constructor(title?: string, extraClassName?: string) {

        if (title)
            Page.setTitle(title);
        
        let classNames = ['page'];
        if (extraClassName)
            classNames.push(extraClassName);
        
        super(classNames.join(' '));

        this.params = ClientLocation.get().router.params;

        setTimeout(function() {
            this.setData('state', 1);
        }.bind(this), 25);

        ClientLocation.get().ready();
    }

    /*
    **
    **
    */
    static setTitle(title: string) : void {

        let titleTag = document.getElementsByTagName('title')[0];

        if (!titleTag)
            return;
        
        title = title ? `${ClientLocation.get().title} - ${title}` : ClientLocation.get().title;

        titleTag.innerHTML = title;
    }

    /*
    **
    **
    */
    protected async onLeave() : Promise<void> {

        return new Promise(async function(resolve) {
            this.setData('state', 2);
            await Tools.sleep(180);
            resolve();
        }.bind(this));
    }
}