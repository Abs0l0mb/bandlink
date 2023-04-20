'use strict';

import {
    Page,
    Div,
    Tools
} from '@src/components';

export class TitledPage extends Page {

    private top: Div;
    private titleContainer: Div;
    public actions: Div;
    public content: Div;

    constructor(title?: string, extraClassName?: string) {

        super(title, extraClassName);

        this.top = new Div('page-top', this);

        this.titleContainer = new Div('title', this.top);
        
        if (title)
            this.setTitle(title);
            
        this.actions = new Div('actions', this.top);
        this.content = new Div('below-page-top-content', this);
    }

    /*
    **
    **
    */
    protected async setTitle(title: string) : Promise<void> {

        Page.setTitle(title);

        this.titleContainer.setData('displayed', 0);
        this.titleContainer.write(title);

        await Tools.sleep(50);

        this.titleContainer.setData('displayed', 1);
    }

    /*
    **
    **
    */
    public addTitleClass(className: string) {

        this.titleContainer.addClass(className);
    }
}