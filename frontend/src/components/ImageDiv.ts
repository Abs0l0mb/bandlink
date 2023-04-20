'use strict';

import {
    Block,
    Div,
    ImageRequest
} from '@src/components';

export class ImageDiv extends Div {

    constructor(attributes: any, public url: string, parent: Block) {

        super(attributes, parent);
    
        this.addClass('image');

        let imageRequest = new ImageRequest(url);

        imageRequest.on('localURL', (url: string) => {
            
            this.setBackground(url);

            setTimeout(() => {
                this.setData('displayed', 1);
            }, 50);
        });

        imageRequest.send();
    }
}