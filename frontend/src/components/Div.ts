'use strict';

import { Block } from '@src/components';

export class Div extends Block {

    constructor(attributes?: any, parent?: Block) {
        
        super('div', attributes, parent);
    }
}