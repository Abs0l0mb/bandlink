'use strict';

import {
    Block,
    Div,
    Tools
} from '@src/components';

export class Footer extends Div {

    constructor(parent: Block) {
        
        super('footer', parent);

        this.draw();
    }

    /*
    **
    **
    */
    private async draw() : Promise<void> {
        
        const content = new Div('content', this);

        const flags = new Div('flags', content);

        new Div('flag flag-1', flags);
        new Div('flag flag-2', flags);
        new Div('flag flag-3', flags);
        new Div('flag flag-4', flags);
        new Div('flag flag-5', flags);
        new Div('flag flag-6', flags);
        new Div('flag flag-7', flags);
        new Div('flag flag-8', flags);
        new Div('flag flag-9', flags);
        new Div('flag flag-10', flags);
        new Div('flag flag-11', flags);
        new Div('flag flag-12', flags);
        new Div('flag flag-13', flags);
        new Div('flag flag-14', flags);
        new Div('flag flag-15', flags);
        new Div('flag flag-16', flags);
        new Div('flag flag-17', flags);
        new Div('flag flag-18', flags);
        new Div('flag flag-19', flags);
        new Div('flag flag-20', flags);
        new Div('flag flag-21', flags);
        new Div('flag flag-22', flags);
        new Div('flag flag-23', flags);
        new Div('flag flag-24', flags);
        new Div('flag flag-25', flags);
        new Div('flag flag-26', flags);

        new Div('copyright', content).write('© 2023 - European Space Agency');

        await Tools.sleep(50);
        this.setData('displayed', 1);
    }
}