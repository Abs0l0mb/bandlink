'use strict';

import {
    Div,
    ClientLocation,
    Tools
} from '@src/components';

export class ContextBox extends Div {

    protected closeZone: Div;
    protected box: Div;

    constructor(protected x: number, protected y: number) {
        
        super('context-box', ClientLocation.get().block);

        this.closeZone = new Div('close-zone', this).onNative('click', this.hide.bind(this));

        this.box = new Div('box', this).setStyles({
            left: '0px',
            top: '0px'
        });
    }

    /*
    **
    **
    */
    public async show() : Promise<void> {

        await Tools.sleep(50);
        
        let x = this.x;
        let y = this.y;

        if (x + this.box.element.offsetWidth >= document.body.scrollWidth)
            x -= this.box.element.offsetWidth;

        if (y + this.box.element.offsetHeight >= document.body.scrollHeight)
            y -= this.box.element.offsetHeight;
        
        console.log(this.x, this.y);
        console.log(x, y);

        this.box.setStyles({
            left: `${x}px`,
            top: `${y}px`
        });

        this.setData('displayed', 1);
    }

    /*
    **
    **
    */
    public async hide() : Promise<void> {

        this.emit('hide');
        
        this.setData('displayed', 0);

        await Tools.sleep(250);
        
        this.delete();
    }

    /*
    **
    **
    */
    public getBox() : Div {

        return this.box;
    }
}