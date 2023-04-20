'use strict';

import {
    Block,
    Div
} from '@src/components';

export interface ButtonData {
    label: string;
    class?: string;
}

export class Button extends Div {

    constructor(public data: ButtonData, parent?: Block) {

        super('button-container', parent);

        if (this.data.class)
            this.addClass(this.data.class);
            
        new Block('button', {
            type: 'button'
        }, this).write(this.data.label);

        new Div('spinner', this);
    }

    /*
    **
    **
    */
    public load() : Button {

        this.setData('loading', 1);

        return this;
    }

    /*
    **
    **
    */
    public unload() : Button {

        this.setData('loading', 0);

        return this;
    }

    /*
    **
    **
    */
    public enable() : Button {

        this.setData('enabled', 1);

        return this;
    }

    /*
    **
    **
    */
    public disable() : Button {
        
       this.setData('enabled', 0);

       return this;
    }
}